import type { ReactNode } from "react";
import { Sceau } from "@/components/brand/Sceau";
import { Container } from "@/components/ui/Container";

type CtaBandProps = { title: string; text?: string; children: ReactNode };

/** Invitation à venir en boutique, sur un satin bordeaux. */
export function CtaBand({ title, text, children }: CtaBandProps) {
  return (
    <section className="px-3 py-16 sm:px-5 sm:py-20">
      <div className="on-dark satin satin-bordeaux relative mx-auto max-w-[96rem] overflow-hidden rounded-[2rem] text-lin sm:rounded-[2.75rem]">
        <Container size="narrow" className="relative py-16 text-center sm:py-24">
          <Sceau className="mx-auto mb-8 h-24 w-24" />
          <h2 className="text-5xl sm:text-7xl">{title}</h2>
          {text ? <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-lin/85">{text}</p> : null}
          <div className="mt-10 flex flex-wrap justify-center gap-3">{children}</div>
        </Container>
      </div>
    </section>
  );
}
