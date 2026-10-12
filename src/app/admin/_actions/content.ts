"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { collections, isCollectionKey, parseCollectionForm, type CollectionKey } from "@/lib/admin/collections";
import { databaseErrorMessage, errorState, text, type AdminFormState } from "@/lib/admin/form-state";
import { parsePageForm } from "@/lib/admin/page-form";
import { parseSettingsForm } from "@/lib/admin/settings-form";
import { CONTENT_TAG } from "@/lib/content/repository";
import { toSettingsRow } from "@/lib/content/mappers";
import { parseSections } from "@/lib/content/mappers";
import type { Insert } from "@/lib/supabase/database.types";
import type { AdminContext } from "@/lib/auth/admin";
import { uuidSchema } from "@/lib/validation/content";

const SAVED: AdminFormState = { status: "success", message: "Modifications enregistrées. Le site est à jour." };

export async function saveSettings(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const result = parseSettingsForm(formData);
  if (!result.success) return errorState(formData, "Certains champs sont à corriger.", result.fieldErrors);

  const { error } = await supabase.from("site_settings").upsert({ id: 1, ...toSettingsRow(result.data) });
  if (error) return errorState(formData, databaseErrorMessage(error));
  updateTag(CONTENT_TAG);
  return SAVED;
}

export async function savePage(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const slug = text(formData, "slug");
  const { data: existing, error: readError } = await supabase.from("pages").select("sections").eq("slug", slug).maybeSingle();
  if (readError || !existing) return errorState(formData, "Page introuvable.");

  const sectionKeys = parseSections(existing.sections).map((section) => section.key);
  const result = parsePageForm(formData, slug, sectionKeys);
  if (!result.success) return errorState(formData, "Certains champs sont à corriger.", result.fieldErrors);

  const { error } = await supabase.from("pages").update(result.row).eq("slug", slug);
  if (error) return errorState(formData, databaseErrorMessage(error));
  updateTag(CONTENT_TAG);
  return SAVED;
}

async function writeCollection(
  supabase: AdminContext["supabase"],
  key: CollectionKey,
  id: string | null,
  row: Insert<"categories"> | Insert<"brands"> | Insert<"services"> | Insert<"faqs">,
) {
  switch (key) {
    case "categories": {
      const table = supabase.from("categories");
      const value = row as Insert<"categories">;
      return id ? table.update(value).eq("id", id) : table.insert(value);
    }
    case "marques": {
      const table = supabase.from("brands");
      const value = row as Insert<"brands">;
      return id ? table.update(value).eq("id", id) : table.insert(value);
    }
    case "services": {
      const table = supabase.from("services");
      const value = row as Insert<"services">;
      return id ? table.update(value).eq("id", id) : table.insert(value);
    }
    case "faq": {
      const table = supabase.from("faqs");
      const value = row as Insert<"faqs">;
      return id ? table.update(value).eq("id", id) : table.insert(value);
    }
  }
}

export async function saveCollectionItem(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const key = text(formData, "collection");
  if (!isCollectionKey(key)) return errorState(formData, "Collection inconnue.");

  const rawId = text(formData, "id");
  const id = rawId ? uuidSchema.safeParse(rawId) : null;
  if (id && !id.success) return errorState(formData, "Élément introuvable.");

  const result = parseCollectionForm(key, formData);
  if (!result.success) return errorState(formData, "Certains champs sont à corriger.", result.fieldErrors);

  const { error } = await writeCollection(supabase, key, id ? id.data : null, result.row);
  if (error) return errorState(formData, databaseErrorMessage(error));
  updateTag(CONTENT_TAG);
  redirect(`/admin/${key}?enregistre=1`);
}

export async function deleteCollectionItem(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const key = text(formData, "collection");
  const id = uuidSchema.safeParse(text(formData, "id"));
  if (!isCollectionKey(key) || !id.success) redirect("/admin");
  const { error } = await supabase.from(collections[key].table).delete().eq("id", id.data);
  if (error) redirect(`/admin/${key}?erreur=suppression`);
  updateTag(CONTENT_TAG);
  redirect(`/admin/${key}?supprime=1`);
}
