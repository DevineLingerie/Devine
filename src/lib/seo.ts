import type { Metadata } from "next";
import type { Page, SiteSettings } from "@/content/types";
import { WEEK_DAYS } from "@/content/types";
import { getImageUrl } from "@/lib/content/format";
import { getSiteUrl } from "@/lib/env";

/** Métadonnées d'une page publique : title, description, canonique, Open Graph. */
export function buildPageMetadata(page: Page, path: string, settings: SiteSettings): Metadata {
  const url = `${getSiteUrl()}${path}`;
  const imageUrl = page.heroImage ? getImageUrl(page.heroImage.path) : null;
  const isHome = path === "/";
  return {
    title: isHome ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: settings.shopName,
      title: page.title,
      description: page.description,
      url,
      ...(imageUrl ? { images: [{ url: imageUrl, alt: page.heroImage?.alt ?? "" }] } : {}),
    },
  };
}

const SCHEMA_DAYS: Record<(typeof WEEK_DAYS)[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

type JsonLd = Record<string, unknown>;

/**
 * Données structurées Schema.org du commerce. Seules les informations
 * renseignées sont publiées : ni note, ni avis, ni prix, ni valeur inventée.
 */
export function buildLocalBusinessJsonLd(settings: SiteSettings): JsonLd {
  const siteUrl = getSiteUrl();
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${siteUrl}/#boutique`,
    name: settings.shopName,
    url: siteUrl,
  };
  if (settings.seoDescription) data.description = settings.seoDescription;
  if (settings.tagline) data.slogan = settings.tagline;
  if (settings.phone) data.telephone = settings.phone;
  if (settings.email) data.email = settings.email;
  if (settings.streetAddress && settings.postalCode && settings.city) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: settings.streetAddress,
      postalCode: settings.postalCode,
      addressLocality: settings.city,
      addressCountry: settings.countryCode,
    };
  }
  if (settings.latitude !== null && settings.longitude !== null) {
    data.geo = { "@type": "GeoCoordinates", latitude: settings.latitude, longitude: settings.longitude };
  }
  const hours = settings.openingHours.flatMap((day) =>
    day.periods.map((period) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[day.day]}`,
      opens: period.opens,
      closes: period.closes,
    })),
  );
  if (hours.length > 0) data.openingHoursSpecification = hours;
  if (settings.socialLinks.length > 0) data.sameAs = settings.socialLinks.map((link) => link.url);
  return data;
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]): JsonLd | null {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/** Sérialise du JSON-LD sans permettre de sortir de la balise <script>. */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
