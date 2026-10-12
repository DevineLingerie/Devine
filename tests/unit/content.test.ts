import { describe, expect, it } from "vitest";
import { defaultBrands, defaultCategories, defaultFaqs, defaultPages, defaultServices, defaultSettings } from "@/content/defaults";
import { PUBLIC_PAGES } from "@/config/navigation";
import {
  brandSchema,
  categorySchema,
  faqSchema,
  pageSchema,
  serviceSchema,
  settingsSchema,
} from "@/lib/validation/content";

// Les contenus par défaut doivent respecter les mêmes règles que l'administration
// (longueurs SEO, formats), sinon la base les refuserait.

describe("contenus par défaut", () => {
  it("les réglages sont valides", () => {
    const toForm = Object.fromEntries(Object.entries(defaultSettings).map(([k, v]) => [k, v ?? ""]));
    expect(settingsSchema.safeParse({ ...toForm, latitude: null, longitude: null }).success).toBe(true);
  });

  it.each(defaultPages.map((page) => [page.slug, page] as const))("la page %s respecte les limites", (_slug, page) => {
    const result = pageSchema.safeParse({ ...page, intro: page.intro ?? "", heroImageId: "", isPublished: true });
    expect(result.error?.issues ?? []).toEqual([]);
  });

  it("chaque page publique a son contenu et inversement", () => {
    expect(defaultPages.map((p) => p.slug).sort()).toEqual(PUBLIC_PAGES.map((p) => p.slug).sort());
  });

  it("les clés de section sont uniques dans chaque page", () => {
    for (const page of defaultPages) {
      const keys = page.sections.map((s) => s.key);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it("les meta descriptions sont uniques", () => {
    const descriptions = defaultPages.map((p) => p.description);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("univers, marques, services et questions sont valides", () => {
    for (const c of defaultCategories) {
      expect(categorySchema.safeParse({ ...c, summary: c.summary ?? "", linkPath: c.linkPath ?? "", imageId: "" }).success).toBe(true);
    }
    for (const b of defaultBrands) {
      expect(brandSchema.safeParse({ ...b, description: "", websiteUrl: "", logoId: "" }).success).toBe(true);
    }
    for (const s of defaultServices) expect(serviceSchema.safeParse(s).success).toBe(true);
    for (const f of defaultFaqs) expect(faqSchema.safeParse(f).success).toBe(true);
  });

  it("les univers renvoient vers des pages existantes", () => {
    const paths = PUBLIC_PAGES.map((p) => p.path) as string[];
    for (const c of defaultCategories) if (c.linkPath) expect(paths).toContain(c.linkPath);
  });
});
