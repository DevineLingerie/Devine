// Estimation indicative d'une taille de soutien-gorge à partir de deux mesures.
// Méthode usuelle européenne : le tour de dessous de poitrine donne le tour de
// dos (par paliers de 5 cm), la différence avec le tour de poitrine donne le
// bonnet (par paliers de 2 cm, bonnet A autour de 13 cm). Les tailles françaises
// ajoutent 15 au tour de dos européen (75 européen = 90 français).
// Les marques taillent différemment : l'essayage reste indispensable.

export const CUPS = ["AA", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"] as const;
export type Cup = (typeof CUPS)[number];

export const MEASURE_LIMITS = {
  underbust: { min: 55, max: 130 },
  bust: { min: 60, max: 180 },
} as const;

export type SizeEstimate =
  | { status: "ok"; bandEu: number; bandFr: number; cup: Cup }
  | { status: "hors-tableau"; bandEu: number; bandFr: number; reason: "petit-bonnet" | "grand-bonnet" }
  | { status: "erreur"; message: string };

export function estimateBraSize(underbust: number, bust: number): SizeEstimate {
  const { underbust: u, bust: b } = MEASURE_LIMITS;
  if (!Number.isFinite(underbust) || underbust < u.min || underbust > u.max) {
    return { status: "erreur", message: `Le tour de dessous de poitrine doit être compris entre ${u.min} et ${u.max} cm.` };
  }
  if (!Number.isFinite(bust) || bust < b.min || bust > b.max) {
    return { status: "erreur", message: `Le tour de poitrine doit être compris entre ${b.min} et ${b.max} cm.` };
  }
  if (bust <= underbust) {
    return { status: "erreur", message: "Le tour de poitrine doit être plus grand que le tour de dessous de poitrine." };
  }

  const bandEu = Math.round(underbust / 5) * 5;
  const bandFr = bandEu + 15;
  const cupIndex = Math.round((bust - underbust - 13) / 2) + 1;

  if (cupIndex < 0) return { status: "hors-tableau", bandEu, bandFr, reason: "petit-bonnet" };
  if (cupIndex >= CUPS.length) return { status: "hors-tableau", bandEu, bandFr, reason: "grand-bonnet" };
  return { status: "ok", bandEu, bandFr, cup: CUPS[cupIndex] };
}
