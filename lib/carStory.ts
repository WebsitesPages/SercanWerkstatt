/* Kapitel-Daten, Bildpfade und Scroll-Mathematik für den Werkstatt-Film.
   Kein React — reine Daten und Funktionen. */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '/SercanWerkstatt'
const img = (name: string) => `${BASE}/images/story/${name}.jpg`

export const N_CHAPTERS = 5

/* Kamera-Keyframe: Zoom-Verlauf und der Punkt, auf den zugefahren wird.
   `origin` ist ein CSS-transform-origin — dorthin „fährt" die Kamera. */
export interface CamKeyframe {
  from: number
  to: number
  origin: string
}

export interface Chapter {
  id: string
  kicker: string
  title: string
  lines: string[]
  /* Bild ohne Endung/Größe — `-sm` ist die Mobil-Variante */
  image: string
  alt: string
  /* Vertikale Ausrichtung des Bildausschnitts, 0 = oben, 1 = unten */
  focusY: number
  cam: CamKeyframe
  /* Zweites Bild für den Vorher/Nachher-Wipe */
  wipeTo?: { image: string; alt: string }
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    kicker: 'Inal — Karosserie & Lack · München',
    title: 'Ihr Auto.\nUnsere Bühne.',
    lines: ['Scrollen Sie — wir zeigen Ihnen, was wir können.'],
    image: 'intro',
    alt: 'Audi e-tron GT im Seitenprofil, aufbereitet in unserem Studio',
    focusY: 0.58,
    cam: { from: 1.02, to: 1.1, origin: '50% 58%' },
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
    image: 'unfall-vorher',
    alt: 'BMW 5er mit schwerem Unfallschaden an der Fahrerseite, vor der Instandsetzung',
    focusY: 0.6,
    cam: { from: 1.0, to: 1.06, origin: '45% 62%' },
    wipeTo: {
      image: 'unfall-nachher',
      alt: 'Derselbe BMW 5er nach der Instandsetzung, Karosserie und Lack wiederhergestellt',
    },
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
    image: 'wartung',
    alt: 'Audi e-tron GT, Ansicht auf Front und Vorderrad',
    focusY: 0.6,
    cam: { from: 1.05, to: 1.32, origin: '30% 66%' },
  },
  {
    id: 'reifen',
    kicker: 'Kapitel 03 — Felgen & Reifen',
    title: 'Rundum\nerneuert.',
    lines: [
      'Felgenaufbereitung — vom Bordsteinschaden bis zur Komplettlackierung',
      'Reifenservice & Achsvermessung',
    ],
    image: 'felgen',
    alt: 'BMW M4 Competition mit aufbereiteten Bronze-Felgen',
    focusY: 0.62,
    cam: { from: 1.1, to: 1.65, origin: '52% 74%' },
  },
  {
    id: 'lack',
    kicker: 'Kapitel 04 — Fahrzeuglackierung',
    title: 'Lack wie am\nersten Tag.',
    lines: ['Original-Farbton, perfektes Finish', 'Glanz, der bleibt'],
    image: 'lack',
    alt: 'Audi e-tron GT mit frisch aufbereitetem, spiegelndem schwarzem Lack',
    focusY: 0.6,
    cam: { from: 1.15, to: 1.4, origin: '62% 60%' },
  },
]

/* Breite der Zoom-through-Überblendung, als Anteil eines Kapitels */
export const CROSSFADE = 0.09

/* Bildquellen für <picture>: Desktop und Mobil */
export function sources(name: string) {
  return { full: img(name), small: img(`${name}-sm`) }
}

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

/* Sichtbarkeit und Zoom einer Kapitel-Ebene beim aktuellen Progress.
   An den Kapitelgrenzen überlagern sich zwei Ebenen: die alte zoomt weiter
   heran und blendet aus, die neue kommt leicht zurückgesetzt herein — das
   liest sich als Kamera-Schnitt, nicht als Diashow. */
export function frameState(i: number, index: number, t: number) {
  let opacity = 0
  let nudge = 0

  if (i === index) {
    opacity = 1
    if (t > 1 - CROSSFADE && i < N_CHAPTERS - 1) {
      opacity = 1 - smooth(1 - CROSSFADE, 1, t)
      nudge = (1 - opacity) * 0.1
    }
  } else if (i === index + 1 && t > 1 - CROSSFADE) {
    opacity = smooth(1 - CROSSFADE, 1, t)
    nudge = -(1 - opacity) * 0.08
  }

  const local = i === index ? t : i === index + 1 ? 0 : 1
  const cam = CHAPTERS[i].cam
  const scale = cam.from + (cam.to - cam.from) * easeInOut(local) + nudge

  return { opacity, scale }
}
