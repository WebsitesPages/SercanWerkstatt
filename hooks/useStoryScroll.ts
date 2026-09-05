'use client'

import { useCallback, useEffect, useRef, type RefObject } from 'react'
import { clamp01 } from '@/lib/carStory'

type Subscriber = (progress: number) => void

/* Antrieb für die Scroll-Story.
 *
 * Misst, wie weit die Sektion durchgescrollt ist, dämpft den Wert und ruft
 * pro Animationsframe alle Subscriber. Die schreiben ihre Styles direkt auf
 * DOM-Knoten — dadurch löst Scrollen keinen einzigen React-Re-Render aus.
 *
 * Der Loop schläft, sobald der gedämpfte Wert das Ziel erreicht hat. */
export function useStoryScroll(ref: RefObject<HTMLElement | null>, enabled = true) {
  const subscribers = useRef(new Set<Subscriber>())
  const progress = useRef(0)

  const subscribe = useCallback((fn: Subscriber) => {
    subscribers.current.add(fn)
    fn(progress.current)
    return () => {
      subscribers.current.delete(fn)
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return

    let target = 0
    let raf = 0
    let alive = true

    const measure = () => {
      const range = el.offsetHeight - window.innerHeight
      if (range <= 0) return
      target = clamp01(-el.getBoundingClientRect().top / range)
    }

    const publish = (p: number) => subscribers.current.forEach((fn) => fn(p))

    const frame = () => {
      raf = 0
      if (!alive) return

      /* Gedämpfte Annäherung — erzeugt den filmischen Nachlauf */
      progress.current += (target - progress.current) * 0.12
      if (Math.abs(target - progress.current) < 0.0004) progress.current = target

      publish(progress.current)
      if (progress.current !== target) raf = requestAnimationFrame(frame)
    }

    const tick = () => {
      measure()
      if (!raf) raf = requestAnimationFrame(frame)
    }

    /* Erster Frame ohne Dämpfung, damit die Sektion nicht „hereinfährt" */
    measure()
    progress.current = target
    publish(progress.current)

    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)

    return () => {
      alive = false
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [ref, enabled])

  return subscribe
}
