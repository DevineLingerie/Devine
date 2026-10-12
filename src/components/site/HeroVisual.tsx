import Image from "next/image";
import { Arche } from "@/components/brand/Arche";
import type { Media } from "@/content/types";
import { getImageUrl } from "@/lib/content/format";

type HeroVisualProps = {
  image: Media | null;
  variant: Parameters<typeof Arche>[0]["variant"];
  priority?: boolean;
  className?: string;
};

/**
 * Photo administrée dans un cadre en arche, ou à défaut l'illustration
 * originale. Aucune photo n'est présentée comme authentique si elle n'a pas
 * été ajoutée par la boutique.
 */
export function HeroVisual({ image, variant, priority = false, className = "" }: HeroVisualProps) {
  const src = image ? getImageUrl(image.path) : null;
  return (
    <div className={`relative aspect-[4/5] overflow-hidden rounded-t-full ${className}`}>
      {image && src ? (
        <Image
          src={src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
        />
      ) : (
        <Arche variant={variant} className="h-full w-full" />
      )}
    </div>
  );
}
