export default function Footer() {
  return (
    <footer className="bg-[#1A1612] text-[#F4EFE6]/60 pt-16 pb-8 border-t border-[#F4EFE6]/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-kelanaai.png" alt="Kelana AI Logo" className="h-16 w-auto object-contain brightness-0 invert opacity-90" />
            </div>
            <p className="text-sm">Perjalanan yang dirancang oleh orang yang pulang ke rumah.</p>
          </div>
          <div>
            <h4 className="text-[#F4EFE6] font-semibold mb-4 text-sm">Destinasi</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#E85D2F]">Bali</a></li>
              <li><a href="#" className="hover:text-[#E85D2F]">Labuan Bajo</a></li>
              <li><a href="#" className="hover:text-[#E85D2F]">Raja Ampat</a></li>
              <li><a href="#" className="hover:text-[#E85D2F]">Bromo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F4EFE6] font-semibold mb-4 text-sm">Perusahaan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-[#E85D2F]">Tentang kami</a></li>
              <li><a href="#" className="hover:text-[#E85D2F]">Karir</a></li>
              <li><a href="#" className="hover:text-[#E85D2F]">Blog</a></li>
              <li><a href="#" className="hover:text-[#E85D2F]">Kontak</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#F4EFE6] font-semibold mb-4 text-sm">Ikuti</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-colors">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-colors">
                <i className="fa-brands fa-tiktok"></i>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-colors">
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-[#F4EFE6]/10 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 Kelana AI Travel. Dibuat dengan rindu di Indonesia.</div>
          <div className="font-mono text-xs">
            DESIGN BY <a href="https://marwan-wisnu.my.id/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E85D2F] transition-colors underline decoration-[#F4EFE6]/30 hover:decoration-[#E85D2F]">mwannn_n</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
