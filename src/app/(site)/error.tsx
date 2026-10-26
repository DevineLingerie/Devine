"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="on-dark dentelle bg-nuit text-lin">
    <Container size="narrow" className="pb-20 pt-36 text-center">
      <h1 className="text-4xl">Un petit contretemps</h1>
      <p className="mx-auto mt-6 max-w-lg text-lg text-lin/80">
        Cette page n&apos;a pas pu s&apos;afficher. Réessayez dans un instant.
      </p>
      <Button className="mt-8" variant="creme" onClick={reset}>
        Réessayer
      </Button>
    </Container>
    </section>
  );
}
