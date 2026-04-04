# Renginal — Website

Premium-Website für **Renginal** (Inal Unfallinstandsetzung + Fahrzeuglackierung), München.

## Tech-Stack

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS 3.4**
- **Framer Motion 11**
- **TypeScript**

## Starten

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000).

## Produktions-Build

```bash
npm run build
npm start
```

## Bilder ersetzen

Die Galerie-Sektion (`components/Gallery.tsx`) verwendet aktuell CSS-Gradient-Platzhalter.
Ersetze diese mit echten Werkstattfotos:

1. Bilder in `/public/images/` ablegen
2. In `Gallery.tsx` die Gradient-`<div>`-Elemente durch `<Image>`-Komponenten ersetzen:

```tsx
import Image from 'next/image'

<Image
  src="/images/gallery-1.jpg"
  alt="Lackierung vorher/nachher"
  fill
  className="object-cover"
/>
```

### Empfohlene Bilder

| Nr. | Motiv                          | Dateiname-Vorschlag     |
| --- | ------------------------------ | ----------------------- |
| 1   | Lackierung — Vorher / Nachher  | `gallery-lack.jpg`      |
| 2   | Karosseriearbeit Detail        | `gallery-karosserie.jpg`|
| 3   | Felgenaufbereitung             | `gallery-felgen.jpg`    |
| 4   | Werkstatt-Impression           | `gallery-werkstatt.jpg` |
| 5   | Detailarbeit Lack              | `gallery-detail.jpg`    |
| 6   | Fahrzeugübergabe               | `gallery-uebergabe.jpg` |

## Google Maps

Die Karte in `components/Location.tsx` verwendet eine generische Embed-URL.
Für eine exakte Kartenmarkierung:

1. Google Maps öffnen → Adresse suchen → "Teilen" → "Karte einbetten"
2. Den `src`-Wert des `<iframe>` in `Location.tsx` ersetzen

## Öffnungszeiten

In `components/Contact.tsx` sind die Öffnungszeiten als Platzhalter hinterlegt.
Echte Zeiten dort eintragen.

## Struktur

```
app/
  layout.tsx        Fonts, Metadata, Schema.org
  page.tsx          Hauptseite (Single-Page)
  globals.css       CSS-Variablen, Overlays, Utilities

components/
  Navigation.tsx    Mobile Hamburger + Desktop-Nav
  Hero.tsx          Cinematic Hero mit layered Motion
  QuickActions.tsx  Anrufen / Route / E-Mail Buttons
  Services.tsx      6 Leistungs-Cards mit 3D-Tilt
  WhyRenginal.tsx   Vertrauens-Sektion
  Process.tsx       4-Schritte Timeline
  Gallery.tsx       Bild-Galerie mit Reveal-Effekten
  Location.tsx      Adresse + Kartenbereich
  Contact.tsx       Kontaktdaten (kein Formular)
  Footer.tsx        Minimaler Footer
  MobileActionBar.tsx  Sticky Aktionsleiste

  ui/
    SplitText.tsx      Zeichenweise Text-Animation
    MagneticButton.tsx Magnetischer Hover-Effekt
    RevealSection.tsx  Scroll-gesteuerte Reveals
    ServiceCard.tsx    3D-Tilt Service-Karte
```
