import { describe, expect, it } from "vitest";
import { defaultSettings } from "@/content/defaults";
import { buildLaunchChecklist } from "@/lib/admin/checklist";
import { parseCollectionForm } from "@/lib/admin/collections";
import { buildStoragePath, checkImage, detectImageType, slugifyFileName } from "@/lib/admin/media";
import { parsePageForm } from "@/lib/admin/page-form";
import { parseSettingsForm } from "@/lib/admin/settings-form";

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
}

describe("formulaire des réglages", () => {
  it("construit les horaires de la semaine", () => {
    const result = parseSettingsForm(
      form({ shopName: "DEVINE", "hours.tuesday.0.opens": "09:30", "hours.tuesday.0.closes": "12:30", phone: "01 23 45 67 89" }),
    );
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.openingHours).toHaveLength(7);
    expect(result.data.openingHours.find((d) => d.day === "tuesday")?.periods).toEqual([{ opens: "09:30", closes: "12:30" }]);
    expect(result.data.phone).toBe("01 23 45 67 89");
  });

  it("laisse les horaires vides si rien n'est saisi", () => {
    const result = parseSettingsForm(form({ shopName: "DEVINE" }));
    expect(result.success && result.data.openingHours).toEqual([]);
  });

  it("signale un créneau incomplet ou inversé sur le bon champ", () => {
    const missing = parseSettingsForm(form({ shopName: "DEVINE", "hours.monday.0.opens": "09:00" }));
    expect(!missing.success && missing.fieldErrors["hours.monday.0.closes"]).toBeTruthy();
    const reversed = parseSettingsForm(form({ shopName: "DEVINE", "hours.friday.1.opens": "19:00", "hours.friday.1.closes": "14:00" }));
    expect(!reversed.success && reversed.fieldErrors["hours.friday.1.closes"]).toMatch(/fermeture/);
  });

  it("refuse un SIRET, un code postal ou un lien social invalides", () => {
    const result = parseSettingsForm(form({ shopName: "DEVINE", siret: "123", postalCode: "ABC", "social.instagram": "http://insta" }));
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(result.fieldErrors)).toEqual(expect.arrayContaining(["siret", "postalCode", "social.instagram"]));
  });

  it("n'interprète pas une coordonnée vide comme 0", () => {
    const result = parseSettingsForm(form({ shopName: "DEVINE", latitude: "", longitude: "" }));
    expect(result.success && result.data.latitude).toBeNull();
  });
});

describe("formulaire de page", () => {
  it("ne garde que les sections prévues par le code", () => {
    const result = parsePageForm(
      form({
        title: "Titre",
        description: "Description",
        heading: "H1",
        "sections.conseil.heading": "Conseil",
        "sections.conseil.body": "Texte",
        "sections.intrus.heading": "Intrus",
      }),
      "accueil",
      ["conseil"],
    );
    expect(result.success).toBe(true);
    if (result.success) expect(result.row.sections).toEqual([{ key: "conseil", heading: "Conseil", body: "Texte" }]);
  });

  it("rattache l'erreur au champ de la section", () => {
    const result = parsePageForm(form({ title: "T", description: "D", heading: "H", "sections.conseil.heading": "" }), "accueil", ["conseil"]);
    expect(!result.success && result.fieldErrors["sections.conseil.heading"]).toBeTruthy();
  });

  it("refuse un titre SEO trop long", () => {
    const result = parsePageForm(form({ title: "x".repeat(71), description: "D", heading: "H" }), "accueil", []);
    expect(!result.success && result.fieldErrors.title).toBeTruthy();
  });
});

describe("formulaires de collections", () => {
  it("convertit une marque vers les colonnes de la base", () => {
    const result = parseCollectionForm("marques", form({ name: "Elomi", slug: "elomi", sortOrder: "40", isPublished: "on", websiteUrl: "" }));
    expect(result).toEqual({
      success: true,
      row: { name: "Elomi", slug: "elomi", description: null, website_url: null, logo_id: null, sort_order: 40, is_published: true },
    });
  });

  it("refuse un identifiant mal formé", () => {
    const result = parseCollectionForm("categories", form({ name: "Bain", slug: "Bain Été", audience: "mixte", sortOrder: "1" }));
    expect(!result.success && result.fieldErrors.slug).toBeTruthy();
  });

  it("refuse un public inconnu", () => {
    const result = parseCollectionForm("categories", form({ name: "Bain", slug: "bain", audience: "enfant", sortOrder: "1" }));
    expect(!result.success && result.fieldErrors.audience).toBeTruthy();
  });
});

describe("images", () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const html = new TextEncoder().encode("<html><script>");

  it("reconnaît le vrai format d'après le contenu", () => {
    expect(detectImageType(jpeg)).toBe("image/jpeg");
    expect(detectImageType(png)).toBe("image/png");
    expect(detectImageType(html)).toBeNull();
  });

  it("refuse les fichiers trop lourds ou d'un autre format", () => {
    expect(checkImage(6 * 1024 * 1024, jpeg).ok).toBe(false);
    expect(checkImage(1000, html).ok).toBe(false);
    expect(checkImage(1000, jpeg)).toEqual({ ok: true, type: "image/jpeg" });
  });

  it("produit des noms de fichiers propres", () => {
    expect(slugifyFileName("Comptoir de la Boutique (été).JPG")).toBe("comptoir-de-la-boutique-ete");
    expect(slugifyFileName("../../etc/passwd")).toBe("passwd");
    expect(buildStoragePath("Vitrine.png", "image/png", new Date("2026-10-12"), "a1b2c3")).toBe("2026/10/vitrine-a1b2c3.png");
  });
});

describe("liste de contrôle avant mise en ligne", () => {
  it("signale toutes les informations manquantes au départ", () => {
    const items = buildLaunchChecklist(defaultSettings);
    expect(items.every((item) => !item.done)).toBe(true);
  });
});
