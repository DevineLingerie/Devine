type LogoProps = { tagline?: string | null; size?: "sm" | "lg"; className?: string };

/**
 * Logotype provisoire : le nom en capitales espacées et la signature en
 * petites capitales. À remplacer par le logo définitif lorsqu'il sera validé.
 */
export function Logo({ tagline, size = "sm", className = "" }: LogoProps) {
  const large = size === "lg";
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className={`font-serif tracking-[0.32em] ${large ? "text-6xl sm:text-7xl" : "text-[1.75rem]"}`}>DEVINE</span>
      {tagline ? (
        <span className={`surtitre mt-1.5 opacity-80 ${large ? "text-sm" : "!text-[0.6rem]"}`}>{tagline}</span>
      ) : null}
    </span>
  );
}
