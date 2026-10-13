type LogoProps = { tagline?: string | null; size?: "sm" | "lg"; className?: string };

/**
 * Logotype provisoire : le nom en minuscules, franc et accessible, avec un
 * point prune, et la signature en petites capitales. À remplacer par le logo
 * définitif lorsqu'il sera validé.
 */
export function Logo({ tagline, size = "sm", className = "" }: LogoProps) {
  const large = size === "lg";
  return (
    <span className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className={`font-display font-bold lowercase tracking-[-0.04em] ${large ? "text-7xl" : "text-[2rem]"}`}>
        devine<span className="text-argile">.</span>
      </span>
      {tagline ? <span className={`surtitre mt-1 opacity-75 ${large ? "text-sm" : "!text-[0.58rem]"}`}>{tagline}</span> : null}
    </span>
  );
}
