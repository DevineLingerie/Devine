import type { z } from "zod";
import { brandSchema, categorySchema, faqSchema, serviceSchema } from "@/lib/validation/content";
import type { Insert, Row } from "@/lib/supabase/database.types";
import { zodFieldErrors } from "./form-state";

// Description des collections éditables (univers, marques, services, FAQ).
// Une seule définition alimente la liste, le formulaire et la validation.

export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "media";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  maxLength?: number;
  hint?: string;
  options?: { value: string; label: string }[];
};

type CollectionTables = {
  categories: "categories";
  marques: "brands";
  services: "services";
  faq: "faqs";
};

export type CollectionKey = keyof CollectionTables;

export const COLLECTION_KEYS = ["categories", "marques", "services", "faq"] as const satisfies readonly CollectionKey[];

type CollectionDef<K extends CollectionKey> = {
  key: K;
  table: CollectionTables[K];
  title: string;
  singular: string;
  addLabel: string;
  description: string;
  fields: FieldDef[];
  schema: z.ZodType;
  /** Valeurs de formulaire à partir d'une ligne existante. */
  toForm: (row: Row<CollectionTables[K]>) => Record<string, string | boolean>;
  toRow: (data: never) => Insert<CollectionTables[K]>;
  label: (row: Row<CollectionTables[K]>) => string;
  isVisible: (row: Row<CollectionTables[K]>) => boolean;
};

const ORDER_HINT = "Les éléments sont affichés du plus petit au plus grand nombre (10, 20, 30…).";
const SLUG_HINT = "Identifiant dans les adresses : minuscules, chiffres et tirets.";

const str = (value: string | null) => value ?? "";

export const collections: { [K in CollectionKey]: CollectionDef<K> } = {
  categories: {
    key: "categories",
    table: "categories",
    title: "Univers",
    singular: "univers",
    addLabel: "Ajouter un univers",
    description: "Les univers de produits affichés sur l'accueil et les pages femme et homme.",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true, maxLength: 80 },
      { name: "slug", label: "Identifiant", type: "text", required: true, maxLength: 80, hint: SLUG_HINT },
      {
        name: "audience",
        label: "Public",
        type: "select",
        options: [
          { value: "femme", label: "Femme" },
          { value: "homme", label: "Homme" },
          { value: "mixte", label: "Femme et homme" },
        ],
      },
      { name: "summary", label: "Résumé", type: "textarea", maxLength: 300 },
      {
        name: "linkPath",
        label: "Lien vers une page",
        type: "text",
        maxLength: 100,
        hint: "Facultatif. Exemple : /lingerie-femme",
      },
      { name: "imageId", label: "Image", type: "media" },
      { name: "sortOrder", label: "Ordre d'affichage", type: "number", hint: ORDER_HINT },
      { name: "isActive", label: "Afficher sur le site", type: "checkbox" },
    ],
    schema: categorySchema,
    toForm: (row) => ({
      name: row.name,
      slug: row.slug,
      audience: row.audience,
      summary: str(row.summary),
      linkPath: str(row.link_path),
      imageId: str(row.image_id),
      sortOrder: String(row.sort_order),
      isActive: row.is_active,
    }),
    toRow: (data: z.output<typeof categorySchema>) => ({
      name: data.name,
      slug: data.slug,
      audience: data.audience,
      summary: data.summary,
      link_path: data.linkPath,
      image_id: data.imageId,
      sort_order: data.sortOrder,
      is_active: data.isActive,
    }),
    label: (row) => row.name,
    isVisible: (row) => row.is_active,
  },
  marques: {
    key: "marques",
    table: "brands",
    title: "Marques",
    singular: "marque",
    addLabel: "Ajouter une marque",
    description: "Les marques présentées sur le site. N'ajoutez un logo que si la marque en autorise l'usage.",
    fields: [
      { name: "name", label: "Nom", type: "text", required: true, maxLength: 80 },
      { name: "slug", label: "Identifiant", type: "text", required: true, maxLength: 80, hint: SLUG_HINT },
      { name: "description", label: "Description", type: "textarea", maxLength: 600 },
      { name: "websiteUrl", label: "Site de la marque", type: "text", maxLength: 300, hint: "Facultatif, commence par https://" },
      { name: "logoId", label: "Logo", type: "media", hint: "Uniquement avec l'accord de la marque." },
      { name: "sortOrder", label: "Ordre d'affichage", type: "number", hint: ORDER_HINT },
      { name: "isPublished", label: "Publier sur le site", type: "checkbox" },
    ],
    schema: brandSchema,
    toForm: (row) => ({
      name: row.name,
      slug: row.slug,
      description: str(row.description),
      websiteUrl: str(row.website_url),
      logoId: str(row.logo_id),
      sortOrder: String(row.sort_order),
      isPublished: row.is_published,
    }),
    toRow: (data: z.output<typeof brandSchema>) => ({
      name: data.name,
      slug: data.slug,
      description: data.description,
      website_url: data.websiteUrl,
      logo_id: data.logoId,
      sort_order: data.sortOrder,
      is_published: data.isPublished,
    }),
    label: (row) => row.name,
    isVisible: (row) => row.is_published,
  },
  services: {
    key: "services",
    table: "services",
    title: "Services",
    singular: "service",
    addLabel: "Ajouter un service",
    description: "Les services présentés sur la page Conseil. Ne publiez que les services confirmés.",
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 100 },
      { name: "slug", label: "Identifiant", type: "text", required: true, maxLength: 80, hint: SLUG_HINT },
      { name: "summary", label: "Description", type: "textarea", required: true, maxLength: 400 },
      { name: "sortOrder", label: "Ordre d'affichage", type: "number", hint: ORDER_HINT },
      { name: "isPublished", label: "Publier sur le site", type: "checkbox" },
    ],
    schema: serviceSchema,
    toForm: (row) => ({
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      sortOrder: String(row.sort_order),
      isPublished: row.is_published,
    }),
    toRow: (data: z.output<typeof serviceSchema>) => ({
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      sort_order: data.sortOrder,
      is_published: data.isPublished,
    }),
    label: (row) => row.title,
    isVisible: (row) => row.is_published,
  },
  faq: {
    key: "faq",
    table: "faqs",
    title: "Questions fréquentes",
    singular: "question",
    addLabel: "Ajouter une question",
    description: "Les questions affichées sur la page Conseil.",
    fields: [
      { name: "question", label: "Question", type: "text", required: true, maxLength: 200 },
      { name: "answer", label: "Réponse", type: "textarea", required: true, maxLength: 1500 },
      { name: "sortOrder", label: "Ordre d'affichage", type: "number", hint: ORDER_HINT },
      { name: "isPublished", label: "Publier sur le site", type: "checkbox" },
    ],
    schema: faqSchema,
    toForm: (row) => ({
      question: row.question,
      answer: row.answer,
      sortOrder: String(row.sort_order),
      isPublished: row.is_published,
    }),
    toRow: (data: z.output<typeof faqSchema>) => ({
      question: data.question,
      answer: data.answer,
      sort_order: data.sortOrder,
      is_published: data.isPublished,
    }),
    label: (row) => row.question,
    isVisible: (row) => row.is_published,
  },
};

export function isCollectionKey(value: string): value is CollectionKey {
  return (COLLECTION_KEYS as readonly string[]).includes(value);
}

export type CollectionFormResult<K extends CollectionKey> =
  | { success: true; row: Insert<CollectionTables[K]> }
  | { success: false; fieldErrors: Record<string, string> };

/** Lit et valide le formulaire d'un élément de collection. */
export function parseCollectionForm<K extends CollectionKey>(key: K, formData: FormData): CollectionFormResult<K> {
  const def = collections[key] as CollectionDef<K>;
  const raw: Record<string, unknown> = {};
  for (const field of def.fields) {
    if (field.type === "checkbox") {
      raw[field.name] = formData.get(field.name) === "on";
    } else {
      const value = formData.get(field.name);
      raw[field.name] = typeof value === "string" ? value : "";
    }
  }
  const parsed = def.schema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: zodFieldErrors(parsed.error) };
  return { success: true, row: def.toRow(parsed.data as never) };
}
