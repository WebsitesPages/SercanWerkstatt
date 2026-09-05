'use client'

import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { CHAPTERS, sources } from '@/lib/carStory'
import { useStoryScroll } from '@/hooks/useStoryScroll'
import StoryStage from './story/StoryStage'
import StoryChapters from './story/StoryChapters'

/* Statische Variante für prefers-reduced-motion — gleiche Inhalte, gleiche
   Fotos, nur ohne Kamerafahrt. */
function StaticStory() {
  return (
    <section id="film" className="relative py-20 px-5 bg-carbon-950">
      <div className="max-w-7xl mx-auto grid gap-6 sm:grid-cols-2">
        {CHAPTERS.slice(1).map((chapter) => {
          const main = sources(chapter.image)
          return (
            <article
              key={chapter.id}
              className="border border-carbon-800 rounded-xl overflow-hidden bg-carbon-900/50"
            >
              <picture>
                <source media="(max-width: 699px)" srcSet={main.small} />
                <img
                  src={main.full}
                  alt={chapter.alt}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              <div className="p-6">
                <p className="font-body text-xs text-accent-red uppercase tracking-[0.3em] mb-2">
                  {chapter.kicker}
                </p>
                <h3 className="font-display text-2xl text-carbon-50 uppercase whitespace-pre-line mb-3">
                  {chapter.title}
                </h3>
                <ul className="space-y-1">
                  {chapter.lines.map((line) => (
                    <li key={line} className="font-body text-sm text-carbon-300">
                      — {line}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default function CarStory() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const subscribe = useStoryScroll(ref, !reduced)

  if (reduced) return <StaticStory />

  return (
    <section id="film" ref={ref} className="relative h-[460vh] sm:h-[520vh]">
      <div className="story-stage">
        <StoryStage subscribe={subscribe} />

        {/* Letterbox — rahmt die Bühne wie eine Kinoleinwand */}
        <div className="story-bar story-bar--top" />
        <div className="story-bar story-bar--bottom" />
        <div className="story-grain" aria-hidden />

        <StoryChapters subscribe={subscribe} />
      </div>
    </section>
  )
}
