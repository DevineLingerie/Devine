import Link from "next/link";
import { Sceau } from "@/components/brand/Sceau";
import { BrandList } from "@/components/site/BrandList";
import { CtaBand } from "@/components/site/CtaBand";
import { HeroVisual } from "@/components/site/HeroVisual";
import { PracticalInfo } from "@/components/site/PracticalInfo";
import { SizeFinder } from "@/components/site/SizeFinder";
import { UniverseGrid } from "@/components/site/UniverseGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { RichText } from "@/components/ui/RichText";
import { StepList } from "@/components/ui/StepList";
import { getSection, parseTextBlocks } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getBrands, getCategories, getSiteSettings } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("accueil", "/");
}

const ENGAGEMENTS: { icon: IconName; title: string; text: string }[] = [
  { icon: "conseil", title: "Conseil personnalisé", text: "On prend le temps de vous écouter" },
  { icon: "cintre", title: "Essayage en cabine", text: "Plusieurs modèles, plusieurs tailles" },
  { icon: "mesure", title: "Du petit dos au grand bonnet", text: "Les tailles difficiles à trouver" },
  { icon: "duo", title: "Femme & homme", text: "Deux univers, la même attention" },
];

/** Met en italique la fin du titre, après la première virgule (« … va, choisie avec vous. »). */
function HeroTitle({ text }: { text: string }) {
  const comma = text.indexOf(",");
  if (comma === -1 || comma === text.length - 1) return <>{text}</>;
  return (
    <>
      {text.slice(0, comma + 1)} <em className="text-argile">{text.slice(comma + 1).trim()}</em>
    </>
  );
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
  const besoinsItems = besoins ? parseTextBlocks(besoins.body).flatMap((block) => (block.type === "list" ? block.items : [])) : [];

  return (
    <>
      {/* 1. Accroche */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="tulle relative mx-auto max-w-[96rem] overflow-hidden rounded-[2rem] bg-nude sm:rounded-[2.75rem]">
          <Container size="wide" className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:py-20">
            <div>
              {settings.tagline ? (
                <p className="surtitre inline-flex rounded-full bg-lin px-4 py-2 text-nuit">{settings.tagline}</p>
              ) : null}
              <h1 className="mt-6 text-[3rem] leading-[0.98] sm:text-7xl lg:text-[5.75rem]">
                <HeroTitle text={page.heading} />
              </h1>
              {page.intro ? <p className="mt-7 max-w-xl text-lg leading-relaxed text-nuit/80 sm:text-xl">{page.intro}</p> : null}
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/contact" arrow>
                  Préparer ma visite
                </ButtonLink>
                <ButtonLink href="#taille" variant="secondary">
                  Trouver ma taille
                </ButtonLink>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
              <HeroVisual image={page.heroImage} variant="accueil" priority />
              <Sceau className="absolute -bottom-5 -left-5 h-28 w-28 drop-shadow-xl sm:-left-10 sm:h-32 sm:w-32" />
            </div>
          </Container>
        </div>
      </section>

      {/* 2. Engagements */}
      <section aria-label="Nos engagements">
        <Container size="wide">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 py-12 lg:grid-cols-4 lg:py-14">
            {ENGAGEMENTS.map((item) => (
              <li key={item.title} className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sable text-argile">
                  <Icon name={item.icon} className="h-7 w-7" />
                </span>
                <span className="mt-3 sm:mt-1">
                  <span className="block font-bold leading-tight">{item.title}</span>
                  <span className="mt-1 block text-sm text-encre">{item.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3. Univers */}
      <section aria-labelledby="univers-femme-homme" className="pb-20 sm:pb-24">
        <Container size="wide">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <h2 id="univers-femme-homme" className="text-4xl sm:text-6xl">
                {femmeHomme?.heading ?? "Nos univers"}
              </h2>
              {femmeHomme ? <RichText text={femmeHomme.body} className="mt-4 text-lg leading-relaxed text-encre" /> : null}
            </div>
          </div>
          <div className="mt-10">
            <UniverseGrid categories={categories} />
          </div>
        </Container>
      </section>

      {/* 4. Trouvez votre taille */}
      <section id="taille" aria-labelledby="taille-titre" className="scroll-mt-28 px-3 sm:px-5">
        <div className="mx-auto max-w-[96rem] rounded-[2rem] bg-sauge-pale sm:rounded-[2.75rem]">
          <Container size="wide" className="py-16 sm:py-20">
            <div className="max-w-2xl">
              <p className="surtitre text-sauge">Guide des tailles</p>
              <h2 id="taille-titre" className="mt-4 text-4xl sm:text-6xl">
                Trouvez <em>votre</em> taille
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-encre">
                Deux mesures, un mètre ruban, et vous avez une taille de départ. Le reste, on le trouve ensemble en cabine.
              </p>
            </div>
            <div className="mt-10">
              <SizeFinder />
            </div>
          </Container>
        </div>
      </section>

      {/* 5. Le conseil */}
      {conseil ? (
        <section aria-labelledby="conseil">
          <Container size="wide" className="py-20 sm:py-24">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-2xl">
                <p className="surtitre text-sauge">Notre savoir-faire</p>
                <h2 id="conseil" className="mt-4 text-4xl sm:text-6xl">
                  {conseil.heading}
                </h2>
              </div>
              <ButtonLink href="/conseil" variant="secondary" arrow>
                En savoir plus sur le conseil
              </ButtonLink>
            </div>
            <div className="[&_li]:bg-sable">
              <StepList text={conseil.body} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* 6. La promesse */}
      {univers ? (
        <section aria-labelledby="univers" className="bg-nuit text-lin on-dark">
          <Container size="wide" className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            {settings.promise ? (
              <p className="font-serif text-4xl italic leading-[1.1] sm:text-5xl lg:text-6xl">« {settings.promise} »</p>
            ) : null}
            <div className="self-end">
              <h2 id="univers" className="text-3xl sm:text-4xl">
                {univers.heading}
              </h2>
              <RichText text={univers.body} className="mt-5 text-lg leading-relaxed text-lin/80" />
            </div>
          </Container>
        </section>
      ) : null}

      {/* 7. Les besoins */}
      {besoins ? (
        <section aria-labelledby="besoins">
          <Container size="wide" className="py-20 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
              <div>
                <h2 id="besoins" className="text-4xl sm:text-6xl">
                  {besoins.heading}
                </h2>
                <p className="mt-6 text-lg text-encre">
                  Quelle que soit votre question,{" "}
                  <Link href="/contact" className="lien font-bold">
                    parlons-en
                  </Link>
                  .
                </p>
              </div>
              <ul className="flex flex-wrap content-start gap-3">
                {besoinsItems.map((item, index) => (
                  <li
                    key={item}
                    className={`rounded-full px-5 py-3 text-base font-semibold sm:text-lg ${index % 3 === 0 ? "bg-nude" : index % 3 === 1 ? "bg-sauge-pale" : "bg-sable"}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 8. Les marques */}
      {brands.length > 0 ? (
        <section aria-labelledby="marques" className="border-y border-nuit/10 bg-sable">
          <Container size="wide" className="py-16 text-center sm:py-20">
            <p className="surtitre text-sauge">Nos marques</p>
            <h2 id="marques" className="mx-auto mt-4 max-w-2xl text-3xl sm:text-5xl">
              {marques?.heading ?? "Nos marques"}
            </h2>
            <div className="mt-10">
              <BrandList brands={brands} />
            </div>
            <Link href="/marques" className="lien mt-10 inline-block font-bold">
              Toutes nos marques
            </Link>
          </Container>
        </section>
      ) : null}

      {/* 9. L'histoire */}
      {histoire ? (
        <section aria-labelledby="histoire" className="overflow-hidden">
          <Container size="wide" className="grid items-center gap-8 py-20 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <p
              aria-hidden="true"
              className="font-serif text-[8rem] italic leading-none text-transparent sm:text-[13rem] lg:text-[16rem]"
              style={{ WebkitTextStroke: "1.5px var(--color-bois-fonce)" }}
            >
              1912
            </p>
            <div className="apparition">
              <p className="surtitre text-sauge">Notre histoire</p>
              <h2 id="histoire" className="mt-4 text-3xl sm:text-5xl">
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

      {/* 10. Informations pratiques */}
      <section aria-labelledby="infos-pratiques" className="border-t border-nuit/10">
        <Container size="wide" className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="surtitre text-sauge">Venir à la boutique</p>
            <h2 id="infos-pratiques" className="mt-4 text-4xl sm:text-6xl">
              Informations pratiques
            </h2>
          </div>
          <PracticalInfo settings={settings} />
        </Container>
      </section>

      {/* 11. Invitation */}
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
