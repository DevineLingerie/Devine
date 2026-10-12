import { SOCIAL_NETWORKS, WEEK_DAYS, type OpeningDay, type SiteSettings, type SocialLink } from "@/content/types";
import { settingsSchema } from "@/lib/validation/content";
import { zodFieldErrors } from "./form-state";

// Lecture du formulaire des réglages généraux.
// Horaires : champs « hours.<jour>.<n>.opens|closes » (2 créneaux par jour).
// Réseaux : champs « social.<réseau> ».

export const PERIODS_PER_DAY = 2;

const SIMPLE_FIELDS = [
  "shopName",
  "tagline",
  "promise",
  "streetAddress",
  "postalCode",
  "city",
  "latitude",
  "longitude",
  "accessNotes",
  "phone",
  "email",
  "hoursNote",
  "seoTitle",
  "seoDescription",
  "legalName",
  "legalForm",
  "shareCapital",
  "siret",
  "rcs",
  "vatNumber",
  "legalAddress",
  "publicationDirector",
  "hostName",
  "hostAddress",
  "hostContact",
] as const;

export type SettingsFormResult =
  | { success: true; data: SiteSettings }
  | { success: false; fieldErrors: Record<string, string> };

function read(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseSettingsForm(formData: FormData): SettingsFormResult {
  const fieldErrors: Record<string, string> = {};

  const openingHours: OpeningDay[] = [];
  for (const day of WEEK_DAYS) {
    const periods = [];
    for (let index = 0; index < PERIODS_PER_DAY; index++) {
      const opens = read(formData, `hours.${day}.${index}.opens`);
      const closes = read(formData, `hours.${day}.${index}.closes`);
      if (!opens && !closes) continue;
      if (!opens) fieldErrors[`hours.${day}.${index}.opens`] = "Heure d'ouverture manquante.";
      if (!closes) fieldErrors[`hours.${day}.${index}.closes`] = "Heure de fermeture manquante.";
      if (opens && closes && opens >= closes) {
        fieldErrors[`hours.${day}.${index}.closes`] = "L'heure de fermeture doit suivre l'heure d'ouverture.";
      } else if (opens && closes) {
        periods.push({ opens, closes });
      }
    }
    openingHours.push({ day, periods });
  }
  // Aucun créneau saisi : horaires non renseignés (le site ne les affiche pas).
  const hasHours = openingHours.some((day) => day.periods.length > 0);

  const socialLinks: SocialLink[] = [];
  for (const network of SOCIAL_NETWORKS) {
    const url = read(formData, `social.${network}`);
    if (url) socialLinks.push({ network, url });
  }

  const raw: Record<string, unknown> = {
    countryCode: "FR",
    openingHours: hasHours ? openingHours : [],
    socialLinks,
  };
  for (const field of SIMPLE_FIELDS) raw[field] = read(formData, field);

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    Object.assign(
      fieldErrors,
      zodFieldErrors(parsed.error, (path) => {
        // Format d'heure invalide : rattaché au jour (le créneau exact est déjà vérifié plus haut).
        const hours = path.match(/^openingHours\.(\d+)/);
        if (hours) return `hours.${WEEK_DAYS[Number(hours[1])]}.0.opens`;
        // socialLinks.1.url → social.<réseau>
        const social = path.match(/^socialLinks\.(\d+)/);
        if (social) return `social.${socialLinks[Number(social[1])]?.network ?? "instagram"}`;
        return path;
      }),
    );
  }
  if (Object.keys(fieldErrors).length > 0 || !parsed.success) {
    return { success: false, fieldErrors };
  }
  return { success: true, data: parsed.data };
}
