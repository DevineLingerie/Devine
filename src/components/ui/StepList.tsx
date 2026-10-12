import { parseTextBlocks } from "@/lib/content/format";

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
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={index} className="flex gap-4 rounded-2xl bg-lin/70 p-5">
              <span aria-hidden="true" className="font-serif text-3xl leading-none text-bois-fonce">
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
