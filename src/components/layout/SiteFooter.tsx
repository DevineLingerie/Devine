import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/ui/Container";
import { PracticalInfo } from "@/components/site/PracticalInfo";
import { contactNavItem, legalNavigation, mainNavigation } from "@/config/navigation";
import type { SocialNetwork } from "@/content/types";
import { getSiteSettings } from "@/lib/content/repository";

const NETWORK_LABELS: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  pinterest: "Pinterest",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

export async function SiteFooter() {
  const settings = await getSiteSettings();
  return (
    <footer className="on-dark bg-nuit text-lin">
      <Container size="wide" className="grid gap-12 py-14 lg:grid-cols-[1fr_2fr] lg:py-16">
        <div>
          <Logo tagline={settings.tagline} />
          {settings.promise ? <p className="mt-6 max-w-xs font-serif text-lg italic text-lin/85">{settings.promise}</p> : null}
          {settings.socialLinks.length > 0 ? (
            <ul className="mt-6 flex flex-wrap gap-4">
              {settings.socialLinks.map((link) => (
                <li key={link.network}>
                  <a href={link.url} className="lien" target="_blank" rel="noopener noreferrer">
                    {NETWORK_LABELS[link.network]}
                    <span className="sr-only"> (s&apos;ouvre dans un nouvel onglet)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
          <PracticalInfo settings={settings} tone="dark" headingLevel={2} />
          <nav aria-label="Plan du site">
            <h2 className="font-serif text-xl">Explorer</h2>
            <ul className="mt-3 grid gap-2">
              {[...mainNavigation, contactNavItem].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-lin/85 hover:text-lin hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
      <div className="border-t border-lin/15">
        <Container size="wide" className="flex flex-col gap-3 py-6 text-sm text-lin/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {settings.shopName} — {settings.tagline ?? "Lingerie"}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-lin hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
