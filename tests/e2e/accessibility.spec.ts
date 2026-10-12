import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Contrôle automatique WCAG 2.2 A/AA (axe-core). Il ne remplace pas un audit
// manuel (lecteur d'écran, zoom 200 %), mais détecte les erreurs courantes.

const PATHS = ["/", "/lingerie-femme", "/lingerie-homme", "/nuit-homewear-bain", "/marques", "/conseil", "/histoire", "/contact", "/mentions-legales", "/confidentialite", "/admin/connexion"];

for (const path of PATHS) {
  test(`accessibilité ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
    expect(summary).toEqual([]);
  });
}
