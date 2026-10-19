import Link from "next/link";
import { Sceau } from "@/components/brand/Sceau";
import { BrandList } from "@/components/site/BrandList";
import { CtaBand } from "@/components/site/CtaBand";
import { PhotoFrame } from "@/components/site/PhotoFrame";
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
  { icon: "duo", title: "Femme et homme", text: "Deux univers, la même attention" },
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
      {/* 1. Accroche : le nom en très grand, puis le collage de photos. */}
      <section className="overflow-hidden bg-sable">
        <Container size="wide" className="pt-8 sm:pt-12">
          <p
            aria-hidden="true"
            className="select-none font-display text-[26vw] font-bold lowercase leading-[0.78] tracking-[-0.065em] text-nuit lg:text-[21rem]"
          >
            devine<span className="text-argile">.</span>
          </p>
          <div className="grid gap-12 pb-16 pt-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pb-24 lg:pt-12">
            <div className="max-w-xl self-end">
              {settings.tagline ? <p className="text-lg font-semibold text-sauge">{settings.tagline}</p> : null}
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-[3.5rem]">{page.heading}</h1>
              {page.intro ? <p className="mt-6 text-lg leading-relaxed text-encre sm:text-xl">{page.intro}</p> : null}
              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
                <ButtonLink href="#taille" variant="secondary">
                  Trouver ma taille
                </ButtonLink>
              </div>
            </div>
            <div className="relative mx-auto aspect-[6/5] w-full max-w-2xl">
              <PhotoFrame
                media={page.heroImage}
                slot="accueil-principale"
                variant="accueil"
                priority
                sizes="(min-width: 1024px) 34vw, 60vw"
                className="absolute left-0 top-0 h-full w-[56%] rounded-t-full rounded-b-[2rem] shadow-[0_40px_80px_-40px_rgba(26,31,34,0.5)]"
              />
              <PhotoFrame
                slot="accueil-secondaire"
                variant="femme"
                sizes="(min-width: 1024px) 22vw, 40vw"
                className="absolute right-0 top-[6%] h-[56%] w-[38%] rounded-[1.75rem]"
              />
              <PhotoFrame
                slot="accueil-detail"
                variant="homme"
                sizes="(min-width: 1024px) 16vw, 30vw"
                className="absolute bottom-0 right-[4%] aspect-square w-[30%] rounded-full ring-8 ring-sable"
              />
              <Sceau className="absolute bottom-[4%] left-[44%] h-24 w-24 drop-shadow-xl sm:h-28 sm:w-28" />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Engagements */}
      <section aria-label="Nos engagements" className="border-b border-nuit/10">
        <Container size="wide">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-8 py-12 lg:grid-cols-4">
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
      <section aria-labelledby="univers-femme-homme" className="py-20 sm:py-24">
        <Container size="wide">
          <div className="max-w-2xl">
            <h2 id="univers-femme-homme" className="text-4xl sm:text-6xl">
              {femmeHomme?.heading ?? "Nos univers"}
            </h2>
            {femmeHomme ? <RichText text={femmeHomme.body} className="mt-4 text-lg leading-relaxed text-encre" /> : null}
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
              <h2 id="taille-titre" className="text-4xl sm:text-6xl">
                Trouvez votre taille
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
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <PhotoFrame slot="conseil" variant="conseil" sizes="(min-width: 1024px) 38vw, 90vw" className="aspect-[4/5] rounded-[2rem] lg:aspect-auto lg:min-h-[34rem]" />
              <div className="self-center">
                <h2 id="conseil" className="text-4xl sm:text-6xl">
                  {conseil.heading}
                </h2>
                <div className="[&_li]:bg-sable [&_ol]:lg:grid-cols-2">
                  <StepList text={conseil.body} />
                </div>
                <ButtonLink href="/conseil" variant="secondary" className="mt-8">
                  En savoir plus sur le conseil
                </ButtonLink>
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 6. La promesse */}
      {univers ? (
        <section aria-labelledby="univers" className="on-dark bg-nuit text-lin">
          <Container size="wide" className="grid gap-10 py-20 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
            {settings.promise ? (
              <p className="font-serif text-4xl italic leading-[1.1] sm:text-6xl lg:text-7xl">« {settings.promise} »</p>
            ) : null}
            <div className="self-end">
              <h2 id="univers" className="text-2xl sm:text-3xl">
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
        <section aria-labelledby="marques" className="bg-sable">
          <Container size="wide" className="py-16 text-center sm:py-20">
            <h2 id="marques" className="mx-auto max-w-2xl text-3xl sm:text-5xl">
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
          <Container size="wide" className="grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="relative">
              <PhotoFrame slot="histoire" variant="histoire" sizes="(min-width: 1024px) 40vw, 90vw" className="aspect-[5/4] rounded-[2rem]" />
              <p
                aria-hidden="true"
                className="absolute -bottom-10 left-4 font-serif text-[7rem] italic leading-none text-nuit sm:text-[10rem]"
              >
                1912
              </p>
            </div>
            <div className="pt-8 lg:pt-0">
              <h2 id="histoire" className="text-3xl sm:text-5xl">
                {histoire.heading}
              </h2>
              <RichText text={histoire.body} className="mt-6 text-lg leading-relaxed text-encre" />
              <ButtonLink href="/histoire" variant="secondary" className="mt-8">
                Découvrir notre histoire
              </ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}

      {/* 10. Informations pratiques */}
      <section aria-labelledby="infos-pratiques" className="border-t border-nuit/10">
        <Container size="wide" className="grid gap-10 py-20 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="infos-pratiques" className="text-4xl sm:text-6xl">
            Venir à la boutique
          </h2>
          <PracticalInfo settings={settings} />
        </Container>
      </section>

      {/* 11. Invitation */}
      <CtaBand title={visite?.heading ?? "Passez nous voir"} text={visite?.body}>
        <ButtonLink href="/contact">Nous trouver en boutique</ButtonLink>
        <ButtonLink href="/contact#formulaire" variant="secondary">
          Nous écrire
        </ButtonLink>
      </CtaBand>
    </>
  );
}
