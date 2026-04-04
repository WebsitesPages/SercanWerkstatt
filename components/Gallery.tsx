'use client'
import { motion } from 'framer-motion'
import RevealSection from './ui/RevealSection'
import { GALLERY_ITEMS } from '@/lib/constants'
import Image from 'next/image'

const ease = [0.22, 1, 0.36, 1] as const

/*
 * PLACEHOLDER-GALERIE
 * Jedes Bild-Element enthält einen CSS-Gradienten als Platzhalter.
 * Ersetze die <div>-Hintergründe durch echte <Image>-Komponenten:
 *
 *   import Image from 'next/image'
 *   <Image src="/images/gallery-1.jpg" alt={item.label} fill className="object-cover" />
 *
 * Empfohlene echte Bilder:
 *   1. Lackierung vorher/nachher
 *   2. Karosseriearbeit Detail
 *   3. Felgenaufbereitung
 *   4. Werkstatt / Arbeitsumgebung
 *   5. Detailarbeit Lack-Finish
 *   6. Fertiggestelltes Fahrzeug / Übergabe
 */

export default function Gallery() {
  return (
    <section id="galerie" className="relative py-20 sm:py-28 px-5 overflow-hidden">
      <div className="section-divider max-w-5xl mx-auto mb-16 sm:mb-20" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <RevealSection>
          <p className="font-body text-xs sm:text-sm text-accent-red uppercase tracking-[0.25em] mb-3 font-semibold">
            Eindrücke
          </p>
        </RevealSection>
        <RevealSection delay={0.1} className="mb-14 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-carbon-50 uppercase tracking-wide leading-tight">
            Aus der Werkstatt
          </h2>
        </RevealSection>

        {/* Masonry-ish grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {GALLERY_ITEMS.map((item, i) => {
            /* Vary aspect ratios for visual interest */
            const tall = i === 1 || i === 4
            return (
              <motion.div
                key={item.label}
                className={`relative overflow-hidden rounded-lg group ${
                  tall ? 'sm:row-span-2' : ''
                }`}
                initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0.3 }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{
                  duration: 0.85,
                  delay: i * 0.08,
                  ease,
                }}
              >
                {/* Placeholder gradient – HIER ECHTES BILD EINSETZEN */}
                <Image
  src="/images/gallery-1.jpg"
  alt="Lackierung vorher/nachher"
  fill
  className="object-cover"
/>

                {/* Label overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/80 via-transparent to-transparent flex items-end p-4 sm:p-5">
                  <span className="font-body text-xs sm:text-sm text-carbon-300 tracking-wide">
                    {item.label}
                  </span>
                </div>

                {/* Hover light sweep (desktop) */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[.06] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
