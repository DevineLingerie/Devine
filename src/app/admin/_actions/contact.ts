"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { databaseErrorMessage, errorState, text, type AdminFormState } from "@/lib/admin/form-state";
import { contactStatusSchema, uuidSchema } from "@/lib/validation/content";

export async function updateContactRequest(_previous: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse(text(formData, "id"));
  if (!id.success) return errorState(formData, "Demande introuvable.");
  const parsed = contactStatusSchema.safeParse({ status: text(formData, "status"), adminNote: text(formData, "adminNote") });
  if (!parsed.success) return errorState(formData, "Valeur invalide.");
  const { status, adminNote } = parsed.data;
  const { error } = await supabase
    .from("contact_requests")
    .update({
      status,
      admin_note: adminNote,
      handled_at: status === "traite" || status === "archive" ? new Date().toISOString() : null,
    })
    .eq("id", id.data);
  if (error) return errorState(formData, databaseErrorMessage(error));
  revalidatePath("/admin/demandes");
  return { status: "success", message: "Demande mise à jour." };
}

export async function deleteContactRequest(formData: FormData): Promise<void> {
  const { supabase } = await requireAdmin();
  const id = uuidSchema.safeParse(text(formData, "id"));
  if (!id.success) redirect("/admin/demandes");
  const { error } = await supabase.from("contact_requests").delete().eq("id", id.data);
  redirect(error ? "/admin/demandes?erreur=suppression" : "/admin/demandes?supprime=1");
}
