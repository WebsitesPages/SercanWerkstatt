import type { Metadata, Viewport } from "next";
import { Syne, Outfit } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080a",
};

export const metadata: Metadata = {
  title: "Renginal – Unfallinstandsetzung & Fahrzeuglackierung München",
  description:
    "Inal Unfallinstandsetzung + Fahrzeuglackierung in München. Professionelle Kfz-Reparatur, Lackierung, Felgenservice, Achsvermessung und mehr. Tagetesstraße 7, 80935 München.",
  keywords: [
    "Kfz-Werkstatt München",
    "Unfallinstandsetzung",
    "Fahrzeuglackierung",
    "Felgenservice",
    "Achsvermessung",
    "Renginal",
    "München",
    "Autolackierung",
    "Unfallreparatur",
  ],
  openGraph: {
    title: "Renginal – Unfallinstandsetzung & Fahrzeuglackierung München",
    description:
      "Professionelle Kfz-Reparatur und Lackierung in München. Saubere Arbeit, direkte Kommunikation.",
    locale: "de_DE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${syne.variable} ${outfit.variable} antialiased`}>
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
