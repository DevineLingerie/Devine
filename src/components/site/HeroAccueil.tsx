import type { ReactNode } from "react";
import { Projecteur } from "@/components/motion/Projecteur";
import { Container } from "@/components/ui/Container";

const SPOTS = [
  { left: "26%", className: "spot spot-1" },
  { left: "50%", className: "spot spot-2" },
  { left: "74%", className: "spot spot-3" },
];

/**
 * Accroche plein écran de l'accueil : la boutique la nuit. Les spots du rail
 * s'allument, un halo suit le pointeur et les lettres du nom se posent.
 */
export function HeroAccueil({ nom, children }: { nom: string; children: ReactNode }) {
  return (
    <section className="on-dark dentelle relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-nuit text-lin">
      <Projecteur />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[16%] right-[16%] top-24 h-px bg-bois/60" />
        {SPOTS.map((spot) => (
          <div key={spot.left} className={spot.className}>
            <span className="absolute top-[5.5rem] h-5 w-4 -translate-x-1/2 rounded-b-md bg-bois" style={{ left: spot.left }} />
            <span
              className="absolute top-[6.5rem] h-[120%] w-[44rem] -translate-x-1/2 blur-2xl"
              style={{
                left: spot.left,
                clipPath: "polygon(48% 0, 52% 0, 100% 100%, 0 100%)",
                background: "linear-gradient(to bottom, rgb(255 214 190 / 0.38), rgb(244 183 156 / 0.08) 55%, transparent 85%)",
              }}
            />
          </div>
        ))}
      </div>

      <Container size="full" className="relative flex flex-1 flex-col items-center justify-center pb-32 pt-32 text-center">
        <p
          aria-hidden="true"
          className="select-none font-display text-[clamp(5.5rem,24vw,17rem)] italic leading-[0.82] tracking-[-0.03em] [text-shadow:0_0_90px_rgb(244_183_156/0.35)]"
        >
          {Array.from(nom).map((lettre, index) => (
            <span key={index} className="lettre" style={{ ["--i" as string]: index }}>
              {lettre}
            </span>
          ))}
        </p>
        <div className="apres-lettres mt-6 max-w-2xl">{children}</div>
      </Container>

      <a
        href="#suite"
        className="indice-defilement absolute bottom-6 left-1/2 flex [@media(max-height:820px)]:hidden -translate-x-1/2 flex-col items-center gap-3 text-sm text-lin/70 hover:text-lin"
      >
        Découvrir
        <span aria-hidden="true" className="relative block h-12 w-px overflow-hidden bg-lin/25 after:absolute after:inset-x-0 after:top-0 after:h-1/3 after:bg-argile-clair after:content-['']" />
      </a>
    </section>
  );
}
