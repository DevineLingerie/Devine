import { expect, test } from "@playwright/test";

// Ces tests tournent sans Supabase configuré : ils vérifient que le site le
// dit clairement au lieu de simuler un envoi ou une connexion.

test("sans Supabase, le formulaire de contact annonce son indisponibilité", async ({ page }) => {
  test.skip(Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), "Supabase configuré");
  await page.goto("/contact");
  await expect(page.getByText(/formulaire en ligne sera bientôt disponible/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Envoyer mon message" })).toHaveCount(0);
});

test("l'administration redirige vers la connexion", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/connexion$/);
  await expect(page.locator("h1")).toHaveText("Connexion");
});

test("les pages d'administration ne sont pas accessibles sans session", async ({ page }) => {
  for (const path of ["/admin/reglages", "/admin/demandes", "/admin/marques", "/admin/pages/accueil", "/admin/medias"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin\/connexion$/);
  }
});

test("la connexion signale l'absence de configuration Supabase", async ({ page }) => {
  test.skip(Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), "Supabase configuré");
  await page.goto("/admin/connexion");
  await expect(page.getByText(/Supabase n'est pas encore configuré/)).toBeVisible();
});

test("l'administration n'est pas indexée", async ({ page }) => {
  await page.goto("/admin/connexion");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
