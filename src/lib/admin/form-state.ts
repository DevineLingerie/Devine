import type { z } from "zod";

// État renvoyé par les actions de l'administration à leurs formulaires.

export type AdminFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors: Record<string, string>; values: Record<string, string> };

export const idleState: AdminFormState = { status: "idle" };

/** Valeurs texte du formulaire, renvoyées pour réafficher la saisie après une erreur. */
export function formValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value;
  }
  return values;
}

export function zodFieldErrors(error: z.ZodError, pathMap: (path: string) => string = (path) => path): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = pathMap(issue.path.map(String).join("."));
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}

export function errorState(
  formData: FormData,
  message: string,
  fieldErrors: Record<string, string> = {},
): AdminFormState {
  return { status: "error", message, fieldErrors, values: formValues(formData) };
}

/** Lit un champ texte (absent → chaîne vide). */
export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function checkbox(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

/** Message d'erreur Supabase traduit, sans détail technique. */
export function databaseErrorMessage(error: { code?: string; message?: string }): string {
  if (error.code === "23505") return "Cette valeur existe déjà (identifiant en double).";
  if (error.code === "23514") return "Une valeur ne respecte pas le format attendu.";
  if (error.code === "42501") return "Vous n'avez pas les droits pour effectuer cette modification.";
  return "L'enregistrement a échoué. Réessayez, et si le problème persiste, consultez la documentation.";
}
