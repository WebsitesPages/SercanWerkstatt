'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import RevealSection from './ui/RevealSection'
import { PROCESS_STEPS } from '@/lib/constants'

const ease = [0.22, 1, 0.36, 1] as const

export default function Process() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.75', 'end 0.65'],
  })

  /* The vertical timeline line grows from 0 → 100% as user scrolls */
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="ablauf" className="relative py-20 sm:py-28 px-5 overflow-hidden">
      <div className="section-divider max-w-5xl mx-auto mb-16 sm:mb-20" />

      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <RevealSection>
          <p className="font-body text-xs sm:text-sm text-accent-red uppercase tracking-[0.25em] mb-3 font-semibold">
            Ablauf
          </p>
        </RevealSection>
        <RevealSection delay={0.1} className="mb-16 sm:mb-20">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-carbon-50 uppercase tracking-wide leading-tight">
            In vier Schritten zum Ergebnis
          </h2>
        </RevealSection>

        {/* Timeline */}
        <div ref={containerRef} className="relative pl-10 sm:pl-14">
          {/* Track background */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-[2px] bg-carbon-800" />

          {/* Animated fill */}
          <motion.div
            className="absolute left-4 sm:left-6 top-0 w-[2px] bg-gradient-to-b from-accent-red to-accent-copper origin-top"
            style={{ height: lineHeight }}
          />

          <div className="space-y-14 sm:space-y-18">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.6, delay: 0.1, ease }}
              >
                {/* Dot on timeline */}
                <motion.div
                  className="absolute -left-10 sm:-left-14 top-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full
                    border-2 border-carbon-700 bg-carbon-950
                    flex items-center justify-center
                    group-hover:border-accent-red transition-colors"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease }}
                >
                  <span className="font-display text-xs sm:text-sm text-accent-red tracking-wider">
                    {step.number}
                  </span>
                </motion.div>

                <h3 className="font-display text-xl sm:text-2xl text-carbon-50 uppercase tracking-wide mb-2">
                  {step.title}
                </h3>
                <p className="font-body text-sm sm:text-base text-carbon-400 leading-relaxed max-w-md">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
