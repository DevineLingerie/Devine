import type { ReactNode } from "react";
import { Sceau } from "@/components/brand/Sceau";
import { Projecteur } from "@/components/motion/Projecteur";
import { Container } from "@/components/ui/Container";

type CtaBandProps = { title: string; text?: string; children: ReactNode };

/** Invitation finale, plein écran, sur satin bordeaux éclairé par le projecteur. */
export function CtaBand({ title, text, children }: CtaBandProps) {
  return (
    <section className="on-dark satin satin-bordeaux relative isolate flex min-h-[80svh] items-center overflow-hidden text-lin">
      <Projecteur />
      <Container size="narrow" className="reveal relative py-24 text-center">
        <Sceau className="mx-auto mb-10 h-28 w-28" />
        <h2 className="text-6xl sm:text-8xl">{title}</h2>
        {text ? <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-lin/85 sm:text-xl">{text}</p> : null}
        <div className="mt-11 flex flex-wrap justify-center gap-3">{children}</div>
      </Container>
    </section>
  );
}
