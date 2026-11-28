import React from "react";
import { HeroScene } from "./3d/HeroScene";
import { FloatingCards } from "./FloatingCards";
import { ArrowDown, BarChart2, ShieldAlert } from "lucide-react";

interface HeroSectionProps {
  progress?: number;
  introActive?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  progress = 1.0,
  introActive = false
}) => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="overview"
      className="relative min-h-screen w-full overflow-hidden pt-20 md:pt-0 flex items-center justify-center bg-[#050507]"
    >
      {/* Background Subtle Gradient Field */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 h-[420px] w-[420px] rounded-full bg-[#8655FF]/10 blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 h-[460px] w-[460px] rounded-full bg-[#4C8DFF]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col lg:flex-row items-center justify-between px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        {/* Left Column (40%): Title, Description, and CTAs */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center space-y-6 pt-4 lg:pt-0">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1.5 backdrop-blur-md self-start">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8655FF]" />
            <span className="font-mono text-[11px] tracking-wider text-[#A1A1B0] uppercase">
              Deep Learning Cardiac Biomechanics • VTU
            </span>
          </div>

          {/* Main H1 Title */}
          <h1 className="text-[44px] sm:text-[56px] lg:text-[64px] font-medium tracking-tight text-[#F5F5F7] leading-[1.08]">
            EchoNet-AI
          </h1>

          {/* H2 Subtitle */}
          <h2 className="text-[20px] sm:text-[24px] font-normal tracking-tight text-[#A78BFA] leading-[1.3]">
            Automated Cardiac Ejection Fraction Estimation Using Deep Learning
          </h2>

          {/* Description Paragraph */}
          <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#A1A1B0] max-w-xl">
            An AI-powered approach to automated cardiac function assessment using deep learning and echocardiographic analysis.
            Directly extracts spatiotemporal myocardial dynamics across apical-4-chamber video loops to eliminate manual inter-observer variability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => handleScrollTo("analyze")}
              className="flex items-center justify-center gap-2 rounded-full border border-[rgba(134,85,255,0.5)] bg-[#8655FF] px-6 py-3 text-[14px] font-medium text-white shadow-[0_0_24px_rgba(134,85,255,0.35)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(134,85,255,0.5)] hover:scale-[1.02] cursor-pointer"
            >
              <span>Analyze Echocardiogram</span>
              <ArrowDown className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleScrollTo("validation")}
              className="flex items-center justify-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-6 py-3 text-[14px] font-medium text-[#F5F5F7] backdrop-blur-md transition-all duration-300 hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
            >
              <BarChart2 className="h-4 w-4 text-[#7FD6FF]" />
              <span>View Benchmark Results</span>
            </button>
          </div>

          {/* Mandatory Research Prototype Disclaimer */}
          <div className="flex items-center gap-2 pt-2 text-[#A1A1B0]">
            <ShieldAlert className="h-4 w-4 text-[#E8B84A] shrink-0" />
            <p className="text-[12px] leading-tight">
              Research prototype. Not a certified medical device. Not for clinical diagnosis.
            </p>
          </div>
        </div>

        {/* Right Column (60%): 3D Particle Heart Viewport & Floating Parallax Cards */}
        <div className="relative w-full lg:w-[58%] h-[480px] sm:h-[580px] lg:h-[720px] mt-8 lg:mt-0">
          <HeroScene progress={progress} introActive={introActive} />
          <FloatingCards visible={!introActive} />
        </div>
      </div>
    </section>
  );
};

// Hero viewport canvas container ready.
