import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout sur le build de production (npm run build au préalable).
const PORT = Number(process.env.E2E_PORT ?? 3200);

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "ordinateur", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
