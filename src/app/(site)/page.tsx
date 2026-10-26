import Link from "next/link";
import { Bandeau } from "@/components/motion/Bandeau";
import { TexteEclaire } from "@/components/motion/TexteEclaire";
import { CtaBand } from "@/components/site/CtaBand";
import { EtapesEmpilees } from "@/components/site/EtapesEmpilees";
import { HeroAccueil } from "@/components/site/HeroAccueil";
import { PhotoFrame } from "@/components/site/PhotoFrame";
import { PracticalInfo } from "@/components/site/PracticalInfo";
import { SizeFinder } from "@/components/site/SizeFinder";
import { UniversPrincipaux, UniversSecondaires } from "@/components/site/UniversPanneaux";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { getSection, parseTextBlocks } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getBrands, getCategories, getSiteSettings } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("accueil", "/");
}

const ENGAGEMENTS = [
  "Conseil personnalisé",
  "Essayage en cabine",
  "Du petit dos au grand bonnet",
  "Lingerie femme et homme",
  "Depuis 1912",
];

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
      {/* 1. Accroche plein écran */}
      <HeroAccueil nom="Devine">
        {settings.tagline ? <p className="font-display text-xl italic text-argile-clair sm:text-2xl">{settings.tagline}</p> : null}
        <h1 className="mt-4 text-3xl leading-tight sm:text-[2.8rem]">{page.heading}</h1>
        {page.intro ? <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-lin/80 sm:text-lg">{page.intro}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact" variant="creme">
            Préparer ma visite
          </ButtonLink>
          <ButtonLink href="#taille" variant="light">
            Trouver ma taille
          </ButtonLink>
        </div>
      </HeroAccueil>

      {/* 2. Bandeau des engagements */}
      <div id="suite" className="scroll-mt-16">
        <Bandeau
          label="Nos engagements"
          items={ENGAGEMENTS}
          duree={38}
          className="bg-argile py-6 font-display text-3xl italic text-lin sm:py-8 sm:text-5xl"
        />
      </div>

      {/* 3. Univers femme et homme, plein écran */}
      <section aria-labelledby="univers-femme-homme">
        <Container size="full" className="grid gap-6 py-20 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 id="univers-femme-homme" className="reveal text-5xl sm:text-7xl xl:text-8xl">
            {femmeHomme?.heading ?? "Nos univers"}
          </h2>
          {femmeHomme ? (
            <div className="reveal" style={{ ["--d" as string]: 1 }}>
              <RichText text={femmeHomme.body} className="max-w-lg text-lg leading-relaxed text-encre" />
            </div>
          ) : null}
        </Container>
        <UniversPrincipaux categories={categories} />
        <Container size="full" className="py-16 sm:py-20">
          <h3 className="reveal mb-8 font-display text-3xl italic text-sauge sm:text-4xl">Et aussi</h3>
          <UniversSecondaires categories={categories} />
        </Container>
      </section>

      {/* 4. La promesse, qui s'éclaire mot à mot */}
      {settings.promise ? (
        <section aria-labelledby={univers ? "univers" : undefined} aria-label={univers ? undefined : "Notre promesse"} className="on-dark dentelle relative flex min-h-[100svh] items-center bg-nuit text-lin">
          <Container size="full" className="py-28">
            <TexteEclaire
              texte={`« ${settings.promise} »`}
              className="max-w-6xl font-display text-5xl italic leading-[1.08] sm:text-7xl xl:text-[6.5rem]"
            />
            {univers ? (
              <div className="reveal mt-16 grid gap-6 border-t border-lin/15 pt-10 lg:grid-cols-[0.8fr_1.2fr]">
                <h2 id="univers" className="text-3xl sm:text-4xl">
                  {univers.heading}
                </h2>
                <RichText text={univers.body} className="max-w-2xl text-lg leading-relaxed text-lin/80" />
              </div>
            ) : null}
          </Container>
        </section>
      ) : null}

      {/* 5. Le conseil : étapes qui s'empilent */}
      {conseil ? (
        <section aria-labelledby="conseil" className="bg-lin">
          <Container size="full" className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 id="conseil" className="reveal text-5xl sm:text-7xl">
                {conseil.heading}
              </h2>
              <p className="reveal mt-6 max-w-md text-lg leading-relaxed text-encre" style={{ ["--d" as string]: 1 }}>
                Une taille ne se devine pas sur une étiquette. Elle se trouve en observant, en essayant, en ajustant.
              </p>
              <div className="reveal mt-9" style={{ ["--d" as string]: 2 }}>
                <ButtonLink href="/conseil">En savoir plus sur le conseil</ButtonLink>
              </div>
            </div>
            <EtapesEmpilees text={conseil.body} />
          </Container>
        </section>
      ) : null}

      {/* 6. Trouvez votre taille */}
      <section id="taille" aria-labelledby="taille-titre" className="satin satin-chair scroll-mt-16">
        <Container size="full" className="grid gap-12 py-24 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="reveal">
            <h2 id="taille-titre" className="text-5xl sm:text-7xl">
              Trouvez votre taille
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-encre">
              Deux mesures, un mètre ruban, et vous avez une taille de départ. Le reste, on le trouve ensemble en cabine.
            </p>
          </div>
          <div className="reveal" style={{ ["--d" as string]: 1 }}>
            <SizeFinder />
          </div>
        </Container>
      </section>

      {/* 7. Les besoins */}
      {besoins ? (
        <section aria-labelledby="besoins">
          <Container size="full" className="py-24 sm:py-32">
            <h2 id="besoins" className="reveal max-w-4xl text-5xl sm:text-7xl">
              {besoins.heading}
            </h2>
            <ul className="mt-12 flex flex-wrap gap-3 sm:gap-4">
              {besoinsItems.map((item, index) => (
                <li
                  key={item}
                  className={`reveal reveal-zoom rounded-full px-6 py-4 text-lg sm:px-8 sm:py-5 sm:text-2xl ${index % 3 === 0 ? "bg-nude" : index % 3 === 1 ? "bg-sable" : "border border-nuit/25"}`}
                  style={{ ["--d" as string]: index }}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="reveal mt-10 text-lg text-encre">
              Quelle que soit votre question,{" "}
              <Link href="/contact" className="lien font-semibold">
                parlons-en
              </Link>
              .
            </p>
          </Container>
        </section>
      ) : null}

      {/* 8. Les marques en grand bandeau */}
      {brands.length > 0 ? (
        <section aria-labelledby="marques" className="border-y border-nuit/10 py-16 sm:py-24">
          <Container size="full" className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 id="marques" className="reveal max-w-2xl text-4xl sm:text-5xl">
              {marques?.heading ?? "Nos marques"}
            </h2>
            <Link href="/marques" className="lien reveal font-semibold">
              Toutes nos marques
            </Link>
          </Container>
          <Bandeau
            label="Marques présentes en boutique"
            items={brands.map((brand) => brand.name)}
            duree={30}
            sens="inverse"
            className="font-display text-6xl italic text-nuit sm:text-8xl xl:text-9xl"
          />
        </section>
      ) : null}

      {/* 9. L'histoire */}
      {histoire ? (
        <section aria-labelledby="histoire" className="overflow-hidden">
          <Container size="full" className="grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="overflow-hidden rounded-[2rem]">
                <div className="parallaxe">
                  <PhotoFrame slot="histoire" variant="histoire" monogramme="H" sizes="(min-width: 1024px) 45vw, 90vw" className="aspect-[4/5] sm:aspect-[5/4]" />
                </div>
              </div>
              <p aria-hidden="true" className="grandit absolute -bottom-14 left-2 origin-bottom-left font-display text-[8rem] italic leading-none text-argile sm:text-[12rem] xl:text-[14rem]">
                1912
              </p>
            </div>
            <div className="reveal pt-10 lg:pt-0">
              <h2 id="histoire" className="text-4xl sm:text-6xl">
                {histoire.heading}
              </h2>
              <RichText text={histoire.body} className="mt-6 text-lg leading-relaxed text-encre" />
              <ButtonLink href="/histoire" variant="secondary" className="mt-9">
                Découvrir notre histoire
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 10. Venir à la boutique */}
      <section aria-labelledby="infos-pratiques" className="bg-sable">
        <Container size="full" className="grid gap-10 py-24 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 id="infos-pratiques" className="reveal text-5xl sm:text-7xl">
            Venir à la boutique
          </h2>
          <div className="reveal" style={{ ["--d" as string]: 1 }}>
            <PracticalInfo settings={settings} />
          </div>
        </Container>
      </section>

      {/* 11. Invitation */}
      <CtaBand title={visite?.heading ?? "Passez nous voir"} text={visite?.body}>
        <ButtonLink href="/contact" variant="creme">
          Nous trouver en boutique
        </ButtonLink>
        <ButtonLink href="/contact#formulaire" variant="light">
          Nous écrire
        </ButtonLink>
      </CtaBand>
    </>
  );
}
