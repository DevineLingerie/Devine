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
      <Container size="wide" className="py-14 sm:py-20">
        <p className="surtitre mb-5 text-sauge">Sélection</p>
        <h1 className="text-5xl leading-none sm:text-6xl lg:text-7xl">{page.heading}</h1>
        {page.intro ? <p className="mt-6 max-w-2xl text-lg text-encre sm:text-xl">{page.intro}</p> : null}
        <div className="mt-12">
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
