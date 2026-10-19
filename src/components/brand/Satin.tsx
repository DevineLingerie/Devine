export type SatinTon = "chair" | "bordeaux" | "prune" | "ivoire" | "peche" | "mousse";

/**
 * Panneau de satin : reflets de tissu en attendant les photos. Un grand
 * monogramme brodé (initiale en italique) peut l'accompagner.
 */
export function Satin({ ton, monogramme, className = "" }: { ton: SatinTon; monogramme?: string; className?: string }) {
  const sombre = ton === "bordeaux" || ton === "prune" || ton === "mousse";
  return (
    <div aria-hidden="true" className={`satin satin-${ton} relative h-full w-full overflow-hidden ${className}`}>
      {monogramme ? (
        <span
          className={`absolute bottom-[-0.18em] right-[0.06em] select-none font-display text-[clamp(7rem,22vw,16rem)] italic leading-none ${sombre ? "text-lin/15" : "text-nuit/10"}`}
        >
          {monogramme}
        </span>
      ) : null}
    </div>
  );
}
