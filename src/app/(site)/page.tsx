import Link from "next/link";
import { Arche } from "@/components/brand/Arche";
import { Trait } from "@/components/brand/Trait";
import { BrandList } from "@/components/site/BrandList";
import { CategoryCards } from "@/components/site/CategoryCards";
import { CtaBand } from "@/components/site/CtaBand";
import { HeroVisual } from "@/components/site/HeroVisual";
import { PracticalInfo } from "@/components/site/PracticalInfo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getBrands, getCategories, getSiteSettings } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("accueil", "/");
}

export default async function HomePage() {
  const [page, settings, categories, brands] = await Promise.all([
    requirePage("accueil"),
    getSiteSettings(),
    getCategories(),
    getBrands(),
  ]);

  const univers = getSection(page, "univers");
  const femmeHomme = getSection(page, "univers-femme-homme");
  const conseil = getSection(page, "conseil");
  const besoins = getSection(page, "besoins");
  const marques = getSection(page, "marques");
  const histoire = getSection(page, "histoire");
  const visite = getSection(page, "visite");

  const femme = categories.find((category) => category.slug === "lingerie-femme");
  const homme = categories.find((category) => category.slug === "lingerie-homme");
  const autres = categories.filter((category) => category !== femme && category !== homme);

  return (
    <>
      {/* 1. Accroche */}
      <section className="overflow-hidden">
        <Container size="wide" className="grid items-center gap-10 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-20 lg:pt-16">
          <div>
            {settings.tagline ? (
              <p className="mb-5 font-serif text-lg italic text-bois-fonce">{settings.tagline}</p>
            ) : null}
            <h1 className="text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-7xl">{page.heading}</h1>
            {page.intro ? <p className="mt-6 max-w-xl text-lg text-encre sm:text-xl">{page.intro}</p> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
              <ButtonLink href="/conseil" variant="secondary">
                Découvrir le conseil
              </ButtonLink>
            </div>
            <p className="mt-8 text-encre">
              Lingerie{" "}
              <Link href="/lingerie-femme" className="lien">
                femme
              </Link>{" "}
              et{" "}
              <Link href="/lingerie-homme" className="lien">
                homme
              </Link>
              , nuit, homewear et bain.
            </p>
          </div>
          <HeroVisual image={page.heroImage} variant="accueil" priority className="mx-auto w-full max-w-md lg:max-w-none" />
        </Container>
      </section>

      {/* 2. L'univers DEVINE */}
      {univers ? (
        <section aria-labelledby="univers" className="bg-sable/60">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16">
            <div className="apparition">
              <h2 id="univers" className="text-3xl sm:text-4xl">
                {univers.heading}
              </h2>
              <RichText text={univers.body} className="mt-5 text-lg text-encre" />
            </div>
            {settings.promise ? (
              <blockquote className="apparition self-center border-l border-bois pl-6 font-serif text-2xl italic leading-snug sm:text-3xl">
                <p>« {settings.promise} »</p>
              </blockquote>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* 3. Univers femme et homme */}
      <section aria-labelledby="univers-femme-homme">
        <Container size="wide" className="py-16 sm:py-20">
          <div className="max-w-2xl">
            <h2 id="univers-femme-homme" className="text-3xl sm:text-4xl">
              {femmeHomme?.heading ?? "Deux univers, une même attention"}
            </h2>
            {femmeHomme ? <RichText text={femmeHomme.body} className="mt-4 text-lg text-encre" /> : null}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              { category: femme, href: "/lingerie-femme", label: "Explorer la lingerie femme", variant: "femme" as const },
              { category: homme, href: "/lingerie-homme", label: "Découvrir la lingerie homme", variant: "homme" as const },
            ].map(({ category, href, label, variant }) =>
              category ? (
                <Link
                  key={href}
                  href={href}
                  className="group grid grid-cols-[7rem_1fr] items-center gap-5 rounded-3xl border border-nuit/10 bg-sable/50 p-5 transition-colors hover:border-nuit/30 sm:grid-cols-[9rem_1fr] sm:p-6"
                >
                  <span className="block aspect-[4/5] overflow-hidden rounded-t-full">
                    <Arche variant={variant} className="h-full w-full" />
                  </span>
                  <span>
                    <span className="block font-serif text-2xl sm:text-3xl">{category.name}</span>
                    {category.summary ? <span className="mt-2 block text-encre">{category.summary}</span> : null}
                    <span className="mt-4 inline-block text-argile underline-offset-4 group-hover:underline">{label}</span>
                  </span>
                </Link>
              ) : null,
            )}
          </div>
          {autres.length > 0 ? (
            <div className="mt-6">
              <CategoryCards categories={autres} />
            </div>
          ) : null}
        </Container>
      </section>

      {/* 4. Le conseil */}
      {conseil ? (
        <section aria-labelledby="conseil" className="bg-sauge-pale">
          <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="apparition">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-sauge">Notre expertise</p>
              <h2 id="conseil" className="text-3xl sm:text-4xl">
                {conseil.heading}
              </h2>
              <ButtonLink href="/conseil" variant="secondary" className="mt-8">
                En savoir plus sur le conseil
              </ButtonLink>
            </div>
            <RichText text={conseil.body} className="apparition text-lg text-nuit" />
          </Container>
        </section>
      ) : null}

      {/* 5. Les besoins */}
      {besoins ? (
        <section aria-labelledby="besoins">
          <Container className="py-16 sm:py-20">
            <h2 id="besoins" className="text-3xl sm:text-4xl">
              {besoins.heading}
            </h2>
            <RichText text={besoins.body} className="mt-8 text-lg sm:[&_ul]:grid-cols-2 sm:[&_ul]:gap-x-12" />
            <p className="mt-8 text-encre">
              Quelle que soit votre question,{" "}
              <Link href="/contact" className="lien">
                parlons-en
              </Link>
              .
            </p>
          </Container>
        </section>
      ) : null}

      {/* 6. Les marques */}
      {brands.length > 0 ? (
        <section aria-labelledby="marques" className="border-y border-nuit/10 bg-sable/40">
          <Container className="py-16 sm:py-20">
            <h2 id="marques" className="text-3xl sm:text-4xl">
              {marques?.heading ?? "Nos marques"}
            </h2>
            {marques ? <RichText text={marques.body} className="mt-4 max-w-2xl text-lg text-encre" /> : null}
            <div className="mt-8">
              <BrandList brands={brands} />
            </div>
            <Link href="/marques" className="lien mt-8 inline-block">
              Toutes nos marques
            </Link>
          </Container>
        </section>
      ) : null}

      {/* 7. L'histoire */}
      {histoire ? (
        <section aria-labelledby="histoire">
          <Container className="grid items-center gap-8 py-16 sm:py-20 md:grid-cols-[auto_1fr] md:gap-16">
            <p aria-hidden="true" className="font-serif text-7xl leading-none text-bois sm:text-8xl lg:text-9xl">
              1912
            </p>
            <div className="apparition">
              <h2 id="histoire" className="text-3xl sm:text-4xl">
                {histoire.heading}
              </h2>
              <RichText text={histoire.body} className="mt-4 text-lg text-encre" />
              <Link href="/histoire" className="lien mt-6 inline-block">
                Découvrir notre histoire
              </Link>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 8. Informations pratiques */}
      <section aria-labelledby="infos-pratiques" className="bg-sable/60">
        <Container className="py-16 sm:py-20">
          <Trait className="mb-6 w-32 text-argile" />
          <h2 id="infos-pratiques" className="text-3xl sm:text-4xl">
            Informations pratiques
          </h2>
          <div className="mt-8">
            <PracticalInfo settings={settings} />
          </div>
        </Container>
      </section>

      {/* 9. Invitation */}
      <CtaBand title={visite?.heading ?? "Passez nous voir"} text={visite?.body}>
        <ButtonLink href="/contact">Nous trouver en boutique</ButtonLink>
        <ButtonLink href="/contact#formulaire" variant="light">
          Nous écrire
        </ButtonLink>
      </CtaBand>
    </>
  );
}
