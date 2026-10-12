import type { Metadata } from "next";
import { AdminForm } from "@/components/admin/AdminForm";
import { TextArea, TextField } from "@/components/admin/fields";
import { defaultSettings } from "@/content/defaults";
import { SOCIAL_NETWORKS, WEEK_DAYS } from "@/content/types";
import { PERIODS_PER_DAY } from "@/lib/admin/settings-form";
import { requireAdmin } from "@/lib/auth/admin";
import { DAY_LABELS } from "@/lib/content/format";
import { toSettings } from "@/lib/content/mappers";
import { saveSettings } from "../../_actions/content";

export const metadata: Metadata = { title: "Coordonnées et horaires" };

const NETWORK_LABELS: Record<(typeof SOCIAL_NETWORKS)[number], string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

function Fieldset({ legend, description, children }: { legend: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-5 rounded-2xl border border-nuit/10 bg-white/40 p-5 sm:p-6">
      <legend className="px-1 font-serif text-2xl">{legend}</legend>
      {description ? <p className="-mt-2 text-encre">{description}</p> : null}
      {children}
    </fieldset>
  );
}

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  const s = data ? toSettings(data) : defaultSettings;
  const v = (value: string | number | null) => (value === null ? "" : String(value));

  return (
    <>
      <h1 className="text-4xl">Coordonnées et horaires</h1>
      <p className="mt-3 text-encre">
        Ces informations apparaissent sur tout le site et dans les données lues par les moteurs de recherche. Laissez vide ce
        qui n&apos;est pas encore connu : rien ne sera affiché.
      </p>
      <div className="mt-8">
        <AdminForm action={saveSettings}>
          <Fieldset legend="La boutique">
            <TextField name="shopName" label="Nom" required defaultValue={s.shopName} maxLength={80} />
            <TextField name="tagline" label="Signature" defaultValue={v(s.tagline)} maxLength={120} hint="Exemple : Lingerie depuis 1912" />
            <TextArea name="promise" label="Promesse" defaultValue={v(s.promise)} maxLength={300} rows={2} />
          </Fieldset>

          <Fieldset legend="Adresse et accès">
            <TextField name="streetAddress" label="Adresse" defaultValue={v(s.streetAddress)} maxLength={200} />
            <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
              <TextField name="postalCode" label="Code postal" defaultValue={v(s.postalCode)} maxLength={5} />
              <TextField name="city" label="Ville" defaultValue={v(s.city)} maxLength={100} />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="latitude" label="Latitude" defaultValue={v(s.latitude)} hint="Exemple : 47.123456" />
              <TextField name="longitude" label="Longitude" defaultValue={v(s.longitude)} hint="Exemple : 2.123456" />
            </div>
            <p className="-mt-2 text-sm text-encre">
              Coordonnées GPS facultatives : dans Google Maps, un clic droit sur la boutique affiche la latitude et la longitude.
            </p>
            <TextArea name="accessNotes" label="Accès et stationnement" defaultValue={v(s.accessNotes)} maxLength={1000} rows={3} />
          </Fieldset>

          <Fieldset legend="Contact">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="phone" label="Téléphone" type="tel" defaultValue={v(s.phone)} maxLength={30} />
              <TextField name="email" label="E-mail public" type="email" defaultValue={v(s.email)} maxLength={254} />
            </div>
          </Fieldset>

          <Fieldset legend="Horaires" description="Deux créneaux possibles par jour (matin et après-midi). Un jour sans créneau est affiché « Fermé ».">
            <div className="grid gap-3">
              {WEEK_DAYS.map((day) => {
                const periods = s.openingHours.find((d) => d.day === day)?.periods ?? [];
                return (
                  <div key={day} className="grid items-end gap-3 sm:grid-cols-[7rem_1fr_1fr]">
                    <p className="font-medium sm:pb-3">{DAY_LABELS[day]}</p>
                    {Array.from({ length: PERIODS_PER_DAY }, (_, index) => (
                      <div key={index} className="grid grid-cols-2 gap-2">
                        <TextField
                          name={`hours.${day}.${index}.opens`}
                          label={`Ouverture ${index + 1}`}
                          type="time"
                          defaultValue={periods[index]?.opens ?? ""}
                        />
                        <TextField
                          name={`hours.${day}.${index}.closes`}
                          label={`Fermeture ${index + 1}`}
                          type="time"
                          defaultValue={periods[index]?.closes ?? ""}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            <TextField name="hoursNote" label="Précision sur les horaires" defaultValue={v(s.hoursNote)} maxLength={300} hint="Exemple : horaires d'été, fermeture exceptionnelle." />
          </Fieldset>

          <Fieldset legend="Réseaux sociaux" description="Uniquement les comptes réellement actifs (adresse complète en https://).">
            {SOCIAL_NETWORKS.map((network) => (
              <TextField
                key={network}
                name={`social.${network}`}
                label={NETWORK_LABELS[network]}
                type="url"
                defaultValue={s.socialLinks.find((link) => link.network === network)?.url ?? ""}
              />
            ))}
          </Fieldset>

          <Fieldset legend="Référencement" description="Titre et description utilisés par défaut par les moteurs de recherche.">
            <TextField name="seoTitle" label="Titre (70 caractères max.)" defaultValue={v(s.seoTitle)} maxLength={70} />
            <TextArea name="seoDescription" label="Description (170 caractères max.)" defaultValue={v(s.seoDescription)} maxLength={170} rows={2} />
          </Fieldset>

          <Fieldset legend="Mentions légales" description="Informations de votre structure, affichées sur la page Mentions légales.">
            <TextField name="legalName" label="Dénomination sociale" defaultValue={v(s.legalName)} maxLength={150} />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField name="legalForm" label="Forme juridique" defaultValue={v(s.legalForm)} maxLength={100} hint="Exemple : SARL, EURL, SAS, EI…" />
              <TextField name="shareCapital" label="Capital social" defaultValue={v(s.shareCapital)} maxLength={50} />
              <TextField name="siret" label="SIRET" defaultValue={v(s.siret)} maxLength={17} />
              <TextField name="rcs" label="RCS" defaultValue={v(s.rcs)} maxLength={100} />
              <TextField name="vatNumber" label="N° de TVA intracommunautaire" defaultValue={v(s.vatNumber)} maxLength={30} />
              <TextField name="publicationDirector" label="Responsable de la publication" defaultValue={v(s.publicationDirector)} maxLength={150} />
            </div>
            <TextField name="legalAddress" label="Siège social" defaultValue={v(s.legalAddress)} maxLength={300} hint="Si vide, l'adresse de la boutique est utilisée." />
            <TextField name="hostName" label="Hébergeur du site" defaultValue={v(s.hostName)} maxLength={150} />
            <TextField name="hostAddress" label="Adresse de l'hébergeur" defaultValue={v(s.hostAddress)} maxLength={300} />
            <TextField name="hostContact" label="Contact de l'hébergeur" defaultValue={v(s.hostContact)} maxLength={150} />
          </Fieldset>
        </AdminForm>
      </div>
    </>
  );
}
