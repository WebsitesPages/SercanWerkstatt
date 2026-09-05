# Foto-Scroll-Story — „Der echte Wagen"

**Datum:** 2026-09-05
**Status:** Approved (User: „ja finde ich super, integrier das auch passend fürs Handy")
**Ersetzt:** `2026-06-11-cinematic-3d-redesign-design.md`

## Warum die Ablösung

Das prozedurale 3D-Showcar (three.js, `lib/buildShowcar.ts`, `components/three/*`) wirkte
laut User „wie von einem Kind gemacht … nicht flüssig … nicht nach einer vertrauenswürdigen
Werkstatt". Echtzeit-3D mit einem im Code gebauten Auto erreicht keine Foto-Qualität — das
Grundproblem lässt sich nicht durch Feinjustierung lösen.

Die Werkstatt hat **echte Studio-Fotos eigener Kundenfahrzeuge** im Repo. Die sind
fotorealistisch, weil sie Fotos sind. Ein Kunde sieht damit *euren* Kundenwagen statt eines
Polygon-Modells — das ist der Vertrauens-Gewinn, nicht nur der Optik-Gewinn.

## Entscheidungen (mit User abgestimmt)

1. **Echte Fotos statt 3D.** three.js + react-three-fiber + drei fliegen komplett raus.
2. **Filmische Schnitte statt Drehung.** Es liegen nur 7 e-tron- und 5 M4-Winkel vor; für
   eine flüssige 360°-Drehung bräuchte es 36+. Gezielte Zoom-Schnitte wirken ohnehin
   hochwertiger als eine Drehung, die man auf jeder Gebrauchtwagen-Seite sieht.
3. **Keine neuen Fotos.** User kann keine machen; Stock-Material wurde verworfen, weil ein
   fremdes Auto neben der echten Galerie unglaubwürdig wirkt.
4. **Kein Freistellen.** Ohne Bildbearbeitungs-Werkzeug (kein ImageMagick/rembg vorhanden)
   würde eine automatische Freistellung an den Lackkanten ausfransen. Stattdessen wird der
   graue Studio-Beton per Vignette + Abdunkelung ins Seiten-Schwarz gezogen. Bleibt als
   spätere Verbesserung offen.

## Die Kapitel

| # | Kapitel | Foto | Effekt |
|---|---------|------|--------|
| 0 | Intro | e-tron GT, Seitenprofil | Langsame Zoom-Annäherung |
| 1 | Unfallinstandsetzung | 5er vorher → nachher | Wipe: Trennlinie zieht „vorher" zu „nachher" |
| 2 | Wartung & Reparatur | e-tron, Front-3/4 | Zoom zur Haube |
| 3 | Felgen & Reifen | M4, Front-3/4 | Zoom auf die Bronze-Felge |
| 4 | Fahrzeuglackierung | e-tron, Front-3/4 glänzend | Licht-Sweep über den Lack |

Der Wipe in Kapitel 1 verbindet zwei **nicht deckungsgleiche** Aufnahmen (vorher =
Seitenprofil, nachher = Front-3/4). Das ist bewusst: beide sind im selben Studio auf
demselben Drehteller bei gleichem Licht entstanden, und die sichtbare Trennlinie plus
„Vorher"/„Nachher"-Labels machen klar, dass es zwei Aufnahmen sind — das übliche
Vorher/Nachher-Idiom. Ein Morph wäre hier falsch.

## Architektur

Ein rAF-Loop treibt alles imperativ über Refs — keine React-Re-Renders pro Scroll-Frame.

- **`lib/carStory.ts`** — Daten + Mathematik, kein React. Kapitel-Texte, Bildpfade,
  Kamera-Keyframes (Zoom + Transform-Origin), Hilfsfunktionen (`clamp01`, `easeInOut`,
  `smooth`, `getChapter`).
- **`hooks/useStoryScroll.ts`** — der Antrieb. Misst die Scroll-Position der Sektion,
  dämpft sie (`p += (target-p) * 0.12` — das erzeugt den filmischen Nachlauf) und ruft
  registrierte Subscriber pro Frame. Gibt eine stabile `subscribe(fn)`-Funktion zurück.
  Der rAF-Loop schläft, sobald `p === target`.
- **`components/story/StoryStage.tsx`** — die Fotoebenen und deren Effekte. Abonniert den
  Progress und schreibt Transform/Opacity direkt auf die DOM-Knoten.
- **`components/story/StoryChapters.tsx`** — Text-Overlays, Kapitel-Geisterzahlen,
  Progress-Rail, Scroll-Hinweis. Ebenfalls Subscriber.
- **`components/CarStory.tsx`** — komponiert die Teile, hält die Sektionshöhe und liefert
  den `prefers-reduced-motion`-Fallback.

### Performance

Der erste Prototyp hing „brutal". Ursache waren pro Frame neu berechnete Effekte auf
großen, gleichzeitig skalierten Bildern. Verbindliche Regeln:

- **Kein `filter`** auf den Fotos (war die Hauptursache), **kein `backdrop-filter`**,
  **kein `mix-blend-mode`**.
- Animiert werden ausschließlich `transform` und `opacity` — beides GPU-Kompositing.
- Inaktive Kapitel bekommen `visibility:hidden` und werden übersprungen; der Browser
  rechnet nie mehr als zwei Ebenen.
- `will-change` nur auf der aktiven Ebene, nicht dauerhaft auf allen.
- Bilder auf 1600 px (Desktop) und 1000 px (Mobil) vorskaliert, JPEG q82 progressiv.
  Gesamt ~1,5 MB gegenüber 12 MB Originalen — plus der komplette three.js-Bundle entfällt.

### Mobil

- Sticky-Höhe `100svh`, damit die iOS-Adressleiste das Layout nicht springen lässt.
- Sektion kürzer (460vh statt 520vh) — auf dem Handy soll man nicht endlos wischen.
- Die Fotos sind 4:3-Querformat. Auf einem Hochformat-Display würde ein Cover-Zuschnitt
  nur einen Streifen Auto zeigen. Deshalb im Hochformat: Bildbreite ~115 % der
  Viewport-Breite, vertikal in den oberen Bereich gesetzt; der Text sitzt unten über
  einem Verlauf. So bleibt das ganze Auto sichtbar.
- Zoom-Amplitude gedämpft (`s = 1 + (s-1) * 0.55`) — weniger GPU-Last und weniger
  Zittern auf schwachen Geräten.
- Das alte rAF-Scroll-Snapping aus `CarStory.tsx` entfällt. Es kämpfte laut eigenem
  Code-Kommentar gegen iOS-Momentum-Scrolling; ohne es fühlt sich Scrollen natürlicher an.

### Datenschutz

Auf den Originalen sind Kennzeichen von Kundenfahrzeugen lesbar (`M-HT 2111 E`, `M-CE …`,
`H-JUR 696`). Die Story-Bilder sind **eigene Derivate** in `public/images/story/`, in die
der Blur mit weicher Maske **fest eingerechnet** ist — kein CSS-Overlay, das man durch
Aufrufen der Bilddatei umgehen könnte. Weicher Gaussian-Blur statt Pixel-Balken, damit es
als Schärfentiefe liest und nicht als Zensur. Die Originale in `public/images/` bleiben
unverändert; die Galerie nutzt sie weiter.

## Nicht im Scope

- Freistellen der Fahrzeuge (Werkzeug fehlt, siehe oben)
- 360°-Drehung (Fotomaterial reicht nicht)
- Änderungen an Galerie, Kontakt, Location, Services
- WebP/AVIF (kein Encoder vorhanden; JPEG q82 ist nah genug)

## Erfolgskriterien

- `npm run build` bleibt grün, statischer Export (`output: 'export'`, basePath
  `/SercanWerkstatt`) funktioniert weiter
- Alle 5 Kapitel laufen scroll-gesteuert, Desktop und Hochformat-Mobil geprüft
- Flüssig: keine Pro-Frame-Layout- oder Filter-Arbeit
- Kein Kennzeichen in `public/images/story/` lesbar
- `prefers-reduced-motion` liefert eine statische, vollständige Variante
- three.js und die drei r3f-Pakete sind aus `package.json` entfernt
