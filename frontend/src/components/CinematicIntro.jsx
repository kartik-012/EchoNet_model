import React, { useState } from "react"
import ThreeHeartCanvas from "./ThreeHeartCanvas"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CinematicIntro({ onEnterStudio, reducedMotion, setReducedMotion }) {
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleStartTransition = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
  }

  const handleTransitionComplete = () => {
    onEnterStudio()
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#040711] text-slate-100 select-none flex flex-col justify-between">
      {/* 3D Heart Canvas Background */}
      <ThreeHeartCanvas
        isTransitioning={isTransitioning}
        onTransitionComplete={handleTransitionComplete}
        reducedMotion={reducedMotion}
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(4,7,17,0.7)_80%,rgba(4,7,17,0.95)_100%)] z-10" />

      {/* TOP BAR: Clean Minimal Branding */}
      <header className={`relative z-20 px-10 py-8 flex items-center justify-between transition-all duration-700 ${isTransitioning ? "opacity-0 -translate-y-4" : "opacity-100"}`}>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
          <span className="text-base font-medium tracking-wide text-white/90">
            EchoCard<span className="text-cyan-400">·AI</span>
          </span>
        </div>

        <button
          onClick={() => setReducedMotion(!reducedMotion)}
          className="text-[11px] text-slate-500 hover:text-slate-300 transition font-light tracking-wide"
        >
          {reducedMotion ? "Motion: Reduced" : "Motion: Fluid"}
        </button>
      </header>

      {/* CENTER HERO */}
      <div className={`relative z-20 flex-1 flex flex-col justify-end pb-16 px-10 max-w-4xl mx-auto w-full text-center items-center transition-all duration-700 ${isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        {/* Subtle Product Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
          <span className="text-[11px] tracking-widest text-slate-400 uppercase font-light">
            AI-Powered Cardiac Intelligence
          </span>
        </div>

        {/* Main Tagline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-5 leading-[1.05]">
          See Beyond the{" "}
          <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-400">
            Heartbeat.
          </span>
        </h1>

        <p className="max-w-xl text-base text-slate-400 font-light leading-relaxed mb-10">
          Automated LVEF quantification, endocardial segmentation, and
          explainable AI heatmaps — in seconds.
        </p>

        {/* ENTER BUTTON */}
        <button
          onClick={handleStartTransition}
          disabled={isTransitioning}
          className="group relative px-10 py-4.5 rounded-2xl bg-white text-slate-950 font-medium text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer overflow-hidden"
        >
          <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
          <div className="relative flex items-center space-x-3">
            <span>Enter Analysis Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Clean Bottom Footer */}
      <footer className={`relative z-20 px-10 py-5 flex items-center justify-between text-[11px] text-slate-500 font-light tracking-wide transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <span>Stanford EchoNet-Dynamic · 10,030 Cases</span>
        <span>MAE 4.18% · AHA/ASE Compliant</span>
      </footer>
    </div>
  )
}
