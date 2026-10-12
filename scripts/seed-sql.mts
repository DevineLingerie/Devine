import {
  defaultBrands,
  defaultCategories,
  defaultFaqs,
  defaultPages,
  defaultServices,
  defaultSettings,
} from "../src/content/defaults.ts";

export const SEED_MIGRATION_PATH = "supabase/migrations/20261012100300_seed.sql";

type SqlValue = string | number | boolean | null | object;

function literal(value: SqlValue): string {
  if (value === null) return "null";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "object") return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  return `'${value.replace(/'/g, "''")}'`;
}

function insert(table: string, rows: Record<string, SqlValue>[], conflict: string): string {
  const columns = Object.keys(rows[0]);
  const values = rows.map((row) => `  (${columns.map((column) => literal(row[column])).join(", ")})`).join(",\n");
  return `insert into public.${table} (${columns.join(", ")}) values\n${values}\non conflict (${conflict}) do nothing;\n`;
}

/**
 * Données initiales non sensibles. « on conflict do nothing » : réappliquer
 * la migration n'écrase jamais les modifications faites dans l'administration.
 */
export function buildSeedSql(): string {
  const s = defaultSettings;
  const parts = [
    "-- DEVINE — données initiales (fichier généré : npm run db:seed:generate)",
    "-- Aucune coordonnée, aucun horaire ni aucune mention légale n'est inventé :",
    "-- ces champs restent vides et se renseignent dans l'administration.\n",
    insert(
      "site_settings",
      [
        {
          id: 1,
          shop_name: s.shopName,
          tagline: s.tagline,
          promise: s.promise,
          country_code: s.countryCode,
          opening_hours: s.openingHours,
          social_links: s.socialLinks,
          seo_title: s.seoTitle,
          seo_description: s.seoDescription,
        },
      ],
      "id",
    ),
    insert(
      "pages",
      defaultPages.map((page) => ({
        slug: page.slug,
        title: page.title,
        description: page.description,
        heading: page.heading,
        intro: page.intro,
        sections: page.sections,
        is_published: true,
      })),
      "slug",
    ),
    insert(
      "categories",
      defaultCategories.map((c) => ({
        slug: c.slug,
        name: c.name,
        audience: c.audience,
        summary: c.summary,
        link_path: c.linkPath,
        sort_order: c.sortOrder,
        is_active: c.isActive,
      })),
      "slug",
    ),
    insert(
      "brands",
      defaultBrands.map((b) => ({
        slug: b.slug,
        name: b.name,
        description: b.description,
        website_url: b.websiteUrl,
        sort_order: b.sortOrder,
        is_published: b.isPublished,
      })),
      "slug",
    ),
    insert(
      "services",
      defaultServices.map((service) => ({
        slug: service.slug,
        title: service.title,
        summary: service.summary,
        sort_order: service.sortOrder,
        is_published: service.isPublished,
      })),
      "slug",
    ),
    // Les FAQ n'ont pas d'identifiant naturel : insertion seulement si la table est vide.
    `insert into public.faqs (question, answer, sort_order, is_published)\nselect question, answer, sort_order, is_published from (values\n${defaultFaqs
      .map((f) => `  (${literal(f.question)}, ${literal(f.answer)}, ${f.sortOrder}, ${literal(f.isPublished)})`)
      .join(",\n")}\n) as seed (question, answer, sort_order, is_published)\nwhere not exists (select 1 from public.faqs);\n`,
  ];
  return parts.join("\n");
}
