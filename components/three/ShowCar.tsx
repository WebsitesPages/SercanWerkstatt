'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { getChapter, easeInOut, smooth } from '@/lib/carStory'
import { buildShowcar } from '@/lib/buildShowcar'

/* Hub-Winkel der Scharniere */
const HOOD_OPEN = 0.55
const DOOR_OPEN = 0.85
const TRUNK_OPEN = 0.5
const WHEEL_EXPLODE = 0.55

const rimBaseColor = new THREE.Color('#b9bcc2')
const rimFreshColor = new THREE.Color('#f2f3f5')

export default function ShowCar({ progress }: { progress: MotionValue<number> }) {
  const { car, mats, parts } = useMemo(buildShowcar, [])

  useFrame(() => {
    const { index, t } = getChapter(progress.get())

    /* Kapitel 1 — Explosionsansicht: alles öffnet, Räder fahren raus */
    const ex = index === 1 ? Math.sin(Math.PI * easeInOut(t)) : 0

    /* Kapitel 2 — Motorhaube öffnet, Motor glüht */
    const service = index === 2 ? smooth(0.08, 0.45, t) * (1 - smooth(0.85, 1, t)) : 0
    const hoodOpen = Math.max(ex, service)

    parts.hoodPivot.rotation.z = hoodOpen * HOOD_OPEN
    parts.trunkPivot.rotation.z = -ex * TRUNK_OPEN
    parts.doorL.rotation.y = ex * DOOR_OPEN
    parts.doorR.rotation.y = -ex * DOOR_OPEN
    mats.engineGlow.emissiveIntensity = Math.max(service, ex * 0.4) * 3.2
    parts.engineLight.intensity = service * 4

    /* Kapitel 3 — Radwechsel vorn links (+z = Kamera-Seite) */
    let out = 0
    let fresh = 0
    if (index === 3) {
      out = smooth(0.05, 0.4, t) * (1 - smooth(0.6, 0.95, t))
      fresh = smooth(0.45, 0.55, t)
    } else if (index > 3) {
      fresh = 1
    }

    parts.wheelFL.position.z = 0.78 + ex * WHEEL_EXPLODE + out * 1.05
    parts.wheelFL.position.y = 0.345 + out * 0.3
    parts.wheelFL.rotation.z = -out * 14
    parts.wheelRL.position.z = 0.78 + ex * WHEEL_EXPLODE
    parts.wheelFR.position.z = -0.78 - ex * WHEEL_EXPLODE
    parts.wheelRR.position.z = -0.78 - ex * WHEEL_EXPLODE

    mats.rimSwap.color.lerpColors(rimBaseColor, rimFreshColor, fresh)
    mats.rimSwap.emissiveIntensity = Math.sin(fresh * Math.PI) * 1.5

    /* Kapitel 4 — Lack-Welle */
    let primer = 0
    let edge = 4
    if (index === 4) {
      primer = smooth(0, 0.15, t)
      edge = -3.8 + smooth(0.18, 0.88, t) * 7.8
    }
    mats.uniforms.uPrimerMix.value = primer
    mats.uniforms.uEdge.value = edge

    /* Intro — Scheinwerfer heller */
    mats.headlight.emissiveIntensity = index === 0 ? 3 : 2
  })

  return <primitive object={car} position={[0, 0.03, 0]} />
}
