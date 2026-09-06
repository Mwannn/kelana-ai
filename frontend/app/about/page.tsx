'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const pillars = [
    {
      icon: 'fa-solid fa-compass',
      title: 'Pariwisata Berakar Lokal',
      desc: 'Kami percaya bahwa perjalanan terbaik adalah yang memberdayakan masyarakat adat dan pelaku UMKM lokal, bukan sekadar pelesir di resor asing tanpa jiwa.'
    },
    {
      icon: 'fa-solid fa-microchip',
      title: 'Kecerdasan Buatan Humanis',
      desc: 'Didukung oleh model bahasa cerdas Amazon Bedrock yang dilatih dengan pengetahuan otentik Nusantara, menghasilkan rekomendasi yang hidup dan kontekstual.'
    },
    {
      icon: 'fa-solid fa-gem',
      title: 'Hidden Gems Terkurasi',
      desc: 'Menghindari tempat-tempat wisata over-commercialized dan mengarahkan pelancong ke warung kopi legendaris, pantai perawan, dan jalur setapak yang sunyi.'
    }
  ];

  const milestones = [
    {
      year: '2026',
      title: 'Kelahiran Kelana AI',
      desc: 'Dikembangkan sebagai asisten perjalanan AI Native pertama yang memahami nuansa geografis, budaya, dan cita rasa autentik Nusantara.'
    },
    {
      year: 'Misi',
      title: '17.000+ Pulau Terhubung',
      desc: 'Membawa setiap pelancong menemukan sudut terbaik Indonesia tanpa rasa bingung, takut tersesat, atau terjebak harga turis.'
    },
    {
      year: 'Komitmen',
      title: 'Ekosistem Berkelanjutan',
      desc: 'Mendukung warung makan tradisional, pemandu lokal bersertifikat, dan pelestarian alam di setiap itinerary yang digenerate.'
    }
  ];

  return (
    <div className="bg-[#F4EFE6] text-[#1A1612] font-sans min-h-screen selection:bg-[#E85D2F] selection:text-white">
      {/* Hero Section */}
      <section className="pt-32 sm:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden border-b border-[#1A1612]/10">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E85D2F]/10 border border-[#E85D2F]/20 text-[#E85D2F] text-xs font-mono tracking-wider uppercase mb-6">
            <i className="fa-solid fa-leaf text-[11px]"></i> Mengenal Kelana AI
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-[#1A1612] max-w-4xl leading-[1.1] mb-6 sm:mb-8">
            Perjalanan yang dirancang oleh orang yang <span className="italic font-normal text-[#E85D2F]">pulang ke rumah.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#6B5D4F] max-w-2xl leading-relaxed mb-8 sm:mb-10">
            Kelana AI bukan sekadar generator jadwal liburan. Kami adalah teman seperjalanan digital yang memahami detak jantung Nusantara—dari aroma rempah pasar pagi Flores hingga kabut mistis di puncak Bromo.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              href="/#planner"
              className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-8 py-3.5 sm:py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2 text-sm text-center"
            >
              <span>Mulai Rencanakan Perjalanan</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
            <Link
              href="/chat"
              className="bg-white hover:bg-[#1A1612] text-[#1A1612] hover:text-white px-8 py-3.5 sm:py-4 rounded-full font-semibold border border-[#1A1612]/15 transition-all text-sm inline-flex items-center justify-center gap-2 text-center"
            >
              <i className="fa-regular fa-comments text-[#E85D2F]"></i>
              <span>Ngobrol dengan AI Kami</span>
            </Link>
          </div>
        </div>

        {/* Ambient background blur */}
        <div className="absolute -top-24 -right-24 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#E85D2F]/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Story & Philosophy Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-3 block">Cerita Kami</span>
              <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                Menyelamatkan Jiwa Penjelajahan dari Rutinitas Klise.
              </h2>
              <p className="text-[#6B5D4F] leading-relaxed mb-6 text-sm sm:text-base">
                Terlalu banyak rekomendasi wisata di internet yang hanya memutar destinasi yang sama: spot foto buatan yang penuh antrean, restoran turis bertarif ganda, dan pengalaman seragam yang melupakan kehangatan tuan rumah.
              </p>
              <p className="text-[#6B5D4F] leading-relaxed text-sm sm:text-base">
                Kami membangun Kelana AI dengan satu keyakinan teguh: keajaiban Nusantara tersimpan di gang-gang sempit, warung kopi kayu tanpa plang nama, dan petuah sesepuh nelayan saat fajar menyingsing.
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 sm:gap-6">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-shadow ${
                    idx === 2 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#E85D2F]/10 flex items-center justify-center text-[#E85D2F] text-lg mb-6">
                    <i className={pillar.icon}></i>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold mb-3">{pillar.title}</h3>
                  <p className="text-[#6B5D4F] text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Profile Card */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white border-y border-[#1A1612]/10">
        <div className="max-w-[1200px] mx-auto">
          <div className="bg-[#1A1612] text-[#F4EFE6] rounded-3xl p-6 sm:p-10 lg:p-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 text-center md:text-left">
                <div className="relative inline-block">
                  <img
                    src="https://ui-avatars.com/api/?name=Marwan+Wisnu&background=E85D2F&color=F4EFE6&size=200&bold=true"
                    alt="Marwan Wisnu"
                    className="w-24 h-24 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-[#F4EFE6]/20 shadow-xl mx-auto md:mx-0"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-[#E85D2F] text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                    FOUNDER
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold mt-4 text-white">Marwan Wisnu</h3>
                <p className="text-xs font-mono text-[#E85D2F] tracking-wider uppercase mt-1">Creator & AI Engineer</p>
                <div className="mt-4">
                  <a
                    href="https://marwan-wisnu.my.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-mono text-[#F4EFE6]/70 hover:text-[#E85D2F] transition-colors underline decoration-[#F4EFE6]/30 hover:decoration-[#E85D2F]"
                  >
                    <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    marwan-wisnu.my.id
                  </a>
                </div>
              </div>

              <div className="md:col-span-8 border-t md:border-t-0 md:border-l border-[#F4EFE6]/15 pt-6 md:pt-0 md:pl-10">
                <i className="fa-solid fa-quote-left text-3xl text-[#E85D2F] mb-4 block opacity-80"></i>
                <blockquote className="font-display text-lg sm:text-2xl leading-relaxed text-[#F4EFE6] italic mb-6">
                  "Kami percaya pariwisata terbaik adalah yang menguntungkan penduduk lokal dan memperkaya batin pejalan, bukan sekadar transaksi ekonomi tanpa memori."
                </blockquote>
                <p className="text-xs sm:text-sm text-[#F4EFE6]/70 leading-relaxed">
                  Kelana AI dirancang dengan kecintaan mendalam pada tanah air Indonesia, memadukan kecerdasan komputasi modern dengan sentuhan jiwa humanis khas Nusantara.
                </p>
              </div>
            </div>

            {/* Subtle glow */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#E85D2F]/20 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Roadmap & Pillars */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-3 block">Prinsip Kami</span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold">Membangun Masa Depan Wisata Cerdas</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {milestones.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-sm relative">
                <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#F4EFE6] text-[#E85D2F] inline-block mb-4">
                  {item.year}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#6B5D4F] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
