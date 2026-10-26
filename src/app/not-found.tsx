import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Projecteur } from "@/components/motion/Projecteur";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenu">
        <section className="on-dark dentelle relative isolate flex min-h-[90svh] items-center overflow-hidden bg-nuit text-lin">
          <Projecteur />
          <Container size="narrow" className="relative pb-20 pt-32 text-center">
            <p aria-hidden="true" className="font-display text-[clamp(7rem,22vw,14rem)] italic leading-none text-argile-clair">
              404
            </p>
            <h1 className="mt-6 text-5xl sm:text-6xl">Cette page s&apos;est éclipsée</h1>
            <p className="mx-auto mt-6 max-w-lg text-lg text-lin/80">
              L&apos;adresse a peut-être changé, ou la page n&apos;existe plus. Rien de grave : on vous raccompagne.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/" variant="creme">
                Retour à l&apos;accueil
              </ButtonLink>
              <ButtonLink href="/contact" variant="light">
                Nous contacter
              </ButtonLink>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
