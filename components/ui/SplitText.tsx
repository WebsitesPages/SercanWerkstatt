'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.025,
  once = true,
}: SplitTextProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-8% 0px' })

  const words = text.split(' ')
  let charIndex = 0

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-pre">
          {word.split('').map((char) => {
            const i = charIndex++
            return (
              <motion.span
                key={`${wi}-${i}`}
                className="inline-block"
                aria-hidden
                initial={{ opacity: 0, y: 24, rotateX: 40 }}
                animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
                transition={{
                  duration: 0.5,
                  delay: delay + i * stagger,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}
