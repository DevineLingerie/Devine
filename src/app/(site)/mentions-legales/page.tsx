import { PageIntro } from "@/components/site/PageIntro";
import { TextSection } from "@/components/site/TextSection";
import { Container } from "@/components/ui/Container";
import { formatAddressLines } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getSiteSettings } from "@/lib/content/repository";
import { stockPhotos } from "@/content/photos";
import { diapositives } from "@/content/carrousel";

export function generateMetadata() {
  return getPageMetadata("mentions-legales", "/mentions-legales");
}

const TO_COMPLETE = "à compléter";

function Item({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="grid gap-1 border-b border-nuit/10 py-3 sm:grid-cols-[14rem_1fr] sm:gap-6">
      <dt className="text-encre">{label}</dt>
      <dd className={value ? "" : "italic text-encre"}>{value ?? TO_COMPLETE}</dd>
    </div>
  );
}

export default async function MentionsLegalesPage() {
  const [page, settings] = await Promise.all([requirePage("mentions-legales"), getSiteSettings()]);
  const shopAddress = formatAddressLines(settings).join(", ") || null;
  return (
    <>
    <PageIntro title={page.heading} intro={page.intro} />
    <Container size="narrow" className="py-16 sm:py-20">

      <section aria-labelledby="editeur" className="mt-12">
        <h2 id="editeur" className="text-4xl">
          Éditeur du site
        </h2>
        <dl className="mt-4">
          <Item label="Nom commercial" value={settings.shopName} />
          <Item label="Dénomination sociale" value={settings.legalName} />
          <Item label="Forme juridique" value={settings.legalForm} />
          <Item label="Capital social" value={settings.shareCapital} />
          <Item label="Siège social" value={settings.legalAddress ?? shopAddress} />
          <Item label="SIRET" value={settings.siret} />
          <Item label="RCS" value={settings.rcs} />
          <Item label="TVA intracommunautaire" value={settings.vatNumber} />
          <Item label="Téléphone" value={settings.phone} />
          <Item label="E-mail" value={settings.email} />
          <Item label="Directrice ou directeur de la publication" value={settings.publicationDirector} />
        </dl>
      </section>

      <section aria-labelledby="hebergeur" className="mt-12">
        <h2 id="hebergeur" className="text-4xl">
          Hébergement
        </h2>
        <dl className="mt-4">
          <Item label="Hébergeur" value={settings.hostName} />
          <Item label="Adresse" value={settings.hostAddress} />
          <Item label="Contact" value={settings.hostContact} />
        </dl>
      </section>

      {diapositives.length > 0 ? (
        <section aria-labelledby="credits-carrousel" className="mt-12">
          <h2 id="credits-carrousel" className="text-4xl">
            Photos de l&apos;accueil
          </h2>
          <ul className="mt-4 grid gap-2">
            {diapositives.map((diapo) => (
              <li key={diapo.src}>
                {diapo.marque} {diapo.titre} — photo : {diapo.credit}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {Object.keys(stockPhotos).length > 0 ? (
        <section aria-labelledby="credits-photos" className="mt-12">
          <h2 id="credits-photos" className="text-4xl">
            Crédits photos
          </h2>
          <p className="mt-4 text-encre">Photos d&apos;illustration provisoires, en attendant les photos de la boutique :</p>
          <ul className="mt-4 grid gap-2">
            {Object.values(stockPhotos).map((photo) => (
              <li key={photo.src}>
                {photo.alt} — {photo.author},{" "}
                <a href={photo.url} className="lien" target="_blank" rel="noopener noreferrer">
                  {photo.source}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {page.sections.map((section) => (
        <TextSection key={section.key} section={section} className="mt-12" />
      ))}
    </Container>
    </>
  );
}
