'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { getChapter, easeInOut, CAM } from '@/lib/carStory'
import ShowCar from './ShowCar'

function CameraRig({ progress }: { progress: MotionValue<number> }) {
  const desired = useRef(new THREE.Vector3(6.2, 2.6, 4.6))
  const desiredTarget = useRef(new THREE.Vector3(0, 0.75, 0))
  const target = useRef(new THREE.Vector3(0, 0.75, 0))

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const { index, t } = getChapter(progress.get())
    const e = easeInOut(t)

    if (index === 0) {
      /* Orbit ums Auto */
      const a = 0.9 - e * 1.4
      const r = 8.4 - e * 1.2
      desired.current.set(Math.sin(a) * r, 2.8 - e * 1.1, Math.cos(a) * r)
      desiredTarget.current.set(0, 0.75, 0)
    } else {
      const k = CAM[index]!
      desired.current.set(
        k.from[0] + (k.to[0] - k.from[0]) * e,
        k.from[1] + (k.to[1] - k.from[1]) * e,
        k.from[2] + (k.to[2] - k.from[2]) * e
      )
      desiredTarget.current.set(
        k.tFrom[0] + (k.tTo[0] - k.tFrom[0]) * e,
        k.tFrom[1] + (k.tTo[1] - k.tFrom[1]) * e,
        k.tFrom[2] + (k.tTo[2] - k.tFrom[2]) * e
      )
    }

    /* Hochformat: Kamera deutlich weiter weg, damit das Auto ins Bild passt */
    const aspect = state.size.width / state.size.height
    if (aspect < 0.9) {
      desired.current.sub(desiredTarget.current).multiplyScalar(1.7).add(desiredTarget.current)
    }

    /* Gedämpfte Annäherung — glättet Kapitel-Übergänge */
    const damp = 1 - Math.pow(0.0018, dt)
    state.camera.position.lerp(desired.current, damp)
    target.current.lerp(desiredTarget.current, damp)
    state.camera.lookAt(target.current)
  })

  return null
}

export default function CarStage({
  progress, quality,
}: {
  progress: MotionValue<number>
  quality: 'high' | 'low'
}) {
  const high = quality === 'high'
  return (
    <Canvas
      dpr={high ? [1, 1.75] : [1, 1.4]}
      camera={{ fov: 35, position: [6.2, 2.6, 4.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 1.4 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#fff4ec" />

      {/* Prozedurales Studio-Licht — lange Strips spiegeln sich im Lack */}
      <Environment resolution={high ? 256 : 128} frames={1}>
        <Lightformer intensity={6} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[9, 2.5, 1]} />
        <Lightformer intensity={3.2} position={[-6, 1.2, 0]} rotation-y={Math.PI / 2} scale={[7, 1.4, 1]} />
        <Lightformer intensity={3.2} position={[6, 1.2, 0]} rotation-y={-Math.PI / 2} scale={[7, 1.4, 1]} />
        <Lightformer intensity={1.4} color="#c92a2a" position={[0, 1.4, -7]} scale={[5, 2, 1]} />
        <Lightformer intensity={1.0} color="#ffffff" position={[0, 1.0, 7]} scale={[6, 1, 1]} />
      </Environment>

      <ShowCar progress={progress} />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.7}
        scale={14}
        blur={2.4}
        far={3.5}
        resolution={high ? 512 : 256}
        color="#000000"
      />

      <CameraRig progress={progress} />
    </Canvas>
  )
}
