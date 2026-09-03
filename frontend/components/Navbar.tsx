'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const navLinks = [
    { label: 'Beranda', href: '/', isActive: pathname === '/' },
    { label: 'Destinasi', href: '/#destinations', isActive: false },
    { label: 'Buat Trip', href: '/#planner', isActive: false },
    { label: 'Jurnal', href: '/#journal', isActive: pathname.startsWith('/journal') },
    { label: 'Assistant', href: '/assistant', icon: 'fa-solid fa-sparkles', isActive: pathname === '/assistant' },
    { label: 'Chat AI', href: '/chat', icon: 'fa-regular fa-comments', isActive: pathname === '/chat', badge: 'Memory' },
    { label: 'My Trips', href: '/trips', isActive: pathname === '/trips' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F4EFE6]/90 backdrop-blur-md border-b border-[#1A1612]/10 transition-all shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 lg:gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <img 
            src="/logo-kelanaai.png" 
            alt="Kelana AI Logo" 
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105" 
          />
        </Link>
        
        {/* Unified Complete Navigation Links (Desktop) */}
        <div className="hidden xl:flex items-center gap-1 bg-[#1A1612]/5 p-1 rounded-full border border-[#1A1612]/5">
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5
                ${item.isActive
                  ? 'bg-[#E85D2F] text-white shadow-xs'
                  : 'text-[#1A1612] hover:bg-white hover:text-[#E85D2F]'
                }
              `}
            >
              {item.icon && (
                <i className={`${item.icon} text-[11px] ${item.isActive ? 'text-white' : 'text-[#E85D2F]'}`}></i>
              )}
              <span>{item.label}</span>
              {item.badge && !item.isActive && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#E85D2F]/15 text-[#E85D2F] font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Compact Navigation Links for Large Screens (lg:flex, xl:hidden) */}
        <div className="hidden lg:flex xl:hidden items-center gap-1 bg-[#1A1612]/5 p-1 rounded-full border border-[#1A1612]/5">
          <Link
            href="/"
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              pathname === '/' ? 'bg-[#E85D2F] text-white' : 'text-[#1A1612] hover:bg-white hover:text-[#E85D2F]'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/#destinations"
            className="px-2.5 py-1.5 rounded-full text-xs font-semibold text-[#1A1612] hover:bg-white hover:text-[#E85D2F] transition-all"
          >
            Destinasi
          </Link>
          <Link
            href="/assistant"
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              pathname === '/assistant' ? 'bg-[#E85D2F] text-white' : 'text-[#1A1612] hover:bg-white hover:text-[#E85D2F]'
            }`}
          >
            <i className="fa-solid fa-sparkles text-[10px]"></i>
            <span>Assistant</span>
          </Link>
          <Link
            href="/chat"
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              pathname === '/chat' ? 'bg-[#E85D2F] text-white' : 'text-[#1A1612] hover:bg-white hover:text-[#E85D2F]'
            }`}
          >
            <i className="fa-regular fa-comments text-[10px]"></i>
            <span>Chat AI</span>
          </Link>
          <Link
            href="/trips"
            className={`px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              pathname === '/trips' ? 'bg-[#E85D2F] text-white' : 'text-[#1A1612] hover:bg-white hover:text-[#E85D2F]'
            }`}
          >
            My Trips
          </Link>
        </div>

        {/* Right Action / Auth Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!loading && user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/profile" 
                className="flex items-center gap-2 bg-white border border-[#1A1612]/10 hover:border-[#E85D2F]/40 pl-1.5 pr-3 py-1 rounded-full shadow-2xs transition-all hover:-translate-y-0.5"
                title="Lihat Profil"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E85D2F] to-[#D4A24C] p-0.5 shadow-2xs flex items-center justify-center overflow-hidden shrink-0">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : user.gender === 'Laki-laki' ? (
                    <img src={`https://api.dicebear.com/9.x/micah/svg?seed=Boy-${user.name}&backgroundColor=E85D2F`} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : user.gender === 'Perempuan' ? (
                    <img src={`https://api.dicebear.com/9.x/micah/svg?seed=Girl-${user.name}&backgroundColor=E85D2F`} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#E85D2F] text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-[#1A1612] max-w-[110px] truncate hidden sm:inline">
                  {user.name}
                </span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="text-xs font-semibold text-[#6B5D4F] hover:text-red-600 bg-white sm:bg-transparent border sm:border-0 border-[#1A1612]/10 p-2 sm:px-2.5 sm:py-1.5 rounded-full hover:bg-red-50 transition-colors"
                title="Keluar dari akun"
              >
                <i className="fa-solid fa-arrow-right-from-bracket sm:mr-1"></i>
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          ) : (
            !loading && (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="text-xs sm:text-sm font-semibold text-[#1A1612] hover:text-[#E85D2F] px-3 py-1.5 transition-colors"
                >
                  Masuk
                </Link>
                <Link 
                  href="/#planner" 
                  className="btn-primary px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  <span>Mulai Trip</span>
                </Link>
              </div>
            )
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#1A1612] hover:bg-white rounded-xl border border-[#1A1612]/10 transition-colors"
            title="Menu Navigasi"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Identical Complete Links on Mobile) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FDFCFA] border-b border-[#1A1612]/10 px-4 py-3 space-y-1 animate-fade-in shadow-xl">
          {navLinks.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all
                ${item.isActive
                  ? 'bg-[#E85D2F] text-white shadow-xs'
                  : 'text-[#1A1612] hover:bg-[#F4EFE6]'
                }
              `}
            >
              <div className="flex items-center gap-2.5">
                {item.icon && (
                  <i className={`${item.icon} text-xs ${item.isActive ? 'text-white' : 'text-[#E85D2F]'}`}></i>
                )}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.isActive ? 'bg-white/20 text-white' : 'bg-[#E85D2F]/10 text-[#E85D2F]'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {!loading && !user && (
            <div className="pt-2 mt-2 border-t border-[#1A1612]/10 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-bold border border-[#1A1612]/10 bg-white text-[#1A1612]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-xl text-xs font-bold bg-[#E85D2F] text-white"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
