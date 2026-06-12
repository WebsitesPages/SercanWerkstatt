'use client'

import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'
import { getChapter, easeInOut, smooth } from '@/lib/carStory'

/* „CarConcept" — markenfreies Konzeptauto aus den offiziellen Khronos
   glTF-Sample-Assets. Modell & Texturen: Eric Chadwick, Lizenz CC BY 4.0.
   https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept */
const MODEL_URL = '/SercanWerkstatt/models/carconcept/CarConcept.gltf'
const DRACO_PATH = '/SercanWerkstatt/draco/'
const BASIS_PATH = '/SercanWerkstatt/basis/'

/* Modell-Koordinaten: Länge = z (Front +z), Breite = x (links +x), Boden y=-0.16.
   Wrapper dreht +90° um y → Front zeigt +x (Welt), Kamera-Seite +z = rechte Fahrzeugseite. */
const HOOD_OPEN = 0.62
const DOOR_OPEN = 0.92
const HATCH_OPEN = 0.8
const WHEEL_EXPLODE = 0.55

/* Lack-Welle: Patch auf die geladenen Paint-Materialien (behält Flake-Texturen) */
function patchPaintMaterial(mat: THREE.Material, uniforms: { uPrimerMix: { value: number }; uEdge: { value: number } }) {
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
  mat.needsUpdate = true
}

const rimFreshColor = new THREE.Color('#f2f3f5')
const SPIN_AXIS = new THREE.Vector3(1, 0, 0)

export default function ShowCar({ progress }: { progress: MotionValue<number> }) {
  const gl = useThree((s) => s.gl)
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH, false, (loader) => {
    const ktx2 = new KTX2Loader().setTranscoderPath(BASIS_PATH).detectSupport(gl)
    ;(loader as GLTFLoader).setKTX2Loader(ktx2)
  })
  const engineLight = useRef<THREE.PointLight>(null)

  const uniforms = useMemo(() => ({ uPrimerMix: { value: 0 }, uEdge: { value: 4 } }), [])
  const spinQuat = useMemo(() => new THREE.Quaternion(), [])

  const parts = useMemo(() => {
    const get = (n: string) => scene.getObjectByName(n) as THREE.Object3D | undefined

    /* Lack-Materialien patchen (einmalig) */
    const patched = new Set<THREE.Material>()
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      for (const m of list) {
        if (/^Paint/.test(m.name) && !patched.has(m)) {
          patchPaintMaterial(m, uniforms)
          patched.add(m)
        }
      }
    })

    /* Wechselrad (vorn rechts = Kamera-Seite) bekommt eigenes Felgen-Material */
    const swapWheel = get('WheelFrontR')
    const swapRim = get('WheelFrontRRim') as THREE.Mesh | undefined
    let rimMat: THREE.MeshStandardMaterial | null = null
    let rimBase: THREE.Color | null = null
    if (swapRim && !Array.isArray(swapRim.material)) {
      rimMat = (swapRim.material as THREE.MeshStandardMaterial).clone()
      rimMat.emissive = new THREE.Color('#ff2a2a')
      rimMat.emissiveIntensity = 0
      swapRim.material = rimMat
      rimBase = rimMat.color.clone()
    }

    const wheels = [
      { node: get('WheelFrontL'), out: 1 },
      { node: get('WheelFrontR'), out: -1 },
      { node: get('WheelRearL'), out: 1 },
      { node: get('WheelRearR'), out: -1 },
    ].filter((w) => w.node) as { node: THREE.Object3D; out: number }[]

    return {
      hood: get('BodyHood'),
      doorL: get('BodyDoorLColor1'),
      doorR: get('BodyDoorRColor1'),
      hatch: get('BodyRearPanelsColor1'),
      wheels,
      wheelBases: wheels.map((w) => w.node.position.clone()),
      swapWheel,
      swapBaseQuat: swapWheel ? swapWheel.quaternion.clone() : null,
      rimMat,
      rimBase,
    }
  }, [scene, uniforms])

  useFrame(() => {
    const { index, t } = getChapter(progress.get())

    /* Kapitel 1 — Explosionsansicht: alles öffnet, Räder fahren raus */
    const ex = index === 1 ? Math.sin(Math.PI * easeInOut(t)) : 0

    /* Kapitel 2 — Motorhaube öffnet wirklich, Motor glüht */
    const service = index === 2 ? smooth(0.08, 0.45, t) * (1 - smooth(0.85, 1, t)) : 0
    const hoodOpen = Math.max(ex, service)

    if (parts.hood) parts.hood.rotation.x = hoodOpen * HOOD_OPEN
    if (parts.doorL) parts.doorL.rotation.y = ex * DOOR_OPEN
    if (parts.doorR) parts.doorR.rotation.y = -ex * DOOR_OPEN
    if (parts.hatch) parts.hatch.rotation.x = -ex * HATCH_OPEN
    if (engineLight.current) engineLight.current.intensity = service * 4

    /* Kapitel 3 — Radwechsel vorn rechts: raus zur Kamera, drehen, neue Felge */
    let out = 0
    let fresh = 0
    if (index === 3) {
      out = smooth(0.05, 0.4, t) * (1 - smooth(0.6, 0.95, t))
      fresh = smooth(0.45, 0.55, t)
    } else if (index > 3) {
      fresh = 1
    }

    parts.wheels.forEach((w, i) => {
      const base = parts.wheelBases[i]
      let dx = w.out * ex * WHEEL_EXPLODE
      let dy = 0
      if (w.node === parts.swapWheel) {
        dx += -out * 0.95
        dy = out * 0.3
      }
      w.node.position.set(base.x + dx, base.y + dy, base.z)
    })
    if (parts.swapWheel && parts.swapBaseQuat) {
      spinQuat.setFromAxisAngle(SPIN_AXIS, -out * 14)
      parts.swapWheel.quaternion.copy(parts.swapBaseQuat).premultiply(spinQuat)
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
    /* Front (+z im Modell) zeigt nach der Drehung nach +x; Auto auf den Boden heben */
    <group rotation-y={Math.PI / 2} position-y={0.16}>
      <primitive object={scene} />
      {/* Motor-Glow unter der Haube (Frontmotor bei z≈1.9 im Modell) */}
      <pointLight ref={engineLight} position={[0, 0.75, 1.9]} color="#ff5040" intensity={0} distance={3.5} />
    </group>
  )
}
