'use client'
import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

interface BeforeAfterSliderProps {
  beforeGradient?: string
  afterGradient?: string
  beforeLabel?: string
  afterLabel?: string
  caption?: string
  className?: string
  beforeText?: string
  afterText?: string
  /* Echte Bildpfade (überschreiben Gradienten) */
  beforeSrc?: string
  afterSrc?: string
}

export default function BeforeAfterSlider({
  beforeGradient,
  afterGradient,
  beforeLabel = 'Vorher',
  afterLabel = 'Nachher',
  caption,
  className = '',
  beforeText,
  afterText,
  beforeSrc,
  afterSrc,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-10% 0px' })
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const { left, width } = containerRef.current.getBoundingClientRect()
    setPosition(Math.max(4, Math.min(96, ((clientX - left) / width) * 100)))
  }, [])

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      setDragging(true)
      updatePos(e.clientX)
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [updatePos],
  )

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return
      e.preventDefault()
      updatePos(e.clientX)
    },
    [dragging, updatePos],
  )

  const onUp = useCallback(() => setDragging(false), [])

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] sm:aspect-[16/10] rounded-lg overflow-hidden cursor-col-resize select-none touch-none group"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* ── Nachher (full, behind) ───────────────── */}
        <div className="absolute inset-0">
          {afterSrc ? (
            <img src={afterSrc} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${afterGradient}`}>
              {afterText && (
                <span className="absolute inset-0 flex items-center justify-center font-body text-xs text-carbon-500/40 tracking-widest uppercase">
                  {afterText}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Vorher (clipped) ─────────────────────── */}
        <div
          className="absolute inset-0 z-[1]"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {beforeSrc ? (
            <img src={beforeSrc} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${beforeGradient}`}>
              {beforeText && (
                <span className="absolute inset-0 flex items-center justify-center font-body text-xs text-carbon-400/40 tracking-widest uppercase">
                  {beforeText}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Divider line ─────────────────────────── */}
        <div
          className="absolute top-0 bottom-0 z-[2] -translate-x-1/2"
          style={{ left: `${position}%` }}
        >
          {/* Line */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/80" />

          {/* Handle */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-11 h-11 rounded-full bg-white shadow-[0_2px_16px_rgba(0,0,0,0.4)]
              flex items-center justify-center transition-transform duration-150
              ${dragging ? 'scale-110' : 'group-hover:scale-105'}`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9,18 3,12 9,6" />
              <polyline points="15,6 21,12 15,18" />
            </svg>
          </div>
        </div>

        {/* ── Labels ───────────────────────────────── */}
        <div className="absolute top-3 left-3 z-[3]">
          <span className="px-2.5 py-1 bg-carbon-950/70 backdrop-blur-sm text-[0.65rem] font-body text-carbon-200 rounded-sm tracking-widest uppercase font-medium">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-[3]">
          <span className="px-2.5 py-1 bg-carbon-950/70 backdrop-blur-sm text-[0.65rem] font-body text-carbon-200 rounded-sm tracking-widest uppercase font-medium">
            {afterLabel}
          </span>
        </div>

        {/* ── Drag hint (fades after interaction) ─── */}
        {!dragging && (
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[3]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <span className="px-3 py-1.5 bg-carbon-950/60 backdrop-blur-sm text-[0.6rem] font-body text-carbon-300 rounded-sm tracking-wider uppercase">
              Ziehen zum Vergleichen
            </span>
          </motion.div>
        )}
      </div>

      {/* ── Caption ────────────────────────────────── */}
      {caption && (
        <p className="mt-3 font-body text-sm text-carbon-400">{caption}</p>
      )}
    </motion.div>
  )
}
