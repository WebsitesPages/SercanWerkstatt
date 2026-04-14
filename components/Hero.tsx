'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import MagneticButton from './ui/MagneticButton'
import { COMPANY } from '@/lib/constants'

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const wrapperRef = useRef(null)

  /* Scroll progress across the tall wrapper (250vh) */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end start'],
  })

  /* ── INAL zoom effect ────────────────────────────── */
  /* Stays normal for the first ~20%, then scales up massively */
  const inalScale = useTransform(scrollYProgress, [0, 0.15, 0.7], [1, 1, 18])
  const inalOpacity = useTransform(scrollYProgress, [0, 0.15, 0.55, 0.7], [1, 1, 0.6, 0])

  /* Subtitle, buttons etc. fade out earlier */
  const contentOpacity = useTransform(scrollYProgress, [0, 0.1, 0.35], [1, 1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.1, 0.35], [0, 0, -30])

  /* Scroll indicator fades immediately */
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05, 0.12], [1, 1, 0])

  /* Background parallax */
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section ref={wrapperRef} id="hero" className="relative" style={{ height: '250vh' }}>
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

        {/* ── INAL – zoom on scroll ───────────────── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          style={{ scale: inalScale, opacity: inalOpacity }}
        >
          <motion.h1
            className="font-display text-[4rem] sm:text-7xl md:text-8xl lg:text-[7.5rem] text-carbon-50 uppercase tracking-[0.08em] leading-none select-none"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
          >
            Inal
          </motion.h1>
        </motion.div>

        {/* ── Rest of content (fades out earlier) ── */}
        <motion.div
          className="relative z-10 text-center px-5 max-w-4xl mx-auto mt-32 sm:mt-36"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          {/* Accent line */}
          <motion.div
            className="h-[2px] mx-auto mb-5 bg-gradient-to-r from-transparent via-accent-red to-transparent origin-center"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            style={{ maxWidth: '50%' }}
          />

          {/* Tagline */}
          <motion.p
            className="font-display text-sm sm:text-base md:text-lg text-carbon-300 uppercase tracking-[0.18em] leading-relaxed mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
          >
            Unfallinstandsetzung + Fahrzeuglackierung
          </motion.p>

          {/* Subtitle */}
          <motion.p
            className="font-body text-sm sm:text-base text-carbon-400 mb-10 max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
          >
            Ihr Experte für Karosserie &amp; Lack in München — Präzision,
            Qualität und persönlicher Anspruch.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1, ease }}
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
