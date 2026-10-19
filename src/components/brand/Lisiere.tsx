import { useId } from "react";

type Ton = "nuit" | "lin" | "sable" | "argile";

const COULEURS: Record<Ton, string> = {
  nuit: "var(--color-nuit)",
  lin: "var(--color-lin)",
  sable: "var(--color-sable)",
  argile: "var(--color-argile)",
};

/**
 * Lisière de dentelle entre deux sections : festons ajourés de la couleur
 * de la section du dessus, posés sur la couleur de la section du dessous.
 */
export function Lisiere({ de, vers, className = "" }: { de: Ton; vers: Ton; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div aria-hidden="true" className={`leading-[0] ${className}`} style={{ backgroundColor: COULEURS[vers] }}>
      <svg width="100%" height="22" focusable="false" className="block">
        <defs>
          <pattern id={`${id}-feston`} width="44" height="22" patternUnits="userSpaceOnUse">
            <path d="M0 0h44v2a22 18 0 0 1-44 0Z" fill={COULEURS[de]} />
            <circle cx="22" cy="8" r="2.4" fill={COULEURS[vers]} />
            <circle cx="11" cy="5" r="1.2" fill={COULEURS[vers]} />
            <circle cx="33" cy="5" r="1.2" fill={COULEURS[vers]} />
          </pattern>
        </defs>
        <rect width="100%" height="22" fill={`url(#${id}-feston)`} />
      </svg>
    </div>
  );
}
