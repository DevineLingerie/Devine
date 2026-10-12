import type { Service } from "@/content/types";

export function ServiceList({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <ol className="grid gap-6 sm:grid-cols-2">
      {services.map((service, index) => (
        <li key={service.id} className="flex gap-5">
          <span aria-hidden="true" className="font-serif text-3xl leading-none text-bois-fonce">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-serif text-xl">{service.title}</h3>
            <p className="mt-1 text-encre">{service.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
