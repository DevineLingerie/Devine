import type { Metadata } from "next";
import Link from "next/link";
import { buildLaunchChecklist } from "@/lib/admin/checklist";
import { requireAdmin } from "@/lib/auth/admin";
import { toSettings } from "@/lib/content/mappers";
import { defaultSettings } from "@/content/defaults";

export const metadata: Metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();
  const [{ data: settingsRow }, { count: newRequests }, { count: imageCount }] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("contact_requests").select("id", { count: "exact", head: true }).eq("status", "nouveau"),
    supabase.from("media").select("id", { count: "exact", head: true }),
  ]);
  const settings = settingsRow ? toSettings(settingsRow) : defaultSettings;
  const checklist = buildLaunchChecklist(settings);
  const remaining = checklist.filter((item) => !item.done).length;

  return (
    <>
      <h1 className="text-4xl">Bonjour</h1>
      <p className="mt-3 text-lg text-encre">Que souhaitez-vous mettre à jour aujourd&apos;hui ?</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/admin/demandes" className="rounded-2xl border border-nuit/10 bg-sable/60 p-6 hover:border-nuit/30">
          <p className="font-display text-4xl">{newRequests ?? 0}</p>
          <p className="mt-1 text-encre">nouvelle{(newRequests ?? 0) > 1 ? "s" : ""} demande{(newRequests ?? 0) > 1 ? "s" : ""} de contact</p>
        </Link>
        <Link href="/admin/medias" className="rounded-2xl border border-nuit/10 bg-sable/60 p-6 hover:border-nuit/30">
          <p className="font-display text-4xl">{imageCount ?? 0}</p>
          <p className="mt-1 text-encre">image{(imageCount ?? 0) > 1 ? "s" : ""} dans la photothèque</p>
        </Link>
      </div>

      <section aria-labelledby="checklist" className="mt-12">
        <h2 id="checklist" className="text-2xl">
          Avant la mise en ligne {remaining === 0 ? "— tout est prêt" : `— ${remaining} information${remaining > 1 ? "s" : ""} à compléter`}
        </h2>
        <ul className="mt-4 divide-y divide-nuit/10 rounded-2xl border border-nuit/10">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center justify-between gap-4 px-5 py-3">
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className={item.done ? "text-sauge" : "text-argile"}>
                  {item.done ? "✓" : "○"}
                </span>
                {item.label}
                <span className="sr-only">{item.done ? " : renseigné" : " : à compléter"}</span>
              </span>
              {!item.done ? (
                <Link href={item.href} className="lien shrink-0 text-sm">
                  Compléter
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-encre">
          Pensez aussi à ajouter les photos de la boutique (Images), puis à les associer aux pages.
        </p>
      </section>
    </>
  );
}
