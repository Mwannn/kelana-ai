'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { askAssistant, AssistantResponse } from '../../services/assistantService';

const SAMPLE_QUESTIONS = [
  "Do Indonesian passport holders need a visa to visit Japan?",
  "What documents are required to visit Japan?",
  "Can I bring medication into Japan?",
  "What baggage allowance does Sinaptik Travel provide?",
  "What are the top attractions in Tokyo?"
];

export default function AssistantPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    if (queryToAsk) {
      setQuestion(queryToAsk);
    }

    try {
      const data = await askAssistant(q.trim());
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal menghubungi Amazon Bedrock Knowledge Base.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="bg-[#F4EFE6] min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-sans text-[#1A1612]">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B5D4F] mb-6">
          <Link href="/" className="hover:text-[#E85D2F] transition-colors flex items-center gap-1">
            <i className="fa-solid fa-house text-[10px]"></i> Beranda
          </Link>
          <span>/</span>
          <span className="text-[#E85D2F]">Travel Assistant (RAG)</span>
        </div>

        {/* Hero Header */}
        <div className="bg-white border border-[#1A1612]/5 rounded-3xl p-6 sm:p-10 shadow-[0_10px_30px_rgba(26,22,18,0.04)] mb-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E85D2F]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E85D2F]/10 text-[#E85D2F] text-xs font-bold uppercase tracking-wider mb-4 border border-[#E85D2F]/20">
              <i className="fa-solid fa-sparkles"></i>
              <span>RAG · Knowledge Base Powered</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#1A1612] tracking-tight leading-tight mb-3">
              Ask <span className="text-[#E85D2F]">KelanaAI</span>
            </h1>
            
            <p className="text-[#6B5D4F] text-sm sm:text-base max-w-2xl leading-relaxed">
              Dapatkan jawaban faktual seputar visa, regulasi, tips perjalanan, dan panduan destinasi yang bersumber langsung dari dokumen terpercaya yang telah di-upload ke <strong>Amazon Bedrock Knowledge Base</strong>.
            </p>
          </div>

          {/* Search Input Box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
            className="mt-8 relative z-10"
          >
            <div className="flex flex-col sm:flex-row gap-3 bg-[#F4EFE6] p-2 sm:p-2.5 rounded-2xl border border-[#1A1612]/10 focus-within:border-[#E85D2F] focus-within:ring-4 focus-within:ring-[#E85D2F]/10 transition-all shadow-inner">
              <div className="flex-1 flex items-center gap-3 px-3 py-1">
                <i className="fa-solid fa-magnifying-glass text-[#6B5D4F] text-base"></i>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Can I bring medication into Japan? / Tanyakan tentang visa..."
                  className="w-full bg-transparent outline-none text-[#1A1612] text-sm sm:text-base font-medium placeholder-[#6B5D4F]/60"
                  disabled={loading}
                />
                {question && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuestion('');
                      setResult(null);
                      setError(null);
                    }}
                    className="text-[#6B5D4F] hover:text-[#1A1612] p-1"
                  >
                    <i className="fa-solid fa-circle-xmark"></i>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="bg-[#E85D2F] hover:bg-[#C8431C] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(232,93,47,0.3)] hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>Mencari Dokumen...</span>
                  </>
                ) : (
                  <>
                    <span>Ask</span>
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Prompts */}
          <div className="mt-5 relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6B5D4F] uppercase tracking-wider mb-2.5">
              <i className="fa-solid fa-lightbulb text-[#D4A24C]"></i>
              <span>Contoh Pertanyaan Sampel:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_QUESTIONS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAsk(sample)}
                  disabled={loading}
                  className="text-xs bg-white hover:bg-[#1A1612] text-[#6B5D4F] hover:text-white border border-[#1A1612]/10 hover:border-[#1A1612] px-3 py-1.5 rounded-full transition-all text-left font-medium cursor-pointer shadow-sm hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                >
                  <i className="fa-regular fa-comment-dots mr-1.5 opacity-60"></i>
                  {sample}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 sm:p-5 rounded-2xl mb-8 flex items-start gap-3 shadow-sm animate-fade-in">
            <i className="fa-solid fa-triangle-exclamation text-red-500 text-lg mt-0.5 shrink-0"></i>
            <div>
              <h4 className="font-bold text-sm">Gagal Mengambil Informasi</h4>
              <p className="text-xs mt-1 text-red-600 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Result Area */}
        {loading && (
          <div className="bg-white border border-[#1A1612]/5 rounded-3xl p-8 shadow-sm text-center animate-pulse">
            <div className="w-12 h-12 rounded-full bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-brain fa-spin"></i>
            </div>
            <h3 className="font-display font-bold text-lg text-[#1A1612] mb-1">
              Mencari di Knowledge Base...
            </h3>
            <p className="text-xs text-[#6B5D4F]">
              Amazon Bedrock sedang melakukan retrieval pada dokumen travel dan menghasilkan jawaban terverifikasi.
            </p>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white border border-[#1A1612]/5 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(26,22,18,0.06)] animate-fade-in space-y-6">
            
            {/* Header / Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A1612]/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0E4F4A] text-white flex items-center justify-center text-sm shadow-sm">
                  <i className="fa-solid fa-robot"></i>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0E4F4A] block">AI ANSWER</span>
                  <span className="text-[11px] text-[#6B5D4F]">Grounded response via Bedrock RAG</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-[#F4EFE6] hover:bg-[#1A1612] text-[#6B5D4F] hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Salin Jawaban"
                >
                  {copied ? (
                    <>
                      <i className="fa-solid fa-check text-green-500"></i>
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-regular fa-copy"></i>
                      <span>Salin Jawaban</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Answer Content */}
            <div className="text-[#1A1612] text-sm sm:text-base leading-relaxed space-y-3 prose prose-slate max-w-none">
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>

            {/* Source Citations Box (Slide 14 & 16) */}
            <div className="bg-[#F4EFE6]/70 border border-[#1A1612]/10 rounded-2xl p-4 sm:p-5 mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B5D4F] flex items-center gap-2">
                  <i className="fa-solid fa-book-bookmark text-[#E85D2F]"></i>
                  <span>SOURCE CITATIONS</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                  <i className="fa-solid fa-shield-check"></i>
                  <span>Verified Document</span>
                </span>
              </div>

              {result.sources && result.sources.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((src, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#1A1612]/10 text-xs font-semibold text-[#1A1612] shadow-2xs"
                    >
                      <i className="fa-solid fa-file-pdf text-[#E85D2F]"></i>
                      <span className="font-mono">{src}</span>
                    </div>
                  ))}
                </div>
              ) : result.source ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#1A1612]/10 text-xs font-semibold text-[#1A1612] shadow-2xs">
                  <i className="fa-solid fa-file-pdf text-[#E85D2F]"></i>
                  <span className="font-mono">{result.source}</span>
                </div>
              ) : (
                <div className="text-xs text-[#6B5D4F] italic flex items-center gap-2">
                  <i className="fa-solid fa-circle-info"></i>
                  <span>Dokumen sumber: Knowledge Base Documents (Kelana Travel Knowledge)</span>
                </div>
              )}

              <p className="text-[11px] text-[#6B5D4F] leading-tight pt-1">
                Answers are grounded in your uploaded travel documents. Sesuai arsitektur RAG, AI merujuk dokumen sebelum menjawab untuk mencegah halusinasi.
              </p>
            </div>
          </div>
        )}

        {/* Feature Comparison Section (Slide 13 & 20) */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white/60 border border-[#1A1612]/5 rounded-2xl p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B5D4F] mb-2">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                <span>Without RAG (General LLM)</span>
              </div>
              <p className="text-xs text-[#6B5D4F] leading-relaxed">
                Hanya mengandalkan data publik sebelum batas cutoff. Rentan halusinasi dan tidak mengetahui kebijakan internal, visa terkini, atau regulasi spesifik.
              </p>
            </div>

            <div className="bg-white border border-[#0E4F4A]/20 rounded-2xl p-5 shadow-2xs relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0E4F4A] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#0E4F4A] animate-pulse"></span>
                <span>With RAG (KelanaAI Knowledge Base)</span>
              </div>
              <p className="text-xs text-[#1A1612] leading-relaxed">
                Melakukan pencarian pada dokumen S3 Anda terlebih dahulu, lalu menghasilkan jawaban akurat dan menyertakan sitasi sumber aslinya.
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
