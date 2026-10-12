import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { TextSection } from "@/components/site/TextSection";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";

export function generateMetadata() {
  return getPageMetadata("lingerie-homme", "/lingerie-homme");
}

export default async function LingerieHommePage() {
  const page = await requirePage("lingerie-homme");
  return (
    <>
      <PageHero page={page} eyebrow="Univers homme" variant="homme">
        <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
        <ButtonLink href="/nuit-homewear-bain" variant="secondary">
          Nuit, homewear et bain
        </ButtonLink>
      </PageHero>
      <Container className="grid gap-16 py-16 sm:py-20 lg:grid-cols-2 lg:gap-x-16">
        <TextSection section={getSection(page, "selection")} />
        <TextSection section={getSection(page, "confort")} />
        <TextSection section={getSection(page, "conseil")} className="rounded-3xl bg-sauge-pale p-6 sm:p-8" />
        <TextSection section={getSection(page, "offrir")} />
      </Container>
      <CtaBand title="Passez en boutique" text="Le conseil vaut aussi pour les hommes : venez essayer, comparer et poser vos questions.">
        <ButtonLink href="/contact">Nous trouver</ButtonLink>
        <ButtonLink href="/conseil" variant="light">
          En savoir plus sur le conseil
        </ButtonLink>
      </CtaBand>
    </>
  );
}
