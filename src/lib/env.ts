// Configuration centralisée. Les valeurs proviennent des variables
// d'environnement (voir .env.example) ; aucune valeur secrète n'est écrite ici.

export type PublicSupabaseConfig = { url: string; publishableKey: string };

/**
 * Configuration Supabase utilisable côté navigateur et serveur.
 * Retourne null tant que le projet Supabase n'est pas branché : le site
 * fonctionne alors avec le contenu par défaut et l'administration l'indique.
 */
export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();
  if (!url || !publishableKey) return null;
  return { url, publishableKey };
}

export function isSupabaseConfigured(): boolean {
  return getPublicSupabaseConfig() !== null;
}

/** URL publique du site, sans barre oblique finale. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** Nom du bucket Supabase Storage des images publiques. */
export const IMAGES_BUCKET = "site-images";
