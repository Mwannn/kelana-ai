import Link from 'next/link';

export default async function JournalDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Simple dummy content mapper based on slug
  let title = "Cerita Pelancong";
  let img = "https://picsum.photos/seed/story1/1200/600.jpg";
  let location = "INDONESIA";
  let readTime = "5 MIN BACA";
  
  if (slug.includes('pulau-padar')) {
    title = "Pagi yang tak terlupakan di Pulau Padar";
    location = "LABUAN BAJO";
    img = "https://picsum.photos/seed/story1/1200/600.jpg";
  } else if (slug.includes('tengger')) {
    title = "Mitos dan kawah Tengger yang masih hidup";
    location = "BROMO";
    readTime = "8 MIN BACA";
    img = "https://picsum.photos/seed/story2/1200/600.jpg";
  } else if (slug.includes('empat-hari')) {
    title = "Hidup di atas air selama empat hari";
    location = "RAJA AMPAT";
    readTime = "6 MIN BACA";
    img = "https://picsum.photos/seed/story3/1200/600.jpg";
  }

  return (
    <div className="bg-[#F4EFE6] min-h-screen text-[#1A1612] font-sans flex flex-col">
      {/* Full Nav */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-kelanaai.png" alt="Kelana AI Logo" className="h-12 w-auto object-contain" />
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/#destinations" className="hover:text-[#E85D2F] transition-colors">Destinasi</Link>
            <Link href="/#planner" className="hover:text-[#E85D2F] transition-colors">Buat Trip</Link>
            <Link href="/#experiences" className="hover:text-[#E85D2F] transition-colors">Pengalaman</Link>
            <Link href="/#journal" className="hover:text-[#E85D2F] transition-colors">Jurnal</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/masuk" className="hidden md:block text-sm font-medium cursor-hover-target">Masuk</Link>
            <button className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold">
              <span>Mulai Perjalanan</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[60vh] mt-16 relative">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(26,22,18,0.15)]">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs text-[#E85D2F] uppercase tracking-widest">
            <span>{location}</span>
            <span className="text-[#6B5D4F]">·</span>
            <span className="text-[#6B5D4F]">{readTime}</span>
          </div>
          
          <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            {title}
          </h1>

          <div className="flex items-center gap-4 mb-12 pb-12 border-b border-[#1A1612]/10">
            <img src="https://ui-avatars.com/api/?name=Marwan+Wisnu&background=E85D2F&color=F4EFE6&size=100&bold=true" alt="Author" className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-bold text-sm">Marwan Wisnu</div>
              <div className="text-xs text-[#6B5D4F] font-mono mt-1">EDITOR, KELANA AI</div>
            </div>
          </div>

          <div className="text-[#1A1612]/80 leading-relaxed space-y-6 text-lg">
            <p className="text-2xl font-medium text-[#1A1612] italic border-l-4 border-[#E85D2F] pl-6 mb-8 font-display">
              Perjalanan selalu menawarkan dua hal: melihat dunia dengan cara baru, atau melihat diri sendiri dari kacamata yang berbeda.
            </p>
            <p>
              Cahaya fajar baru saja menyingsing ketika kami menapakkan kaki di Pulau Padar. Angin laut yang dingin masih menusuk kulit, namun semangat untuk melihat salah satu panorama paling ikonik di Nusantara mengalahkan rasa kantuk yang menggelayut. Hamparan perbukitan sabana yang membentang luas tampak misterius di bawah sisa-sisa kegelapan subuh.
            </p>
            <h2 className="font-display text-3xl font-bold text-[#1A1612] mt-12 mb-6">Sebuah awal yang tak terduga</h2>
            <p>
              Perjalanan menuju puncak tidaklah mudah. Ratusan anak tangga kayu dan bebatuan vulkanik menanti untuk ditaklukkan. Namun setiap kali kami berhenti untuk mengambil napas, laut Flores di bawah sana perlahan mulai menampakkan pesonanya. Warna biru pekat perlahan memudar, digantikan oleh gradasi toska dan emas yang dipantulkan oleh cahaya matahari pertama.
            </p>
            <p>
              Tepat ketika matahari sepenuhnya terbit, kami tiba di puncak. Pemandangan tiga teluk dengan warna pasir yang berbeda—putih, hitam, dan merah muda—terhampar sempurna bagaikan lukisan raksasa. Momen ini bukan sekadar tentang keindahan visual, melainkan sebuah jeda magis yang membuat kami menyadari betapa kecilnya manusia di hadapan kemegahan alam Indonesia.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A1612] text-[#F4EFE6]/60 pt-16 pb-8 border-t border-[#F4EFE6]/10 mt-auto md:mt-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo-kelanaai.png" alt="Kelana AI Logo" className="h-16 w-auto object-contain brightness-0 invert opacity-90" />
              </div>
              <p className="text-sm">Perjalanan yang dirancang oleh orang yang pulang ke rumah.</p>
            </div>
            <div>
              <div className="font-bold text-[#F4EFE6] mb-4">Eksplorasi</div>
              <ul className="space-y-2 text-sm">
                <li><Link href="/#destinations" className="hover:text-[#E85D2F] transition-colors">Destinasi</Link></li>
                <li><Link href="/#planner" className="hover:text-[#E85D2F] transition-colors">Trip Planner AI</Link></li>
                <li><Link href="/#experiences" className="hover:text-[#E85D2F] transition-colors">Pengalaman Lokal</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#F4EFE6] mb-4">Tentang</div>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#E85D2F] transition-colors">Cerita Kami</a></li>
                <li><a href="#" className="hover:text-[#E85D2F] transition-colors">Pemandu Lokal</a></li>
                <li><Link href="/#journal" className="hover:text-[#E85D2F] transition-colors">Jurnal</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-[#F4EFE6] mb-4">Sosial</div>
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
    </div>
  );
}
