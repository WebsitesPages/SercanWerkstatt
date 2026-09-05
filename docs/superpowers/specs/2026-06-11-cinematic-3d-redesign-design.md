# Cinematic 3D Redesign — „Der Werkstatt-Film"

**Datum:** 2026-06-11
**Status:** Überholt am 2026-09-05 — ersetzt durch
`2026-09-05-foto-scroll-story-design.md`. Das prozedurale 3D-Auto wirkte nicht
fotoreal; die Sektion nutzt jetzt echte Studio-Fotos. Historisches Dokument.

**Ursprünglicher Status:** Approved (User: „tob dich aus ich will was richtig krasses sehen")

## Ziel

Die Renginal-Website (Unfallinstandsetzung + Fahrzeuglackierung, München) bekommt ein
filmreifes Erlebnis: Ein stylisiertes 3D-Showcar ist der Star der Seite. Beim Scrollen
bleibt das Auto sticky auf einer Bühne, die Kamera fliegt drumherum und die Services
werden als Film-Kapitel mit echten 3D-Animationen erzählt. Alles muss auf dem Handy
flüssig laufen.

## Entscheidungen (mit User abgestimmt)

1. **Echtes 3D** statt SVG/Hybrid — three.js, scroll-gesteuerte Kamera.
2. **Stylisiertes Showcar, prozedural im Code gebaut** statt heruntergeladenem GLB —
   garantiert animierbare Einzelteile (Haube, Räder, Karosserie-Panels), Lackfarbe als
   Material-Parameter, keine Lizenz-/Download-Kosten.

## Die Kapitel (CarStory-Sektion, scroll-pinned)

| # | Kapitel | 3D-Animation |
|---|---------|--------------|
| 1 | Intro | Auto im dunklen Studio, langsame Drehung, Scheinwerfer an, Lichtstreifen |
| 2 | Unfallinstandsetzung | Explosionsansicht: Karosserieteile schweben auseinander und setzen sich beim Scrollen wieder zusammen |
| 3 | Wartung & Service | Kamera zur Front, Motorhaube klappt in 3D auf, Motor leuchtet, Beschriftungs-Pins |
| 4 | Reifen-/Felgenservice | Kamera zur Seite, Rad löst sich rotierend ab, neue Felge schwebt rein |
| 5 | Lackierung | Lack-Welle: Farbe zieht von Grundierungs-Grau zu Glanz-Rot übers Auto, Glanz-Sweep |

## Seitenweite Cinematik

- Filmkorn-Overlay (dezent, CSS/Canvas, deaktiviert bei `prefers-reduced-motion`)
- Letterbox-/Kapitel-Übergänge zwischen Sektionen
- Bestehende Galerie + 360°-Showrooms bleiben, bekommen cinematische Reveals
- Bestehende Service-Texte bleiben als kompakte Karten unter der Story (SEO)

## Technik

- **Neue Dependencies:** `three`, `@react-three/fiber`, `@react-three/drei`
- **Neue Struktur:**
  - `components/three/ShowCar.tsx` — prozedurales Auto: Karosserie, Haube (Pivot-Gruppe),
    4 Räder (eigene Gruppen), Scheiben, Lichter; Lack = MeshPhysicalMaterial mit Clearcoat
  - `components/three/CarStage.tsx` — Canvas + Studio-Licht + ContactShadows,
    lazy via `next/dynamic` (ssr: false), mountet erst nahe Viewport
  - `components/CarStory.tsx` — sticky Scroll-Sektion (~400–500vh), Scroll-Progress
    steuert Kamera + Kapitel-Animationen + Text-Overlays
- **Performance/Mobile:** DPR-Clamp (max ~1.75), reduzierte Effekte auf Mobile,
  `prefers-reduced-motion` respektieren (statisches Auto + einfache Fades),
  Canvas pausiert außerhalb des Viewports
- **Constraints:** Next.js 14 statischer Export (`output: 'export'`, basePath
  `/SercanWerkstatt`) muss weiter funktionieren; `npm run build` bleibt grün

## Nicht im Scope

- Fotorealistisches Modell, WebGPU, Sound
- Backend/Formulare
- Änderungen an Kontakt-/Location-Inhalten

## Erfolgskriterien

- Build läuft durch, Deploy auf GitHub Pages funktioniert
- Alle 5 Kapitel-Animationen laufen scroll-gesteuert, auch auf Mobile (getestet via
  responsive Viewport)
- Lighthouse-taugliche Ladezeit: kein Modell-Download, three.js lazy geladen
