import { CtaBand } from "@/components/site/CtaBand";
import { PageHero } from "@/components/site/PageHero";
import { TextSection } from "@/components/site/TextSection";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";

export function generateMetadata() {
  return getPageMetadata("histoire", "/histoire");
}

export default async function HistoirePage() {
  const page = await requirePage("histoire");
  const etapes = [
    { label: "1912", section: getSection(page, "depuis-1912") },
    { label: "Transmettre", section: getSection(page, "transmission") },
    { label: "Aujourd'hui", section: getSection(page, "aujourdhui") },
  ];
  const souvenirs = getSection(page, "souvenirs");
  return (
    <>
      <PageHero page={page} eyebrow="Notre histoire" variant="histoire" />
      <Container size="wide" className="py-20 sm:py-24">
        <ol className="relative grid gap-14 border-l border-bois pl-8 sm:pl-12">
          {etapes.map(({ label, section }) =>
            section ? (
              <li key={section.key} className="relative">
                <span aria-hidden="true" className="absolute -left-[2.45rem] top-2 h-3 w-3 rounded-full bg-argile sm:-left-[3.45rem]" />
                <p className="font-serif text-lg italic text-bois-fonce">{label}</p>
                <TextSection section={section} className="mt-2 max-w-2xl" />
              </li>
            ) : null,
          )}
        </ol>
      </Container>
      {souvenirs ? (
        <CtaBand title={souvenirs.heading} text={souvenirs.body}>
          <ButtonLink href="/contact#formulaire">Partager un souvenir</ButtonLink>
        </CtaBand>
      ) : null}
    </>
  );
}
