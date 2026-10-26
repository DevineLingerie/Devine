import { PageIntro } from "@/components/site/PageIntro";
import { BrandList } from "@/components/site/BrandList";
import { CtaBand } from "@/components/site/CtaBand";
import { TextSection } from "@/components/site/TextSection";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getBrands } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("marques", "/marques");
}

export default async function MarquesPage() {
  const [page, brands] = await Promise.all([requirePage("marques"), getBrands()]);
  return (
    <>
      <PageIntro eyebrow="Notre sélection" title={page.heading} intro={page.intro} />
      <Container size="full" className="py-20 sm:py-24">
        <div className="reveal">
          <BrandList brands={brands} detailed />
        </div>
        <TextSection section={getSection(page, "selection")} className="mt-16 max-w-2xl" />
      </Container>
      <CtaBand title="Vous cherchez une référence ?" text="Dites-nous ce que vous cherchez, nous vous dirons si nous l'avons.">
        <ButtonLink href="/contact#formulaire">Nous écrire</ButtonLink>
      </CtaBand>
    </>
  );
}
