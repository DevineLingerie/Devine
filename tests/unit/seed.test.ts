import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildSeedSql, SEED_MIGRATION_PATH } from "../../scripts/seed-sql.mts";

describe("migration des données initiales", () => {
  it("est à jour avec src/content/defaults.ts (sinon : npm run db:seed:generate)", () => {
    expect(readFileSync(SEED_MIGRATION_PATH, "utf8")).toBe(buildSeedSql());
  });
});
