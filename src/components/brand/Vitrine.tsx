import { useId } from "react";

// Illustration originale, non photographique : la boutique vue comme une
// vitrine en arche. Plafond sombre, rail d'éclairage et ses faisceaux, comptoir
// aux formes courbes, trame de tulle. Elle tient la place des photographies
// tant qu'elles ne sont pas ajoutées depuis l'administration.

export type VitrineVariant = "accueil" | "femme" | "homme" | "nuit" | "histoire" | "conseil";

const PALETTES: Record<VitrineVariant, { fond: string; plafond: string; comptoir: string; rail: string }> = {
  accueil: { fond: "var(--color-nude)", plafond: "var(--color-nuit)", comptoir: "var(--color-bois)", rail: "var(--color-bois)" },
  femme: { fond: "var(--color-sable)", plafond: "var(--color-argile)", comptoir: "var(--color-nude)", rail: "var(--color-argile-clair)" },
  homme: { fond: "var(--color-sauge-pale)", plafond: "var(--color-sauge)", comptoir: "var(--color-sauge-clair)", rail: "var(--color-argile-clair)" },
  nuit: { fond: "var(--color-nuit-doux)", plafond: "var(--color-nuit)", comptoir: "var(--color-sauge)", rail: "var(--color-bois)" },
  histoire: { fond: "var(--color-sable)", plafond: "var(--color-bois-fonce)", comptoir: "var(--color-bois)", rail: "var(--color-argile-clair)" },
  conseil: { fond: "var(--color-sauge-pale)", plafond: "var(--color-nuit)", comptoir: "var(--color-nude)", rail: "var(--color-bois)" },
};

const ARCH = "M0 520V200a200 200 0 0 1 400 0v320Z";
const SPOTS = [140, 200, 260];

export function Vitrine({ variant = "accueil", className = "" }: { variant?: VitrineVariant; className?: string }) {
  const id = useId().replace(/:/g, "");
  const p = PALETTES[variant];
  return (
    <svg viewBox="0 0 400 520" aria-hidden="true" focusable="false" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <clipPath id={`${id}-arche`}>
          <path d={ARCH} />
        </clipPath>
        <linearGradient id={`${id}-faisceau`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff6e8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff6e8" stopOpacity="0" />
        </linearGradient>
        <pattern id={`${id}-tulle`} width="12" height="20.8" patternUnits="userSpaceOnUse">
          <path d="M6 0l6 3.5v6.9L6 13.9 0 10.4V3.5zM6 13.9v6.9" fill="none" stroke="#1a1f22" strokeOpacity="0.07" strokeWidth="0.6" />
        </pattern>
      </defs>
      <g clipPath={`url(#${id}-arche)`}>
        <rect width="400" height="520" fill={p.fond} />
        <rect width="400" height="520" fill={`url(#${id}-tulle)`} />
        <rect width="400" height="150" fill={p.plafond} />
        {SPOTS.map((x) => (
          <polygon key={x} points={`${x - 7},146 ${x + 7},146 ${x + 78},520 ${x - 78},520`} fill={`url(#${id}-faisceau)`} />
        ))}
        <path d="M110 124h180" stroke={p.rail} strokeWidth="2" strokeLinecap="round" />
        {SPOTS.map((x) => (
          <rect key={x} x={x - 7} y="126" width="14" height="20" rx="4" fill={p.rail} />
        ))}
        <path d="M-10 520v-96c70-40 150-34 214-6s132 30 206-14v116Z" fill={p.comptoir} />
        <path d="M-10 424c70-40 150-34 214-6s132 30 206-14" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.5" />
      </g>
      <path d="M14 520V206a186 186 0 0 1 372 0v314" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.2" />
    </svg>
  );
}
