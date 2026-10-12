import "server-only";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";
import { getPage, getSiteSettings } from "./repository";

/** Page publiée ou 404. */
export async function requirePage(slug: string) {
  const page = await getPage(slug);
  if (!page) notFound();
  return page;
}

export async function getPageMetadata(slug: string, path: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(slug), getSiteSettings()]);
  if (!page) return {};
  return buildPageMetadata(page, path, settings);
}
