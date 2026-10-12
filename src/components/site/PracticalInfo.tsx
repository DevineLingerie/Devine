import type { SiteSettings } from "@/content/types";
import { formatAddressLines, formatOpeningHours, getDirectionsUrl, toTelHref } from "@/lib/content/format";

type PracticalInfoProps = { settings: SiteSettings; tone?: "light" | "dark"; headingLevel?: 2 | 3 };

/**
 * Adresse, téléphone, horaires et itinéraire. Chaque bloc n'apparaît que si
 * l'information a été renseignée dans l'administration.
 */
export function PracticalInfo({ settings, tone = "light", headingLevel = 3 }: PracticalInfoProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const address = formatAddressLines(settings);
  const hours = formatOpeningHours(settings.openingHours);
  const directionsUrl = getDirectionsUrl(settings);
  const muted = tone === "dark" ? "text-lin/80" : "text-encre";
  const headingClass = "font-serif text-xl";
  const hasAnything = address.length > 0 || settings.phone || settings.email || hours.length > 0;

  if (!hasAnything) {
    return (
      <p className={muted}>
        Nos coordonnées et nos horaires seront bientôt indiqués ici. En attendant, vous pouvez nous écrire avec le
        formulaire de contact.
      </p>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {address.length > 0 || settings.phone || settings.email ? (
        <div>
          <Heading className={headingClass}>La boutique</Heading>
          {address.length > 0 ? (
            <address className={`mt-3 not-italic ${muted}`}>
              {address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : null}
          <ul className="mt-3 grid gap-2">
            {settings.phone ? (
              <li>
                <a href={toTelHref(settings.phone)} className="lien text-lg">
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {settings.email ? (
              <li>
                <a href={`mailto:${settings.email}`} className="lien break-all">
                  {settings.email}
                </a>
              </li>
            ) : null}
            {directionsUrl ? (
              <li>
                <a href={directionsUrl} className="lien" target="_blank" rel="noopener noreferrer">
                  Obtenir l&apos;itinéraire<span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
                </a>
              </li>
            ) : null}
          </ul>
          {settings.accessNotes ? <p className={`mt-4 text-sm ${muted}`}>{settings.accessNotes}</p> : null}
        </div>
      ) : null}
      {hours.length > 0 ? (
        <div>
          <Heading className={headingClass}>Horaires</Heading>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5">
            {hours.map((line) => (
              <div key={line.day} className="contents">
                <dt className={muted}>{line.label}</dt>
                <dd className={line.isClosed ? muted : ""}>{line.value}</dd>
              </div>
            ))}
          </dl>
          {settings.hoursNote ? <p className={`mt-3 text-sm ${muted}`}>{settings.hoursNote}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
