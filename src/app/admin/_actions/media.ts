"use server";

import { randomBytes } from "node:crypto";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { databaseErrorMessage, errorState, text, type AdminFormState } from "@/lib/admin/form-state";
import { buildStoragePath, checkImage } from "@/lib/admin/media";
import { CONTENT_TAG } from "@/lib/content/repository";
import { IMAGES_BUCKET } from "@/lib/env";
import { mediaAltSchema, uuidSchema } from "@/lib/validation/content";

export async function uploadImage(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const file = formData.get("file");
  formData.delete("file");
  if (!(file instanceof File)) return errorState(formData, "Choisissez une image.", { file: "Choisissez une image." });

  const decorative = formData.get("decorative") === "on";
  const alt = mediaAltSchema.safeParse({ alt: text(formData, "alt") });
  if (!alt.success) return errorState(formData, "Texte alternatif trop long.", { alt: alt.error.issues[0].message });
  if (!decorative && alt.data.alt === "") {
    return errorState(formData, "Décrivez l'image pour les personnes qui ne la voient pas.", {
      alt: "Texte alternatif requis (ou cochez « image décorative »).",
    });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const check = checkImage(file.size, bytes.slice(0, 16));
  if (!check.ok) return errorState(formData, check.message, { file: check.message });

  const path = buildStoragePath(file.name, check.type, new Date(), randomBytes(3).toString("hex"));
  const { error: uploadError } = await supabase.storage
    .from(IMAGES_BUCKET)
    .upload(path, bytes, { contentType: check.type, cacheControl: "31536000", upsert: false });
  if (uploadError) return errorState(formData, "L'envoi de l'image a échoué. Réessayez.");

  const { error } = await supabase.from("media").insert({ path, alt: decorative ? "" : alt.data.alt });
  if (error) {
    await supabase.storage.from(IMAGES_BUCKET).remove([path]);
    return errorState(formData, databaseErrorMessage(error));
  }
  return { status: "success", message: "Image ajoutée." };
}

export async function updateImageAlt(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse(text(formData, "id"));
  const alt = mediaAltSchema.safeParse({ alt: text(formData, "alt") });
  if (!id.success) return errorState(formData, "Image introuvable.");
  if (!alt.success) return errorState(formData, "Texte trop long.", { alt: alt.error.issues[0].message });
  const { error } = await supabase.from("media").update({ alt: alt.data.alt }).eq("id", id.data);
  if (error) return errorState(formData, databaseErrorMessage(error));
  updateTag(CONTENT_TAG);
  return { status: "success", message: "Texte alternatif enregistré." };
}

export async function deleteImage(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse(text(formData, "id"));
  if (!id.success) redirect("/admin/medias");
  const { data: media } = await supabase.from("media").select("path").eq("id", id.data).maybeSingle();
  if (!media) redirect("/admin/medias");
  // Les références (pages, univers, marques) passent à NULL (ON DELETE SET NULL).
  const { error } = await supabase.from("media").delete().eq("id", id.data);
  if (error) redirect("/admin/medias?erreur=suppression");
  await supabase.storage.from(IMAGES_BUCKET).remove([media.path]);
  updateTag(CONTENT_TAG);
  redirect("/admin/medias?supprime=1");
}
