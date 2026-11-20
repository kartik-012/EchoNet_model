import React from "react";
import { HeroScene } from "../3d/HeroScene";
import { FloatingCards } from "../FloatingCards";
import { ArrowRight, Cpu, BarChart2, ShieldAlert, Sparkles } from "lucide-react";

interface StartScreenProps {
  onStartAnalysis: () => void;
  onOpenPipeline: () => void;
  onOpenValidation: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartAnalysis,
  onOpenPipeline,
  onOpenValidation
}) => {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#050507] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Luminescent Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 h-[380px] w-[380px] rounded-full bg-[#8655FF]/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-[#4C8DFF]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between h-full py-4 lg:py-6">
        {/* Left Column (42%): Information, Title, & Primary Action */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center space-y-4 lg:space-y-6 z-20">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1.5 backdrop-blur-md self-start">
            <span className="h-2 w-2 rounded-full bg-[#8655FF] animate-pulse" />
            <span className="font-mono text-[11px] tracking-wider text-[#A1A1B0] uppercase">
              Deep Learning Cardiac Biomechanics • VTU
            </span>
          </div>

          {/* Heading 1 & Project Title */}
          <div>
            <h1 className="text-[44px] sm:text-[54px] lg:text-[60px] font-medium tracking-tight text-[#F5F5F7] leading-[1.06]">
              EchoNet-AI
            </h1>
            <h2 className="mt-2 text-[18px] sm:text-[22px] font-normal tracking-tight text-[#A78BFA] leading-[1.3]">
              Automated Cardiac Ejection Fraction Estimation Using Deep Learning
            </h2>
          </div>

          {/* Concise Scientific Statement */}
          <p className="text-[14px] sm:text-[15px] leading-[1.6] text-[#A1A1B0] max-w-lg">
            An end-to-end artificial intelligence framework that maps 32-frame apical four-chamber echocardiographic cine loops directly to continuous Left Ventricular Ejection Fraction (LVEF) metrics with sub-second clinical latency.
          </p>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-1 max-w-lg">
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
              <span className="font-mono text-[10px] text-[#A1A1B0] uppercase">Architecture</span>
              <p className="font-mono text-[15px] font-medium text-[#7FD6FF] mt-0.5">R3D-18</p>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
              <span className="font-mono text-[10px] text-[#A1A1B0] uppercase">Test MAE</span>
              <p className="font-mono text-[15px] font-medium text-[#3DDC97] mt-0.5">4.84%</p>
            </div>
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3">
              <span className="font-mono text-[10px] text-[#A1A1B0] uppercase">PACS Latency</span>
              <p className="font-mono text-[15px] font-medium text-[#8655FF] mt-0.5">1.15s</p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onStartAnalysis}
              className="flex items-center justify-center gap-2.5 rounded-full border border-[rgba(134,85,255,0.6)] bg-[#8655FF] px-7 py-3.5 text-[14px] font-medium text-white shadow-[0_0_28px_rgba(134,85,255,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(134,85,255,0.6)] hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Echocardiogram Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenPipeline}
              className="flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-5 py-3.5 text-[13px] font-medium text-[#F5F5F7] backdrop-blur-md transition-all duration-300 hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
            >
              <Cpu className="h-4 w-4 text-[#A78BFA]" />
              <span>Architecture Pipeline</span>
            </button>
          </div>

          {/* Medical Disclaimer */}
          <div className="flex items-center gap-2 text-[#A1A1B0] pt-1">
            <ShieldAlert className="h-4 w-4 text-[#E8B84A] shrink-0" />
            <span className="text-[11px] leading-tight">
              Research prototype. Not a certified medical device. Not for clinical diagnosis.
            </span>
          </div>
        </div>

        {/* Right Column (58%): 3D Particle Heart Viewport & Parallax Floating Cards */}
        <div className="relative w-full lg:w-[58%] h-[360px] sm:h-[460px] lg:h-full flex items-center justify-center">
          <HeroScene progress={1.0} introActive={false} />
          <FloatingCards visible={true} />
        </div>
      </div>
    </div>
  );
};
