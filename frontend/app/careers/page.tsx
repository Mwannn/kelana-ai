'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function CareersPage() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [appliedJob, setAppliedJob] = useState<string | null>(null);

  const perks = [
    {
      icon: 'fa-solid fa-house-laptop',
      title: 'Kerja Remote Fleksibel',
      desc: 'Bekerja dari mana saja di seluruh Indonesia—dari kedai kopi di Bandung, pantai di Bali, hingga rumah sendiri.'
    },
    {
      icon: 'fa-solid fa-plane-departure',
      title: 'Tunjangan Jelajah Tahunan',
      desc: 'Kami memberi anggaran tahunan khusus untuk kamu liburan dan mengeksplorasi destinasi baru Nusantara.'
    },
    {
      icon: 'fa-solid fa-wand-magic-sparkles',
      title: 'Teknologi AI Terdepan',
      desc: 'Belajar dan bereksperimen langsung dengan arsitektur LLM mutakhir, Vector Knowledge Base, dan serverless cloud.'
    },
    {
      icon: 'fa-solid fa-hand-holding-heart',
      title: 'Dampak Sosial Nyata',
      desc: 'Setiap baris kode yang kamu tulis membantu memajukan UMKM kuliner dan pemandu wisata lokal di pelosok negeri.'
    }
  ];

  const jobs = [
    {
      id: 'ai-engineer',
      title: 'Senior AI / LLM Engineer',
      dept: 'engineering',
      deptLabel: 'Engineering',
      type: 'Full-time',
      location: 'Remote (Indonesia)',
      desc: 'Mengembangkan dan menyempurnakan pipeline agen AI, Retrieval-Augmented Generation (RAG), serta integrasi model Amazon Bedrock.'
    },
    {
      id: 'fullstack-dev',
      title: 'Full-Stack Software Engineer (Next.js & Python)',
      dept: 'engineering',
      deptLabel: 'Engineering',
      type: 'Full-time',
      location: 'Remote (Indonesia)',
      desc: 'Membangun antarmuka web modern dengan Next.js 15 TailwindCSS serta API berkinerja tinggi menggunakan FastAPI.'
    },
    {
      id: 'travel-curator',
      title: 'Local Travel Experience Curator',
      dept: 'operations',
      deptLabel: 'Travel & Ops',
      type: 'Full-time / Remote',
      location: 'Bali / Flores / Jogja / Remote',
      desc: 'Meneliti, memvalidasi, dan mengkurasi hidden gems kuliner dan petualangan otentik untuk dimasukkan ke knowledge base Kelana AI.'
    },
    {
      id: 'product-designer',
      title: 'Product Designer (UI/UX)',
      dept: 'design',
      deptLabel: 'Design & Product',
      type: 'Full-time',
      location: 'Remote (Indonesia)',
      desc: 'Menciptakan pengalaman pengguna yang emosional, elegan, dan menawan bagi para pelancong lintas generasi.'
    }
  ];

  const filteredJobs = selectedDept === 'all' 
    ? jobs 
    : jobs.filter(j => j.dept === selectedDept);

  return (
    <div className="bg-[#F4EFE6] text-[#1A1612] font-sans min-h-screen selection:bg-[#E85D2F] selection:text-white">
      {/* Hero Section */}
      <section className="pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 border-b border-[#1A1612]/10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E85D2F]/10 border border-[#E85D2F]/20 text-[#E85D2F] text-xs font-mono tracking-wider uppercase mb-6">
            <i className="fa-solid fa-briefcase text-[11px]"></i> Karir di Kelana AI
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#1A1612] max-w-4xl leading-[1.1] mb-6 sm:mb-8">
            Berkarya membuka keajaiban Nusantara bersama <span className="text-[#E85D2F] italic font-normal">kami.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#6B5D4F] max-w-2xl leading-relaxed mb-8">
            Bergabunglah dengan tim yang bergairah memadukan teknologi AI generatif terdepan dengan kecintaan tulus terhadap pariwisata Nusantara yang berdampak positif.
          </p>

          <div className="flex items-center gap-3 text-xs font-mono text-[#6B5D4F]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
            <span>4 Posisi Terbuka Sedang Menerima Lamaran</span>
          </div>
        </div>

        <div className="absolute -bottom-24 -right-24 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#E85D2F]/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Perks Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-3 block">Budaya Kami</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Mengapa Bergabung di Kelana AI?</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {perks.map((perk, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-[#E85D2F]/10 flex items-center justify-center text-[#E85D2F] text-lg mb-6">
                  <i className={perk.icon}></i>
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{perk.title}</h3>
                <p className="text-[#6B5D4F] text-xs leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white border-y border-[#1A1612]/10">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-2 block">Lowongan Tersedia</span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold">Pilih Peran Terbaikmu</h2>
            </div>

            {/* Department Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Semua Bidang' },
                { id: 'engineering', label: 'Engineering' },
                { id: 'operations', label: 'Travel & Ops' },
                { id: 'design', label: 'Design' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDept(tab.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedDept === tab.id
                      ? 'bg-[#1A1612] text-white shadow-xs'
                      : 'bg-[#F4EFE6] text-[#6B5D4F] hover:bg-[#E85D2F]/10 hover:text-[#E85D2F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-[#F4EFE6]/50 rounded-3xl p-5 sm:p-8 border border-[#1A1612]/10 hover:border-[#E85D2F]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-sm"
              >
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-[#E85D2F]/15 text-[#E85D2F] text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                      {job.deptLabel}
                    </span>
                    <span className="text-xs text-[#6B5D4F] font-mono">• {job.type}</span>
                    <span className="text-xs text-[#6B5D4F] font-mono">• {job.location}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#1A1612] mb-2">{job.title}</h3>
                  <p className="text-[#6B5D4F] text-sm leading-relaxed">{job.desc}</p>
                </div>

                <div className="flex-shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setAppliedJob(job.title)}
                    className="w-full sm:w-auto bg-[#1A1612] hover:bg-[#E85D2F] text-white px-6 py-3 rounded-full text-xs font-bold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Lamar Posisi</span>
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Apply / Direct Contact Box */}
          <div className="mt-12 sm:mt-16 bg-[#F4EFE6] rounded-3xl p-6 sm:p-12 border border-[#1A1612]/10 text-center max-w-3xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#E85D2F] text-white flex items-center justify-center mx-auto mb-4 text-lg">
              <i className="fa-regular fa-paper-plane"></i>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-3">Tidak menemukan posisi yang pas?</h3>
            <p className="text-[#6B5D4F] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto mb-6">
              Kami selalu terbuka bagi talenta yang memiliki semangat luar biasa. Kirimkan CV dan perkenalan singkat ke tim kami.
            </p>
            <a
              href="mailto:karir@kelana-ai.com?subject=Spontaneous%20Application%20-%20Kelana%20AI"
              className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-6 sm:px-8 py-3.5 rounded-full font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <i className="fa-regular fa-envelope"></i>
              <span>Kirim Email ke karir@kelana-ai.com</span>
            </a>
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      {appliedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1612]/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#1A1612]/15 shadow-2xl relative mx-auto">
            <button
              onClick={() => setAppliedJob(null)}
              className="absolute top-6 right-6 text-[#6B5D4F] hover:text-[#1A1612] transition-colors"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#E85D2F]/15 text-[#E85D2F] flex items-center justify-center text-lg mb-4">
              <i className="fa-solid fa-file-lines"></i>
            </div>

            <h3 className="font-display text-2xl font-bold text-[#1A1612] mb-1">Lamar Posisi</h3>
            <p className="text-[#E85D2F] text-sm font-semibold mb-4">{appliedJob}</p>

            <p className="text-[#6B5D4F] text-sm leading-relaxed mb-6">
              Silakan kirimkan CV / Portfolio Anda beserta tautan LinkedIn atau GitHub ke alamat email rekrutmen kami dengan subjek:
            </p>

            <div className="bg-[#F4EFE6] p-4 rounded-xl font-mono text-xs text-[#1A1612] mb-6 select-all border border-[#1A1612]/10">
              Lamaran: {appliedJob} - [Nama Anda]
            </div>

            <a
              href={`mailto:karir@kelana-ai.com?subject=Lamaran:%20${encodeURIComponent(appliedJob)}`}
              className="w-full bg-[#E85D2F] hover:bg-[#C8431C] text-white py-3 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <i className="fa-regular fa-envelope"></i>
              <span>Buka Aplikasi Email</span>
            </a>
          </div>
        </div>
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
