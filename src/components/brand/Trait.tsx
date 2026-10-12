// Trait calligraphique : une seule ligne souple, en écho aux courbes du
// comptoir de la boutique. Purement décoratif.

export function Trait({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path
        d="M2 18c22-12 46-15 70-8s40 12 58 5 22-14 12-14-14 13 6 17 46-6 70-12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
