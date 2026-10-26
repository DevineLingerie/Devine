import { CtaBand } from "@/components/site/CtaBand";
import { FaqList } from "@/components/site/FaqList";
import { PageHero } from "@/components/site/PageHero";
import { ServiceList } from "@/components/site/ServiceList";
import { SizeFinder } from "@/components/site/SizeFinder";
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
      <PageHero page={page} eyebrow="Conseil & expertise" variant="conseil" tone="sauge">
        <ButtonLink href="/contact">Préparer ma visite</ButtonLink>
      </PageHero>

      <Container size="full" className="grid gap-14 py-20 sm:py-24">
        <TextSection section={getSection(page, "pourquoi")} layout="split" />
        <TextSection section={getSection(page, "taille")} layout="split" />
      </Container>

      <section id="taille" aria-labelledby="taille-titre" className="scroll-mt-28 px-3 pb-20 sm:px-5 sm:pb-24">
        <div className="mx-auto max-w-[96rem] rounded-[2rem] bg-sable sm:rounded-[2.75rem]">
          <Container size="full" className="py-14 sm:py-16">
            <p className="surtitre text-sauge">Guide des tailles</p>
            <h2 id="taille-titre" className="mt-4 text-4xl sm:text-5xl">
              Trouvez votre taille
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-encre">
              Une première estimation pour savoir par où commencer. En boutique, on la vérifie en essayant.
            </p>
            <div className="mt-10">
              <SizeFinder />
            </div>
          </Container>
        </div>
      </section>

      {deroulement ? (
        <section aria-labelledby="deroulement" className="bg-sauge-pale">
          <Container size="full" className="py-20 sm:py-24">
            <h2 id="deroulement" className="text-4xl sm:text-5xl">
              {deroulement.heading}
            </h2>
            <StepList text={deroulement.body} />
          </Container>
        </section>
      ) : null}

      {services.length > 0 ? (
        <section aria-labelledby="services" className="bg-sable">
          <Container size="full" className="py-20 sm:py-24">
            <h2 id="services" className="text-4xl sm:text-5xl">
              Nos services
            </h2>
            <div className="mt-10">
              <ServiceList services={services} />
            </div>
          </Container>
        </section>
      ) : null}

      <Container size="full" className="pb-20 sm:pb-24">
        <TextSection section={getSection(page, "approche")} layout="split" />
      </Container>

      {faqs.length > 0 ? (
        <section aria-labelledby="questions" className="bg-sauge-pale">
          <Container size="narrow" className="py-16 sm:py-20">
            <h2 id="questions" className="text-4xl sm:text-5xl">
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
        <ButtonLink href="/contact#formulaire" variant="secondary">
          Poser une question
        </ButtonLink>
      </CtaBand>
    </>
  );
}
