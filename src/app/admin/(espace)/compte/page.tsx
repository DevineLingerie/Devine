import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth/admin";
import { changePassword } from "../../_actions/auth";

export const metadata: Metadata = { title: "Mon compte" };

export default async function AccountPage({ searchParams }: PageProps<"/admin/compte">) {
  const [{ email }, query] = await Promise.all([requireAdmin(), searchParams]);
  return (
    <>
      <h1 className="text-4xl">Mon compte</h1>
      <p className="mt-3 text-encre">Connectée ou connecté en tant que {email}.</p>
      {query.reinitialisation === "1" ? (
        <p role="status" className="mt-6 rounded-xl bg-sauge-pale px-4 py-3">
          Vous êtes connectée ou connecté grâce au lien reçu par e-mail. Choisissez maintenant un nouveau mot de passe.
        </p>
      ) : null}
      <section aria-labelledby="mot-de-passe" className="mt-8 max-w-lg">
        <h2 id="mot-de-passe" className="text-2xl">
          Changer de mot de passe
        </h2>
        <div className="mt-4">
          <AdminForm action={changePassword} submitLabel="Changer le mot de passe">
            <TextField name="password" label="Nouveau mot de passe" type="password" autoComplete="new-password" required hint="12 caractères minimum. Une phrase de plusieurs mots est idéale." />
            <TextField name="confirmation" label="Confirmation" type="password" autoComplete="new-password" required />
          </AdminForm>
        </div>
      </section>
    </>
  );
}
