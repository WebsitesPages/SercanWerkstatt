'use client'
import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import { type RefObject } from 'react'

export function useSectionScroll(
  target: RefObject<HTMLElement>,
  offset: [string, string] = ['start end', 'end start'],
) {
  return useScroll({ target, offset: offset as never })
}

export function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}
