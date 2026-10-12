import type { ReactNode } from "react";
import { Sceau } from "@/components/brand/Sceau";
import { Container } from "@/components/ui/Container";

type CtaBandProps = { title: string; text?: string; children: ReactNode };

/** Invitation à venir en boutique. */
export function CtaBand({ title, text, children }: CtaBandProps) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Container size="wide" className="tulle relative overflow-hidden rounded-[2.5rem] bg-nude px-6 py-14 text-center sm:px-12 sm:py-20">
        <Sceau className="mx-auto mb-8 h-24 w-24" />
        <h2 className="mx-auto max-w-3xl text-5xl sm:text-6xl">{title}</h2>
        {text ? <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-nuit/80">{text}</p> : null}
        <div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div>
      </Container>
    </section>
  );
}
