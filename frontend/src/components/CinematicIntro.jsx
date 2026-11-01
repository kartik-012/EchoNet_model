import React, { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
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

      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none z-[5] opacity-[0.01]" style={{
        backgroundImage: `
          linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px"
      }} />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-[8]">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              background: "#06b6d4",
              opacity: 0.12,
              boxShadow: "0 0 6px rgba(6,182,212,0.4)",
              animation: `floatParticle ${15 + Math.random() * 15}s ease-in-out ${Math.random() * 8}s infinite`
            }}
          />
        ))}
      </div>

      {/* TOP BAR */}
      <motion.header
        className={`relative z-20 px-10 py-8 flex items-center justify-between transition-all duration-700 ${isTransitioning ? "opacity-0 -translate-y-4" : "opacity-100"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{
              boxShadow: [
                "0 0 8px rgba(6,182,212,0.4)",
                "0 0 16px rgba(6,182,212,0.8)",
                "0 0 8px rgba(6,182,212,0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-base font-medium tracking-wide text-white/90">
            EchoCard<span className="text-cyan-400">·AI</span>
          </span>
        </div>

        <motion.button
          onClick={() => setReducedMotion(!reducedMotion)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-[11px] text-slate-500 hover:text-slate-300 transition font-light tracking-wide cursor-pointer"
        >
          {reducedMotion ? "Motion: Reduced" : "Motion: Fluid"}
        </motion.button>
      </motion.header>

      {/* CENTER HERO */}
      <motion.div
        className={`relative z-20 flex-1 flex flex-col justify-end pb-16 px-10 max-w-4xl mx-auto w-full text-center items-center`}
        initial={{ opacity: 0, y: 40 }}
        animate={{
          opacity: isTransitioning ? 0 : 1,
          y: isTransitioning ? -30 : 0,
          scale: isTransitioning ? 0.92 : 1
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Product Pill */}
        <motion.div
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400/70" />
          </motion.div>
          <span className="text-[11px] tracking-widest text-slate-400 uppercase font-light">
            AI-Powered Cardiac Intelligence
          </span>
        </motion.div>

        {/* Main Tagline with staggered letter animation */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-5 leading-[1.05]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          See Beyond the{" "}
          <motion.span
            className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-sky-400"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Heartbeat.
          </motion.span>
        </motion.h1>

        <motion.p
          className="max-w-xl text-base text-slate-400 font-light leading-relaxed mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Automated LVEF quantification, endocardial segmentation, and
          explainable AI heatmaps — in seconds.
        </motion.p>

        {/* ENTER BUTTON */}
        <motion.button
          onClick={handleStartTransition}
          disabled={isTransitioning}
          className="group relative px-10 py-4.5 rounded-2xl bg-white text-slate-950 font-medium text-sm tracking-wide cursor-pointer overflow-hidden"
          whileHover={{
            scale: 1.03,
            boxShadow: "0 0 50px rgba(255,255,255,0.2), 0 0 100px rgba(6,182,212,0.15)"
          }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {/* Shine sweep */}
          <div className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
          <div className="relative flex items-center space-x-3">
            <span>Enter Analysis Studio</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>

      {/* Bottom Footer */}
      <motion.footer
        className={`relative z-20 px-10 py-5 flex items-center justify-between text-[11px] text-slate-500 font-light tracking-wide`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <span>Stanford EchoNet-Dynamic · 10,030 Cases</span>
        <span>MAE 4.18% · AHA/ASE Compliant</span>
      </motion.footer>
    </div>
  )
}
