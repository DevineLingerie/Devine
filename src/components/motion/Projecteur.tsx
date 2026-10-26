"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Halo lumineux qui suit le pointeur, comme un spot de la boutique.
 * Sur écran tactile (ou sans souris), il dérive lentement de lui-même.
 */
export function Projecteur({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    const element = ref.current;
    const zone = element?.parentElement;
    if (!element || !zone) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = zone.getBoundingClientRect();
        element.style.setProperty("--px", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        element.style.setProperty("--py", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    };
    const onEnter = () => setAuto(false);
    const onLeave = () => setAuto(true);
    zone.addEventListener("pointermove", onMove);
    zone.addEventListener("pointerenter", onEnter);
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerenter", onEnter);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" data-auto={auto} className={`projecteur pointer-events-none absolute inset-0 ${className}`} />;
}
