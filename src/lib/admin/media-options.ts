import "server-only";
import type { AdminContext } from "@/lib/auth/admin";

/** Options d'un sélecteur d'image (photothèque). */
export async function getMediaOptions(supabase: AdminContext["supabase"]) {
  const { data } = await supabase.from("media").select("id, path, alt").order("created_at", { ascending: false });
  return [
    { value: "", label: "— Aucune image (illustration par défaut) —" },
    ...(data ?? []).map((media) => ({ value: media.id, label: media.alt ? `${media.alt} (${media.path})` : media.path })),
  ];
}
