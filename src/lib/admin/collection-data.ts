import "server-only";
import type { AdminContext } from "@/lib/auth/admin";
import { collections, type CollectionKey } from "./collections";

export type CollectionListItem = { id: string; label: string; visible: boolean; sortOrder: number };

/** Liste d'une collection (tous statuts, l'administrateur voit aussi les brouillons). */
export async function listCollection(supabase: AdminContext["supabase"], key: CollectionKey): Promise<CollectionListItem[] | null> {
  switch (key) {
    case "categories": {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) return null;
      return data.map((row) => ({ id: row.id, label: collections.categories.label(row), visible: collections.categories.isVisible(row), sortOrder: row.sort_order }));
    }
    case "marques": {
      const { data, error } = await supabase.from("brands").select("*").order("sort_order");
      if (error) return null;
      return data.map((row) => ({ id: row.id, label: collections.marques.label(row), visible: collections.marques.isVisible(row), sortOrder: row.sort_order }));
    }
    case "services": {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) return null;
      return data.map((row) => ({ id: row.id, label: collections.services.label(row), visible: collections.services.isVisible(row), sortOrder: row.sort_order }));
    }
    case "faq": {
      const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
      if (error) return null;
      return data.map((row) => ({ id: row.id, label: collections.faq.label(row), visible: collections.faq.isVisible(row), sortOrder: row.sort_order }));
    }
  }
}

/** Valeurs de formulaire d'un élément existant (null s'il n'existe pas). */
export async function getCollectionItem(
  supabase: AdminContext["supabase"],
  key: CollectionKey,
  id: string,
): Promise<Record<string, string | boolean> | null> {
  switch (key) {
    case "categories": {
      const { data } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
      return data ? collections.categories.toForm(data) : null;
    }
    case "marques": {
      const { data } = await supabase.from("brands").select("*").eq("id", id).maybeSingle();
      return data ? collections.marques.toForm(data) : null;
    }
    case "services": {
      const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
      return data ? collections.services.toForm(data) : null;
    }
    case "faq": {
      const { data } = await supabase.from("faqs").select("*").eq("id", id).maybeSingle();
      return data ? collections.faq.toForm(data) : null;
    }
  }
}

/** Valeurs par défaut d'un nouvel élément. */
export function emptyCollectionValues(key: CollectionKey): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {};
  for (const field of collections[key].fields) {
    if (field.type === "checkbox") values[field.name] = false;
    else if (field.type === "number") values[field.name] = "100";
    else if (field.type === "select") values[field.name] = field.options?.[0]?.value ?? "";
    else values[field.name] = "";
  }
  return values;
}
