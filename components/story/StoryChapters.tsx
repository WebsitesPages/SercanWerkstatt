'use client'

import { useEffect, useRef } from 'react'
import { CHAPTERS, N_CHAPTERS, clamp01, getChapter, smooth } from '@/lib/carStory'

type Subscribe = (fn: (p: number) => void) => () => void

/* Text-Overlays, Kapitel-Geisterzahlen, Progress-Rail und Scroll-Hinweis.
   Wie StoryStage ein Subscriber: schreibt Styles direkt auf die DOM-Knoten. */
export default function StoryChapters({ subscribe }: { subscribe: Subscribe }) {
  const texts = useRef<(HTMLDivElement | null)[]>([])
  const ghosts = useRef<(HTMLSpanElement | null)[]>([])
  const dots = useRef<(HTMLSpanElement | null)[]>([])
  const hint = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    return subscribe((p) => {
      const { index } = getChapter(p)

      texts.current.forEach((el, i) => {
        if (!el) return
        const start = i / N_CHAPTERS
        const end = (i + 1) / N_CHAPTERS
        /* Kapitel 0 ist von Anfang an sichtbar, die anderen fahren herein */
        const inFrom = i === 0 ? 0 : start + 0.02
        const inTo = i === 0 ? 0.001 : start + 0.07
        const opacity = smooth(inFrom, inTo, p) * (1 - smooth(end - 0.06, end - 0.02, p))
        const visible = opacity > 0.001

        el.style.opacity = String(opacity)
        el.style.visibility = visible ? 'visible' : 'hidden'
        if (visible) {
          const local = clamp01((p - start) / (end - start))
          el.style.setProperty('--story-shift', `${(36 - 72 * local).toFixed(1)}px`)
        }
      })

      ghosts.current.forEach((el, k) => {
        if (!el) return
        const i = k + 1
        const start = i / N_CHAPTERS
        const end = (i + 1) / N_CHAPTERS
        el.style.opacity = String(
          0.07 * smooth(start + 0.02, start + 0.07, p) * (1 - smooth(end - 0.07, end - 0.02, p))
        )
      })

      dots.current.forEach((el, i) => el?.classList.toggle('is-on', i === index))

      if (hint.current) hint.current.style.opacity = String(1 - smooth(0, 0.05, p))
    })
  }, [subscribe])

  return (
    <>
      {CHAPTERS.map((chapter, i) => (
        <div
          key={chapter.id}
          ref={(el) => {
            texts.current[i] = el
          }}
          className="story-text"
        >
          <p className="story-kicker font-body text-[10px] sm:text-xs text-accent-red uppercase tracking-[0.3em] font-semibold mb-3">
            {chapter.kicker}
          </p>
          <h3 className="font-display text-[2.6rem] sm:text-6xl text-carbon-50 uppercase leading-[0.95] tracking-wide whitespace-pre-line mb-4">
            {chapter.title}
          </h3>
          <ul className="space-y-1.5">
            {chapter.lines.map((line) => (
              <li
                key={line}
                className="font-body text-sm sm:text-base text-carbon-300 flex items-start gap-2"
              >
                <span className="text-accent-red mt-[2px]">—</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {CHAPTERS.slice(1).map((chapter, k) => (
        <span
          key={chapter.id}
          ref={(el) => {
            ghosts.current[k] = el
          }}
          className="story-ghost font-display"
          aria-hidden
        >
          {String(k + 1).padStart(2, '0')}
        </span>
      ))}

      <div className="story-rail" aria-hidden>
        {CHAPTERS.map((chapter, i) => (
          <span
            key={chapter.id}
            ref={(el) => {
              dots.current[i] = el
            }}
            className="story-dot"
          />
        ))}
      </div>

      <div ref={hint} className="story-hint" aria-hidden>
        <span className="font-body text-[10px] uppercase tracking-[0.35em] text-carbon-400">
          Scrollen
        </span>
        <span className="story-hint-line" />
      </div>
    </>
  )
}
