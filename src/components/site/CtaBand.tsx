import type { ReactNode } from "react";
import { Trait } from "@/components/brand/Trait";
import { Container } from "@/components/ui/Container";

type CtaBandProps = { title: string; text?: string; children: ReactNode };

/** Bandeau d'appel à la visite, sur le ton sombre du plafond de la boutique. */
export function CtaBand({ title, text, children }: CtaBandProps) {
  return (
    <section className="on-dark bg-nuit text-lin">
      <Container size="narrow" className="py-16 text-center sm:py-20">
        <Trait className="mx-auto mb-6 w-40 text-bois" />
        <h2 className="text-3xl sm:text-4xl">{title}</h2>
        {text ? <p className="mx-auto mt-4 max-w-xl text-lg text-lin/80">{text}</p> : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </Container>
    </section>
  );
}
