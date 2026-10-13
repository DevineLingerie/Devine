import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { CheckboxField, SelectField, TextArea, TextField } from "@/components/admin/fields";
import { pathForSlug } from "@/config/navigation";
import { getMediaOptions } from "@/lib/admin/media-options";
import { requireAdmin } from "@/lib/auth/admin";
import { parseSections } from "@/lib/content/mappers";
import { savePage } from "../../../_actions/content";

export const metadata: Metadata = { title: "Modifier une page" };

export default async function AdminPageEdit({ params }: PageProps<"/admin/pages/[slug]">) {
  const { slug } = await params;
  const { supabase } = await requireAdmin();
  const [{ data: page }, mediaOptions] = await Promise.all([
    supabase.from("pages").select("*").eq("slug", slug).maybeSingle(),
    getMediaOptions(supabase),
  ]);
  if (!page) notFound();
  const sections = parseSections(page.sections);
  const publicPath = pathForSlug(page.slug);

  return (
    <>
      <Link href="/admin/pages" className="lien text-sm">
        ← Toutes les pages
      </Link>
      <h1 className="mt-4 text-4xl">{page.title}</h1>
      {publicPath ? (
        <p className="mt-2">
          <Link href={publicPath} target="_blank" className="lien">
            Voir la page {publicPath}
          </Link>
        </p>
      ) : null}
      <p className="mt-4 text-sm text-encre">
        Mise en forme des textes : une ligne vide sépare deux paragraphes ; une ligne commençant par « - » devient un élément
        de liste.
      </p>

      <div className="mt-8">
        <AdminForm action={savePage}>
          <input type="hidden" name="slug" value={page.slug} />
          <fieldset className="grid gap-5 rounded-2xl border border-nuit/10 bg-white/40 p-5 sm:p-6">
            <legend className="px-1 font-display text-2xl">En-tête</legend>
            <TextField name="heading" label="Titre principal (H1)" required defaultValue={page.heading} maxLength={120} />
            <TextArea name="intro" label="Introduction" defaultValue={page.intro ?? ""} maxLength={600} rows={3} />
            <SelectField name="heroImageId" label="Image principale" defaultValue={page.hero_image_id ?? ""} options={mediaOptions} hint="Ajoutez d'abord l'image dans « Images »." />
          </fieldset>

          {sections.map((section) => (
            <fieldset key={section.key} className="grid gap-5 rounded-2xl border border-nuit/10 bg-white/40 p-5 sm:p-6">
              <legend className="px-1 font-display text-2xl">Section « {section.heading} »</legend>
              <TextField name={`sections.${section.key}.heading`} label="Titre de la section" required defaultValue={section.heading} maxLength={120} />
              <TextArea name={`sections.${section.key}.body`} label="Texte" defaultValue={section.body} maxLength={3000} rows={6} />
            </fieldset>
          ))}

          <fieldset className="grid gap-5 rounded-2xl border border-nuit/10 bg-white/40 p-5 sm:p-6">
            <legend className="px-1 font-display text-2xl">Référencement</legend>
            <TextField name="title" label="Titre pour les moteurs de recherche (70 caractères max.)" required defaultValue={page.title} maxLength={70} />
            <TextArea name="description" label="Description pour les moteurs de recherche (170 caractères max.)" required defaultValue={page.description} maxLength={170} rows={2} />
            <CheckboxField name="isPublished" label="Page publiée" defaultChecked={page.is_published} hint="Une page non publiée affiche « page introuvable » aux visiteurs." />
          </fieldset>
        </AdminForm>
      </div>
    </>
  );
}
