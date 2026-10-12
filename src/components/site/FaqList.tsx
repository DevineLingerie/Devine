import type { Faq } from "@/content/types";

/** Questions fréquentes en éléments <details> natifs : accessibles au clavier, sans JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <div className="divide-y divide-nuit/10 border-y border-nuit/10">
      {faqs.map((faq) => (
        <details key={faq.id} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-serif text-xl [&::-webkit-details-marker]:hidden">
            {faq.question}
            <span aria-hidden="true" className="text-2xl text-argile transition-transform duration-200 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="pb-5 text-encre">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
