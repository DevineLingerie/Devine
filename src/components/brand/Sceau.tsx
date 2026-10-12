import { useId } from "react";

/** Sceau circulaire « Lingerie depuis 1912 », clin d'œil à l'histoire du commerce. */
export function Sceau({ label = "Lingerie · depuis 1912 · femme & homme ·", className = "" }: { label?: string; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <path id={`${id}-cercle`} d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="var(--color-lin)" />
      <circle cx="60" cy="60" r="56" fill="none" stroke="var(--color-nuit)" strokeWidth="0.8" />
      <text fontSize="9.4" letterSpacing="2.1" fill="var(--color-nuit)" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase", fontWeight: 600 }}>
        <textPath href={`#${id}-cercle`}>{label}</textPath>
      </text>
      <text x="60" y="73" textAnchor="middle" fontSize="38" fill="var(--color-argile)" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
        D
      </text>
    </svg>
  );
}
