'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import RevealSection from './ui/RevealSection'
import { WHY_REASONS } from '@/lib/constants'

const ease = [0.22, 1, 0.36, 1] as const

export default function WhyRenginal() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const bgX = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  return (
    <section
      ref={sectionRef}
      id="warum"
      className="relative py-20 sm:py-28 px-5 overflow-hidden"
    >
      {/* Ambient background gradient that shifts with scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ x: bgX }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_50%,rgba(201,42,42,0.04)_0%,transparent_70%)]" />
      </motion.div>

      <div className="section-divider max-w-5xl mx-auto mb-16 sm:mb-20" />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <RevealSection>
          <p className="font-body text-xs sm:text-sm text-accent-red uppercase tracking-[0.25em] mb-3 font-semibold">
            Warum Inal
          </p>
        </RevealSection>
        <RevealSection delay={0.1} className="mb-14 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-carbon-50 uppercase tracking-wide leading-tight max-w-xl">
            Werkstatt mit Anspruch
          </h2>
        </RevealSection>

        {/* Reason cards – staggered reveal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {WHY_REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              className="group relative p-6 sm:p-8 rounded-lg
                bg-gradient-to-br from-carbon-800/60 to-carbon-900/80
                border border-carbon-700/30 overflow-hidden
                hover:border-carbon-600/50 transition-colors duration-500"
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.65, delay: i * 0.1, ease }}
            >
              {/* Subtle top-left accent */}
              <div className="absolute top-0 left-0 w-12 h-[2px] bg-accent-red/60 rounded-full" />
              <div className="absolute top-0 left-0 h-12 w-[2px] bg-accent-red/60 rounded-full" />

              <h3 className="font-display text-xl md:text-2xl text-carbon-50 uppercase tracking-wide mb-3">
                {r.title}
              </h3>
              <p className="font-body text-sm md:text-base text-carbon-300 leading-relaxed">
                {r.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
