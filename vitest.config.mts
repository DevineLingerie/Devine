import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const alias = {
  "@": fileURLToPath(new URL("./src", import.meta.url)),
  // Le paquet « server-only » n'a de sens que dans Next.js.
  "server-only": fileURLToPath(new URL("./tests/support/empty.ts", import.meta.url)),
};

export default defineConfig({
  test: {
    projects: [
      { resolve: { alias }, test: { name: "unit", include: ["tests/unit/**/*.test.ts"], environment: "node" } },
      { resolve: { alias }, test: { name: "db", include: ["tests/db/**/*.test.ts"], environment: "node", fileParallelism: false } },
    ],
  },
});
