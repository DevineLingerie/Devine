import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getPublicSupabaseConfig } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Client lié à la session de l'utilisateur connecté (cookies).
 * Utilisé par l'administration : la RLS s'applique avec ses droits.
 */
export async function createSessionClient(): Promise<SupabaseClient<Database> | null> {
  const config = getPublicSupabaseConfig();
  if (!config) return null;
  const cookieStore = await cookies();
  return createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component : l'écriture est impossible,
          // le proxy (src/proxy.ts) se charge de rafraîchir la session.
        }
      },
    },
  });
}
