// Génère la migration des données initiales à partir de src/content/defaults.ts.
// Usage : npm run db:seed:generate
// Un test (tests/unit/seed.test.ts) vérifie que le fichier versionné est à jour.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildSeedSql, SEED_MIGRATION_PATH } from "./seed-sql.mts";

const target = fileURLToPath(new URL(`../${SEED_MIGRATION_PATH}`, import.meta.url));
writeFileSync(target, buildSeedSql());
console.log(`Migration écrite : ${SEED_MIGRATION_PATH}`);
