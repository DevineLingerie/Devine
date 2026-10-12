import { z } from "zod";

export const CONTACT_SUBJECTS = {
  conseil: "Une question de conseil ou de taille",
  visite: "Préparer ma visite",
  produit: "Un modèle, une marque, une disponibilité",
  autre: "Autre chose",
} as const;

export type ContactSubject = keyof typeof CONTACT_SUBJECTS;

const SUBJECT_KEYS = Object.keys(CONTACT_SUBJECTS) as [ContactSubject, ...ContactSubject[]];

/** Délai minimal (ms) entre l'affichage du formulaire et l'envoi : en dessous, c'est un robot. */
export const MIN_FILL_DURATION_MS = 3000;

const emptyToNull = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? null : value;

export const contactFormSchema = z
  .object({
    name: z.preprocess(
      emptyToNull,
      z.string().trim().max(120, "120 caractères maximum.").nullable(),
    ),
    email: z.preprocess(
      emptyToNull,
      z.email("Cette adresse e-mail ne semble pas valide.").max(254).nullable(),
    ),
    phone: z.preprocess(
      emptyToNull,
      z
        .string()
        .trim()
        .max(30, "30 caractères maximum.")
        .regex(/^\+?[\d\s.()-]{6,}$/, "Ce numéro de téléphone ne semble pas valide.")
        .nullable(),
    ),
    subject: z.enum(SUBJECT_KEYS, { error: "Choisissez un sujet." }),
    message: z
      .string({ error: "Écrivez votre message." })
      .trim()
      .min(10, "Votre message est un peu court (10 caractères minimum).")
      .max(2000, "Votre message est trop long (2000 caractères maximum)."),
    consent: z.literal("on", {
      error: "Merci d'accepter l'utilisation de vos coordonnées pour vous répondre.",
    }),
  })
  .refine((data) => data.email !== null || data.phone !== null, {
    message: "Indiquez une adresse e-mail ou un numéro de téléphone pour que nous puissions vous répondre.",
    path: ["email"],
  });

export type ContactFormData = z.output<typeof contactFormSchema>;

export type ContactFieldErrors = Partial<Record<"name" | "email" | "phone" | "subject" | "message" | "consent", string>>;

export type ContactFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors: ContactFieldErrors;
      values: Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;
    };

/** Lit les champs du formulaire en texte brut (valeurs non fiables). */
export function readContactForm(formData: FormData) {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    name: text("name"),
    email: text("email"),
    phone: text("phone"),
    subject: text("subject"),
    message: text("message"),
    consent: text("consent"),
    // Champs anti-spam
    website: text("website"),
    startedAt: text("startedAt"),
  };
}

export type RawContactForm = ReturnType<typeof readContactForm>;

/**
 * Champ piège rempli : soumission automatisée. Un honeypot ne bloque que les
 * robots les plus simples ; la limitation par adresse IP complète le dispositif.
 */
export function isHoneypotFilled(raw: RawContactForm): boolean {
  return raw.website.trim() !== "";
}

/**
 * Formulaire envoyé trop vite après son affichage. L'horodatage est posé par
 * le navigateur : s'il est absent (JavaScript désactivé), on ne bloque pas.
 */
export function isSubmittedTooFast(raw: RawContactForm, now: number): boolean {
  if (raw.startedAt.trim() === "") return false;
  const startedAt = Number(raw.startedAt);
  if (!Number.isFinite(startedAt)) return false;
  return now - startedAt < MIN_FILL_DURATION_MS;
}

export function toFieldErrors(error: z.ZodError): ContactFieldErrors {
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in fieldErrors)) {
      fieldErrors[field as keyof ContactFieldErrors] = issue.message;
    }
  }
  return fieldErrors;
}
