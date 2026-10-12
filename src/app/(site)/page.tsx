import Link from "next/link";
import { Sceau } from "@/components/brand/Sceau";
import { Vitrine } from "@/components/brand/Vitrine";
import { BrandList } from "@/components/site/BrandList";
import { CategoryCards } from "@/components/site/CategoryCards";
import { CtaBand } from "@/components/site/CtaBand";
import { HeroVisual } from "@/components/site/HeroVisual";
import { PracticalInfo } from "@/components/site/PracticalInfo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { StepList } from "@/components/ui/StepList";
import { getSection, parseTextBlocks } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getBrands, getCategories, getSiteSettings } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("accueil", "/");
}

const REASSURANCE = ["Conseil personnalisé", "Essayage en cabine", "Grands bonnets & petits dos", "Lingerie femme & homme"];

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
  const besoinsItems = besoins ? parseTextBlocks(besoins.body).flatMap((block) => (block.type === "list" ? block.items : [])) : [];

  return (
    <>
      {/* 1. Accroche */}
      <section className="tulle relative overflow-hidden bg-sable">
        <Container size="wide" className="grid items-center gap-12 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            {settings.tagline ? <p className="surtitre mb-6 text-sauge">{settings.tagline}</p> : null}
            <h1 className="text-[3.4rem] leading-[0.98] sm:text-7xl lg:text-[6.5rem]">{page.heading}</h1>
            {page.intro ? <p className="mt-8 max-w-xl text-lg leading-relaxed text-encre sm:text-xl">{page.intro}</p> : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact" arrow>
                Préparer ma visite
              </ButtonLink>
              <ButtonLink href="/conseil" variant="secondary">
                Découvrir le conseil
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <HeroVisual image={page.heroImage} variant="accueil" priority />
            <Sceau className="absolute -bottom-6 -left-4 h-28 w-28 drop-shadow-lg sm:-left-10 sm:h-32 sm:w-32" />
          </div>
        </Container>
      </section>

      {/* Réassurance */}
      <section aria-label="Nos engagements" className="border-b border-nuit/10 bg-lin">
        <Container size="wide">
          <ul className="grid grid-cols-2 lg:grid-cols-4">
            {REASSURANCE.map((item, index) => (
              <li
                key={item}
                className={`flex items-center justify-center gap-3 px-3 py-6 text-center text-sm font-semibold sm:text-base ${index % 2 === 1 ? "border-l border-nuit/10" : ""} ${index > 1 ? "border-t border-nuit/10 lg:border-t-0" : ""} ${index === 2 ? "lg:border-l" : ""}`}
              >
                <span aria-hidden="true" className="text-bois">
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2. L'univers DEVINE */}
      {univers ? (
        <section aria-labelledby="univers">
          <Container size="wide" className="grid gap-10 py-20 sm:py-28 lg:grid-cols-[1fr_1fr] lg:gap-20">
            {settings.promise ? (
              <p className="apparition font-serif text-4xl italic leading-[1.1] text-argile sm:text-5xl lg:text-6xl">« {settings.promise} »</p>
            ) : null}
            <div className="apparition self-end">
              <h2 id="univers" className="text-4xl sm:text-5xl">
                {univers.heading}
              </h2>
              <RichText text={univers.body} className="mt-6 text-lg leading-relaxed text-encre" />
            </div>
          </Container>
        </section>
      ) : null}

      {/* 3. Univers femme et homme */}
      <section aria-labelledby="univers-femme-homme" className="pb-20 sm:pb-28">
        <Container size="wide">
          <div className="mx-auto max-w-2xl text-center">
            <p className="surtitre text-sauge">Nos univers</p>
            <h2 id="univers-femme-homme" className="mt-4 text-5xl sm:text-6xl">
              {femmeHomme?.heading ?? "Deux univers, une même attention"}
            </h2>
            {femmeHomme ? <RichText text={femmeHomme.body} className="mt-5 text-lg leading-relaxed text-encre" /> : null}
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[
              { category: femme, href: "/lingerie-femme", label: "Explorer la lingerie femme", variant: "femme" as const, tint: "bg-sable" },
              { category: homme, href: "/lingerie-homme", label: "Découvrir la lingerie homme", variant: "homme" as const, tint: "bg-sauge-pale" },
            ].map(({ category, href, label, variant, tint }) =>
              category ? (
                <Link
                  key={href}
                  href={href}
                  className={`group grid items-end gap-6 overflow-hidden rounded-[2.25rem] p-6 transition-transform duration-500 hover:-translate-y-1 sm:grid-cols-[1fr_11rem] sm:p-10 ${tint}`}
                >
                  <span className="order-2 sm:order-1">
                    <span className="surtitre block text-sauge">{variant === "femme" ? "Univers femme" : "Univers homme"}</span>
                    <span className="mt-3 block font-serif text-5xl leading-none sm:text-6xl">{category.name}</span>
                    {category.summary ? <span className="mt-4 block max-w-sm leading-relaxed text-encre">{category.summary}</span> : null}
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold text-argile">
                      {label}
                      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </span>
                  <span className="order-1 block aspect-[4/5] w-36 overflow-hidden rounded-t-full rounded-b-2xl sm:order-2 sm:w-auto">
                    <Vitrine variant={variant} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
                  </span>
                </Link>
              ) : null,
            )}
          </div>
          {autres.length > 0 ? (
            <div className="mt-5">
              <CategoryCards categories={autres} />
            </div>
          ) : null}
        </Container>
      </section>

      {/* 4. Le conseil */}
      {conseil ? (
        <section aria-labelledby="conseil" className="bg-sauge-pale">
          <Container size="wide" className="py-20 sm:py-28">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <p className="surtitre text-sauge">Notre savoir-faire</p>
                <h2 id="conseil" className="mt-4 text-5xl sm:text-6xl">
                  {conseil.heading}
                </h2>
              </div>
              <div className="lg:justify-self-end">
                <ButtonLink href="/conseil" variant="dark" arrow>
                  En savoir plus sur le conseil
                </ButtonLink>
              </div>
            </div>
            <StepList text={conseil.body} />
          </Container>
        </section>
      ) : null}

      {/* 5. Les besoins */}
      {besoins ? (
        <section aria-labelledby="besoins">
          <Container size="wide" className="py-20 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <h2 id="besoins" className="text-5xl sm:text-6xl">
                  {besoins.heading}
                </h2>
                <p className="mt-6 text-lg text-encre">
                  Quelle que soit votre question,{" "}
                  <Link href="/contact" className="lien">
                    parlons-en
                  </Link>
                  .
                </p>
              </div>
              <ul className="flex flex-wrap content-start gap-3">
                {besoinsItems.map((item, index) => (
                  <li
                    key={item}
                    className={`rounded-full px-5 py-3 text-base sm:text-lg ${index % 3 === 0 ? "bg-sable" : index % 3 === 1 ? "bg-sauge-pale" : "bg-lin ring-1 ring-nuit/15"}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 6. Les marques */}
      {brands.length > 0 ? (
        <section aria-labelledby="marques" className="border-y border-nuit/10">
          <Container size="wide" className="py-16 text-center sm:py-20">
            <p className="surtitre text-sauge">Nos marques</p>
            <h2 id="marques" className="mx-auto mt-4 max-w-2xl text-4xl sm:text-5xl">
              {marques?.heading ?? "Nos marques"}
            </h2>
            <div className="mt-10">
              <BrandList brands={brands} />
            </div>
            <Link href="/marques" className="lien mt-10 inline-block font-semibold">
              Toutes nos marques
            </Link>
          </Container>
        </section>
      ) : null}

      {/* 7. L'histoire */}
      {histoire ? (
        <section aria-labelledby="histoire" className="overflow-hidden">
          <Container size="wide" className="grid items-center gap-8 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <p
              aria-hidden="true"
              className="font-serif text-[8rem] italic leading-none text-transparent sm:text-[13rem] lg:text-[16rem]"
              style={{ WebkitTextStroke: "1.5px var(--color-bois-fonce)" }}
            >
              1912
            </p>
            <div className="apparition">
              <p className="surtitre text-sauge">Notre histoire</p>
              <h2 id="histoire" className="mt-4 text-4xl sm:text-5xl">
                {histoire.heading}
              </h2>
              <RichText text={histoire.body} className="mt-6 text-lg leading-relaxed text-encre" />
              <ButtonLink href="/histoire" variant="secondary" className="mt-8" arrow>
                Découvrir notre histoire
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 8. Informations pratiques */}
      <section aria-labelledby="infos-pratiques" className="bg-sable">
        <Container size="wide" className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="surtitre text-sauge">Venir à la boutique</p>
            <h2 id="infos-pratiques" className="mt-4 text-5xl sm:text-6xl">
              Informations pratiques
            </h2>
          </div>
          <PracticalInfo settings={settings} />
        </Container>
      </section>

      {/* 9. Invitation */}
      <CtaBand title={visite?.heading ?? "Passez nous voir"} text={visite?.body}>
        <ButtonLink href="/contact" arrow>
          Nous trouver en boutique
        </ButtonLink>
        <ButtonLink href="/contact#formulaire" variant="secondary">
          Nous écrire
        </ButtonLink>
      </CtaBand>
    </>
  );
}
