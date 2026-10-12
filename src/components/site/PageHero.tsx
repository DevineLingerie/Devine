import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import type { Page } from "@/content/types";
import type { VitrineVariant } from "@/components/brand/Vitrine";
import { HeroVisual } from "./HeroVisual";

type PageHeroProps = {
  page: Page;
  eyebrow: string;
  variant: VitrineVariant;
  /** Couleur de fond de l'en-tête. */
  tone?: "sable" | "sauge" | "lin";
  children?: ReactNode;
};

const TONES = { sable: "bg-sable", sauge: "bg-sauge-pale", lin: "bg-lin" } as const;

export function PageHero({ page, eyebrow, variant, tone = "sable", children }: PageHeroProps) {
  return (
    <section className={`tulle relative overflow-hidden ${TONES[tone]}`}>
      <Container size="wide" className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-20">
        <div>
          <p className="surtitre mb-5 text-sauge">{eyebrow}</p>
          <h1 className="text-[3.2rem] sm:text-7xl lg:text-8xl">{page.heading}</h1>
          {page.intro ? <p className="mt-7 max-w-xl text-lg leading-relaxed text-encre sm:text-xl">{page.intro}</p> : null}
          {children ? <div className="mt-9 flex flex-wrap gap-3">{children}</div> : null}
        </div>
        <HeroVisual image={page.heroImage} variant={variant} priority className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md" />
      </Container>
    </section>
  );
}
