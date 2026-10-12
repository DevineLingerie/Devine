import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/env";
import { getSupabaseSecretKey } from "@/lib/env.server";
import type { Database } from "./database.types";

/**
 * Client privilégié (clé secrète, contourne la RLS).
 * Usage limité à l'enregistrement des demandes de contact après validation
 * côté serveur. Ne jamais l'utiliser pour des opérations déclenchées
 * directement par des données non vérifiées.
 */
export function createServiceClient(): SupabaseClient<Database> | null {
  const config = getPublicSupabaseConfig();
  const secretKey = getSupabaseSecretKey();
  if (!config || !secretKey) return null;
  return createClient<Database>(config.url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
