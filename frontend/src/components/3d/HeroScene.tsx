import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { ParticleHeart } from "./ParticleHeart";

interface HeroSceneProps {
  progress?: number;
  introActive?: boolean;
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  progress = 1.0,
  introActive = false
}) => {
  return (
    <div className="relative h-full w-full pointer-events-auto">
      <Canvas
        camera={{ position: [0.35, 0, 3.8], fov: 46 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={["#050507"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#8655FF" />
        <pointLight position={[-5, -3, 2]} intensity={1.0} color="#4C8DFF" />

        <Suspense fallback={null}>
          <ParticleHeart progress={progress} introActive={introActive} />
        </Suspense>

        {/* Postprocessing pipeline: Bloom on emissive points, subtle chromatic aberration, vignette */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.75}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.0012, 0.0012)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.32} darkness={0.65} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
