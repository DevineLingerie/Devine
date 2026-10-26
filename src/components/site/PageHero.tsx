import type { ReactNode } from "react";
import { Lisiere } from "@/components/brand/Lisiere";
import type { VitrineVariant } from "@/components/brand/Vitrine";
import { Projecteur } from "@/components/motion/Projecteur";
import { Container } from "@/components/ui/Container";
import type { Page } from "@/content/types";
import { HeroVisual } from "./HeroVisual";

type PageHeroProps = {
  page: Page;
  eyebrow: string;
  variant: VitrineVariant;
  /** Conservé pour compatibilité : l'en-tête est toujours sur fond velours. */
  tone?: "sable" | "sauge" | "lin";
  children?: ReactNode;
};

/** En-tête de page quasi plein écran, sur velours, avec halo et visuel en arche. */
export function PageHero({ page, eyebrow, variant, children }: PageHeroProps) {
  return (
    <section className="on-dark text-lin">
      <div className="dentelle relative isolate flex min-h-[88svh] items-center overflow-hidden bg-nuit">
        <Projecteur />
        <Container size="full" className="relative grid items-center gap-12 pb-20 pt-32 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <div>
            <p className="reveal font-display text-xl italic text-argile-clair">{eyebrow}</p>
            <h1 className="reveal mt-4 text-6xl sm:text-8xl xl:text-9xl" style={{ ["--d" as string]: 1 }}>
              {page.heading}
            </h1>
            {page.intro ? (
              <p className="reveal mt-8 max-w-xl text-lg leading-relaxed text-lin/80 sm:text-xl" style={{ ["--d" as string]: 2 }}>
                {page.intro}
              </p>
            ) : null}
            {children ? (
              <div className="reveal mt-10 flex flex-wrap gap-3" style={{ ["--d" as string]: 3 }}>
                {children}
              </div>
            ) : null}
          </div>
          <div className="reveal reveal-zoom mx-auto w-full max-w-xs sm:max-w-sm" style={{ ["--d" as string]: 2 }}>
            <HeroVisual image={page.heroImage} variant={variant} monogramme={page.heading.charAt(0)} priority />
          </div>
        </Container>
      </div>
      <Lisiere de="nuit" vers="lin" />
    </section>
  );
}
