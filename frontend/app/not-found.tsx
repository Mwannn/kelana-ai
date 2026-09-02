'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

export default function NotFound() {
  const [toastMsg, setToastMsg] = useState({ title: '', msg: '', visible: false });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect on floating cards
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      document.querySelectorAll('.float-card').forEach((card, index) => {
        const factor = index === 0 ? 1 : -1;
        const baseRotate = index === 0 ? -4 : 6;
        (card as HTMLElement).style.transform = `rotate(${baseRotate + factor * 4}deg) translate(${x * factor}px, ${y * factor}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Reveal on Scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  const showToast = (title: string, msg: string) => {
    setToastMsg({ title, msg, visible: true });
    setTimeout(() => {
      setToastMsg(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F4EFE6] text-[#1A1612] font-sans">
      {/* Main 404 Section */}
      <section className="min-h-screen pt-32 pb-12 relative overflow-hidden">
        <div className="particle" style={{ top: '20%', left: '80%', width: '8px', height: '8px', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '60%', left: '10%', width: '12px', height: '12px', animationDelay: '2s', background: '#E85D2F' }}></div>
        <div className="particle" style={{ top: '80%', left: '90%', width: '6px', height: '6px', animationDelay: '4s' }}></div>

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <span className="w-12 h-px bg-[#1A1612]"></span>
            <span className="section-num">404 — Jalur Tidak Ditemukan</span>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="error-title">
                4<em>0</em><span className="text-stroke">4</span>
              </h1>
            </div>
            
            <div className="lg:col-span-4 relative h-[300px] lg:h-[400px]">
              <div className="float-card absolute top-0 right-0 w-48 h-64 lg:w-56 lg:h-72 rounded-3xl overflow-hidden shadow-2xl" style={{ transform: 'rotate(-4deg)' }}>
                <img src="https://picsum.photos/seed/lost-jungle/400/500.jpg" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="float-card absolute bottom-0 left-0 w-40 h-40 lg:w-48 lg:h-48 rounded-3xl overflow-hidden shadow-2xl" style={{ transform: 'rotate(6deg)', animationDelay: '1s' }}>
                <img src="https://picsum.photos/seed/lost-map/400/400.jpg" className="w-full h-full object-cover" alt="" />
              </div>
              
              <div className="absolute top-1/2 right-1/4 glass-card rounded-2xl p-4 shadow-xl w-44" style={{ transform: 'rotate(5deg)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#E85D2F]/10 flex items-center justify-center compass-icon">
                    <i className="fa-solid fa-compass text-[#E85D2F] text-sm"></i>
                  </div>
                  <span className="font-mono text-xs text-[#6B5D4F]">LOST?</span>
                </div>
                <p className="text-sm font-medium text-[#1A1612]">Jangan khawatir, kita akan temukan jalan pulang.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 mt-12 lg:mt-16">
            <div className="lg:col-span-5">
              <h2 className="font-display font-bold text-3xl lg:text-4xl leading-tight mb-4">
                Anda tampaknya <em className="italic font-light text-[#E85D2F]">tersesat</em>.
              </h2>
              <p className="text-[#6B5D4F] text-lg leading-relaxed">
                Jalan setapak yang Anda ikuti sepertinya buntu. Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau memang tidak pernah ada di peta kami.
              </p>
            </div>
            
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start gap-4 lg:justify-end lg:items-center">
              <Link href="/" className="btn-primary px-7 py-4 rounded-full font-semibold flex items-center gap-3 cursor-hover-target">
                <span className="flex items-center gap-3">
                  <i className="fa-solid fa-house"></i>
                  Kembali ke Beranda
                </span>
              </Link>
              <button onClick={() => showToast('Memanggil pemandu', 'Tim Kelana AI akan segera menghubungi Anda.')} className="btn-outline px-7 py-4 rounded-full font-semibold flex items-center gap-3 cursor-hover-target">
                <i className="fa-solid fa-envelope"></i>
                Hubungi Pemandu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Destinations */}
      <section className="py-20 lg:py-24 bg-[#E8DFC9] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 reveal">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-[#1A1612]"></span>
                <span className="section-num">Peta Alternatif</span>
              </div>
              <h2 className="font-display font-black text-4xl lg:text-6xl leading-[0.95] tracking-tight">
                Mungkin Anda mau ke <em className="italic font-light">sini</em>?
              </h2>
            </div>
            <p className="text-[#6B5D4F] max-w-md text-base leading-relaxed">
              Alih-alih diam di tempat, mari lanjutkan perjalanan ke destinasi yang sudah diverifikasi oleh pemandu lokal kami.
            </p>
          </div>
          
          <div className="grid grid-cols-12 gap-4 lg:gap-6 auto-rows-[180px] lg:auto-rows-[220px]">
            <Link href="/#bromo" className="dest-card col-span-12 lg:col-span-7 row-span-2 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/bromo-404/800/600.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="card-overlay mb-4">
                  <p className="max-w-md text-white/80">Lihat matahari terbit dari atas lautan pasir yang luas.</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-mono text-xs text-white/60 mb-2">JAWA TIMUR</div>
                    <h3 className="font-display font-black text-3xl lg:text-5xl leading-none">Bromo Tengger</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#E85D2F] flex items-center justify-center">
                    <i className="fa-solid fa-arrow-right text-white"></i>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/#raja-ampat" className="dest-card col-span-6 lg:col-span-5 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/raja-404/600/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">PAPUA BARAT DAYA</div>
                <h3 className="font-display font-bold text-2xl lg:text-3xl">Raja Ampat</h3>
              </div>
            </Link>
            
            <Link href="/#ubud" className="dest-card col-span-6 lg:col-span-5 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/bali-404/600/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">BALI</div>
                <h3 className="font-display font-bold text-2xl lg:text-3xl">Ubud & Sekitar</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Mini */}
      <footer className="bg-[#1A1612] text-[#F4EFE6]/60 py-6 border-t border-[#F4EFE6]/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div>© 2024 Kelana AI. Tersesat sementara, perjalanan belum berakhir.</div>
          <div className="font-mono text-xs">ERROR CODE: 404 - LOST_TRAVELER</div>
        </div>
      </footer>

      {/* Toast Notification */}
      <div 
        className="fixed bottom-8 right-8 bg-[#1A1612] text-[#F4EFE6] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm z-[100]"
        style={{
          transform: toastMsg.visible ? 'translateY(0)' : 'translateY(150%)',
          transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        <div className="w-8 h-8 rounded-full bg-[#E85D2F] flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-info text-sm"></i>
        </div>
        <div>
          <div className="font-semibold text-sm">{toastMsg.title}</div>
          <div className="text-xs text-[#F4EFE6]/60">{toastMsg.msg}</div>
        </div>
      </div>
    </div>
  );
}
