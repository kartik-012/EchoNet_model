import React, { useMemo, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import { useGLTF } from "@react-three/drei";
import { heartVertexShader, heartFragmentShader } from "./heartShaders";

interface ParticleHeartProps {
  progress?: number; // 0.0 = exploded cloud, 1.0 = assembled heart
  introActive?: boolean;
}

export const ParticleHeart: React.FC<ParticleHeartProps> = ({
  progress = 1.0,
  introActive = false
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const wireframeRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 5;

  const count = isMobile ? 12000 : 45000;

  // Attempt to load heart GLTF model; catch gracefully if absent
  let gltf: any = null;
  try {
    gltf = useGLTF("/models/heart.glb");
  } catch {
    gltf = null;
  }

  // Generate particle geometry
  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const randomPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    // Target mesh extraction
    let targetMesh: THREE.Mesh | null = null;
    if (gltf && gltf.scene) {
      gltf.scene.traverse((child: any) => {
        if (!targetMesh && child.isMesh && child.geometry) {
          targetMesh = child;
        }
      });
    }

    let sampler: MeshSurfaceSampler | null = null;
    if (targetMesh) {
      try {
        sampler = new MeshSurfaceSampler(targetMesh).build();
      } catch {
        sampler = null;
      }
    }

    const tempPos = new THREE.Vector3();

    // Exact color palette tokens:
    // 45% white/silver (#F5F5F7)
    // 25% blue (#4C8DFF)
    // 20% violet (#8655FF)
    // 7% amber (#E8B84A)
    // 3% pulse (#FF4D6D)
    const colorWhite = new THREE.Color("#F5F5F7");
    const colorBlue = new THREE.Color("#4C8DFF");
    const colorViolet = new THREE.Color("#8655FF");
    const colorAmber = new THREE.Color("#E8B84A");
    const colorPulse = new THREE.Color("#FF4D6D");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (sampler) {
        sampler.sample(tempPos);
        // Normalize & scale GLTF position
        positions[i3] = tempPos.x * 0.035;
        positions[i3 + 1] = tempPos.y * 0.035 - 0.2;
        positions[i3 + 2] = tempPos.z * 0.035;
      } else {
        // Parametric cardiac manifold fallback (always reliable)
        const t = Math.PI * (Math.random() * 2 - 1);
        const u = Math.random() * 2 - 1;
        const x = (16 * Math.pow(Math.sin(t), 3)) * 0.08;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.08;
        const z = (u * Math.sin(t) * Math.cos(t) * 10) * 0.08;

        positions[i3] = x;
        positions[i3 + 1] = y + 0.1;
        positions[i3 + 2] = z;
      }

      // Chaotic explosion cloud positions (Scene 1-2)
      const radius = 3.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      randomPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      randomPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      randomPositions[i3 + 2] = radius * Math.cos(phi);

      // Color partition distribution
      const p = Math.random();
      let chosenColor: THREE.Color;
      if (p < 0.45) chosenColor = colorWhite;
      else if (p < 0.70) chosenColor = colorBlue;
      else if (p < 0.90) chosenColor = colorViolet;
      else if (p < 0.97) chosenColor = colorAmber;
      else chosenColor = colorPulse;

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      // Sizing
      sizes[i] = Math.random() * 0.04 + 0.025;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandomPos", new THREE.BufferAttribute(randomPositions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const uni = {
      uTime: { value: 0 },
      uProgress: { value: progress },
      uPulse: { value: 0 },
      uWave: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) }
    };

    return { geometry: geo, uniforms: uni };
  }, [count, gltf]);

  // Clean disposal on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  // Frame animation loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    uniforms.uTime.value = time;

    // Smoothly track progress
    uniforms.uProgress.value = THREE.MathUtils.lerp(
      uniforms.uProgress.value,
      progress,
      0.08
    );

    // Mouse normalized parallax
    uniforms.uMouse.value.set(state.pointer.x, state.pointer.y);

    // Anatomical 72 BPM lub-dub cardiac cycle calculation
    // Beat period = 60 / 72 = 0.833s
    const beatCycle = time % 0.833;
    let pulse = 0;

    if (beatCycle < 0.15) {
      // S1 "lub" contraction
      const t = beatCycle / 0.15;
      pulse = Math.sin(t * Math.PI) * 1.0;
    } else if (beatCycle < 0.22) {
      pulse = 0;
    } else if (beatCycle < 0.34) {
      // S2 "dub" contraction
      const t = (beatCycle - 0.22) / 0.12;
      pulse = Math.sin(t * Math.PI) * 0.65;
    } else {
      // Diastolic resting & ventricular filling
      pulse = 0;
    }

    uniforms.uPulse.value = pulse;

    // Slow cinematic idle rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.12 + state.pointer.x * 0.25;
      pointsRef.current.rotation.x = -0.15 + state.pointer.y * 0.15;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = time * 0.12 + state.pointer.x * 0.25;
      wireframeRef.current.rotation.x = -0.15 + state.pointer.y * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Primary Luminous Particle Heart */}
      <points ref={pointsRef} geometry={geometry}>
        <shaderMaterial
          vertexShader={heartVertexShader}
          fragmentShader={heartFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Wireframe Chambers Overlay (rendered at 8% opacity per spec) */}
      <group ref={wireframeRef}>
        <mesh position={[0, -0.1, 0]} scale={[1.6, 1.9, 1.4]}>
          <octahedronGeometry args={[1, 3]} />
          <meshBasicMaterial
            wireframe
            color="#8655FF"
            transparent
            opacity={0.08}
          />
        </mesh>
      </group>
    </group>
  );
};
