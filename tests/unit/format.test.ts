import { describe, expect, it } from "vitest";
import { defaultSettings } from "@/content/defaults";
import { formatOpeningHours, formatTime, getDirectionsUrl, parseTextBlocks, toTelHref } from "@/lib/content/format";

describe("mise en forme", () => {
  it("formate les heures à la française", () => {
    expect(formatTime("09:30")).toBe("9 h 30");
    expect(formatTime("14:00")).toBe("14 h");
  });

  it("affiche une semaine complète, jours sans créneau fermés", () => {
    const lines = formatOpeningHours([
      { day: "tuesday", periods: [{ opens: "09:30", closes: "12:30" }, { opens: "14:00", closes: "19:00" }] },
    ]);
    expect(lines).toHaveLength(7);
    expect(lines[0]).toMatchObject({ label: "Lundi", value: "Fermé", isClosed: true });
    expect(lines[1].value).toBe("9 h 30 – 12 h 30, 14 h – 19 h");
  });

  it("n'affiche rien si aucun horaire n'est renseigné", () => {
    expect(formatOpeningHours([])).toEqual([]);
  });

  it("produit des liens tel: internationaux", () => {
    expect(toTelHref("01 23 45 67 89")).toBe("tel:+33123456789");
    expect(toTelHref("+33 6 12 34 56 78")).toBe("tel:+33612345678");
  });

  it("ne propose pas d'itinéraire sans adresse", () => {
    expect(getDirectionsUrl(defaultSettings)).toBeNull();
    const url = getDirectionsUrl({ ...defaultSettings, streetAddress: "1 rue X", postalCode: "12345", city: "Ville" });
    expect(url).toContain("google.com/maps/dir");
  });

  it("découpe paragraphes et listes sans interpréter de HTML", () => {
    expect(parseTextBlocks("Intro\n\n- un\n- deux\nSuite <script>")).toEqual([
      { type: "paragraph", text: "Intro" },
      { type: "list", items: ["un", "deux"] },
      { type: "paragraph", text: "Suite <script>" },
    ]);
  });
});
