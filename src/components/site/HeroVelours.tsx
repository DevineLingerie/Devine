import type { ReactNode } from "react";
import { Lisiere } from "@/components/brand/Lisiere";
import { Container } from "@/components/ui/Container";

const SPOTS = [
  { left: "28%", className: "spot spot-1" },
  { left: "50%", className: "spot spot-2" },
  { left: "72%", className: "spot spot-3" },
];

/**
 * En-tête de l'accueil : la boutique la nuit. Le rail d'éclairage du plafond
 * s'allume spot après spot et révèle le nom. C'est le seul moment animé du
 * site ; il est désactivé si l'utilisateur réduit les animations.
 */
export function HeroVelours({ children }: { children: ReactNode }) {
  return (
    <section className="on-dark text-lin">
      <div className="dentelle relative isolate overflow-hidden bg-nuit">
        {/* Rail et spots */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-full">
          <div className="absolute left-[18%] right-[18%] top-10 h-px bg-bois/70" />
          {SPOTS.map((spot) => (
            <div key={spot.left} className={spot.className}>
              <span className="absolute top-8 h-5 w-4 -translate-x-1/2 rounded-b-md bg-bois" style={{ left: spot.left }} />
              <span
                className="absolute top-12 h-[115%] w-[42rem] -translate-x-1/2 blur-2xl"
                style={{
                  left: spot.left,
                  clipPath: "polygon(48% 0, 52% 0, 100% 100%, 0 100%)",
                  background: "linear-gradient(to bottom, rgb(255 214 190 / 0.42), rgb(244 183 156 / 0.10) 55%, transparent 85%)",
                }}
              />
            </div>
          ))}
        </div>
        <Container size="wide" className="relative pb-20 pt-28 text-center sm:pb-28 sm:pt-36">{children}</Container>
      </div>
      <Lisiere de="nuit" vers="lin" />
    </section>
  );
}
