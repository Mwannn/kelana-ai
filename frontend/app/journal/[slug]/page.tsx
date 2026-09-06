import Link from 'next/link';
import Footer from '@/components/Footer';

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
      {/* Hero Image */}
      <div className="w-full h-[45vh] sm:h-[50vh] md:h-[60vh] pt-14 relative">
        <img src={img} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Content */}
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 -mt-20 sm:-mt-32 relative z-10 mb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-12 shadow-[0_30px_80px_-20px_rgba(26,22,18,0.15)] border border-[#1A1612]/5">
          <div className="flex items-center gap-2 mb-6 font-mono text-xs text-[#E85D2F] uppercase tracking-widest">
            <span>{location}</span>
            <span className="text-[#6B5D4F]">·</span>
            <span className="text-[#6B5D4F]">{readTime}</span>
          </div>
          
          <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
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

      <Footer />
    </div>
  );
}
