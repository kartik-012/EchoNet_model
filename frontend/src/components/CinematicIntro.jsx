import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import ThreeHeartCanvas from "./ThreeHeartCanvas"
import { ArrowRight, Sparkles, Volume2, VolumeX, Eye, Activity } from "lucide-react"

/* ================================================================ */
/* ORGANIC WEB AUDIO HEARTBEAT SYNTHESIZER (Lub-Dub S1/S2 Transients) */
/* ================================================================ */
class HeartAudioSynth {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.timer = null
    this.bpm = 72
  }

  start(bpm = 72) {
    this.bpm = bpm
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume()
    }
    this.isPlaying = true
    this.scheduleBeat()
  }

  stop() {
    this.isPlaying = false
    if (this.timer) clearTimeout(this.timer)
  }

  setBpm(bpm) {
    this.bpm = bpm
  }

  playThump(time, freq, dur, vol) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = "sine"
    osc.frequency.setValueAtTime(freq, time)
    osc.frequency.exponentialRampToValueAtTime(28, time + dur)

    filter.type = "lowpass"
    filter.frequency.setValueAtTime(130, time)

    gain.gain.setValueAtTime(vol, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(time)
    osc.stop(time + dur)
  }

  scheduleBeat() {
    if (!this.isPlaying || !this.ctx) return
    const now = this.ctx.currentTime
    // S1: Lub (longer, deeper pitch, 56Hz, ~0.15s)
    this.playThump(now, 56, 0.15, 0.4)
    // S2: Dub (sharper, slightly higher, 74Hz, ~0.11s, delayed by ~0.14s)
    this.playThump(now + 0.14, 74, 0.11, 0.3)

    const intervalMs = (60 / this.bpm) * 1000
    this.timer = setTimeout(() => this.scheduleBeat(), intervalMs)
  }
}

const RHYTHMS = [
  { id: "normal", bpm: 72, label: "Normal Sinus (72 BPM)", badge: "Normal" },
  { id: "tachy", bpm: 110, label: "Tachycardia (110 BPM)", badge: "Elevated" },
  { id: "brady", bpm: 48, label: "Bradycardia (48 BPM)", badge: "Resting" }
]

const ANGLES = [
  { id: "anterior", label: "Anterior Sternocostal" },
  { id: "apical", label: "Apical 4-Chamber (A4C)" },
  { id: "lateral", label: "Left Lateral Oblique" }
]

export default function CinematicIntro({ onEnterStudio, reducedMotion, setReducedMotion }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [bpm, setBpm] = useState(72)
  const [cameraAngle, setCameraAngle] = useState("anterior")
  const [audioEnabled, setAudioEnabled] = useState(false)
  const audioSynthRef = useRef(null)

  useEffect(() => {
    audioSynthRef.current = new HeartAudioSynth()
    return () => {
      if (audioSynthRef.current) audioSynthRef.current.stop()
    }
  }, [])

  const toggleAudio = () => {
    if (!audioSynthRef.current) return
    if (audioEnabled) {
      audioSynthRef.current.stop()
      setAudioEnabled(false)
    } else {
      audioSynthRef.current.start(bpm)
      setAudioEnabled(true)
    }
  }

  const handleSelectRhythm = (newBpm) => {
    setBpm(newBpm)
    if (audioSynthRef.current && audioEnabled) {
      audioSynthRef.current.setBpm(newBpm)
    }
  }

  const handleStartTransition = () => {
    if (isTransitioning) return
    if (audioSynthRef.current) audioSynthRef.current.stop()
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
        bpm={bpm}
        cameraAngle={cameraAngle}
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
        className={`relative z-20 px-8 sm:px-10 py-6 sm:py-8 flex items-center justify-between transition-all duration-700 ${isTransitioning ? "opacity-0 -translate-y-4" : "opacity-100"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-cyan-400"
            animate={{
              boxShadow: [
                "0 0 8px rgba(6,182,212,0.4)",
                "0 0 18px rgba(6,182,212,0.9)",
                "0 0 8px rgba(6,182,212,0.4)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-semibold tracking-tight text-white">
              EchoCard<span className="text-cyan-400 font-bold">·AI</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-400/70 border border-cyan-500/20 px-2 py-0.5 rounded-full bg-cyan-950/30">
              v2.4 PACS Ready
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Heartbeat Sound Synth Toggle */}
          <motion.button
            onClick={toggleAudio}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center space-x-2 text-[11px] font-mono px-3 py-1.5 rounded-lg border transition cursor-pointer backdrop-blur-sm ${
              audioEnabled
                ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Toggle Web Audio Heartbeat Sound Synthesizer"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{audioEnabled ? "Sound: ON" : "Sound: OFF"}</span>
          </motion.button>

          {/* Fluid Motion Toggle */}
          <motion.button
            onClick={() => setReducedMotion(!reducedMotion)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] backdrop-blur-sm cursor-pointer"
          >
            {reducedMotion ? "Motion: Static" : "Motion: Fluid 3D"}
          </motion.button>
        </div>
      </motion.header>

      {/* CENTER HERO */}
      <motion.div
        className={`relative z-20 flex-1 flex flex-col justify-end pb-10 sm:pb-14 px-6 sm:px-10 max-w-4xl mx-auto w-full text-center items-center`}
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
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm mb-6"
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

        {/* Main Tagline */}
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white mb-4 leading-[1.05]"
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
          className="max-w-xl text-sm sm:text-base text-slate-400 font-light leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Automated LVEF quantification, endocardial segmentation, and
          explainable AI heatmaps — in seconds.
        </motion.p>

        {/* Cardiac Rhythm Modulation Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1 flex items-center space-x-1">
            <Activity className="w-3 h-3 text-cyan-400/80" />
            <span>Rhythm:</span>
          </div>
          {RHYTHMS.map((r) => (
            <button
              key={r.id}
              onClick={() => handleSelectRhythm(r.bpm)}
              className={`px-3 py-1 rounded-full text-[11px] font-mono transition cursor-pointer border ${
                bpm === r.bpm
                  ? "bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                  : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

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
        className={`relative z-20 px-8 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-light tracking-wide gap-2`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <span>Stanford EchoNet-Dynamic · 10,030 Cases</span>
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1.5 font-mono text-[10px] text-cyan-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>Active Rhythm: {bpm} BPM</span>
          </span>
          <span>MAE 4.18% · AHA/ASE Compliant</span>
        </div>
      </motion.footer>
    </div>
  )
}
