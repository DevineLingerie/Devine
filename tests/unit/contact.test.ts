import { describe, expect, it, vi } from "vitest";
import { processContactSubmission, RATE_LIMIT, type ContactStore } from "@/lib/contact/submit";
import { contactFormSchema, isSubmittedTooFast, type RawContactForm } from "@/lib/validation/contact";

const NOW = Date.parse("2026-10-12T10:00:00Z");

function raw(overrides: Partial<RawContactForm> = {}): RawContactForm {
  return {
    name: "Camille",
    email: "camille@example.fr",
    phone: "",
    subject: "conseil",
    message: "Bonjour, je cherche un soutien-gorge en 85F.",
    consent: "on",
    website: "",
    startedAt: String(NOW - 60_000),
    ...overrides,
  };
}

function memoryStore(counts: { ip?: number; total?: number } = {}) {
  const inserted: unknown[] = [];
  const store: ContactStore = {
    countSince: vi.fn(async (_since: string, ipHash?: string) => (ipHash ? (counts.ip ?? 0) : (counts.total ?? 0))),
    insert: vi.fn(async (row) => {
      inserted.push(row);
    }),
  };
  return { store, inserted };
}

const ipHash = "a".repeat(64);

describe("validation du formulaire de contact", () => {
  it("accepte une demande complète", () => {
    expect(contactFormSchema.safeParse(raw()).success).toBe(true);
  });

  it("exige un e-mail ou un téléphone", () => {
    const result = contactFormSchema.safeParse(raw({ email: "", phone: "" }));
    expect(result.success).toBe(false);
  });

  it("accepte un téléphone seul", () => {
    expect(contactFormSchema.safeParse(raw({ email: "", phone: "06 12 34 56 78" })).success).toBe(true);
  });

  it("refuse un e-mail invalide, un message trop court et l'absence de consentement", () => {
    const result = contactFormSchema.safeParse(raw({ email: "pas-un-email", message: "court", consent: "" }));
    expect(result.success).toBe(false);
    const fields = result.error?.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["email", "message", "consent"]));
  });

  it("refuse un sujet inconnu", () => {
    expect(contactFormSchema.safeParse(raw({ subject: "piratage" })).success).toBe(false);
  });

  it("nettoie les espaces et transforme les champs vides en null", () => {
    const result = contactFormSchema.parse(raw({ name: "   ", phone: "  " }));
    expect(result.name).toBeNull();
    expect(result.phone).toBeNull();
  });
});

describe("délai minimal de saisie", () => {
  it("détecte un envoi immédiat", () => {
    expect(isSubmittedTooFast(raw({ startedAt: String(NOW - 500) }), NOW)).toBe(true);
  });
  it("ne bloque pas sans horodatage (JavaScript désactivé)", () => {
    expect(isSubmittedTooFast(raw({ startedAt: "" }), NOW)).toBe(false);
  });
});

describe("traitement d'une demande", () => {
  it("enregistre une demande valide avec le consentement horodaté", async () => {
    const { store, inserted } = memoryStore();
    const state = await processContactSubmission(raw(), { store, ipHash, now: NOW });
    expect(state.status).toBe("success");
    expect(inserted).toHaveLength(1);
    expect(inserted[0]).toMatchObject({
      email: "camille@example.fr",
      subject: "conseil",
      consent_at: new Date(NOW).toISOString(),
      ip_hash: ipHash,
    });
  });

  it("ignore silencieusement le champ piège rempli", async () => {
    const { store, inserted } = memoryStore();
    const state = await processContactSubmission(raw({ website: "https://spam.example" }), { store, ipHash, now: NOW });
    expect(state.status).toBe("success");
    expect(inserted).toHaveLength(0);
  });

  it("renvoie les erreurs par champ et la saisie", async () => {
    const { store, inserted } = memoryStore();
    const state = await processContactSubmission(raw({ email: "", phone: "" }), { store, ipHash, now: NOW });
    expect(state.status).toBe("error");
    if (state.status !== "error") return;
    expect(state.fieldErrors.email).toMatch(/e-mail ou un numéro/);
    expect(state.values.message).toContain("85F");
    expect(inserted).toHaveLength(0);
  });

  it("limite les envois répétés depuis une même adresse", async () => {
    const { store, inserted } = memoryStore({ ip: RATE_LIMIT.perIp });
    const state = await processContactSubmission(raw(), { store, ipHash, now: NOW });
    expect(state.status).toBe("error");
    expect(inserted).toHaveLength(0);
  });

  it("limite le volume global", async () => {
    const { store } = memoryStore({ total: RATE_LIMIT.global });
    const state = await processContactSubmission(raw(), { store, ipHash, now: NOW });
    expect(state.status).toBe("error");
  });

  it("indique clairement que le formulaire est indisponible sans Supabase", async () => {
    const state = await processContactSubmission(raw(), { store: null, ipHash: null, now: NOW });
    expect(state.status).toBe("error");
    if (state.status === "error") expect(state.message).toMatch(/pas disponible/);
  });

  it("ne divulgue pas l'erreur technique", async () => {
    const store: ContactStore = {
      countSince: async () => 0,
      insert: async () => {
        throw new Error("duplicate key value violates unique constraint secret_internal");
      },
    };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const state = await processContactSubmission(raw(), { store, ipHash, now: NOW });
    spy.mockRestore();
    expect(state.status).toBe("error");
    if (state.status === "error") expect(state.message).not.toMatch(/secret_internal|duplicate/);
  });
});
