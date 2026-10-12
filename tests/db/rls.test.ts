import { randomUUID } from "node:crypto";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Tests des permissions sur un PostgreSQL local préparé par scripts/test-db.sh
// (stub des rôles Supabase + migrations du dépôt). Trois profils :
// visiteur anonyme, compte connecté non administrateur, administrateur.

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL manquant : lancez `npm run test:db`.");

const db = new pg.Client({ connectionString: url });
const adminId = randomUUID();
const userId = randomUUID();

type Profile = { role: "anon" | "authenticated"; sub?: string };
const anon: Profile = { role: "anon" };
const user: Profile = { role: "authenticated", sub: userId };
const admin: Profile = { role: "authenticated", sub: adminId };

/** Exécute une requête avec un profil, dans une transaction annulée. */
async function as<T extends pg.QueryResultRow>(profile: Profile, sql: string, params: unknown[] = []) {
  await db.query("begin");
  try {
    await db.query(`set local role ${profile.role}`);
    await db.query("select set_config('request.jwt.claim.sub', $1, true)", [profile.sub ?? ""]);
    return await db.query<T>(sql, params);
  } finally {
    await db.query("rollback");
  }
}

async function expectDenied(profile: Profile, sql: string, params: unknown[] = []) {
  await expect(as(profile, sql, params)).rejects.toThrow(/permission denied|row-level security/);
}

beforeAll(async () => {
  await db.connect();
  await db.query("insert into auth.users (id, email) values ($1, 'gerante@example.test'), ($2, 'visiteur@example.test')", [adminId, userId]);
  await db.query("insert into public.admin_users (user_id) values ($1)", [adminId]);
  await db.query(
    "insert into public.pages (slug, title, description, heading, is_published) values ('brouillon-test', 'Brouillon', 'Brouillon', 'Brouillon', false)",
  );
  await db.query(
    "insert into public.contact_requests (email, subject, message, consent_at, privacy_version) values ('client@example.test', 'conseil', 'Bonjour, une question sur les tailles.', now(), 'test')",
  );
});

afterAll(async () => {
  await db.end();
});

describe("données initiales", () => {
  it("contiennent les pages, univers, marques et services attendus", async () => {
    const { rows } = await db.query(
      "select (select count(*) from pages where slug <> 'brouillon-test')::int as pages, (select count(*) from categories)::int as categories, (select count(*) from brands)::int as brands, (select count(*) from faqs)::int as faqs",
    );
    expect(rows[0]).toEqual({ pages: 10, categories: 6, brands: 5, faqs: 6 });
  });

  it("n'inventent ni adresse, ni téléphone, ni mentions légales", async () => {
    const { rows } = await db.query("select street_address, phone, email, siret, legal_name from site_settings where id = 1");
    expect(rows[0]).toEqual({ street_address: null, phone: null, email: null, siret: null, legal_name: null });
  });

  it("laissent les commandes particulières non publiées", async () => {
    const { rows } = await db.query("select is_published from services where slug = 'commandes-particulieres'");
    expect(rows[0].is_published).toBe(false);
  });
});

describe("visiteur anonyme", () => {
  it("lit les pages publiées mais pas les brouillons", async () => {
    const { rows } = await as(anon, "select slug from pages");
    const slugs = rows.map((row) => row.slug);
    expect(slugs).toContain("accueil");
    expect(slugs).not.toContain("brouillon-test");
  });

  it("ne voit pas les services non publiés", async () => {
    const { rows } = await as(anon, "select slug from services");
    expect(rows.map((row) => row.slug)).not.toContain("commandes-particulieres");
  });

  it("lit les réglages publics", async () => {
    const { rows } = await as(anon, "select shop_name from site_settings");
    expect(rows[0].shop_name).toBe("DEVINE");
  });

  it("ne peut ni lire ni créer de demande de contact", async () => {
    await expectDenied(anon, "select * from contact_requests");
    await expectDenied(
      anon,
      "insert into contact_requests (email, subject, message, consent_at, privacy_version) values ('a@b.fr', 'autre', 'Message de test anonyme', now(), 'x')",
    );
  });

  it("ne peut modifier aucun contenu", async () => {
    await expectDenied(anon, "update pages set heading = 'Piraté' where slug = 'accueil'");
    await expectDenied(anon, "insert into brands (slug, name) values ('pirate', 'Pirate')");
    await expectDenied(anon, "update site_settings set phone = '0000000000'");
  });

  it("ne voit pas la liste des administrateurs", async () => {
    await expectDenied(anon, "select * from admin_users");
  });

  it("n'est pas administrateur", async () => {
    const { rows } = await as(anon, "select public.is_admin() as admin");
    expect(rows[0].admin).toBe(false);
  });
});

describe("compte connecté non administrateur", () => {
  it("n'est pas administrateur", async () => {
    const { rows } = await as(user, "select public.is_admin() as admin");
    expect(rows[0].admin).toBe(false);
  });

  it("ne voit ni les brouillons ni les demandes de contact", async () => {
    const pages = await as(user, "select slug from pages where slug = 'brouillon-test'");
    expect(pages.rowCount).toBe(0);
    const requests = await as(user, "select * from contact_requests");
    expect(requests.rowCount).toBe(0);
  });

  it("ne peut modifier aucun contenu", async () => {
    const update = await as(user, "update pages set heading = 'Piraté' where slug = 'accueil'");
    expect(update.rowCount).toBe(0);
    const settings = await as(user, "update site_settings set phone = '0000000000'");
    expect(settings.rowCount).toBe(0);
    await expectDenied(user, "insert into brands (slug, name) values ('pirate', 'Pirate')");
    const remove = await as(user, "delete from faqs");
    expect(remove.rowCount).toBe(0);
  });

  it("ne peut pas se déclarer administrateur", async () => {
    await expectDenied(user, "insert into admin_users (user_id) values ($1)", [userId]);
  });

  it("ne peut pas envoyer d'image", async () => {
    await expectDenied(user, "insert into storage.objects (bucket_id, name) values ('site-images', 'pirate.jpg')");
  });

  it("ne peut pas lancer la purge des demandes", async () => {
    await expectDenied(user, "select public.purge_contact_requests()");
  });
});

describe("administrateur", () => {
  it("est reconnu comme administrateur", async () => {
    const { rows } = await as(admin, "select public.is_admin() as admin");
    expect(rows[0].admin).toBe(true);
  });

  it("voit les brouillons et les demandes de contact", async () => {
    const pages = await as(admin, "select slug from pages where slug = 'brouillon-test'");
    expect(pages.rowCount).toBe(1);
    const requests = await as(admin, "select email from contact_requests");
    expect(requests.rows.map((row) => row.email)).toContain("client@example.test");
  });

  it("modifie les contenus et les réglages", async () => {
    const update = await as(admin, "update pages set heading = 'Nouveau titre' where slug = 'accueil'");
    expect(update.rowCount).toBe(1);
    const settings = await as(admin, "update site_settings set phone = '01 23 45 67 89'");
    expect(settings.rowCount).toBe(1);
    const brand = await as(admin, "insert into brands (slug, name, is_published) values ('nouvelle-marque', 'Nouvelle marque', true)");
    expect(brand.rowCount).toBe(1);
  });

  it("suit et supprime les demandes de contact", async () => {
    const update = await as(admin, "update contact_requests set status = 'traite'");
    expect(update.rowCount).toBe(1);
    const remove = await as(admin, "delete from contact_requests");
    expect(remove.rowCount).toBe(1);
  });

  it("envoie des images dans le bucket du site uniquement", async () => {
    const upload = await as(admin, "insert into storage.objects (bucket_id, name) values ('site-images', '2026/10/comptoir.jpg')");
    expect(upload.rowCount).toBe(1);
  });

  it("ne peut pas créer d'autres administrateurs depuis le site", async () => {
    await expectDenied(admin, "insert into admin_users (user_id) values ($1)", [userId]);
  });
});

describe("contraintes", () => {
  it("refusent une demande sans moyen de réponse", async () => {
    await expect(
      db.query("insert into contact_requests (subject, message, consent_at, privacy_version) values ('autre', 'Un message assez long', now(), 'x')"),
    ).rejects.toThrow(/contact_requests_reply_channel/);
  });

  it("refusent un SIRET mal formé", async () => {
    await expect(db.query("update site_settings set siret = '123'")).rejects.toThrow(/check constraint/);
  });

  it("refusent un chemin d'image dangereux", async () => {
    await expect(db.query("insert into media (path) values ('../secret.jpg')")).rejects.toThrow(/check constraint/);
  });

  it("le bucket d'images limite formats et taille", async () => {
    const { rows } = await db.query("select public, file_size_limit, allowed_mime_types from storage.buckets where id = 'site-images'");
    expect(rows[0]).toEqual({
      public: true,
      file_size_limit: "5242880",
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    });
  });
});
