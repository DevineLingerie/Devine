"use client";

import type { ReactNode } from "react";

/** Bouton d'envoi qui demande confirmation avant une action irréversible. */
export function ConfirmSubmit({ message, children, className = "" }: { message: string; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={`min-h-11 rounded-full border border-argile/50 px-4 text-argile-fonce hover:bg-argile hover:text-lin ${className}`}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
