import { TextSection } from "@/components/site/TextSection";
import { Container } from "@/components/ui/Container";
import { formatAddressLines } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getSiteSettings } from "@/lib/content/repository";

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
    <Container size="narrow" className="py-14 sm:py-20">
      <h1 className="text-4xl sm:text-5xl">{page.heading}</h1>
      {page.intro ? <p className="mt-6 text-lg text-encre">{page.intro}</p> : null}

      <section aria-labelledby="editeur" className="mt-12">
        <h2 id="editeur" className="text-3xl">
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
        <h2 id="hebergeur" className="text-3xl">
          Hébergement
        </h2>
        <dl className="mt-4">
          <Item label="Hébergeur" value={settings.hostName} />
          <Item label="Adresse" value={settings.hostAddress} />
          <Item label="Contact" value={settings.hostContact} />
        </dl>
      </section>

      {page.sections.map((section) => (
        <TextSection key={section.key} section={section} className="mt-12" />
      ))}
    </Container>
  );
}
