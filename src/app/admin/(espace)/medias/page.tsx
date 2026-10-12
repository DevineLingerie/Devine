import type { Metadata } from "next";
import Image from "next/image";
import { AdminForm } from "@/components/admin/AdminForm";
import { ConfirmSubmit } from "@/components/admin/ConfirmSubmit";
import { CheckboxField, FileField, TextField } from "@/components/admin/fields";
import { IMAGE_TYPES } from "@/lib/admin/media";
import { requireAdmin } from "@/lib/auth/admin";
import { getImageUrl } from "@/lib/content/format";
import { deleteImage, updateImageAlt, uploadImage } from "../../_actions/media";

export const metadata: Metadata = { title: "Images" };

export default async function MediaPage({ searchParams }: PageProps<"/admin/medias">) {
  const [{ supabase }, query] = await Promise.all([requireAdmin(), searchParams]);
  const { data: images, error } = await supabase.from("media").select("*").order("created_at", { ascending: false });

  return (
    <>
      <h1 className="text-4xl">Images</h1>
      <p className="mt-3 max-w-2xl text-encre">
        Ajoutez ici les photos de la boutique, puis associez-les aux pages et aux univers. N&apos;utilisez que des images dont
        vous détenez les droits. Formats JPEG, PNG, WebP ou AVIF, 5 Mo maximum.
      </p>
      {query.supprime === "1" ? (
        <p role="status" className="mt-6 rounded-xl bg-sauge-pale px-4 py-3">
          Image supprimée.
        </p>
      ) : null}
      {query.erreur ? (
        <p role="alert" className="mt-6 rounded-xl border border-argile/40 bg-argile/5 px-4 py-3 text-argile-fonce">
          La suppression a échoué.
        </p>
      ) : null}

      <section aria-labelledby="ajouter" className="mt-8">
        <h2 id="ajouter" className="text-2xl">
          Ajouter une image
        </h2>
        <div className="mt-4">
          <AdminForm action={uploadImage} submitLabel="Envoyer l'image">
            <div className="grid gap-5 rounded-2xl border border-nuit/10 bg-white/40 p-5 sm:p-6">
              <FileField name="file" label="Fichier" required accept={Object.keys(IMAGE_TYPES).join(",")} />
              <TextField
                name="alt"
                label="Texte alternatif"
                maxLength={300}
                hint="Décrivez l'image en une phrase pour les personnes qui ne la voient pas. Exemple : « Le comptoir en bois clair de la boutique »."
              />
              <CheckboxField name="decorative" label="Image purement décorative (pas de description)" />
            </div>
          </AdminForm>
        </div>
      </section>

      <section aria-labelledby="phototheque" className="mt-12">
        <h2 id="phototheque" className="text-2xl">
          Photothèque
        </h2>
        {error ? (
          <p className="mt-4 text-argile-fonce" role="alert">
            Les images n&apos;ont pas pu être chargées.
          </p>
        ) : !images || images.length === 0 ? (
          <p className="mt-4 text-encre">Aucune image pour le moment.</p>
        ) : (
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {images.map((image) => {
              const url = getImageUrl(image.path);
              return (
                <li key={image.id} className="rounded-2xl border border-nuit/10 bg-white/40 p-4">
                  {url ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sable">
                      <Image src={url} alt={image.alt} fill sizes="(min-width: 640px) 380px, 90vw" className="object-cover" />
                    </div>
                  ) : null}
                  <p className="mt-2 break-all text-xs text-encre">{image.path}</p>
                  <div className="mt-3">
                    <AdminForm action={updateImageAlt} submitLabel="Enregistrer le texte">
                      <input type="hidden" name="id" value={image.id} />
                      <TextField name="alt" label="Texte alternatif" defaultValue={image.alt} maxLength={300} />
                    </AdminForm>
                  </div>
                  <form action={deleteImage} className="mt-3">
                    <input type="hidden" name="id" value={image.id} />
                    <ConfirmSubmit message="Supprimer cette image ? Elle sera retirée des pages qui l'utilisent.">Supprimer</ConfirmSubmit>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
