import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { CollectionFields } from "@/components/admin/CollectionFields";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { collections, isCollectionKey } from "@/lib/admin/collections";
import { getCollectionItem } from "@/lib/admin/collection-data";
import { getMediaOptions } from "@/lib/admin/media-options";
import { requireAdmin } from "@/lib/auth/admin";
import { uuidSchema } from "@/lib/validation/content";
import { deleteCollectionItem, saveCollectionItem } from "../../../_actions/content";

export const metadata: Metadata = { title: "Modifier un élément" };

export default async function EditCollectionItemPage({ params }: PageProps<"/admin/[collection]/[id]">) {
  const { collection, id } = await params;
  if (!isCollectionKey(collection) || !uuidSchema.safeParse(id).success) notFound();
  const { supabase } = await requireAdmin();
  const def = collections[collection];
  const [values, mediaOptions] = await Promise.all([getCollectionItem(supabase, collection, id), getMediaOptions(supabase)]);
  if (!values) notFound();

  return (
    <>
      <Link href={`/admin/${collection}`} className="lien text-sm">
        ← {def.title}
      </Link>
      <h1 className="mt-4 text-4xl">Modifier : {def.singular}</h1>
      <div className="mt-8">
        <AdminForm action={saveCollectionItem}>
          <input type="hidden" name="collection" value={collection} />
          <input type="hidden" name="id" value={id} />
          <CollectionFields fields={def.fields} values={values} mediaOptions={mediaOptions} />
        </AdminForm>
      </div>
      <form action={deleteCollectionItem} className="mt-10 border-t border-nuit/10 pt-6">
        <input type="hidden" name="collection" value={collection} />
        <input type="hidden" name="id" value={id} />
        <p className="mb-3 text-sm text-encre">Pour simplement retirer cet élément du site, décochez plutôt la case de publication.</p>
        <ConfirmSubmit message="Supprimer définitivement cet élément ?">Supprimer définitivement</ConfirmSubmit>
      </form>
    </>
  );
}
