import Image from "next/image";
import { Vitrine, type VitrineVariant } from "@/components/brand/Vitrine";
import type { Media } from "@/content/types";
import { getImageUrl } from "@/lib/content/format";

type HeroVisualProps = {
  image: Media | null;
  variant: VitrineVariant;
  priority?: boolean;
  className?: string;
};

/**
 * Photo administrée dans un cadre en arche, ou à défaut l'illustration
 * originale de la vitrine. Aucune image n'est présentée comme une photo de la
 * boutique si elle n'a pas été ajoutée par la boutique.
 */
export function HeroVisual({ image, variant, priority = false, className = "" }: HeroVisualProps) {
  const src = image ? getImageUrl(image.path) : null;
  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] shadow-[0_40px_80px_-40px_rgba(26,31,34,0.45)] ${className}`}>
      {image && src ? (
        <Image src={src} alt={image.alt} fill priority={priority} sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
      ) : (
        <Vitrine variant={variant} className="h-full w-full" />
      )}
    </div>
  );
}
