import type { SiteSettings } from "@/content/types";

export type ChecklistItem = { label: string; done: boolean; href: string };

/** Informations à renseigner avant la mise en ligne. */
export function buildLaunchChecklist(settings: SiteSettings): ChecklistItem[] {
  const settingsHref = "/admin/reglages";
  return [
    { label: "Adresse de la boutique", done: Boolean(settings.streetAddress && settings.postalCode && settings.city), href: settingsHref },
    { label: "Téléphone", done: Boolean(settings.phone), href: settingsHref },
    { label: "Horaires d'ouverture", done: settings.openingHours.some((day) => day.periods.length > 0), href: settingsHref },
    { label: "Coordonnées GPS (itinéraire précis, référencement local)", done: settings.latitude !== null && settings.longitude !== null, href: settingsHref },
    { label: "Dénomination et forme juridiques", done: Boolean(settings.legalName && settings.legalForm), href: settingsHref },
    { label: "SIRET", done: Boolean(settings.siret), href: settingsHref },
    { label: "Responsable de la publication", done: Boolean(settings.publicationDirector), href: settingsHref },
    { label: "Hébergeur du site", done: Boolean(settings.hostName && settings.hostAddress), href: settingsHref },
  ];
}
