'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { getChapter, easeInOut, smooth } from '@/lib/carStory'

/* ── Basis-Positionen + Explosions-Offsets ─────────────── */
type V3 = [number, number, number]

const POS: Record<string, V3> = {
  hoodPivot: [0.55, 1.06, 0],
  roof: [-0.45, 1.6, 0],
  glass: [-0.35, 1.28, 0],
  doorL: [-0.05, 0.74, 0.97],
  doorR: [-0.05, 0.74, -0.97],
  frontBumper: [2.2, 0.55, 0],
  rearBumper: [-2.2, 0.55, 0],
  spoiler: [-2.05, 1.32, 0],
  wheelFL: [1.45, 0.44, 0.88],
  wheelFR: [1.45, 0.44, -0.88],
  wheelRL: [-1.45, 0.44, 0.88],
  wheelRR: [-1.45, 0.44, -0.88],
}

const EXPLODE: Record<string, V3> = {
  hoodPivot: [0.7, 1.1, 0],
  roof: [0, 1.15, 0],
  glass: [0, 0.6, 0],
  doorL: [0, 0.2, 1.2],
  doorR: [0, 0.2, -1.2],
  frontBumper: [1.2, 0.25, 0],
  rearBumper: [-1.2, 0.25, 0],
  spoiler: [-0.6, 0.8, 0],
  wheelFL: [0, 0, 1.0],
  wheelFR: [0, 0, -1.0],
  wheelRL: [0, 0, 1.0],
  wheelRR: [0, 0, -1.0],
}

/* ── Geteilte Materialien (Modul-Scope, nur Client) ────── */
const tireMat = new THREE.MeshStandardMaterial({ color: '#101113', roughness: 0.92 })
const trimMat = new THREE.MeshStandardMaterial({ color: '#0c0d0f', roughness: 0.55, metalness: 0.3 })
const glassMat = new THREE.MeshPhysicalMaterial({
  color: '#0b0e13', metalness: 0.9, roughness: 0.08, clearcoat: 1,
})
const rimBaseColor = new THREE.Color('#9a9da3')
const rimFreshColor = new THREE.Color('#e8e9ee')
const rimMat = new THREE.MeshStandardMaterial({
  color: rimBaseColor, metalness: 0.95, roughness: 0.28,
})
const discMat = new THREE.MeshStandardMaterial({ color: '#3c3f44', metalness: 0.9, roughness: 0.4 })
const engineMat = new THREE.MeshStandardMaterial({ color: '#1a1c20', metalness: 0.8, roughness: 0.45 })
const engineGlowMat = new THREE.MeshStandardMaterial({
  color: '#26090b', emissive: '#ff3b30', emissiveIntensity: 0,
})
const headlightMat = new THREE.MeshStandardMaterial({
  color: '#dfe8ff', emissive: '#cfe0ff', emissiveIntensity: 1.4,
})
const taillightMat = new THREE.MeshStandardMaterial({
  color: '#3a0a0a', emissive: '#ff2222', emissiveIntensity: 1.2,
})

/* ── Lack-Material mit Welle (uPrimerMix, uEdge) ───────── */
function createPaintMaterial() {
  const uniforms = { uPrimerMix: { value: 0 }, uEdge: { value: 4 } }
  const mat = new THREE.MeshPhysicalMaterial({
    color: '#c92a2a', metalness: 0.85, roughness: 0.32,
    clearcoat: 1, clearcoatRoughness: 0.12,
  })
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uPrimerMix = uniforms.uPrimerMix
    shader.uniforms.uEdge = uniforms.uEdge
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', 'varying vec3 vPaintWorld;\n#include <common>')
      .replace(
        '#include <fog_vertex>',
        '#include <fog_vertex>\nvPaintWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;'
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        'varying vec3 vPaintWorld;\nuniform float uPrimerMix;\nuniform float uEdge;\n#include <common>'
      )
      .replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        [
          'vec3 primer = vec3(0.33, 0.34, 0.36);',
          'float painted = max(1.0 - uPrimerMix, 1.0 - smoothstep(uEdge - 0.25, uEdge + 0.25, vPaintWorld.x));',
          'vec3 paintCol = mix(primer, diffuse, painted);',
          'float sweep = (1.0 - smoothstep(0.0, 0.45, abs(vPaintWorld.x - uEdge))) * uPrimerMix;',
          'paintCol += sweep * 0.22;',
          'vec4 diffuseColor = vec4( paintCol, opacity );',
        ].join('\n')
      )
  }
  return { mat, uniforms }
}

/* ── Rad: Torus-Reifen + 5-Speichen-Felge ──────────────── */
const SPOKE_ANGLES = [0, 1, 2, 3, 4].map((i) => (i * Math.PI * 2) / 5)

function Wheel({
  groupRef, rim,
}: {
  groupRef: React.RefObject<THREE.Group>
  rim: THREE.MeshStandardMaterial
}) {
  return (
    <group ref={groupRef}>
      <mesh material={tireMat}>
        <torusGeometry args={[0.31, 0.13, 16, 36]} />
      </mesh>
      <mesh material={discMat} position={[0, 0, -0.02]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.17, 0.17, 0.05, 24]} />
      </mesh>
      {SPOKE_ANGLES.map((a) => (
        <group key={a} rotation-z={a}>
          <mesh material={rim} position={[0.14, 0, 0.06]}>
            <boxGeometry args={[0.28, 0.07, 0.05]} />
          </mesh>
        </group>
      ))}
      <mesh material={rim} position={[0, 0, 0.06]}>
        <torusGeometry args={[0.29, 0.025, 8, 36]} />
      </mesh>
      <mesh material={rim} position={[0, 0, 0.08]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
      </mesh>
    </group>
  )
}

/* ── Showcar ───────────────────────────────────────────── */
export default function ShowCar({ progress }: { progress: MotionValue<number> }) {
  const hoodPivot = useRef<THREE.Group>(null)
  const roof = useRef<THREE.Group>(null)
  const glass = useRef<THREE.Group>(null)
  const doorL = useRef<THREE.Group>(null)
  const doorR = useRef<THREE.Group>(null)
  const frontBumper = useRef<THREE.Group>(null)
  const rearBumper = useRef<THREE.Group>(null)
  const spoiler = useRef<THREE.Group>(null)
  const wheelFL = useRef<THREE.Group>(null)
  const wheelFR = useRef<THREE.Group>(null)
  const wheelRL = useRef<THREE.Group>(null)
  const wheelRR = useRef<THREE.Group>(null)
  const engineLight = useRef<THREE.PointLight>(null)

  const { mat: paintMat, uniforms } = useMemo(createPaintMaterial, [])
  const swapRimMat = useMemo(() => {
    const m = rimMat.clone()
    m.emissive = new THREE.Color('#ff2a2a')
    m.emissiveIntensity = 0
    return m
  }, [])

  const partRefs: [React.RefObject<THREE.Group>, string][] = [
    [hoodPivot, 'hoodPivot'], [roof, 'roof'], [glass, 'glass'],
    [doorL, 'doorL'], [doorR, 'doorR'],
    [frontBumper, 'frontBumper'], [rearBumper, 'rearBumper'], [spoiler, 'spoiler'],
    [wheelFR, 'wheelFR'], [wheelRL, 'wheelRL'], [wheelRR, 'wheelRR'],
  ]

  useFrame(() => {
    const { index, t } = getChapter(progress.get())

    /* Kapitel 1 — Explosionsansicht */
    const ex = index === 1 ? Math.sin(Math.PI * easeInOut(t)) : 0
    for (const [ref, key] of partRefs) {
      const g = ref.current
      if (!g) continue
      g.position.set(
        POS[key][0] + EXPLODE[key][0] * ex,
        POS[key][1] + EXPLODE[key][1] * ex,
        POS[key][2] + EXPLODE[key][2] * ex
      )
    }

    /* Kapitel 2 — Motorhaube + Motor-Glow */
    const open = index === 2 ? smooth(0.08, 0.45, t) * (1 - smooth(0.85, 1, t)) : 0
    if (hoodPivot.current) hoodPivot.current.rotation.z = open * 0.9 + ex * 0.35
    engineGlowMat.emissiveIntensity = open * 3
    if (engineLight.current) engineLight.current.intensity = open * 3.5

    /* Kapitel 3 — Radwechsel vorn links (+Z) */
    let out = 0
    let fresh = 0
    if (index === 3) {
      out = smooth(0.05, 0.4, t) * (1 - smooth(0.6, 0.95, t))
      fresh = smooth(0.45, 0.55, t)
    } else if (index > 3) {
      fresh = 1
    }
    const w = wheelFL.current
    if (w) {
      w.position.set(
        POS.wheelFL[0],
        POS.wheelFL[1],
        POS.wheelFL[2] + EXPLODE.wheelFL[2] * ex + out * 1.25
      )
      w.rotation.z = -out * 16
    }
    swapRimMat.color.lerpColors(rimBaseColor, rimFreshColor, fresh)
    swapRimMat.emissiveIntensity = Math.sin(fresh * Math.PI) * 1.5

    /* Kapitel 4 — Lack-Welle */
    let primer = 0
    let edge = 4
    if (index === 4) {
      primer = smooth(0, 0.15, t)
      edge = -3.8 + smooth(0.18, 0.88, t) * 7.8
    }
    uniforms.uPrimerMix.value = primer
    uniforms.uEdge.value = edge

    /* Intro — Scheinwerfer heller */
    headlightMat.emissiveIntensity = index === 0 ? 2.4 : 1.2
  })

  return (
    <group>
      {/* Karosserie-Kern */}
      <RoundedBox args={[4.5, 0.6, 1.86]} radius={0.14} smoothness={4} position={[0, 0.68, 0]} material={paintMat} />
      {/* Heckdeck */}
      <RoundedBox args={[1.7, 0.32, 1.78]} radius={0.1} smoothness={4} position={[-1.35, 1.05, 0]} material={paintMat} />

      {/* Motorhaube (Pivot an Hinterkante) */}
      <group ref={hoodPivot} position={POS.hoodPivot}>
        <RoundedBox args={[1.35, 0.12, 1.74]} radius={0.06} smoothness={4} position={[0.675, 0, 0]} material={paintMat} />
      </group>

      {/* Motorraum */}
      <mesh material={trimMat} position={[1.25, 0.72, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.5]} />
      </mesh>
      <mesh material={engineMat} position={[1.25, 0.8, 0]}>
        <boxGeometry args={[0.6, 0.28, 0.8]} />
      </mesh>
      <mesh material={engineGlowMat} position={[1.25, 0.95, 0.22]}>
        <boxGeometry args={[0.5, 0.04, 0.1]} />
      </mesh>
      <mesh material={engineGlowMat} position={[1.25, 0.95, -0.22]}>
        <boxGeometry args={[0.5, 0.04, 0.1]} />
      </mesh>
      <pointLight ref={engineLight} position={[1.25, 1.25, 0]} color="#ff5040" intensity={0} distance={3} />

      {/* Kabine */}
      <group ref={glass} position={POS.glass}>
        <RoundedBox args={[2.0, 0.55, 1.6]} radius={0.18} smoothness={4} material={glassMat} />
      </group>
      <group ref={roof} position={POS.roof}>
        <RoundedBox args={[1.5, 0.09, 1.52]} radius={0.04} smoothness={4} material={paintMat} />
      </group>

      {/* Türen */}
      <group ref={doorL} position={POS.doorL}>
        <RoundedBox args={[1.3, 0.42, 0.08]} radius={0.03} smoothness={4} material={paintMat} />
      </group>
      <group ref={doorR} position={POS.doorR}>
        <RoundedBox args={[1.3, 0.42, 0.08]} radius={0.03} smoothness={4} material={paintMat} />
      </group>

      {/* Stoßstangen + Grill */}
      <group ref={frontBumper} position={POS.frontBumper}>
        <RoundedBox args={[0.5, 0.42, 1.86]} radius={0.12} smoothness={4} material={paintMat} />
      </group>
      <group ref={rearBumper} position={POS.rearBumper}>
        <RoundedBox args={[0.5, 0.42, 1.86]} radius={0.12} smoothness={4} material={paintMat} />
      </group>
      <mesh material={trimMat} position={[2.34, 0.52, 0]}>
        <boxGeometry args={[0.06, 0.18, 0.9]} />
      </mesh>

      {/* Spoiler */}
      <group ref={spoiler} position={POS.spoiler}>
        <RoundedBox args={[0.45, 0.07, 1.65]} radius={0.03} smoothness={4} material={paintMat} />
        <mesh material={trimMat} position={[0.05, -0.14, 0.55]}>
          <boxGeometry args={[0.08, 0.22, 0.08]} />
        </mesh>
        <mesh material={trimMat} position={[0.05, -0.14, -0.55]}>
          <boxGeometry args={[0.08, 0.22, 0.08]} />
        </mesh>
      </group>

      {/* Lichter */}
      <mesh material={headlightMat} position={[2.42, 0.78, 0.55]}>
        <boxGeometry args={[0.06, 0.12, 0.42]} />
      </mesh>
      <mesh material={headlightMat} position={[2.42, 0.78, -0.55]}>
        <boxGeometry args={[0.06, 0.12, 0.42]} />
      </mesh>
      <mesh material={taillightMat} position={[-2.44, 0.82, 0]}>
        <boxGeometry args={[0.05, 0.1, 1.5]} />
      </mesh>

      {/* Räder */}
      <Wheel groupRef={wheelFL} rim={swapRimMat} />
      <Wheel groupRef={wheelFR} rim={rimMat} />
      <Wheel groupRef={wheelRL} rim={rimMat} />
      <Wheel groupRef={wheelRR} rim={rimMat} />
    </group>
  )
}
