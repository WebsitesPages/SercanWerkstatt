'use client'
import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
  strength?: number
  as?: 'a' | 'button'
}

export default function MagneticButton({
  children,
  className = '',
  href,
  onClick,
  strength = 0.25,
  as,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || window.innerWidth < 768) return
      const { left, top, width, height } = ref.current.getBoundingClientRect()
      setPos({
        x: (e.clientX - left - width / 2) * strength,
        y: (e.clientY - top - height / 2) * strength,
      })
    },
    [strength],
  )

  const handleLeave = useCallback(() => setPos({ x: 0, y: 0 }), [])

  const Tag = as ?? (href ? 'a' : 'button')
  const linkProps = href
    ? {
        href,
        ...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
      }
    : {}

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 18, mass: 0.1 }}
      className="inline-block"
    >
      <Tag onClick={onClick} className={className} {...linkProps}>
        {children}
      </Tag>
    </motion.div>
  )
}
