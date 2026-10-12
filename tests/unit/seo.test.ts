import { describe, expect, it } from "vitest";
import { defaultSettings } from "@/content/defaults";
import { buildLocalBusinessJsonLd, serializeJsonLd } from "@/lib/seo";

describe("données structurées", () => {
  it("ne publient que les informations renseignées", () => {
    const data = buildLocalBusinessJsonLd(defaultSettings);
    expect(data["@type"]).toBe("ClothingStore");
    expect(data).not.toHaveProperty("address");
    expect(data).not.toHaveProperty("telephone");
    expect(data).not.toHaveProperty("aggregateRating");
    expect(data).not.toHaveProperty("openingHoursSpecification");
  });

  it("ajoutent adresse, horaires et coordonnées une fois saisis", () => {
    const data = buildLocalBusinessJsonLd({
      ...defaultSettings,
      streetAddress: "1 rue X",
      postalCode: "12345",
      city: "Ville",
      phone: "01 23 45 67 89",
      latitude: 47.1,
      longitude: 2.2,
      openingHours: [{ day: "monday", periods: [{ opens: "09:00", closes: "12:00" }] }],
    });
    expect(data.address).toMatchObject({ addressLocality: "Ville", postalCode: "12345" });
    expect(data.geo).toMatchObject({ latitude: 47.1 });
    expect(data.openingHoursSpecification).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Monday", opens: "09:00", closes: "12:00" },
    ]);
  });

  it("échappent le contenu pour la balise script", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});
