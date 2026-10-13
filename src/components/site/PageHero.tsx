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

const TONES = { sable: "bg-nude", sauge: "bg-sauge-pale", lin: "bg-sable" } as const;

export function PageHero({ page, eyebrow, variant, tone = "sable", children }: PageHeroProps) {
  return (
    <section className="px-3 pt-3 sm:px-5 sm:pt-5">
      <div className={`tulle relative mx-auto max-w-[96rem] overflow-hidden rounded-[2rem] sm:rounded-[2.75rem] ${TONES[tone]}`}>
      <Container size="wide" className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-16">
        <div>
          <p className="surtitre mb-5 text-sauge">{eyebrow}</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl">{page.heading}</h1>
          {page.intro ? <p className="mt-7 max-w-xl text-lg leading-relaxed text-encre sm:text-xl">{page.intro}</p> : null}
          {children ? <div className="mt-9 flex flex-wrap gap-3">{children}</div> : null}
        </div>
        <HeroVisual image={page.heroImage} variant={variant} priority className="mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md" />
      </Container>
      </div>
    </section>
  );
}
