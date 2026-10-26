"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Projecteur } from "@/components/motion/Projecteur";
import type { Diapositive } from "@/content/carrousel";

const DUREE_MS = 6500;

type HeroCarrouselProps = {
  diapositives: Diapositive[];
  /** Contenu fixe du panneau de texte (titre, introduction, boutons). */
  children: ReactNode;
};

/**
 * Accroche plein écran de l'accueil : texte fixe sur velours, photos qui se
 * succèdent en fondu avec un lent zoom.
 * Accessibilité : boutons précédent / suivant, pause (WCAG 2.2.2), arrêt au
 * survol et au focus, pas de défilement automatique si l'utilisateur réduit
 * les animations, diapositive courante annoncée seulement après une action.
 */
export function HeroCarrousel({ diapositives, children }: HeroCarrouselProps) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const [survol, setSurvol] = useState(false);
  const [reduit, setReduit] = useState(false);
  const [annonce, setAnnonce] = useState("");
  const total = diapositives.length;
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maj = () => setReduit(media.matches);
    maj();
    media.addEventListener("change", maj);
    return () => media.removeEventListener("change", maj);
  }, []);

  const defile = !enPause && !survol && !reduit && total > 1;

  useEffect(() => {
    if (!defile) return;
    const minuteur = window.setTimeout(() => setIndex((i) => (i + 1) % total), DUREE_MS);
    return () => window.clearTimeout(minuteur);
  }, [defile, index, total]);

  const aller = useCallback(
    (cible: number) => {
      const suivant = (cible + total) % total;
      setIndex(suivant);
      setAnnonce(`Photo ${suivant + 1} sur ${total} : ${diapositives[suivant].marque} ${diapositives[suivant].titre}`);
    },
    [diapositives, total],
  );

  const courante = diapositives[index];

  return (
    <section className="on-dark relative isolate grid min-h-[100svh] overflow-hidden bg-nuit text-lin lg:grid-cols-[1fr_1fr]">
      {/* Panneau de texte */}
      <div className="dentelle relative isolate order-2 flex flex-col justify-center overflow-hidden px-5 pb-16 pt-10 sm:px-10 lg:order-1 lg:px-14 lg:pb-20 lg:pt-28 xl:px-20">
        {/* Halo de lumière qui suit le pointeur (dérive seul sur mobile) */}
        <Projecteur />
        <div className="relative">
        {children}

        {total > 1 ? (
          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => aller(index - 1)}
                aria-controls={`${id}-diapos`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-lin/40 transition-colors hover:bg-lin hover:text-nuit"
              >
                <span aria-hidden="true">‹</span>
                <span className="sr-only">Photo précédente</span>
              </button>
              <button
                type="button"
                onClick={() => aller(index + 1)}
                aria-controls={`${id}-diapos`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-lin/40 transition-colors hover:bg-lin hover:text-nuit"
              >
                <span aria-hidden="true">›</span>
                <span className="sr-only">Photo suivante</span>
              </button>
              {!reduit ? (
                <button
                  type="button"
                  onClick={() => setEnPause((p) => !p)}
                  aria-pressed={enPause}
                  className="ml-1 flex h-11 items-center rounded-full border border-lin/40 px-4 text-sm transition-colors hover:bg-lin hover:text-nuit"
                >
                  {enPause ? "Lecture" : "Pause"}
                  <span className="sr-only"> du défilement des photos</span>
                </button>
              ) : null}
            </div>

            <ol className="flex items-center gap-2" aria-label="Choisir une photo">
              {diapositives.map((diapo, i) => (
                <li key={diapo.src}>
                  <button
                    type="button"
                    onClick={() => aller(i)}
                    aria-current={i === index ? "true" : undefined}
                    aria-label={`Photo ${i + 1} : ${diapo.marque} ${diapo.titre}`}
                    className="relative block h-1 w-12 overflow-hidden rounded-full bg-lin/25 py-2 [background-clip:content-box]"
                  >
                    <span
                      key={`${index}-${defile}`}
                      className={`absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 origin-left rounded-full bg-argile-clair ${
                        i < index || (i === index && !defile) ? "scale-x-100" : i === index ? "progression" : "scale-x-0"
                      }`}
                      style={i === index && defile ? { animationDuration: `${DUREE_MS}ms` } : undefined}
                    />
                  </button>
                </li>
              ))}
            </ol>

            <p className="w-full font-display text-lg italic text-lin/75 sm:w-auto">
              {courante.marque}, <span className="text-lin">{courante.titre}</span>
            </p>
          </div>
        ) : null}
        </div>
        <p aria-live="polite" className="sr-only">
          {annonce}
        </p>
      </div>

      {/* Photos */}
      <div
        ref={zoneRef}
        id={`${id}-diapos`}
        role="group"
        aria-roledescription="carrousel"
        aria-label="Sélection du moment"
        onMouseEnter={() => setSurvol(true)}
        onMouseLeave={() => setSurvol(false)}
        onFocus={() => setSurvol(true)}
        onBlur={() => setSurvol(false)}
        className="relative order-1 h-[72svh] overflow-hidden bg-sable lg:order-2 lg:h-auto"
      >
        {diapositives.map((diapo, i) => {
          const active = i === index;
          return (
            <div
              key={diapo.src}
              role="group"
              aria-roledescription="diapositive"
              aria-label={`${i + 1} sur ${total}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${active ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={diapo.src}
                alt={diapo.alt}
                fill
                unoptimized
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover object-[50%_18%] ${active && !reduit ? "zoom-lent" : ""}`}
              />
            </div>
          );
        })}
        {/* Voile en haut : lisibilité de l'en-tête transparent */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-nuit/75 via-nuit/30 to-transparent" />
        {/* Fondu vers le panneau de texte */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-nuit to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-40 lg:bg-gradient-to-r" />
      </div>
    </section>
  );
}
