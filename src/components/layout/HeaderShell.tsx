"use client";

import { useEffect, useState, type ReactNode } from "react";

/** En-tête transparent sur l'accroche, qui prend un fond velours au défilement. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      data-scrolled={scrolled}
      className="on-dark fixed inset-x-0 top-0 z-50 text-lin transition-[background-color,box-shadow] duration-500 data-[scrolled=true]:bg-nuit/95 data-[scrolled=true]:shadow-[0_10px_40px_-20px_rgba(0,0,0,0.7)]"
    >
      {children}
    </header>
  );
}
