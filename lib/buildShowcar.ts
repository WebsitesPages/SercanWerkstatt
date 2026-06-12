/* Prozedurales Luxus-Coupé im Stil klassischer britischer Grand Tourer:
   aufrechter Chrom-Kühlergrill mit vertikalen Lamellen, lange flache Haube,
   Zweifarb-Lackierung (Silber über Graphit-Schwarz) mit roter Coachline,
   vertikale Heckleuchten. Reines three.js (kein React/JSX), benannte,
   einzeln animierbare Teile. Front = +x, Breite = z. */

import * as THREE from 'three'

/* ── Maße ──────────────────────────────────────────────── */
const WIDTH = 1.9
const WHEEL_X = 1.55 /* Achsen bei ±1.55 (langer Radstand) */
const ARCH_R = 0.52
const FLOOR_Y = 0.32
export const WHEEL_Y = 0.365
export const WHEEL_Z = WIDTH / 2 - 0.16

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

/* ── Lack-Welle: gemeinsamer Shader-Patch für beide Lacktöne ── */
function patchPaint(
  mat: THREE.MeshPhysicalMaterial,
  uniforms: { uPrimerMix: { value: number }; uEdge: { value: number } }
) {
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
}

/* ── Materialien ───────────────────────────────────────── */
export function createMaterials() {
  const uniforms = { uPrimerMix: { value: 0 }, uEdge: { value: 4.5 } }

  /* Graphit-Schwarz mit starkem Clearcoat — liest sich im dunklen Studio über Reflexionen */
  const paint = new THREE.MeshPhysicalMaterial({
    color: '#2b2e35', metalness: 0.9, roughness: 0.2,
    clearcoat: 1, clearcoatRoughness: 0.06,
  })
  patchPaint(paint, uniforms)

  /* Silber für Haube + Heckdeckel (Zweifarb-Look) */
  const paintUpper = new THREE.MeshPhysicalMaterial({
    color: '#c4c7cc', metalness: 0.92, roughness: 0.18,
    clearcoat: 1, clearcoatRoughness: 0.08,
  })
  patchPaint(paintUpper, uniforms)

  return {
    uniforms,
    paint,
    paintUpper,
    chrome: new THREE.MeshStandardMaterial({ color: '#d7dade', metalness: 1, roughness: 0.08 }),
    coachline: new THREE.MeshStandardMaterial({
      color: '#7e1318', metalness: 0.6, roughness: 0.35,
      emissive: '#c92a2a', emissiveIntensity: 0.15,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#0a0d12', metalness: 0.9, roughness: 0.06, clearcoat: 1,
    }),
    trim: new THREE.MeshStandardMaterial({ color: '#0b0c0e', roughness: 0.5, metalness: 0.4 }),
    tire: new THREE.MeshStandardMaterial({ color: '#0e0f11', roughness: 0.94 }),
    rim: new THREE.MeshStandardMaterial({ color: '#c2c5ca', metalness: 0.95, roughness: 0.18 }),
    rimSwap: new THREE.MeshStandardMaterial({
      color: '#c2c5ca', metalness: 0.95, roughness: 0.18,
      emissive: '#ff2a2a', emissiveIntensity: 0,
    }),
    disc: new THREE.MeshStandardMaterial({ color: '#43464c', metalness: 0.92, roughness: 0.35 }),
    caliper: new THREE.MeshStandardMaterial({ color: '#c4252f', metalness: 0.4, roughness: 0.45 }),
    engine: new THREE.MeshStandardMaterial({ color: '#191b1f', metalness: 0.85, roughness: 0.4 }),
    engineGlow: new THREE.MeshStandardMaterial({
      color: '#1a0606', emissive: '#ff3b30', emissiveIntensity: 0,
    }),
    headlight: new THREE.MeshStandardMaterial({
      color: '#e8f0ff', emissive: '#dceaff', emissiveIntensity: 2,
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
  return new THREE.Mesh(geo, mat)
}

/* ── Karosserie-Hauptprofil (Seitenansicht) ──────────────
   Aufrechte Front, lange flache Haube, formale Dachpartie, ruhiges Heck.
   Hauben-/Heckdeckel-Bereiche liegen 0.035 tiefer (Panels liegen auf). */
function bodyShape() {
  const s = new THREE.Shape()
  const drop = 0.035

  s.moveTo(-2.28, FLOOR_Y)
  s.lineTo(-WHEEL_X - ARCH_R + 0.02, FLOOR_Y)
  s.absarc(-WHEEL_X, FLOOR_Y, ARCH_R, Math.PI, 0, true)
  s.lineTo(WHEEL_X - ARCH_R - 0.02, FLOOR_Y)
  s.absarc(WHEEL_X, FLOOR_Y, ARCH_R, Math.PI, 0, true)
  s.lineTo(2.34, FLOOR_Y)
  /* Aufrechte, hohe Front */
  s.quadraticCurveTo(2.45, 0.45, 2.42, 0.95)
  /* Lange, fast waagerechte Haubenlinie (abgesenkt) */
  s.lineTo(2.38, 0.97 - drop)
  s.quadraticCurveTo(1.4, 1.03 - drop, 0.57, 1.04 - drop)
  /* Cowl-Stufe zur Gürtellinie */
  s.lineTo(0.45, 1.08)
  /* Gürtellinie — lang und ruhig */
  s.lineTo(-1.68, 1.05)
  /* Heckdeck (abgesenkt) */
  s.quadraticCurveTo(-2.08, 1.0 - drop, -2.3, 0.86 - drop)
  /* Hohes, ruhiges Heck */
  s.lineTo(-2.38, 0.52)
  s.quadraticCurveTo(-2.4, 0.38, -2.3, FLOOR_Y)
  return s
}

/* Haubenpanel (Silber) */
function hoodShape() {
  const s = new THREE.Shape()
  s.moveTo(2.39, 0.96)
  s.quadraticCurveTo(1.4, 1.035, 0.59, 1.045)
  s.lineTo(0.59, 0.99)
  s.quadraticCurveTo(1.4, 0.975, 2.33, 0.91)
  s.closePath()
  return s
}

/* Heckdeckel (Silber) */
function trunkShape() {
  const s = new THREE.Shape()
  s.moveTo(-1.66, 1.055)
  s.quadraticCurveTo(-2.08, 1.005, -2.31, 0.865)
  s.lineTo(-2.28, 0.8)
  s.quadraticCurveTo(-2.02, 0.94, -1.66, 0.99)
  s.closePath()
  return s
}

/* Glaskanzel: aufrechtere Scheiben, langes formales Dach */
function canopyShape() {
  const s = new THREE.Shape()
  s.moveTo(0.44, 1.07)
  s.quadraticCurveTo(0.2, 1.36, -0.25, 1.42)
  s.lineTo(-0.95, 1.42)
  s.quadraticCurveTo(-1.5, 1.34, -1.7, 1.04)
  s.closePath()
  return s
}

/* Tür-Panel — lang, mit ruhiger Linie */
function doorShape() {
  const s = new THREE.Shape()
  s.moveTo(-0.95, 0.4)
  s.lineTo(0.5, 0.4)
  s.lineTo(0.47, 1.02)
  s.lineTo(-0.9, 1.0)
  s.closePath()
  return s
}

/* Rad: viel Chrom, feine Speichen */
function buildWheel(mats: ShowcarMaterials, swap: boolean) {
  const g = new THREE.Group()
  const tire = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.1, 18, 44), mats.tire)
  g.add(tire)
  const rimMat = swap ? mats.rimSwap : mats.rim
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 28), mats.trim)
  barrel.rotation.x = Math.PI / 2
  g.add(barrel)
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 28), mats.disc)
  disc.rotation.x = Math.PI / 2
  disc.position.z = -0.05
  g.add(disc)
  const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.05), mats.caliper)
  caliper.position.set(0.14, 0.04, -0.05)
  g.add(caliper)
  /* 10 feine Speichen */
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI * 2) / 10
    const arm = new THREE.Group()
    arm.rotation.z = a
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.026, 0.024), rimMat)
    spoke.position.set(0.125, 0, 0.05)
    arm.add(spoke)
    g.add(arm)
  }
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.02, 10, 44), rimMat)
  lip.position.z = 0.052
  g.add(lip)
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.045, 18), rimMat)
  hub.rotation.x = Math.PI / 2
  hub.position.z = 0.058
  g.add(hub)
  return g
}

/* ── Auto bauen ────────────────────────────────────────── */
export function buildShowcar(): Showcar {
  const mats = createMaterials()
  const car = new THREE.Group()

  /* Karosserie (Graphit-Schwarz) */
  const body = extrudeProfile(bodyShape(), WIDTH - 0.14, mats.paint)
  car.add(body)

  /* Haube (Silber, Pivot an der Cowl-Kante) */
  const hoodPivot = new THREE.Group()
  hoodPivot.position.set(0.59, 1.0, 0)
  const hood = extrudeProfile(hoodShape(), WIDTH - 0.3, mats.paintUpper, { bevelT: 0.03, bevelS: 0.03 })
  hood.position.set(-0.59, -1.0, 0)
  hoodPivot.add(hood)
  car.add(hoodPivot)

  /* Heckdeckel (Silber, Pivot an Vorderkante) */
  const trunkPivot = new THREE.Group()
  trunkPivot.position.set(-1.66, 1.02, 0)
  const trunk = extrudeProfile(trunkShape(), WIDTH - 0.3, mats.paintUpper, { bevelT: 0.03, bevelS: 0.03 })
  trunk.position.set(1.66, -1.02, 0)
  trunkPivot.add(trunk)
  car.add(trunkPivot)

  /* Glaskanzel */
  const canopy = extrudeProfile(canopyShape(), WIDTH - 0.52, mats.glass, { bevelT: 0.09, bevelS: 0.09 })
  car.add(canopy)

  /* Türen */
  const doorZ = (WIDTH - 0.14) / 2 + 0.07 - 0.015
  const doorL = new THREE.Group()
  doorL.position.set(0.5, 0, doorZ)
  const doorPanelL = extrudeProfile(doorShape(), 0.03, mats.paint, { bevelT: 0.015, bevelS: 0.015, bevelSeg: 2 })
  doorPanelL.position.set(-0.5, 0, 0)
  doorL.add(doorPanelL)
  const handleL = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.025, 0.012), mats.chrome)
  handleL.position.set(-0.25, 0.92, 0.035)
  doorL.add(handleL)
  car.add(doorL)

  const doorR = new THREE.Group()
  doorR.position.set(0.5, 0, -doorZ)
  const doorPanelR = extrudeProfile(doorShape(), 0.03, mats.paint, { bevelT: 0.015, bevelS: 0.015, bevelSeg: 2 })
  doorPanelR.position.set(-0.5, 0, 0)
  doorR.add(doorPanelR)
  const handleR = handleL.clone()
  handleR.position.z = -0.035
  doorR.add(handleR)
  car.add(doorR)

  /* Rote Coachline entlang der Flanke (Signatur-Detail) */
  for (const side of [1, -1]) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.015, 0.008), mats.coachline)
    line.position.set(0.05, 0.99, side * (WIDTH / 2 + 0.045))
    car.add(line)
  }

  /* Motorraum + Motor */
  const bay = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.26, 1.3), mats.trim)
  bay.position.set(1.5, 0.6, 0)
  car.add(bay)
  const engine = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.74), mats.engine)
  engine.position.set(1.5, 0.69, 0)
  car.add(engine)
  for (const zz of [-0.2, 0.2]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.025, 0.08), mats.engineGlow)
    strip.position.set(1.5, 0.8, zz)
    car.add(strip)
  }
  const engineLight = new THREE.PointLight('#ff5040', 0, 3)
  engineLight.position.set(1.5, 1.15, 0)
  car.add(engineLight)

  /* ── Front: aufrechter Chrom-Grill mit vertikalen Lamellen ── */
  const grilleBack = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 0.84), mats.trim)
  grilleBack.position.set(2.44, 0.62, 0)
  car.add(grilleBack)
  /* Chrom-Rahmen */
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.92), mats.chrome)
  frameTop.position.set(2.45, 0.86, 0)
  car.add(frameTop)
  const frameBottom = frameTop.clone()
  frameBottom.position.y = 0.4
  car.add(frameBottom)
  for (const side of [1, -1]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.51, 0.05), mats.chrome)
    post.position.set(2.45, 0.63, side * 0.44)
    car.add(post)
  }
  /* Vertikale Lamellen */
  for (let i = -3; i <= 3; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.4, 0.022), mats.chrome)
    slat.position.set(2.465, 0.625, i * 0.105)
    car.add(slat)
  }

  /* Schmale LED-Scheinwerfer neben dem Grill */
  for (const side of [1, -1]) {
    const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.3), mats.headlight)
    led.position.set(2.49, 0.82, side * 0.68)
    car.add(led)
    const chromeBrow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.015, 0.32), mats.chrome)
    chromeBrow.position.set(2.49, 0.87, side * 0.68)
    car.add(chromeBrow)
  }

  /* Frontschürze */
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, WIDTH - 0.3), mats.trim)
  splitter.position.set(2.38, 0.3, 0)
  car.add(splitter)

  /* ── Heck: vertikale Leuchten, Chrom-Leiste, ruhige Fläche ── */
  for (const side of [1, -1]) {
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.34, 0.09), mats.taillight)
    tail.position.set(-2.47, 0.66, side * 0.72)
    car.add(tail)
  }
  const chromeTail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 1.1), mats.chrome)
  chromeTail.position.set(-2.48, 0.8, 0)
  car.add(chromeTail)
  const valance = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, WIDTH - 0.5), mats.trim)
  valance.position.set(-2.34, 0.34, 0)
  car.add(valance)

  /* Chrom-Schwellerleiste */
  for (const side of [1, -1]) {
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.035, 0.06), mats.chrome)
    sill.position.set(0, 0.33, side * (WIDTH / 2 - 0.04))
    car.add(sill)
  }

  /* Räder */
  const makeWheel = (wx: number, side: number, swap: boolean) => {
    const w = buildWheel(mats, swap)
    w.position.set(wx, WHEEL_Y, side * WHEEL_Z)
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
