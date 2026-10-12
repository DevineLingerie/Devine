import "server-only";
import { getPublicSupabaseConfig } from "./env";

// Variables réservées au serveur. Ce module ne peut pas être importé par un
// composant client (le paquet "server-only" provoque une erreur de build).

/** Clé secrète Supabase (contourne la RLS) : uniquement pour l'enregistrement des demandes de contact. */
export function getSupabaseSecretKey(): string | null {
  const key = (process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)?.trim();
  return key ? key : null;
}

/** Sel utilisé pour l'empreinte des adresses IP (limitation des envois). */
export function getIpHashSalt(): string | null {
  const salt = process.env.CONTACT_IP_SALT?.trim();
  return salt && salt.length >= 16 ? salt : null;
}

/** Le formulaire de contact n'enregistre rien tant que tout n'est pas configuré. */
export function isContactFormAvailable(): boolean {
  return getPublicSupabaseConfig() !== null && getSupabaseSecretKey() !== null && getIpHashSalt() !== null;
}
