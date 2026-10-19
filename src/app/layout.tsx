import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

// Polices sous licence SIL Open Font License (usage commercial autorisé),
// auto-hébergées par next/font : aucune requête vers Google côté visiteur.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: "DEVINE — Lingerie femme et homme", template: "%s | DEVINE" },
  applicationName: "DEVINE",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#2a0f1c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
