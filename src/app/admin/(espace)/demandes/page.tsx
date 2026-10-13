import type { Metadata } from "next";
import Link from "next/link";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { SelectField, TextArea } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth/admin";
import { toTelHref } from "@/lib/content/format";
import { CONTACT_SUBJECTS } from "@/lib/validation/contact";
import { CONTACT_STATUSES, type ContactStatus } from "@/lib/validation/content";
import { deleteContactRequest, updateContactRequest } from "../../_actions/contact";

export const metadata: Metadata = { title: "Demandes de contact" };

const STATUS_LABELS: Record<ContactStatus, string> = {
  nouveau: "Nouvelle",
  en_cours: "En cours",
  traite: "Traitée",
  archive: "Archivée",
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

export default async function ContactRequestsPage({ searchParams }: PageProps<"/admin/demandes">) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const filter = CONTACT_STATUSES.find((status) => status === query.statut) ?? null;

  let request = supabase.from("contact_requests").select("*").order("created_at", { ascending: false }).limit(100);
  if (filter) request = request.eq("status", filter);
  else request = request.neq("status", "archive");
  const { data: requests, error } = await request;

  return (
    <>
      <h1 className="text-4xl">Demandes de contact</h1>
      <p className="mt-3 max-w-2xl text-encre">
        Les demandes sont conservées 12 mois au maximum (voir la politique de confidentialité). Supprimez celles qui
        n&apos;ont plus d&apos;utilité.
      </p>

      <nav aria-label="Filtrer par statut" className="mt-6">
        <ul className="flex flex-wrap gap-2">
          <li>
            <Link href="/admin/demandes" aria-current={!filter ? "page" : undefined} className="block rounded-full border border-nuit/20 px-4 py-2 aria-[current=page]:bg-nuit aria-[current=page]:text-lin">
              À traiter
            </Link>
          </li>
          {CONTACT_STATUSES.map((status) => (
            <li key={status}>
              <Link
                href={`/admin/demandes?statut=${status}`}
                aria-current={filter === status ? "page" : undefined}
                className="block rounded-full border border-nuit/20 px-4 py-2 aria-[current=page]:bg-nuit aria-[current=page]:text-lin"
              >
                {STATUS_LABELS[status]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {query.supprime === "1" ? (
        <p role="status" className="mt-6 rounded-xl bg-sauge-pale px-4 py-3">
          Demande supprimée.
        </p>
      ) : null}

      {error ? (
        <p className="mt-6 text-argile-fonce" role="alert">
          Les demandes n&apos;ont pas pu être chargées.
        </p>
      ) : !requests || requests.length === 0 ? (
        <p className="mt-8 text-encre">Aucune demande dans cette catégorie.</p>
      ) : (
        <ul className="mt-8 grid gap-6">
          {requests.map((item) => (
            <li key={item.id} className="rounded-2xl border border-nuit/10 bg-white/50 p-5 sm:p-6">
              <article aria-labelledby={`demande-${item.id}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id={`demande-${item.id}`} className="font-display text-2xl">
                    {item.name || "Sans nom"} — {CONTACT_SUBJECTS[item.subject]}
                  </h2>
                  <p className="text-sm text-encre">
                    {dateFormat.format(new Date(item.created_at))} · {STATUS_LABELS[item.status]}
                  </p>
                </div>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                  {item.email ? (
                    <li>
                      <a href={`mailto:${item.email}`} className="lien break-all">
                        {item.email}
                      </a>
                    </li>
                  ) : null}
                  {item.phone ? (
                    <li>
                      <a href={toTelHref(item.phone)} className="lien">
                        {item.phone}
                      </a>
                    </li>
                  ) : null}
                </ul>
                <p className="mt-4 whitespace-pre-line rounded-xl bg-sable/50 p-4">{item.message}</p>
                <div className="mt-4">
                  <AdminForm action={updateContactRequest} submitLabel="Mettre à jour">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
                      <SelectField
                        name="status"
                        label="Statut"
                        defaultValue={item.status}
                        options={CONTACT_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }))}
                      />
                      <TextArea name="adminNote" label="Note interne" defaultValue={item.admin_note ?? ""} maxLength={2000} rows={2} />
                    </div>
                  </AdminForm>
                </div>
                <form action={deleteContactRequest} className="mt-2">
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmit message="Supprimer définitivement cette demande ?">Supprimer</ConfirmSubmit>
                </form>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
