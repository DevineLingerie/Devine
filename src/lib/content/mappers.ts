import { z } from "zod";
import type { Brand, Category, Faq, Media, OpeningDay, Page, PageSection, Service, SiteSettings, SocialLink } from "@/content/types";
import type { Row } from "@/lib/supabase/database.types";
import { openingDaySchema, pageSectionSchema, socialLinkSchema } from "@/lib/validation/content";

// Conversion des lignes Supabase (snake_case) vers les types du site.
// Les colonnes JSON sont validées : une entrée mal formée est ignorée plutôt
// que de casser l'affichage de la page.

function parseJsonArray<T>(value: unknown, schema: z.ZodType<T>): T[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const result = schema.safeParse(item);
    return result.success ? [result.data] : [];
  });
}

export function toMedia(row: Pick<Row<"media">, "id" | "path" | "alt" | "width" | "height"> | null): Media | null {
  if (!row) return null;
  return { id: row.id, path: row.path, alt: row.alt, width: row.width, height: row.height };
}

export function toSettings(row: Row<"site_settings">): SiteSettings {
  return {
    shopName: row.shop_name,
    tagline: row.tagline,
    promise: row.promise,
    streetAddress: row.street_address,
    postalCode: row.postal_code,
    city: row.city,
    countryCode: row.country_code,
    latitude: row.latitude === null ? null : Number(row.latitude),
    longitude: row.longitude === null ? null : Number(row.longitude),
    accessNotes: row.access_notes,
    phone: row.phone,
    email: row.email,
    openingHours: parseJsonArray<OpeningDay>(row.opening_hours, openingDaySchema),
    hoursNote: row.hours_note,
    socialLinks: parseJsonArray<SocialLink>(row.social_links, socialLinkSchema),
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    legalName: row.legal_name,
    legalForm: row.legal_form,
    shareCapital: row.share_capital,
    siret: row.siret,
    rcs: row.rcs,
    vatNumber: row.vat_number,
    legalAddress: row.legal_address,
    publicationDirector: row.publication_director,
    hostName: row.host_name,
    hostAddress: row.host_address,
    hostContact: row.host_contact,
  };
}

export function toSettingsRow(settings: SiteSettings): Omit<Row<"site_settings">, "id" | "updated_at"> {
  return {
    shop_name: settings.shopName,
    tagline: settings.tagline,
    promise: settings.promise,
    street_address: settings.streetAddress,
    postal_code: settings.postalCode,
    city: settings.city,
    country_code: settings.countryCode,
    latitude: settings.latitude,
    longitude: settings.longitude,
    access_notes: settings.accessNotes,
    phone: settings.phone,
    email: settings.email,
    opening_hours: settings.openingHours,
    hours_note: settings.hoursNote,
    social_links: settings.socialLinks,
    seo_title: settings.seoTitle,
    seo_description: settings.seoDescription,
    legal_name: settings.legalName,
    legal_form: settings.legalForm,
    share_capital: settings.shareCapital,
    siret: settings.siret,
    rcs: settings.rcs,
    vat_number: settings.vatNumber,
    legal_address: settings.legalAddress,
    publication_director: settings.publicationDirector,
    host_name: settings.hostName,
    host_address: settings.hostAddress,
    host_contact: settings.hostContact,
  };
}

export function parseSections(value: unknown): PageSection[] {
  return parseJsonArray<PageSection>(value, pageSectionSchema);
}

type MediaJoin = { media: Pick<Row<"media">, "id" | "path" | "alt" | "width" | "height"> | null };

export function toPage(row: Row<"pages"> & Partial<MediaJoin>): Page {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    heading: row.heading,
    intro: row.intro,
    sections: parseSections(row.sections),
    heroImage: toMedia(row.media ?? null),
  };
}

export function toCategory(row: Row<"categories"> & Partial<MediaJoin>): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    audience: row.audience,
    summary: row.summary,
    linkPath: row.link_path,
    image: toMedia(row.media ?? null),
    sortOrder: row.sort_order,
  };
}

export function toBrand(row: Row<"brands"> & Partial<MediaJoin>): Brand {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    websiteUrl: row.website_url,
    logo: toMedia(row.media ?? null),
    sortOrder: row.sort_order,
  };
}

export function toService(row: Row<"services">): Service {
  return { id: row.id, slug: row.slug, title: row.title, summary: row.summary, sortOrder: row.sort_order };
}

export function toFaq(row: Row<"faqs">): Faq {
  return { id: row.id, question: row.question, answer: row.answer, sortOrder: row.sort_order };
}
