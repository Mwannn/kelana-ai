import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1A1612] text-[#F4EFE6]/60 pt-16 pb-10 border-t border-[#F4EFE6]/10 selection:bg-[#E85D2F] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & Identity */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="inline-block group">
                <img 
                  src="/logo-kelanaai.png" 
                  alt="Kelana AI Logo" 
                  className="h-12 sm:h-14 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" 
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-[#F4EFE6]/70 max-w-sm">
              Perjalanan yang dirancang oleh orang yang pulang ke rumah. Menghubungkan setiap pelancong dengan jiwa autentik Nusantara.
            </p>
          </div>

          {/* Col 2: Destinations */}
          <div>
            <h4 className="text-[#F4EFE6] font-semibold mb-4 text-xs tracking-widest uppercase font-mono">
              Destinasi Populer
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/#destinations" className="hover:text-[#E85D2F] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2F]"></span>
                  <span>Bali & Nusa Penida</span>
                </Link>
              </li>
              <li>
                <Link href="/#destinations" className="hover:text-[#E85D2F] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2F]"></span>
                  <span>Labuan Bajo & Flores</span>
                </Link>
              </li>
              <li>
                <Link href="/#destinations" className="hover:text-[#E85D2F] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2F]"></span>
                  <span>Raja Ampat & Papua</span>
                </Link>
              </li>
              <li>
                <Link href="/#destinations" className="hover:text-[#E85D2F] transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E85D2F]"></span>
                  <span>Gunung Bromo & Semeru</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company Pages */}
          <div>
            <h4 className="text-[#F4EFE6] font-semibold mb-4 text-xs tracking-widest uppercase font-mono">
              Perusahaan
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#E85D2F] transition-colors inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-leaf text-[10px] text-[#E85D2F]"></i>
                  <span>Tentang kami</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#E85D2F] transition-colors inline-flex items-center gap-1.5">
                  <i className="fa-solid fa-book-open text-[10px] text-[#E85D2F]"></i>
                  <span>Blog & Jurnal</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E85D2F] transition-colors inline-flex items-center gap-1.5">
                  <i className="fa-regular fa-paper-plane text-[10px] text-[#E85D2F]"></i>
                  <span>Kontak Kami</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Social Channels */}
          <div>
            <h4 className="text-[#F4EFE6] font-semibold mb-4 text-xs tracking-widest uppercase font-mono">
              Ikuti Jejak Kami
            </h4>
            <p className="text-xs text-[#F4EFE6]/60 mb-4 leading-relaxed">
              Dapatkan inspirasi harian dan hidden gems terbaru dari pelosok Indonesia.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center text-[#F4EFE6] hover:text-white hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-all"
                title="Instagram Kelana AI"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center text-[#F4EFE6] hover:text-white hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-all"
                title="TikTok Kelana AI"
              >
                <i className="fa-brands fa-tiktok text-sm"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center text-[#F4EFE6] hover:text-white hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-all"
                title="YouTube Kelana AI"
              >
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-[#F4EFE6]/10 text-xs sm:text-sm flex flex-col md:flex-row justify-between items-center gap-4 text-[#F4EFE6]/70 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>© 2026 <strong className="text-[#F4EFE6]">Kelana AI Travel</strong>.</span>
            <span className="hidden sm:inline">•</span>
            <span>Dibuat dengan rindu di Indonesia.</span>
          </div>
          <div className="font-mono text-xs">
            Copyright © 2026 <a href="https://marwan-wisnu.my.id/" target="_blank" rel="noopener noreferrer" className="text-[#E85D2F] font-bold hover:text-white transition-colors underline decoration-[#E85D2F]/40 hover:decoration-white">Marwan Wisnu (mwannn_n)</a>. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
