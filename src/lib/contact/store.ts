import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { getIpHashSalt } from "@/lib/env.server";
import { createServiceClient } from "@/lib/supabase/service";
import type { ContactStore } from "./submit";

/** Stockage des demandes dans Supabase (clé secrète, côté serveur uniquement). */
export function createContactStore(): ContactStore | null {
  const supabase = createServiceClient();
  if (!supabase) return null;
  return {
    async countSince(sinceIso, ipHash) {
      let query = supabase.from("contact_requests").select("id", { count: "exact", head: true }).gte("created_at", sinceIso);
      if (ipHash) query = query.eq("ip_hash", ipHash);
      const { count, error } = await query;
      if (error) throw new Error(error.message);
      return count ?? 0;
    },
    async insert(row) {
      const { error } = await supabase.from("contact_requests").insert(row);
      if (error) throw new Error(error.message);
    },
  };
}

/** Empreinte salée et irréversible de l'adresse IP du visiteur. */
export async function getRequestIpHash(): Promise<string | null> {
  const salt = getIpHashSalt();
  if (!salt) return null;
  const headerList = await headers();
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headerList.get("x-real-ip")?.trim() || "inconnue";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
