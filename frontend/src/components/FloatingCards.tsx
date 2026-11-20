import React, { useEffect, useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { Activity, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";

interface FloatingCardsProps {
  visible?: boolean;
}

export const FloatingCards: React.FC<FloatingCardsProps> = ({ visible = true }) => {
  const [efCount, setEfCount] = useState(0);

  // Animate EF counter up to 58%
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1600;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setEfCount(Math.round(ease * 58));

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    const animId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animId);
  }, [visible]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Card 1: Ejection Fraction (Top Left of 3D Scene) */}
      <div
        className="pointer-events-auto absolute top-[12%] left-[48%] hidden lg:block animate-float-1"
        style={{ animationDuration: "3.2s" }}
      >
        <GlassCard interactive className="w-[210px] p-3.5 backdrop-blur-[24px]">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[12px] font-medium tracking-wider text-[#A1A1B0] uppercase">
              Ejection Fraction
            </span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DDC97] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3DDC97]" />
            </span>
          </div>
          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="font-mono text-[36px] font-medium text-[#F5F5F7] tracking-tight">
              {efCount}%
            </span>
            <span className="text-[11px] font-medium text-[#3DDC97]">Normal LVEF</span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#4C8DFF] to-[#3DDC97] transition-all duration-1000"
              style={{ width: `${efCount}%` }}
            />
          </div>
        </GlassCard>
      </div>

      {/* Card 2: Attention Confidence (Top Right of 3D Scene) */}
      <div
        className="pointer-events-auto absolute top-[16%] right-[5%] hidden lg:block animate-float-2"
        style={{ animationDuration: "4.1s" }}
      >
        <GlassCard interactive className="w-[190px] p-3 backdrop-blur-[24px]">
          <div className="flex items-center gap-1.5 text-[#7FD6FF]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-[11px] font-medium tracking-wider uppercase">
              Model Confidence
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-mono text-[22px] font-medium text-[#F5F5F7]">94.2%</span>
            <span className="text-[11px] text-[#A1A1B0]">R3D-18</span>
          </div>
          <p className="mt-0.5 text-[10px] text-[#A1A1B0]">
            Apical-4-Chamber Consensus
          </p>
        </GlassCard>
      </div>

      {/* Card 3: ECG Rhythm Line (Bottom Left of 3D Scene) */}
      <div
        className="pointer-events-auto absolute bottom-[18%] left-[50%] hidden xl:block animate-float-3"
        style={{ animationDuration: "3.7s" }}
      >
        <GlassCard interactive className="w-[220px] p-3 backdrop-blur-[24px]">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5 text-[#A78BFA]">
              <Activity className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium tracking-wider uppercase">
                Cardiac Rhythm
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#F5F5F7]">72 BPM</span>
          </div>
          {/* Synchronized Vector ECG Waveform */}
          <div className="relative mt-1 h-8 w-full overflow-hidden rounded bg-[rgba(0,0,0,0.25)]">
            <svg
              className="h-full w-full"
              viewBox="0 0 200 40"
              preserveAspectRatio="none"
            >
              <path
                d="M 0,20 L 30,20 L 40,20 L 45,15 L 50,22 L 55,2 L 60,35 L 65,18 L 70,20 L 110,20 L 120,20 L 125,15 L 130,22 L 135,2 L 140,35 L 145,18 L 150,20 L 200,20"
                fill="none"
                stroke="#8655FF"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="absolute top-1/2 left-[30%] -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-[#FF4D6D] animate-ping" />
          </div>
        </GlassCard>
      </div>

      {/* Card 4: Hemodynamic Alert Monitor (Bottom Right of 3D Scene) */}
      <div
        className="pointer-events-auto absolute bottom-[14%] right-[6%] hidden lg:block animate-float-4"
        style={{ animationDuration: "4.5s" }}
      >
        <GlassCard interactive className="w-[185px] p-3 backdrop-blur-[24px]">
          <div className="flex items-center gap-1.5 text-[#A1A1B0]">
            <HeartPulse className="h-3.5 w-3.5 text-[#FF4D6D]" />
            <span className="text-[11px] font-medium tracking-wider uppercase">
              Telemetry Status
            </span>
          </div>
          <p className="mt-1 text-[11px] font-medium text-[#F5F5F7]">
            ESV Excursion Stable
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#3DDC97]">
            <Sparkles className="h-3 w-3" />
            <span>Simpson Consensus OK</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
