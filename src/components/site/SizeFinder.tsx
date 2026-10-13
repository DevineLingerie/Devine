"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { estimateBraSize, MEASURE_LIMITS, type SizeEstimate } from "@/lib/sizing";

const inputClass =
  "mt-2 block w-full rounded-2xl border-2 border-nuit/15 bg-lin px-4 py-3.5 text-xl font-bold text-nuit focus:border-nuit";

/** Outil « Trouvez votre taille » : estimation locale, rien n'est envoyé. */
export function SizeFinder() {
  const id = useId();
  const [result, setResult] = useState<SizeEstimate | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const read = (key: string) => Number(String(data.get(key) ?? "").replace(",", "."));
    setResult(estimateBraSize(read("underbust"), read("bust")));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <form onSubmit={onSubmit} className="grid content-start gap-5" noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-underbust`} className="font-bold">
              Tour de dessous de poitrine
            </label>
            <div className="relative">
              <input
                id={`${id}-underbust`}
                name="underbust"
                type="number"
                inputMode="decimal"
                min={MEASURE_LIMITS.underbust.min}
                max={MEASURE_LIMITS.underbust.max}
                step="0.5"
                placeholder="75"
                aria-describedby={`${id}-underbust-hint`}
                className={inputClass}
              />
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-encre">
                cm
              </span>
            </div>
            <p id={`${id}-underbust-hint`} className="mt-2 text-sm text-encre">
              Mètre bien à plat, juste sous la poitrine, sans serrer.
            </p>
          </div>
          <div>
            <label htmlFor={`${id}-bust`} className="font-bold">
              Tour de poitrine
            </label>
            <div className="relative">
              <input
                id={`${id}-bust`}
                name="bust"
                type="number"
                inputMode="decimal"
                min={MEASURE_LIMITS.bust.min}
                max={MEASURE_LIMITS.bust.max}
                step="0.5"
                placeholder="92"
                aria-describedby={`${id}-bust-hint`}
                className={inputClass}
              />
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-encre">
                cm
              </span>
            </div>
            <p id={`${id}-bust-hint`} className="mt-2 text-sm text-encre">
              Au niveau le plus fort de la poitrine, avec un soutien-gorge sans rembourrage.
            </p>
          </div>
        </div>
        <div>
          <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-nuit px-7 font-bold text-lin transition-colors hover:bg-argile">
            Estimer ma taille
          </button>
        </div>
        <p className="text-sm text-encre">Le calcul se fait sur votre appareil : vos mesures ne sont ni envoyées ni enregistrées.</p>
      </form>

      <div aria-live="polite" className="flex min-h-56 flex-col justify-center rounded-[2rem] bg-lin p-7 sm:p-9">
        {result === null ? (
          <>
            <p className="surtitre text-sauge">Votre estimation</p>
            <p className="mt-3 text-2xl font-bold tracking-tight">Renseignez vos deux mesures.</p>
            <p className="mt-3 text-encre">Vous obtiendrez une taille de départ, à confirmer en essayage.</p>
          </>
        ) : result.status === "erreur" ? (
          <>
            <p className="surtitre text-argile">À vérifier</p>
            <p className="mt-3 text-lg font-bold text-argile-fonce">{result.message}</p>
          </>
        ) : result.status === "ok" ? (
          <>
            <p className="surtitre text-sauge">Taille indicative</p>
            <p className="mt-2 text-7xl font-bold tracking-tight">
              {result.bandFr} {result.cup}
            </p>
            <p className="mt-2 text-encre">
              soit {result.bandEu} {result.cup} en taille européenne
            </p>
            <p className="mt-5 leading-relaxed">
              Chaque marque et chaque forme taillent différemment : c&apos;est un point de départ. En boutique, on vérifie en
              essayant, et on ajuste si besoin.
            </p>
            <Link href="/contact" className="lien mt-4 inline-block font-bold">
              Préparer ma visite
            </Link>
          </>
        ) : (
          <>
            <p className="surtitre text-sauge">Taille hors tableau standard</p>
            <p className="mt-3 text-2xl font-bold tracking-tight">
              Tour de dos {result.bandFr} ({result.bandEu} européen),{" "}
              {result.reason === "grand-bonnet" ? "bonnet au-delà du K" : "bonnet plus petit que AA"}.
            </p>
            <p className="mt-4 leading-relaxed">
              C&apos;est justement là que le conseil fait la différence : venez en parler, nous chercherons ensemble les
              modèles adaptés.
            </p>
            <Link href="/contact" className="lien mt-4 inline-block font-bold">
              Nous contacter
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
