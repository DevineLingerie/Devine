import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Trait } from "@/components/brand/Trait";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenu">
        <Container size="narrow" className="py-20 text-center sm:py-28">
          <Trait className="mx-auto mb-6 w-40 text-argile" />
          <h1 className="text-4xl sm:text-5xl">Cette page s&apos;est éclipsée</h1>
          <p className="mx-auto mt-6 max-w-lg text-lg text-encre">
            L&apos;adresse a peut-être changé, ou la page n&apos;existe plus. Rien de grave : on vous raccompagne.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Nous contacter
            </ButtonLink>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
