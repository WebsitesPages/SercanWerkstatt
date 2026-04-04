'use client'
import { motion } from 'framer-motion'
import { COMPANY } from '@/lib/constants'

const actions = [
  {
    label: 'Anrufen',
    href: `tel:${COMPANY.phone}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Route',
    href: COMPANY.mapsUrl,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: 'E-Mail',
    href: `mailto:${COMPANY.email}`,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

export default function QuickActions() {
  return (
    <section className="relative z-10 -mt-12 px-5 pb-12 sm:pb-16">
      <div className="max-w-lg mx-auto grid grid-cols-3 gap-3">
        {actions.map((a, i) => (
          <motion.a
            key={a.label}
            href={a.href}
            {...(a.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="flex flex-col items-center gap-2 py-5 rounded-lg
              bg-carbon-800/70 backdrop-blur-md border border-carbon-700/40
              text-carbon-200 hover:text-white hover:border-accent-red/30
              transition-all duration-300 active:scale-95"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              delay: 0.1 + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileTap={{ scale: 0.95 }}
          >
            {a.icon}
            <span className="font-body text-xs sm:text-sm font-medium tracking-wide">
              {a.label}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
