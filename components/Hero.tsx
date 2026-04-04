'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import SplitText from './ui/SplitText'
import MagneticButton from './ui/MagneticButton'
import { COMPANY } from '@/lib/constants'

const ease = [0.22, 1, 0.36, 1] as const

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.96])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative h-[100svh] min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* ── Background layers ──────────────────────── */}
      <motion.div className="absolute inset-0 gpu" style={{ y: bgY }}>
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-carbon-950 via-carbon-900 to-carbon-950" />

        {/* Red radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(201,42,42,0.07)_0%,transparent_70%)]" />

        {/* Animated diagonal hatching */}
        <motion.div
          className="absolute inset-0 opacity-[0.025]"
          animate={{ backgroundPosition: ['0px 0px', '80px 80px'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg,transparent,transparent 30px,rgba(255,255,255,0.15) 30px,rgba(255,255,255,0.15) 31px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Initial light sweep (plays once) */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-120%' }}
          animate={{ x: '220%' }}
          transition={{ duration: 2.2, delay: 0.6, ease }}
        >
          <div className="h-full w-1/4 bg-gradient-to-r from-transparent via-white/[.08] to-transparent skew-x-[-12deg]" />
        </motion.div>

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

      {/* ── Content ────────────────────────────────── */}
      <motion.div
        className="relative z-10 text-center px-5 max-w-4xl mx-auto"
        style={{ opacity: contentOpacity, scale: contentScale }}
      >
        {/* Brand name – clip-path reveal */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1.3, delay: 0.4, ease }}
        >
          <h1 className="font-display text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[7rem] text-carbon-50 uppercase tracking-[0.06em] leading-[0.95]">
            Inal
          </h1>
        </motion.div>

        {/* Accent line */}
        <motion.div
          className="h-[2px] mx-auto mt-4 mb-5 bg-gradient-to-r from-transparent via-accent-red to-transparent origin-center"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.1, ease }}
          style={{ maxWidth: '55%' }}
        />

        {/* Tagline – split-text reveal */}
        <div className="overflow-hidden mb-3">
          <SplitText
            text="Unfallinstandsetzung + Fahrzeuglackierung"
            className="font-display text-base sm:text-lg md:text-xl text-carbon-300 uppercase tracking-[0.18em] leading-relaxed"
            delay={1.3}
            stagger={0.018}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          className="font-body text-sm sm:text-base text-carbon-400 mb-10 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8, ease }}
        >
          Ihr Experte für Karosserie &amp; Lack in München — Präzision,
          Qualität und persönlicher Anspruch.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.1, ease }}
        >
          <MagneticButton
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-accent-red text-white font-body font-semibold text-base tracking-wide hover:bg-accent-red-light transition-colors rounded-[3px] active:scale-[0.97] transition-transform"
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

      {/* ── Scroll indicator ───────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        <motion.span
          className="text-carbon-500 text-[0.65rem] font-body uppercase tracking-[0.25em]"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
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

      {/* ── Bottom fade-out ────────────────────────── */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-carbon-950 to-transparent pointer-events-none" />
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
