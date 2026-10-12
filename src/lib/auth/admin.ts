import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type AdminContext = { supabase: SupabaseClient<Database>; userId: string; email: string | null };

export type AdminCheck =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "forbidden"; email: string | null }
  | ({ status: "admin" } & AdminContext);

/**
 * Vérifie côté serveur que la personne connectée est administratrice.
 * L'identité est validée par Supabase (getUser interroge le serveur Auth),
 * puis l'appartenance à admin_users est lue avec les droits de l'utilisateur.
 */
export async function checkAdmin(): Promise<AdminCheck> {
  // Toujours évalué à la requête, jamais au moment du build.
  await connection();
  const supabase = await createSessionClient();
  if (!supabase) return { status: "unconfigured" };

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return { status: "anonymous" };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  const email = userData.user.email ?? null;
  if (error || isAdmin !== true) return { status: "forbidden", email };

  return { status: "admin", supabase, userId: userData.user.id, email };
}

/** À appeler en tête de chaque page et action de l'administration. */
export async function requireAdmin(): Promise<AdminContext> {
  const result = await checkAdmin();
  if (result.status === "admin") return result;
  if (result.status === "forbidden") redirect("/admin/connexion?erreur=acces");
  redirect("/admin/connexion");
}
