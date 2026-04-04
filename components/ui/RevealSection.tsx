'use client'
import { useRef } from 'react'
import { motion, useInView, type Variant } from 'framer-motion'

type Direction = 'up' | 'down' | 'left' | 'right'

interface RevealSectionProps {
  children: React.ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
  /* clip-path wipe reveal instead of translate */
  clip?: boolean
}

const translateMap: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 50 },
  down: { x: 0, y: -50 },
  left: { x: 50, y: 0 },
  right: { x: -50, y: 0 },
}

const clipMap: Record<Direction, { hidden: string; visible: string }> = {
  up: { hidden: 'inset(100% 0 0 0)', visible: 'inset(0% 0 0 0)' },
  down: { hidden: 'inset(0 0 100% 0)', visible: 'inset(0 0 0% 0)' },
  left: { hidden: 'inset(0 100% 0 0)', visible: 'inset(0 0% 0 0)' },
  right: { hidden: 'inset(0 0 0 100%)', visible: 'inset(0 0 0 0%)' },
}

export default function RevealSection({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  once = true,
  clip = false,
}: RevealSectionProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-8% 0px' })

  const ease = [0.22, 1, 0.36, 1] as const

  if (clip) {
    const c = clipMap[direction]
    return (
      <motion.div
        ref={ref}
        initial={{ clipPath: c.hidden, opacity: 0.3 }}
        animate={inView ? { clipPath: c.visible, opacity: 1 } : undefined}
        transition={{ duration: duration * 1.1, delay, ease }}
        className={className}
      >
        {children}
      </motion.div>
    )
  }

  const t = translateMap[direction]
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: t.x, y: t.y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : undefined}
      transition={{ duration, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
