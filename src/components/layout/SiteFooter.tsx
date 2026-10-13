import Link from "next/link";
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
    <footer className="on-dark overflow-hidden bg-nuit text-lin">
      <Container size="wide" className="grid gap-12 pb-10 pt-16 lg:grid-cols-[1.2fr_2fr] lg:pt-20">
        <div>
          {settings.promise ? <p className="max-w-sm font-serif text-3xl italic leading-tight text-lin">{settings.promise}</p> : null}
          {settings.socialLinks.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {settings.socialLinks.map((link) => (
                <li key={link.network}>
                  <a href={link.url} className="inline-flex min-h-10 items-center rounded-full border border-lin/30 px-4 text-sm hover:bg-lin hover:text-nuit" target="_blank" rel="noopener noreferrer">
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
            <h2 className="surtitre text-argile-clair">Explorer</h2>
            <ul className="mt-4 grid gap-2.5">
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
      <Container size="wide">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 1000 170" className="block w-full select-none">
          <text x="500" y="140" textAnchor="middle" fontSize="230" letterSpacing="-8" fontWeight="700" fill="#ffffff" fillOpacity="0.07" style={{ fontFamily: "var(--font-display)" }}>
            devine.
          </text>
        </svg>
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
