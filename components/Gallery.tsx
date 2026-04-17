'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RevealSection from './ui/RevealSection'
import BeforeAfterSlider from './ui/BeforeAfterSlider'
import CarShowroom360 from './ui/CarShowroom360'

/* ── Kategorien ────────────────────────────────────── */
const categories = [
  { id: 'alle', label: 'Alle' },
  { id: 'unfall', label: 'Unfallinstandsetzung' },
  { id: 'lack', label: 'Lackierung' },
  { id: 'felgen', label: 'Felgenservice' },
  { id: 'aufbereitung', label: 'Aufbereitung' },
  { id: 'achse', label: 'Achsvermessung' },
] as const

type CategoryId = (typeof categories)[number]['id']

/* ── Gallery Items ─────────────────────────────────── */
/*
 * PLATZHALTER — Ersetze die Gradienten durch echte Bilder:
 *
 * Für BeforeAfter-Slider:
 *   Die Props beforeGradient / afterGradient durch echte <Image> ersetzen
 *   (siehe BeforeAfterSlider.tsx für Details)
 *
 * Für Einzelbilder:
 *   gradient durch <Image src="/images/..." alt="..." fill className="object-cover" /> ersetzen
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '/SercanWerkstatt'

interface BeforeAfterItem {
  type: 'beforeAfter'
  category: CategoryId
  caption: string
  beforeGradient?: string
  afterGradient?: string
  beforeText?: string
  afterText?: string
  beforeSrc?: string
  afterSrc?: string
}

interface SingleItem {
  type: 'single'
  category: CategoryId
  caption: string
  gradient?: string
  text?: string
  tall?: boolean
  src?: string
}

interface ShowroomItem {
  type: 'showroom360'
  category: CategoryId
  caption: string
  images: string[]
}

type GalleryItem = BeforeAfterItem | SingleItem | ShowroomItem

const items: GalleryItem[] = [
  /* ── Unfallinstandsetzung ────────────────────── */
  {
    type: 'beforeAfter',
    category: 'unfall',
    caption: 'Seitenteil — Unfallinstandsetzung komplett',
    beforeSrc: `${BASE}/images/unfall-seite-vorher.jpg`,
    afterSrc: `${BASE}/images/unfall-seite-nachher.jpg`,
  },
  {
    type: 'beforeAfter',
    category: 'unfall',
    caption: 'Stoßfänger vorne — Komplettinstandsetzung',
    beforeSrc: `${BASE}/images/unfall-vorher-2.jpg`,
    afterSrc: `${BASE}/images/unfall-nachher-2.jpg`,
  },
  {
    type: 'single',
    category: 'unfall',
    caption: 'Karosseriearbeit — Richtbank-Detail',
    gradient: 'from-carbon-800 via-carbon-700/50 to-carbon-900',
    text: 'Bild: Karosseriearbeit auf der Richtbank',
  },

  /* ── Lackierung ──────────────────────────────── */
  {
    type: 'beforeAfter',
    category: 'lack',
    caption: 'Motorhaube — Neulackierung in Originalfarbe',
    beforeGradient: 'from-stone-700 via-stone-800/80 to-stone-900',
    afterGradient: 'from-red-900/50 via-red-800/30 to-carbon-800',
    beforeText: 'Vorher-Bild: matte Lackoberfläche',
    afterText: 'Nachher-Bild: frische Lackierung',
  },
  {
    type: 'single',
    category: 'lack',
    caption: 'Metallic-Finish — Klarlack-Detail',
    gradient: 'from-red-950/30 via-carbon-800 to-carbon-900',
    text: 'Bild: Metallic-Lackierung Nahaufnahme',
    tall: true,
  },
  {
    type: 'single',
    category: 'lack',
    caption: 'Farbtonanalyse und -anpassung',
    gradient: 'from-amber-950/20 via-carbon-800 to-carbon-900',
    text: 'Bild: Farbtonmessung am Fahrzeug',
  },

  /* ── Felgenservice ───────────────────────────── */
  {
    type: 'beforeAfter',
    category: 'felgen',
    caption: 'Alufelge — Bordsteinschaden repariert',
    beforeGradient: 'from-stone-700 via-amber-900/15 to-stone-800',
    afterGradient: 'from-zinc-500 via-zinc-400/80 to-zinc-600',
    beforeText: 'Vorher-Bild: Felge mit Bordsteinschaden',
    afterText: 'Nachher-Bild: aufbereitete Felge',
  },
  {
    type: 'single',
    category: 'felgen',
    caption: 'Felgensatz nach Komplettlackierung',
    gradient: 'from-carbon-700 via-zinc-800/40 to-carbon-900',
    text: 'Bild: lackierte Felgen im Set',
  },

  /* ── Aufbereitung ────────────────────────────── */
  {
    type: 'beforeAfter',
    category: 'aufbereitung',
    caption: 'Außenaufbereitung — Politur & Versiegelung',
    beforeSrc: `${BASE}/images/Aufbereitung-vorher.jpg`,
    afterSrc: `${BASE}/images/Aufbereitung-nachher.jpg`,
  },
  {
    type: 'single',
    category: 'aufbereitung',
    caption: 'Fahrzeugaufbereitung — Ergebnis',
    src: `${BASE}/images/Aufbereitung-1.jpg`,
    gradient: '',
    text: '',
  },
  {
    type: 'single',
    category: 'aufbereitung',
    caption: 'Fahrzeugaufbereitung — Detail',
    src: `${BASE}/images/Aufbereitung-2.jpg`,
    gradient: '',
    text: '',
  },
  {
    type: 'single',
    category: 'aufbereitung',
    caption: 'Fahrzeugaufbereitung — Komplettansicht',
    src: `${BASE}/images/Aufbereitung-3.jpg`,
    gradient: '',
    text: '',
  },
  {
    type: 'showroom360',
    category: 'aufbereitung',
    caption: 'Audi e-tron GT — 360° Showroom nach Aufbereitung',
    images: [
      `${BASE}/images/etron6.jpg`,
      `${BASE}/images/etron1.jpg`,
      `${BASE}/images/etron4.jpg`,
      `${BASE}/images/etron3.jpg`,
      `${BASE}/images/etron7.jpg`,
      `${BASE}/images/etron2.jpg`,
      `${BASE}/images/etron5.jpg`,
    ],
  },
  {
    type: 'showroom360',
    category: 'aufbereitung',
    caption: 'BMW M4 Competition — 360° Showroom nach Aufbereitung',
    images: [
      `${BASE}/images/m4.jpg`,
      `${BASE}/images/m4-3.jpg`,
      `${BASE}/images/m4-2.jpg`,
      `${BASE}/images/m4-5.jpg`,
      `${BASE}/images/m4-4.jpg`,
    ],
  },

  /* ── Achsvermessung ──────────────────────────── */
  {
    type: 'single',
    category: 'achse',
    caption: 'Achsvermessung am Prüfstand',
    gradient: 'from-carbon-800 via-blue-950/15 to-carbon-900',
    text: 'Bild: Fahrzeug auf dem Achsmessstand',
    tall: true,
  },
  {
    type: 'single',
    category: 'achse',
    caption: 'Messergebnis und Protokoll',
    gradient: 'from-carbon-800 via-carbon-700/40 to-carbon-900',
    text: 'Bild: Achsvermessungs-Protokoll',
  },
]

/* ── Ease ──────────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1] as const

/* ── Component ─────────────────────────────────────── */
export default function Gallery() {
  const [active, setActive] = useState<CategoryId>('alle')

  const filtered =
    active === 'alle' ? items : items.filter((i) => i.category === active)

  return (
    <section id="galerie" className="relative py-20 sm:py-28 px-5 overflow-hidden">
      <div className="section-divider max-w-5xl mx-auto mb-16 sm:mb-20" />

      <div className="max-w-6xl mx-auto">
        {/* ── Header ───────────────────────────────── */}
        <RevealSection>
          <p className="font-body text-xs sm:text-sm text-accent-red uppercase tracking-[0.25em] mb-3 font-semibold">
            Eindrücke
          </p>
        </RevealSection>
        <RevealSection delay={0.1} className="mb-10 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-carbon-50 uppercase tracking-wide leading-tight">
            Aus der Werkstatt
          </h2>
        </RevealSection>

        {/* ── Category Tabs ────────────────────────── */}
        <RevealSection delay={0.15} className="mb-10 sm:mb-14">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {categories.map((cat) => {
              const count =
                cat.id === 'alle'
                  ? items.length
                  : items.filter((i) => i.category === cat.id).length
              const isActive = active === cat.id

              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`relative flex-shrink-0 px-4 py-2.5 rounded-sm font-body text-xs sm:text-sm tracking-wide uppercase transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'text-white bg-carbon-800/80 border border-accent-red/40'
                      : 'text-carbon-400 bg-carbon-800/30 border border-carbon-700/30 hover:text-carbon-200 hover:border-carbon-600/50'
                  }`}
                >
                  {cat.label}
                  <span
                    className={`ml-1.5 text-[0.6rem] ${
                      isActive ? 'text-accent-red' : 'text-carbon-500'
                    }`}
                  >
                    {count}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="galleryActiveTab"
                      className="absolute -bottom-[1px] left-2 right-2 h-[2px] bg-accent-red rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </RevealSection>

        {/* ── Gallery Grid ─────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease }}
          >
            {filtered.map((item, i) => {
              if (item.type === 'beforeAfter') {
                return (
                  <div
                    key={`${item.category}-ba-${i}`}
                    className="sm:col-span-2"
                  >
                    <BeforeAfterSlider
                      beforeGradient={item.beforeGradient}
                      afterGradient={item.afterGradient}
                      beforeText={item.beforeText}
                      afterText={item.afterText}
                      beforeSrc={item.beforeSrc}
                      afterSrc={item.afterSrc}
                      caption={item.caption}
                    />
                  </div>
                )
              }

              if (item.type === 'showroom360') {
                return (
                  <div
                    key={`${item.category}-360-${i}`}
                    className="sm:col-span-2"
                  >
                    <CarShowroom360
                      images={item.images}
                      caption={item.caption}
                    />
                  </div>
                )
              }

              /* ── Single image ─────────────────────── */
              return (
                <motion.div
                  key={`${item.category}-s-${i}`}
                  className={`group relative overflow-hidden rounded-lg ${
                    item.tall ? 'sm:row-span-2' : ''
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{
                    duration: 0.65,
                    delay: i * 0.05,
                    ease,
                  }}
                >
                  <div
                    className={`relative w-full ${
                      item.tall
                        ? 'aspect-[3/4] sm:aspect-auto sm:h-full min-h-[280px]'
                        : 'aspect-[4/3]'
                    } transition-transform duration-700 group-hover:scale-[1.04] overflow-hidden`}
                  >
                    {item.src ? (
                      <img src={item.src} alt={item.caption} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}>
                        <span className="absolute inset-0 flex items-center justify-center font-body text-[0.6rem] text-carbon-500/30 tracking-widest uppercase p-4 text-center leading-relaxed">
                          {item.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/80 via-carbon-950/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-body text-xs sm:text-sm text-carbon-200 tracking-wide leading-relaxed">
                      {item.caption}
                    </p>
                  </div>

                  {/* Light sweep on hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[.05] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
