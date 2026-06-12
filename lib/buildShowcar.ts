/* Prozeduraler GT — elegante Coupé-Silhouette aus extrudierten Kurvenprofilen
   mit echten Radlauf-Ausschnitten. Reines three.js (kein React/JSX), liefert
   benannte, einzeln animierbare Teile zurück. Front = +x, Breite = z. */

import * as THREE from 'three'

export type ShowcarMaterials = ReturnType<typeof createMaterials>

export interface Showcar {
  car: THREE.Group
  mats: ShowcarMaterials
  parts: {
    hoodPivot: THREE.Group
    trunkPivot: THREE.Group
    doorL: THREE.Group
    doorR: THREE.Group
    canopy: THREE.Mesh
    engineLight: THREE.PointLight
    wheelFL: THREE.Group
    wheelFR: THREE.Group
    wheelRL: THREE.Group
    wheelRR: THREE.Group
  }
}

/* ── Maße ──────────────────────────────────────────────── */
const WIDTH = 1.88
const WHEEL_X = 1.42 /* Achsen bei ±1.42 */
const ARCH_R = 0.5
const FLOOR_Y = 0.3

/* ── Materialien ───────────────────────────────────────── */
export function createMaterials() {
  const uniforms = { uPrimerMix: { value: 0 }, uEdge: { value: 4 } }
  const paint = new THREE.MeshPhysicalMaterial({
    color: '#a31621', metalness: 0.88, roughness: 0.3,
    clearcoat: 1, clearcoatRoughness: 0.08,
  })
  paint.onBeforeCompile = (shader) => {
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

  return {
    uniforms,
    paint,
    glass: new THREE.MeshPhysicalMaterial({
      color: '#0a0d12', metalness: 0.9, roughness: 0.06, clearcoat: 1,
    }),
    trim: new THREE.MeshStandardMaterial({ color: '#0b0c0e', roughness: 0.5, metalness: 0.4 }),
    tire: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.94 }),
    rim: new THREE.MeshStandardMaterial({ color: '#b9bcc2', metalness: 0.95, roughness: 0.22 }),
    rimSwap: new THREE.MeshStandardMaterial({
      color: '#b9bcc2', metalness: 0.95, roughness: 0.22,
      emissive: '#ff2a2a', emissiveIntensity: 0,
    }),
    disc: new THREE.MeshStandardMaterial({ color: '#43464c', metalness: 0.92, roughness: 0.35 }),
    caliper: new THREE.MeshStandardMaterial({ color: '#c4252f', metalness: 0.4, roughness: 0.45 }),
    engine: new THREE.MeshStandardMaterial({ color: '#191b1f', metalness: 0.85, roughness: 0.4 }),
    engineGlow: new THREE.MeshStandardMaterial({
      color: '#1a0606', emissive: '#ff3b30', emissiveIntensity: 0,
    }),
    headlight: new THREE.MeshStandardMaterial({
      color: '#e8f0ff', emissive: '#dceaff', emissiveIntensity: 2.2,
    }),
    taillight: new THREE.MeshStandardMaterial({
      color: '#2a0606', emissive: '#ff1f1f', emissiveIntensity: 1.1,
    }),
  }
}

/* Extrudiertes Profil, in der Breite (z) zentriert */
interface ExtrudeOpts {
  bevelT?: number
  bevelS?: number
  bevelSeg?: number
}

function extrudeProfile(shape: THREE.Shape, width: number, mat: THREE.Material, opts: ExtrudeOpts = {}) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width,
    bevelEnabled: true,
    bevelThickness: opts.bevelT ?? 0.07,
    bevelSize: opts.bevelS ?? 0.07,
    bevelSegments: opts.bevelSeg ?? 4,
    curveSegments: 28,
    steps: 1,
  })
  geo.translate(0, 0, -width / 2)
  const mesh = new THREE.Mesh(geo, mat)
  return mesh
}

/* ── Karosserie-Hauptprofil (Seitenansicht, x=Länge, y=Höhe) ──
   Mit echten Radlauf-Ausschnitten im Umriss. Die Hauben-/Heckdeckel-
   Bereiche liegen 0.035 tiefer, damit die separaten Panels aufliegen. */
function bodyShape() {
  const s = new THREE.Shape()
  const drop = 0.035

  s.moveTo(-2.08, FLOOR_Y)
  /* Unterboden → hinterer Radlauf */
  s.lineTo(-WHEEL_X - ARCH_R + 0.02, FLOOR_Y)
  s.absarc(-WHEEL_X, FLOOR_Y, ARCH_R, Math.PI, 0, true)
  /* → vorderer Radlauf */
  s.lineTo(WHEEL_X - ARCH_R - 0.02, FLOOR_Y)
  s.absarc(WHEEL_X, FLOOR_Y, ARCH_R, Math.PI, 0, true)
  s.lineTo(2.18, FLOOR_Y)
  /* Front: steile Nase statt Rampe */
  s.quadraticCurveTo(2.36, 0.36, 2.32, 0.58)
  /* Lange, fast flache Haubenlinie (abgesenkt, Panel liegt drauf) */
  s.quadraticCurveTo(1.55, 0.87 - drop, 0.72, 0.91 - drop)
  /* Cowl: kleine Stufe hoch zur Gürtellinie */
  s.lineTo(0.6, 0.94)
  /* Gürtellinie unterm Glas, leicht fallend nach hinten */
  s.lineTo(-1.45, 0.92)
  /* Heckdeck (abgesenkt für Heckdeckel-Panel) */
  s.quadraticCurveTo(-1.85, 0.89 - drop, -2.08, 0.78 - drop)
  /* Kamm-Heck: Abrisskante */
  s.lineTo(-2.16, 0.5)
  s.quadraticCurveTo(-2.18, 0.36, -2.1, FLOOR_Y)
  return s
}

/* Haubenpanel: dünne Schale über dem abgesenkten Haubenbereich */
function hoodShape() {
  const s = new THREE.Shape()
  s.moveTo(2.28, 0.6)
  s.quadraticCurveTo(1.55, 0.9, 0.74, 0.94)
  s.lineTo(0.74, 0.875)
  s.quadraticCurveTo(1.5, 0.8, 2.18, 0.52)
  s.closePath()
  return s
}

/* Heckdeckel */
function trunkShape() {
  const s = new THREE.Shape()
  s.moveTo(-1.43, 0.935)
  s.quadraticCurveTo(-1.85, 0.9, -2.07, 0.8)
  s.lineTo(-2.05, 0.74)
  s.quadraticCurveTo(-1.8, 0.84, -1.43, 0.875)
  s.closePath()
  return s
}

/* Glaskanzel: Windschutzscheibe → Dach → Heckscheibe (Fastback) */
function canopyShape() {
  const s = new THREE.Shape()
  s.moveTo(0.6, 0.93)
  s.quadraticCurveTo(0.28, 1.18, -0.15, 1.23)
  s.lineTo(-0.7, 1.23)
  s.quadraticCurveTo(-1.2, 1.16, -1.46, 0.91)
  s.closePath()
  return s
}

/* Tür-Panel (flach, leicht gewölbt wirkt es durch Bevel) */
function doorShape() {
  const s = new THREE.Shape()
  s.moveTo(-0.78, 0.36)
  s.lineTo(0.62, 0.36)
  s.lineTo(0.6, 0.9)
  s.lineTo(-0.74, 0.9)
  s.closePath()
  return s
}

function buildWheel(mats: ShowcarMaterials, swap: boolean) {
  const g = new THREE.Group()
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.095, 18, 44), mats.tire)
  g.add(tire)
  const rimMat = swap ? mats.rimSwap : mats.rim
  /* Felgenbett (dunkler Zylinder hinter den Speichen) */
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.14, 28), mats.trim)
  barrel.rotation.x = Math.PI / 2
  g.add(barrel)
  /* Bremsscheibe + Sattel */
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 28), mats.disc)
  disc.rotation.x = Math.PI / 2
  disc.position.z = -0.045
  g.add(disc)
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.05), mats.caliper)
  caliper.position.set(0.13, 0.04, -0.045)
  g.add(caliper)
  /* 5 Doppelspeichen (bleiben innerhalb des Reifens) */
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5
    const pair = new THREE.Group()
    pair.rotation.z = a
    for (const off of [-0.024, 0.024]) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.04, 0.028), rimMat)
      spoke.position.set(0.12, off, 0.048)
      pair.add(spoke)
    }
    g.add(pair)
  }
  /* Felgenhorn + Nabe */
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.02, 10, 44), rimMat)
  lip.position.z = 0.05
  g.add(lip)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16), rimMat)
  hub.rotation.x = Math.PI / 2
  hub.position.z = 0.055
  g.add(hub)
  return g
}

/* ── Auto bauen ────────────────────────────────────────── */
export function buildShowcar(): Showcar {
  const mats = createMaterials()
  const car = new THREE.Group()

  /* Karosserie */
  const body = extrudeProfile(bodyShape(), WIDTH - 0.14, mats.paint)
  car.add(body)

  /* Haube (Pivot an der Cowl-Kante, öffnet vorn nach oben) */
  const hoodPivot = new THREE.Group()
  hoodPivot.position.set(0.74, 0.895, 0)
  const hood = extrudeProfile(hoodShape(), WIDTH - 0.3, mats.paint, { bevelT: 0.03, bevelS: 0.03 })
  hood.position.set(-0.74, -0.895, 0)
  hoodPivot.add(hood)
  car.add(hoodPivot)

  /* Heckdeckel (Pivot an Vorderkante) */
  const trunkPivot = new THREE.Group()
  trunkPivot.position.set(-1.43, 0.9, 0)
  const trunk = extrudeProfile(trunkShape(), WIDTH - 0.3, mats.paint, { bevelT: 0.03, bevelS: 0.03 })
  trunk.position.set(1.43, -0.9, 0)
  trunkPivot.add(trunk)
  car.add(trunkPivot)

  /* Glaskanzel */
  const canopy = extrudeProfile(canopyShape(), WIDTH - 0.52, mats.glass, { bevelT: 0.09, bevelS: 0.09 })
  car.add(canopy)

  /* Türen (dünn, außen auf der Flanke) */
  const doorL = new THREE.Group()
  doorL.position.set(0.62, 0, (WIDTH - 0.14) / 2 + 0.07 - 0.015)
  const doorPanelL = extrudeProfile(doorShape(), 0.03, mats.paint, { bevelT: 0.015, bevelS: 0.015, bevelSeg: 2 })
  doorPanelL.position.set(-0.62, 0, 0)
  doorL.add(doorPanelL)
  const handleL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.025, 0.012), mats.trim)
  handleL.position.set(-0.32, 0.8, 0.035)
  doorL.add(handleL)
  car.add(doorL)

  const doorR = new THREE.Group()
  doorR.position.set(0.62, 0, -((WIDTH - 0.14) / 2 + 0.07 - 0.015))
  const doorPanelR = extrudeProfile(doorShape(), 0.03, mats.paint, { bevelT: 0.015, bevelS: 0.015, bevelSeg: 2 })
  doorPanelR.position.set(-0.62, 0, 0)
  doorR.add(doorPanelR)
  const handleR = handleL.clone()
  handleR.position.z = -0.035
  doorR.add(handleR)
  car.add(doorR)

  /* Motorraum + Motor (sichtbar bei offener Haube) */
  const bay = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.24, 1.3), mats.trim)
  bay.position.set(1.45, 0.55, 0)
  car.add(bay)
  const engine = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.72), mats.engine)
  engine.position.set(1.45, 0.62, 0)
  car.add(engine)
  for (const zz of [-0.2, 0.2]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.025, 0.08), mats.engineGlow)
    strip.position.set(1.45, 0.72, zz)
    car.add(strip)
  }
  const engineLight = new THREE.PointLight('#ff5040', 0, 3)
  engineLight.position.set(1.45, 1.1, 0)
  car.add(engineLight)

  /* Front: Splitter, Grill, LED-Scheinwerfer */
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.06, WIDTH - 0.24), mats.trim)
  splitter.position.set(2.24, 0.28, 0)
  car.add(splitter)
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.8), mats.trim)
  grille.position.set(2.34, 0.42, 0)
  car.add(grille)
  for (const side of [1, -1]) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.4), mats.headlight)
    led.position.set(2.37, 0.55, side * 0.52)
    led.rotation.y = side * -0.3
    car.add(led)
  }

  /* Heck: Lichtleiste, Diffusor, Auspuff */
  const lightbar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, WIDTH - 0.42), mats.taillight)
  lightbar.position.set(-2.21, 0.64, 0)
  car.add(lightbar)
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, WIDTH - 0.5), mats.trim)
  diffuser.position.set(-2.14, 0.32, 0)
  car.add(diffuser)
  for (const side of [1, -1]) {
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.12, 18), mats.trim)
    exhaust.rotation.z = Math.PI / 2
    exhaust.position.set(-2.2, 0.38, side * 0.62)
    car.add(exhaust)
  }

  /* Schweller */
  for (const side of [1, -1]) {
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.09, 0.1), mats.trim)
    sill.position.set(0, 0.3, side * (WIDTH / 2 - 0.06))
    car.add(sill)
  }

  /* Räder */
  const makeWheel = (wx: number, side: number, swap: boolean) => {
    const w = buildWheel(mats, swap)
    w.position.set(wx, 0.345, side * (WIDTH / 2 - 0.16))
    if (side < 0) w.rotation.y = Math.PI
    car.add(w)
    return w
  }
  const wheelFL = makeWheel(WHEEL_X, 1, true)
  const wheelFR = makeWheel(WHEEL_X, -1, false)
  const wheelRL = makeWheel(-WHEEL_X, 1, false)
  const wheelRR = makeWheel(-WHEEL_X, -1, false)

  return {
    car,
    mats,
    parts: {
      hoodPivot,
      trunkPivot,
      doorL,
      doorR,
      canopy,
      engineLight,
      wheelFL,
      wheelFR,
      wheelRL,
      wheelRR,
    },
  }
}
