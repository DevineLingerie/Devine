import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { getSiteUrl } from "@/lib/env";
import "./globals.css";

// Polices sous licence SIL Open Font License (usage commercial autorisé),
// auto-hébergées par next/font : aucune requête vers Google côté visiteur.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
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
  themeColor: "#fffcf8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${instrumentSerif.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
