import React, { useRef, useMemo, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF, Float } from "@react-three/drei"
import * as THREE from "three"

/**
 * CrystalGlassHeartModel - Recreates the luxury translucent glass/crystal
 * anatomical heart from the reference design with bioluminescent internal veins,
 * realistic glass refraction, caustics, and physiological lub-dub pulse.
 */
function CrystalGlassHeartModel({ isTransitioning, reducedMotion, mousePos }) {
  const groupRef = useRef()
  const { scene } = useGLTF("/models/heart.glb")

  // Create customized materials: crystal glass myocardium + internal glowing vessels
  const { clonedScene, coronaryLines } = useMemo(() => {
    const clone = scene.clone(true)

    // Glass / Crystal Physical Material for anatomical shell
    const crystalGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd8f2ff),
      emissive: new THREE.Color(0x062038),
      emissiveIntensity: 0.6,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.92, // Glass transmission
      ior: 1.52,          // Real glass refraction
      thickness: 2.2,     // Subsurface glass volume
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      sheen: 0.8,
      sheenColor: new THREE.Color(0x00f0ff),
      transparent: true,
      opacity: 0.95,
      depthWrite: true,
    })

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = crystalGlassMaterial
      }
    })

    // Internal Bioluminescent Coronary Vascular Network
    // Modeled as glowing 3D splines coursing through the glass heart
    const curves = [
      // Left Anterior Descending (LAD)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.1, 0.9, 0.4),
        new THREE.Vector3(-0.05, 0.4, 0.8),
        new THREE.Vector3(-0.15, -0.2, 0.9),
        new THREE.Vector3(-0.28, -0.8, 0.7),
        new THREE.Vector3(-0.38, -1.3, 0.35),
      ]),
      // Diagonal coronary branch 1
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.15, -0.2, 0.9),
        new THREE.Vector3(-0.55, -0.4, 0.75),
        new THREE.Vector3(-0.85, -0.65, 0.5),
      ]),
      // Diagonal coronary branch 2
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.28, -0.8, 0.7),
        new THREE.Vector3(-0.6, -1.0, 0.5),
      ]),
      // Right Coronary Artery (RCA)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 0.8, 0.4),
        new THREE.Vector3(0.65, 0.3, 0.6),
        new THREE.Vector3(0.85, -0.2, 0.4),
        new THREE.Vector3(0.7, -0.7, 0.2),
        new THREE.Vector3(0.35, -1.1, 0.1),
      ]),
      // Left Circumflex Artery (LCx)
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 0.8, 0.2),
        new THREE.Vector3(-0.7, 0.6, 0.1),
        new THREE.Vector3(-0.95, 0.1, -0.2),
        new THREE.Vector3(-0.8, -0.4, -0.3),
      ])
    ]

    const vesselMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00f0ff,
      emissiveIntensity: 3.5,
      roughness: 0.2,
      metalness: 0.8,
    })

    const vesselGroup = new THREE.Group()
    curves.forEach((curve) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.035, 12, false)
      const tubeMesh = new THREE.Mesh(tubeGeo, vesselMat)
      vesselGroup.add(tubeMesh)
    })

    return { clonedScene: clone, coronaryLines: vesselGroup }
  }, [scene])

  // Realistic Lub-Dub physiological cardiac cycle + gentle floating
  useFrame((state, delta) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    if (!reducedMotion) {
      // 72 bpm physiological resting heart rate (~1.2 Hz)
      const heartRateSpeed = 3.6
      const cycle = (time * heartRateSpeed) % (Math.PI * 2)

      let contraction = 0
      let torsion = 0

      if (cycle >= 0 && cycle < 1.3) {
        // Atrial phase (pre-systolic squeeze)
        contraction = Math.sin((cycle / 1.3) * Math.PI) * 0.035
      } else if (cycle >= 1.3 && cycle < 3.2) {
        // Ventricular systole (rapid, powerful contraction & twist)
        const vPhase = (cycle - 1.3) / 1.9
        contraction = Math.sin(vPhase * Math.PI) * 0.13
        torsion = Math.sin(vPhase * Math.PI) * 0.06
      } else {
        // Diastolic relaxation and ventricular refilling
        contraction = 0
        torsion = 0
      }

      // Dynamic scale
      const sx = 1.0 - contraction * 0.8
      const sy = 1.0 - contraction * 1.2
      const sz = 1.0 - contraction * 0.85
      groupRef.current.scale.set(sx * 1.62, sy * 1.62, sz * 1.62)

      // Base anatomical orientation with subtle mouse parallax and torsion
      const targetRotY = 0.45 + mousePos.current.x * 0.35 + Math.sin(time * 0.3) * 0.06 + torsion
      const targetRotX = 0.15 + mousePos.current.y * 0.25 + Math.cos(time * 0.25) * 0.04

      groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05
      groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05
      groupRef.current.position.y = -0.1 + Math.sin(time * 1.1) * 0.06
    } else {
      const gentleScale = 1.62 + Math.sin(time * 1.1) * 0.02
      groupRef.current.scale.set(gentleScale, gentleScale, gentleScale)
    }

    // Camera fly-through on transition
    if (isTransitioning) {
      groupRef.current.position.z += delta * 2.8
    }
  })

  return (
    // Positioned slightly right of center to match the reference composition
    <group ref={groupRef} position={[0.7, -0.1, 0]} rotation={[0.15, 0.45, -0.18]}>
      <primitive object={clonedScene} />
      <primitive object={coronaryLines} />
    </group>
  )
}

/**
 * SoftAtmosphericDust - Extremely subtle, elegant floating bokeh particles
 */
function SoftAtmosphericDust({ count = 600, reducedMotion }) {
  const pointsRef = useRef()

  const [positions, speeds, angles, radii, heights] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const spd = new Float32Array(count)
    const ang = new Float32Array(count)
    const rad = new Float32Array(count)
    const hgt = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const radius = 2.2 + Math.random() * 4.5
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 6.0

      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = height
      pos[i * 3 + 2] = Math.sin(angle) * radius

      spd[i] = 0.1 + Math.random() * 0.25
      ang[i] = angle
      rad[i] = radius
      hgt[i] = height
    }
    return [pos, spd, ang, rad, hgt]
  }, [count])

  const particleTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext("2d")
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, "rgba(180, 240, 255, 0.9)")
    grad.addColorStop(0.3, "rgba(80, 200, 240, 0.5)")
    grad.addColorStop(0.7, "rgba(10, 60, 90, 0.15)")
    grad.addColorStop(1, "rgba(0, 0, 0, 0)")
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current || reducedMotion) return
    const posAttr = pointsRef.current.geometry.attributes.position
    const time = state.clock.getElapsedTime()

    for (let i = 0; i < count; i++) {
      angles[i] += speeds[i] * delta * 0.25
      const r = radii[i]
      const y = heights[i] + Math.sin(time + i) * 0.08
      const x = Math.cos(angles[i]) * r
      const z = Math.sin(angles[i]) * r
      posAttr.setXYZ(i, x, y, z)
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        map={particleTexture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        opacity={0.45}
      />
    </points>
  )
}

/**
 * CameraRig - Smooth camera controls and mouse parallax
 */
function CameraRig({ mousePos, isTransitioning, onTransitionComplete, reducedMotion }) {
  const { camera } = useThree()
  const transitionProgress = useRef(0)

  useEffect(() => {
    camera.position.set(0, 0, 5.0)
  }, [camera])

  useFrame((state, delta) => {
    if (!isTransitioning) {
      if (!reducedMotion) {
        const targetX = mousePos.current.x * 0.35
        const targetY = mousePos.current.y * 0.2
        camera.position.x += (targetX - camera.position.x) * 0.04
        camera.position.y += (targetY - camera.position.y) * 0.04
        camera.lookAt(0.3, 0, 0)
      }
    } else {
      transitionProgress.current += delta * (reducedMotion ? 2.8 : 1.5)
      const t = Math.min(1.0, transitionProgress.current)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

      camera.position.z = 5.0 - ease * 4.4
      if (t >= 1.0 && onTransitionComplete) {
        onTransitionComplete()
      }
    }
  })

  return null
}

/**
 * AnatomicalHeartCanvas - Crystal Glass 3D Heart Canvas
 */
export default function AnatomicalHeartCanvas({
  isTransitioning,
  onTransitionComplete,
  reducedMotion
}) {
  const mousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
        camera={{ position: [0, 0, 5.0], fov: 42 }}
        className="w-full h-full"
      >
        {/* Soft dark midnight environment */}
        <color attach="background" args={["#03050c"]} />
        <fogExp2 attach="fog" args={["#03050c", 0.03]} />

        {/* Cinematic Studio Lighting tuned for Translucent Glass Caustics */}
        <ambientLight intensity={0.65} color="#0d2238" />

        {/* High-intensity Key Light creating crisp specular reflections on glass curves */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={3.2}
          color="#f0f9ff"
          castShadow
        />

        {/* Secondary Back Rim Light (creating the brilliant edge glow seen in the reference) */}
        <directionalLight
          position={[-4, 4, -3]}
          intensity={2.8}
          color="#38bdf8"
        />

        {/* Rim Point Light 1: Pure Cyan highlight on lower left ventricle contour */}
        <pointLight
          position={[-3.5, -0.5, 1.5]}
          intensity={4.2}
          distance={10}
          color="#00f0ff"
        />

        {/* Rim Point Light 2: Soft Emerald/Teal accent on right margin */}
        <pointLight
          position={[4, -1.5, 0.5]}
          intensity={3.0}
          distance={9}
          color="#10b981"
        />

        {/* Internal Core Luminescence: illuminates heart from within the glass */}
        <pointLight
          position={[0.7, 0.1, 0.2]}
          intensity={3.5}
          distance={4.5}
          color="#0ea5e9"
        />

        {/* Translucent Glass Heart */}
        <Suspense fallback={null}>
          <CrystalGlassHeartModel
            isTransitioning={isTransitioning}
            reducedMotion={reducedMotion}
            mousePos={mousePos}
          />
          <SoftAtmosphericDust count={600} reducedMotion={reducedMotion} />
        </Suspense>

        {/* Camera Rig & Mouse Parallax */}
        <CameraRig
          mousePos={mousePos}
          isTransitioning={isTransitioning}
          onTransitionComplete={onTransitionComplete}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/heart.glb")
