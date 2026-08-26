'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    // Disable on small screens
    if (window.innerWidth <= 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
      }
      
      // Auto-detect hoverable elements globally
      const target = e.target as HTMLElement;
      if (target && target.closest) {
        const isHoverable = target.closest('a, button, input, .cursor-hover-target');
        if (isHoverable) {
          cursorRingRef.current?.classList.add('cursor-hover');
        } else {
          cursorRingRef.current?.classList.remove('cursor-hover');
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animateRing = () => {
      const target = mousePos.current;
      const current = ringPos.current;
      
      current.x += (target.x - current.x) * 0.15;
      current.y += (target.y - current.y) * 0.15;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = `${current.x}px`;
        cursorRingRef.current.style.top = `${current.y}px`;
      }
      
      requestRef.current = requestAnimationFrame(animateRing);
    };

    requestRef.current = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot hidden md:block"></div>
      <div ref={cursorRingRef} className="cursor-ring hidden md:block"></div>
    </>
  );
}
