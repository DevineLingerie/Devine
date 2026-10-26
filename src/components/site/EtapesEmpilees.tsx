import { parseTextBlocks } from "@/lib/content/format";

const TEINTES = ["satin-chair", "satin-ivoire", "satin-peche", "satin-chair", "satin-ivoire"];

/**
 * Étapes d'un texte administrable (lignes « - ») présentées en cartes qui
 * s'empilent au défilement : chaque carte reste collée un peu plus bas que
 * la précédente. Le contenu reste une liste ordonnée ordinaire.
 */
export function EtapesEmpilees({ text }: { text: string }) {
  const etapes = parseTextBlocks(text).flatMap((block) => (block.type === "list" ? block.items : []));
  if (etapes.length === 0) return null;
  return (
    <ol className="grid gap-5">
      {etapes.map((etape, index) => (
        <li
          key={index}
          className={`satin ${TEINTES[index % TEINTES.length]} sticky flex min-h-44 items-center gap-6 rounded-[2rem] p-7 shadow-[0_30px_60px_-35px_rgba(42,15,28,0.55)] sm:gap-10 sm:p-10`}
          style={{ top: `calc(6.5rem + ${index} * 1.25rem)` }}
        >
          <span aria-hidden="true" className="font-display text-7xl italic leading-none text-argile sm:text-8xl">
            {index + 1}
          </span>
          <span className="text-xl leading-snug sm:text-2xl">{etape}</span>
        </li>
      ))}
    </ol>
  );
}
