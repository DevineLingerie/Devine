import { CtaBand } from "@/components/site/CtaBand";
import { FaqList } from "@/components/site/FaqList";
import { PageHero } from "@/components/site/PageHero";
import { ServiceList } from "@/components/site/ServiceList";
import { TextSection } from "@/components/site/TextSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { StepList } from "@/components/ui/StepList";
import { getSection } from "@/lib/content/format";
import { getPageMetadata, requirePage } from "@/lib/content/page-loader";
import { getFaqs, getServices } from "@/lib/content/repository";
import { buildFaqJsonLd } from "@/lib/seo";

export function generateMetadata() {
  return getPageMetadata("conseil", "/conseil");
}

export default async function ConseilPage() {
  const [page, services, faqs] = await Promise.all([requirePage("conseil"), getServices(), getFaqs()]);
  const deroulement = getSection(page, "deroulement");
  return (
    <>
      <PageHero page={page} eyebrow="Conseil & expertise" variant="conseil">
        <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
      </PageHero>

      <Container className="grid gap-16 py-16 sm:py-20 lg:grid-cols-2 lg:gap-x-16">
        <TextSection section={getSection(page, "pourquoi")} />
        <TextSection section={getSection(page, "taille")} />
      </Container>

      {deroulement ? (
        <section aria-labelledby="deroulement" className="bg-sauge-pale">
          <Container className="py-16 sm:py-20">
            <h2 id="deroulement" className="text-3xl sm:text-4xl">
              {deroulement.heading}
            </h2>
            <StepList text={deroulement.body} />
          </Container>
        </section>
      ) : null}

      {services.length > 0 ? (
        <section aria-labelledby="services">
          <Container className="py-16 sm:py-20">
            <h2 id="services" className="text-3xl sm:text-4xl">
              Nos services
            </h2>
            <div className="mt-10">
              <ServiceList services={services} />
            </div>
          </Container>
        </section>
      ) : null}

      <Container size="narrow" className="pb-16 sm:pb-20">
        <TextSection section={getSection(page, "approche")} />
      </Container>

      {faqs.length > 0 ? (
        <section aria-labelledby="questions" className="bg-sable/50">
          <Container size="narrow" className="py-16 sm:py-20">
            <h2 id="questions" className="text-3xl sm:text-4xl">
              Questions fréquentes
            </h2>
            <div className="mt-8">
              <FaqList faqs={faqs} />
            </div>
          </Container>
          <JsonLd data={buildFaqJsonLd(faqs)} />
        </section>
      ) : null}

      <CtaBand title="Prête ou prêt à essayer ?" text="Venez avec vos questions, on s'occupe du reste.">
        <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
        <ButtonLink href="/contact#formulaire" variant="light">
          Poser une question
        </ButtonLink>
      </CtaBand>
    </>
  );
}
