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
  {
    category: "Itinerary",
    icon: "fa-solid fa-map-location-dot",
    text: "Rencanakan liburan keluarga 5 hari ke Jepang mulai dari Tokyo & Kyoto."
  },
  {
    category: "Kuliner",
    icon: "fa-solid fa-bowl-food",
    text: "Rekomendasi wisata kuliner autentik & legendaris di Yogyakarta."
  },
  {
    category: "Budget",
    icon: "fa-solid fa-wallet",
    text: "Bantu buatkan estimasi budget & itinerary 3 hari santai di Bali."
  },
  {
    category: "Petualangan",
    icon: "fa-solid fa-person-hiking",
    text: "Tips persiapan dan rekomendasi rute backpacking ke Labuan Bajo & Komodo."
  }
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UX State
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Custom Rename Modal state (Session 10 Bonus Challenge)
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [renamingLoading, setRenamingLoading] = useState(false);

  // Custom Delete Confirmation Modal state (Replaces ugly browser default confirm)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [convToDelete, setConvToDelete] = useState<Conversation | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Auto-scroll ref (UX Feature 2)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  /**
   * UX Feature 2: Auto-scroll to latest message
   * Scenario A: On initial conversation switch
   * Scenario B: When new message is sent or AI response arrives
   */
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isAiTyping]);

  // Load user profile & conversations on mount
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(userData => { if (userData) setCurrentUser(userData); })
      .catch(err => console.warn("Failed to fetch user in chat:", err));
    }
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
        if (typeof window !== 'undefined' && localStorage.getItem('token')) {
          handleCreateNewConversation("Percakapan Baru", false);
        }
      }
    } catch (err: any) {
      console.warn("Failed to load conversations:", err);
      if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
        setAuthError("Silakan masuk terlebih dahulu untuk mengaktifkan riwayat memori percakapan.");
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
      setSidebarOpen(false);
      // UX Feature 2 Scenario A: Auto-scroll to bottom on opening
      setTimeout(() => scrollToBottom('auto'), 60);
    } catch (err: any) {
      console.error("Failed to fetch conversation details:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCreateNewConversation = async (title?: string, autoSelect = true): Promise<Conversation | null> => {
    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      setAuthError("Silakan masuk terlebih dahulu untuk membuat percakapan baru.");
      return null;
    }

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

    if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
      setAuthError("Silakan masuk terlebih dahulu untuk mengirim pesan dan menyimpan riwayat percakapan.");
      return;
    }

    let targetConv: Conversation | null = currentConversation;

    if (!targetConv) {
      targetConv = await handleCreateNewConversation(content.slice(0, 30));
      if (!targetConv) return;
    }

    // UX Feature 4: Optimistic user message with timestamp
    const optimisticUserMsg: Message = {
      id: Date.now(),
      conversation_id: targetConv.id,
      role: 'user',
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticUserMsg]);
    setInputMessage('');
    
    // UX Feature 3: Activate typing indicator
    setIsAiTyping(true);

    try {
      const aiReply = await sendMessage(targetConv.id, content.trim());
      
      setMessages(prev => [...prev, aiReply]);

      // Auto update conversation title in list if default
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetConv!.id) {
            return {
              ...c,
              title: (c.title === "Percakapan Baru" || !c.title) ? content.slice(0, 35) : c.title
            };
          }
          return c;
        })
      );

      if (currentConversation && (currentConversation.title === "Percakapan Baru" || !currentConversation.title)) {
        setCurrentConversation(prev => prev ? { ...prev, title: content.slice(0, 35) } : null);
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      const errorMsg: Message = {
        id: Date.now() + 1,
        conversation_id: targetConv.id,
        role: 'assistant',
        content: `Terjadi kendala saat menghubungi AI: ${err.message || 'Koneksi terputus'}. Silakan coba lagi.`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      // UX Feature 3: Deactivate typing indicator
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

  const promptDeleteConversation = (conv: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setConvToDelete(conv);
    setDeleteModalOpen(true);
  };

  const confirmDeleteConversation = async () => {
    if (!convToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteConversation(convToDelete.id);
      const remaining = conversations.filter(c => c.id !== convToDelete.id);
      setConversations(remaining);
      if (currentConversation?.id === convToDelete.id) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          setCurrentConversation(null);
          setMessages([]);
        }
      }
      setDeleteModalOpen(false);
      setConvToDelete(null);
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /**
   * UX Feature 4: Formatted message timestamp
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
      return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  };

  const getEffectiveAvatar = (userData: any) => {
    if (userData?.avatar_url) return userData.avatar_url;
    if (userData?.gender === 'Laki-laki') {
      return `https://api.dicebear.com/9.x/micah/svg?seed=Boy-${userData?.name || 'Kelana'}&backgroundColor=E85D2F`;
    }
    if (userData?.gender === 'Perempuan') {
      return `https://api.dicebear.com/9.x/micah/svg?seed=Girl-${userData?.name || 'Kelana'}&backgroundColor=E85D2F`;
    }
    if (userData?.name) {
      return `https://api.dicebear.com/9.x/micah/svg?seed=${userData.name}&backgroundColor=E85D2F`;
    }
    return "https://api.dicebear.com/9.x/micah/svg?seed=KelanaUser&backgroundColor=E85D2F";
  };

  const filteredConversations = conversations.filter(c =>
    (c.title || "Percakapan Baru").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="bg-[#F4EFE6] min-h-screen pt-20 pb-4 sm:pb-6 px-2 sm:px-4 lg:px-8 font-sans text-[#1A1612]">
      <div className="max-w-[1400px] mx-auto h-[calc(100vh-6rem)] flex flex-col">
        
        {/* Auth Error Toast Banner */}
        {authError && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-2xl mb-3 flex items-center justify-between text-xs sm:text-sm shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-amber-600"></i>
              <span>{authError}</span>
            </div>
            <Link 
              href="/login" 
              className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-3.5 py-1 rounded-xl font-semibold text-xs shadow-xs transition-all"
            >
              Masuk Sekarang
            </Link>
          </div>
        )}

        {/* Master Chat Window Container */}
        <div className="flex-1 bg-white border border-[#1A1612]/10 rounded-3xl shadow-[0_20px_50px_rgba(26,22,18,0.08)] overflow-hidden flex relative">
          
          {/* ============================================================ */}
          {/* SIDEBAR: Conversation List                                   */}
          {/* ============================================================ */}
          <aside
            className={`
              absolute lg:static inset-y-0 left-0 z-30
              w-80 sm:w-84 bg-[#FDFCFA] border-r border-[#1A1612]/10
              flex flex-col transition-transform duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Sidebar Top Header with Kelana AI Logo */}
            <div className="p-4 border-b border-[#1A1612]/5 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#1A1612]/10 p-1.5 flex items-center justify-center shadow-xs">
                  <img src="/logo-kelanaai.png" alt="Kelana AI Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-sm text-[#1A1612] leading-tight">Memori AI</h2>
                  <p className="text-[10px] font-mono text-[#0E4F4A] uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
                    Stateful Context
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden w-8 h-8 rounded-xl text-[#6B5D4F] hover:text-[#1A1612] hover:bg-[#1A1612]/5 flex items-center justify-center"
                title="Tutup Menu"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* New Conversation Button */}
            <div className="p-3">
              <button
                onClick={() => handleCreateNewConversation("Percakapan Baru", true)}
                className="w-full bg-gradient-to-r from-[#E85D2F] to-[#D4A24C] hover:opacity-95 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(232,93,47,0.25)] hover:shadow-[0_6px_20px_rgba(232,93,47,0.35)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <i className="fa-solid fa-plus text-xs"></i>
                <span>Percakapan Baru</span>
              </button>
            </div>

            {/* Conversation Search Bar */}
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 bg-[#F4EFE6]/70 px-3 py-1.5 rounded-xl border border-[#1A1612]/5 text-xs text-[#1A1612] focus-within:border-[#E85D2F] focus-within:bg-white transition-all">
                <i className="fa-solid fa-magnifying-glass text-[#6B5D4F] text-[11px]"></i>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari percakapan..."
                  className="w-full bg-transparent outline-none placeholder-[#6B5D4F]/50 text-xs"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-[#6B5D4F] hover:text-[#1A1612]">
                    <i className="fa-solid fa-circle-xmark text-[10px]"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
              {loadingConversations ? (
                <div className="py-10 text-center text-xs text-[#6B5D4F] space-y-2">
                  <i className="fa-solid fa-circle-notch fa-spin text-xl text-[#E85D2F]"></i>
                  <p>Memuat riwayat percakapan...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#6B5D4F] px-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4EFE6] text-[#6B5D4F]/40 flex items-center justify-center mx-auto mb-3 text-lg">
                    <i className="fa-regular fa-comments"></i>
                  </div>
                  <p className="font-semibold text-[#1A1612]">Belum ada percakapan</p>
                  <p className="text-[11px] mt-1 text-[#6B5D4F]">Mulai percakapan baru untuk menyimpan riwayat perjalananmu!</p>
                </div>
              ) : (
                filteredConversations.map(conv => {
                  const isActive = currentConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className={`
                        group relative flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all text-left border
                        ${isActive
                          ? 'bg-[#E85D2F]/10 border-[#E85D2F]/30 text-[#1A1612] shadow-xs'
                          : 'bg-transparent border-transparent hover:bg-white hover:border-[#1A1612]/5 text-[#6B5D4F]'
                        }
                      `}
                    >
                      {/* Active Indicator Bar */}
                      {isActive && (
                        <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#E85D2F] rounded-r-full"></span>
                      )}

                      <div className="flex-1 min-w-0 pr-2 pl-1.5">
                        <p className={`text-xs font-semibold truncate ${isActive ? 'text-[#E85D2F] font-bold' : 'text-[#1A1612]'}`}>
                          {conv.title || "Percakapan Baru"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-[#6B5D4F]/70 font-mono">
                            {formatDateLabel(conv.created_at)}
                          </span>
                          {isActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E85D2F]/15 text-[#E85D2F] font-bold">
                              Aktif
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons (Rename & Delete) */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentConversation(conv);
                            setNewTitle(conv.title);
                            setIsRenaming(true);
                          }}
                          title="Ganti Nama"
                          className="w-7 h-7 rounded-lg bg-white border border-[#1A1612]/10 hover:border-[#E85D2F] text-[#6B5D4F] hover:text-[#E85D2F] flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <i className="fa-solid fa-pen text-[10px]"></i>
                        </button>
                        <button
                          onClick={(e) => promptDeleteConversation(conv, e)}
                          title="Hapus Percakapan"
                          className="w-7 h-7 rounded-lg bg-white border border-[#1A1612]/10 hover:border-red-500 text-[#6B5D4F] hover:text-red-600 flex items-center justify-center transition-colors shadow-2xs"
                        >
                          <i className="fa-regular fa-trash-can text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sidebar Footer Badge */}
            <div className="p-3 border-t border-[#1A1612]/5 bg-white/40 flex items-center justify-between text-[10px] text-[#6B5D4F]">
              <span className="flex items-center gap-1 font-mono">
                <i className="fa-solid fa-bolt text-[#D4A24C]"></i>
                <span>Amazon Bedrock Nova</span>
              </span>
              <span className="bg-[#0E4F4A]/10 text-[#0E4F4A] px-2 py-0.5 rounded-full font-bold">
                Session 10
              </span>
            </div>
          </aside>

          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-20 backdrop-blur-xs transition-opacity"
            />
          )}

          {/* ============================================================ */}
          {/* MAIN CHAT VIEWPORT                                           */}
          {/* ============================================================ */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAF8] relative">
            
            {/* ---------------------------------------------------------- */}
            {/* UX Feature 1: Header with Conversation Title               */}
            {/* ---------------------------------------------------------- */}
            <header className="px-4 sm:px-6 py-3 bg-white border-b border-[#1A1612]/10 flex items-center justify-between z-10 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 text-[#6B5D4F] hover:text-[#1A1612] rounded-xl hover:bg-[#F4EFE6] transition-colors"
                  title="Menu Percakapan"
                >
                  <i className="fa-solid fa-bars-staggered text-sm"></i>
                </button>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 
                      id="conversation-title"
                      className="font-display font-bold text-base sm:text-lg text-[#1A1612] truncate max-w-[220px] sm:max-w-md md:max-w-lg"
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
                        className="text-[#6B5D4F] hover:text-[#E85D2F] p-1.5 rounded-lg hover:bg-[#F4EFE6] transition-colors text-xs shrink-0"
                        title="Ubah judul percakapan"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6B5D4F]">
                    <span className="flex items-center gap-1 font-semibold text-[#0E4F4A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Multi-turn Memory Active</span>
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline font-mono">KelanaAI Assistant</span>
                  </div>
                </div>
              </div>

              {/* Header Right Tools */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCreateNewConversation("Percakapan Baru", true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#1A1612]/10 hover:border-[#E85D2F] hover:text-[#E85D2F] bg-white shadow-2xs hover:shadow-xs transition-all"
                >
                  <i className="fa-solid fa-plus text-[10px] text-[#E85D2F]"></i>
                  <span>New Chat</span>
                </button>

                <Link
                  href="/assistant"
                  className="text-xs font-medium text-[#6B5D4F] hover:text-[#E85D2F] px-3 py-1.5 rounded-full hover:bg-[#F4EFE6] border border-transparent hover:border-[#1A1612]/5 transition-all flex items-center gap-1"
                  title="Buka RAG Knowledge Base"
                >
                  <i className="fa-solid fa-sparkles text-[10px] text-[#E85D2F]"></i>
                  <span className="hidden md:inline">RAG Docs</span>
                </Link>
              </div>
            </header>

            {/* ---------------------------------------------------------- */}
            {/* MESSAGE FEED (Scrollable Container)                        */}
            {/* ---------------------------------------------------------- */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6"
            >
              {loadingMessages ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#6B5D4F] space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center text-xl animate-bounce">
                    <i className="fa-solid fa-brain"></i>
                  </div>
                  <p className="text-sm font-semibold text-[#1A1612]">Memuat riwayat percakapan...</p>
                  <p className="text-xs text-[#6B5D4F]">Menyusun memori giliran percakapan sebelumnya</p>
                </div>
              ) : messages.length === 0 ? (
                /* Hero Empty Chat State */
                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-6 max-w-2xl mx-auto">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E85D2F] to-[#D4A24C] text-white flex items-center justify-center text-2xl shadow-[0_10px_30px_rgba(232,93,47,0.3)] mb-4 animate-float">
                    <i className="fa-solid fa-compass"></i>
                  </div>
                  
                  <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#1A1612] mb-2 tracking-tight">
                    KelanaAI <span className="text-[#E85D2F]">Conversational Memory</span>
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#6B5D4F] mb-6 leading-relaxed max-w-lg">
                    Tanyakan apa saja seputar rencanamu! KelanaAI mengingat konteks giliran sebelumnya sehingga pertanyaan lanjutan seperti <em>"Bagaimana dengan hari ke-2?"</em> dapat dijawab secara akurat.
                  </p>

                  <div className="w-full space-y-2 text-left">
                    <p className="text-[11px] font-bold text-[#6B5D4F] uppercase tracking-wider px-1">
                      💡 Coba Pertanyaan Contoh:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt.text)}
                          className="group p-3 bg-white hover:bg-[#F4EFE6] border border-[#1A1612]/10 hover:border-[#E85D2F] rounded-2xl text-left transition-all shadow-2xs hover:shadow-xs hover:-translate-y-0.5 active:scale-98 cursor-pointer flex items-start gap-2.5"
                        >
                          <div className="w-7 h-7 rounded-xl bg-[#E85D2F]/10 group-hover:bg-[#E85D2F] group-hover:text-white text-[#E85D2F] flex items-center justify-center text-xs shrink-0 transition-colors">
                            <i className={prompt.icon}></i>
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E85D2F] block">
                              {prompt.category}
                            </span>
                            <p className="text-xs font-medium text-[#1A1612] leading-snug line-clamp-2 mt-0.5">
                              {prompt.text}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Message Stream */
                messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'} group`}
                    >
                      {/* Avatar */}
                      {isUser ? (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-[#E85D2F] to-[#D4A24C] p-0.5 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                          <img 
                            src={getEffectiveAvatar(currentUser)} 
                            alt={currentUser?.name || "User"} 
                            className="w-full h-full rounded-[14px] object-cover bg-[#F4EFE6]" 
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white border border-[#1A1612]/10 p-1 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                          <img 
                            src="/logo-kelanaai.png" 
                            alt="Kelana AI" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                      )}

                      {/* Bubble with Content & UX Feature 4: Timestamp */}
                      <div className="flex flex-col min-w-0 max-w-[85vw] sm:max-w-xl">
                        <div
                          className={`
                            relative px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed
                            ${isUser
                              ? 'bg-gradient-to-br from-[#E85D2F] to-[#C8431C] text-white rounded-tr-none shadow-[0_4px_14px_rgba(232,93,47,0.2)]'
                              : 'bg-white border border-[#1A1612]/10 text-[#1A1612] rounded-tl-none shadow-[0_4px_20px_rgba(26,22,18,0.04)]'
                            }
                          `}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
                          ) : (
                            <div>
                              <div className="prose prose-sm max-w-none text-[#1A1612] prose-p:leading-relaxed prose-headings:font-display prose-headings:text-[#1A1612] prose-headings:mb-2 prose-headings:mt-3 prose-strong:text-[#1A1612] prose-ul:my-2 prose-li:my-0.5">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                              </div>

                              {/* Copy AI response button */}
                              <div className="mt-2.5 pt-2 border-t border-[#1A1612]/5 flex items-center justify-end">
                                <button
                                  onClick={() => copyToClipboard(msg.content, msg.id || index)}
                                  className="text-[11px] text-[#6B5D4F] hover:text-[#E85D2F] flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-[#F4EFE6]"
                                  title="Salin jawaban"
                                >
                                  <i className={`fa-solid ${copiedId === (msg.id || index) ? 'fa-check text-emerald-600' : 'fa-copy'}`}></i>
                                  <span>{copiedId === (msg.id || index) ? 'Tersalin!' : 'Salin'}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* UX Feature 4: Timestamp for each message */}
                        <span
                          className={`
                            text-[10px] mt-1 px-1.5 text-[#6B5D4F]/70 font-mono flex items-center gap-1
                            ${isUser ? 'justify-end' : 'justify-start'}
                          `}
                        >
                          <i className="fa-regular fa-clock text-[9px]"></i>
                          <span>{formatTime(msg.created_at)}</span>
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
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white border border-[#1A1612]/10 p-1 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/logo-kelanaai.png" 
                      alt="Kelana AI" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div className="bg-white border border-[#1A1612]/10 rounded-2xl rounded-tl-none px-4 py-3 shadow-[0_4px_16px_rgba(26,22,18,0.04)]">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#E85D2F] animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#E85D2F] animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 rounded-full bg-[#E85D2F] animate-bounce"></span>
                      </div>
                      <span className="text-xs text-[#6B5D4F] font-medium">
                        KelanaAI sedang merangkai jawaban...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* UX Feature 2: Auto-scroll anchor */}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* ---------------------------------------------------------- */}
            {/* BOTTOM FLOATING INPUT CAPSULE                              */}
            {/* ---------------------------------------------------------- */}
            <div className="p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-[#1A1612]/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="max-w-4xl mx-auto flex items-center gap-2 bg-[#F4EFE6] p-1.5 sm:p-2 rounded-2xl border border-[#1A1612]/10 focus-within:border-[#E85D2F] focus-within:ring-4 focus-within:ring-[#E85D2F]/10 focus-within:bg-white transition-all shadow-inner"
              >
                <div className="pl-3 pr-1 text-[#E85D2F]">
                  <i className="fa-solid fa-sparkles text-sm"></i>
                </div>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Tanyakan apa saja atau berikan pertanyaan lanjutan... (Enter untuk kirim)"
                  disabled={isAiTyping}
                  className="flex-1 bg-transparent px-2 py-2 outline-none text-xs sm:text-sm font-medium text-[#1A1612] placeholder-[#6B5D4F]/60"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isAiTyping}
                  className="bg-gradient-to-r from-[#E85D2F] to-[#D4A24C] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-[0_4px_12px_rgba(232,93,47,0.2)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 shrink-0 cursor-pointer"
                  title="Kirim Pesan"
                >
                  <span className="hidden sm:inline">Kirim</span>
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                </button>
              </form>

              <p className="text-[10px] text-center text-[#6B5D4F]/70 mt-2 font-mono">
                KelanaAI Session 10 — Conversational Memory & Multi-turn Dialogue
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* CUSTOM RENAME MODAL (Session 10 Bonus)                       */}
      {/* ============================================================ */}
      {isRenaming && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#1A1612]/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center text-base">
                <i className="fa-solid fa-pen-to-square"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1612]">
                  Ubah Judul Percakapan
                </h3>
                <p className="text-xs text-[#6B5D4F]">
                  Berikan nama yang deskriptif untuk sesi chat ini.
                </p>
              </div>
            </div>

            <form onSubmit={handleRenameSubmit} className="mt-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Contoh: Liburan Keluarga Tokyo 2026"
                required
                autoFocus
                className="w-full bg-[#F4EFE6] border border-[#1A1612]/15 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-[#E85D2F] focus:ring-4 focus:ring-[#E85D2F]/10 mb-4 transition-all"
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
                  className="bg-[#E85D2F] hover:bg-[#C8431C] disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  {renamingLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CUSTOM DELETE CONFIRMATION MODAL (Replaces ugly confirm())   */}
      {/* ============================================================ */}
      {deleteModalOpen && convToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-[#1A1612]/10 animate-scale-up">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-lg shrink-0 border border-red-100">
                <i className="fa-regular fa-trash-can"></i>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#1A1612]">
                  Hapus Percakapan Ini?
                </h3>
                <p className="text-xs text-[#6B5D4F] mt-1 leading-relaxed">
                  Percakapan <strong className="text-[#1A1612]">"{convToDelete.title}"</strong> beserta seluruh pesan di dalamnya akan dihapus secara permanen dari database.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setConvToDelete(null);
                }}
                disabled={deleteLoading}
                className="px-4 py-2.5 text-xs font-bold text-[#6B5D4F] hover:text-[#1A1612] rounded-xl hover:bg-[#F4EFE6] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteConversation}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer flex items-center gap-1.5"
              >
                {deleteLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-trash-can text-xs"></i>
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
