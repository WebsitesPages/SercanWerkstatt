import type { Metadata } from 'next'
import { Antonio, Barlow } from 'next/font/google'
import './globals.css'

/* ── Fonts ─────────────────────────────────────────── */
const antonio = Antonio({
  subsets: ['latin'],
  variable: '--font-antonio',
  display: 'swap',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

/* ── Metadata & SEO ────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Inal — Unfallinstandsetzung & Fahrzeuglackierung in München',
  description:
    'Ihr Experte für Unfallinstandsetzung, Fahrzeuglackierung, Felgenservice und Achsvermessung in München. Professionelle Karosseriearbeiten mit höchstem Qualitätsanspruch. Tagetesstraße 7, 80935 München.',
  keywords:
    'Kfz-Werkstatt München, Unfallinstandsetzung München, Fahrzeuglackierung, Karosserie, Lackierung, Felgenservice, Gutachten, Achsvermessung, Inal',
  openGraph: {
    title: 'Inal — Unfallinstandsetzung & Fahrzeuglackierung München',
    description:
      'Professionelle Karosseriearbeiten und Lackierungen in München. Qualität, Präzision und persönlicher Service.',
    type: 'website',
    locale: 'de_DE',
    siteName: 'Inal',
  },
  robots: 'index, follow',
  other: {
    'geo.region': 'DE-BY',
    'geo.placename': 'München',
  },
}

/* ── Schema.org structured data ────────────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  name: 'Inal — Inal Unfallinstandsetzung + Fahrzeuglackierung',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Tagetesstraße 7',
    addressLocality: 'München',
    postalCode: '80935',
    addressCountry: 'DE',
  },
  telephone: '+498935657285',
  email: 'rengin-al@gmx.de',
  areaServed: {
    '@type': 'City',
    name: 'München',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${antonio.variable} ${barlow.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body noise-overlay scanline-overlay">
        {children}
      </body>
    </html>
  )
}
