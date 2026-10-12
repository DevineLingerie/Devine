import type { Metadata } from "next";

// L'administration lit la session (cookies) à chaque requête : elle n'est
// jamais prérendue ni mise en cache.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration DEVINE" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-lin">{children}</div>;
}
