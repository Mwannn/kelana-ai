'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPill, setShowPill] = useState(false);
  const pillTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Intercept internal route navigation clicks for instant visual response
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Only handle internal navigation to different paths
      const isInternal = href.startsWith('/') && !href.startsWith('/#') && !href.startsWith('#');
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      const isNewTab = target.target === '_blank';

      if (isInternal && !isModified && !isNewTab) {
        const targetPath = href.split('?')[0].split('#')[0];
        const currentPath = window.location.pathname;

        if (targetPath !== currentPath) {
          setLoading(true);
          setProgress(40);

          // If navigation takes longer than 250ms, show a non-blocking floating pill in the corner
          if (pillTimerRef.current) clearTimeout(pillTimerRef.current);
          pillTimerRef.current = setTimeout(() => {
            setShowPill(true);
          }, 250);
        }
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => document.removeEventListener('click', handleLinkClick, { capture: true });
  }, []);

  // When pathname or searchParams change, conclude instantly (zero artificial delay)
  useEffect(() => {
    if (pillTimerRef.current) clearTimeout(pillTimerRef.current);

    if (loading) {
      setProgress(100);
      setShowPill(false);

      const fadeTimer = setTimeout(() => {
        setLoading(false);
        const resetTimer = setTimeout(() => {
          setProgress(0);
        }, 150);
        return () => clearTimeout(resetTimer);
      }, 120);

      return () => clearTimeout(fadeTimer);
    }
  }, [pathname, searchParams]);

  // Fast progress creep while waiting for page
  useEffect(() => {
    if (!loading) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        return prev + 12;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <>
      {/* Sleek Top Terracotta Glow Progress Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none transition-opacity duration-200 ${
          loading || progress > 0 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-[#E85D2F] via-[#F49342] to-[#E85D2F] shadow-[0_0_12px_rgba(232,93,47,0.9)] transition-all duration-150 ease-out rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Non-blocking Subtle Floating Compass Indicator (only appears on slower connections) */}
      <div
        className={`fixed bottom-6 right-6 z-[9998] pointer-events-none transition-all duration-200 transform ${
          showPill && loading
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        <div className="bg-[#1A1612]/90 backdrop-blur-md text-[#F4EFE6] px-4 py-2 rounded-full shadow-xl border border-white/10 flex items-center gap-2.5">
          <i className="fa-solid fa-compass text-[#E85D2F] text-sm animate-spin" style={{ animationDuration: '2s' }}></i>
          <span className="text-xs font-sans font-medium tracking-wide">Memuat...</span>
        </div>
      </div>
    </>
  );
}
