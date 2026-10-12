import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import {
  defaultBrands,
  defaultCategories,
  defaultFaqs,
  defaultPages,
  defaultServices,
  defaultSettings,
} from "@/content/defaults";
import type { Brand, Category, Faq, Page, Service, SiteSettings } from "@/content/types";
import { createPublicClient } from "@/lib/supabase/public";
import { toBrand, toCategory, toFaq, toPage, toService, toSettings } from "./mappers";

// Lecture des contenus publics.
//
// Chaque fonction est mise en cache (« use cache ») et étiquetée CONTENT_TAG :
// l'administration invalide ce tag après chaque modification.
//
// Sans configuration Supabase, ou si la base est injoignable, le contenu par
// défaut (src/content/defaults.ts) est utilisé, avec un cache court en cas
// d'erreur pour réessayer rapidement.

export const CONTENT_TAG = "content";

const MEDIA_COLUMNS = "id, path, alt, width, height";

function logReadError(what: string, error: unknown) {
  const message = error instanceof Error ? error.message : typeof error === "object" && error && "message" in error ? String(error.message) : "erreur inconnue";
  console.error(`[contenu] Lecture impossible (${what}) : ${message}. Contenu par défaut utilisé.`);
}

const fallbackPages: Page[] = defaultPages.map((page) => ({ ...page, heroImage: null }));

export function getDefaultPage(slug: string): Page | null {
  return fallbackPages.find((page) => page.slug === slug) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const supabase = createPublicClient();
  if (!supabase) {
    cacheLife("hours");
    return defaultSettings;
  }
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    cacheLife("minutes");
    if (error) logReadError("réglages", error);
    return defaultSettings;
  }
  cacheLife("hours");
  return toSettings(data);
}

/**
 * Page publiée correspondant au slug. Les sections absentes de la base sont
 * complétées par celles du contenu par défaut, pour que la mise en page
 * reste complète.
 */
export async function getPage(slug: string): Promise<Page | null> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const fallback = getDefaultPage(slug);
  const supabase = createPublicClient();
  if (!supabase) {
    cacheLife("hours");
    return fallback;
  }
  const { data, error } = await supabase
    .from("pages")
    .select(`*, media:hero_image_id (${MEDIA_COLUMNS})`)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) {
    cacheLife("minutes");
    logReadError(`page ${slug}`, error);
    return fallback;
  }
  cacheLife("hours");
  if (!data) return null;
  const page = toPage(data);
  if (fallback) {
    const keys = new Set(page.sections.map((section) => section.key));
    page.sections = [...page.sections, ...fallback.sections.filter((section) => !keys.has(section.key))];
  }
  return page;
}

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const fallback = defaultCategories
    .filter((category) => category.isActive)
    .map(({ isActive: _isActive, ...category }) => ({ ...category, id: category.slug, image: null }));
  const supabase = createPublicClient();
  if (!supabase) {
    cacheLife("hours");
    return fallback;
  }
  const { data, error } = await supabase
    .from("categories")
    .select(`*, media:image_id (${MEDIA_COLUMNS})`)
    .eq("is_active", true)
    .order("sort_order")
    .order("name");
  if (error) {
    cacheLife("minutes");
    logReadError("univers", error);
    return fallback;
  }
  cacheLife("hours");
  return data.map(toCategory);
}

export async function getBrands(): Promise<Brand[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const fallback = defaultBrands
    .filter((brand) => brand.isPublished)
    .map(({ isPublished: _isPublished, ...brand }) => ({ ...brand, id: brand.slug, logo: null }));
  const supabase = createPublicClient();
  if (!supabase) {
    cacheLife("hours");
    return fallback;
  }
  const { data, error } = await supabase
    .from("brands")
    .select(`*, media:logo_id (${MEDIA_COLUMNS})`)
    .eq("is_published", true)
    .order("sort_order")
    .order("name");
  if (error) {
    cacheLife("minutes");
    logReadError("marques", error);
    return fallback;
  }
  cacheLife("hours");
  return data.map(toBrand);
}

export async function getServices(): Promise<Service[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const fallback = defaultServices
    .filter((service) => service.isPublished)
    .map(({ isPublished: _isPublished, ...service }) => ({ ...service, id: service.slug }));
  const supabase = createPublicClient();
  if (!supabase) {
    cacheLife("hours");
    return fallback;
  }
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order")
    .order("title");
  if (error) {
    cacheLife("minutes");
    logReadError("services", error);
    return fallback;
  }
  cacheLife("hours");
  return data.map(toService);
}

export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  const fallback = defaultFaqs
    .filter((faq) => faq.isPublished)
    .map(({ isPublished: _isPublished, ...faq }, index) => ({ ...faq, id: `faq-${index}` }));
  const supabase = createPublicClient();
  if (!supabase) {
    cacheLife("hours");
    return fallback;
  }
  const { data, error } = await supabase.from("faqs").select("*").eq("is_published", true).order("sort_order");
  if (error) {
    cacheLife("minutes");
    logReadError("questions fréquentes", error);
    return fallback;
  }
  cacheLife("hours");
  return data.map(toFaq);
}
