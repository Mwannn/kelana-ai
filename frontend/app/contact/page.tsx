'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Pertanyaan Umum',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: 'Pertanyaan Umum',
        message: ''
      });
    }, 800);
  };

  const contactChannels = [
    {
      icon: 'fa-regular fa-envelope',
      title: 'Kirim Email',
      value: 'halo@kelana-ai.com',
      subtext: 'Balasan biasanya dalam waktu 1x24 jam',
      actionText: 'Kirim Email',
      href: 'mailto:halo@kelana-ai.com'
    },
    {
      icon: 'fa-brands fa-whatsapp',
      title: 'WhatsApp Concierge',
      value: '+62 812-3456-7890',
      subtext: 'Senin - Jumat, 09:00 - 18:00 WIB',
      actionText: 'Chat WhatsApp',
      href: 'https://wa.me/6281234567890'
    },
    {
      icon: 'fa-solid fa-location-dot',
      title: 'Studio Kreatif',
      value: 'Jakarta Pusat & Bali',
      subtext: 'Indonesia',
      actionText: 'Buka Peta',
      href: 'https://maps.google.com'
    }
  ];

  const faqs = [
    {
      q: 'Apakah itinerary yang dibuat Kelana AI gratis?',
      a: 'Ya, Anda dapat membuat dan merancang rencana perjalanan sebanyak yang Anda butuhkan tanpa dipungut biaya langganan.'
    },
    {
      q: 'Bagaimana cara AI merekomendasikan hidden gems?',
      a: 'Model AI kami diintegrasikan dengan basis pengetahuan terverifikasi dari penjelajah lokal, ulasan autentik, dan data geografis terkini dari pelosok Indonesia.'
    },
    {
      q: 'Apakah bisa mengajukan kerjasama promosi desa wisata?',
      a: 'Tentu saja! Kami sangat bersemangat mempromosikan inisiatif pariwisata berbasis komunitas dan desa wisata. Pilih subjek "Kerjasama Destinasi" pada form.'
    }
  ];

  return (
    <div className="bg-[#F4EFE6] text-[#1A1612] font-sans min-h-screen selection:bg-[#E85D2F] selection:text-white">
      {/* Header Section */}
      <section className="pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 border-b border-[#1A1612]/10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E85D2F]/10 border border-[#E85D2F]/20 text-[#E85D2F] text-xs font-mono tracking-wider uppercase mb-6">
            <i className="fa-regular fa-paper-plane text-[11px]"></i> Hubungi Kami
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1612] max-w-3xl mb-6 leading-[1.1]">
            Mari Berbincang. Pintu Kami <span className="italic font-normal text-[#E85D2F]">Selalu Terbuka.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B5D4F] max-w-2xl leading-relaxed">
            Punya pertanyaan seputar itinerary, masukan untuk AI kami, atau ingin berkolaborasi memajukan pariwisata lokal? Tim kami siap menyambut Anda.
          </p>
        </div>

        <div className="absolute -bottom-24 -right-24 w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#E85D2F]/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* Contact Channels (Left Column) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-2 block">Kanal Komunikasi</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Terhubung Langsung</h2>
                <p className="text-[#6B5D4F] text-sm leading-relaxed mb-6">
                  Pilih jalur komunikasi yang paling nyaman bagi Anda. Kami berupaya membalas setiap pesan dengan penuh perhatian.
                </p>
              </div>

              <div className="space-y-4">
                {contactChannels.map((channel, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-[#E85D2F]/10 flex items-center justify-center text-[#E85D2F] text-lg flex-shrink-0">
                      <i className={channel.icon}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-bold text-[#1A1612]">{channel.title}</h3>
                      <div className="text-sm font-semibold text-[#1A1612] my-0.5 break-all">{channel.value}</div>
                      <p className="text-xs text-[#6B5D4F] mb-3">{channel.subtext}</p>
                      <a
                        href={channel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-[#E85D2F] hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{channel.actionText}</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Founder Direct Portfolio Link */}
              <div className="bg-[#1A1612] text-[#F4EFE6] rounded-3xl p-5 sm:p-6 border border-[#F4EFE6]/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono text-[#E85D2F] font-bold uppercase">Creator Portfolio</div>
                  <div className="font-display text-base sm:text-lg font-bold text-white">Marwan Wisnu</div>
                  <div className="text-xs text-[#F4EFE6]/60">Founder & AI Engineer</div>
                </div>
                <a
                  href="https://marwan-wisnu.my.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#E85D2F] hover:bg-[#C8431C] text-white p-3 rounded-full transition-colors flex items-center justify-center w-10 h-10"
                >
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </a>
              </div>
            </div>

            {/* Contact Form (Right Column) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#1A1612]/10 shadow-sm relative">
                {submitted ? (
                  <div className="py-12 text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6 text-2xl">
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-3">Pesan Berhasil Terkirim!</h3>
                    <p className="text-[#6B5D4F] text-sm leading-relaxed max-w-md mx-auto mb-8">
                      Terima kasih telah menghubungi Kelana AI. Tim kami telah menerima pesan Anda dan akan merespons melalui email secepatnya.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-[#1A1612] text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-[#E85D2F] transition-colors"
                    >
                      Kirim Pesan Lainnya
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-6 sm:mb-8">
                      <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-1 block">Formulir Pesan</span>
                      <h2 className="font-display text-xl sm:text-2xl font-bold">Kirim Pesan ke Tim Kami</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1A1612]">
                            Nama Lengkap <span className="text-[#E85D2F]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Contoh: Raden Wijaya"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] text-sm transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1A1612]">
                            Alamat Email <span className="text-[#E85D2F]">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] text-sm transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1A1612]">
                          Subjek Keperluan
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] text-sm transition-colors cursor-pointer"
                        >
                          <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                          <option value="Kerjasama Destinasi / Desa Wisata">Kerjasama Destinasi / Desa Wisata</option>
                          <option value="Kemitraan Bisnis & Sponsor">Kemitraan Bisnis & Sponsor</option>
                          <option value="Masukan & Bug Report">Masukan & Bug Report</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#1A1612]">
                          Isi Pesan <span className="text-[#E85D2F]">*</span>
                        </label>
                        <textarea
                          required
                          rows={5}
                          placeholder="Tuliskan pesan, pertanyaan, atau ide kolaborasi Anda di sini..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full px-4 py-3 bg-[#F4EFE6] border border-transparent rounded-xl focus:outline-none focus:border-[#E85D2F] text-sm transition-colors resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#E85D2F] hover:bg-[#C8431C] text-white py-3.5 sm:py-4 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Mengirim...</span>
                          </>
                        ) : (
                          <>
                            <span>Kirim Pesan Sekarang</span>
                            <i className="fa-solid fa-paper-plane text-xs"></i>
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-12 bg-white border-t border-[#1A1612]/10">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-2 block">Bantuan Cepat</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Pertanyaan yang Sering Diajukan</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-[#F4EFE6]/50 rounded-2xl p-5 sm:p-6 border border-[#1A1612]/10">
                <h3 className="font-display text-lg font-bold text-[#1A1612] mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E85D2F]/15 text-[#E85D2F] text-xs flex items-center justify-center font-mono font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  {faq.q}
                </h3>
                <p className="text-[#6B5D4F] text-sm leading-relaxed pl-8">{faq.a}</p>
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
