import { PRIVACY_VERSION } from "@/content/defaults";
import type { Insert } from "@/lib/supabase/database.types";
import {
  contactFormSchema,
  isHoneypotFilled,
  isSubmittedTooFast,
  toFieldErrors,
  type ContactFieldErrors,
  type ContactFormState,
  type RawContactForm,
} from "@/lib/validation/contact";

// Traitement d'une demande de contact, indépendant de Next.js et de Supabase
// pour être testé unitairement. Les dépendances sont injectées.

export const RATE_LIMIT = {
  /** Envois maximum par adresse IP sur la fenêtre. */
  perIp: 3,
  ipWindowMs: 10 * 60 * 1000,
  /** Envois maximum, toutes adresses confondues, sur la fenêtre. */
  global: 40,
  globalWindowMs: 60 * 60 * 1000,
} as const;

export type ContactStore = {
  countSince(sinceIso: string, ipHash?: string): Promise<number>;
  insert(row: Insert<"contact_requests">): Promise<void>;
};

export type ContactDeps = {
  store: ContactStore | null;
  ipHash: string | null;
  now: number;
};

const SUCCESS: ContactFormState = {
  status: "success",
  message: "Merci, votre message a bien été envoyé. Nous vous répondrons dès que possible.",
};

const UNAVAILABLE_MESSAGE =
  "Le formulaire n'est pas disponible pour le moment. Contactez-nous par téléphone ou passez en boutique.";

export async function processContactSubmission(raw: RawContactForm, deps: ContactDeps): Promise<ContactFormState> {
  const values = { name: raw.name, email: raw.email, phone: raw.phone, subject: raw.subject, message: raw.message };
  const fail = (message: string, fieldErrors: ContactFieldErrors = {}): ContactFormState => ({
    status: "error",
    message,
    fieldErrors,
    values,
  });

  // Robot probable : on répond comme si tout allait bien, sans rien enregistrer.
  if (isHoneypotFilled(raw)) return SUCCESS;

  if (isSubmittedTooFast(raw, deps.now)) {
    return fail("Vous avez été très rapide ! Patientez quelques secondes puis renvoyez votre message.");
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return fail("Certains champs sont à vérifier.", toFieldErrors(parsed.error));
  }

  if (!deps.store || !deps.ipHash) return fail(UNAVAILABLE_MESSAGE);

  try {
    const [fromIp, total] = await Promise.all([
      deps.store.countSince(new Date(deps.now - RATE_LIMIT.ipWindowMs).toISOString(), deps.ipHash),
      deps.store.countSince(new Date(deps.now - RATE_LIMIT.globalWindowMs).toISOString()),
    ]);
    if (fromIp >= RATE_LIMIT.perIp || total >= RATE_LIMIT.global) {
      return fail("Nous avons reçu plusieurs messages à la suite. Merci de réessayer un peu plus tard, ou de nous appeler.");
    }

    const data = parsed.data;
    await deps.store.insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      consent_at: new Date(deps.now).toISOString(),
      privacy_version: PRIVACY_VERSION,
      ip_hash: deps.ipHash,
    });
  } catch (error) {
    // Détail technique dans les journaux du serveur uniquement.
    console.error("[contact] Enregistrement impossible :", error instanceof Error ? error.message : error);
    return fail("Votre message n'a pas pu être envoyé. Réessayez dans un instant ou contactez-nous par téléphone.");
  }

  return SUCCESS;
}
