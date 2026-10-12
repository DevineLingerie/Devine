"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { contactNavItem, type NavItem } from "@/config/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { NavLinks } from "./NavLinks";

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Ferme le menu après une navigation.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full px-3 text-base"
      >
        <span>{open ? "Fermer" : "Menu"}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
        </svg>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-lin px-4 pb-10 pt-6 sm:px-6"
      >
        <nav aria-label="Navigation principale">
          <NavLinks
            items={items}
            className="grid gap-1 border-t border-nuit/10"
            linkClassName="block border-b border-nuit/10 py-4 font-serif text-2xl"
            onNavigate={() => setOpen(false)}
          />
        </nav>
        <Link href={contactNavItem.href} onClick={() => setOpen(false)} className={buttonClasses("primary", "mt-8 w-full")}>
          {contactNavItem.label}
        </Link>
      </div>
    </div>
  );
}
