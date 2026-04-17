'use client'
import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

interface CarShowroom360Props {
  images: string[]
  caption?: string
  className?: string
}

export default function CarShowroom360({
  images,
  caption,
  className = '',
}: CarShowroom360Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, margin: '-10% 0px' })
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartIndex, setDragStartIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const autoPlayRef = useRef(autoPlay)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>()

  autoPlayRef.current = autoPlay

  /* ── Auto-rotation ─────────────────────────────── */
  useEffect(() => {
    if (!inView || !autoPlay) return
    const interval = setInterval(() => {
      if (autoPlayRef.current) {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }
    }, 1800)
    return () => clearInterval(interval)
  }, [inView, autoPlay, images.length])

  /* ── Drag to rotate ────────────────────────────── */
  const onDown = useCallback(
    (e: React.PointerEvent) => {
      setDragging(true)
      setAutoPlay(false)
      setHasInteracted(true)
      setDragStartX(e.clientX)
      setDragStartIndex(currentIndex)
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    },
    [currentIndex],
  )

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging || !containerRef.current) return
      e.preventDefault()
      const { width } = containerRef.current.getBoundingClientRect()
      const delta = e.clientX - dragStartX
      const sensitivity = width / images.length
      const indexOffset = Math.round(delta / sensitivity)
      const newIndex =
        ((dragStartIndex - indexOffset) % images.length + images.length) %
        images.length
      setCurrentIndex(newIndex)
    },
    [dragging, dragStartX, dragStartIndex, images.length],
  )

  const onUp = useCallback(() => {
    setDragging(false)
    resumeTimerRef.current = setTimeout(() => setAutoPlay(true), 4000)
  }, [])

  /* ── Dot click ─────────────────────────────────── */
  const goTo = useCallback((idx: number) => {
    setCurrentIndex(idx)
    setAutoPlay(false)
    setHasInteracted(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => setAutoPlay(true), 4000)
  }, [])

  const progress = ((currentIndex + 1) / images.length) * 100

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] sm:aspect-[16/10] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none group bg-carbon-900"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        {/* ── Images ───────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Ansicht ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </AnimatePresence>

        {/* ── Gradient overlays ────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/60 via-transparent to-carbon-950/30 pointer-events-none" />

        {/* ── 360° Badge ───────────────────────────── */}
        <div className="absolute top-3 left-3 z-[3]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-carbon-950/70 backdrop-blur-sm text-[0.65rem] font-body text-carbon-200 rounded-sm tracking-widest uppercase font-medium">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={autoPlay ? 'animate-spin-slow' : ''}
            >
              <path d="M21.5 2v6h-6" />
              <path d="M2.5 22v-6h6" />
              <path d="M2 11.5a10 10 0 0 1 18.8-4.3" />
              <path d="M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
            360°
          </span>
        </div>

        {/* ── Counter ──────────────────────────────── */}
        <div className="absolute top-3 right-3 z-[3]">
          <span className="px-2.5 py-1 bg-carbon-950/70 backdrop-blur-sm text-[0.65rem] font-body text-carbon-200 rounded-sm tracking-widest uppercase font-medium tabular-nums">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* ── Progress bar ─────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-carbon-800/50 z-[3]">
          <motion.div
            className="h-full bg-accent-red"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* ── Dot navigation ───────────────────────── */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex gap-1.5">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation()
                goTo(idx)
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-accent-red scale-125'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        {/* ── Drag hint ────────────────────────────── */}
        {!hasInteracted && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[3]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-carbon-950/60 backdrop-blur-sm text-[0.6rem] font-body text-carbon-300 rounded-sm tracking-wider uppercase">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9,18 3,12 9,6" />
                <polyline points="15,6 21,12 15,18" />
              </svg>
              Ziehen zum Drehen
            </span>
          </motion.div>
        )}

        {/* ── Light sweep on hover ─────────────────── */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms]" />
        </div>
      </div>

      {/* ── Caption ────────────────────────────────── */}
      {caption && (
        <p className="mt-3 font-body text-sm text-carbon-400">{caption}</p>
      )}
    </motion.div>
  )
}
