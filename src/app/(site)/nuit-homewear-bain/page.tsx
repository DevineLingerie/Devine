import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { RichText } from "@/components/ui/RichText";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";

export function generateMetadata() {
  return getPageMetadata("nuit-homewear-bain", "/nuit-homewear-bain");
}

export default async function NuitHomewearBainPage() {
  const page = await requirePage("nuit-homewear-bain");
  const sections = ["nuit", "homewear", "bain"].map((key) => getSection(page, key)).filter((s) => s !== null);
  return (
    <>
      <PageHero page={page} eyebrow="Nuit · homewear · bain" variant="nuit" />
      <Container size="wide" className="py-16 sm:py-20">
        <ul className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <li key={section.key} className="apparition rounded-3xl border border-nuit/10 bg-sable/50 p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl">{section.heading}</h2>
              <RichText text={section.body} className="mt-4 text-encre" />
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand title="Une question sur un modèle ?" text="Les collections changent avec les saisons : demandez-nous ce qui est disponible.">
        <ButtonLink href="/contact#formulaire">Nous contacter</ButtonLink>
      </CtaBand>
    </>
  );
}
