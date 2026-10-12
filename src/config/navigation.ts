// Navigation principale et liens de pied de page : source unique.

export type NavItem = { href: string; label: string };

export const mainNavigation: NavItem[] = [
  { href: "/lingerie-femme", label: "Femme" },
  { href: "/lingerie-homme", label: "Homme" },
  { href: "/nuit-homewear-bain", label: "Nuit & bain" },
  { href: "/marques", label: "Marques" },
  { href: "/conseil", label: "Le conseil" },
  { href: "/histoire", label: "Depuis 1912" },
];

export const contactNavItem: NavItem = { href: "/contact", label: "Préparer ma visite" };

export const legalNavigation: NavItem[] = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
];

/** Pages publiques et leur slug dans la table `pages`. */
export const PUBLIC_PAGES = [
  { path: "/", slug: "accueil" },
  { path: "/lingerie-femme", slug: "lingerie-femme" },
  { path: "/lingerie-homme", slug: "lingerie-homme" },
  { path: "/nuit-homewear-bain", slug: "nuit-homewear-bain" },
  { path: "/marques", slug: "marques" },
  { path: "/conseil", slug: "conseil" },
  { path: "/histoire", slug: "histoire" },
  { path: "/contact", slug: "contact" },
  { path: "/mentions-legales", slug: "mentions-legales" },
  { path: "/confidentialite", slug: "confidentialite" },
] as const;

export function pathForSlug(slug: string): string | null {
  return PUBLIC_PAGES.find((page) => page.slug === slug)?.path ?? null;
}
