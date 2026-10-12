import { parseTextBlocks } from "@/lib/content/format";

// Colonnes sur grand écran selon le nombre d'étapes (classes complètes pour Tailwind).
const COLUMNS: Record<number, string> = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" };

/** Affiche les éléments de liste d'un texte administrable sous forme d'étapes numérotées. */
export function StepList({ text }: { text: string }) {
  const blocks = parseTextBlocks(text);
  const steps = blocks.flatMap((block) => (block.type === "list" ? block.items : []));
  const paragraphs = blocks.flatMap((block) => (block.type === "paragraph" ? [block.text] : []));
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mt-4 max-w-2xl text-lg text-encre">
          {paragraph}
        </p>
      ))}
      {steps.length > 0 ? (
        <ol className={`mt-10 grid gap-4 sm:grid-cols-2 ${COLUMNS[steps.length] ?? "lg:grid-cols-3"}`}>
          {steps.map((step, index) => (
            <li key={index} className="flex flex-col gap-4 rounded-[1.75rem] bg-lin p-6">
              <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-argile font-serif text-2xl text-lin">
                {index + 1}
              </span>
              <span className="text-lg">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );
}
