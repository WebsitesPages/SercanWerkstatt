'use client'
import RevealSection from './ui/RevealSection'
import { COMPANY } from '@/lib/constants'

export default function Contact() {
  return (
    <section id="kontakt" className="relative py-20 sm:py-28 px-5 overflow-hidden">
      <div className="section-divider max-w-5xl mx-auto mb-16 sm:mb-20" />

      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <RevealSection>
          <p className="font-body text-xs sm:text-sm text-accent-red uppercase tracking-[0.25em] mb-3 font-semibold">
            Kontakt
          </p>
        </RevealSection>
        <RevealSection delay={0.1} className="mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-carbon-50 uppercase tracking-wide leading-tight">
            Sprechen Sie uns an
          </h2>
        </RevealSection>

        {/* Contact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {/* Phone */}
          <RevealSection delay={0.15}>
            <a
              href={`tel:${COMPANY.phone}`}
              className="group block p-6 rounded-lg bg-carbon-800/50 border border-carbon-700/30
                hover:border-accent-red/30 transition-colors duration-400"
            >
              <PhoneIcon />
              <p className="font-body text-xs text-carbon-500 uppercase tracking-wider mt-4 mb-1">
                Telefon
              </p>
              <p className="font-body text-base sm:text-lg text-carbon-100 group-hover:text-white transition-colors">
                {COMPANY.phoneDisplay}
              </p>
            </a>
          </RevealSection>

          {/* Email */}
          <RevealSection delay={0.2}>
            <a
              href={`mailto:${COMPANY.email}`}
              className="group block p-6 rounded-lg bg-carbon-800/50 border border-carbon-700/30
                hover:border-accent-red/30 transition-colors duration-400"
            >
              <MailIcon />
              <p className="font-body text-xs text-carbon-500 uppercase tracking-wider mt-4 mb-1">
                E-Mail
              </p>
              <p className="font-body text-base sm:text-lg text-carbon-100 group-hover:text-white transition-colors break-all">
                {COMPANY.email}
              </p>
            </a>
          </RevealSection>

          {/* Address */}
          <RevealSection delay={0.25}>
            <a
              href={COMPANY.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-6 rounded-lg bg-carbon-800/50 border border-carbon-700/30
                hover:border-accent-red/30 transition-colors duration-400"
            >
              <LocationIcon />
              <p className="font-body text-xs text-carbon-500 uppercase tracking-wider mt-4 mb-1">
                Adresse
              </p>
              <p className="font-body text-base sm:text-lg text-carbon-100 group-hover:text-white transition-colors">
                {COMPANY.address}
                <br />
                {COMPANY.zip} {COMPANY.city}
              </p>
            </a>
          </RevealSection>
        </div>

        {/* Opening hours placeholder */}
        <RevealSection delay={0.3}>
          <div className="inline-block px-6 py-4 rounded-lg bg-carbon-800/30 border border-carbon-700/20">
            {/*
             * TODO: Öffnungszeiten mit den tatsächlichen Zeiten ersetzen.
             * Die folgenden Zeiten sind Platzhalter.
             */}
            <p className="font-body text-xs text-carbon-500 uppercase tracking-wider mb-2">
              Öffnungszeiten
            </p>
            <p className="font-body text-sm text-carbon-300 leading-relaxed">
              Mo – Fr: nach Vereinbarung
              <br />
              <span className="text-carbon-500">
                Rufen Sie uns an für einen Termin
              </span>
            </p>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

/* ── Icons ─────────────────────────────────────────── */
function PhoneIcon() {
  return (
    <div className="w-10 h-10 mx-auto rounded-full bg-accent-red/10 flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-red">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    </div>
  )
}

function MailIcon() {
  return (
    <div className="w-10 h-10 mx-auto rounded-full bg-accent-red/10 flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-red">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    </div>
  )
}

function LocationIcon() {
  return (
    <div className="w-10 h-10 mx-auto rounded-full bg-accent-red/10 flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-red">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>
  )
}
