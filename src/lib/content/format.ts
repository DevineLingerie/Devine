import type { OpeningDay, Page, PageSection, SiteSettings, WeekDay } from "@/content/types";
import { WEEK_DAYS } from "@/content/types";
import { IMAGES_BUCKET, getPublicSupabaseConfig } from "@/lib/env";

export const DAY_LABELS: Record<WeekDay, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

/** Section d'une page par sa clé (null si absente). */
export function getSection(page: Pick<Page, "sections">, key: string): PageSection | null {
  return page.sections.find((section) => section.key === key) ?? null;
}

/** Formate « 09:30 » en « 9 h 30 », « 14:00 » en « 14 h ». */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const h = String(Number(hours));
  return minutes === "00" ? `${h} h` : `${h} h ${minutes}`;
}

export type HoursLine = { day: WeekDay; label: string; value: string; isClosed: boolean };

/** Une ligne par jour, du lundi au dimanche. Vide si aucun horaire n'est renseigné. */
export function formatOpeningHours(openingHours: OpeningDay[]): HoursLine[] {
  if (openingHours.length === 0) return [];
  return WEEK_DAYS.map((day) => {
    const entry = openingHours.find((item) => item.day === day);
    const periods = entry?.periods ?? [];
    return {
      day,
      label: DAY_LABELS[day],
      value: periods.length === 0 ? "Fermé" : periods.map((p) => `${formatTime(p.opens)} – ${formatTime(p.closes)}`).join(", "),
      isClosed: periods.length === 0,
    };
  });
}

/** Lien tel: au format international à partir d'un numéro français saisi librement. */
export function toTelHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("00")) return `tel:+${digits.slice(2)}`;
  if (digits.startsWith("0") && digits.length === 10) return `tel:+33${digits.slice(1)}`;
  return `tel:${digits}`;
}

export function hasAddress(settings: SiteSettings): boolean {
  return Boolean(settings.streetAddress && settings.postalCode && settings.city);
}

export function formatAddressLines(settings: SiteSettings): string[] {
  if (!hasAddress(settings)) return [];
  return [settings.streetAddress as string, `${settings.postalCode} ${settings.city}`];
}

/** Lien d'itinéraire (ouvre l'application de cartographie, sans intégration tierce sur le site). */
export function getDirectionsUrl(settings: SiteSettings): string | null {
  let destination: string | null = null;
  if (settings.latitude !== null && settings.longitude !== null) {
    destination = `${settings.latitude},${settings.longitude}`;
  } else if (hasAddress(settings)) {
    destination = `${settings.shopName}, ${formatAddressLines(settings).join(", ")}`;
  }
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

/** URL publique d'une image du bucket Supabase. */
export function getImageUrl(path: string): string | null {
  const config = getPublicSupabaseConfig();
  if (!config) return null;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${config.url}/storage/v1/object/public/${IMAGES_BUCKET}/${encodedPath}`;
}

export type TextBlock = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

/**
 * Découpe un texte saisi dans l'administration en paragraphes et listes.
 * Aucun HTML n'est interprété : le rendu React échappe tout le contenu.
 */
export function parseTextBlocks(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  for (const chunk of text.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    let paragraph: string[] = [];
    let list: string[] = [];
    const flushParagraph = () => {
      if (paragraph.length) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    };
    const flushList = () => {
      if (list.length) blocks.push({ type: "list", items: list });
      list = [];
    };
    for (const line of lines) {
      const item = line.match(/^[-•]\s+(.*)$/);
      if (item) {
        flushParagraph();
        list.push(item[1]);
      } else {
        flushList();
        paragraph.push(line);
      }
    }
    flushParagraph();
    flushList();
  }
  return blocks;
}
