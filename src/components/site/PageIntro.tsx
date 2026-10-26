import type { ReactNode } from "react";
import { Lisiere } from "@/components/brand/Lisiere";
import { Projecteur } from "@/components/motion/Projecteur";
import { Container } from "@/components/ui/Container";

type PageIntroProps = { eyebrow?: string; title: string; intro?: string | null; children?: ReactNode };

/** En-tête de page sans visuel (marques, contact, pages légales), sur velours. */
export function PageIntro({ eyebrow, title, intro, children }: PageIntroProps) {
  return (
    <section className="on-dark text-lin">
      <div className="dentelle relative isolate overflow-hidden bg-nuit">
        <Projecteur />
        <Container size="full" className="relative pb-20 pt-36 sm:pb-24 sm:pt-44">
          {eyebrow ? <p className="reveal font-display text-xl italic text-argile-clair">{eyebrow}</p> : null}
          <h1 className="reveal mt-4 max-w-5xl text-6xl sm:text-8xl" style={{ ["--d" as string]: 1 }}>
            {title}
          </h1>
          {intro ? (
            <p className="reveal mt-8 max-w-2xl text-lg leading-relaxed text-lin/80 sm:text-xl" style={{ ["--d" as string]: 2 }}>
              {intro}
            </p>
          ) : null}
          {children}
        </Container>
      </div>
      <Lisiere de="nuit" vers="lin" />
    </section>
  );
}
