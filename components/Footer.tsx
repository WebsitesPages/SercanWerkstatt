'use client'
import { motion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="relative py-12 sm:py-16 px-5 border-t border-carbon-800/50">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-carbon-600/30 to-transparent" />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center sm:text-left"
          >
            <p className="font-display text-2xl text-carbon-50 uppercase tracking-wider mb-1">
              {COMPANY.name}
            </p>
            <p className="font-body text-xs text-carbon-500 tracking-wide">
              {COMPANY.fullName}
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center sm:text-right font-body text-sm text-carbon-400 space-y-1"
          >
            <p>{COMPANY.fullAddress}</p>
            <p>
              <a href={`tel:${COMPANY.phone}`} className="hover:text-white transition-colors">
                {COMPANY.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white transition-colors">
                {COMPANY.email}
              </a>
            </p>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-carbon-800/40 text-center">
          <p className="font-body text-xs text-carbon-600">
            &copy; {new Date().getFullYear()} {COMPANY.name}. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  )
}
