'use client'

import { useEffect, useRef } from 'react'
import { CHAPTERS, frameState, getChapter, smooth, sources } from '@/lib/carStory'

/* Ab dieser Viewport-Breite gilt „Desktop" — muss zum media-Query
   im <picture> unten passen. */
const SMALL = 700
const PHOTO_RATIO = 4 / 3

type Subscribe = (fn: (p: number) => void) => () => void

/* Die Fotoebenen und ihre Effekte.
 *
 * Jede Ebene ist ein .story-frame; darin sitzen eine oder zwei .story-pic-Boxen,
 * deren Maße per JS auf den Bildausschnitt gesetzt werden (siehe layout()).
 * Animiert werden nur transform und opacity — kein filter, kein backdrop-filter,
 * kein blend-mode, sonst rechnet der Browser pro Frame die Bildpixel neu. */
export default function StoryStage({ subscribe }: { subscribe: Subscribe }) {
  const root = useRef<HTMLDivElement | null>(null)
  const frames = useRef<(HTMLDivElement | null)[]>([])
  const wipeAfter = useRef<HTMLDivElement | null>(null)
  /* Vom Layout gesetzt: im Hochformat der Bandmittelpunkt in Prozent der
     Viewport-Höhe, sonst null. Der Zoom dreht sich darum. */
  const portraitOrigin = useRef<string | null>(null)
  const wipeLine = useRef<HTMLDivElement | null>(null)
  const wipeBadge = useRef<HTMLDivElement | null>(null)
  const sweep = useRef<HTMLDivElement | null>(null)

  /* Bildausschnitt bestimmen.
     Querformat: das Bild deckt den Viewport ab (Cover).
     Hochformat: die Fotos sind 4:3 — ein Cover-Zuschnitt würde nur einen
     Streifen Auto zeigen. Deshalb knapp über Viewport-Breite und nach oben
     gesetzt, damit das ganze Auto sichtbar bleibt und unten Platz für Text ist. */
  useEffect(() => {
    const layout = () => {
      const el = root.current
      if (!el) return

      const w = window.innerWidth
      const h = window.innerHeight
      const portrait = h > w

      const boxW = portrait ? w * 1.15 : Math.max(w, h * PHOTO_RATIO)
      const boxH = boxW / PHOTO_RATIO

      const focusY = portrait ? 0.3 : null
      const bandTop = (h - boxH) * (focusY ?? 0.5)

      /* Im Hochformat füllt das Foto den Viewport nicht aus. Läge der
         Zoom-Ursprung wie im Querformat tief im Bild, würde die Zoomfahrt das
         Band nach oben aus dem Rahmen ziehen und die Studio-Decke zeigen.
         Deshalb dreht der Zoom hier um die Bandmitte. */
      portraitOrigin.current = portrait
        ? `50% ${(((bandTop + boxH / 2) / h) * 100).toFixed(2)}%`
        : null

      el.querySelectorAll<HTMLElement>('.story-pic').forEach((pic) => {
        const y = focusY ?? Number(pic.dataset.focus ?? 0.5)
        pic.style.width = `${boxW}px`
        pic.style.height = `${boxH}px`
        pic.style.left = `${(w - boxW) / 2}px`
        pic.style.top = `${(h - boxH) * y}px`
      })

      /* Das Fotoband nach CSS geben — im Hochformat richten sich Wipe-Linie
         und Label danach, statt durchs Schwarz zu laufen. */
      el.parentElement?.style.setProperty('--story-band-top', `${Math.max(0, bandTop)}px`)
      el.parentElement?.style.setProperty('--story-band-height', `${boxH}px`)
    }

    layout()
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [])

  useEffect(() => {
    return subscribe((p) => {
      const { index, t } = getChapter(p)
      const soft = window.innerWidth < SMALL

      frames.current.forEach((frame, i) => {
        if (!frame) return
        const { opacity, scale } = frameState(i, index, t)
        const live = opacity > 0.001

        frame.classList.toggle('is-live', live)
        if (!live) return

        /* Auf kleinen Geräten flachere Zoomfahrt: weniger GPU-Last, weniger Zittern */
        const s = soft ? 1 + (scale - 1) * 0.55 : scale

        frame.style.opacity = String(opacity)
        frame.style.transform = `translateZ(0) scale(${s.toFixed(4)})`
        frame.style.transformOrigin = portraitOrigin.current ?? CHAPTERS[i].cam.origin
        frame.style.zIndex = i === index ? '2' : '1'
      })

      /* Kapitel 01 — Wipe von „vorher" zu „nachher".
         Enthüllt von rechts nach links: links liegt der Text-Scrim, dort wäre
         das frisch instandgesetzte Auto kaum zu sehen. */
      const reveal = index === 1 ? smooth(0.08, 0.62, t) : index > 1 ? 1 : 0
      const edge = (1 - reveal) * 100
      if (wipeAfter.current) {
        wipeAfter.current.style.clipPath = `inset(0 0 0 ${edge.toFixed(2)}%)`
      }
      if (wipeLine.current) {
        /* Kommt mit der Linie herein und verschwindet, bevor sie den Rand
           erreicht — sonst hängt das Label halb außerhalb des Bildes. */
        const lineIn = smooth(0.02, 0.14, reveal) * (1 - smooth(0.86, 1, reveal))
        wipeLine.current.style.left = `${edge.toFixed(2)}%`
        wipeLine.current.style.opacity = index === 1 ? String(lineIn) : '0'
      }
      if (wipeBadge.current) {
        /* „Vorher" verschwindet, sobald es keine Vorher-Hälfte mehr gibt */
        wipeBadge.current.style.opacity = String(1 - smooth(0.72, 0.98, reveal))
      }

      /* Kapitel 04 — Licht-Sweep über den Lack */
      if (sweep.current) {
        if (index === 4) {
          const s = smooth(0.25, 0.75, t)
          sweep.current.style.opacity = String(Math.sin(s * Math.PI))
          sweep.current.style.backgroundPosition = `${(-60 + s * 220).toFixed(1)}% 0`
        } else {
          sweep.current.style.opacity = '0'
        }
      }
    })
  }, [subscribe])

  return (
    <div ref={root} className="absolute inset-0">
      {CHAPTERS.map((chapter, i) => {
        const main = sources(chapter.image)
        const after = chapter.wipeTo ? sources(chapter.wipeTo.image) : null

        return (
          <div
            key={chapter.id}
            ref={(el) => {
              frames.current[i] = el
            }}
            className="story-frame"
          >
            <div className="story-pic" data-focus={chapter.focusY}>
              <picture>
                <source media={`(max-width: ${SMALL - 1}px)`} srcSet={main.small} />
                <img
                  src={main.full}
                  alt={chapter.alt}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </picture>
            </div>

            {after && chapter.wipeTo && (
              <>
                <div
                  ref={wipeAfter}
                  className="story-pic story-wipe-after"
                  data-focus={chapter.focusY}
                >
                  <picture>
                    <source media={`(max-width: ${SMALL - 1}px)`} srcSet={after.small} />
                    <img src={after.full} alt={chapter.wipeTo.alt} decoding="async" />
                  </picture>
                </div>
                <div ref={wipeLine} className="story-wipe-line" aria-hidden>
                  <span>Instandgesetzt</span>
                </div>
                <div ref={wipeBadge} className="story-badge story-badge--left" aria-hidden>
                  Vorher
                </div>
                <div className="story-badge story-badge--right" aria-hidden>
                  Nachher
                </div>
              </>
            )}

            {chapter.id === 'lack' && <div ref={sweep} className="story-sweep" aria-hidden />}
          </div>
        )
      })}
    </div>
  )
}
