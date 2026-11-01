import React, { useRef, useMemo, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

/**
 * SidebarHeartMesh - Translucent crystal glass 3D anatomical heart
 * with internal glowing coronary vessels for the sidebar hero badge.
 */
function SidebarHeartMesh() {
  const groupRef = useRef()
  const { scene } = useGLTF("/models/heart.glb")

  const { clonedScene, coronaryGroup } = useMemo(() => {
    const clone = scene.clone(true)

    // Crystal glass physical material
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd0f2ff),
      emissive: new THREE.Color(0x0a2d52),
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.52,
      thickness: 1.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      sheen: 0.9,
      sheenColor: new THREE.Color(0x00f0ff),
      transparent: true,
      opacity: 0.95,
    })

    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = glassMat
      }
    })

    // Glowing coronary artery splines
    const curves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.08, 0.8, 0.4),
        new THREE.Vector3(-0.04, 0.3, 0.7),
        new THREE.Vector3(-0.12, -0.2, 0.8),
        new THREE.Vector3(-0.24, -0.7, 0.6),
        new THREE.Vector3(-0.32, -1.2, 0.3),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.12, -0.2, 0.8),
        new THREE.Vector3(-0.5, -0.4, 0.6),
        new THREE.Vector3(-0.75, -0.6, 0.4),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.18, 0.7, 0.3),
        new THREE.Vector3(0.55, 0.2, 0.5),
        new THREE.Vector3(0.75, -0.2, 0.3),
        new THREE.Vector3(0.6, -0.6, 0.15),
      ])
    ]

    const vesselMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 4.0,
      roughness: 0.2,
      metalness: 0.8,
    })

    const vGroup = new THREE.Group()
    curves.forEach((c) => {
      const geo = new THREE.TubeGeometry(c, 24, 0.03, 10, false)
      vGroup.add(new THREE.Mesh(geo, vesselMat))
    })

    return { clonedScene: clone, coronaryGroup: vGroup }
  }, [scene])

  // Continuous physiological lub-dub pulse and gentle continuous rotation
  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // 72 bpm physiological resting heart rate
    const cycle = (time * 3.6) % (Math.PI * 2)
    let contraction = 0

    if (cycle >= 0 && cycle < 1.3) {
      contraction = Math.sin((cycle / 1.3) * Math.PI) * 0.04
    } else if (cycle >= 1.3 && cycle < 3.2) {
      const v = (cycle - 1.3) / 1.9
      contraction = Math.sin(v * Math.PI) * 0.14
    }

    const s = (1.0 - contraction) * 1.55
    groupRef.current.scale.set(s, s, s)

    // Gentle slow rotation and float
    groupRef.current.rotation.y = time * 0.35
    groupRef.current.rotation.x = 0.15 + Math.sin(time * 0.5) * 0.05
    groupRef.current.position.y = Math.sin(time * 1.2) * 0.05
  })

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <primitive object={clonedScene} />
      <primitive object={coronaryGroup} />
    </group>
  )
}

/**
 * Sidebar3DHeart - Self-contained compact WebGL canvas for the sidebar
 */
export default function Sidebar3DHeart() {
  return (
    <div className="w-full h-44 relative pointer-events-none select-none flex items-center justify-center">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.8} color="#0d2847" />
        <directionalLight position={[4, 5, 4]} intensity={2.8} color="#e0f7ff" />
        <pointLight position={[-3, 1, 1]} intensity={4.0} distance={8} color="#00f0ff" />
        <pointLight position={[3, -2, -1]} intensity={3.0} distance={8} color="#38bdf8" />
        <pointLight position={[0, 0, 0.3]} intensity={2.5} distance={3} color="#0ea5e9" />

        <Suspense fallback={null}>
          <SidebarHeartMesh />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload("/models/heart.glb")
