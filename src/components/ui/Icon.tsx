// Icônes au trait, dessinées pour le site (aucune bibliothèque externe).

const PATHS = {
  conseil: "M4 5h16v11H9l-5 4V5zM8 9h8M8 12h5",
  cintre: "M12 7a2 2 0 1 1 2 2c-1 .5-2 1-2 2v1M12 12l9 6H3l9-6z",
  mesure: "M3 9h18v6H3zM7 9v3M11 9v2M15 9v3M19 9v2",
  duo: "M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3 2.5-5.5 5.5-5.5S14 17 14 20M10 20c0-3 2.5-5.5 5.5-5.5S21 17 21 20",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "h-6 w-6" }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" className={className}>
      <path d={PATHS[name]} />
    </svg>
  );
}
