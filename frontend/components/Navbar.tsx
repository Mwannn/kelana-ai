'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]); // Re-run when route changes to catch login/logout

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const isHome = pathname === '/';

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50 bg-[#F4EFE6]/80 backdrop-blur-md border-b border-[#1A1612]/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-kelanaai.png" alt="Kelana AI Logo" className="h-10 w-auto object-contain" />
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {isHome ? (
            <>
              <a href="#destinations" className="hover:text-[#E85D2F] transition-colors">Destinasi</a>
              <a href="#planner" className="hover:text-[#E85D2F] transition-colors">Buat Trip</a>
              <a href="#experiences" className="hover:text-[#E85D2F] transition-colors">Pengalaman</a>
              <a href="#journal" className="hover:text-[#E85D2F] transition-colors">Jurnal</a>
              <Link href="/assistant" className="hover:text-[#E85D2F] transition-colors flex items-center gap-1.5">
                <i className="fa-solid fa-sparkles text-xs text-[#E85D2F]"></i>
                <span>Assistant (RAG)</span>
              </Link>
              <Link href="/chat" className="hover:text-[#E85D2F] transition-colors flex items-center gap-1.5">
                <i className="fa-regular fa-comments text-xs text-[#E85D2F]"></i>
                <span>Chat AI</span>
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="hover:text-[#E85D2F] transition-colors">Beranda</Link>
              <Link href="/assistant" className={`hover:text-[#E85D2F] transition-colors flex items-center gap-1.5 ${pathname === '/assistant' ? 'text-[#E85D2F] font-bold' : ''}`}>
                <i className="fa-solid fa-sparkles text-xs text-[#E85D2F]"></i>
                <span>Travel Assistant</span>
              </Link>
              <Link href="/chat" className={`hover:text-[#E85D2F] transition-colors flex items-center gap-1.5 ${pathname === '/chat' ? 'text-[#E85D2F] font-bold' : ''}`}>
                <i className="fa-regular fa-comments text-xs text-[#E85D2F]"></i>
                <span>Chat AI</span>
              </Link>
              <Link href="/trips" className={`hover:text-[#E85D2F] transition-colors ${pathname === '/trips' ? 'text-[#E85D2F] font-bold' : ''}`}>My Trips</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!loading && user ? (
            <>
              <div className="hidden md:block text-sm font-medium text-[#1A1612]">
                Welcome back, <Link href="/profile" className="font-bold text-[#E85D2F] hover:underline">{user.name}</Link> 👋
              </div>
              <Link href="/chat" className="text-sm font-medium hover:text-[#E85D2F] transition-colors">Chat AI</Link>
              <Link href="/trips" className="text-sm font-medium hover:text-[#E85D2F] transition-colors">My Trips</Link>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-[#6B5D4F] hover:text-[#1A1612] transition-colors ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            !loading && (
              <>
                <Link href="/chat" className="hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-[#E85D2F]/10 text-[#E85D2F] border border-[#E85D2F]/20 hover:bg-[#E85D2F] hover:text-white transition-all">
                  <i className="fa-regular fa-comments"></i>
                  <span>Chat AI</span>
                </Link>
                <Link href="/login" className="hidden md:block text-sm font-medium">Masuk</Link>
                <Link href="/#planner" className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold">
                  <span>Mulai Perjalanan</span>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
