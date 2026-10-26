import { Fragment } from "react";

type BandeauProps = {
  items: string[];
  /** Durée d'un tour complet, en secondes. */
  duree?: number;
  sens?: "normal" | "inverse";
  className?: string;
  label: string;
};

/**
 * Bandeau défilant en continu. La liste est lue une seule fois par les
 * lecteurs d'écran ; la copie qui permet la boucle est masquée.
 * Le défilement s'arrête au survol et quand l'utilisateur réduit les animations.
 */
export function Bandeau({ items, duree = 40, sens = "normal", className = "", label }: BandeauProps) {
  const liste = (cache: boolean) => (
    <ul aria-hidden={cache || undefined} className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <li className="px-6 sm:px-10">{item}</li>
          <li aria-hidden="true" className="text-argile-clair">
            ✦
          </li>
        </Fragment>
      ))}
    </ul>
  );
  return (
    <div className={`bandeau overflow-hidden ${className}`} role="region" aria-label={label}>
      <div className="bandeau-piste" data-sens={sens} style={{ ["--duree" as string]: `${duree}s` }}>
        {liste(false)}
        {liste(true)}
      </div>
    </div>
  );
}
