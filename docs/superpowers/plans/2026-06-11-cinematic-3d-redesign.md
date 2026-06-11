# Cinematic 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine scroll-gesteuerte 3D-Film-Sektion („Der Werkstatt-Film") mit prozeduralem Showcar: Kamera-Orbit, Explosionsansicht, Motorhaube-öffnen, Radwechsel und Lack-Welle — flüssig auf Desktop und Mobile, statisch exportierbar für GitHub Pages.

**Architecture:** Ein prozedurales 3D-Auto (three.js Primitives, alle Teile als separate Gruppen) wird in einer sticky 500vh-Scroll-Sektion gerendert. Framer Motion `useScroll` liefert einen Progress-MotionValue; innerhalb des Canvas liest `useFrame` diesen Wert imperativ (keine React-Re-Renders) und steuert Kamera-Keyframes, Teil-Animationen und Shader-Uniforms. Text-Overlays laufen als 2D-Layer über dem Canvas. Canvas wird lazy geladen (`next/dynamic`, ssr:false) und nur nahe dem Viewport gemountet.

**Tech Stack:** Next.js 14 (output: export), React 18, three ^0.170, @react-three/fiber ^8 (React-18-kompatibel — NICHT v9!), @react-three/drei ^9, framer-motion 11, Tailwind.

**Verifikation:** Das Repo hat keine Test-Infrastruktur (reine Marketing-Site). Rot/Grün = `npx tsc --noEmit` + `npm run build` + visuelle Verifikation per Dev-Server-Screenshots (Desktop + Mobile-Viewport) vor dem finalen Commit.

---

## File-Struktur

| Datei | Verantwortung |
|---|---|
| `lib/carStory.ts` | Kapitel-Daten (Texte), Scroll-Mathe (Kapitel-Index + lokales t), Easing, Kamera-Keyframes |
| `components/three/ShowCar.tsx` | Prozedurales Auto: Geometrie, Materialien, Lack-Shader, Teil-Animationen via useFrame |
| `components/three/CarStage.tsx` | Canvas, Studio-Licht (Lightformers, kein Netzwerk-HDRI), ContactShadows, CameraRig |
| `components/CarStory.tsx` | Sticky Scroll-Sektion, Kapitel-Overlays, Letterbox, Progress-Rail, Mobile/Reduced-Motion-Branches |
| `app/page.tsx` | CarStory zwischen QuickActions und Services einhängen |
| `app/globals.css` | Lichtstreifen-Keyframes für das Intro |

---

### Task 1: Dependencies installieren

**Files:** Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Installieren**

```bash
npm install three@^0.170.0 @react-three/fiber@^8.18.0 @react-three/drei@^9.122.0
```

WICHTIG: fiber v8 / drei v9 — v9/v10 brauchen React 19, das Projekt nutzt React 18.

- [ ] **Step 2: Build verifizieren**

Run: `npm run build` — Expected: Build grün, `out/` erzeugt.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "Add three.js + react-three-fiber/drei for 3D showcar"
```

---

### Task 2: Story-Daten & Scroll-Mathe

**Files:** Create: `lib/carStory.ts`

- [ ] **Step 1: Datei erstellen**

```ts
/* Kapitel-Daten + Scroll-Mathematik für den Werkstatt-Film */

export const N_CHAPTERS = 5

export interface Chapter {
  id: string
  kicker: string
  title: string
  lines: string[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'intro',
    kicker: 'Inal — Karosserie & Lack · München',
    title: 'Ihr Auto.\nUnsere Bühne.',
    lines: ['Scrollen Sie — wir zeigen Ihnen, was wir können.'],
  },
  {
    id: 'unfall',
    kicker: 'Kapitel 01 — Unfallinstandsetzung',
    title: 'Aus tausend Teilen.\nWieder eins.',
    lines: [
      'Karosserie-Instandsetzung wie ab Werk',
      'Präzise Vermessung & Richtarbeit',
      'Komplette Versicherungsabwicklung',
    ],
  },
  {
    id: 'wartung',
    kicker: 'Kapitel 02 — Wartung & Reparatur',
    title: 'Ein Blick\nunter die Haube.',
    lines: [
      'Inspektion & Service aller Marken',
      'Moderne Diagnosetechnik',
      'Öl, Bremsen, Verschleißteile',
    ],
  },
  {
    id: 'reifen',
    kicker: 'Kapitel 03 — Felgen & Reifen',
    title: 'Rundum\nerneuert.',
    lines: [
      'Felgenaufbereitung — vom Bordsteinschaden bis zur Komplettlackierung',
      'Reifenservice & Achsvermessung',
    ],
  },
  {
    id: 'lack',
    kicker: 'Kapitel 04 — Fahrzeuglackierung',
    title: 'Lack wie am\nersten Tag.',
    lines: ['Original-Farbton, perfektes Finish', 'Glanz, der bleibt'],
  },
]

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x))
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/* smoothstep zwischen a und b */
export function smooth(a: number, b: number, x: number): number {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/* Globaler Progress p∈[0,1] → Kapitel-Index + lokales t∈[0,1] */
export function getChapter(p: number): { index: number; t: number } {
  const x = clamp01(p) * N_CHAPTERS
  const index = Math.min(N_CHAPTERS - 1, Math.floor(x))
  return { index, t: clamp01(x - index) }
}

/* Kamera-Keyframes für Kapitel 1–4 (Kapitel 0 = Orbit, im Rig berechnet).
   Auto zeigt nach +X, Breite = Z, Ursprung = Bodenmitte. */
export interface CamKeyframe {
  from: [number, number, number]
  to: [number, number, number]
  tFrom: [number, number, number]
  tTo: [number, number, number]
}

export const CAM: (CamKeyframe | null)[] = [
  null,
  { from: [-2.6, 2.9, 5.2], to: [3.2, 2.5, 4.2], tFrom: [0, 0.8, 0], tTo: [0, 0.8, 0] },
  { from: [4.4, 1.7, 3.0], to: [3.0, 1.6, 1.5], tFrom: [0.6, 0.8, 0], tTo: [1.25, 0.8, 0] },
  { from: [2.7, 1.2, 4.4], to: [2.2, 0.75, 3.0], tFrom: [1.45, 0.5, 0.88], tTo: [1.45, 0.5, 0.88] },
  { from: [1.0, 1.5, 6.2], to: [-5.0, 2.3, 4.4], tFrom: [0, 0.8, 0], tTo: [0, 0.8, 0] },
]
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` — Expected: keine Fehler
- [ ] **Step 3: Commit** — `git add lib/carStory.ts && git commit -m "Add car story chapter data and scroll math"`

---

### Task 3: Prozedurales Showcar

**Files:** Create: `components/three/ShowCar.tsx`

Auto-Design: stylisiertes Sport-Coupé aus RoundedBoxes. Front = +X. Separate animierbare Teile: Haube (Pivot-Gruppe an der Hinterkante, klappt via rotation.z auf), Dach, Glas-Kabine, 2 Türen, 2 Stoßstangen, Spoiler, 4 Räder (Torus-Reifen + 5-Speichen-Felge). Lack = ein geteiltes MeshPhysicalMaterial mit onBeforeCompile-Patch für die Lack-Welle (Uniforms: uPrimerMix, uEdge — mischt Grundierungs-Grau vs. Wagenfarbe anhand Welt-X-Position, plus Glanz-Sweep an der Kante).

Animations-Logik in useFrame (liest MotionValue, kein React-Re-Render):
- Kapitel 1 (index 1): explode = sin(π·easeInOut(t)) — Teile driften zu EXPLODE-Offsets raus und wieder rein
- Kapitel 2 (index 2): Haube öffnet smooth(0.08,0.45,t), schließt ab t=0.85; Motor-Glow + PointLight koppeln an Öffnungsgrad
- Kapitel 3 (index 3): Vorderrad links (+Z-Seite) fährt raus (out·1.25 in Z), dreht sich (rotation.z = −out·16), Felgenfarbe lerpt bei t≈0.5 zu poliertem Silber mit rotem Emissive-Blitz, fährt zurück
- Kapitel 4 (index 4): uPrimerMix 0→1 (t<0.15), dann uEdge −3.8→+4.0 (t 0.18–0.88) — Lack-Welle von hinten nach vorn

- [ ] **Step 1: Datei erstellen** (vollständiger Code)

```tsx
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
        <RoundedBox args={[1.3, 0.42, 0.08] as [number, number, number]} radius={0.03} smoothness={4} material={paintMat} />
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
```

Hinweis: Die `Wheel`-Gruppen bekommen ihre Position ausschließlich im useFrame-Loop gesetzt (jede Frame), daher kein `position`-Prop nötig.

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` — Expected: keine Fehler
- [ ] **Step 3: Commit** — `git add components/three/ShowCar.tsx && git commit -m "Add procedural 3D showcar with animated parts and paint-wave shader"`

---

### Task 4: Bühne — Canvas, Licht, Kamera-Rig

**Files:** Create: `components/three/CarStage.tsx`

Studio-Licht über drei `<Environment>` + `<Lightformer>` (prozedural, **kein** Netzwerk-HDRI — wichtig für GitHub Pages/Offline). CameraRig liest den Progress jede Frame: Kapitel 0 = Orbit (Winkel/Radius parametrisch), Kapitel 1–4 = Keyframe-Lerp aus `CAM`, jeweils mit gedämpftem lerp für butterweiche Übergänge.

- [ ] **Step 1: Datei erstellen**

```tsx
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
      const r = 7.4 - e * 1.2
      desired.current.set(Math.sin(a) * r, 2.6 - e * 1.1, Math.cos(a) * r)
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
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.25} />

      {/* Prozedurales Studio-Licht — lange Strips spiegeln sich im Lack */}
      <Environment resolution={high ? 256 : 128} frames={1}>
        <Lightformer intensity={5} position={[0, 4, 0]} rotation-x={Math.PI / 2} scale={[9, 2.5, 1]} />
        <Lightformer intensity={1.6} position={[-6, 1.2, 0]} rotation-y={Math.PI / 2} scale={[7, 1.4, 1]} />
        <Lightformer intensity={1.6} position={[6, 1.2, 0]} rotation-y={-Math.PI / 2} scale={[7, 1.4, 1]} />
        <Lightformer intensity={1.2} color="#c92a2a" position={[0, 1.4, -7]} scale={[5, 2, 1]} />
        <Lightformer intensity={0.6} color="#ffffff" position={[0, 1.0, 7]} scale={[6, 1, 1]} />
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
```

- [ ] **Step 2: Typecheck** — Run: `npx tsc --noEmit` — Expected: keine Fehler
- [ ] **Step 3: Commit** — `git add components/three/CarStage.tsx && git commit -m "Add 3D stage with studio lighting and scroll-driven camera rig"`

---

### Task 5: CarStory-Sektion + Integration

**Files:**
- Create: `components/CarStory.tsx`
- Modify: `app/page.tsx` (CarStory-Import + zwischen `<QuickActions />` und `<Services />`)
- Modify: `app/globals.css` (Lichtstreifen-Keyframes ans Ende anhängen)

Aufbau: `<section h-[500vh]>` mit sticky h-screen Bühne. `useScroll` (target=Sektion, offset start/start→end/end) liefert Progress. Canvas via `next/dynamic` ssr:false, gemountet nur wenn `useInView` (margin 600px). Kapitel-Overlays: pro Kapitel ein absolut positionierter Block, Opacity/Y via `useTransform`-Fenster. Dazu: Letterbox-Balken, Ghost-Kapitelnummer, Progress-Rail rechts (5 Segmente), Scroll-Hinweis, Lichtstreifen im Intro. Reduced-Motion: statische Karten-Liste statt 3D.

- [ ] **Step 1: CarStory.tsx erstellen**

```tsx
'use client'

import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
  motion, useScroll, useTransform, useReducedMotion, useInView,
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
  const inView = useInView(ref, { margin: '600px 0px 600px 0px' })
  const [quality, setQuality] = useState<'high' | 'low'>('high')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    setQuality(mq.matches ? 'low' : 'high')
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

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

        {inView && <CarStage progress={scrollYProgress} quality={quality} />}

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
```

- [ ] **Step 2: page.tsx erweitern**

```tsx
import CarStory from '@/components/CarStory'
// ...
<QuickActions />
<CarStory />
<Services />
```

- [ ] **Step 3: globals.css — Lichtstreifen anhängen**

```css
/* ── Light streaks (CarStory Intro) ────────────────── */
.light-streak {
  position: absolute;
  top: 30%;
  left: -40%;
  width: 60%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  transform: rotate(-18deg);
  animation: streakMove 4.5s ease-in-out infinite;
}

@keyframes streakMove {
  0% { transform: translateX(-60vw) rotate(-18deg); opacity: 0; }
  15% { opacity: 1; }
  60% { opacity: 0.6; }
  100% { transform: translateX(220vw) rotate(-18deg); opacity: 0; }
}
```

- [ ] **Step 4: Typecheck + Build** — Run: `npx tsc --noEmit && npm run build` — Expected: grün
- [ ] **Step 5: Commit** — `git add components/CarStory.tsx app/page.tsx app/globals.css && git commit -m "Add scroll-driven cinematic car story section"`

---

### Task 6: Visuelle Verifikation + Deploy

**Files:** keine neuen (Fixes falls nötig)

- [ ] **Step 1: Dev-Server starten** — `npm run dev` (Hintergrund), Seite lädt auf localhost:3000/SercanWerkstatt
- [ ] **Step 2: Screenshots an mehreren Scroll-Positionen** (Playwright via npx, Desktop 1440×900 + Mobile 390×844): Intro (p≈0.05), Explosion (p≈0.3), Haube offen (p≈0.5), Rad draußen (p≈0.67), Lack-Welle (p≈0.9). Prüfen: Auto sichtbar & ansehnlich, Kamera sinnvoll, Overlays lesbar, kein Layout-Bruch der restlichen Sektionen.
- [ ] **Step 3: Gefundene Probleme fixen** (Geometrie-Feintuning, Kamera-Positionen, Overlay-Lesbarkeit) und committen
- [ ] **Step 4: Final** — `npm run build` grün → `git push` (GitHub Pages deployt automatisch)

---

## Self-Review (erledigt)

- **Spec-Abdeckung:** Alle 5 Kapitel ✓; Filmkorn-Overlay existiert bereits (`.noise-overlay`/`.scanline-overlay` in globals.css) ✓; Letterbox in CarStory ✓; Galerie-Reveals existieren bereits ✓; Service-Textkarten bleiben (Services.tsx unverändert) ✓; Mobile (quality-Switch, dpr-Clamp, useInView-Gating) ✓; reduced-motion ✓; statischer Export (ssr:false, kein Netzwerk-HDRI) ✓. „Beschriftungs-Pins" am Motor sind als Overlay-Bulletliste umgesetzt statt 3D-Pins — bewusste Vereinfachung (Mobile-Lesbarkeit).
- **Platzhalter:** keine — jeder Code-Step enthält den vollständigen Code.
- **Typ-Konsistenz:** `getChapter/easeInOut/smooth/CAM/CHAPTERS/N_CHAPTERS` aus `lib/carStory.ts` werden konsistent verwendet; `CarStage`-Props (`progress`, `quality`) stimmen zwischen Task 4 und 5 überein.
