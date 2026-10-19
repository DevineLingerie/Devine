import Link from "next/link";
import type { Category } from "@/content/types";

const AUDIENCE_LABELS = { femme: "Femme", homme: "Homme", mixte: "Femme & homme" } as const;
const TINTS = ["bg-sable", "bg-sauge-pale", "bg-nude/60", "bg-lin"] as const;

/** Univers complémentaires, en tuiles colorées. */
export function CategoryCards({ categories, headingLevel = 3 }: { categories: Category[]; headingLevel?: 2 | 3 }) {
  if (categories.length === 0) return null;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => {
        const tint = TINTS[index % TINTS.length];
        const content = (
          <>
            <p className="surtitre text-sauge">{AUDIENCE_LABELS[category.audience]}</p>
            <Heading className="mt-3 font-display text-3xl">{category.name}</Heading>
            {category.summary ? <p className="mt-3 text-[0.95rem] leading-relaxed text-encre">{category.summary}</p> : null}
            {category.linkPath ? (
              <span aria-hidden="true" className="mt-auto pt-6 text-sm font-semibold text-argile underline underline-offset-4">
                Découvrir
              </span>
            ) : null}
          </>
        );
        const classes = `flex h-full flex-col rounded-[1.75rem] p-6 sm:p-7 ${tint} ${tint === "bg-lin" ? "ring-1 ring-nuit/10" : ""}`;
        return (
          <li key={category.id}>
            {category.linkPath ? (
              <Link href={category.linkPath} className={`group ${classes} transition-transform duration-300 hover:-translate-y-1`}>
                {content}
              </Link>
            ) : (
              <div className={classes}>{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
