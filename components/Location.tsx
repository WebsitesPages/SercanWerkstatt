'use client'
import { motion } from 'framer-motion'
import RevealSection from './ui/RevealSection'
import MagneticButton from './ui/MagneticButton'
import { COMPANY } from '@/lib/constants'

export default function Location() {
  return (
    <section id="standort" className="relative py-20 sm:py-28 px-5 overflow-hidden">
      <div className="section-divider max-w-5xl mx-auto mb-16 sm:mb-20" />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <RevealSection>
          <p className="font-body text-xs sm:text-sm text-accent-red uppercase tracking-[0.25em] mb-3 font-semibold">
            Standort
          </p>
        </RevealSection>
        <RevealSection delay={0.1} className="mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-carbon-50 uppercase tracking-wide leading-tight">
            So finden Sie uns
          </h2>
        </RevealSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Address card */}
          <RevealSection direction="left" className="order-2 lg:order-1">
            <div className="p-6 sm:p-8 rounded-lg bg-carbon-800/50 border border-carbon-700/30">
              <div className="mb-6">
                <h3 className="font-display text-2xl sm:text-3xl text-carbon-50 uppercase tracking-wide mb-1">
                  {COMPANY.name}
                </h3>
                <p className="font-body text-sm text-carbon-400">
                  {COMPANY.fullName}
                </p>
              </div>

              <address className="not-italic font-body text-base sm:text-lg text-carbon-200 leading-relaxed mb-8 space-y-1">
                <p>{COMPANY.address}</p>
                <p>
                  {COMPANY.zip} {COMPANY.city}
                </p>
              </address>

              <div className="space-y-3 mb-8">
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="flex items-center gap-3 font-body text-base text-carbon-200 hover:text-white transition-colors"
                >
                  <PhoneIcon />
                  {COMPANY.phoneDisplay}
                </a>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-3 font-body text-base text-carbon-200 hover:text-white transition-colors"
                >
                  <MailIcon />
                  {COMPANY.email}
                </a>
              </div>

              <MagneticButton
                href={COMPANY.mapsUrl}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-accent-red text-white font-body font-semibold text-sm tracking-wide hover:bg-accent-red-light transition-colors rounded-[3px] active:scale-[0.97]"
              >
                <MapPinIcon />
                Route planen
              </MagneticButton>
            </div>
          </RevealSection>

          {/* Map placeholder */}
          <RevealSection direction="right" className="order-1 lg:order-2">
            <div className="relative rounded-lg overflow-hidden aspect-[4/3] lg:aspect-[3/4] bg-carbon-800/40 border border-carbon-700/20">
              {/*
               * Google Maps Embed — ersetze den src unten mit einem echten API-Key
               * oder verwende die kostenlose Embed-URL von Google Maps.
               * Falls kein Embed gewünscht ist, kann hier auch ein statisches
               * Kartenbild eingesetzt werden.
               */}
              <iframe
                title="Standort Renginal"
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2660.5!2d11.55!3d48.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sTagetesstra%C3%9Fe+7%2C+80935+M%C3%BCnchen!5e0!3m2!1sde!2sde!4v1`}
                className="absolute inset-0 w-full h-full border-0 grayscale-[80%] contrast-[1.1] opacity-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-carbon-950/50 via-transparent to-carbon-950/30" />
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

/* ── Icons ─────────────────────────────────────────── */
function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-accent-red">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-accent-red">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
