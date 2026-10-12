import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { requireAdmin } from "@/lib/auth/admin";
import { signOut } from "../_actions/auth";

const NAV = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/reglages", label: "Coordonnées & horaires" },
  { href: "/admin/pages", label: "Pages & textes" },
  { href: "/admin/categories", label: "Univers" },
  { href: "/admin/marques", label: "Marques" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/faq", label: "Questions fréquentes" },
  { href: "/admin/medias", label: "Images" },
  { href: "/admin/demandes", label: "Demandes de contact" },
  { href: "/admin/compte", label: "Mon compte" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { email } = await requireAdmin();
  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-[16rem_1fr]">
      <aside className="on-dark border-b border-nuit/10 bg-nuit px-4 py-5 text-lin lg:border-b-0 lg:px-6 lg:py-8">
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin" aria-label="Tableau de bord">
            <Logo tagline="Administration" />
          </Link>
          <Link href="/" className="text-sm underline lg:mt-6 lg:inline-block" target="_blank">
            Voir le site
          </Link>
        </div>
        <nav aria-label="Administration" className="mt-6">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:gap-1 lg:overflow-visible">
            {NAV.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link href={item.href} className="block rounded-lg px-3 py-2 text-lin/85 hover:bg-lin/10 hover:text-lin">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 border-t border-lin/15 pt-4 text-sm text-lin/75">
          <p className="break-all">{email}</p>
          <form action={signOut} className="mt-2">
            <button type="submit" className="underline hover:text-lin">
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>
      <main id="contenu" className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-4xl">{children}</div>
      </main>
    </div>
  );
}
