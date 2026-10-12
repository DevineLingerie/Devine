import type { Faq } from "@/content/types";

/** Questions fréquentes en éléments <details> natifs : accessibles au clavier, sans JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <div className="grid gap-3">
      {faqs.map((faq) => (
        <details key={faq.id} className="group rounded-[1.5rem] bg-lin px-6 ring-1 ring-nuit/10 open:ring-nuit/25">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-serif text-2xl [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sable text-xl text-argile transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="pb-6 leading-relaxed text-encre">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
