import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { collections, isCollectionKey } from "@/lib/admin/collections";
import { listCollection } from "@/lib/admin/collection-data";
import { requireAdmin } from "@/lib/auth/admin";

export async function generateMetadata({ params }: PageProps<"/admin/[collection]">): Promise<Metadata> {
  const { collection } = await params;
  return { title: isCollectionKey(collection) ? collections[collection].title : "Introuvable" };
}

const NOTICES: Record<string, string> = {
  enregistre: "Modifications enregistrées. Le site est à jour.",
  supprime: "Élément supprimé.",
};

export default async function CollectionListPage({ params, searchParams }: PageProps<"/admin/[collection]">) {
  const [{ collection }, query] = await Promise.all([params, searchParams]);
  if (!isCollectionKey(collection)) notFound();
  const { supabase } = await requireAdmin();
  const def = collections[collection];
  const items = await listCollection(supabase, collection);
  const notice = Object.keys(NOTICES).find((key) => query[key] === "1");

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">{def.title}</h1>
          <p className="mt-3 max-w-2xl text-encre">{def.description}</p>
        </div>
        <ButtonLink href={`/admin/${collection}/nouveau`}>{def.addLabel}</ButtonLink>
      </div>
      {notice ? (
        <p role="status" className="mt-6 rounded-xl bg-sauge-pale px-4 py-3">
          {NOTICES[notice]}
        </p>
      ) : null}
      {query.erreur ? (
        <p role="alert" className="mt-6 rounded-xl border border-argile/40 bg-argile/5 px-4 py-3 text-argile-fonce">
          L&apos;opération a échoué. Réessayez.
        </p>
      ) : null}
      {items === null ? (
        <p className="mt-6 text-argile-fonce" role="alert">
          La liste n&apos;a pas pu être chargée.
        </p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-encre">Aucun élément pour le moment.</p>
      ) : (
        <ul className="mt-8 divide-y divide-nuit/10 rounded-2xl border border-nuit/10">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0">
                <Link href={`/admin/${collection}/${item.id}`} className="font-medium hover:underline">
                  {item.label}
                </Link>
                <p className="text-sm text-encre">
                  Ordre {item.sortOrder} · {item.visible ? "Visible sur le site" : "Masqué"}
                </p>
              </div>
              <Link href={`/admin/${collection}/${item.id}`} className="lien shrink-0 text-sm">
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
