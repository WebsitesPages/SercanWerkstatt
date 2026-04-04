'use client'
import { useRef, useState, useCallback } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion'

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}

export default function ServiceCard({
  title,
  description,
  icon,
  index,
}: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 260,
    damping: 24,
  })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 260,
    damping: 24,
  })

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current || window.innerWidth < 768) return
      const r = ref.current.getBoundingClientRect()
      mx.set((e.clientX - r.left - r.width / 2) / r.width)
      my.set((e.clientY - r.top - r.height / 2) / r.height)
    },
    [mx, my],
  )

  const handleLeave = useCallback(() => {
    mx.set(0)
    my.set(0)
    setHovered(false)
  }, [mx, my])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 800 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        whileTap={{ scale: 0.98 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="light-sweep relative p-6 md:p-8 rounded-lg
          bg-gradient-to-br from-carbon-800/80 to-carbon-900
          border border-carbon-700/40
          transition-colors duration-500
          hover:border-accent-red/30"
      >
        {/* Icon */}
        <div className="text-accent-red mb-4 w-10 h-10 flex items-center justify-center">
          {icon}
        </div>

        {/* Title */}
        <h3 className="font-display text-xl md:text-2xl text-carbon-50 mb-3 uppercase tracking-wide leading-tight">
          {title}
        </h3>

        {/* Description */}
        <p className="text-carbon-300 font-body text-sm md:text-base leading-relaxed">
          {description}
        </p>

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-accent-red to-accent-copper"
          initial={{ width: '0%' }}
          animate={{ width: hovered ? '100%' : '0%' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </motion.div>
    </motion.div>
  )
}
