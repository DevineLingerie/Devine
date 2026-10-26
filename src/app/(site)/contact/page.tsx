import { PageIntro } from "@/components/site/PageIntro";
import { ContactForm } from "@/components/contact/ContactForm";
import { PracticalInfo } from "@/components/site/PracticalInfo";
import { Container } from "@/components/ui/Container";
import { RichText } from "@/components/ui/RichText";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getSiteSettings } from "@/lib/content/repository";
import { isContactFormAvailable } from "@/lib/env.server";

export function generateMetadata() {
  return getPageMetadata("contact", "/contact");
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([requirePage("contact"), getSiteSettings()]);
  const visite = getSection(page, "visite");
  const formulaire = getSection(page, "formulaire");
  return (
    <>
      <PageIntro eyebrow="Contact" title={page.heading} intro={page.intro} />
      <Container size="full" className="py-20 sm:py-24">
        <div className="reveal">
          <PracticalInfo settings={settings} headingLevel={2} />
        </div>
      </Container>

      {visite ? (
        <section aria-labelledby="preparer" className="bg-sauge-pale">
          <Container size="full" className="py-16 sm:py-20">
            <h2 id="preparer" className="text-4xl sm:text-5xl">
              {visite.heading}
            </h2>
            <RichText text={visite.body} className="mt-6 max-w-2xl text-lg" />
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="formulaire-titre" id="formulaire" className="scroll-mt-24">
        <Container size="narrow" className="py-14 sm:py-20">
          <h2 id="formulaire-titre" className="text-4xl sm:text-5xl">
            {formulaire?.heading ?? "Nous écrire"}
          </h2>
          {formulaire ? <RichText text={formulaire.body} className="mt-4 text-lg text-encre" /> : null}
          <div className="mt-10">
            <ContactForm enabled={isContactFormAvailable()} />
          </div>
        </Container>
      </section>
    </>
  );
}
