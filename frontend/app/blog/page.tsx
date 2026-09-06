'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { BLOG_POSTS, BlogPost } from '@/data/blogs';

export default function BlogPage() {
  const [selectedCat, setSelectedCat] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Semua', 'Petualangan', 'Budgeting', 'Kuliner', 'Budaya'];

  const filteredPosts = BLOG_POSTS.filter((p) => {
    const matchCat = selectedCat === 'Semua' || p.category === selectedCat;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
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
            20 panduan teruji, laporan ekspedisi terkurasi, dan kearifan warga lokal dari Sabang sampai Merauke.
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

            <div className="relative w-full md:w-auto md:min-w-[300px]">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#6B5D4F]"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, lokasi (cth: Toraja, Bromo)..."
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
              <span className="font-mono text-xs font-bold text-[#E85D2F] tracking-widest uppercase mb-4 block">
                Artikel Unggulan
              </span>
              <div className="bg-white rounded-3xl overflow-hidden border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-shadow grid lg:grid-cols-12 gap-0 group">
                <Link
                  href={`/blog/${featured.slug}`}
                  className="lg:col-span-7 relative h-64 sm:h-80 lg:h-auto min-h-[260px] sm:min-h-[340px] overflow-hidden block"
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-4 sm:top-6 left-4 sm:left-6 bg-[#1A1612]/85 backdrop-blur-xs text-white text-xs font-mono px-3 py-1 rounded-full uppercase">
                    {featured.category}
                  </span>
                  <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white/90 text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5">
                    <i className="fa-solid fa-location-dot text-[#E85D2F]"></i>
                    <span>{featured.location}</span>
                  </span>
                </Link>

                <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#6B5D4F] font-mono mb-3">
                      <span>{featured.date}</span>
                      <span>•</span>
                      <span>{featured.readTime} baca</span>
                    </div>

                    <Link href={`/blog/${featured.slug}`}>
                      <h2 className="font-display text-xl sm:text-3xl font-bold leading-snug mb-4 group-hover:text-[#E85D2F] transition-colors">
                        {featured.title}
                      </h2>
                    </Link>

                    <p className="text-[#6B5D4F] text-sm leading-relaxed mb-6">
                      {featured.snippet}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {featured.tags.map((t, idx) => (
                        <span key={idx} className="bg-[#F4EFE6] text-[#6B5D4F] text-[10px] font-mono px-2.5 py-1 rounded-full">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[#1A1612]/10">
                    <div className="flex items-center gap-3">
                      <img
                        src={featured.author.avatar}
                        alt={featured.author.name}
                        className="w-8 sm:w-9 h-8 sm:h-9 rounded-full object-cover border border-[#1A1612]/10"
                      />
                      <div>
                        <span className="text-xs font-semibold text-[#1A1612] block leading-tight">{featured.author.name}</span>
                        <span className="text-[10px] text-[#6B5D4F] font-mono">{featured.author.role}</span>
                      </div>
                    </div>

                    <Link
                      href={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#E85D2F] hover:text-[#C8431C] transition-colors font-mono"
                    >
                      <span>Baca Selengkapnya</span>
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
                className="bg-white rounded-3xl overflow-hidden border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1 duration-300"
              >
                <Link href={`/blog/${post.slug}`} className="relative h-52 sm:h-56 overflow-hidden block">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#1A1612] text-[10px] font-mono px-3 py-1 rounded-full uppercase font-bold">
                    {post.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full">
                    {post.readTime}
                  </span>
                </Link>

                <div className="p-5 sm:p-7 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#6B5D4F] font-mono mb-2">
                      <i className="fa-solid fa-location-dot text-[10px] text-[#E85D2F]"></i>
                      <span className="truncate">{post.location}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-display text-lg sm:text-xl font-bold leading-snug mb-3 group-hover:text-[#E85D2F] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-[#6B5D4F] text-xs leading-relaxed mb-4 line-clamp-3">
                      {post.snippet}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="bg-[#F4EFE6] text-[#6B5D4F] text-[9px] font-mono px-2 py-0.5 rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#1A1612]/10">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#1A1612]/10"
                      />
                      <span className="text-xs font-medium text-[#1A1612] truncate max-w-[120px]">{post.author.name}</span>
                    </div>

                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold text-[#E85D2F] hover:underline font-mono inline-flex items-center gap-1"
                    >
                      <span>Baca</span>
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
              <p className="text-xs text-[#6B5D4F]">Tidak ada artikel yang cocok dengan kata kunci pencarian Anda.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
