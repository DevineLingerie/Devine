import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import type { Page } from "@/content/types";
import type { VitrineVariant } from "@/components/brand/Vitrine";
import { Lisiere } from "@/components/brand/Lisiere";
import { HeroVisual } from "./HeroVisual";

type PageHeroProps = {
  page: Page;
  eyebrow: string;
  variant: VitrineVariant;
  /** Conservé pour compatibilité : l'en-tête est toujours sur fond velours. */
  tone?: "sable" | "sauge" | "lin";
  children?: ReactNode;
};


export function PageHero({ page, eyebrow, variant, children }: PageHeroProps) {
  return (
    <section className="on-dark text-lin">
      <div className="dentelle relative overflow-hidden bg-nuit">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-[10%] h-[36rem] w-[36rem] rounded-full bg-argile-clair/20 blur-3xl" />
        <Container size="wide" className="relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-20">
          <div>
            <p className="mb-5 text-lg italic text-argile-clair font-display">{eyebrow}</p>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl">{page.heading}</h1>
            {page.intro ? <p className="mt-7 max-w-xl text-lg leading-relaxed text-lin/80 sm:text-xl">{page.intro}</p> : null}
            {children ? <div className="mt-9 flex flex-wrap gap-3">{children}</div> : null}
          </div>
          <HeroVisual image={page.heroImage} variant={variant} monogramme={page.heading.charAt(0)} priority className="mx-auto w-full max-w-xs sm:max-w-sm" />
        </Container>
      </div>
      <Lisiere de="nuit" vers="lin" />
    </section>
  );
}
