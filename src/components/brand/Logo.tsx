type LogoProps = { tagline?: string | null; size?: "sm" | "lg"; className?: string };

/**
 * Logotype provisoire : « Devine » en Bodoni italique, comme une griffe
 * cousue, et la signature en petites lettres. À remplacer par le logo
 * définitif lorsqu'il sera validé.
 */
export function Logo({ tagline, size = "sm", className = "" }: LogoProps) {
  const large = size === "lg";
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className={`font-display italic tracking-[-0.02em] ${large ? "text-7xl" : "text-[2.1rem]"}`}>Devine</span>
      {tagline ? <span className={`mt-1 tracking-wide opacity-80 ${large ? "text-sm" : "text-[0.7rem]"}`}>{tagline}</span> : null}
    </span>
  );
}
