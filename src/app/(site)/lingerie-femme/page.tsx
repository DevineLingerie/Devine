import { CategoryCards } from "@/components/site/CategoryCards";
import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { TextSection } from "@/components/site/TextSection";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getCategories } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("lingerie-femme", "/lingerie-femme");
}

export default async function LingerieFemmePage() {
  const [page, categories] = await Promise.all([requirePage("lingerie-femme"), getCategories()]);
  const complementaires = categories.filter((c) => c.audience === "mixte");
  return (
    <>
      <PageHero page={page} eyebrow="Univers femme" variant="femme">
        <ButtonLink href="/conseil">Trouver ce qui vous va</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Préparer ma visite
        </ButtonLink>
      </PageHero>
      <Container size="full" className="grid gap-14 py-20 sm:py-24">
        <TextSection section={getSection(page, "selection")} layout="split" />
        <TextSection section={getSection(page, "tailles")} layout="split" />
        <TextSection section={getSection(page, "coupe")} layout="split" />
        <TextSection section={getSection(page, "essayage")} layout="split" />
      </Container>
      {complementaires.length > 0 ? (
        <section aria-labelledby="aussi" className="border-t border-nuit/10">
          <Container size="full" className="py-20">
            <h2 id="aussi" className="text-4xl">
              À découvrir aussi
            </h2>
            <div className="mt-8">
              <CategoryCards categories={complementaires} />
            </div>
          </Container>
        </section>
      ) : null}
      <CtaBand title="Venez essayer" text="Le plus sûr moyen de trouver la bonne taille, c'est d'essayer, avec quelqu'un qui sait regarder.">
        <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
        <ButtonLink href="/lingerie-homme" variant="secondary">
          Voir aussi l&apos;univers homme
        </ButtonLink>
      </CtaBand>
    </>
  );
}
