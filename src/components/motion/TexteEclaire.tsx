/**
 * Paragraphe dont les mots s'éclairent un à un pendant le défilement
 * (navigateurs compatibles). Ailleurs, le texte est simplement affiché.
 */
export function TexteEclaire({ texte, className = "" }: { texte: string; className?: string }) {
  const mots = texte.split(/\s+/).filter(Boolean);
  return (
    <p className={`phrase ${className}`}>
      {mots.map((mot, index) => (
        <span key={index} className="mot" style={{ ["--p" as string]: (index / Math.max(1, mots.length - 1)) * 100 }}>
          {mot}{" "}
        </span>
      ))}
    </p>
  );
}
