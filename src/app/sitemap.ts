import type { MetadataRoute } from "next";
import { PUBLIC_PAGES } from "@/config/navigation";
import { getSiteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return PUBLIC_PAGES.map(({ path }) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/mentions") || path.startsWith("/confidentialite") ? 0.2 : 0.8,
  }));
}
