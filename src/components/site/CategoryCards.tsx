import Link from "next/link";
import type { Category } from "@/content/types";

const AUDIENCE_LABELS = { femme: "Femme", homme: "Homme", mixte: "Femme & homme" } as const;

export function CategoryCards({ categories, headingLevel = 3 }: { categories: Category[]; headingLevel?: 2 | 3 }) {
  if (categories.length === 0) return null;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const content = (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-sauge">{AUDIENCE_LABELS[category.audience]}</p>
            <Heading className="mt-2 font-serif text-2xl">{category.name}</Heading>
            {category.summary ? <p className="mt-2 text-encre">{category.summary}</p> : null}
            {category.linkPath ? (
              <span aria-hidden="true" className="mt-4 inline-block text-argile transition-transform duration-200 group-hover:translate-x-1">
                Découvrir →
              </span>
            ) : null}
          </>
        );
        return (
          <li key={category.id}>
            {category.linkPath ? (
              <Link
                href={category.linkPath}
                className="group block h-full rounded-2xl border border-nuit/10 bg-sable/60 p-6 transition-colors hover:border-nuit/30 hover:bg-sable"
              >
                {content}
              </Link>
            ) : (
              <div className="h-full rounded-2xl border border-nuit/10 p-6">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
