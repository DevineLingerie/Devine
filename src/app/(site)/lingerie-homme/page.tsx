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
      <PageHero page={page} eyebrow="Univers homme" variant="homme" tone="sauge">
        <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
        <ButtonLink href="/nuit-homewear-bain" variant="secondary">
          Nuit, homewear et bain
        </ButtonLink>
      </PageHero>
      <Container size="full" className="grid gap-14 py-20 sm:py-24">
        <TextSection section={getSection(page, "selection")} layout="split" />
        <TextSection section={getSection(page, "confort")} layout="split" />
        <TextSection section={getSection(page, "conseil")} layout="split" />
        <TextSection section={getSection(page, "offrir")} layout="split" />
      </Container>
      <CtaBand title="Passez en boutique" text="Le conseil vaut aussi pour les hommes : venez essayer, comparer et poser vos questions.">
        <ButtonLink href="/contact">Nous trouver</ButtonLink>
        <ButtonLink href="/conseil" variant="secondary">
          En savoir plus sur le conseil
        </ButtonLink>
      </CtaBand>
    </>
  );
}
