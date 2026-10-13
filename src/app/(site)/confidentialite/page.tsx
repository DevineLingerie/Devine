import { TextSection } from "@/components/site/TextSection";
import { Container } from "@/components/ui/Container";
import { PRIVACY_VERSION } from "@/content/defaults";
import { formatAddressLines } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getSiteSettings } from "@/lib/content/repository";

export function generateMetadata() {
  return getPageMetadata("confidentialite", "/confidentialite");
}

export default async function ConfidentialitePage() {
  const [page, settings] = await Promise.all([requirePage("confidentialite"), getSiteSettings()]);
  const controller = settings.legalName ?? settings.shopName;
  const address = settings.legalAddress ?? (formatAddressLines(settings).join(", ") || null);
  return (
    <Container size="narrow" className="py-14 sm:py-20">
      <h1 className="text-5xl leading-none sm:text-6xl">{page.heading}</h1>
      {page.intro ? <p className="mt-6 text-lg text-encre">{page.intro}</p> : null}

      <section aria-labelledby="responsable" className="mt-12">
        <h2 id="responsable" className="text-4xl">
          Responsable du traitement
        </h2>
        <p className="mt-4 text-lg text-encre">
          {controller}
          {address ? `, ${address}` : ""}
          {settings.email ? (
            <>
              {" "}
              — <a href={`mailto:${settings.email}`} className="lien">{settings.email}</a>
            </>
          ) : null}
          .
        </p>
      </section>

      {page.sections.map((section) => (
        <TextSection key={section.key} section={section} className="mt-12" />
      ))}

      <p className="mt-12 text-sm text-encre">Version de la politique : {PRIVACY_VERSION}</p>
    </Container>
  );
}
