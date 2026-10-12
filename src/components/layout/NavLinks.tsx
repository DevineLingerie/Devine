"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";

type NavLinksProps = { items: NavItem[]; className?: string; linkClassName?: string; onNavigate?: () => void };

export function NavLinks({ items, className = "", linkClassName = "", onNavigate }: NavLinksProps) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {items.map((item) => {
        const isCurrent = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={isCurrent ? "page" : undefined}
              onClick={onNavigate}
              className={`${linkClassName} ${isCurrent ? "text-argile underline decoration-2 underline-offset-8" : "hover:text-argile"}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
