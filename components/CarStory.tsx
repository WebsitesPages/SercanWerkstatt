'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  motion, useScroll, useTransform, useReducedMotion,
  type MotionValue,
} from 'framer-motion'
import { CHAPTERS, N_CHAPTERS } from '@/lib/carStory'

const CarStage = dynamic(() => import('./three/CarStage'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-carbon-600 border-t-accent-red rounded-full animate-spin" />
    </div>
  ),
})

function ChapterOverlay({
  progress, index,
}: {
  progress: MotionValue<number>
  index: number
}) {
  const c = CHAPTERS[index]
  const start = index / N_CHAPTERS
  const end = (index + 1) / N_CHAPTERS
  const fadeIn: [number, number] = index === 0 ? [0, 0.001] : [start + 0.015, start + 0.05]
  const opacity = useTransform(
    progress,
    [fadeIn[0], fadeIn[1], end - 0.05, end - 0.015],
    [index === 0 ? 1 : 0, 1, 1, 0]
  )
  const y = useTransform(progress, [start, end], [36, -36])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute left-5 sm:left-12 bottom-24 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 max-w-md pointer-events-none z-10"
    >
      <p className="font-body text-[10px] sm:text-xs text-accent-red uppercase tracking-[0.3em] font-semibold mb-3">
        {c.kicker}
      </p>
      <h3 className="font-display text-4xl sm:text-6xl text-carbon-50 uppercase leading-[0.95] tracking-wide whitespace-pre-line mb-4">
        {c.title}
      </h3>
      <ul className="space-y-1.5">
        {c.lines.map((l) => (
          <li key={l} className="font-body text-sm sm:text-base text-carbon-300 flex items-start gap-2">
            <span className="text-accent-red mt-[2px]">—</span>
            {l}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function GhostNumber({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const start = index / N_CHAPTERS
  const end = (index + 1) / N_CHAPTERS
  const opacity = useTransform(
    progress,
    [start + 0.02, start + 0.06, end - 0.06, end - 0.02],
    [0, 0.08, 0.08, 0]
  )
  return (
    <motion.span
      style={{ opacity }}
      className="absolute right-2 sm:right-10 top-16 sm:top-1/2 sm:-translate-y-1/2 font-display text-[8rem] sm:text-[16rem] leading-none text-carbon-50 pointer-events-none select-none"
    >
      {String(index).padStart(2, '0')}
    </motion.span>
  )
}

function RailDot({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const start = index / N_CHAPTERS
  const end = (index + 1) / N_CHAPTERS
  const scaleY = useTransform(progress, [start, Math.min(end, start + 0.04)], [0.25, 1])
  const opacity = useTransform(progress, [start - 0.02, start, end, end + 0.02], [0.3, 1, 1, 0.3])
  return (
    <motion.span
      style={{ scaleY, opacity }}
      className="block w-[3px] h-8 rounded-full bg-accent-red origin-center"
    />
  )
}

/* Fallback ohne Animation (prefers-reduced-motion) */
function StaticStory() {
  return (
    <section id="film" className="relative py-20 px-5">
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2">
        {CHAPTERS.slice(1).map((c) => (
          <div key={c.id} className="border border-carbon-800 rounded-xl p-6 bg-carbon-900/50">
            <p className="font-body text-xs text-accent-red uppercase tracking-[0.3em] mb-2">{c.kicker}</p>
            <h3 className="font-display text-2xl text-carbon-50 uppercase whitespace-pre-line mb-3">{c.title}</h3>
            <ul className="space-y-1">
              {c.lines.map((l) => (
                <li key={l} className="font-body text-sm text-carbon-300">— {l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function CarStory() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const [quality, setQuality] = useState<'high' | 'low'>('high')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    setQuality(mq.matches ? 'low' : 'high')
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  /* Scroll-Snap: nach kurzer Ruhe sanft zur Mitte des aktuellen Kapitels ziehen
     (dort ist die jeweilige Animation auf ihrem Höhepunkt) */
  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    let timer = 0
    let snapping = false
    const cancel = () => {
      snapping = false
    }
    const onScroll = () => {
      if (snapping) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        const range = el.offsetHeight - window.innerHeight
        const p = (window.scrollY - el.offsetTop) / range
        if (p <= 0.02 || p >= 0.98) return
        const idx = Math.min(N_CHAPTERS - 1, Math.floor(p * N_CHAPTERS))
        const target = Math.round(el.offsetTop + ((idx + 0.5) / N_CHAPTERS) * range)
        if (Math.abs(window.scrollY - target) < 12) return
        snapping = true
        window.scrollTo({ top: target, behavior: 'smooth' })
        window.setTimeout(cancel, 900)
      }, 220)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.clearTimeout(timer)
    }
  }, [reduced])

  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0])

  if (reduced) return <StaticStory />

  return (
    <section id="film" ref={ref} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-carbon-950">
        {/* Studio-Boden-Glow hinter dem Canvas */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 45% at 50% 72%, rgba(40,40,44,0.55), transparent 70%), radial-gradient(ellipse 90% 60% at 50% 50%, rgba(20,20,22,0.8), #080808 100%)',
          }}
        />

        {/* Sofort mounten — Canvas, Chunk und Ferrari-Modell laden ab Seitenstart */}
        <CarStage progress={scrollYProgress} quality={quality} />

        {/* Lichtstreifen im Intro */}
        <motion.div style={{ opacity: hintOpacity }} className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="light-streak" style={{ animationDelay: '0s' }} />
          <div className="light-streak" style={{ animationDelay: '2.2s', top: '60%' }} />
        </motion.div>

        {/* Letterbox */}
        <div className="absolute top-0 inset-x-0 h-10 sm:h-14 bg-gradient-to-b from-carbon-950 to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 inset-x-0 h-10 sm:h-14 bg-gradient-to-t from-carbon-950 to-transparent pointer-events-none z-20" />

        {/* Kapitel-Overlays */}
        {CHAPTERS.map((c, i) => (
          <ChapterOverlay key={c.id} progress={scrollYProgress} index={i} />
        ))}
        {CHAPTERS.map((c, i) =>
          i === 0 ? null : <GhostNumber key={c.id} progress={scrollYProgress} index={i} />
        )}

        {/* Progress-Rail */}
        <div className="absolute right-4 sm:right-8 bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 flex sm:flex-col gap-2 z-20">
          {CHAPTERS.map((c, i) => (
            <RailDot key={c.id} progress={scrollYProgress} index={i} />
          ))}
        </div>

        {/* Scroll-Hinweis */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="font-body text-[10px] uppercase tracking-[0.35em] text-carbon-400">
            Scrollen
          </span>
          <span className="w-[1px] h-8 bg-gradient-to-b from-accent-red to-transparent animate-pulse" />
        </motion.div>
      </div>
    </section>
  )
}
