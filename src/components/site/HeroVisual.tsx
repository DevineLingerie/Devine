import type { VitrineVariant } from "@/components/brand/Vitrine";
import type { Media } from "@/content/types";
import type { PhotoSlot } from "@/content/photos";
import { PhotoFrame } from "./PhotoFrame";

type HeroVisualProps = {
  image: Media | null;
  variant: VitrineVariant;
  slot?: PhotoSlot;
  monogramme?: string;
  priority?: boolean;
  className?: string;
};

/** Visuel d'en-tête en arche : photo de la boutique, sinon photo d'illustration, sinon satin. */
export function HeroVisual({ image, variant, slot, monogramme, priority = false, className = "" }: HeroVisualProps) {
  return (
    <PhotoFrame
      media={image}
      slot={slot}
      variant={variant}
      monogramme={monogramme}
      priority={priority}
      sizes="(min-width: 1024px) 34vw, 80vw"
      className={`aspect-[4/5] rounded-t-full rounded-b-[2rem] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.6)] ring-1 ring-lin/20 ${className}`}
    />
  );
}
