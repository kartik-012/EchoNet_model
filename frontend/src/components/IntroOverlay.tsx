import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { FastForward } from "lucide-react";

interface IntroOverlayProps {
  onComplete: () => void;
  onProgressUpdate: (progress: number) => void;
}

export const IntroOverlay: React.FC<IntroOverlayProps> = ({
  onComplete,
  onProgressUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [sceneText, setSceneText] = useState("ACOUSTIC SINGULARITY");
  const [isCompleted, setIsCompleted] = useState(false);

  const completeIntro = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    onProgressUpdate(1.0);
    sessionStorage.setItem("echonet_intro_seen", "true");
    setIsCompleted(true);

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          onComplete();
        }
      });
    } else {
      onComplete();
    }
  }, [onComplete, onProgressUpdate]);

  useEffect(() => {
    // Check if intro has already been viewed in this session
    if (sessionStorage.getItem("echonet_intro_seen") === "true") {
      completeIntro();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        completeIntro();
      }
    });

    timelineRef.current = tl;

    // Track 3D progress proxy
    const progressProxy = { val: 0.0 };

    // Scene 1: 00s - 02s: Acoustic Singularity
    tl.to(progressProxy, {
      val: 0.05,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate: () => onProgressUpdate(progressProxy.val)
    })
    .call(() => setSceneText("ACOUSTIC SINGULARITY — APICAL 4-CHAMBER"))

    // Scene 2: 02s - 05s: Spatiotemporal Dispersal
    .to(progressProxy, {
      val: 0.25,
      duration: 3.0,
      ease: "power2.inOut",
      onUpdate: () => onProgressUpdate(progressProxy.val)
    })
    .call(() => setSceneText("EXTRACTING 45,000 SPATIOTEMPORAL TENSORS"))

    // Scene 3: 05s - 08s: Attention Gravitational Convergence
    .to(progressProxy, {
      val: 0.75,
      duration: 3.0,
      ease: "power2.out",
      onUpdate: () => onProgressUpdate(progressProxy.val)
    })
    .call(() => setSceneText("ATTENTION-GUIDED MYOCARDIAL ALIGNMENT"))

    // Scene 4: 08s - 10s: Myocardial Surface Tessellation
    .to(progressProxy, {
      val: 0.95,
      duration: 2.0,
      ease: "power1.inOut",
      onUpdate: () => onProgressUpdate(progressProxy.val)
    })
    .call(() => setSceneText("RECONSTRUCTING LEFT VENTRICULAR VOLUMETRICS"))

    // Scene 5: 10s - 12s: Hemodynamic Awakening (lub-dub pulse & hero reveal)
    .to(progressProxy, {
      val: 1.0,
      duration: 2.0,
      ease: "power2.out",
      onUpdate: () => onProgressUpdate(progressProxy.val)
    })
    .call(() => setSceneText("HEMODYNAMIC CONTINUUM ESTABLISHED"));

    // Soundwave ring animation
    if (ringRef.current) {
      gsap.to(ringRef.current, {
        scale: 3.5,
        opacity: 0,
        duration: 1.6,
        repeat: -1,
        ease: "power1.out"
      });
    }

    // Keyboard listener for Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        completeIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      tl.kill();
    };
  }, [completeIntro, onProgressUpdate]);

  if (isCompleted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 pointer-events-auto bg-[#050507]"
    >
      {/* Top Bar with Project Wordmark & Skip Button */}
      <div className="flex w-full items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#8655FF] animate-ping" />
          <span className="font-mono text-[12px] tracking-wider text-[#A1A1B0] uppercase">
            EchoNet-AI Initialization
          </span>
        </div>

        <button
          onClick={completeIntro}
          className="flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-1.5 text-[12px] font-medium text-[#F5F5F7] backdrop-blur-md transition-all hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
        >
          <span>Skip Intro</span>
          <span className="font-mono text-[10px] text-[#A1A1B0]">[Esc]</span>
          <FastForward className="h-3 w-3 ml-0.5" />
        </button>
      </div>

      {/* Central Singularity Ring */}
      <div className="relative flex items-center justify-center pointer-events-none">
        <div
          ref={ringRef}
          className="absolute h-24 w-24 rounded-full border border-[rgba(134,85,255,0.4)]"
        />
        <div className="h-2 w-2 rounded-full bg-[#F5F5F7] shadow-[0_0_20px_#8655FF]" />
      </div>

      {/* Bottom Scene Status Label */}
      <div ref={textRef} className="pb-8 text-center pointer-events-none">
        <p className="font-mono text-[11px] tracking-widest text-[#8655FF] uppercase">
          {sceneText}
        </p>
        <p className="mt-1 text-[12px] text-[#A1A1B0]">
          Cardiac Ejection Fraction Estimation Engine
        </p>
      </div>
    </div>
  );
};
