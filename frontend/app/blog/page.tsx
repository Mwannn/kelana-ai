'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

interface Post {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  snippet: string;
  image: string;
  featured?: boolean;
}

export default function BlogPage() {
  const [selectedCat, setSelectedCat] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  const posts: Post[] = [
    {
      id: '1',
      slug: 'hidden-gems-labuan-bajo',
      title: '5 Sudut Sunyi di Labuan Bajo yang Belum Ramai di Media Sosial',
      category: 'Petualangan',
      date: '4 Mar 2026',
      readTime: '6 menit',
      author: {
        name: 'Marwan Wisnu',
        avatar: 'https://ui-avatars.com/api/?name=Marwan+Wisnu&background=E85D2F&color=F4EFE6&size=100'
      },
      snippet: 'Lepaskan diri dari kerumunan kapal phinisi komersil. Kami merangkum teluk tersembunyi berpasir merah muda dan bukit savana tanpa suara deru mesin.',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
      featured: true
    },
    {
      id: '2',
      slug: 'panduan-budget-jogja-5-hari',
      title: 'Panduan Anggaran 5 Hari di Yogyakarta: Dari Gudeg Mbok Lindu Hingga Parangtritis',
      category: 'Budgeting',
      date: '28 Feb 2026',
      readTime: '8 menit',
      author: {
        name: 'Sarah L.',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
      },
      snippet: 'Rincian pengeluaran realistis di bawah Rp 2.500.000 untuk menikmati warisan sejarah, kopi jos stasiun tugu, dan penginapan bernuansa Jawa kuno.',
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      slug: 'filosofi-kopi-tubruk-flores',
      title: 'Filosofi Kopi Juria & Kehangatan Dapur Rumah Adat Bajawa',
      category: 'Kuliner',
      date: '20 Feb 2026',
      readTime: '5 menit',
      author: {
        name: 'Andi Pratama',
        avatar: 'https://ui-avatars.com/api/?name=Andi+Pratama&background=0E4F4A&color=F4EFE6&size=100'
      },
      snippet: 'Menyusuri dataran tinggi Flores untuk menyesap seduhan kopi langka yang dipetik dari pohon berusia puluhan tahun oleh tangan mama-mama Ngada.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      slug: 'etika-desa-adat-toraja',
      title: 'Etika Berkunjung ke Tana Toraja: Panduan Menghargai Upacara Rambu Solo',
      category: 'Budaya',
      date: '15 Feb 2026',
      readTime: '7 menit',
      author: {
        name: 'Marwan Wisnu',
        avatar: 'https://ui-avatars.com/api/?name=Marwan+Wisnu&background=E85D2F&color=F4EFE6&size=100'
      },
      snippet: 'Memahami makna spiritual di balik upacara penghormatan leluhur, pakaian yang pantas, dan cara membawa buah tangan yang sopan.',
      image: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      slug: 'packing-list-bromo-musim-dingin',
      title: 'Daftar Perlengkapan Wajib untuk Menembus Dinginnya Savana Bromo',
      category: 'Petualangan',
      date: '10 Feb 2026',
      readTime: '4 menit',
      author: {
        name: 'Sarah L.',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=1A1612&color=F4EFE6&size=100'
      },
      snippet: 'Suhu Bromo bisa menyentuh angka 5°C sebelum subuh. Berikut lapisan pakaian dan perlengkapan kamera agar tidak membeku saat berburu matahari terbit.',
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const categories = ['Semua', 'Petualangan', 'Budgeting', 'Kuliner', 'Budaya'];

  const filteredPosts = posts.filter((p) => {
    const matchCat = selectedCat === 'Semua' || p.category === selectedCat;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filteredPosts.find((p) => p.featured) || filteredPosts[0];
  const listPosts = filteredPosts.filter((p) => p.id !== featured?.id);

  return (
    <div className="bg-[#F4EFE6] text-[#1A1612] font-sans min-h-screen selection:bg-[#E85D2F] selection:text-white">
      {/* Hero Header */}
      <section className="pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 border-b border-[#1A1612]/10 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#E85D2F]/10 border border-[#E85D2F]/20 text-[#E85D2F] text-xs font-mono tracking-wider uppercase mb-6">
            <i className="fa-solid fa-book-open text-[11px]"></i> Jurnal & Cerita Kelana
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1A1612] max-w-3xl mb-6 leading-[1.1]">
            Kisah, Rasa, dan Catatan Nyata dari <span className="italic font-normal text-[#E85D2F]">Pelosok Negeri.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#6B5D4F] max-w-2xl leading-relaxed mb-8 sm:mb-10">
            Kumpulan panduan teruji, wawancara bersama warga lokal, serta tips cerdas memaksimalkan petualanganmu di Indonesia.
          </p>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-[#1A1612]/10">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-[#E85D2F] text-white shadow-xs'
                      : 'bg-white text-[#6B5D4F] hover:bg-[#1A1612] hover:text-white border border-[#1A1612]/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-auto md:min-w-[280px]">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#6B5D4F]"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, topik, atau lokasi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#1A1612]/15 text-xs focus:outline-none focus:border-[#E85D2F] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Feed Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Featured Post */}
          {featured && (
            <div className="mb-12 sm:mb-16">
              <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-4 block">Artikel Unggulan</span>
              <div className="bg-white rounded-3xl overflow-hidden border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-shadow grid lg:grid-cols-12 gap-0">
                <div className="lg:col-span-7 relative h-64 sm:h-72 lg:h-auto min-h-[240px] sm:min-h-[320px] overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-[#1A1612]/80 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded-full uppercase">
                    {featured.category}
                  </span>
                </div>

                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#6B5D4F] font-mono mb-3">
                      <span>{featured.date}</span>
                      <span>•</span>
                      <span>{featured.readTime} baca</span>
                    </div>

                    <h2 className="font-display text-xl sm:text-3xl font-bold leading-snug mb-4 hover:text-[#E85D2F] transition-colors">
                      {featured.title}
                    </h2>

                    <p className="text-[#6B5D4F] text-sm leading-relaxed mb-6">
                      {featured.snippet}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[#1A1612]/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={featured.author.avatar}
                        alt={featured.author.name}
                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-full object-cover border border-[#1A1612]/10"
                      />
                      <span className="text-xs font-semibold text-[#1A1612]">{featured.author.name}</span>
                    </div>

                    <Link
                      href="/#planner"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#E85D2F] hover:text-[#C8431C] transition-colors font-mono"
                    >
                      <span>Rencanakan ke Sini</span>
                      <i className="fa-solid fa-arrow-right text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {listPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                <div className="relative h-52 sm:h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#1A1612] text-[10px] font-mono px-3 py-1 rounded-full uppercase font-bold">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6B5D4F] font-mono mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-display text-xl font-bold leading-snug mb-3 group-hover:text-[#E85D2F] transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-[#6B5D4F] text-xs leading-relaxed mb-6">
                      {post.snippet}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1A1612]/10">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-[#1A1612]">{post.author.name}</span>
                    </div>

                    <Link
                      href="/chat"
                      className="text-xs font-bold text-[#E85D2F] hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>Tanya AI</span>
                      <i className="fa-solid fa-angle-right text-[10px]"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="bg-white rounded-3xl p-16 text-center max-w-md mx-auto border border-[#1A1612]/10">
              <i className="fa-solid fa-compass text-4xl text-[#6B5D4F] mb-4"></i>
              <h3 className="font-display text-xl font-bold mb-2">Tidak Ada Artikel</h3>
              <p className="text-xs text-[#6B5D4F]">Tidak ada artikel yang cocok dengan pencarian kata kunci tersebut.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
