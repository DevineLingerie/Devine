import { expect, test } from "@playwright/test";

// Les animations ne doivent jamais empêcher de lire le site.

test.describe("sans JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("tout le contenu de l'accueil reste visible", async ({ page }) => {
    await page.goto("/");
    const masques = await page.locator(".reveal").evaluateAll((elements) =>
      elements.filter((element) => Number(getComputedStyle(element).opacity) < 1).length,
    );
    expect(masques).toBe(0);
    await expect(page.getByRole("heading", { name: "Trouvez votre taille" })).toBeVisible();
  });
});

test.describe("avec « réduire les animations »", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  test("aucun masquage ni défilement automatique", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await page.locator("html").getAttribute("data-motion")).toBeNull();
    const animation = await page.locator(".bandeau-piste").first().evaluate((element) => getComputedStyle(element).animationName);
    expect(animation).toBe("none");
  });
});

test("les éléments se révèlent au défilement", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "on");
  const titre = page.locator("#infos-pratiques");
  await titre.scrollIntoViewIfNeeded();
  await expect(titre).toHaveAttribute("data-visible", "true");
});
