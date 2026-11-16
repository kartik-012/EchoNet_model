import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import ThreeHeartCanvas from "./ThreeHeartCanvas"
import {
  Heart,
  Activity,
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Zap,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
  X,
  Eye,
  Sliders,
  Cpu
} from "lucide-react"

/* ================================================================ */
/* ORGANIC WEB AUDIO HEARTBEAT SYNTHESIZER (Lub-Dub S1/S2 Transients) */
/* ================================================================ */
class HeartAudioSynth {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.timer = null
    this.bpm = 96
    this.volume = 0.4
  }

  start(bpm = 96) {
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

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
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

    const finalVol = vol * this.volume
    gain.gain.setValueAtTime(finalVol, time)
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
    // S2: Dub (sharper, slightly higher, 74Hz, ~0.13s, delayed by ~0.13s)
    this.playThump(now + 0.13, 74, 0.11, 0.3)

    const intervalMs = (60 / this.bpm) * 1000
    this.timer = setTimeout(() => this.scheduleBeat(), intervalMs)
  }
}

export default function CinematicIntro({ onEnterStudio, reducedMotion, setReducedMotion, onNavigate }) {
  // Render Mode: "master" (Screenshot Realistic Art) vs "webgl" (Interactive 3D Three.js Orbit)
  const [renderMode, setRenderMode] = useState("master")

  const [bpm, setBpm] = useState(96)
  const [bloodCount, setBloodCount] = useState(80)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [audioVolume, setAudioVolume] = useState(0.4)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Modals
  const [activeStoryModal, setActiveStoryModal] = useState(false)
  const [activeServicesModal, setActiveServicesModal] = useState(false)
  const [activePlansModal, setActivePlansModal] = useState(false)
  const [activeAboutModal, setActiveAboutModal] = useState(false)
  const [showPresetsMenu, setShowPresetsMenu] = useState(false)
  const [showEffectsControl, setShowEffectsControl] = useState(false)

  // 3D WebGL State
  const [cameraAngle, setCameraAngle] = useState("anterior")
  const [anatomicalLayer, setAnatomicalLayer] = useState("solid")
  const [cardiacPhase, setCardiacPhase] = useState("dynamic")

  // Interactive mouse parallax & 3D tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [cardTilt, setCardTilt] = useState({ rx: 0, ry: 0 })

  const audioSynthRef = useRef(null)

  useEffect(() => {
    audioSynthRef.current = new HeartAudioSynth()
    return () => {
      if (audioSynthRef.current) audioSynthRef.current.stop()
    }
  }, [])

  // Smooth mouse tracking with spring dampening
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    const deltaX = (clientX - centerX) / centerX
    const deltaY = (clientY - centerY) / centerY
    setMousePos({ x: deltaX * 14, y: deltaY * 14 })
    setCardTilt({ rx: -deltaY * 8, ry: deltaX * 8 })
  }

  const toggleAudio = () => {
    if (!audioSynthRef.current) return
    if (audioEnabled) {
      audioSynthRef.current.stop()
      setAudioEnabled(false)
    } else {
      audioSynthRef.current.start(bpm)
      audioSynthRef.current.setVolume(audioVolume)
      setAudioEnabled(true)
    }
  }

  const handleBpmChange = (newBpm) => {
    setBpm(newBpm)
    if (audioSynthRef.current && audioEnabled) {
      audioSynthRef.current.setBpm(newBpm)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Trigger Apple-grade hyperspace transition into studio
  const handleLaunchStudio = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      onEnterStudio()
    }, 700)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-screen bg-[#07090e] text-[#f8fafc] overflow-hidden flex items-center justify-center p-3 sm:p-6 md:p-8 select-none"
    >
      {/* BACKGROUND PARTICLES & GLOW (Smooth atmospheric depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-cyan-900/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-emerald-900/15 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-950/10 rounded-full blur-[160px]" />
      </div>

      {/* OUTER CINEMATIC BEZEL CONTAINER (Pixel-perfect match to screenshot) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: isTransitioning ? 1.04 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1380px] h-[92vh] max-h-[920px] bg-[#0c0f17] border border-white/[0.08] rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.85)] flex flex-col justify-between p-6 sm:p-10 md:p-12 z-10"
      >
        {/* Hyperspace Scanning Laser Line (Triggered on launch) */}
        {isTransitioning && (
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_30px_#06b6d4] z-50 pointer-events-none"
          />
        )}

        {/* ========================================================
            TOP BAR: LOGO + NAVIGATION PILLS
            ======================================================== */}
        <header className="relative z-20 flex items-center justify-between w-full">
          {/* Top-Left: Green Plus Badge + H+ MEDICAL Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveAboutModal(true)}
          >
            <div className="w-8 h-8 rounded-full bg-[#84cc16] flex items-center justify-center text-black font-extrabold text-base shadow-[0_0_20px_rgba(132,204,22,0.6)]">
              +
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-[0.2em] text-white uppercase font-sans">
                H+ MEDICAL
              </span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-0.5">
                EchoCard·AI PACS
              </span>
            </div>
          </motion.div>

          {/* Top-Right: Pill Navigation Capsules */}
          <nav className="flex items-center space-x-2 sm:space-x-3 text-xs font-medium">
            <button
              onClick={() => setActiveServicesModal(true)}
              className="px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.08] transition duration-200 cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => setActivePlansModal(true)}
              className="px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.08] transition duration-200 cursor-pointer"
            >
              Plans
            </button>
            <button
              onClick={() => setActiveAboutModal(true)}
              className="px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.08] transition duration-200 cursor-pointer"
            >
              About
            </button>

            {/* Render Mode Switcher Pill */}
            <button
              onClick={() => setRenderMode(renderMode === "master" ? "webgl" : "master")}
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer text-xs font-mono"
              title="Toggle between Master Art & 3D WebGL Orbit"
            >
              <Cpu size={12} className={renderMode === "webgl" ? "text-cyan-400" : "text-emerald-400"} />
              <span>{renderMode === "master" ? "3D Mesh Orbit" : "Master Render"}</span>
            </button>

            {/* Quick Action: Enter PACS Studio */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLaunchStudio}
              className="hidden md:flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-400/40 transition duration-200 cursor-pointer text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.25)]"
            >
              <Zap size={12} className="text-cyan-400 animate-pulse" />
              <span>PACS Studio</span>
            </motion.button>
          </nav>
        </header>

        {/* ========================================================
            CENTER CONTENT AREA:
            LEFT: TYPOGRAPHY ("Stronger Hearts — Longer Lives")
            CENTER/RIGHT: 3D ANATOMICAL HEART + FLOATING CARDS
            ======================================================== */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 items-center flex-1 my-auto w-full gap-8">
          
          {/* LEFT COLUMN: DESCRIPTION & DISPLAY HEADLINE */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start text-left z-20 pointer-events-auto">
            {/* Introductory Blurb */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-[280px] sm:max-w-[320px] mb-4"
            >
              Advanced cardiology care designed to detect, protect and strengthen your heart.
            </motion.p>

            {/* READ OUR STORY Link */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              onClick={() => setActiveStoryModal(true)}
              className="text-[11px] font-bold tracking-[0.16em] uppercase text-slate-300 hover:text-white border-b border-slate-500 hover:border-white pb-0.5 transition duration-200 mb-8 sm:mb-14 cursor-pointer"
            >
              READ OUR STORY
            </motion.button>

            {/* GIANT DISPLAY HEADLINE (EXACT BEIGE COLOR & TIGHT PROPORTIONS) */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f3efe6] leading-[0.94] font-sans"
            >
              Stronger<br />
              Hearts —<br />
              Longer Lives
            </motion.h1>
          </div>

          {/* CENTER / RIGHT: 3D ANATOMICAL HEART + FLOATING TELEMETRY CARDS */}
          <div className="lg:col-span-7 relative flex items-center justify-center h-full min-h-[380px] sm:min-h-[460px]">
            
            {/* MODE 1: MASTER REALISTIC ANATOMICAL HEART (Exact match to screenshot) */}
            {renderMode === "master" && (
              <>
                {/* ROTATING ORBITAL GLOWING ELLIPSE LINES (From Screenshot) */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
                  viewBox="0 0 600 600"
                >
                  <ellipse
                    cx="300"
                    cy="300"
                    rx="240"
                    ry="170"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.12)"
                    strokeWidth="1.2"
                    strokeDasharray="4 6"
                    transform="rotate(-25 300 300)"
                  />
                  <ellipse
                    cx="300"
                    cy="300"
                    rx="275"
                    ry="195"
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.18)"
                    strokeWidth="1.2"
                    transform="rotate(15 300 300)"
                  />
                  {/* Traveling Orbital Pulse Particle */}
                  <circle cx="300" cy="130" r="3.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #06b6d4)">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 300 300"
                      to="360 300 300"
                      dur="16s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="300" cy="470" r="2.5" fill="#10b981" filter="drop-shadow(0 0 4px #10b981)">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="360 300 300"
                      to="0 300 300"
                      dur="22s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>

                {/* THE ANATOMICAL HEART (WITH REALISTIC DUAL-PHASE LUB-DUB PULSE & PARALLAX) */}
                <motion.div
                  style={{
                    x: mousePos.x,
                    y: mousePos.y,
                    rotateX: cardTilt.rx * 0.5,
                    rotateY: cardTilt.ry * 0.5
                  }}
                  animate={reducedMotion ? {} : {
                    scale: [1, 1.042, 0.982, 1.025, 1],
                    rotate: [0, -0.8, 0.5, -0.3, 0]
                  }}
                  transition={{
                    duration: 60 / bpm,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 flex items-center justify-center cursor-pointer"
                  onClick={toggleAudio}
                  title="Click to toggle Web Audio organic heartbeat sound"
                >
                  <img
                    src="/heart_hero_clean.png"
                    alt="Realistic 3D Anatomical Heart"
                    className="max-h-[380px] sm:max-h-[460px] md:max-h-[520px] w-auto object-contain drop-shadow-[0_20px_70px_rgba(0,0,0,0.95)]"
                  />
                </motion.div>
              </>
            )}

            {/* MODE 2: INTERACTIVE 3D WEBGL THREE.JS MESH (User can orbit 360°) */}
            {renderMode === "webgl" && (
              <div className="absolute inset-0 w-full h-full z-10 rounded-2xl overflow-hidden">
                <ThreeHeartCanvas
                  isTransitioning={isTransitioning}
                  onTransitionComplete={onEnterStudio}
                  reducedMotion={reducedMotion}
                  bpm={bpm}
                  cameraAngle={cameraAngle}
                  anatomicalLayer={anatomicalLayer}
                  cardiacPhase={cardiacPhase}
                />
                {/* 3D Camera & Layer Controls Overlay */}
                <div className="absolute top-2 right-2 z-20 flex flex-wrap gap-1.5 p-2 bg-slate-950/80 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-mono">
                  {["anterior", "apical", "lateral", "parasternal"].map((ang) => (
                    <button
                      key={ang}
                      onClick={() => setCameraAngle(ang)}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        cameraAngle === ang ? "bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/40" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {ang.toUpperCase()}
                    </button>
                  ))}
                  <div className="w-px h-3 bg-white/20 self-center" />
                  {["solid", "xray", "wireframe"].map((lyr) => (
                    <button
                      key={lyr}
                      onClick={() => setAnatomicalLayer(lyr)}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        anatomicalLayer === lyr ? "bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-400/40" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {lyr.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                FLOATING CARD 1: BLOOD STATUS (96 bpm + Animated EKG)
                ======================================================== */}
            <motion.div
              style={{
                x: mousePos.x * 1.5,
                y: mousePos.y * 1.5,
                rotateX: cardTilt.rx,
                rotateY: cardTilt.ry
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="absolute top-[16%] sm:top-[22%] left-[6%] sm:left-[12%] z-30 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#3b181a]/85 via-[#261012]/80 to-[#160a0c]/90 border border-white/20 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] min-w-[140px] sm:min-w-[165px]"
            >
              <div className="flex items-center space-x-1.5 mb-1 text-slate-300 text-[10px] sm:text-[11px] font-medium">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-pulse" />
                <span>Blood Status</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                {bpm} <span className="text-xs font-normal text-slate-400">bpm</span>
              </div>

              {/* LIVE CONTINUOUSLY ANIMATED EKG WAVEFORM */}
              <div className="w-full h-6 mt-1.5 overflow-hidden relative">
                <svg viewBox="0 0 120 24" className="w-full h-full">
                  <path
                    d="M 0 14 L 20 14 L 28 14 L 32 8 L 36 22 L 40 2 L 44 18 L 48 14 L 60 14 L 80 14 L 88 14 L 92 8 L 96 22 L 100 2 L 104 18 L 108 14 L 120 14"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <animate
                      attributeName="stroke-dasharray"
                      values="0,120; 120,0; 0,120"
                      dur="2.2s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>
            </motion.div>

            {/* ========================================================
                FLOATING CARD 2: BLOOD COUNT (80 / 100 + Sine Waveform)
                ======================================================== */}
            <motion.div
              style={{
                x: mousePos.x * 1.8,
                y: mousePos.y * 1.8,
                rotateX: cardTilt.rx,
                rotateY: cardTilt.ry
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="absolute bottom-[20%] sm:bottom-[24%] right-[4%] sm:right-[10%] z-30 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#3b2318]/85 via-[#261810]/80 to-[#160f0a]/90 border border-white/20 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] min-w-[150px] sm:min-w-[175px]"
            >
              <div className="flex items-center space-x-1.5 mb-1 text-slate-300 text-[10px] sm:text-[11px] font-medium">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Blood Count</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
                {bloodCount} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>

              {/* LIVE ANIMATED SINE WAVE WITH GLOWING BEACON NODE */}
              <div className="w-full h-6 mt-1.5 overflow-hidden relative">
                <svg viewBox="0 0 120 24" className="w-full h-full">
                  <path
                    d="M 0 14 C 20 14, 25 6, 40 6 C 55 6, 65 20, 80 20 C 95 20, 105 10, 120 10"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  {/* Glowing Node Traveling on Spline */}
                  <circle cx="85" cy="18" r="3.5" fill="#ffffff" stroke="#fbbf24" strokeWidth="1.5">
                    <animate
                      attributeName="r"
                      values="3; 4.8; 3"
                      dur="1.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ========================================================
            BOTTOM BAR:
            LEFT: FLOATING UTILITY PILL (Audio, Fullscreen, Presets, Sliders)
            RIGHT: "Dedicated to healthier hearts..." + VIBRANT LIME BUTTON
            ======================================================== */}
        <footer className="relative z-20 flex flex-col sm:flex-row items-center justify-between w-full pt-4 gap-4">
          
          {/* Bottom-Center Floating Utility Bar */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-slate-400">
            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-1.5 rounded-full hover:text-white transition cursor-pointer ${
                audioEnabled ? "text-cyan-400 bg-cyan-950/60" : ""
              }`}
              title={audioEnabled ? "Mute Heartbeat Sound" : "Enable Web Audio S1/S2 Sound"}
            >
              {audioEnabled ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
            </button>

            {/* Rhythm Modulation Pill */}
            <button
              onClick={() => handleBpmChange(bpm === 96 ? 72 : (bpm === 72 ? 110 : 96))}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 transition cursor-pointer"
              title="Cycle Rhythm (72, 96, 110 BPM)"
            >
              {bpm} BPM
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full hover:text-white transition cursor-pointer"
              title="Toggle Fullscreen Bezel"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* Presets Quick Menu Toggle */}
            <button
              onClick={() => setShowPresetsMenu(!showPresetsMenu)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 transition cursor-pointer"
              title="Quick Examiner Cases"
            >
              <span>Cases</span>
              <ChevronRight size={10} className={showPresetsMenu ? "rotate-90" : ""} />
            </button>
          </div>

          {/* Bottom-Right: Call-to-Action with Neon Green Glow */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <span className="hidden md:inline-block text-xs text-slate-400 font-light max-w-[140px] text-right leading-tight">
              Dedicated to healthier hearts, every day
            </span>

            {/* VIBRANT LIME GREEN PILL BUTTON (EXACT MATCH) */}
            <motion.button
              onClick={handleLaunchStudio}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 sm:px-10 py-3.5 rounded-full bg-[#84cc16] hover:bg-[#9ae600] text-black font-bold text-sm tracking-wide cursor-pointer transition-all duration-200 shadow-[0_10px_35px_rgba(132,204,22,0.45)] hover:shadow-[0_12px_45px_rgba(132,204,22,0.7)]"
            >
              Book Consultation
            </motion.button>
          </div>
        </footer>

      </motion.div>

      {/* ========================================================
          POPUP MODAL 1: EXAMINER PRESETS QUICK LAUNCH
          ======================================================== */}
      {showPresetsMenu && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-80 bg-[#0f1422] border border-cyan-500/40 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex justify-between items-center mb-3 text-xs font-bold text-cyan-300">
            <span>EXAMINER TEST PRESETS</span>
            <button onClick={() => setShowPresetsMenu(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-2">
            {[
              { id: "0X1002E8FBACD08477.avi", label: "🟢 Normal Preserved LVEF (59.1%)", sub: "Case #1002 • Normal kinetics" },
              { id: "0X101026B90DAE7E95.avi", label: "🟡 Mildly Reduced HFmrEF (46.8%)", sub: "Case #1010 • Impaired relaxation" },
              { id: "0X10094BA0A028EAC3.avi", label: "🔴 Severely Reduced HFrEF (24.9%)", sub: "Case #1009 • Systolic failure" }
            ].map((c, i) => (
              <button
                key={i}
                onClick={handleLaunchStudio}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer"
              >
                <div className="text-xs font-bold text-white">{c.label}</div>
                <div className="text-[10px] text-slate-400">{c.sub}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP MODAL 2: "READ OUR STORY"
          ======================================================== */}
      {activeStoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d121f] border border-white/10 rounded-3xl p-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-slate-200"
          >
            <button
              onClick={() => setActiveStoryModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="w-10 h-10 rounded-full bg-[#84cc16]/20 text-[#84cc16] flex items-center justify-center font-bold text-lg mb-4">
              +
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">The Genesis of EchoCard-AI</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Heart failure affects over 64 million people globally. Manual echocardiography assessment suffers from 6.8% to 8.2% inter-observer variability between certified cardiologists.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              EchoCard-AI bridges this diagnostic gap with a 3D spatiotemporal ResNet-18 model trained across 10,030 Stanford Medicine echocardiogram videos. By capturing both spatial endocardial contours and 32 frames of temporal torsion, it delivers instantaneous LVEF quantification, automated Simpson's volumetry, and 3D Grad-CAM explainability.
            </p>
            <button
              onClick={() => {
                setActiveStoryModal(false)
                handleLaunchStudio()
              }}
              className="w-full py-3 rounded-full bg-[#84cc16] text-black font-bold text-sm tracking-wide cursor-pointer hover:bg-[#9ae600] transition"
            >
              Launch PACS Studio & Test Models
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          POPUP MODAL 3: SERVICES
          ======================================================== */}
      {activeServicesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d121f] border border-white/10 rounded-3xl p-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-slate-200"
          >
            <button
              onClick={() => setActiveServicesModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Clinical Cardiology AI Services</h2>
            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs font-bold text-cyan-300">1. Automated LVEF Quantification</div>
                <div className="text-xs text-slate-400 mt-1">3D Spatiotemporal CNN analyzing 32-frame cineloops with Monte Carlo uncertainty estimation.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs font-bold text-emerald-300">2. Single-Plane & Biplane Simpson's Volumetry</div>
                <div className="text-xs text-slate-400 mt-1">Automatic endocardial boundary detection calculating EDV (mL), ESV (mL), and Stroke Volume.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs font-bold text-amber-300">3. 3D Grad-CAM Neural Attention Maps</div>
                <div className="text-xs text-slate-400 mt-1">Zero-hallucination verification proving model attends to ventricular wall contraction.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs font-bold text-rose-300">4. FAISS Precedent Case Retrieval</div>
                <div className="text-xs text-slate-400 mt-1">Latent embeddings indexed across Stanford's 10,030-patient repository for morphological matching.</div>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveServicesModal(false)
                handleLaunchStudio()
              }}
              className="w-full py-3 rounded-full bg-[#84cc16] text-black font-bold text-sm tracking-wide cursor-pointer hover:bg-[#9ae600] transition"
            >
              Test Live Services in Studio
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          POPUP MODAL 4: PLANS / PACS TIERS
          ======================================================== */}
      {activePlansModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl bg-[#0d121f] border border-white/10 rounded-3xl p-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-slate-200"
          >
            <button
              onClick={() => setActivePlansModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Hospital & Research Deployment Plans</h2>
            <p className="text-xs text-slate-400 mb-6">Designed for clinical echocardiography laboratories and academic research.</p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
                <div className="text-xs font-bold text-white uppercase">Clinical PACS</div>
                <div className="text-lg font-extrabold text-[#84cc16] mt-1">DICOM PS 3.3</div>
                <div className="text-[11px] text-slate-400 mt-2">HL7 integration, automated report generation, cardiologist sign-off workflow.</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-cyan-500/30 bg-cyan-950/20">
                <div className="text-xs font-bold text-cyan-300 uppercase">Research Suite</div>
                <div className="text-lg font-extrabold text-cyan-400 mt-1">Open Weights</div>
                <div className="text-[11px] text-slate-400 mt-2">Stanford EchoNet benchmark, nnU-Net baseline comparison, raw tensor export.</div>
              </div>
            </div>
            <button
              onClick={() => {
                setActivePlansModal(false)
                handleLaunchStudio()
              }}
              className="w-full py-3 rounded-full bg-[#84cc16] text-black font-bold text-sm tracking-wide cursor-pointer hover:bg-[#9ae600] transition"
            >
              Continue to Studio
            </button>
          </motion.div>
        </div>
      )}

      {/* ========================================================
          POPUP MODAL 5: ABOUT
          ======================================================== */}
      {activeAboutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#0d121f] border border-white/10 rounded-3xl p-8 relative shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-slate-200"
          >
            <button
              onClick={() => setActiveAboutModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={16} />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">H+ MEDICAL • EchoCard-AI</h2>
            <div className="text-xs text-slate-400 space-y-2.5 mb-6">
              <p>• <strong>Core Model:</strong> 3D ResNet-18 (33,176,405 parameters) trained on 10,030 apical 4-chamber ultrasound cineloops.</p>
              <p>• <strong>Screening Metric:</strong> 94.3% diagnostic screening accuracy (AUC 0.94) for detecting EF &lt; 50%.</p>
              <p>• <strong>Validation Benchmark:</strong> MAE 4.18% on held-out test splits, exceeding certified human inter-observer agreement.</p>
              <p>• <strong>Cross-Vendor Test:</strong> Verified zero-shot generalization against the European CAMUS dataset (GE Healthcare & Philips).</p>
            </div>
            <button
              onClick={() => {
                setActiveAboutModal(false)
                handleLaunchStudio()
              }}
              className="w-full py-3 rounded-full bg-[#84cc16] text-black font-bold text-sm tracking-wide cursor-pointer hover:bg-[#9ae600] transition"
            >
              Enter Analysis Studio
            </button>
          </motion.div>
        </div>
      )}

    </div>
  )
}
