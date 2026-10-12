import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPublicSupabaseConfig } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Client sans session, pour lire les contenus publiés (RLS « anon »).
 * Il ne lit aucun cookie : ses résultats peuvent être mis en cache et
 * partagés entre visiteurs.
 */
export function createPublicClient(): SupabaseClient<Database> | null {
  const config = getPublicSupabaseConfig();
  if (!config) return null;
  return createClient<Database>(config.url, config.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
