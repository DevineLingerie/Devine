"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Active les révélations au défilement (.reveal).
 * 1. Les éléments déjà visibles à l'écran sont marqués visibles tout de suite
 *    (aucun clignotement au chargement).
 * 2. Puis html[data-motion] est posé : les autres éléments sont masqués et
 *    apparaissent quand ils entrent à l'écran.
 * Sans JavaScript ou avec « réduire les animations », rien n'est masqué.
 */
export function MotionObserver() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      delete root.dataset.motion;
      return;
    }
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not([data-visible])"));
    const viewportHeight = window.innerHeight;
    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) element.dataset.visible = "true";
    }
    root.dataset.motion = "on";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    for (const element of elements) {
      if (!element.dataset.visible) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
