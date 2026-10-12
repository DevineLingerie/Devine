import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { contactNavItem, mainNavigation } from "@/config/navigation";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-nuit/10 bg-lin">
      <Container size="wide" className="flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="DEVINE, retour à l'accueil">
          <Logo />
        </Link>
        <nav aria-label="Navigation principale" className="hidden lg:block">
          <NavLinks items={mainNavigation} className="flex items-center gap-7 text-[0.95rem]" linkClassName="py-2" />
        </nav>
        <div className="hidden lg:block">
          <ButtonLink href={contactNavItem.href} className="min-h-11 px-5">
            {contactNavItem.label}
          </ButtonLink>
        </div>
        <MobileMenu items={mainNavigation} />
      </Container>
    </header>
  );
}
