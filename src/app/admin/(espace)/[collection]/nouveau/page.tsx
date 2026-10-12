import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { CollectionFields } from "@/components/admin/CollectionFields";
import { collections, isCollectionKey } from "@/lib/admin/collections";
import { emptyCollectionValues } from "@/lib/admin/collection-data";
import { getMediaOptions } from "@/lib/admin/media-options";
import { requireAdmin } from "@/lib/auth/admin";
import { saveCollectionItem } from "../../../_actions/content";

export const metadata: Metadata = { title: "Nouvel élément" };

export default async function NewCollectionItemPage({ params }: PageProps<"/admin/[collection]/nouveau">) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) notFound();
  const { supabase } = await requireAdmin();
  const def = collections[collection];
  const mediaOptions = await getMediaOptions(supabase);

  return (
    <>
      <Link href={`/admin/${collection}`} className="lien text-sm">
        ← {def.title}
      </Link>
      <h1 className="mt-4 text-4xl">Nouvel élément : {def.singular}</h1>
      <div className="mt-8">
        <AdminForm action={saveCollectionItem} submitLabel="Créer">
          <input type="hidden" name="collection" value={collection} />
          <CollectionFields fields={def.fields} values={emptyCollectionValues(collection)} mediaOptions={mediaOptions} />
        </AdminForm>
      </div>
    </>
  );
}
