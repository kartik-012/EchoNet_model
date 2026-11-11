import React, { useEffect, useRef } from "react"

import * as THREE from "three"



/**

 * ThreeHeartCanvas - High-Fidelity Anatomical 3D Heart Experience

 * Features:

 * - Sculpted ventricles (LV/RV), atria, aortic arch with 3 branches, pulmonary trunk & SVC

 * - Bioluminescent coronary artery system (LAD, RCA, Circumflex)

 * - Realistic dual-phase "lub-dub" cardiac contraction & torsion

 * - 1200+ glowing cardiac corpuscle particles

 * - Cinematic mouse parallax & camera fly-through transition

 */

export default function ThreeHeartCanvas({ isTransitioning, onTransitionComplete, reducedMotion, bpm = 72, cameraAngle = "anterior" }) {

  const mountRef = useRef(null)

  const isTransitioningRef = useRef(isTransitioning)

  const bpmRef = useRef(bpm)

  const cameraAngleRef = useRef(cameraAngle)

  const reducedMotionRef = useRef(reducedMotion)



  useEffect(() => {

    isTransitioningRef.current = isTransitioning

    reducedMotionRef.current = reducedMotion

    bpmRef.current = bpm

    cameraAngleRef.current = cameraAngle

  }, [isTransitioning, reducedMotion])



  useEffect(() => {

    const container = mountRef.current

    if (!container) return



    const width = container.clientWidth

    const height = container.clientHeight



    // Scene & Camera

    const scene = new THREE.Scene()

    scene.fog = new THREE.FogExp2(0x040711, 0.04)



    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)

    camera.position.set(0, 0, 8.5)



    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(width, height)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    renderer.toneMapping = THREE.ACESFilmicToneMapping

    renderer.toneMappingExposure = 1.2

    container.appendChild(renderer.domElement)



    // Master Heart Group

    const heartGroup = new THREE.Group()

    scene.add(heartGroup)



    // Gentle anatomical tilt (heart rests at approx 40 deg angle in thoracic cavity)

    heartGroup.rotation.z = -0.22

    heartGroup.rotation.y = 0.35

    heartGroup.rotation.x = 0.12



    // Materials

    // Organic myocardial muscle material with velvet sheen

    const myocardialMaterial = new THREE.MeshPhysicalMaterial({

      color: 0x162c3d,

      emissive: 0x05131f,

      roughness: 0.38,

      metalness: 0.15,

      clearcoat: 0.6,

      clearcoatRoughness: 0.3,

      sheen: 0.8,

      sheenColor: 0x00f0ff,

      transmission: 0.05,

      ior: 1.45,

    })



    // Great Vessels material (Aorta, Pulmonary Artery)

    const vesselMaterial = new THREE.MeshPhysicalMaterial({

      color: 0x1a384f,

      emissive: 0x0a1e2c,

      roughness: 0.45,

      metalness: 0.2,

      clearcoat: 0.5,

      sheen: 0.6,

      sheenColor: 0x38bdf8,

    })



    // Bioluminescent coronary artery material

    const coronaryMaterial = new THREE.MeshStandardMaterial({

      color: 0x00ffff,

      emissive: 0x00e5ff,

      emissiveIntensity: 1.8,

      roughness: 0.2,

      metalness: 0.8,

    })



    // 1. LEFT VENTRICLE & APEX BODY (Conical muscular structure)

    const lvGeo = new THREE.SphereGeometry(1.6, 64, 64)

    const lvPos = lvGeo.attributes.position

    // Deform sphere into authentic cardiac anatomical shape

    for (let i = 0; i < lvPos.count; i++) {

      let x = lvPos.getX(i)

      let y = lvPos.getY(i)

      let z = lvPos.getZ(i)



      // Taper down towards apex

      if (y < 0) {

        const factor = 1.0 + y * 0.45

        x *= factor

        z *= factor

        // Curve apex towards anterior left

        x += Math.pow(Math.abs(y), 1.5) * -0.22

        z += Math.pow(Math.abs(y), 1.3) * 0.15

      } else {

        // Broaden base

        x *= 1.08

        z *= 0.95

      }



      // Anterior interventricular groove indentation

      const angle = Math.atan2(z, x)

      if (angle > 0.4 && angle < 1.3 && y < 0.5 && y > -1.2) {

        const indent = Math.sin((angle - 0.4) / 0.9 * Math.PI) * 0.12

        x -= Math.cos(angle) * indent

        z -= Math.sin(angle) * indent

      }



      lvPos.setXYZ(i, x, y, z)

    }

    lvGeo.computeVertexNormals()

    const lvMesh = new THREE.Mesh(lvGeo, myocardialMaterial)

    lvMesh.position.set(-0.25, -0.4, 0)

    heartGroup.add(lvMesh)



    // 2. RIGHT VENTRICLE (Crescent shape hugging anterolateral LV)

    const rvGeo = new THREE.SphereGeometry(1.3, 48, 48)

    const rvPos = rvGeo.attributes.position

    for (let i = 0; i < rvPos.count; i++) {

      let x = rvPos.getX(i)

      let y = rvPos.getY(i)

      let z = rvPos.getZ(i)

      if (y < 0) {

        const factor = 1.0 + y * 0.38

        x *= factor

        z *= factor

      }

      x *= 0.88

      z *= 1.15

      rvPos.setXYZ(i, x, y, z)

    }

    rvGeo.computeVertexNormals()

    const rvMesh = new THREE.Mesh(rvGeo, myocardialMaterial)

    rvMesh.position.set(0.7, -0.45, 0.4)

    heartGroup.add(rvMesh)



    // 3. LEFT ATRIUM & AURICLE (Posterior superior chamber)

    const laGeo = new THREE.SphereGeometry(0.9, 32, 32)

    const laMesh = new THREE.Mesh(laGeo, myocardialMaterial)

    laMesh.position.set(-0.8, 1.0, -0.3)

    laMesh.scale.set(0.9, 0.8, 0.85)

    heartGroup.add(laMesh)



    // 4. RIGHT ATRIUM & AURICLE

    const raGeo = new THREE.SphereGeometry(0.95, 32, 32)

    const raMesh = new THREE.Mesh(raGeo, myocardialMaterial)

    raMesh.position.set(0.9, 0.75, 0.15)

    raMesh.scale.set(0.85, 0.95, 0.85)

    heartGroup.add(raMesh)



    // 5. ASCENDING AORTA & AORTIC ARCH (With 3 anatomical arterial branches)

    const aortaCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.1, 0.6, 0.1),

      new THREE.Vector3(-0.05, 1.4, 0.05),

      new THREE.Vector3(-0.2, 2.0, -0.2),

      new THREE.Vector3(-0.8, 2.1, -0.5),

      new THREE.Vector3(-1.1, 1.4, -0.8),

    ])

    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 40, 0.38, 24, false)

    const aortaMesh = new THREE.Mesh(aortaGeo, vesselMaterial)

    heartGroup.add(aortaMesh)



    // Three Aortic Arch Branches:

    // 1) Brachiocephalic artery

    const bcaCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.25, 2.05, -0.22),

      new THREE.Vector3(-0.22, 2.65, -0.15),

    ])

    const bcaMesh = new THREE.Mesh(new THREE.TubeGeometry(bcaCurve, 12, 0.12, 16, false), vesselMaterial)

    heartGroup.add(bcaMesh)



    // 2) Left common carotid artery

    const lccCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.5, 2.12, -0.35),

      new THREE.Vector3(-0.52, 2.7, -0.3),

    ])

    const lccMesh = new THREE.Mesh(new THREE.TubeGeometry(lccCurve, 12, 0.1, 16, false), vesselMaterial)

    heartGroup.add(lccMesh)



    // 3) Left subclavian artery

    const lsaCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.75, 2.08, -0.45),

      new THREE.Vector3(-0.82, 2.62, -0.42),

    ])

    const lsaMesh = new THREE.Mesh(new THREE.TubeGeometry(lsaCurve, 12, 0.1, 16, false), vesselMaterial)

    heartGroup.add(lsaMesh)



    // 6. PULMONARY TRUNK & BIFURCATION (Crossing obliquely in front of aorta)

    const ptCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(0.4, 0.4, 0.5),

      new THREE.Vector3(0.2, 1.2, 0.4),

      new THREE.Vector3(-0.1, 1.5, 0.15),

      new THREE.Vector3(-0.35, 1.6, -0.2),

    ])

    const ptMesh = new THREE.Mesh(new THREE.TubeGeometry(ptCurve, 30, 0.34, 20, false), vesselMaterial)

    heartGroup.add(ptMesh)



    // Left and right pulmonary artery branches

    const rpaCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.1, 1.5, 0.15),

      new THREE.Vector3(0.8, 1.45, -0.3),

    ])

    const rpaMesh = new THREE.Mesh(new THREE.TubeGeometry(rpaCurve, 16, 0.18, 16, false), vesselMaterial)

    heartGroup.add(rpaMesh)



    // 7. SUPERIOR VENA CAVA (SVC)

    const svcCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(1.1, 0.9, 0.1),

      new THREE.Vector3(1.05, 2.1, -0.1),

    ])

    const svcMesh = new THREE.Mesh(new THREE.TubeGeometry(svcCurve, 16, 0.28, 16, false), vesselMaterial)

    heartGroup.add(svcMesh)



    // 8. BIOLUMINESCENT CORONARY ARTERY VASCULAR NETWORK

    // A) Left Anterior Descending (LAD) artery tracking down the anterior interventricular sulcus to the apex

    const ladCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.15, 0.7, 0.9),

      new THREE.Vector3(-0.05, 0.2, 1.25),

      new THREE.Vector3(-0.18, -0.4, 1.3),

      new THREE.Vector3(-0.35, -1.1, 1.05),

      new THREE.Vector3(-0.48, -1.75, 0.55),

    ])

    const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 36, 0.045, 12, false), coronaryMaterial)

    heartGroup.add(ladMesh)



    // Diagonal branch from LAD

    const diagCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.18, -0.4, 1.3),

      new THREE.Vector3(-0.7, -0.7, 1.1),

      new THREE.Vector3(-1.1, -1.0, 0.7),

    ])

    const diagMesh = new THREE.Mesh(new THREE.TubeGeometry(diagCurve, 20, 0.03, 10, false), coronaryMaterial)

    heartGroup.add(diagMesh)



    // B) Right Coronary Artery (RCA) curving in the atrioventricular groove

    const rcaCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(0.4, 0.5, 0.7),

      new THREE.Vector3(0.9, 0.1, 0.8),

      new THREE.Vector3(1.15, -0.4, 0.5),

      new THREE.Vector3(1.0, -1.0, 0.1),

      new THREE.Vector3(0.5, -1.5, -0.1),

    ])

    const rcaMesh = new THREE.Mesh(new THREE.TubeGeometry(rcaCurve, 30, 0.04, 12, false), coronaryMaterial)

    heartGroup.add(rcaMesh)



    // C) Left Circumflex Artery (LCx)

    const lcxCurve = new THREE.CatmullRomCurve3([

      new THREE.Vector3(-0.3, 0.6, 0.6),

      new THREE.Vector3(-0.9, 0.4, 0.3),

      new THREE.Vector3(-1.3, 0.0, -0.1),

      new THREE.Vector3(-1.2, -0.6, -0.4),

    ])

    const lcxMesh = new THREE.Mesh(new THREE.TubeGeometry(lcxCurve, 24, 0.035, 10, false), coronaryMaterial)

    heartGroup.add(lcxMesh)



    // 9. WIREFRAME SCANNING HOLOGRAPHIC OVERLAY (Revealed dynamically during transition)

    const wireGeo = lvGeo.clone()

    const wireMat = new THREE.MeshBasicMaterial({

      color: 0x00f0ff,

      wireframe: true,

      transparent: true,

      opacity: 0.0,

    })

    const wireMesh = new THREE.Mesh(wireGeo, wireMat)

    wireMesh.position.copy(lvMesh.position)

    heartGroup.add(wireMesh)



    // 10. ATMOSPHERIC PARTICLE VORTEX (Cardiac energy corpuscles)

    const particleCount = 1400

    const particleGeo = new THREE.BufferGeometry()

    const particlePositions = new Float32Array(particleCount * 3)

    const particleScales = new Float32Array(particleCount)

    const particleSpeeds = new Float32Array(particleCount)

    const particleAngles = new Float32Array(particleCount)

    const particleRadii = new Float32Array(particleCount)

    const particleHeights = new Float32Array(particleCount)



    for (let i = 0; i < particleCount; i++) {

      const radius = 2.2 + Math.random() * 4.8

      const angle = Math.random() * Math.PI * 2

      const height = (Math.random() - 0.5) * 6.5



      particlePositions[i * 3] = Math.cos(angle) * radius

      particlePositions[i * 3 + 1] = height

      particlePositions[i * 3 + 2] = Math.sin(angle) * radius



      particleScales[i] = 0.5 + Math.random() * 1.5

      particleSpeeds[i] = 0.2 + Math.random() * 0.5

      particleAngles[i] = angle

      particleRadii[i] = radius

      particleHeights[i] = height

    }



    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))



    // Canvas particle texture

    const canvas = document.createElement("canvas")

    canvas.width = 32

    canvas.height = 32

    const ctx = canvas.getContext("2d")

    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)

    grad.addColorStop(0, "rgba(0, 240, 255, 1)")

    grad.addColorStop(0.3, "rgba(0, 200, 240, 0.7)")

    grad.addColorStop(0.7, "rgba(10, 60, 90, 0.2)")

    grad.addColorStop(1, "rgba(0, 0, 0, 0)")

    ctx.fillStyle = grad

    ctx.fillRect(0, 0, 32, 32)

    const particleTexture = new THREE.CanvasTexture(canvas)



    const particleMaterial = new THREE.PointsMaterial({

      size: 0.12,

      map: particleTexture,

      transparent: true,

      blending: THREE.AdditiveBlending,

      depthWrite: false,

      opacity: 0.75,

    })

    const particleSystem = new THREE.Points(particleGeo, particleMaterial)

    scene.add(particleSystem)



    // 11. LIGHTING

    // Ambient light - deep space midnight

    const ambientLight = new THREE.AmbientLight(0x061524, 1.2)

    scene.add(ambientLight)



    // Key light - cool white clinical luminaire

    const keyLight = new THREE.DirectionalLight(0xe0f2fe, 2.5)

    keyLight.position.set(4, 5, 5)

    scene.add(keyLight)



    // Rim light - vibrant cardiac cyan / electric teal

    const rimLight1 = new THREE.PointLight(0x00f0ff, 4.0, 12)

    rimLight1.position.set(-4, -1, -2)

    scene.add(rimLight1)



    const rimLight2 = new THREE.PointLight(0x06b6d4, 3.0, 10)

    rimLight2.position.set(3, -2, -3)

    scene.add(rimLight2)



    // Internal myocardial glow

    const coreLight = new THREE.PointLight(0x0284c7, 2.5, 4.5)

    coreLight.position.set(0, 0, 0.2)

    scene.add(coreLight)



    // MOUSE PARALLAX TRACKING

    let mouseX = 0

    let mouseY = 0

    let targetRotX = 0

    let targetRotY = 0



    const onMouseMove = (e) => {

      const normX = (e.clientX / window.innerWidth) * 2 - 1

      const normY = (e.clientY / window.innerHeight) * 2 - 1

      targetRotY = normX * 0.45

      targetRotX = normY * 0.3

    }

    window.addEventListener("mousemove", onMouseMove)



    // RESIZE LISTENER

    const onResize = () => {

      if (!container) return

      const w = container.clientWidth

      const h = container.clientHeight

      camera.aspect = w / h

      camera.updateProjectionMatrix()

      renderer.setSize(w, h)

    }

    window.addEventListener("resize", onResize)



    // ANIMATION LOOP

    let clock = new THREE.Clock()

    let transitionProgress = 0

    let animId = null



    const animate = () => {

      animId = requestAnimationFrame(animate)

      const delta = clock.getDelta()

      const time = clock.getElapsedTime()



      // 1. CARDIAC CYCLE CONTRACTION ("Lub-Dub" physiological rhythm)

      // Normal resting heart rate: 72 bpm = 1.2 Hz -> cycle period approx 0.83s

      const currentBpm = bpmRef.current || 72

      const heartRateSpeed = (currentBpm / 60) * Math.PI

      const cycle = (time * heartRateSpeed) % (Math.PI * 2)



      // Dual-pulse physiological contraction function

      // Atrial pre-pulse (lub) followed closely by strong ventricular systole (DUB)

      let contraction = 0

      const s1 = Math.sin(cycle)

      const s2 = Math.sin(cycle * 2 - 0.5)



      if (cycle > 0 && cycle < 1.4) {

        // Atrial phase (mild contraction)

        contraction = Math.sin(cycle / 1.4 * Math.PI) * 0.05

      } else if (cycle >= 1.4 && cycle < 3.2) {

        // Ventricular systole (rapid, powerful contraction + twisting)

        const vCycle = (cycle - 1.4) / 1.8

        contraction = Math.sin(vCycle * Math.PI) * 0.16

      } else {

        // Diastolic relaxation and filling

        contraction = 0

      }



      // Apply dynamic scale and torsion to the ventricles

      const baseScale = 1.0 - contraction

      lvMesh.scale.set(baseScale * 0.98, 1.0 - contraction * 1.25, baseScale * 0.98)

      rvMesh.scale.set(baseScale * 0.95, 1.0 - contraction * 1.1, baseScale * 0.95)



      // Pulsing aorta expansion (aortic windkessel effect during systole)

      const aorticPulse = 1.0 + Math.max(0, contraction * 0.7)

      aortaMesh.scale.set(aorticPulse, 1.0, aorticPulse)



      // Coronary artery glow pulse synchronized with coronary perfusion during diastole!

      const coronaryGlow = 1.4 + Math.cos(cycle) * 0.9

      coronaryMaterial.emissiveIntensity = coronaryGlow



      // Multi-angle anatomical viewpoint interpolation
      const anglePresets = {
        anterior: { x: 0, y: 0, z: 8.5 },
        apical: { x: 0.9, y: -2.3, z: 7.7 },
        lateral: { x: -3.2, y: 0.5, z: 7.3 }
      }
      const preset = anglePresets[cameraAngleRef.current] || anglePresets.anterior
      if (!isTransitioningRef.current) {
        camera.position.x += (preset.x - camera.position.x) * 0.05
        camera.position.y += (preset.y - camera.position.y) * 0.05
        camera.position.z += (preset.z - camera.position.z) * 0.05
      }
      // 2. MOUSE PARALLAX & CONTINUOUS ORGANIC FLOATING

      heartGroup.rotation.y += (targetRotY + Math.sin(time * 0.5) * 0.08 - heartGroup.rotation.y + 0.35) * 0.04

      heartGroup.rotation.x += (targetRotX + Math.cos(time * 0.4) * 0.05 - heartGroup.rotation.x + 0.12) * 0.04

      heartGroup.position.y = Math.sin(time * 1.2) * 0.12



      // 3. ORBITING PARTICLES

      const posAttr = particleGeo.attributes.position

      for (let i = 0; i < particleCount; i++) {

        particleAngles[i] += particleSpeeds[i] * delta * 0.3

        const r = particleRadii[i]

        const y = particleHeights[i] + Math.sin(time + i) * 0.15

        const x = Math.cos(particleAngles[i]) * r

        const z = Math.sin(particleAngles[i]) * r



        posAttr.setXYZ(i, x, y, z)

      }

      posAttr.needsUpdate = true



      // 4. TRANSITION TO ANALYSIS STUDIO (Camera fly-through + Hologram wireframe dissolve)

      if (isTransitioningRef.current) {

        transitionProgress += delta * (reducedMotionRef.current ? 2.5 : 1.4)

        const t = Math.min(1.0, transitionProgress)



        // Ease-in-out curve

        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t



        if (!reducedMotionRef.current) {

          // Camera zooms into the heart center

          camera.position.z = 8.5 - ease * 7.5

          camera.position.y = ease * -0.5



          // Fade wireframe in and dissolve solid mesh

          wireMat.opacity = Math.sin(ease * Math.PI) * 0.8

          myocardialMaterial.opacity = Math.max(0, 1.0 - ease * 1.4)

          myocardialMaterial.transparent = true

          vesselMaterial.opacity = Math.max(0, 1.0 - ease * 1.4)

          vesselMaterial.transparent = true



          // Particle acceleration

          particleMaterial.opacity = Math.max(0, 0.75 - ease * 0.75)

          heartGroup.rotation.y += delta * 1.5 * ease

        }



        if (t >= 1.0) {

          if (onTransitionComplete) onTransitionComplete()

        }

      }



      renderer.render(scene, camera)

    }



    animate()



    // CLEANUP

    return () => {

      cancelAnimationFrame(animId)

      window.removeEventListener("mousemove", onMouseMove)

      window.removeEventListener("resize", onResize)

      if (renderer.domElement && container.contains(renderer.domElement)) {

        container.removeChild(renderer.domElement)

      }

      renderer.dispose()

      lvGeo.dispose()

      rvGeo.dispose()

      laGeo.dispose()

      raGeo.dispose()

      aortaGeo.dispose()

      particleGeo.dispose()

      particleMaterial.dispose()

    }

  }, [onTransitionComplete])



  return (

    <div

      ref={mountRef}

      className="absolute inset-0 pointer-events-auto w-full h-full"

      style={{ touchAction: "none" }}

    />

  )

}

