import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextField } from "@/components/admin/fields";
import { Logo } from "@/components/brand/Logo";
import { checkAdmin } from "@/lib/auth/admin";
import { requestPasswordReset, signIn, signOut } from "../_actions/auth";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({ searchParams }: PageProps<"/admin/connexion">) {
  const [check, params] = await Promise.all([checkAdmin(), searchParams]);
  if (check.status === "admin") redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <Logo tagline="Administration" />
      <h1 className="mt-10 text-3xl">Connexion</h1>

      {check.status === "unconfigured" ? (
        <div className="mt-6 rounded-xl border border-nuit/15 bg-sable/60 p-5">
          <p className="font-medium">Supabase n&apos;est pas encore configuré.</p>
          <p className="mt-2 text-encre">
            Renseignez les variables d&apos;environnement Supabase (voir le README, section « Connexion à Supabase »), puis
            redémarrez le site.
          </p>
        </div>
      ) : check.status === "forbidden" ? (
        <div className="mt-6 rounded-xl border border-argile/40 bg-argile/5 p-5" role="alert">
          <p>
            Le compte <strong>{check.email}</strong> n&apos;a pas accès à l&apos;administration.
          </p>
          <form action={signOut} className="mt-4">
            <button type="submit" className="lien">
              Se déconnecter
            </button>
          </form>
        </div>
      ) : (
        <>
          {params.erreur === "lien" ? (
            <p className="mt-4 text-argile-fonce" role="alert">
              Ce lien n&apos;est plus valable. Demandez-en un nouveau ci-dessous.
            </p>
          ) : null}
          {params.erreur === "acces" ? (
            <p className="mt-4 text-argile-fonce" role="alert">
              Ce compte n&apos;a pas accès à l&apos;administration.
            </p>
          ) : null}
          <div className="mt-6">
            <AdminForm action={signIn} submitLabel="Se connecter">
              <TextField name="email" label="E-mail" type="email" autoComplete="username" required />
              <TextField name="password" label="Mot de passe" type="password" autoComplete="current-password" required />
            </AdminForm>
          </div>
          <details className="mt-8 rounded-xl border border-nuit/10 p-4">
            <summary className="cursor-pointer font-medium">Mot de passe oublié ?</summary>
            <div className="mt-4">
              <AdminForm action={requestPasswordReset} submitLabel="Recevoir un lien">
                <TextField name="email" label="E-mail du compte" type="email" autoComplete="username" required />
              </AdminForm>
            </div>
          </details>
        </>
      )}
    </main>
  );
}
