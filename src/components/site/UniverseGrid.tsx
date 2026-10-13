import Image from "next/image";
import Link from "next/link";
import { Vitrine, type VitrineVariant } from "@/components/brand/Vitrine";
import type { Category } from "@/content/types";
import { getImageUrl } from "@/lib/content/format";

const VARIANTS: Record<string, VitrineVariant> = {
  "lingerie-femme": "femme",
  "lingerie-homme": "homme",
  "nuit-homewear": "nuit",
  bain: "conseil",
  chaussettes: "histoire",
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
        const imageUrl = category.image ? getImageUrl(category.image.path) : null;
        const visual = (
          <span className={`relative block overflow-hidden rounded-[1.5rem] ${isFeatured ? "aspect-[4/5] sm:aspect-[5/4]" : "aspect-square"}`}>
            {category.image && imageUrl ? (
              <Image src={imageUrl} alt={category.image.alt} fill sizes="(min-width: 1024px) 50vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <Vitrine variant={VARIANTS[category.slug] ?? "accueil"} className="h-full w-full transition-transform duration-700 group-hover:scale-105" />
            )}
          </span>
        );
        const label = (
          <span className="mt-4 block">
            <span className={`block font-display font-bold tracking-tight ${isFeatured ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl"}`}>
              {category.name}
            </span>
            {category.summary && isFeatured ? <span className="mt-2 hidden max-w-md text-encre sm:block">{category.summary}</span> : null}
            {category.linkPath ? (
              <span className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-argile sm:text-base">
                {LINK_LABELS[category.slug] ?? "Découvrir"}
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
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
