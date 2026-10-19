import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { contactNavItem, mainNavigation } from "@/config/navigation";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-lin">
      <div className="bg-sauge text-lin">
        <Container size="wide" className="flex min-h-9 items-center justify-center text-center text-[0.8rem] tracking-wide">
          <p className="sm:hidden">Conseil &amp; essayage en boutique</p>
          <p className="hidden sm:block">
            Conseil personnalisé et essayage en boutique <span aria-hidden="true">·</span> Lingerie femme &amp; homme
          </p>
        </Container>
      </div>
      <div className="border-b border-nuit/10">
        <Container size="wide" className="flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="DEVINE, retour à l'accueil">
            <Logo tagline="Lingerie depuis 1912" />
          </Link>
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <NavLinks items={mainNavigation} className="flex items-center gap-8 text-[0.98rem] font-semibold" linkClassName="py-2" />
          </nav>
          <div className="hidden lg:block">
            <ButtonLink href={contactNavItem.href} className="min-h-11 px-5">
              {contactNavItem.label}
            </ButtonLink>
          </div>
          <MobileMenu items={mainNavigation} />
        </Container>
      </div>
    </header>
  );
}
