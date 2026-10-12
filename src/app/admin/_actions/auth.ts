"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/admin";
import { errorState, text, type AdminFormState } from "@/lib/admin/form-state";
import { getSiteUrl } from "@/lib/env";
import { createSessionClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.email("Adresse e-mail invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});

export async function signIn(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createSessionClient();
  if (!supabase) return errorState(formData, "Supabase n'est pas encore configuré pour ce site.");

  const parsed = loginSchema.safeParse({ email: text(formData, "email").trim(), password: text(formData, "password") });
  if (!parsed.success) {
    formData.delete("password");
    return errorState(formData, "Vérifiez votre saisie.");
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  formData.delete("password");
  if (error) {
    // Message volontairement identique quelle que soit la cause.
    return errorState(formData, "Identifiants incorrects, ou compte non autorisé.");
  }
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createSessionClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/connexion");
}

const passwordSchema = z
  .object({
    password: z.string().min(12, "12 caractères minimum.").max(72, "72 caractères maximum."),
    confirmation: z.string(),
  })
  .refine((data) => data.password === data.confirmation, {
    message: "Les deux mots de passe ne correspondent pas.",
    path: ["confirmation"],
  });

export async function changePassword(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const parsed = passwordSchema.safeParse({
    password: text(formData, "password"),
    confirmation: text(formData, "confirmation"),
  });
  formData.delete("password");
  formData.delete("confirmation");
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return errorState(formData, "Le mot de passe n'a pas été modifié.", {
      [String(issue?.path[0] ?? "password")]: issue?.message ?? "Valeur invalide.",
    });
  }
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return errorState(formData, "Le mot de passe n'a pas pu être modifié. Choisissez-en un autre.");
  return { status: "success", message: "Mot de passe modifié." };
}

export async function requestPasswordReset(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const supabase = await createSessionClient();
  if (!supabase) return errorState(formData, "Supabase n'est pas encore configuré pour ce site.");
  const email = z.email().safeParse(text(formData, "email").trim());
  if (!email.success) return errorState(formData, "Adresse e-mail invalide.", { email: "Adresse e-mail invalide." });
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${getSiteUrl()}/admin/auth/confirm` });
  // Même réponse que le compte existe ou non.
  return {
    status: "success",
    message: "Si cette adresse correspond à un compte, un e-mail de réinitialisation vient d'être envoyé.",
  };
}
