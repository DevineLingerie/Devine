import type { Service } from "@/content/types";

export function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => (
        <li key={service.id} className="rounded-[1.75rem] bg-lin p-7 ring-1 ring-nuit/10">
          <h3 className="font-display text-3xl">{service.title}</h3>
          <p className="mt-3 leading-relaxed text-encre">{service.summary}</p>
        </li>
      ))}
    </ul>
  );
}
