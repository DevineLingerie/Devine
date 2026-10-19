import Image from "next/image";
import { Satin, type SatinTon } from "@/components/brand/Satin";
import type { VitrineVariant } from "@/components/brand/Vitrine";
import type { Media } from "@/content/types";
import { getStockPhoto, type PhotoSlot } from "@/content/photos";
import { getImageUrl } from "@/lib/content/format";

const TONS: Record<VitrineVariant, SatinTon> = {
  accueil: "chair",
  femme: "chair",
  homme: "prune",
  nuit: "bordeaux",
  histoire: "ivoire",
  conseil: "peche",
};

type PhotoFrameProps = {
  /** Photo ajoutée dans l'administration (prioritaire). */
  media?: Media | null;
  /** Emplacement de photo d'illustration provisoire. */
  slot?: PhotoSlot;
  /** Illustration affichée quand aucune photo n'est disponible. */
  variant: VitrineVariant;
  className?: string;
  /** Initiale brodée sur le satin. */
  monogramme?: string;
  sizes?: string;
  priority?: boolean;
};

/** Cadre photo : photo de la boutique, sinon photo d'illustration, sinon panneau de satin. */
export function PhotoFrame({ media, slot, variant, monogramme, className = "", sizes = "50vw", priority = false }: PhotoFrameProps) {
  const mediaUrl = media ? getImageUrl(media.path) : null;
  const stock = slot ? getStockPhoto(slot) : null;
  // Un cadre placé en absolu par son parent reste positionné pour l'image « fill ».
  const position = /(^|\s)absolute(\s|$)/.test(className) ? "" : "relative";
  return (
    <div className={`${position} overflow-hidden bg-sable ${className}`}>
      {media && mediaUrl ? (
        <Image src={mediaUrl} alt={media.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : stock ? (
        <Image src={stock.src} alt={stock.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <Satin ton={TONS[variant]} monogramme={monogramme} />
      )}
    </div>
  );
}
