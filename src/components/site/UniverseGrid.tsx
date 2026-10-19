import Link from "next/link";
import type { VitrineVariant } from "@/components/brand/Vitrine";
import { PHOTO_SLOTS, type PhotoSlot } from "@/content/photos";
import { PhotoFrame } from "./PhotoFrame";
import type { Category } from "@/content/types";

const VARIANTS: Record<string, VitrineVariant> = {
  "lingerie-femme": "femme",
  "lingerie-homme": "homme",
  "nuit-homewear": "nuit",
  bain: "conseil",
  chaussettes: "histoire",
  accessoires: "homme",
};

const LINK_LABELS: Record<string, string> = {
  "lingerie-femme": "Explorer la lingerie femme",
  "lingerie-homme": "Découvrir la lingerie homme",
};

/**
 * Univers en grandes tuiles visuelles. Les deux premiers (femme et homme)
 * sont mis en avant à égalité.
 */
export function UniverseGrid({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;
  const featured = ["lingerie-femme", "lingerie-homme"];
  const sorted = [...categories].sort((a, b) => Number(featured.includes(b.slug)) - Number(featured.includes(a.slug)));
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {sorted.map((category) => {
        const isFeatured = featured.includes(category.slug);
        const slot = (PHOTO_SLOTS as readonly string[]).includes(category.slug) ? (category.slug as PhotoSlot) : undefined;
        const visual = (
          <PhotoFrame
            media={category.image}
            slot={slot}
            variant={VARIANTS[category.slug] ?? "accueil"}
            monogramme={category.name.charAt(0)}
            sizes={isFeatured ? "(min-width: 1024px) 45vw, 90vw" : "(min-width: 1024px) 22vw, 45vw"}
            className={`rounded-[1.5rem] transition-transform duration-500 group-hover:-translate-y-1 ${isFeatured ? "aspect-[4/5] sm:aspect-[5/4]" : "aspect-square"}`}
          />
        );
        const label = (
          <span className="mt-4 block">
            <span className={`block font-display ${isFeatured ? "text-3xl sm:text-5xl" : "text-xl sm:text-3xl"}`}>
              {category.name}
            </span>
            {category.summary && isFeatured ? <span className="mt-2 hidden max-w-md text-encre sm:block">{category.summary}</span> : null}
            {category.linkPath ? (
              <span className="mt-2 inline-block text-sm font-bold text-argile underline decoration-argile/30 underline-offset-4 group-hover:decoration-argile sm:text-base">
                {LINK_LABELS[category.slug] ?? `Découvrir : ${category.name.toLowerCase()}`}
              </span>
            ) : (
              <span className="mt-1 block text-sm text-encre">En boutique</span>
            )}
          </span>
        );
        return (
          <li key={category.id} className={isFeatured ? "col-span-2 sm:col-span-1 lg:col-span-2" : ""}>
            {category.linkPath ? (
              <Link href={category.linkPath} className="group block">
                {visual}
                {label}
              </Link>
            ) : (
              <div className="group">
                {visual}
                {label}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
