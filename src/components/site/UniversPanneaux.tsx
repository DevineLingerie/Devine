import Link from "next/link";
import type { VitrineVariant } from "@/components/brand/Vitrine";
import type { Category } from "@/content/types";
import { PHOTO_SLOTS, type PhotoSlot } from "@/content/photos";
import { PhotoFrame } from "./PhotoFrame";

const VARIANTS: Record<string, VitrineVariant> = {
  "lingerie-femme": "femme",
  "lingerie-homme": "homme",
  "nuit-homewear": "nuit",
  bain: "conseil",
  chaussettes: "histoire",
  accessoires: "homme",
};

const SOMBRES = new Set(["lingerie-homme", "nuit-homewear", "accessoires"]);

const LIBELLES: Record<string, string> = {
  "lingerie-femme": "Explorer la lingerie femme",
  "lingerie-homme": "Découvrir la lingerie homme",
};

function slotDe(category: Category): PhotoSlot | undefined {
  return (PHOTO_SLOTS as readonly string[]).includes(category.slug) ? (category.slug as PhotoSlot) : undefined;
}

/** Fond de panneau : photo ou satin, avec parallaxe. */
function Fond({ category }: { category: Category }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="parallaxe h-full w-full transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,0.61,0.36,1)] group-hover:scale-[1.04]">
        <PhotoFrame
          media={category.image}
          slot={slotDe(category)}
          variant={VARIANTS[category.slug] ?? "accueil"}
          monogramme={category.name.charAt(0)}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

/** Univers femme et homme en deux grands panneaux, à égalité. */
export function UniversPrincipaux({ categories }: { categories: Category[] }) {
  const principaux = ["lingerie-femme", "lingerie-homme"]
    .map((slug) => categories.find((category) => category.slug === slug))
    .filter((category): category is Category => Boolean(category));
  if (principaux.length === 0) return null;
  return (
    <div className="grid lg:grid-cols-2">
      {principaux.map((category, index) => {
        const sombre = SOMBRES.has(category.slug);
        return (
          <Link
            key={category.id}
            href={category.linkPath ?? "/"}
            className={`group relative isolate flex min-h-[78svh] items-end overflow-hidden lg:min-h-[92svh] ${sombre ? "on-dark text-lin" : "text-nuit"}`}
          >
            <Fond category={category} />
            <div
              aria-hidden="true"
              className={`absolute inset-0 ${sombre ? "bg-gradient-to-t from-nuit/80 via-nuit/10 to-transparent" : "bg-gradient-to-t from-lin/70 via-transparent to-transparent"}`}
            />
            <div className="reveal relative w-full p-8 sm:p-12 lg:p-16" style={{ ["--d" as string]: index }}>
              <p className="font-display text-xl italic opacity-80">{sombre ? "Univers homme" : "Univers femme"}</p>
              <h3 className="mt-3 text-6xl sm:text-7xl xl:text-8xl">{category.name}</h3>
              {category.summary ? <p className="mt-5 max-w-md text-lg leading-relaxed opacity-85">{category.summary}</p> : null}
              <span className="mt-8 inline-flex items-center gap-3 border-b border-current pb-1 font-semibold">
                {LIBELLES[category.slug] ?? "Découvrir"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** Autres univers : carrousel horizontal sur mobile, grille sur grand écran. */
export function UniversSecondaires({ categories }: { categories: Category[] }) {
  const autres = categories.filter((category) => !["lingerie-femme", "lingerie-homme"].includes(category.slug));
  if (autres.length === 0) return null;
  return (
    <ul
      tabIndex={0}
      aria-label="Autres univers"
      className="sans-barre -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
    >
      {autres.map((category, index) => {
        const sombre = SOMBRES.has(category.slug);
        const contenu = (
          <>
            <Fond category={category} />
            <div aria-hidden="true" className={`absolute inset-0 ${sombre ? "bg-gradient-to-t from-nuit/70 to-transparent" : "bg-gradient-to-t from-lin/60 to-transparent"}`} />
            <div className="relative mt-auto p-6 sm:p-7">
              <h3 className="text-3xl sm:text-4xl">{category.name}</h3>
              {category.summary ? <p className="mt-2 text-sm leading-relaxed opacity-85">{category.summary}</p> : null}
              <span className="mt-4 inline-block border-b border-current text-sm font-semibold">
                {category.linkPath ? "Découvrir" : "En boutique"}
              </span>
            </div>
          </>
        );
        const classes = `group relative isolate flex aspect-[3/4] flex-col overflow-hidden rounded-[1.75rem] ${sombre ? "on-dark text-lin" : "text-nuit"}`;
        return (
          <li key={category.id} className="reveal w-[78vw] shrink-0 snap-start sm:w-[44vw] lg:w-auto" style={{ ["--d" as string]: index }}>
            {category.linkPath ? (
              <Link href={category.linkPath} className={classes}>
                {contenu}
              </Link>
            ) : (
              <div className={classes}>{contenu}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
