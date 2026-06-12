/* Kapitel-Daten + Scroll-Mathematik für den Werkstatt-Film */

export const N_CHAPTERS = 5

export interface Chapter {
  id: string
  kicker: string
  title: string
  lines: string[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    kicker: 'Inal — Karosserie & Lack · München',
    title: 'Ihr Auto.\nUnsere Bühne.',
    lines: ['Scrollen Sie — wir zeigen Ihnen, was wir können.'],
  },
  {
    id: 'unfall',
    kicker: 'Kapitel 01 — Unfallinstandsetzung',
    title: 'Aus tausend Teilen.\nWieder eins.',
    lines: [
      'Karosserie-Instandsetzung wie ab Werk',
      'Präzise Vermessung & Richtarbeit',
      'Komplette Versicherungsabwicklung',
    ],
  },
  {
    id: 'wartung',
    kicker: 'Kapitel 02 — Wartung & Reparatur',
    title: 'Ein Blick\nunter die Haube.',
    lines: [
      'Inspektion & Service aller Marken',
      'Moderne Diagnosetechnik',
      'Öl, Bremsen, Verschleißteile',
    ],
  },
  {
    id: 'reifen',
    kicker: 'Kapitel 03 — Felgen & Reifen',
    title: 'Rundum\nerneuert.',
    lines: [
      'Felgenaufbereitung — vom Bordsteinschaden bis zur Komplettlackierung',
      'Reifenservice & Achsvermessung',
    ],
  },
  {
    id: 'lack',
    kicker: 'Kapitel 04 — Fahrzeuglackierung',
    title: 'Lack wie am\nersten Tag.',
    lines: ['Original-Farbton, perfektes Finish', 'Glanz, der bleibt'],
  },
]

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/* smoothstep zwischen a und b */
export function smooth(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/* Globaler Progress p∈[0,1] → Kapitel-Index + lokales t∈[0,1] */
export function getChapter(p: number): { index: number; t: number } {
  const x = clamp01(p) * N_CHAPTERS
  const index = Math.min(N_CHAPTERS - 1, Math.floor(x))
  return { index, t: clamp01(x - index) }
}

/* Kamera-Keyframes für Kapitel 1–4 (Kapitel 0 = Orbit, im Rig berechnet).
   Auto zeigt nach +X, Breite = Z, Ursprung = Bodenmitte. */
export interface CamKeyframe {
  from: [number, number, number]
  to: [number, number, number]
  tFrom: [number, number, number]
  tTo: [number, number, number]
}

export const CAM: (CamKeyframe | null)[] = [
  null,
  { from: [-4.5, 3.8, 7.2], to: [4.5, 3.2, 6.4], tFrom: [0, 1.0, 0], tTo: [0, 0.9, 0] },
  { from: [5.8, 2.3, 4.2], to: [4.0, 2.0, 2.2], tFrom: [0.8, 0.9, 0], tTo: [1.5, 0.7, 0] },
  { from: [3.8, 1.7, 5.8], to: [3.2, 1.2, 4.6], tFrom: [1.42, 0.5, 0.9], tTo: [1.42, 0.55, 0.9] },
  { from: [1.2, 1.9, 7.8], to: [-6.2, 2.7, 5.6], tFrom: [0, 0.8, 0], tTo: [0, 0.8, 0] },
]
