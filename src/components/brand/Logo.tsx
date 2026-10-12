import { Trait } from "./Trait";

type LogoProps = { tagline?: string | null; size?: "sm" | "lg"; className?: string };

/**
 * Logotype provisoire : le nom en capitales espacées et un trait
 * calligraphique. À remplacer par le logo définitif lorsqu'il sera validé.
 */
export function Logo({ tagline, size = "sm", className = "" }: LogoProps) {
  const large = size === "lg";
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className={`font-serif tracking-[0.28em] ${large ? "text-5xl sm:text-6xl" : "text-2xl"}`}>DEVINE</span>
      <Trait className={`-mt-0.5 text-argile ${large ? "w-56" : "w-24"}`} />
      {tagline ? (
        <span className={`font-serif italic tracking-wide ${large ? "mt-2 text-lg" : "mt-0.5 text-xs"}`}>{tagline}</span>
      ) : null}
    </span>
  );
}
