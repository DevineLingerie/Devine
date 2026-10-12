import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import type { Page } from "@/content/types";
import { HeroVisual } from "./HeroVisual";

type PageHeroProps = {
  page: Page;
  eyebrow: string;
  variant: Parameters<typeof HeroVisual>[0]["variant"];
  children?: ReactNode;
};

export function PageHero({ page, eyebrow, variant, children }: PageHeroProps) {
  return (
    <section className="border-b border-nuit/10">
      <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-20">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-sauge">{eyebrow}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl">{page.heading}</h1>
          {page.intro ? <p className="mt-6 max-w-xl text-lg text-encre sm:text-xl">{page.intro}</p> : null}
          {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
        </div>
        <HeroVisual image={page.heroImage} variant={variant} priority className="mx-auto w-full max-w-sm lg:max-w-none" />
      </Container>
    </section>
  );
}
