'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import {
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  renameConversation,
  deleteConversation,
  Conversation,
  Message
} from '../../services/chatService';

const SUGGESTED_PROMPTS = [
  "Rencanakan liburan keluarga 5 hari ke Jepang mulai dari Tokyo.",
  "Apa rekomendasi wisata hidden gem dan kuliner autentik di Yogyakarta?",
  "Bantu buatkan estimasi budget dan itinerary 3 hari santai di Bali.",
  "Tips persiapan dan rekomendasi rute backpacking ke Labuan Bajo."
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // UX State
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Rename modal / inline edit state (Bonus Challenge)
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [renamingLoading, setRenamingLoading] = useState(false);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * UX Feature 2: Auto-scroll to latest message
   * Handles two main scenarios:
   * 1. Initial load / switching conversations
   * 2. Sending a new message or receiving AI reply
   */
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  // Scroll to bottom whenever messages list changes or AI starts typing
  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isAiTyping]);

  // Load conversations on mount
  useEffect(() => {
    loadConversationList();
  }, []);

  const loadConversationList = async (selectId?: number) => {
    setLoadingConversations(true);
    setAuthError(null);
    try {
      const data = await getConversations();
      setConversations(data);

      if (data.length > 0) {
        const target = selectId 
          ? data.find(c => c.id === selectId) || data[0]
          : data[0];
        selectConversation(target.id);
      } else {
        // Automatically initialize the first conversation if none exists
        handleCreateNewConversation("Percakapan Baru", false);
      }
    } catch (err: any) {
      console.warn("Failed to load conversations:", err);
      if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        setAuthError("Silakan masuk terlebih dahulu untuk mengaktifkan riwayat percakapan memori.");
      }
    } finally {
      setLoadingConversations(false);
    }
  };

  const selectConversation = async (id: number) => {
    setLoadingMessages(true);
    try {
      const conv = await getConversation(id);
      setCurrentConversation(conv);
      setMessages(conv.messages || []);
      setSidebarOpen(false); // Close mobile drawer on selection
      // UX Feature 2 Scenario A: Auto-scroll to bottom on initial conversation load
      setTimeout(() => scrollToBottom('auto'), 50);
    } catch (err: any) {
      console.error("Failed to fetch conversation details:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCreateNewConversation = async (title?: string, autoSelect = true): Promise<Conversation | null> => {
    try {
      const created = await createConversation(title || "Percakapan Baru");
      setConversations(prev => [created, ...prev.filter(c => c.id !== created.id)]);
      if (autoSelect) {
        setCurrentConversation(created);
        setMessages([]);
        setSidebarOpen(false);
      }
      return created;
    } catch (err: any) {
      console.error("Failed to create conversation:", err);
      return null;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const content = textToSend || inputMessage;
    if (!content.trim() || isAiTyping) return;

    let targetConv: Conversation | null = currentConversation;

    // If no active conversation, create one first
    if (!targetConv) {
      targetConv = await handleCreateNewConversation(content.slice(0, 30));
      if (!targetConv) return;
    }

    // Append user message optimistically
    const optimisticUserMsg: Message = {
      id: Date.now(),
      conversation_id: targetConv.id,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticUserMsg]);
    setInputMessage('');
    
    // UX Feature 3: Set typing indicator to true
    setIsAiTyping(true);

    try {
      const aiReply = await sendMessage(targetConv.id, content.trim());
      
      // Update message thread with server response
      setMessages(prev => {
        // Replace optimistic or append
        return [...prev, aiReply];
      });

      // Update conversation title in list if changed
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetConv!.id) {
            return {
              ...c,
              title: c.title === "Percakapan Baru" ? content.slice(0, 35) : c.title
            };
          }
          return c;
        })
      );

      if (currentConversation && currentConversation.title === "Percakapan Baru") {
        setCurrentConversation(prev => prev ? { ...prev, title: content.slice(0, 35) } : null);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      // Append fallback error message from assistant
      const errorMsg: Message = {
        id: Date.now() + 1,
        conversation_id: targetConv.id,
        role: 'assistant',
        content: `Maaf, terjadi kendala saat menghubungi AI: ${err.message || 'Koneksi terputus'}. Silakan coba kembali.`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      // UX Feature 3: Turn off typing indicator
      setIsAiTyping(false);
    }
  };

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentConversation || !newTitle.trim()) return;

    setRenamingLoading(true);
    try {
      const updated = await renameConversation(currentConversation.id, newTitle.trim());
      setCurrentConversation(prev => prev ? { ...prev, title: updated.title } : null);
      setConversations(prev =>
        prev.map(c => c.id === updated.id ? { ...c, title: updated.title } : c)
      );
      setIsRenaming(false);
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    } finally {
      setRenamingLoading(false);
    }
  };

  const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Apakah Anda yakin ingin menghapus percakapan ini?")) return;

    try {
      await deleteConversation(id);
      const remaining = conversations.filter(c => c.id !== id);
      setConversations(remaining);
      if (currentConversation?.id === id) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          setCurrentConversation(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  /**
   * UX Feature 4: Timestamp for each message
   * Formats ISO timestamp cleanly into 24-hour time or local date format
   */
  const formatTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '';
    }
  };

  const formatDateLabel = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <main className="bg-[#F4EFE6] min-h-screen pt-20 pb-6 px-3 sm:px-6 lg:px-8 font-sans text-[#1A1612]">
      <div className="max-w-7xl mx-auto h-[calc(100vh-6.5rem)] flex flex-col">
        
        {/* Auth notification if unauthenticated */}
        {authError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl mb-3 flex items-center justify-between text-xs sm:text-sm shadow-sm">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-amber-600"></i>
              <span>{authError}</span>
            </div>
            <Link 
              href="/login" 
              className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-3 py-1 rounded-lg font-semibold text-xs transition-colors"
            >
              Masuk
            </Link>
          </div>
        )}

        {/* Main Chat Layout Frame */}
        <div className="flex-1 bg-white border border-[#1A1612]/10 rounded-3xl shadow-[0_15px_35px_rgba(26,22,18,0.05)] overflow-hidden flex relative">
          
          {/* ============================================================ */}
          {/* SIDEBAR: Conversation List (Slide 13 & 16 Core Challenge)    */}
          {/* ============================================================ */}
          <aside
            className={`
              absolute lg:static inset-y-0 left-0 z-30
              w-72 sm:w-80 bg-[#FDFCFA] border-r border-[#1A1612]/10
              flex flex-col transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[#1A1612]/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center text-sm font-bold">
                  <i className="fa-solid fa-comments"></i>
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm text-[#1A1612]">Percakapan</h2>
                  <p className="text-[11px] text-[#6B5D4F]">Riwayat Memori AI</p>
                </div>
              </div>

              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[#6B5D4F] hover:text-[#1A1612] p-1.5"
                title="Tutup menu"
              >
                <i className="fa-solid fa-xmark text-base"></i>
              </button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
              <button
                onClick={() => handleCreateNewConversation("Percakapan Baru", true)}
                className="w-full bg-[#E85D2F] hover:bg-[#C8431C] text-white font-semibold text-xs sm:text-sm py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_12px_rgba(232,93,47,0.25)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                <span>Percakapan Baru</span>
              </button>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1.5 py-1">
              {loadingConversations ? (
                <div className="p-4 text-center text-xs text-[#6B5D4F] space-y-2">
                  <i className="fa-solid fa-circle-notch fa-spin text-lg text-[#E85D2F]"></i>
                  <p>Memuat riwayat...</p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#6B5D4F]">
                  <i className="fa-regular fa-comment-dots text-3xl mb-2 opacity-40"></i>
                  <p>Belum ada percakapan.</p>
                  <p className="text-[11px] mt-1 opacity-70">Mulai chat untuk menyimpan memori!</p>
                </div>
              ) : (
                conversations.map(conv => {
                  const isActive = currentConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className={`
                        group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all text-left
                        ${isActive
                          ? 'bg-[#E85D2F]/10 border border-[#E85D2F]/30 text-[#1A1612] shadow-sm'
                          : 'hover:bg-[#1A1612]/5 text-[#6B5D4F] border border-transparent'
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#E85D2F]' : 'text-[#1A1612]'}`}>
                          {conv.title || "Percakapan Baru"}
                        </p>
                        <p className="text-[10px] text-[#6B5D4F]/70 mt-0.5">
                          {formatDateLabel(conv.created_at)}
                        </p>
                      </div>

                      {/* Actions: Rename & Delete */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentConversation(conv);
                            setNewTitle(conv.title);
                            setIsRenaming(true);
                          }}
                          title="Ubah judul percakapan"
                          className="p-1.5 text-[#6B5D4F] hover:text-[#E85D2F] rounded-lg hover:bg-white transition-colors"
                        >
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          title="Hapus percakapan"
                          className="p-1.5 text-[#6B5D4F] hover:text-red-600 rounded-lg hover:bg-white transition-colors"
                        >
                          <i className="fa-regular fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer Info */}
            <div className="p-3 border-t border-[#1A1612]/5 text-center text-[10px] text-[#6B5D4F]/80">
              <span className="inline-flex items-center gap-1">
                <i className="fa-solid fa-shield-halved text-[#0E4F4A]"></i>
                <span>Multi-turn Stateful Memory Active</span>
              </span>
            </div>
          </aside>

          {/* Mobile Overlay backdrop */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 z-20 backdrop-blur-xs"
            />
          )}

          {/* ============================================================ */}
          {/* MAIN CHAT PANEL                                              */}
          {/* ============================================================ */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8] relative">
            
            {/* ---------------------------------------------------------- */}
            {/* UX Feature 1: Conversation Title in Chat Header            */}
            {/* ---------------------------------------------------------- */}
            <header className="px-4 sm:px-6 py-3.5 bg-white border-b border-[#1A1612]/5 flex items-center justify-between z-10 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                {/* Mobile sidebar toggle button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-[#6B5D4F] hover:text-[#1A1612] rounded-xl hover:bg-[#F4EFE6] transition-colors"
                  title="Buka menu percakapan"
                >
                  <i className="fa-solid fa-bars-staggered text-sm"></i>
                </button>

                {/* Conversation Title & Rename action */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 
                      id="conversation-title"
                      className="font-display font-bold text-base sm:text-lg text-[#1A1612] truncate"
                      title={currentConversation?.title || "Percakapan Baru"}
                    >
                      {currentConversation?.title || "Percakapan Baru"}
                    </h1>
                    
                    {currentConversation && (
                      <button
                        onClick={() => {
                          setNewTitle(currentConversation.title);
                          setIsRenaming(true);
                        }}
                        className="text-[#6B5D4F] hover:text-[#E85D2F] p-1 rounded-md transition-colors text-xs"
                        title="Ubah judul percakapan"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6B5D4F]">
                    <span className="flex items-center gap-1 text-[#0E4F4A] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>Amazon Bedrock Converse</span>
                    </span>
                    <span>•</span>
                    <span>Context-Aware</span>
                  </div>
                </div>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCreateNewConversation("Percakapan Baru", true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#1A1612]/10 hover:border-[#E85D2F] hover:text-[#E85D2F] transition-all bg-white shadow-xs"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>New Chat</span>
                </button>

                <Link
                  href="/assistant"
                  className="text-xs font-medium text-[#6B5D4F] hover:text-[#E85D2F] px-2.5 py-1.5 rounded-full hover:bg-[#F4EFE6] transition-colors flex items-center gap-1"
                  title="Buka RAG Knowledge Base"
                >
                  <i className="fa-solid fa-sparkles text-[10px] text-[#E85D2F]"></i>
                  <span className="hidden md:inline">RAG Docs</span>
                </Link>
              </div>
            </header>

            {/* ---------------------------------------------------------- */}
            {/* CHAT MESSAGES FEED (Scrollable Container)                 */}
            {/* ---------------------------------------------------------- */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {loadingMessages ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#6B5D4F] space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center text-lg animate-pulse">
                    <i className="fa-solid fa-brain fa-spin"></i>
                  </div>
                  <p className="text-sm font-semibold">Memuat riwayat pesan...</p>
                </div>
              ) : messages.length === 0 ? (
                /* Empty Chat Starter State */
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8 max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E85D2F] to-[#D4A24C] text-white flex items-center justify-center text-2xl shadow-[0_10px_25px_rgba(232,93,47,0.3)] mb-4 animate-float">
                    <i className="fa-solid fa-compass"></i>
                  </div>
                  
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-[#1A1612] mb-2">
                    KelanaAI Conversational Memory
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#6B5D4F] mb-6 leading-relaxed">
                    Ajukan pertanyaan perjalanan Anda. KelanaAI mengingat konteks percakapan sebelumnya sehingga Anda dapat mengajukan pertanyaan lanjutan seperti <em>"Bagaimana dengan Hari ke-2?"</em> secara alami!
                  </p>

                  <div className="w-full space-y-2 text-left">
                    <p className="text-[11px] font-bold text-[#6B5D4F] uppercase tracking-wider px-1">
                      Coba Pertanyaan Contoh:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="p-3 bg-white hover:bg-[#F4EFE6] border border-[#1A1612]/10 hover:border-[#E85D2F] rounded-2xl text-xs font-medium text-[#1A1612] text-left transition-all shadow-xs hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-start gap-2"
                        >
                          <i className="fa-solid fa-arrow-right text-[10px] text-[#E85D2F] mt-1 shrink-0"></i>
                          <span>{prompt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Render Messages */
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`
                          w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-xs
                          ${isUser 
                            ? 'bg-[#1A1612] text-white' 
                            : 'bg-[#0E4F4A] text-white'
                          }
                        `}
                      >
                        {isUser ? (
                          <i className="fa-solid fa-user"></i>
                        ) : (
                          <i className="fa-solid fa-sparkles text-[11px] text-[#D4A24C]"></i>
                        )}
                      </div>

                      {/* Bubble with Content & UX Feature 4: Timestamp */}
                      <div className="flex flex-col min-w-0">
                        <div
                          className={`
                            px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs
                            ${isUser
                              ? 'bg-[#E85D2F] text-white rounded-tr-none'
                              : 'bg-white border border-[#1A1612]/10 text-[#1A1612] rounded-tl-none shadow-[0_4px_16px_rgba(26,22,18,0.03)]'
                            }
                          `}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                          ) : (
                            <div className="prose prose-sm max-w-none text-[#1A1612] prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[#1A1612] prose-headings:mb-2 prose-headings:mt-4 prose-strong:text-[#1A1612] prose-ul:my-2 prose-li:my-0.5">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                          )}
                        </div>

                        {/* UX Feature 4: Timestamp for each message */}
                        <span
                          className={`
                            text-[10px] mt-1 px-1 text-[#6B5D4F]/70 font-mono
                            ${isUser ? 'text-right' : 'text-left'}
                          `}
                        >
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}

              {/* -------------------------------------------------------- */}
              {/* UX Feature 3: Typing Indicator                           */}
              {/* -------------------------------------------------------- */}
              {isAiTyping && (
                <div className="flex gap-3 max-w-xl mr-auto animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-[#0E4F4A] text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                    <i className="fa-solid fa-sparkles text-[11px] text-[#D4A24C]"></i>
                  </div>
                  <div className="bg-white border border-[#1A1612]/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#E85D2F] animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#E85D2F] animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#E85D2F] animate-bounce"></span>
                      </div>
                      <span className="text-xs text-[#6B5D4F] font-medium ml-1">
                        KelanaAI sedang merangkai jawaban...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-scroll anchor target (UX Feature 2) */}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* BOTTOM INPUT BAR                                           */}
            {/* ---------------------------------------------------------- */}
            <div className="p-3 sm:p-4 bg-white border-t border-[#1A1612]/5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="max-w-4xl mx-auto flex items-center gap-2 bg-[#F4EFE6] p-1.5 sm:p-2 rounded-2xl border border-[#1A1612]/10 focus-within:border-[#E85D2F] focus-within:ring-4 focus-within:ring-[#E85D2F]/10 transition-all shadow-inner"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pesan atau pertanyaan lanjutan... (mis: 'Bagaimana dengan hari ke-2?')"
                  disabled={isAiTyping}
                  className="flex-1 bg-transparent px-3 py-2 outline-none text-xs sm:text-sm font-medium text-[#1A1612] placeholder-[#6B5D4F]/60"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiTyping}
                  className="bg-[#E85D2F] hover:bg-[#C8431C] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(232,93,47,0.2)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shrink-0 cursor-pointer"
                  title="Kirim pesan"
                >
                  <span className="hidden sm:inline">Kirim</span>
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </form>

              <p className="text-[10px] text-center text-[#6B5D4F]/70 mt-2">
                KelanaAI Session 10 — Large Language Models maintain memory via application database context.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* RENAME CONVERSATION MODAL (Session 10 Bonus Challenge)        */}
      {/* ============================================================ */}
      {isRenaming && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#1A1612]/10 animate-fade-in">
            <h3 className="font-display font-bold text-lg text-[#1A1612] mb-1">
              Ubah Judul Percakapan
            </h3>
            <p className="text-xs text-[#6B5D4F] mb-4">
              Berikan nama yang mudah diingat untuk percakapan ini.
            </p>

            <form onSubmit={handleRenameSubmit}>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Japan Family Trip"
                required
                autoFocus
                className="w-full bg-[#F4EFE6] border border-[#1A1612]/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#E85D2F] focus:ring-2 focus:ring-[#E85D2F]/10 mb-4"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRenaming(false)}
                  disabled={renamingLoading}
                  className="px-4 py-2 text-xs font-semibold text-[#6B5D4F] hover:text-[#1A1612] rounded-xl hover:bg-[#F4EFE6] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={renamingLoading || !newTitle.trim()}
                  className="bg-[#E85D2F] hover:bg-[#C8431C] disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  {renamingLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
