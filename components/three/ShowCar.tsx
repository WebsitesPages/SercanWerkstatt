'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { getChapter, easeInOut, smooth } from '@/lib/carStory'

/* Ferrari 458 Italia — Modell aus den offiziellen three.js-Beispielen.
   Autor: vicent091036, bereitgestellt über das three.js-Repository.
   Draco-komprimiert; Decoder liegt lokal unter /public/draco. */
const MODEL_URL = '/SercanWerkstatt/models/ferrari.glb'
const DRACO_PATH = '/SercanWerkstatt/draco/'

/* Sofort beim Laden des Chunks anstoßen — Punkt 1: kein spätes Einladen */
useGLTF.preload(MODEL_URL, DRACO_PATH)

/* ── Lack-Material mit Welle (uPrimerMix, uEdge) ───────── */
function createPaintMaterial() {
  const uniforms = { uPrimerMix: { value: 0 }, uEdge: { value: 4 } }
  const mat = new THREE.MeshPhysicalMaterial({
    color: '#c4060d', metalness: 0.9, roughness: 0.28,
    clearcoat: 1, clearcoatRoughness: 0.1,
    transparent: true, opacity: 1,
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

const engineGlowMat = new THREE.MeshStandardMaterial({
  color: '#1a0505', emissive: '#ff3b30', emissiveIntensity: 0,
})
const rimFreshColor = new THREE.Color('#f2f3f5')

/* ── Showcar: Ferrari 458, scroll-animiert ─────────────── */
export default function ShowCar({ progress }: { progress: MotionValue<number> }) {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH)
  const engineLight = useRef<THREE.PointLight>(null)

  const { mat: paintMat, uniforms } = useMemo(createPaintMaterial, [])

  /* Welt-Clip-Ebene: hält nur x <= constant (Scan-Rebuild in Kapitel 1) */
  const clipPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 6), [])

  const parts = useMemo(() => {
    /* Karosserie bekommt unser Lack-Material */
    const body = scene.getObjectByName('body') as THREE.Mesh | undefined
    if (body) body.material = paintMat

    /* Felge vorn rechts (Kamera-Seite) bekommt eigenes Material für den Wechsel */
    const rimFr = scene.getObjectByName('rim_fr') as THREE.Mesh | undefined
    let rimMat: THREE.MeshStandardMaterial | null = null
    let rimBase: THREE.Color | null = null
    if (rimFr && (rimFr.material as THREE.Material).hasOwnProperty('color')) {
      rimMat = (rimFr.material as THREE.MeshStandardMaterial).clone()
      rimMat.emissive = new THREE.Color('#ff2a2a')
      rimMat.emissiveIntensity = 0
      rimFr.material = rimMat
      rimBase = rimMat.color.clone()
    }

    /* Clip-Ebene auf alle Modell-Materialien */
    const mats = new Set<THREE.Material>()
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        list.forEach((m) => mats.add(m))
      }
    })
    mats.add(paintMat)
    mats.forEach((m) => {
      m.clippingPlanes = [clipPlane]
    })

    /* Wechsel-Rad: vorn rechts = Kamera-Seite (+z Welt) */
    const wheel = scene.getObjectByName('wheel_fr') as THREE.Group | undefined
    return {
      wheel,
      wheelBase: wheel ? wheel.position.clone() : new THREE.Vector3(),
      wheelBaseRotX: wheel ? wheel.rotation.x : 0,
      rimMat,
      rimBase,
    }
  }, [scene, paintMat, clipPlane])

  const outDir = useRef<THREE.Vector3 | null>(null)
  const tmpMatrix = useMemo(() => new THREE.Matrix4(), [])

  useFrame(() => {
    const { index, t } = getChapter(progress.get())

    /* Kapitel 1 — Scan-Rebuild: Clip-Ebene fährt durchs Auto und zurück.
       Minimum -2.0 lässt immer ein Heck-Stück stehen (Auto-Spanne ±2.3) */
    let c = 6
    if (index === 1) {
      const sweep = Math.sin(Math.PI * easeInOut(t))
      c = 2.8 - sweep * 4.8
    }
    clipPlane.constant = c

    /* Kapitel 2 — Röntgenblick: Karosserie wird gläsern, Motor glüht (Heckmotor!) */
    const xray = index === 2 ? smooth(0.08, 0.4, t) * (1 - smooth(0.85, 1, t)) : 0
    paintMat.opacity = 1 - xray * 0.78
    engineGlowMat.emissiveIntensity = xray * 4
    if (engineLight.current) engineLight.current.intensity = xray * 4

    /* Kapitel 3 — Radwechsel vorn rechts: raus, drehen, neue Felge, rein */
    let out = 0
    let fresh = 0
    if (index === 3) {
      out = smooth(0.05, 0.4, t) * (1 - smooth(0.6, 0.95, t))
      fresh = smooth(0.45, 0.55, t)
    } else if (index > 3) {
      fresh = 1
    }
    if (parts.wheel) {
      /* Ausbau-Richtung = Welt +z (Kamera-Seite), in Eltern-Koordinaten umgerechnet */
      if (!outDir.current && parts.wheel.parent) {
        parts.wheel.parent.updateWorldMatrix(true, false)
        outDir.current = new THREE.Vector3(0, 0, 1)
          .transformDirection(tmpMatrix.copy(parts.wheel.parent.matrixWorld).invert())
          .normalize()
      }
      if (outDir.current) {
        parts.wheel.position
          .copy(parts.wheelBase)
          .addScaledVector(outDir.current, out * 1.3)
      }
      parts.wheel.rotation.x = parts.wheelBaseRotX - out * 16
    }
    if (parts.rimMat && parts.rimBase) {
      parts.rimMat.color.lerpColors(parts.rimBase, rimFreshColor, fresh)
      parts.rimMat.emissiveIntensity = Math.sin(fresh * Math.PI) * 1.5
    }

    /* Kapitel 4 — Lack-Welle */
    let primer = 0
    let edge = 4
    if (index === 4) {
      primer = smooth(0, 0.15, t)
      edge = -3.8 + smooth(0.18, 0.88, t) * 7.8
    }
    uniforms.uPrimerMix.value = primer
    uniforms.uEdge.value = edge
  })

  return (
    /* Modell: Länge entlang z, Front -z → um -90° drehen, Front zeigt +x */
    <group rotation-y={-Math.PI / 2}>
      <primitive object={scene} />

      {/* Glühender Motorblock im Heck (Mittelmotor), sichtbar im Röntgen-Kapitel */}
      <mesh material={engineGlowMat} position={[0, 0.62, 1.35]}>
        <boxGeometry args={[0.85, 0.35, 0.7]} />
      </mesh>
      <pointLight ref={engineLight} position={[0, 1.0, 1.35]} color="#ff5040" intensity={0} distance={3.5} />
    </group>
  )
}
