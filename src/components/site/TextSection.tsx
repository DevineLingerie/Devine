import { RichText } from "@/components/ui/RichText";
import type { PageSection } from "@/content/types";

/** Section éditoriale : titre à gauche, texte à droite sur grand écran. */
export function TextSection({ section, className = "", layout = "stacked" }: { section: PageSection | null; className?: string; layout?: "stacked" | "split" }) {
  if (!section) return null;
  if (layout === "split") {
    return (
      <div className={`apparition grid gap-6 border-t border-nuit/15 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 ${className}`}>
        <h2 className="text-3xl sm:text-4xl">{section.heading}</h2>
        <RichText text={section.body} className="text-lg leading-relaxed text-encre" />
      </div>
    );
  }
  return (
    <div className={`apparition ${className}`}>
      <h2 className="text-3xl sm:text-4xl">{section.heading}</h2>
      <RichText text={section.body} className="mt-5 text-lg leading-relaxed text-encre" />
    </div>
  );
}
