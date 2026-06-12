'use client'
import { useRef } from 'react'
import {
  motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion,
} from 'framer-motion'
import MagneticButton from './ui/MagneticButton'
import { COMPANY } from '@/lib/constants'

const ease = [0.22, 1, 0.36, 1] as const

/* Logo-Buchstaben als SVG-Vektoren — bleiben beim Zoom gestochen scharf.
   Positionen manuell auf die Antonio-Glyphen abgestimmt. */
const LETTERS = [
  { c: 'I', x: -157 },
  { c: 'N', x: -63 },
  { c: 'A', x: 39 },
  { c: 'L', x: 137 },
]
const BASELINE = 64
const LETTER_STYLE = { fontFamily: 'var(--font-antonio), sans-serif', fontWeight: 700 } as const

export default function Hero() {
  const wrapperRef = useRef(null)
  const logoGroupRef = useRef<SVGGElement | null>(null)
  const reduced = useReducedMotion()

  /* Scroll progress across the tall wrapper */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  /* ── INAL-Vektor-Zoom ────────────────────────────── */
  /* Die Kamera taucht zwischen N und A durch den Schriftzug. Der Zoom läuft
     als SVG-Attribut-Transform: Vektoren werden pro Frame neu gezeichnet
     und bleiben — anders als CSS-Scale auf Text — immer scharf. */
  const inalScale = useTransform(scrollYProgress, [0, 0.15, 0.7], [1, 1, 18])
  const inalOpacity = useTransform(scrollYProgress, [0, 0.15, 0.55, 0.7], [1, 1, 0.6, 0])

  useMotionValueEvent(inalScale, 'change', (s) => {
    const g = logoGroupRef.current
    if (!g) return
    /* Skalierung um den Punkt zwischen N und A (cx/cy), leicht über Mitte */
    const cx = -12
    const cy = 8
    g.setAttribute(
      'transform',
      `translate(${(cx * (1 - s)).toFixed(2)} ${(cy * (1 - s)).toFixed(2)}) scale(${s.toFixed(4)})`
    )
  })

  /* Letterbox-Balken fahren während des Zooms rein (Kino-Vorhang) */
  const barHeight = useTransform(scrollYProgress, [0.18, 0.55], ['0%', '13%'])

  /* Subtitle, buttons etc. fade out earlier */
  const contentOpacity = useTransform(scrollYProgress, [0, 0.1, 0.35], [1, 1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.1, 0.35], [0, 0, -30])

  /* Scroll indicator fades immediately */
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0])

  /* Background parallax */
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={wrapperRef} id="hero" className="relative" style={{ height: '170vh' }}>
      {/* ── Sticky viewport ────────────────────────── */}
      <div className="sticky top-0 h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* ── Background layers ──────────────────── */}
        <motion.div className="absolute inset-0 gpu" style={{ y: bgY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-carbon-950 via-carbon-900 to-carbon-950" />

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(201,42,42,0.07)_0%,transparent_70%)]" />

          {/* Subtle diagonal hatching */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.15) 30px,rgba(255,255,255,0.15) 31px)',
              backgroundSize: '56px 56px',
            }}
          />

          {/* Slow ambient light pulse */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0, 0.04, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              background:
                'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(201,42,42,0.12) 0%, transparent 100%)',
            }}
          />
        </motion.div>

        {/* ── All content in one vertical flow ──── */}
        <div className="relative z-10 text-center px-5 max-w-4xl mx-auto flex flex-col items-center">
          {/* INAL — Chrom-Logo, Buchstaben steigen einzeln auf, Glanz-Sweep,
              scharfer Vektor-Zoom beim Scrollen */}
          <h1 className="sr-only">Inal — Unfallinstandsetzung + Fahrzeuglackierung München</h1>
          {reduced ? (
            <div
              className="font-display text-[4rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] text-carbon-50 uppercase tracking-[0.08em] leading-none select-none"
              aria-hidden
            >
              Inal
            </div>
          ) : (
            <motion.div style={{ opacity: inalOpacity }} className="select-none" aria-hidden>
              <svg
                viewBox="-300 -95 600 190"
                overflow="visible"
                className="w-[min(86vw,620px)] h-auto"
              >
                <defs>
                  <linearGradient id="inalChrome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f6f6f7" />
                    <stop offset="0.42" stopColor="#cbcdd1" />
                    <stop offset="0.52" stopColor="#86888d" />
                    <stop offset="0.72" stopColor="#e9eaec" />
                    <stop offset="1" stopColor="#94969b" />
                  </linearGradient>
                  <linearGradient id="inalSweep" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#fff" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#fff" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="inalClip">
                    {LETTERS.map((l) => (
                      <text
                        key={l.c}
                        x={l.x}
                        y={BASELINE}
                        textAnchor="middle"
                        fontSize="150"
                        style={LETTER_STYLE}
                      >
                        {l.c}
                      </text>
                    ))}
                  </clipPath>
                  {/* Lackier-Wipe: füllt die Konturen von links nach rechts */}
                  <clipPath id="inalPaintWipe">
                    <motion.rect
                      x={-310}
                      y={-95}
                      height={190}
                      initial={{ width: 0 }}
                      animate={{ width: 640 }}
                      transition={{ delay: 0.75, duration: 0.95, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </clipPath>
                </defs>

                <g ref={logoGroupRef}>
                  {/* 1. Kontur-Anriss: Buchstaben als feine Linien, wie vorm Lackieren */}
                  {LETTERS.map((l, i) => (
                    <motion.text
                      key={`outline-${l.c}`}
                      x={l.x}
                      y={BASELINE}
                      textAnchor="middle"
                      fontSize="150"
                      fill="none"
                      stroke="#84878c"
                      strokeWidth="1.3"
                      style={LETTER_STYLE}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.9, 0.9, 0] }}
                      transition={{
                        duration: 1.7, delay: 0.15 + i * 0.09,
                        times: [0, 0.3, 0.6, 1], ease: 'easeOut',
                      }}
                    >
                      {l.c}
                    </motion.text>
                  ))}

                  {/* 2. Lackierung: Chrom-Füllung zieht von links nach rechts durch */}
                  <g clipPath="url(#inalPaintWipe)">
                    {LETTERS.map((l) => (
                      <text
                        key={`fill-${l.c}`}
                        x={l.x}
                        y={BASELINE}
                        textAnchor="middle"
                        fontSize="150"
                        fill="url(#inalChrome)"
                        style={LETTER_STYLE}
                      >
                        {l.c}
                      </text>
                    ))}
                  </g>

                  {/* Glanzlicht an der frischen Lack-Kante */}
                  <g clipPath="url(#inalClip)">
                    <motion.rect
                      y={-95}
                      width={46}
                      height={190}
                      fill="url(#inalSweep)"
                      initial={{ x: -330, opacity: 1 }}
                      animate={{ x: 320, opacity: 0 }}
                      transition={{
                        x: { delay: 0.75, duration: 0.95, ease: [0.4, 0, 0.2, 1] },
                        opacity: { delay: 1.7, duration: 0.25 },
                      }}
                    />
                  </g>

                  {/* 3. Wiederkehrender Glanz-Sweep wie Licht über Autolack */}
                  <g clipPath="url(#inalClip)">
                    <motion.rect
                      y={-95}
                      width={150}
                      height={190}
                      fill="url(#inalSweep)"
                      transform="skewX(-18)"
                      initial={{ x: -430 }}
                      animate={{ x: 430 }}
                      transition={{
                        delay: 2.2, duration: 1.1, ease: 'easeInOut',
                        repeat: Infinity, repeatDelay: 4.5,
                      }}
                    />
                  </g>
                </g>
              </svg>
            </motion.div>
          )}

          {/* Rest of content – fades out earlier on scroll */}
          <motion.div
            className="flex flex-col items-center mt-6"
            style={{ opacity: contentOpacity, y: contentY }}
          >
            {/* Accent line */}
            <motion.div
              className="h-[2px] w-full mb-5 bg-gradient-to-r from-transparent via-accent-red to-transparent origin-center"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.05, ease }}
              style={{ maxWidth: '50%' }}
            />

            {/* Tagline */}
            <motion.p
              className="font-display text-sm sm:text-base md:text-lg text-carbon-300 uppercase leading-relaxed mb-3"
              initial={{ opacity: 0, y: 12, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.18em' }}
              transition={{ duration: 1.1, delay: 1.2, ease }}
            >
              Unfallinstandsetzung + Fahrzeuglackierung
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="font-body text-sm sm:text-base text-carbon-400 mb-10 max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.35, ease }}
            >
              Ihr Experte für Karosserie &amp; Lack in München — Präzision,
              Qualität und persönlicher Anspruch.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5, ease }}
            >
              <MagneticButton
                href={`tel:${COMPANY.phone}`}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-accent-red text-white font-body font-semibold text-base tracking-wide hover:bg-accent-red-light transition-colors rounded-[3px] active:scale-[0.97]"
              >
                <PhoneIcon />
                Jetzt anrufen
              </MagneticButton>

              <MagneticButton
                href={COMPANY.mapsUrl}
                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 border border-carbon-600 text-carbon-200 font-body font-semibold text-base tracking-wide hover:border-carbon-400 hover:text-white transition-all rounded-[3px] active:scale-[0.97]"
              >
                <MapIcon />
                Route planen
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ─────────────────────── */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <motion.span
            className="text-carbon-500 text-[0.65rem] font-body uppercase tracking-[0.25em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          >
            Scrollen
          </motion.span>
          <motion.div
            className="w-[1px] h-7 bg-gradient-to-b from-carbon-500 to-transparent"
            animate={{ scaleY: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originY: 0 }}
          />
        </motion.div>

        {/* ── Letterbox-Vorhang während des Logo-Zooms ── */}
        <motion.div
          className="absolute top-0 inset-x-0 bg-carbon-950 z-20 pointer-events-none"
          style={{ height: barHeight }}
        />
        <motion.div
          className="absolute bottom-0 inset-x-0 bg-carbon-950 z-20 pointer-events-none"
          style={{ height: barHeight }}
        />

        {/* ── Bottom fade ──────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-carbon-950 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}

/* ── Inline icons ─────────────────────────────────── */
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
