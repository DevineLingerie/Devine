import Image from "next/image";
import { Vitrine, type VitrineVariant } from "@/components/brand/Vitrine";
import type { Media } from "@/content/types";
import { getStockPhoto, type PhotoSlot } from "@/content/photos";
import { getImageUrl } from "@/lib/content/format";

type PhotoFrameProps = {
  /** Photo ajoutée dans l'administration (prioritaire). */
  media?: Media | null;
  /** Emplacement de photo d'illustration provisoire. */
  slot?: PhotoSlot;
  /** Illustration affichée quand aucune photo n'est disponible. */
  variant: VitrineVariant;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Cadre photo : photo de la boutique, sinon photo d'illustration, sinon illustration. */
export function PhotoFrame({ media, slot, variant, className = "", sizes = "50vw", priority = false }: PhotoFrameProps) {
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
        <Vitrine variant={variant} className="h-full w-full" />
      )}
    </div>
  );
}
