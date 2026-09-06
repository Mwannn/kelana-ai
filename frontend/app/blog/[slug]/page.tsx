import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { BLOG_POSTS } from '@/data/blogs';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = BLOG_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Related posts (from same category or any other posts)
  const relatedPosts = BLOG_POSTS
    .filter((p) => p.id !== post.id)
    .sort((a, b) => (a.category === post.category ? -1 : 1))
    .slice(0, 3);

  return (
    <div className="bg-[#F4EFE6] text-[#1A1612] font-sans min-h-screen selection:bg-[#E85D2F] selection:text-white flex flex-col">
      {/* Header & Breadcrumb */}
      <section className="pt-28 sm:pt-32 pb-8 px-4 sm:px-6 lg:px-12 border-b border-[#1A1612]/10 bg-white">
        <div className="max-w-[1000px] mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-[#6B5D4F] mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#E85D2F] transition-colors">Beranda</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#E85D2F] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#E85D2F] font-semibold truncate max-w-[240px] sm:max-w-none">{post.category}</span>
          </nav>

          {/* Category & Location Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="bg-[#E85D2F] text-white text-xs font-mono px-3 py-1 rounded-full uppercase font-bold tracking-wider">
              {post.category}
            </span>
            <span className="bg-[#F4EFE6] text-[#1A1612] text-xs font-mono px-3 py-1 rounded-full border border-[#1A1612]/10 flex items-center gap-1.5">
              <i className="fa-solid fa-location-dot text-[#E85D2F] text-[11px]"></i>
              <span>{post.location}</span>
            </span>
          </div>

          {/* Article Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1612] leading-[1.15] mb-6">
            {post.title}
          </h1>

          {/* Metadata & Author Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-[#1A1612]/10">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#E85D2F]/30"
              />
              <div>
                <div className="text-sm font-bold text-[#1A1612]">{post.author.name}</div>
                <div className="text-xs text-[#6B5D4F] font-mono">{post.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-[#6B5D4F]">
              <span><i className="fa-regular fa-calendar mr-1.5 text-[#E85D2F]"></i>{post.date}</span>
              <span>•</span>
              <span><i className="fa-regular fa-clock mr-1.5 text-[#E85D2F]"></i>{post.readTime} baca</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image Container */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 w-full -mt-2 pt-4">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#1A1612]/10 bg-[#1A1612]/5 aspect-[16/9] sm:aspect-[21/9] md:aspect-[16/8] max-h-[520px] group">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 text-white/95 text-xs font-mono flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <span className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
              <i className="fa-solid fa-location-dot text-[#E85D2F]"></i>
              <span className="font-semibold">{post.location}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80 text-[11px] bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
              <i className="fa-solid fa-camera text-[10px]"></i>
              <span>Dokumentasi Visual Kelana AI</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Article Body */}
      <main className="max-w-[850px] mx-auto px-4 sm:px-6 py-12 w-full">
        {/* Intro Highlight Paragraph */}
        <p className="font-display text-lg sm:text-2xl leading-relaxed text-[#1A1612] italic mb-10 pb-8 border-b border-[#1A1612]/10">
          "{post.content.intro}"
        </p>

        {/* Dynamic Content Sections */}
        <div className="space-y-8 text-base sm:text-lg text-[#1A1612]/85 leading-relaxed">
          {post.content.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1612] tracking-tight">
                {section.heading}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#6B5D4F]">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Quote (if present) */}
        {post.content.quote && (
          <div className="my-10 bg-[#1A1612] text-[#F4EFE6] rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg">
            <i className="fa-solid fa-quote-left text-3xl text-[#E85D2F] mb-3 block opacity-80"></i>
            <blockquote className="font-display text-lg sm:text-2xl italic leading-relaxed text-[#F4EFE6] mb-2">
              "{post.content.quote}"
            </blockquote>
            <p className="text-xs font-mono text-[#E85D2F] mt-3 uppercase tracking-wider">— Catatan Perjalanan Kelana AI</p>
          </div>
        )}

        {/* Practical Local Tips Box */}
        {post.content.tips && post.content.tips.length > 0 && (
          <div className="my-10 bg-white rounded-3xl p-6 sm:p-8 border border-[#1A1612]/10 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4 text-[#E85D2F]">
              <i className="fa-solid fa-compass text-lg"></i>
              <h3 className="font-display text-xl font-bold text-[#1A1612]">Tips Eksplorasi dari Warga Lokal</h3>
            </div>
            <ul className="space-y-3">
              {post.content.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-[#6B5D4F]">
                  <span className="w-5 h-5 rounded-full bg-[#E85D2F]/15 text-[#E85D2F] text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags & Share */}
        <div className="pt-6 border-t border-[#1A1612]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-[#6B5D4F] mr-1">Topik:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="bg-white px-3 py-1 rounded-full text-xs font-mono text-[#1A1612] border border-[#1A1612]/10">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/blog"
              className="bg-white hover:bg-[#1A1612] hover:text-white text-[#1A1612] px-4 py-2 rounded-full text-xs font-bold border border-[#1A1612]/15 transition-all inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              <span>Kembali ke Blog</span>
            </Link>
          </div>
        </div>

        {/* Interactive Trip Planner CTA */}
        <div className="mt-12 bg-gradient-to-br from-[#1A1612] to-[#2B231D] text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-mono text-[#E85D2F] uppercase tracking-wider font-bold">Rencanakan Perjalananmu</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mt-1 mb-2 text-white">
              Tertarik menjelajahi {post.location.split(',')[0]}?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-md">
              Biarkan asisten AI kami menyusun itinerary harian yang realistis, lengkap dengan estimasi biaya dan rekomendasi kuliner lokal.
            </p>
          </div>

          <Link
            href="/#planner"
            className="bg-[#E85D2F] hover:bg-[#C8431C] text-white px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl flex-shrink-0 flex items-center gap-2"
          >
            <span>Mulai Buat Itinerary</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </main>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-12 bg-white border-t border-[#1A1612]/10">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono text-[#E85D2F] uppercase tracking-wider font-bold block mb-1">
                  Inspirasi Lanjutan
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold">Artikel Terkait Lainnya</h2>
              </div>
              <Link
                href="/blog"
                className="text-xs font-mono font-bold text-[#E85D2F] hover:underline hidden sm:inline-flex items-center gap-1"
              >
                <span>Lihat Semua 20 Artikel</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.id}
                  className="bg-[#F4EFE6]/40 rounded-3xl overflow-hidden border border-[#1A1612]/10 shadow-sm hover:shadow-md transition-all flex flex-col group hover:-translate-y-1 duration-300"
                >
                  <Link href={`/blog/${rPost.slug}`} className="relative h-48 overflow-hidden block">
                    <img
                      src={rPost.image}
                      alt={rPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-[#1A1612]/80 text-white text-[9px] font-mono px-2.5 py-0.5 rounded-full uppercase">
                      {rPost.category}
                    </span>
                  </Link>

                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="text-[10px] font-mono text-[#6B5D4F] mb-1">
                        {rPost.location}
                      </div>
                      <Link href={`/blog/${rPost.slug}`}>
                        <h4 className="font-display text-base font-bold group-hover:text-[#E85D2F] transition-colors line-clamp-2 mb-2">
                          {rPost.title}
                        </h4>
                      </Link>
                      <p className="text-xs text-[#6B5D4F] line-clamp-2 mb-4">
                        {rPost.snippet}
                      </p>
                    </div>

                    <Link
                      href={`/blog/${rPost.slug}`}
                      className="text-xs font-mono font-bold text-[#E85D2F] hover:underline inline-flex items-center gap-1 pt-3 border-t border-[#1A1612]/10"
                    >
                      <span>Baca Artikel</span>
                      <i className="fa-solid fa-angle-right text-[10px]"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
