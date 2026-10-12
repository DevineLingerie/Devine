import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  id?: string;
  level?: 2 | 3;
  className?: string;
  /** "dark" pour un titre posé sur fond nuit. */
  tone?: "light" | "dark";
};

export function SectionHeading({ eyebrow, title, id, level = 2, className = "", tone = "light" }: SectionHeadingProps) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <div className={className}>
      {eyebrow ? (
        <p className={`mb-3 text-sm font-medium uppercase tracking-[0.18em] ${tone === "dark" ? "text-sauge-clair" : "text-sauge"}`}>{eyebrow}</p>
      ) : null}
      <Heading id={id} className={level === 2 ? "text-3xl sm:text-4xl" : "text-2xl"}>
        {title}
      </Heading>
    </div>
  );
}
