'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { generateTrip } from '../services/tripService';

export default function Home() {
  const [destination, setDestination] = useState('Jakarta Pusat Johar');
  const [budget, setBudget] = useState('15000000');
  const [currency, setCurrency] = useState('IDR');
  const [days, setDays] = useState('7');
  const [travelStyle, setTravelStyle] = useState('budget');
  const [language, setLanguage] = useState('Indonesian');
  
  const [loading, setLoading] = useState(false);
  const [tripData, setTripData] = useState<any>(null);
  
  const [toastMsg, setToastMsg] = useState({ title: '', msg: '', visible: false });
  const [activeTab, setActiveTab] = useState('adventure');
  
  const [testiIdx, setTestiIdx] = useState(0);
  const testimonials = [
    {
      quote: "Kami percaya pariwisata terbaik adalah yang menguntungkan penduduk lokal, bukan rantai hotel internasional.",
      name: "Marwan Wisnu",
      role: "FOUNDER, KELANA AI",
      img: "https://ui-avatars.com/api/?name=Marwan+Wisnu&background=E85D2F&color=F4EFE6&size=100&bold=true"
    },
    {
      quote: "Itinerary dari AI ini sangat detail! Kami menemukan kedai kopi tersembunyi yang bahkan turis lain tidak tahu.",
      name: "Sarah L.",
      role: "PELANCONG, JAKARTA",
      img: "https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100&bold=true"
    },
    {
      quote: "Sangat mudah digunakan. Perjalanan ke Raja Ampat menjadi jauh lebih terorganisir dan sesuai dengan budget yang saya miliki.",
      name: "Andi Pratama",
      role: "DIGITAL NOMAD",
      img: "https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100&bold=true"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTestiIdx(prev => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Observer for Reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  });

  const showToast = (title: string, msg: string) => {
    setToastMsg({ title, msg, visible: true });
    setTimeout(() => {
      setToastMsg(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !budget || !days) return;
    
    setLoading(true);
    setTripData(null);

    try {
      const generatedTrip = await generateTrip({
        destination,
        budget: parseFloat(budget),
        currency: currency,
        days: parseInt(days, 10),
        travel_style: travelStyle,
        language
      });
      
      showToast('Trip berhasil dibuat!', `Itinerary ${days} hari di ${destination} siap.`);
      router.push('/trips');
    } catch (err: any) {
      console.error(err);
      showToast('Gagal', 'Terjadi kesalahan saat membuat itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const tabData: Record<string, any> = {
    adventure: {
      title: 'Untuk yang tak takut lelah.',
      desc: 'Mendaki gunung berapi aktif, menyusuri gua bawah tanah, atau mengarungi jeram sungai. Petualangan kami ditangani pemandu bersertifikat.',
      img: 'https://picsum.photos/seed/adventure-tab/800/700.jpg',
      stats: ['Pemandu Bersertifikat', 'Peralatan Standar Intl', 'Asuransi Tercover', 'Maks 8 Orang']
    },
    culture: {
      title: 'Duduk, dengar, dan mengerti.',
      desc: 'Tidur di rumah adat, belajar menenun dari para tetua. Bukan tur yang dilewatkan cepat — tapi pengalaman yang meresap.',
      img: 'https://picsum.photos/seed/culture-tab/800/700.jpg',
      stats: ['Tinggal dengan Komunitas', 'Bahasa Dipandu Ahli', 'Etika Tradisional', 'Kerajinan Tangan']
    },
    culinary: {
      title: 'Makan di tempatnya dibuat.',
      desc: 'Dari sate keliling di Yogyakarta sampai ikan bakar di rumah nelayan Madura. Beli bahan di pasar pagi, lalu masak bersama tuan rumah.',
      img: 'https://picsum.photos/seed/culinary-tab/800/700.jpg',
      stats: ['Kelas Masak Lokal', 'Pasar Tradisional', 'Vegetarian & Halal', 'Bukan Turist Trap']
    },
    wellness: {
      title: 'Pelan, dalam, dan tenang.',
      desc: 'Meditasi di atas bukit dengan kabut masih menempel. Yoga subuh di tepi sawah. Atau sekadar diam — tanpa jadwal, tanpa notifikasi.',
      img: 'https://picsum.photos/seed/wellness-tab/800/700.jpg',
      stats: ['Jauh dari Keramaian', 'Instruktur Yoga', 'Makanan Organik', 'Tanpa Jadwal Padat']
    }
  };

  const activeTabData = tabData[activeTab];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen pt-28 pb-12 overflow-hidden">
        <div className="particle" style={{ top: '20%', left: '80%', width: '8px', height: '8px', animationDelay: '0s' }}></div>
        <div className="particle" style={{ top: '60%', left: '10%', width: '12px', height: '12px', animationDelay: '2s', background: '#E85D2F' }}></div>
        <div className="particle" style={{ top: '80%', left: '90%', width: '6px', height: '6px', animationDelay: '4s' }}></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-12 h-px bg-[#1A1612]"></span>
            <span className="section-num">001 — Perkenalan</span>
          </div>
          
          <h1 className="hero-title">
            Jelajah <em>nusantara</em><br/>
            <span className="text-stroke">temukan</span> diri.
          </h1>
          
          <div className="grid lg:grid-cols-12 gap-8 mt-16 items-end">
            <div className="lg:col-span-5">
              <p className="text-lg leading-relaxed text-[#1A1612]/80">
                Bukan sekadar liburan. Setiap perjalanan kami dirancang oleh pemandu lokal yang tahu jalan pulang ke rumahnya — lewat jalan setapak, pasar tradisional, dan senja yang berbeda di setiap pesisir.
              </p>
              
              <div className="flex items-center gap-6 mt-8">
                <div>
                  <div className="font-mono text-xs text-[#6B5D4F] mb-1">PELANCONG</div>
                  <div className="font-display text-3xl font-bold">12K+</div>
                </div>
                <div className="w-px h-12 bg-[#1A1612]/20"></div>
                <div>
                  <div className="font-mono text-xs text-[#6B5D4F] mb-1">DESTINASI</div>
                  <div className="font-display text-3xl font-bold">86</div>
                </div>
                <div className="w-px h-12 bg-[#1A1612]/20"></div>
                <div>
                  <div className="font-mono text-xs text-[#6B5D4F] mb-1">RATING</div>
                  <div className="font-display text-3xl font-bold">4.9</div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 relative h-[400px] lg:h-[500px]">
              <div className="absolute top-0 right-0 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl" style={{ transform: 'rotate(4deg)' }}>
                <img src="https://picsum.photos/seed/bali-hero/500/700.jpg" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="absolute top-32 left-0 w-56 h-64 rounded-3xl overflow-hidden shadow-2xl" style={{ transform: 'rotate(-6deg)' }}>
                <img src="https://picsum.photos/seed/flores-hero/400/500.jpg" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="absolute bottom-0 right-1/3 w-48 h-48 rounded-3xl overflow-hidden shadow-2xl" style={{ transform: 'rotate(8deg)' }}>
                <img src="https://picsum.photos/seed/raja-hero/400/400.jpg" className="w-full h-full object-cover" alt="" />
              </div>
              
              <div className="absolute top-10 left-1/3 glass-card rounded-2xl p-4 shadow-xl w-52" style={{ transform: 'rotate(5deg)' }}>
                <div className="flex items-center gap-1 mb-2">
                  <i className="fa-solid fa-star text-[#D4A24C] text-xs"></i>
                  <i className="fa-solid fa-star text-[#D4A24C] text-xs"></i>
                  <i className="fa-solid fa-star text-[#D4A24C] text-xs"></i>
                  <i className="fa-solid fa-star text-[#D4A24C] text-xs"></i>
                  <i className="fa-solid fa-star text-[#D4A24C] text-xs"></i>
                </div>
                <p className="text-sm font-medium text-[#1A1612]">"Perjalanan terbaik seumur hidup saya."</p>
                <p className="text-xs text-[#6B5D4F] mt-2 font-mono">— Dewi, Jakarta</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#6B5D4F] text-xs flex flex-col items-center gap-2" style={{ animation: 'scroll-bounce 2s ease-in-out infinite' }}>
          <span className="font-mono tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-[#1A1612]/30"></div>
        </div>
      </section>

      {/* Marquee */}
      <section className="bg-[#1A1612] py-6 overflow-hidden">
        <div className="marquee-track text-[#F4EFE6]">
          <span className="font-display text-2xl font-bold italic">Bali</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold">Labuan Bajo</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold italic">Raja Ampat</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold">Bromo</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold italic">Danau Toba</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold">Lombok</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold italic">Bali</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold">Labuan Bajo</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold italic">Raja Ampat</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold">Bromo</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold italic">Danau Toba</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
          <span className="font-display text-2xl font-bold">Lombok</span>
          <i className="fa-solid fa-circle text-[8px] text-[#E85D2F]"></i>
        </div>
      </section>

      {/* AI Trip Planner */}
      <section id="planner" className="py-24 lg:py-32 relative overflow-hidden bg-[#F4EFE6]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 reveal">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-[#1A1612]"></span>
                <span className="section-num">002 — Perencanaan</span>
              </div>
              <h2 className="editorial-title">
                Buat <em>trip</em> sesuka<br/>hati Anda.
              </h2>
            </div>
            <p className="text-[#6B5D4F] text-lg max-w-md leading-relaxed">
              Isi preferensi Anda di bawah ini, dan biarkan AI kami menyusun itinerary harian yang realistis dengan harga transparan.
            </p>
          </div>
          
          <div className="planner-card p-8 lg:p-12 reveal">
            <div className="grid lg:grid-cols-2 gap-12 relative z-10">
              {/* Form Side */}
              <div>
                <h3 className="font-display text-3xl font-bold mb-2">Plan Your Trip</h3>
                <p className="text-[#6B5D4F] text-sm mb-8">Isi detail di bawah untuk memulai.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-[#6B5D4F]">Destinasi</label>
                    <input 
                      type="text" 
                      value={destination} 
                      onChange={e => setDestination(e.target.value)}
                      required
                      className="input-line" 
                       
                      
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="font-mono text-xs uppercase tracking-widest text-[#6B5D4F] mb-1 block">Budget</label>
                      <div className="flex items-center gap-3">
                        <select 
                          className="bg-transparent border-b border-[#1A1612]/20 text-[#1A1612] py-2 font-mono text-sm focus:outline-none focus:border-[#E85D2F] cursor-hover-target"
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <option value="IDR">IDR</option>
                          <option value="USD">USD</option>
                        </select>
                        <input 
                          type="text" 
                          value={budget ? new Intl.NumberFormat(currency === 'IDR' ? 'id-ID' : 'en-US').format(Number(budget)) : ''} 
                          onChange={e => setBudget(e.target.value.replace(/\D/g, ''))}
                          required
                          className="input-line w-full cursor-hover-target" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-xs uppercase tracking-widest text-[#6B5D4F]">Durasi (Hari)</label>
                      <input 
                        type="number" 
                        value={days} 
                        onChange={e => setDays(e.target.value)}
                        required
                        className="input-line" 
                         
                        
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-[#6B5D4F]">Gaya Perjalanan</label>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {['budget', 'luxury', 'adventure', 'cultural', 'relaxation'].map(style => (
                        <button 
                          key={style}
                          type="button"
                          onClick={() => setTravelStyle(style)}
                          className={`style-tag ${travelStyle === style ? 'active' : ''}`}
                           
                          
                        >
                          {style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="font-mono text-xs uppercase tracking-widest text-[#6B5D4F]">Bahasa Pemandu</label>
                    <select 
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      className="input-line" 
                      style={{ appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%231A1612' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
                       
                      
                    >
                      <option value="Indonesian">Indonesian</option>
                      <option value="English">English</option>
                      <option value="Mandarin">Mandarin</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-4 rounded-full font-bold text-base mt-4 flex items-center justify-center gap-3 cursor-hover-target"
                  >
                    <span className="flex items-center gap-3">
                      {loading ? 'Menyusun Itinerary...' : 'Generate AI Trip'}
                      {!loading && <i className="fa-solid fa-arrow-right"></i>}
                    </span>
                  </button>
                </form>
              </div>
              
              {/* Result Side */}
              <div className="bg-[#F4EFE6] rounded-2xl p-6 lg:p-8 relative overflow-hidden min-h-[400px]">
                {!tripData && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center text-[#6B5D4F]">
                    <div className="w-16 h-16 rounded-full bg-[#1A1612]/5 flex items-center justify-center mb-4">
                      <i className="fa-solid fa-wand-magic-sparkles text-2xl text-[#E85D2F]"></i>
                    </div>
                    <p className="font-medium max-w-xs">Itinerary yang dihasilkan AI akan muncul di sini. Klik tombol generate untuk memulai!</p>
                  </div>
                )}
                
                {tripData && !loading && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="font-mono text-xs text-[#6B5D4F] mb-1">ITINERARY ANDA</div>
                        <h4 className="font-display text-2xl font-bold">{tripData.destination}</h4>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-xs text-[#6B5D4F] mb-1">ESTIMASI</div>
                        <div className="font-display text-xl font-bold text-[#E85D2F]">
                          {tripData.currency === 'IDR' ? 'Rp' : '$'} {Number(tripData.budget).toLocaleString(tripData.currency === 'IDR' ? 'id-ID' : 'en-US')}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 markdown-content text-sm">
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }) {
                            const content = String(children).trim();
                            if (content.startsWith('icon:')) {
                              const iconClass = content.replace('icon:', '').trim();
                              return <i className={`${iconClass} text-[#E85D2F] mr-2`}></i>;
                            }
                            return <code className={className} {...props}>{children}</code>;
                          }
                        }}
                      >
                        {(tripData.ai_recommendation || "").replace(/icon:(fa-[a-z0-9-]+ fa-[a-z0-9-]+)/g, '`icon:$1`')}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {loading && (
                  <div className="absolute inset-0 bg-[#F4EFE6]/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                    <div className="w-12 h-12 border-4 border-[#1A1612]/20 border-t-[#E85D2F] rounded-full animate-spin"></div>
                    <p className="mt-4 font-mono text-sm text-[#6B5D4F]">AI sedang berpikir...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Bento Grid */}
      <section id="destinations" className="py-24 lg:py-32 bg-[#E8DFC9]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <div className="reveal">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-[#1A1612]"></span>
                <span className="section-num">003 — Pilihan Destinasi</span>
              </div>
              <h2 className="editorial-title">
                Tempat-tempat yang <em>bercerita</em>.
              </h2>
            </div>
            <div className="flex items-end reveal">
              <p className="text-lg leading-relaxed text-[#6B5D4F]">
                Dari Sabang sampai Merauke, kami hanya menampilkan sudut yang membuat Anda ingin tinggal lebih lama. Dipilih oleh tim editorial kami, bukan algoritma.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-12 gap-4 lg:gap-6 auto-rows-[240px]">
            <Link href="#bromo" className="bento-card block col-span-12 lg:col-span-8 row-span-2 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/bromo-bento/900/700.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                <div className="card-overlay mb-4">
                  <p className="max-w-md text-white/80">Lihat matahari terbit dari atas lautan pasir, lalu mendaki kawah aktif yang masih mengeluarkan asap tebal.</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-mono text-xs text-white/60 mb-2">JAWA TIMUR</div>
                    <h3 className="font-display font-black text-4xl lg:text-6xl leading-none group-hover:text-[#E85D2F] transition-colors">Bromo Tengger</h3>
                    <div className="mt-3 font-mono text-sm">Mulai IDR 1.850K · 3 Hari</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#E85D2F] flex items-center justify-center transition-transform hover:scale-110">
                    <i className="fa-solid fa-arrow-right text-white"></i>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="#raja-ampat" className="bento-card block col-span-12 sm:col-span-6 lg:col-span-4 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/raja-bento/600/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">PAPUA BARAT DAYA</div>
                <h3 className="font-display font-bold text-3xl group-hover:text-[#E85D2F] transition-colors">Raja Ampat</h3>
                <div className="font-mono text-sm mt-2">Mulai IDR 8.500K</div>
              </div>
            </Link>
            
            <Link href="#toba" className="bento-card block col-span-12 sm:col-span-6 lg:col-span-4 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/toba-bento/600/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">SUMATERA UTARA</div>
                <h3 className="font-display font-bold text-3xl group-hover:text-[#E85D2F] transition-colors">Danau Toba</h3>
                <div className="font-mono text-sm mt-2">Mulai IDR 2.200K</div>
              </div>
            </Link>
            
            <Link href="#labuan-bajo" className="bento-card block col-span-6 lg:col-span-4 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/komodo-bento/500/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">NTT</div>
                <h3 className="font-display font-bold text-2xl group-hover:text-[#E85D2F] transition-colors">Labuan Bajo</h3>
                <div className="font-mono text-xs mt-2">IDR 5.400K</div>
              </div>
            </Link>
            
            <Link href="#ubud" className="bento-card block col-span-6 lg:col-span-4 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/bali-bento/500/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">BALI</div>
                <h3 className="font-display font-bold text-2xl group-hover:text-[#E85D2F] transition-colors">Ubud & Sekitar</h3>
                <div className="font-mono text-xs mt-2">IDR 1.500K</div>
              </div>
            </Link>
            
            <Link href="#gili" className="bento-card block col-span-12 lg:col-span-4 reveal cursor-hover-target">
              <img src="https://picsum.photos/seed/lombok-bento/500/400.jpg" className="absolute inset-0 w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="font-mono text-xs text-white/60 mb-1">NTB</div>
                <h3 className="font-display font-bold text-2xl group-hover:text-[#E85D2F] transition-colors">Gili Trawangan</h3>
                <div className="font-mono text-xs mt-2">IDR 1.800K</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Experiences (Tabs) */}
      <section id="experiences" className="py-24 lg:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 reveal">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-[#1A1612]"></span>
                <span className="section-num">004 — Pengalaman</span>
              </div>
              <h2 className="editorial-title mb-12">
                Cara Anda<br/><em>menjelajah</em>.
              </h2>
              
              <div className="space-y-2">
                {['adventure', 'culture', 'culinary', 'wellness'].map(tab => (
                  <button 
                    key={tab}
                    className={`tab-btn w-full text-left ${activeTab === tab ? 'active' : ''}`} 
                    onClick={() => setActiveTab(tab)}
                     
                    
                  >
                    <span className="dot"></span> {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-8 reveal">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-8 zoom-container"  >
                <img src={activeTabData.img} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" alt="" />
                <div className="absolute top-6 right-6 glass-card px-4 py-2 rounded-full font-mono text-xs">
                  {activeTab.toUpperCase()}
                </div>
              </div>
              <h3 className="font-display text-4xl lg:text-5xl font-bold mb-4 leading-tight">{activeTabData.title}</h3>
              <p className="text-[#6B5D4F] text-lg mb-8">{activeTabData.desc}</p>
              <div className="grid grid-cols-2 gap-3">
                {activeTabData.stats.map((s: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#F4EFE6] rounded-2xl p-4">
                    <div className="w-8 h-8 rounded-full bg-[#E85D2F]/10 text-[#E85D2F] flex items-center justify-center">
                      <i className="fa-solid fa-check text-sm"></i>
                    </div>
                    <span className="font-medium text-sm">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Quote / Stats */}
      <section className="py-20 bg-[#0E4F4A] text-[#F4EFE6] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="reveal min-h-[300px] flex flex-col justify-center">
              <i className="fa-solid fa-quote-left text-5xl text-[#E85D2F] mb-6"></i>
              <div key={testiIdx} className="animate-fade-in">
                <p className="font-display text-3xl lg:text-4xl font-light italic leading-tight mb-8">
                  "{testimonials[testiIdx].quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img src={testimonials[testiIdx].img} className="w-12 h-12 rounded-full object-cover shadow-lg" alt="" />
                  <div>
                    <div className="font-semibold">{testimonials[testiIdx].name}</div>
                    <div className="text-sm text-[#F4EFE6]/60 font-mono">{testimonials[testiIdx].role}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 reveal">
              <div className="border-l border-[#F4EFE6]/30 pl-6">
                <div className="font-display font-black text-6xl mb-2">12K+</div>
                <div className="text-[#F4EFE6]/60">Pelancong senang</div>
              </div>
              <div className="border-l border-[#F4EFE6]/30 pl-6">
                <div className="font-display font-black text-6xl mb-2">86</div>
                <div className="text-[#F4EFE6]/60">Destinasi aktif</div>
              </div>
              <div className="border-l border-[#F4EFE6]/30 pl-6">
                <div className="font-display font-black text-6xl mb-2">248</div>
                <div className="text-[#F4EFE6]/60">Trip tersusun</div>
              </div>
              <div className="border-l border-[#F4EFE6]/30 pl-6">
                <div className="font-display font-black text-6xl mb-2">34</div>
                <div className="text-[#F4EFE6]/60">Pemandu lokal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journal / Stories */}
      <section id="journal" className="py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 reveal">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-px bg-[#1A1612]"></span>
                <span className="section-num">005 — Jurnal</span>
              </div>
              <h2 className="editorial-title">
                Cerita <em>pelancong</em>.
              </h2>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/journal/pagi-yang-tak-terlupakan-di-pulau-padar" className="reveal group cursor-none block"  >
              <article>
                <div className="overflow-hidden rounded-3xl mb-4 aspect-[3/4]">
                  <img src="https://picsum.photos/seed/story1/400/500.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                </div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#6B5D4F]">
                  <span>LABUAN BAJO</span> · <span>5 MIN BACA</span>
                </div>
                <h3 className="font-display font-bold text-2xl leading-tight group-hover:text-[#E85D2F] transition-colors">Pagi yang tak terlupakan di Pulau Padar</h3>
                <p className="text-[#6B5D4F] mt-2">Bagaimana mendaki di kegelapan subuh membawa saya pada pemandangan terbaik seumur hidup.</p>
              </article>
            </Link>
            
            <Link href="/journal/mitos-dan-kawah-tengger" className="reveal group cursor-none block"  >
              <article>
                <div className="overflow-hidden rounded-3xl mb-4 aspect-[3/4]">
                  <img src="https://picsum.photos/seed/story2/400/500.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                </div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#6B5D4F]">
                  <span>BROMO</span> · <span>8 MIN BACA</span>
                </div>
                <h3 className="font-display font-bold text-2xl leading-tight group-hover:text-[#E85D2F] transition-colors">Mitos dan kawah Tengger yang masih hidup</h3>
                <p className="text-[#6B5D4F] mt-2">Sebuah perjalanan spiritual menyusuri desa-desa di kaki gunung berapi paling ikonik Indonesia.</p>
              </article>
            </Link>
            
            <Link href="/journal/hidup-di-atas-air-empat-hari" className="reveal group cursor-none block"  >
              <article>
                <div className="overflow-hidden rounded-3xl mb-4 aspect-[3/4]">
                  <img src="https://picsum.photos/seed/story3/400/500.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                </div>
                <div className="flex items-center gap-2 mb-2 font-mono text-xs text-[#6B5D4F]">
                  <span>RAJA AMPAT</span> · <span>6 MIN BACA</span>
                </div>
                <h3 className="font-display font-bold text-2xl leading-tight group-hover:text-[#E85D2F] transition-colors">Hidup di atas air selama empat hari</h3>
                <p className="text-[#6B5D4F] mt-2">Pengalaman tinggal di homestay apung dan menyelam di terumbu paling kaya di dunia.</p>
              </article>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-[#1A1612] text-[#F4EFE6] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-8 reveal">
            <span className="w-12 h-px bg-[#F4EFE6]"></span>
            <span className="font-mono text-xs tracking-widest">SAATNYA BERANGKAT</span>
            <span className="w-12 h-px bg-[#F4EFE6]"></span>
          </div>
          <div className="flex flex-col items-center justify-center gap-8 mb-8 reveal">
            <img src="/logo-kelanaai.png" alt="Kelana AI Logo" className="h-28 md:h-36 lg:h-48 w-auto object-contain brightness-0 invert opacity-90" />
            <em className="font-display font-light italic text-4xl lg:text-6xl text-[#F4EFE6]/90">Selalu menunggu.</em>
          </div>
          <p className="text-lg text-[#F4EFE6]/60 max-w-xl mx-auto mb-12 reveal">
            Berlangganan buletin kami untuk mendapatkan inspirasi perjalanan bulanan dan kode promo eksklusif.
          </p>
          
          <form 
            onSubmit={(e) => { e.preventDefault(); showToast('Berlangganan berhasil', 'Email inspirasi bulanan akan segera tiba.'); }} 
            className="flex max-w-md mx-auto gap-2 reveal"
          >
            <input 
              type="email" 
              placeholder="email@anda.com" 
              required
              className="flex-1 bg-transparent border border-[#F4EFE6]/30 rounded-full px-6 py-4 outline-none focus:border-[#E85D2F] transition-colors placeholder-[#F4EFE6]/40" 
               
              
            />
            <button 
              type="submit" 
              className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-8 py-4 rounded-full font-semibold transition-colors"
               
              
            >
              Berlangganan
            </button>
          </form>
        </div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#E85D2F]/10 blur-3xl"></div>
      </section>

      {/* Footer */}
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
                <li><a href="#" className="hover:text-[#E85D2F]"  >Bali</a></li>
                <li><a href="#" className="hover:text-[#E85D2F]"  >Labuan Bajo</a></li>
                <li><a href="#" className="hover:text-[#E85D2F]"  >Raja Ampat</a></li>
                <li><a href="#" className="hover:text-[#E85D2F]"  >Bromo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F4EFE6] font-semibold mb-4 text-sm">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#E85D2F]"  >Tentang kami</a></li>
                <li><a href="#" className="hover:text-[#E85D2F]"  >Karir</a></li>
                <li><a href="#" className="hover:text-[#E85D2F]"  >Blog</a></li>
                <li><a href="#" className="hover:text-[#E85D2F]"  >Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#F4EFE6] font-semibold mb-4 text-sm">Ikuti</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-colors"  >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-colors"  >
                  <i className="fa-brands fa-tiktok"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-[#F4EFE6]/20 flex items-center justify-center hover:bg-[#E85D2F] hover:border-[#E85D2F] transition-colors"  >
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

      {/* Toast Notification */}
      <div 
        id="toast"
        className="fixed bottom-8 right-8 bg-[#1A1612] text-[#F4EFE6] p-4 px-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] z-[1000] flex items-center gap-4 max-w-[350px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ transform: toastMsg.visible ? 'translateY(0)' : 'translateY(150%)' }}
      >
        <div className="w-8 h-8 rounded-full bg-[#E85D2F] flex items-center justify-center flex-shrink-0">
          <i className="fa-solid fa-check text-sm"></i>
        </div>
        <div>
          <div className="font-semibold text-sm">{toastMsg.title}</div>
          <div className="text-xs text-[#F4EFE6]/60">{toastMsg.msg}</div>
        </div>
      </div>
    </>
  );
}
