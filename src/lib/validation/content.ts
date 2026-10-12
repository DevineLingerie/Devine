import { z } from "zod";
import { AUDIENCES, SOCIAL_NETWORKS, WEEK_DAYS } from "@/content/types";

// Schémas partagés par l'administration (validation des formulaires côté
// serveur) et par la couche d'accès aux données. Les limites reprennent les
// contraintes CHECK des migrations SQL.

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Texte facultatif : une chaîne vide devient null. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `${max} caractères maximum.`)
    .transform((value) => (value === "" ? null : value))
    .nullable();

export const requiredText = (max: number, message = "Ce champ est obligatoire.") =>
  z.string().trim().min(1, message).max(max, `${max} caractères maximum.`);

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Ce champ est obligatoire.")
  .max(80)
  .regex(SLUG_PATTERN, "Uniquement des minuscules, chiffres et tirets (ex. lingerie-femme).");

export const sortOrderSchema = z.coerce
  .number({ error: "Nombre attendu." })
  .int("Nombre entier attendu.")
  .min(0)
  .max(10000);

export const uuidSchema = z.uuid("Identifiant invalide.");

export const optionalUuidSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .pipe(z.uuid("Identifiant invalide.").nullable())
  .nullable();

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const httpsUrl = z
  .string()
  .trim()
  .max(300, "300 caractères maximum.")
  .refine(isHttpsUrl, "Adresse web complète attendue, commençant par https://.");

/** Nombre facultatif : vide ou absent devient null (et non 0). */
const optionalNumber = (min: number, max: number) =>
  z.preprocess(
    (value) => (value === "" || value === undefined || value === null ? null : Number(value)),
    z.number({ error: "Nombre attendu." }).min(min).max(max).nullable(),
  );

export const optionalHttpsUrl = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .pipe(httpsUrl.nullable())
  .nullable();

// ---------------------------------------------------------------------------
// Horaires et réseaux sociaux
// ---------------------------------------------------------------------------

export const openingPeriodSchema = z
  .object({
    opens: z.string().regex(TIME_PATTERN, "Heure au format HH:MM."),
    closes: z.string().regex(TIME_PATTERN, "Heure au format HH:MM."),
  })
  .refine((period) => period.opens < period.closes, {
    message: "L'heure de fermeture doit suivre l'heure d'ouverture.",
  });

export const openingDaySchema = z.object({
  day: z.enum(WEEK_DAYS),
  periods: z.array(openingPeriodSchema).max(3),
});

export const openingHoursSchema = z
  .array(openingDaySchema)
  .max(7)
  .refine((days) => new Set(days.map((d) => d.day)).size === days.length, {
    message: "Chaque jour ne peut apparaître qu'une fois.",
  });

export const socialLinkSchema = z.object({
  network: z.enum(SOCIAL_NETWORKS),
  url: httpsUrl,
});

export const socialLinksSchema = z.array(socialLinkSchema).max(SOCIAL_NETWORKS.length);

// ---------------------------------------------------------------------------
// Réglages généraux
// ---------------------------------------------------------------------------

export const settingsSchema = z.object({
  shopName: requiredText(80),
  tagline: optionalText(120),
  promise: optionalText(300),
  streetAddress: optionalText(200),
  postalCode: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .pipe(z.string().regex(/^\d{5}$/, "Code postal à 5 chiffres.").nullable())
    .nullable(),
  city: optionalText(100),
  countryCode: z.string().trim().regex(/^[A-Z]{2}$/).default("FR"),
  latitude: optionalNumber(-90, 90),
  longitude: optionalNumber(-180, 180),
  accessNotes: optionalText(1000),
  phone: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .pipe(
      z
        .string()
        .max(30)
        .regex(/^\+?[\d\s.()-]{6,}$/, "Numéro de téléphone invalide.")
        .nullable(),
    )
    .nullable(),
  email: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .pipe(z.email("Adresse e-mail invalide.").max(254).nullable())
    .nullable(),
  openingHours: openingHoursSchema,
  hoursNote: optionalText(300),
  socialLinks: socialLinksSchema,
  seoTitle: optionalText(70),
  seoDescription: optionalText(170),
  legalName: optionalText(150),
  legalForm: optionalText(100),
  shareCapital: optionalText(50),
  siret: z
    .string()
    .trim()
    .transform((value) => value.replace(/\s/g, ""))
    .transform((value) => (value === "" ? null : value))
    .pipe(z.string().regex(/^\d{14}$/, "Le SIRET comporte 14 chiffres.").nullable())
    .nullable(),
  rcs: optionalText(100),
  vatNumber: optionalText(30),
  legalAddress: optionalText(300),
  publicationDirector: optionalText(150),
  hostName: optionalText(150),
  hostAddress: optionalText(300),
  hostContact: optionalText(150),
});

export type SettingsInput = z.input<typeof settingsSchema>;

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export const pageSectionSchema = z.object({
  key: slugSchema,
  heading: requiredText(120),
  body: z.string().trim().max(3000, "3000 caractères maximum."),
});

export const pageSchema = z.object({
  slug: slugSchema,
  title: requiredText(70),
  description: requiredText(170),
  heading: requiredText(120),
  intro: optionalText(600),
  sections: z.array(pageSectionSchema).max(20),
  heroImageId: optionalUuidSchema,
  isPublished: z.boolean(),
});

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export const categorySchema = z.object({
  slug: slugSchema,
  name: requiredText(80),
  audience: z.enum(AUDIENCES),
  summary: optionalText(300),
  linkPath: z
    .string()
    .trim()
    .transform((value) => (value === "" ? null : value))
    .pipe(z.string().regex(/^\/[a-z0-9/-]*$/, "Chemin interne commençant par / (ex. /lingerie-femme).").nullable())
    .nullable(),
  imageId: optionalUuidSchema,
  sortOrder: sortOrderSchema,
  isActive: z.boolean(),
});

export const brandSchema = z.object({
  slug: slugSchema,
  name: requiredText(80),
  description: optionalText(600),
  websiteUrl: optionalHttpsUrl,
  logoId: optionalUuidSchema,
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export const serviceSchema = z.object({
  slug: slugSchema,
  title: requiredText(100),
  summary: requiredText(400),
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export const faqSchema = z.object({
  question: requiredText(200),
  answer: requiredText(1500),
  sortOrder: sortOrderSchema,
  isPublished: z.boolean(),
});

export const mediaAltSchema = z.object({
  alt: z.string().trim().max(300, "300 caractères maximum."),
});

export const CONTACT_STATUSES = ["nouveau", "en_cours", "traite", "archive"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

export const contactStatusSchema = z.object({
  status: z.enum(CONTACT_STATUSES),
  adminNote: optionalText(2000),
});
