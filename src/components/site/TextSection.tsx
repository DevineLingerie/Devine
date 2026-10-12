import { RichText } from "@/components/ui/RichText";
import type { PageSection } from "@/content/types";

/** Section éditoriale simple : titre + texte administrable. */
export function TextSection({ section, className = "" }: { section: PageSection | null; className?: string }) {
  if (!section) return null;
  return (
    <div className={`apparition ${className}`}>
      <h2 className="text-3xl sm:text-4xl">{section.heading}</h2>
      <RichText text={section.body} className="mt-5 text-lg text-encre" />
    </div>
  );
}
