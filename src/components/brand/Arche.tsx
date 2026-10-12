// Illustration originale, non photographique : une arche (les courbes du
// lieu), le bois clair des placards, des formes organiques et le rail
// d'éclairage du plafond. Elle tient la place des photographies de la
// boutique tant qu'elles ne sont pas ajoutées depuis l'administration.

type Variant = "accueil" | "femme" | "homme" | "nuit" | "histoire" | "conseil";

const PALETTES: Record<Variant, { fond: string; arche: string; vegetal: string; trait: string }> = {
  accueil: { fond: "var(--color-bois)", arche: "var(--color-sable)", vegetal: "var(--color-sauge)", trait: "var(--color-argile)" },
  femme: { fond: "var(--color-sable)", arche: "var(--color-bois)", vegetal: "var(--color-argile)", trait: "var(--color-nuit)" },
  homme: { fond: "var(--color-nuit-doux)", arche: "var(--color-bois)", vegetal: "var(--color-sauge-clair)", trait: "var(--color-argile-clair)" },
  nuit: { fond: "var(--color-nuit)", arche: "var(--color-sauge)", vegetal: "var(--color-sable)", trait: "var(--color-bois)" },
  histoire: { fond: "var(--color-bois-fonce)", arche: "var(--color-sable)", vegetal: "var(--color-bois)", trait: "var(--color-nuit)" },
  conseil: { fond: "var(--color-sauge-pale)", arche: "var(--color-lin)", vegetal: "var(--color-sauge)", trait: "var(--color-argile)" },
};

export function Arche({ variant = "accueil", className = "" }: { variant?: Variant; className?: string }) {
  const p = PALETTES[variant];
  return (
    <svg viewBox="0 0 400 520" aria-hidden="true" focusable="false" className={className} preserveAspectRatio="xMidYMid slice">
      <path d="M0 520V200a200 200 0 0 1 400 0v320Z" fill={p.fond} />
      <path d="M48 520V214a152 152 0 0 1 304 0v306Z" fill={p.arche} />
      {/* Rail d'éclairage */}
      <path d="M118 128h164" stroke={p.trait} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="150" cy="140" r="7" fill={p.trait} opacity="0.8" />
      <circle cx="200" cy="140" r="7" fill={p.trait} opacity="0.8" />
      <circle cx="250" cy="140" r="7" fill={p.trait} opacity="0.8" />
      {/* Formes organiques abstraites (galets) */}
      <path d="M96 520c-8-64 30-112 92-120 66-8 112 34 116 120Z" fill={p.vegetal} />
      <path d="M232 520c0-40 26-66 62-66s58 28 58 66Z" fill={p.vegetal} opacity="0.55" />
      {/* Courbe du comptoir */}
      <path
        d="M48 430c60-28 120-30 176-6s88 22 128-4"
        fill="none"
        stroke={p.trait}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
