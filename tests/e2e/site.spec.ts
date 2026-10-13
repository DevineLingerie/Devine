import { expect, test } from "@playwright/test";

const PAGES = [
  { path: "/", h1: /lingerie qui vous va/i },
  { path: "/lingerie-femme", h1: "Lingerie femme" },
  { path: "/lingerie-homme", h1: "Lingerie homme" },
  { path: "/nuit-homewear-bain", h1: "Nuit, homewear et bain" },
  { path: "/marques", h1: "Nos marques" },
  { path: "/conseil", h1: /Le conseil/ },
  { path: "/histoire", h1: "Depuis 1912" },
  { path: "/contact", h1: /Nous trouver/ },
  { path: "/mentions-legales", h1: "Mentions légales" },
  { path: "/confidentialite", h1: "Politique de confidentialité" },
];

for (const { path, h1 } of PAGES) {
  test(`${path} : contenu, SEO et absence d'erreur`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText(h1);
    await expect(page).toHaveTitle(/.{10,}/);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length ?? 0).toBeGreaterThan(30);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", path === "/" ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${path}$`));
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");

    const width = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(width, "pas de défilement horizontal").toBeLessThanOrEqual(0);

    expect(errors).toEqual([]);
  });
}

test("les titres et descriptions sont uniques", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const { path } of PAGES) {
    await page.goto(path);
    titles.add(await page.title());
    descriptions.add((await page.locator('meta[name="description"]').getAttribute("content")) ?? "");
  }
  expect(titles.size).toBe(PAGES.length);
  expect(descriptions.size).toBe(PAGES.length);
});

test("les données structurées du commerce n'inventent rien", async ({ page }) => {
  await page.goto("/");
  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(json ?? "{}");
  expect(data["@type"]).toBe("ClothingStore");
  expect(data.name).toBe("DEVINE");
  expect(data.aggregateRating).toBeUndefined();
  expect(data.review).toBeUndefined();
});

test("une page inconnue renvoie une vraie 404", async ({ page }) => {
  const response = await page.goto("/cette-page-nexiste-pas");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("éclipsée");
  await expect(page.getByRole("link", { name: /Retour à l'accueil/ })).toBeVisible();
});

test("sitemap et robots.txt", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const { path } of PAGES) expect(sitemap).toContain(`<loc>http://localhost:3000${path === "/" ? "/" : path}</loc>`);
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /admin");
  expect(robots).toContain("Sitemap:");
});

test("en-têtes de sécurité", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("le lien d'évitement mène au contenu", async ({ page, isMobile }) => {
  test.skip(isMobile, "navigation clavier testée sur ordinateur");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Aller au contenu" });
  await expect(skip).toBeFocused();
  await skip.press("Enter");
  await expect(page).toHaveURL(/#contenu$/);
});

test("les univers femme et homme sont accessibles depuis l'accueil", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Découvrir la lingerie homme/ }).click();
  await expect(page).toHaveURL(/\/lingerie-homme$/);
  await page.goto("/");
  await page.getByRole("link", { name: /Explorer la lingerie femme/ }).click();
  await expect(page).toHaveURL(/\/lingerie-femme$/);
});

test("navigation mobile", async ({ page, isMobile }) => {
  test.skip(!isMobile, "menu propre au mobile");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Menu" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(page.getByRole("button", { name: "Fermer" })).toHaveAttribute("aria-expanded", "true");
  const nav = page.getByRole("navigation", { name: "Navigation principale" });
  await nav.getByRole("link", { name: "Homme" }).click();
  await expect(page).toHaveURL(/\/lingerie-homme$/);
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
  // Échap ferme le menu
  await page.getByRole("button", { name: "Menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
});

test("navigation principale sur ordinateur", async ({ page, isMobile }) => {
  test.skip(isMobile, "menu ordinateur");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Navigation principale" });
  await nav.getByRole("link", { name: "Le conseil" }).click();
  await expect(page).toHaveURL(/\/conseil$/);
  await expect(nav.getByRole("link", { name: "Le conseil" })).toHaveAttribute("aria-current", "page");
});

test("questions fréquentes dépliables au clavier", async ({ page }) => {
  await page.goto("/conseil");
  const question = page.getByText("Comment savoir quelle est ma taille ?");
  await question.click();
  await expect(page.getByText(/La taille indiquée sur une étiquette/)).toBeVisible();
});

test("l'outil « Trouvez votre taille » donne une estimation", async ({ page }) => {
  await page.goto("/#taille");
  await page.getByLabel("Tour de dessous de poitrine").fill("75");
  await page.getByLabel("Tour de poitrine").fill("94");
  await page.getByRole("button", { name: "Estimer ma taille" }).click();
  await expect(page.getByText("90 D", { exact: true })).toBeVisible();
  await page.getByLabel("Tour de poitrine").fill("70");
  await page.getByRole("button", { name: "Estimer ma taille" }).click();
  await expect(page.getByText(/doit être plus grand/)).toBeVisible();
});
