import { parseTextBlocks } from "@/lib/content/format";

/** Affiche un texte de l'administration (paragraphes et listes, sans HTML). */
export function RichText({ text, className = "" }: { text: string; className?: string }) {
  const blocks = parseTextBlocks(text);
  if (blocks.length === 0) return null;
  return (
    <div className={`prose-devine ${className}`}>
      {blocks.map((block, index) =>
        block.type === "paragraph" ? (
          <p key={index}>{block.text}</p>
        ) : (
          <ul key={index}>
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}
