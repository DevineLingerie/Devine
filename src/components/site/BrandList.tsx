import Image from "next/image";
import type { Brand } from "@/content/types";
import { getImageUrl } from "@/lib/content/format";

/** Liste des marques. Les logos ne s'affichent que s'ils ont été ajoutés (droits vérifiés) par la boutique. */
export function BrandList({ brands, detailed = false }: { brands: Brand[]; detailed?: boolean }) {
  if (brands.length === 0) {
    return <p className="text-encre">La liste des marques sera bientôt publiée.</p>;
  }
  if (!detailed) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 font-display text-3xl sm:gap-x-6 sm:text-5xl">
        {brands.map((brand, index) => (
          <li key={brand.id} className="flex items-center gap-4 sm:gap-6">
            {index > 0 ? (
              <span aria-hidden="true" className="text-xl text-bois sm:text-2xl">
                ✦
              </span>
            ) : null}
            <span className={index % 2 === 1 ? "italic" : ""}>{brand.name}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {brands.map((brand) => {
        const logoUrl = brand.logo ? getImageUrl(brand.logo.path) : null;
        return (
          <li key={brand.id} className="rounded-[1.75rem] bg-sable p-7">
            {brand.logo && logoUrl ? (
              <Image
                src={logoUrl}
                alt={brand.logo.alt || brand.name}
                width={brand.logo.width ?? 240}
                height={brand.logo.height ?? 80}
                className="mb-4 h-12 w-auto object-contain"
              />
            ) : null}
            <h2 className="font-display text-4xl">{brand.name}</h2>
            {brand.description ? <p className="mt-2 text-encre">{brand.description}</p> : null}
            {brand.websiteUrl ? (
              <a href={brand.websiteUrl} className="lien mt-3 inline-block" target="_blank" rel="noopener noreferrer">
                Site de la marque<span className="sr-only"> {brand.name} (s&apos;ouvre dans un nouvel onglet)</span>
              </a>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
