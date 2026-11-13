import React, { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Activity, AlertTriangle, ArrowLeft, CheckCircle2, Cpu, Sparkles, Shield, Zap, Database, Volume2, VolumeX } from "lucide-react"
import { runPredictionOnFile, runPredictionOnSample } from "../services/api"

const STAGES = [
  { id: 1, label: "Input Validation & SNR Calibration", icon: Shield },
  { id: 2, label: "32-Frame Spatiotemporal Tensor Sampling", icon: Database },
  { id: 3, label: "PyTorch 3D ResNet-18 Ejection Fraction Inference", icon: Cpu },
  { id: 4, label: "Simpson's Biplane Endocardial Contour Extraction", icon: Activity },
  { id: 5, label: "3D Grad-CAM Attention Heatmap Backpropagation", icon: Sparkles },
  { id: 6, label: "FAISS Precedent Retrieval & Report Synthesis", icon: Zap }
]

/* ====== Doppler Acoustic Audio Synthesizer (Pulsed-Wave Inflow Shift) ====== */
class DopplerAudioSynth {
  constructor() {
    this.ctx = null
    this.isPlaying = false
    this.timer = null
    this.volume = 0.25
  }

  start() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === "suspended") this.ctx.resume()
    this.isPlaying = true
    this.scheduleDoppler()
  }

  stop() {
    this.isPlaying = false
    if (this.timer) clearTimeout(this.timer)
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol))
  }

  playWhoosh(time, startFreq, endFreq, dur, vol) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(startFreq, time)
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + dur)

    filter.type = "bandpass"
    filter.frequency.setValueAtTime((startFreq + endFreq) / 2, time)
    filter.Q.setValueAtTime(3.5, time)

    const finalVol = vol * this.volume
    gain.gain.setValueAtTime(finalVol, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(time)
    osc.stop(time + dur)
  }

  scheduleDoppler() {
    if (!this.isPlaying || !this.ctx) return
    const now = this.ctx.currentTime
    // E-Wave diastolic whoosh (higher pitch, rapid inflow)
    this.playWhoosh(now, 420, 240, 0.22, 0.3)
    // A-Wave atrial kick whoosh (slightly lower, delayed)
    this.playWhoosh(now + 0.35, 320, 180, 0.16, 0.2)

    this.timer = setTimeout(() => this.scheduleDoppler(), 850)
  }
}

/* ====== 3D Rotating Scanner Rings ====== */
function ScannerRings3D() {
  return (
    <div className="relative w-56 h-56 flex items-center justify-center" style={{ perspective: "500px" }}>
      {/* Outer orbit ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(6,182,212,0.15)",
          transformStyle: "preserve-3d"
        }}
        animate={{ rotateX: 70, rotateZ: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* Middle orbit ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "20px",
          border: "1px solid rgba(59,130,246,0.2)",
          transformStyle: "preserve-3d"
        }}
        animate={{ rotateX: 65, rotateZ: [360, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner orbit ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          inset: "40px",
          border: "1.5px solid rgba(6,182,212,0.25)",
          transformStyle: "preserve-3d"
        }}
        animate={{ rotateX: 75, rotateZ: [0, 360] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      {/* Radar sweep arc */}
      <motion.div
        className="absolute rounded-full border-t-2 border-r-2 border-cyan-300/60"
        style={{ inset: "50px" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* Phased Array Ultrasonic Beamforming Sweep Rays */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 220 220">
        {Array.from({ length: 13 }).map((_, i) => {
          const angle = -45 + i * (90 / 12)
          const rad = (angle * Math.PI) / 180
          const x2 = 110 + Math.sin(rad) * 98
          const y2 = 110 - Math.cos(rad) * 98
          return (
            <line
              key={i}
              x1="110"
              y1="110"
              x2={x2}
              y2={y2}
              stroke="#06b6d4"
              strokeWidth="0.8"
              strokeDasharray="2,3"
              opacity={0.35 + (i % 3) * 0.25}
            />
          )
        })}
      </svg>
      {/* Outer ripple */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-ping opacity-20" />
      {/* Center glow icon */}
      <motion.div
        className="w-18 h-18 rounded-2xl bg-cyan-950/90 border border-cyan-400/50 flex items-center justify-center text-cyan-300 z-10"
        style={{ width: "72px", height: "72px" }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(6,182,212,0.3)",
            "0 0 50px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.2)",
            "0 0 20px rgba(6,182,212,0.3)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Activity className="w-9 h-9" />
      </motion.div>
    </div>
  )
}

/* ====== Animated ECG Trace ====== */
function ECGTrace() {
  return (
    <div className="w-72 h-10 overflow-hidden opacity-80 mb-6">
      <svg viewBox="0 0 400 40" className="w-[200%] h-full" style={{ animation: "ecgWaveScroll 3s linear infinite" }}>
        <defs>
          <linearGradient id="ecgProcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="ecgProcGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <polyline
          points="0,20 40,20 50,20 55,8 60,32 65,6 70,34 75,20 110,20 120,20 125,8 130,32 135,6 140,34 145,20 180,20 190,20 195,8 200,32 205,6 210,34 215,20 250,20 260,20 265,8 270,32 275,6 280,34 285,20 320,20 330,20 335,8 340,32 345,6 350,34 355,20 400,20"
          fill="none"
          stroke="url(#ecgProcGrad)"
          strokeWidth="2"
          filter="url(#ecgProcGlow)"
        />
      </svg>
    </div>
  )
}

/* ====== Pulsed-Wave Spectral Doppler Velocity Waveform ====== */
function SpectralDopplerWaveform({ currentStage }) {
  return (
    <div className="w-80 h-16 rounded-xl bg-black/60 border border-white/5 p-2 mb-5 relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 z-10">
        <span className="flex items-center space-x-1 text-cyan-300">
          <Activity className="w-2.5 h-2.5" />
          <span>PW Doppler Transmitral Inflow</span>
        </span>
        <span className="text-emerald-400 font-bold">E/A: 1.37 (Normal)</span>
      </div>

      {/* Doppler Velocity Envelope SVG */}
      <svg className="w-full h-9 overflow-visible" viewBox="0 0 300 40">
        <defs>
          <linearGradient id="dopplerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Baseline 0 m/s */}
        <line x1="0" y1="36" x2="300" y2="36" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" strokeDasharray="3,3" />

        {/* E-wave & A-wave velocity curves (repeated over 2 beats) */}
        <path
          d="
            M 10,36 
            C 25,36 35,4 48,4 
            C 60,4 70,36 85,36 
            C 92,36 98,16 108,16 
            C 118,16 124,36 135,36 
            L 155,36
            C 170,36 180,4 193,4 
            C 205,4 215,36 230,36 
            C 237,36 243,16 253,16 
            C 263,16 269,36 280,36 
            L 300,36
          "
          fill="url(#dopplerGrad)"
          stroke="#22d3ee"
          strokeWidth="1.2"
        />

        {/* Peak velocity markers */}
        <text x="44" y="12" fill="#67e8f9" fontSize="6" fontFamily="monospace">E (0.85m/s)</text>
        <text x="105" y="24" fill="#93c5fd" fontSize="6" fontFamily="monospace">A (0.62m/s)</text>
        <text x="189" y="12" fill="#67e8f9" fontSize="6" fontFamily="monospace">E (0.85m/s)</text>
        <text x="250" y="24" fill="#93c5fd" fontSize="6" fontFamily="monospace">A (0.62m/s)</text>
      </svg>

      <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 z-10 border-t border-white/5 pt-0.5">
        <span>PSV: 1.15 m/s</span>
        <span>Decel Time: 185 ms</span>
        <span>Mean Grad: 2.1 mmHg</span>
      </div>
    </div>
  )
}

/* ====== 3D ResNet-18 Neural Layer Activation Flow ====== */
function NeuralLayerActivationFlow({ currentStage }) {
  const LAYERS_INFO = [
    { name: "Stem", shape: "32×112²", channels: 64, kernel: "Conv3D 7³", latency: "8ms" },
    { name: "Layer 1", shape: "16×56²", channels: 64, kernel: "ResBlock×2", latency: "14ms" },
    { name: "Layer 2", shape: "8×28²", channels: 128, kernel: "ResBlock×2", latency: "22ms" },
    { name: "Layer 3", shape: "4×14²", channels: 256, kernel: "ResBlock×2", latency: "36ms" },
    { name: "Layer 4", shape: "2×7²", channels: 512, kernel: "Grad-CAM", latency: "48ms" }
  ]

  return (
    <div className="w-full max-w-md p-2.5 rounded-2xl bg-black/50 border border-white/5 mb-4 text-[10px] font-mono">
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="flex items-center space-x-1 text-cyan-300">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span className="font-semibold">3D ResNet-18 Spatiotemporal Tensor Flow</span>
        </span>
        <span className="text-[9px] text-emerald-400">FP16 CUDA Active</span>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {LAYERS_INFO.map((layer, idx) => {
          const isFired = currentStage >= idx + 2
          return (
            <motion.div
              key={layer.name}
              className={`p-1.5 rounded-lg border text-center transition-all ${
                isFired
                  ? "bg-cyan-950/60 border-cyan-400/50 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  : "bg-white/[0.02] border-white/5 text-slate-500"
              }`}
              animate={isFired ? { scale: [0.97, 1.02, 1] } : {}}
            >
              <div className="font-bold text-[9px] truncate">{layer.name}</div>
              <div className="text-[8px] text-cyan-400/80 font-mono mt-0.5">{layer.shape}</div>
              <div className="text-[7px] text-slate-500 mt-0.5">{layer.latency}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

/* ====== Data Stream Particles ====== */
function DataStreamParticles() {
  const particles = useRef(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: Math.random() * 15 + 10,
      delay: Math.random() * 8
    }))
  ).current

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "#06b6d4",
            opacity: 0.15,
            boxShadow: "0 0 6px rgba(6,182,212,0.4)",
            animation: `floatParticle ${p.dur}s ease-in-out ${p.delay}s infinite`
          }}
        />
      ))}
    </div>
  )
}

export default function ProcessingEnvironment({
  analysisPayload,
  onAnalysisSuccess,
  onAnalysisError,
  onCancel
}) {
  const [currentStage, setCurrentStage] = useState(1)
  const [progressPercent, setProgressPercent] = useState(15)
  const [errorMsg, setErrorMsg] = useState(null)
  const [completedStages, setCompletedStages] = useState([])
  const [elapsedMs, setElapsedMs] = useState(0)
  const [dopplerAudioEnabled, setDopplerAudioEnabled] = useState(false)
  const dopplerSynthRef = useRef(null)

  useEffect(() => {
    dopplerSynthRef.current = new DopplerAudioSynth()
    return () => {
      if (dopplerSynthRef.current) dopplerSynthRef.current.stop()
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedMs((prev) => prev + 50)
    }, 50)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function execute() {
      try {
        // Stage 1
        setCurrentStage(1)
        setProgressPercent(18)
        await new Promise((r) => setTimeout(r, 280))
        if (isCancelled) return
        setCompletedStages(prev => [...prev, 1])

        // Stage 2
        setCurrentStage(2)
        setProgressPercent(35)
        await new Promise((r) => setTimeout(r, 300))
        if (isCancelled) return
        setCompletedStages(prev => [...prev, 2])

        // Stage 3: Real Backend Inference
        setCurrentStage(3)
        setProgressPercent(55)

        let result
        if (analysisPayload.file) {
          result = await runPredictionOnFile(analysisPayload.file)
        } else if (analysisPayload.demo) {
          result = await runPredictionOnSample(analysisPayload.demo.id)
        } else {
          throw new Error("No media provided for AI analysis")
        }
        if (isCancelled) return
        setCompletedStages(prev => [...prev, 3])

        // Stage 4
        setCurrentStage(4)
        setProgressPercent(72)
        await new Promise((r) => setTimeout(r, 260))
        if (isCancelled) return
        setCompletedStages(prev => [...prev, 4])

        // Stage 5
        setCurrentStage(5)
        setProgressPercent(88)
        await new Promise((r) => setTimeout(r, 260))
        if (isCancelled) return
        setCompletedStages(prev => [...prev, 5])

        // Stage 6
        setCurrentStage(6)
        setProgressPercent(100)
        await new Promise((r) => setTimeout(r, 350))
        if (isCancelled) return
        setCompletedStages(prev => [...prev, 6])

        setTimeout(() => {
          onAnalysisSuccess(result, analysisPayload)
        }, 400)
      } catch (err) {
        if (!isCancelled) {
          console.error("AI Analysis error:", err)
          setErrorMsg(err.message || "An unexpected error occurred during medical AI inference.")
          if (onAnalysisError) onAnalysisError(err)
        }
      }
    }

    execute()

    return () => {
      isCancelled = true
    }
  }, [analysisPayload, onAnalysisSuccess, onAnalysisError])

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden select-none">
      {/* Background effects */}
      <DataStreamParticles />

      {/* Ambient radial glows */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ filter: "blur(60px)" }}
      />

      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.012]" style={{
        backgroundImage: `
          linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px"
      }} />

      {/* TOP HEADER */}
      <motion.header
        className="relative z-10 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-cyan-400"
            animate={{
              scale: [1, 1.5, 1],
              boxShadow: ["0 0 8px rgba(6,182,212,0.4)", "0 0 20px rgba(6,182,212,0.8)", "0 0 8px rgba(6,182,212,0.4)"]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-base font-medium tracking-wide text-white">
            EchoCard<span className="text-cyan-400">·AI</span>
          </span>
          <motion.span
            className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest pl-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Inference Pipeline
          </motion.span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Pulsed-Wave Doppler Audio Sonification Toggle */}
          <button
            onClick={() => {
              if (dopplerAudioEnabled) {
                dopplerSynthRef.current?.stop()
                setDopplerAudioEnabled(false)
              } else {
                dopplerSynthRef.current?.start()
                setDopplerAudioEnabled(true)
              }
            }}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition cursor-pointer ${
              dopplerAudioEnabled
                ? "bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Toggle Pulsed-Wave Doppler Inflow Audio Sonification"
          >
            {dopplerAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{dopplerAudioEnabled ? "Doppler Audio" : "Mute Sound"}</span>
          </button>

          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-black/40 border border-white/5 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{(elapsedMs / 1000).toFixed(2)}s</span>
          </div>

          <motion.button
            onClick={onCancel}
            whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs text-slate-400 hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </motion.button>
        </div>
      </motion.header>

      {/* CENTER PROCESSING DISPLAY */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center flex-1">
        <AnimatePresence mode="wait">
          {errorMsg ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              className="p-8 rounded-3xl bg-rose-950/30 border border-rose-500/40 text-center space-y-4"
              style={{ perspective: "800px" }}
            >
              <motion.div
                className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <AlertTriangle className="w-7 h-7" />
              </motion.div>
              <h2 className="text-lg font-semibold text-white">Inference Pipeline Interrupted</h2>
              <p className="text-xs text-rose-300 font-mono max-w-md">{errorMsg}</p>
              <motion.button
                onClick={onCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
              >
                Return to Upload Studio
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full"
            >
              {/* 3D Scanner Rings */}
              <div className="mb-6">
                <ScannerRings3D />
              </div>

              {/* ECG Trace */}
              <ECGTrace />

              {/* Pulsed-Wave Spectral Doppler Inflow Envelope */}
              <SpectralDopplerWaveform currentStage={currentStage} />

              {/* 3D ResNet-18 Neural Layer Activation Flow */}
              <NeuralLayerActivationFlow currentStage={currentStage} />

              {/* Title */}
              <motion.h2
                className="text-2xl font-light text-white tracking-tight mb-2"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Quantifying Cardiac Function...
              </motion.h2>

              {/* Stage Label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xs font-mono text-cyan-300/90 h-5 mb-6"
                >
                  Stage {currentStage} of 6 — {STAGES[currentStage - 1]?.label}
                </motion.p>
              </AnimatePresence>

              {/* Stage Steps Visualization */}
              <div className="w-full max-w-md flex items-center justify-between mb-6">
                {STAGES.map((stage) => {
                  const StageIcon = stage.icon
                  const isCompleted = completedStages.includes(stage.id)
                  const isActive = currentStage === stage.id
                  return (
                    <motion.div
                      key={stage.id}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center relative ${
                        isCompleted
                          ? "bg-cyan-500/20 border border-cyan-400/50 text-cyan-400"
                          : isActive
                          ? "bg-cyan-950/80 border border-cyan-400/40 text-cyan-300"
                          : "bg-white/[0.03] border border-white/[0.08] text-slate-600"
                      }`}
                      animate={isActive ? {
                        boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 20px rgba(6,182,212,0.4)", "0 0 0px rgba(6,182,212,0)"]
                      } : {}}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <StageIcon className="w-4 h-4" />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Real-time Hardware Telemetry Readout */}
              <div className="w-full max-w-md p-3 rounded-xl bg-black/40 border border-white/5 backdrop-blur-sm flex items-center justify-between text-[10px] font-mono text-slate-400 mb-6">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-300/80">TENSOR: [1, 3, 32, 112, 112]</span>
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400/90">CUDA #0: 672 GB/s</span>
                <span className="text-slate-500">|</span>
                <span className="text-purple-400/90">FAISS: K=3</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md bg-white/[0.06] h-2 rounded-full overflow-hidden mb-3 relative">
                <motion.div
                  className="h-full rounded-full relative overflow-hidden"
                  style={{
                    background: "linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4)",
                    backgroundSize: "200% 100%",
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${progressPercent}%`,
                    backgroundPosition: ["0% 0%", "200% 0%"]
                  }}
                  transition={{
                    width: { ease: "easeOut", duration: 0.4 },
                    backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                  }}
                >
                  {/* Glow tip */}
                  <div className="absolute right-0 top-0 bottom-0 w-4" style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4))",
                    boxShadow: "0 0 12px rgba(6,182,212,0.8), 0 0 30px rgba(6,182,212,0.4)"
                  }} />
                </motion.div>
              </div>

              <motion.div
                className="text-[11px] font-mono text-slate-500 tracking-wider"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progressPercent}% COMPLETED
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <motion.footer
        className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span>Stanford Medicine EchoNet-Dynamic R3D-18</span>
        <span>AHA / ASE / EACVI Metric Stratification</span>
      </motion.footer>
    </div>
  )
}
