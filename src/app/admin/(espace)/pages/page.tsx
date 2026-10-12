import type { Metadata } from "next";
import Link from "next/link";
import { pathForSlug } from "@/config/navigation";
import { requireAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = { title: "Pages et textes" };

export default async function AdminPagesList() {
  const { supabase } = await requireAdmin();
  const { data: pages, error } = await supabase.from("pages").select("slug, title, is_published, updated_at").order("slug");

  return (
    <>
      <h1 className="text-4xl">Pages et textes</h1>
      <p className="mt-3 text-encre">Modifiez les titres, les textes et l&apos;image principale de chaque page.</p>
      {error ? (
        <p className="mt-6 text-argile-fonce" role="alert">
          Les pages n&apos;ont pas pu être chargées.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-nuit/10 rounded-2xl border border-nuit/10">
          {(pages ?? []).map((page) => (
            <li key={page.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <Link href={`/admin/pages/${page.slug}`} className="font-medium hover:underline">
                  {page.title}
                </Link>
                <p className="text-sm text-encre">
                  {pathForSlug(page.slug) ?? page.slug} · {page.is_published ? "Publiée" : "Brouillon"}
                </p>
              </div>
              <Link href={`/admin/pages/${page.slug}`} className="lien text-sm">
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
