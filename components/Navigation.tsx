'use client'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

const links = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Warum wir', href: '#warum' },
  { label: 'Ablauf', href: '#ablauf' },
  { label: 'Galerie', href: '#galerie' },
  { label: 'Standort', href: '#standort' },
  { label: 'Kontakt', href: '#kontakt' },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    [],
  )

  return (
    <>
      {/* ── Top bar ─────────────────────────────────── */}
      <motion.header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-carbon-950/85 backdrop-blur-xl border-b border-carbon-800/40'
            : 'bg-transparent'
        }`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('#hero')}
            className="font-display text-[1.5rem] text-carbon-50 uppercase tracking-[0.12em]"
          >
            Renginal
          </button>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-7">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => navigate(l.href)}
                className="font-body text-[0.8rem] text-carbon-400 hover:text-carbon-50 transition-colors duration-300 uppercase tracking-widest"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href={`tel:${COMPANY.phone}`}
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2 bg-accent-red text-white font-body font-semibold text-sm tracking-wide hover:bg-accent-red-light transition-colors rounded-[3px]"
          >
            <PhoneSmall />
            Anrufen
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-[6px]"
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          >
            <motion.span
              className="block w-6 h-[2px] bg-carbon-50 origin-center"
              animate={{ rotate: open ? 45 : 0, y: open ? 8 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
            <motion.span
              className="block w-6 h-[2px] bg-carbon-50"
              animate={{ opacity: open ? 0 : 1, scaleX: open ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-[2px] bg-carbon-50 origin-center"
              animate={{ rotate: open ? -45 : 0, y: open ? -8 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            />
          </button>
        </div>
      </motion.header>

      {/* ── Full-screen mobile menu ────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-carbon-950/[.97] backdrop-blur-2xl flex flex-col items-center justify-center gap-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {links.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => navigate(l.href)}
                className="font-display text-3xl sm:text-4xl text-carbon-200 uppercase tracking-wider hover:text-accent-red transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {l.label}
              </motion.button>
            ))}

            <motion.a
              href={`tel:${COMPANY.phone}`}
              className="mt-6 inline-flex items-center gap-3 px-8 py-4 bg-accent-red text-white font-body font-semibold text-lg tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.4 }}
            >
              <PhoneSmall />
              Jetzt anrufen
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function PhoneSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
