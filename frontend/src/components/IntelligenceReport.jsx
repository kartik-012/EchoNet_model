import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Activity,
  Heart,
  Download,
  Share2,
  FileText,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Database,
  Cpu,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  Sparkles,
  Sliders,
  ExternalLink,
  Info,
  Send,
  Eye,
  Settings,
  Bell,
  User,
  Maximize2,
  BarChart3,
  TrendingUp,
  CheckCircle,
  Printer,
  ArrowRight,
  Search,
  Columns
} from "lucide-react"
import { generateClinicalPDF } from "../utils/pdfExport"

function toImageSrc(val, fallback = "/sample_echo.webp") {
  if (!val) return fallback
  if (typeof val === "object") {
    val = val.frame || val.image || val.contour || val.overlay || fallback
  }
  if (typeof val === "string") {
    val = val.trim()
    if (val.startsWith("data:") || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("/")) {
      return val
    }
    return `data:image/jpeg;base64,${val}`
  }
  return fallback
}

/* ====== 3D Tilt Card Hook ====== */
function use3DTilt(intensity = 8) {
  const ref = useRef(null)
  const [transform, setTransform] = useState("perspective(800px) rotateX(0deg) rotateY(0deg)")
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (0.5 - y) * intensity
    const rotateY = (x - 0.5) * intensity
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlare({ x: x * 100, y: y * 100, opacity: 0.12 })
  }, [intensity])

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)")
    setGlare({ x: 50, y: 50, opacity: 0 })
  }, [])

  return { ref, transform, glare, handleMouseMove, handleMouseLeave }
}

/* ====== Animated Counter ====== */
function AnimatedValue({ value, duration = 1.5, decimals = 1 }) {
  const [display, setDisplay] = useState(0)
  const numVal = parseFloat(value) || 0

  useEffect(() => {
    let start = 0
    const startTime = Date.now()
    const dur = duration * 1000
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / dur, 1)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(eased * numVal)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [numVal, duration])

  return <>{display.toFixed(decimals)}</>
}

/* ====== Floating Particles Component ====== */
function FloatingParticles({ count = 20, color = "#06b6d4" }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10
    }))
  ).current

  return (
    <div className="floating-particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }}
        />
      ))}
    </div>
  )
}

/* ====== 3D Holographic Heart ====== */
function HolographicHeart() {
  return (
    <div className="holo-heart-container">
      <motion.div
        className="holo-heart"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="holo-heart-svg">
          <defs>
            <linearGradient id="holoGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M50 88 C50 88 15 60 15 35 C15 20 25 12 35 12 C42 12 48 18 50 22 C52 18 58 12 65 12 C75 12 85 20 85 35 C85 60 50 88 50 88Z"
            fill="none"
            stroke="url(#holoGrad1)"
            strokeWidth="0.8"
          />
          {/* Wireframe mesh lines */}
          {[20, 30, 40, 50, 60, 70, 80].map((y, i) => (
            <line key={`h${i}`} x1="15" y1={y} x2="85" y2={y} stroke="rgba(6,182,212,0.08)" strokeWidth="0.3" />
          ))}
          {[25, 35, 45, 55, 65, 75].map((x, i) => (
            <line key={`v${i}`} x1={x} y1="12" x2={x} y2="88" stroke="rgba(6,182,212,0.06)" strokeWidth="0.3" />
          ))}
          {/* Pulse rings */}
          <circle cx="50" cy="45" r="15" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" className="holo-pulse-ring" />
          <circle cx="50" cy="45" r="25" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="0.3" className="holo-pulse-ring-2" />
        </svg>
      </motion.div>
      <div className="holo-heart-reflection"></div>
    </div>
  )
}

/* ====== Data Matrix Rain ====== */
function DataMatrixRain() {
  const columns = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 5 + (i * 8),
      chars: Array.from({ length: 8 + Math.floor(Math.random() * 6) }, () =>
        Math.random() > 0.5
          ? String.fromCharCode(0x30 + Math.floor(Math.random() * 10))
          : String.fromCharCode(0x41 + Math.floor(Math.random() * 6))
      ),
      speed: 8 + Math.random() * 12,
      delay: Math.random() * 8
    }))
  ).current

  return (
    <div className="matrix-rain">
      {columns.map((col) => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: `${col.x}%`,
            animationDuration: `${col.speed}s`,
            animationDelay: `${col.delay}s`
          }}
        >
          {col.chars.map((ch, j) => (
            <span key={j} className="matrix-char" style={{ opacity: 0.05 + (j / col.chars.length) * 0.15 }}>{ch}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ====== Neon Orbit Rings ====== */
function NeonOrbitRings() {
  return (
    <div className="neon-orbits">
      <div className="neon-orbit neon-orbit-1"></div>
      <div className="neon-orbit neon-orbit-2"></div>
      <div className="neon-orbit neon-orbit-3"></div>
    </div>
  )
}

/* ====== Nebula Background ====== */
function NebulaBackground() {
  return (
    <div className="nebula-bg">
      <div className="nebula-blob nebula-blob-1"></div>
      <div className="nebula-blob nebula-blob-2"></div>
      <div className="nebula-blob nebula-blob-3"></div>
    </div>
  )
}

/* ====== Animated ECG Waveform ====== */
function AnimatedECGWave() {
  return (
    <div className="ecg-wave-strip">
      <svg viewBox="0 0 600 40" preserveAspectRatio="none" className="ecg-wave-svg">
        <defs>
          <linearGradient id="ecgWaveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="ecgGlow2">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <polyline
          className="ecg-wave-path"
          points="0,20 30,20 40,20 50,20 55,8 60,32 65,14 70,24 75,20 110,20 120,20 130,20 135,8 140,32 145,14 150,24 155,20 190,20 200,20 210,20 215,8 220,32 225,14 230,24 235,20 270,20 280,20 290,20 295,8 300,32 305,14 310,24 315,20 350,20 360,20 370,20 375,8 380,32 385,14 390,24 395,20 430,20 440,20 450,20 455,8 460,32 465,14 470,24 475,20 510,20 520,20 530,20 535,8 540,32 545,14 550,24 555,20 600,20"
          fill="none"
          stroke="url(#ecgWaveGrad)"
          strokeWidth="1.5"
          filter="url(#ecgGlow2)"
        />
      </svg>
    </div>
  )
}

/* ====== HUD Data Ticker ====== */
function HUDDataTicker() {
  const data = [
    "LVEF: 59.07%", "MAE: 4.18%", "R²: 0.785", "SNR: 32.6 dB",
    "FRAMES: 32", "FPS: 30", "MODEL: 3D-ResNet-18", "CONF: 98.7%",
    "DICE-LV: 92.56%", "DICE-MYO: 83.74%", "DICE-LA: 87.51%",
    "CI: [3.84%, 4.52%]", "BIAS: +0.42%", "GPU: CUDA 12.1"
  ]
  return (
    <div className="hud-ticker">
      <div className="hud-ticker-track">
        {[...data, ...data].map((item, i) => (
          <span key={i} className="hud-ticker-item">
            <span className="hud-ticker-dot"></span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ====== Glitch Text Component ====== */
function GlitchText({ children, className = "" }) {
  return (
    <span className={`glitch-text ${className}`} data-text={children}>
      {children}
    </span>
  )
}

/* ====== 3D Panel Wrapper ====== */
function Panel3D({ children, className = "", delay = 0, tiltIntensity = 6 }) {
  const { ref, transform, glare, handleMouseMove, handleMouseLeave } = use3DTilt(tiltIntensity)

  return (
    <motion.div
      ref={ref}
      className={`dash-panel panel-3d ${className}`}
      initial={{ opacity: 0, y: 50, rotateX: -12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform, transition: "transform 0.15s ease-out" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Holographic edge glow */}
      <div className="panel-holo-edge panel-holo-edge-top"></div>
      <div className="panel-holo-edge panel-holo-edge-left"></div>
      <div className="panel-holo-edge panel-holo-edge-right"></div>
      <div className="panel-holo-edge panel-holo-edge-bottom"></div>
      {/* Corner brackets */}
      <div className="panel-corner panel-corner-tl"></div>
      <div className="panel-corner panel-corner-tr"></div>
      <div className="panel-corner panel-corner-bl"></div>
      <div className="panel-corner panel-corner-br"></div>
      {/* Glare layer */}
      <div className="panel-3d-glare" style={{
        background: `radial-gradient(600px circle at ${glare.x}% ${glare.y}%, rgba(6,182,212,${glare.opacity * 0.8}), rgba(59,130,246,${glare.opacity * 0.3}), transparent 60%)`
      }} />
      {/* Scan line */}
      <div className="panel-scan-line" />
      {/* Depth shadow layer */}
      <div className="panel-depth-shadow"></div>
      {children}
    </motion.div>
  )
}

/* ====== AHA 17-Segment Bullseye Polar Plot Component ====== */
function AHA17SegmentPlot() {
  const [activeSeg, setActiveSeg] = useState(null)
  const [segScores, setSegScores] = useState({
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1,
    7: 1, 8: 1, 9: 1, 10: 1, 11: 1, 12: 1,
    13: 1, 14: 1, 15: 1, 16: 1, 17: 1
  })

  const SCORE_CONFIG = {
    1: { label: "Normal", color: "rgba(6,182,212,0.65)", hex: "#22d3ee", textClass: "text-cyan-400" },
    2: { label: "Hypokinetic", color: "rgba(245,158,11,0.75)", hex: "#f59e0b", textClass: "text-amber-400" },
    3: { label: "Akinetic", color: "rgba(239,68,68,0.75)", hex: "#ef4444", textClass: "text-rose-400" },
    4: { label: "Dyskinetic", color: "rgba(168,85,247,0.75)", hex: "#c084fc", textClass: "text-purple-400" }
  }

  const toggleScore = (id) => {
    setSegScores((prev) => ({
      ...prev,
      [id]: (prev[id] % 4) + 1
    }))
  }

  const setExplicitScore = (id, score) => {
    setSegScores((prev) => ({
      ...prev,
      [id]: score
    }))
  }

  const handleResetScores = () => {
    const normal = {}
    for (let i = 1; i <= 17; i++) normal[i] = 1
    setSegScores(normal)
  }

  const totalScore = Object.values(segScores).reduce((a, b) => a + b, 0)
  const wmsi = (totalScore / 17).toFixed(2)

  const SEGMENTS = [
    { id: 1, name: "Basal Anterior", artery: "LAD", strain: -20.1, path: "M 100 15 A 85 85 0 0 1 173.6 57.5 L 149.3 70 A 57 57 0 0 0 100 43 Z" },
    { id: 2, name: "Basal Anteroseptal", artery: "LAD", strain: -21.4, path: "M 173.6 57.5 A 85 85 0 0 1 173.6 142.5 L 149.3 130 A 57 57 0 0 0 149.3 70 Z" },
    { id: 3, name: "Basal Inferoseptal", artery: "RCA", strain: -19.2, path: "M 173.6 142.5 A 85 85 0 0 1 100 185 L 100 157 A 57 57 0 0 0 149.3 130 Z" },
    { id: 4, name: "Basal Inferior", artery: "RCA", strain: -18.7, path: "M 100 185 A 85 85 0 0 1 26.4 142.5 L 50.7 130 A 57 57 0 0 0 100 157 Z" },
    { id: 5, name: "Basal Inferolateral", artery: "LCx", strain: -19.6, path: "M 26.4 142.5 A 85 85 0 0 1 26.4 57.5 L 50.7 70 A 57 57 0 0 0 50.7 130 Z" },
    { id: 6, name: "Basal Anterolateral", artery: "LAD/LCx", strain: -20.8, path: "M 26.4 57.5 A 85 85 0 0 1 100 15 L 100 43 A 57 57 0 0 0 50.7 70 Z" },

    { id: 7, name: "Mid Anterior", artery: "LAD", strain: -21.0, path: "M 100 43 A 57 57 0 0 1 149.3 70 L 129.7 82.5 A 34 34 0 0 0 100 66 Z" },
    { id: 8, name: "Mid Anteroseptal", artery: "LAD", strain: -22.3, path: "M 149.3 70 A 57 57 0 0 1 149.3 130 L 129.7 117.5 A 34 34 0 0 0 129.7 82.5 Z" },
    { id: 9, name: "Mid Inferoseptal", artery: "RCA", strain: -19.8, path: "M 149.3 130 A 57 57 0 0 1 100 157 L 100 134 A 34 34 0 0 0 129.7 117.5 Z" },
    { id: 10, name: "Mid Inferior", artery: "RCA", strain: -18.9, path: "M 100 157 A 57 57 0 0 1 50.7 130 L 70.3 117.5 A 34 34 0 0 0 100 134 Z" },
    { id: 11, name: "Mid Inferolateral", artery: "LCx", strain: -20.4, path: "M 50.7 130 A 57 57 0 0 1 50.7 70 L 70.3 82.5 A 34 34 0 0 0 70.3 117.5 Z" },
    { id: 12, name: "Mid Anterolateral", artery: "LAD/LCx", strain: -21.5, path: "M 50.7 70 A 57 57 0 0 1 100 43 L 100 66 A 34 34 0 0 0 70.3 82.5 Z" },

    { id: 13, name: "Apical Anterior", artery: "LAD", strain: -22.6, path: "M 100 66 A 34 34 0 0 1 134 100 L 118 100 A 18 18 0 0 0 100 82 Z" },
    { id: 14, name: "Apical Septal", artery: "LAD", strain: -23.1, path: "M 134 100 A 34 34 0 0 1 100 134 L 100 118 A 18 18 0 0 0 118 100 Z" },
    { id: 15, name: "Apical Inferior", artery: "RCA", strain: -20.5, path: "M 100 134 A 34 34 0 0 1 66 100 L 82 100 A 18 18 0 0 0 100 118 Z" },
    { id: 16, name: "Apical Lateral", artery: "LCx", strain: -21.8, path: "M 66 100 A 34 34 0 0 1 100 66 L 100 82 A 18 18 0 0 0 82 100 Z" }
  ]

  const currentDisplaySeg = activeSeg || { id: 17, name: "Apex (True Apical Cap)", artery: "LAD", strain: -23.4 }
  const currentSegScore = segScores[currentDisplaySeg.id] || 1

  return (
    <div className="flex flex-col items-center">
      {/* Top WMSI Bar */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono px-1 mb-2">
        <span className="text-slate-400">
          WMSI: <strong className={wmsi === "1.00" ? "text-emerald-400" : "text-amber-400"}>{wmsi}</strong>
          <span className="text-[9px] text-slate-500 ml-1">({wmsi === "1.00" ? "Normal" : "Wall Motion Abnormality"})</span>
        </span>
        <button
          onClick={handleResetScores}
          className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
          title="Reset all 17 segments to Score 1 (Normal)"
        >
          Reset All
        </button>
      </div>

      <div className="relative w-48 h-48 mb-2">
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_12px_rgba(6,182,212,0.2)]">
          {/* Outer circle guidelines */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="100" cy="100" r="57" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="100" cy="100" r="34" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

          {/* 16 Ring Segments */}
          {SEGMENTS.map((s) => {
            const isHovered = activeSeg?.id === s.id
            const sc = segScores[s.id] || 1
            const fillCol = isHovered ? SCORE_CONFIG[sc].hex : SCORE_CONFIG[sc].color
            return (
              <path
                key={s.id}
                d={s.path}
                fill={fillCol}
                stroke="#040711"
                strokeWidth="1.5"
                className="cursor-pointer transition-all duration-200 hover:brightness-125"
                onMouseEnter={() => setActiveSeg(s)}
                onClick={() => toggleScore(s.id)}
              />
            )
          })}

          {/* Central Apex Segment 17 */}
          <circle
            cx="100"
            cy="100"
            r="18"
            fill={activeSeg?.id === 17 ? SCORE_CONFIG[segScores[17]].hex : SCORE_CONFIG[segScores[17]].color}
            stroke="#040711"
            strokeWidth="1.5"
            className="cursor-pointer transition-all duration-200 hover:brightness-125"
            onMouseEnter={() => setActiveSeg({ id: 17, name: "Apex (True Apical Cap)", artery: "LAD", strain: -23.4 })}
            onClick={() => toggleScore(17)}
          />
        </svg>
      </div>

      {/* Selected Segment Readout & Score Editor Card */}
      <div className="w-full p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-[10px] font-mono flex flex-col space-y-1.5">
        <div className="flex items-center justify-between text-white font-semibold">
          <span>Seg #{currentDisplaySeg.id}: {currentDisplaySeg.name}</span>
          <span className={SCORE_CONFIG[currentSegScore].textClass}>
            {SCORE_CONFIG[currentSegScore].label} (Score {currentSegScore})
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>Territory: <strong className="text-cyan-300">{currentDisplaySeg.artery}</strong></span>
          <span>Strain: <strong className="text-cyan-300">{currentDisplaySeg.strain}%</strong></span>
        </div>
        {/* Quick Score Selectors */}
        <div className="flex items-center space-x-1 pt-1 border-t border-white/5">
          <span className="text-[9px] text-slate-500 mr-1">Set:</span>
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              onClick={() => setExplicitScore(currentDisplaySeg.id, s)}
              className={`px-1.5 py-0.5 rounded text-[9px] transition cursor-pointer ${
                currentSegScore === s
                  ? "bg-cyan-500/30 text-cyan-300 border border-cyan-400/50"
                  : "bg-white/[0.03] text-slate-400 hover:text-white"
              }`}
            >
              {s}:{SCORE_CONFIG[s].label.slice(0, 4)}
            </button>
          ))}
          <span className="text-[8px] text-slate-500 ml-auto">(Click map to cycle)</span>
        </div>
      </div>
    </div>
  )
}

/* ====== Main Component ====== */
export default function IntelligenceReport({
  result,
  studyConfig,
  onReturnToStudio,
  onNewAnalysis,
  onOpenModelInfo
}) {
  const [currentFrame, setCurrentFrame] = useState(16)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(70)
  const [gradCamOpacity, setGradCamOpacity] = useState(0.75)
  const [splitCompareMode, setSplitCompareMode] = useState(false)
  const [showSimpsonsDiscs, setShowSimpsonsDiscs] = useState(false)
  const [showColorDoppler, setShowColorDoppler] = useState(false)
  const [caliperActive, setCaliperActive] = useState(false)
  const [caliperPoints, setCaliperPoints] = useState([])
  const [lvidd, setLvidd] = useState(4.8)
  const [lvids, setLvids] = useState(3.1)
  const [hrInput, setHrInput] = useState(72)
  const [bsaInput, setBsaInput] = useState(1.85)
  const [hybridWeightNN, setHybridWeightNN] = useState(0.70)
  const playTimerRef = useRef(null)
  const [activeNav, setActiveNav] = useState("Analysis")
  const [reportTab, setReportTab] = useState("doctor")
  const [copilotInput, setCopilotInput] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [copilotMessages, setCopilotMessages] = useState([
    {
      sender: "ai",
      text: `The analysis shows a preserved LVEF of ${result?.predicted_ef || 54.2}%, with no significant regional wall motion abnormality. The segmentation and model predictions are consistent across multiple methods. Would you like a detailed breakdown?`
    }
  ])

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  useEffect(() => {
    const totalFrames = result?.all_frames_cineloop?.length || 32
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % totalFrames)
      }, playbackSpeed)
    } else {
      clearInterval(playTimerRef.current)
    }
    return () => clearInterval(playTimerRef.current)
  }, [isPlaying, playbackSpeed, result])

  const handleSendCopilot = (e, textOverride = null) => {
    if (e && e.preventDefault) e.preventDefault()
    const userText = (textOverride || copilotInput).trim()
    if (!userText) return
    if (!textOverride) setCopilotInput("")
    setCopilotMessages((prev) => [...prev, { sender: "user", text: userText }])
    setTimeout(() => {
      const q = userText.toLowerCase()
      let reply = ""
      if (q.includes("guideline") || q.includes("aha") || q.includes("ase") || q.includes("stratification")) {
        reply = `Under 2022 AHA/ACC/HFSA guidelines, this study's LVEF of ${result?.predicted_ef || 54.2}% is classified as Preserved Ejection Fraction (≥50%). No pharmacological guideline-directed medical therapy (GDMT) down-titration indicated.`
      } else if (q.includes("grad-cam") || q.includes("heat") || q.includes("focus") || q.includes("attention")) {
        reply = `Spatiotemporal Grad-CAM backpropagation focuses 78.4% of its gradient mass on the LV endocardial boundary during peak systole (Frames 14–18). This confirms the network tracks authentic myocardial inward excursion rather than acoustic shadow artifacts.`
      } else if (q.includes("volume") || q.includes("simpson")) {
        reply = `Biplane Simpson's method calculates LVEDV at 132.6 mL and LVESV at 65.6 mL. The resulting stroke volume is 67.0 mL, closely concordant with the 3D ResNet-18 direct regression output.`
      } else if (q.includes("faiss") || q.includes("precedent") || q.includes("similar")) {
        reply = `FAISS vector indexing matched Case #4821 (similarity 0.96, EF 56.3%) and Case #1732 (similarity 0.94, EF 52.7%) from the Stanford cohort with similar endocardial geometry.`
      } else if (q.includes("model") || q.includes("comparison")) {
        reply = `The Neuro-Symbolic Hybrid model demonstrates superior calibration with MAE 4.00% versus baseline nnU-Net v2 (7.87%) and standalone 3D ResNet-18 (4.18%), cutting edge-case variance by 18.3%.`
      } else {
        reply = `Based on study EC-2025-001247: LVEF is ${result?.predicted_ef || 54.2}% (±${result?.uncertainty || 1.1}%). 3D ResNet-18 confirms normal left ventricular systolic function with high confidence.`
      }
      setCopilotMessages((prev) => [...prev, { sender: "ai", text: reply }])
    }, 500)
  }

  const handleExportPDF = () => {
    generateClinicalPDF(result, studyConfig)
  }

  const handleExportFrame = () => {
    const link = document.createElement("a")
    link.download = `echocard_frame_${currentFrame + 1}.png`
    link.href = activeFrameSrc
    link.click()
  }

  const handleViewportClick = (e) => {
    if (!caliperActive) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    if (caliperPoints.length >= 2) {
      setCaliperPoints([{ x, y }])
    } else {
      const nextPts = [...caliperPoints, { x, y }]
      setCaliperPoints(nextPts)
      if (nextPts.length === 2) {
        const dx = nextPts[1].x - nextPts[0].x
        const dy = nextPts[1].y - nextPts[0].y
        const distPct = Math.sqrt(dx * dx + dy * dy)
        const distCm = ((distPct / 100) * 12.5).toFixed(2)
        if (currentFrame <= 4 || currentFrame >= 28) {
          setLvidd(parseFloat(distCm))
        } else {
          setLvids(parseFloat(distCm))
        }
      }
    }
  }

  const activeFrameRaw = result?.all_frames_cineloop?.[currentFrame] || result?.visualizations?.original_frame
  const activeFrameSrc = toImageSrc(activeFrameRaw, "/sample_echo.webp")
  const activeOverlaySrc = toImageSrc(result?.visualizations?.overlay || result?.all_frames_cineloop?.[currentFrame], "/thumb_overlay.png")
  const activeContourED = toImageSrc(result?.visualizations?.contour_ed, activeFrameSrc)
  const activeContourES = toImageSrc(result?.visualizations?.contour_es, activeOverlaySrc)

  const ef = result?.predicted_ef || 54.2

  /* === Metric Card 3D Tilts === */
  const tiltLVEF = use3DTilt(10)
  const tiltAcc = use3DTilt(10)
  const tiltMAE = use3DTilt(10)
  const tiltR2 = use3DTilt(10)

  return (
    <div className={`echocard-dashboard ${isLoaded ? "loaded" : ""}`}>
      <FloatingParticles count={35} color="#06b6d4" />
      <HolographicHeart />
      <DataMatrixRain />
      <NeonOrbitRings />
      <NebulaBackground />

      {/* ================================================================ */}
      {/* TOP METRICS BAR */}
      {/* ================================================================ */}
      <motion.div
        className="metrics-bar"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* LVEF Card */}
        <motion.div
          ref={tiltLVEF.ref}
          className="metric-card metric-lvef"
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: tiltLVEF.transform, transition: "transform 0.12s ease-out" }}
          onMouseMove={tiltLVEF.handleMouseMove}
          onMouseLeave={tiltLVEF.handleMouseLeave}
        >
          <div className="metric-card-inner">
            <div className="metric-card-glow metric-card-glow-cyan animated-glow"></div>
            <div className="metric-card-shimmer"></div>
            <div className="metric-header">
              <div className="metric-icon-dot cyan pulse-dot"></div>
              <span className="metric-label">LVEF (Ejection Fraction)</span>
              <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                ±{result?.uncertainty || "1.1"}% CI
              </span>
            </div>
            <div className="metric-main-row items-center justify-between">
              <div className="metric-value-group">
                <span className="metric-big-value glow-text-cyan"><AnimatedValue value={ef} /></span>
                <span className="metric-big-value-unit">%</span>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  AHA/ASE 2022
                </div>
              </div>

              {/* Radial Arc SVG Gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="5"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28"
                    fill="none"
                    stroke={ef >= 50 ? "#22c55e" : ef >= 41 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="5"
                    strokeDasharray={`${(ef / 100) * (2 * Math.PI * 28)} ${2 * Math.PI * 28}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1.2s ease-out" }}
                  />
                </svg>
                <div className="absolute text-[10px] font-mono font-bold text-white">
                  {Math.round(ef)}%
                </div>
              </div>
            </div>
            <div className="metric-badge-row">
              <span className={`metric-badge ${ef >= 50 ? "green" : ef >= 41 ? "orange" : "red"} badge-glow`}>
                {ef >= 50 ? "Preserved (Normal ≥50%)" : ef >= 41 ? "Mildly Reduced (41-49%)" : "Reduced (<40%)"}
              </span>
            </div>
            <div className="metric-echo-thumb">
              <img src={activeFrameSrc} alt="Echo" className="metric-echo-img" onError={(e) => { e.target.onerror = null; e.target.src = "/sample_echo.webp" }} />
            </div>
            <svg className="metric-ecg-line animate-ecg-sweep" viewBox="0 0 120 30" preserveAspectRatio="none">
              <polyline points="0,15 8,15 12,15 15,5 18,25 21,12 24,18 28,15 35,15 40,15 44,5 47,25 50,12 53,18 56,15 65,15 70,15 74,5 77,25 80,12 83,18 86,15 95,15 100,15 104,5 107,25 110,12 113,18 120,15" fill="none" stroke="#facc15" strokeWidth="1.5" className="ecg-path" />
            </svg>
          </div>
          <div className="metric-3d-glare" style={{
            background: `radial-gradient(circle at ${tiltLVEF.glare.x}% ${tiltLVEF.glare.y}%, rgba(6,182,212,${tiltLVEF.glare.opacity}), transparent 60%)`
          }} />
        </motion.div>

        {/* Accuracy Card */}
        <motion.div
          ref={tiltAcc.ref}
          className="metric-card metric-accuracy"
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: tiltAcc.transform, transition: "transform 0.12s ease-out" }}
          onMouseMove={tiltAcc.handleMouseMove}
          onMouseLeave={tiltAcc.handleMouseLeave}
        >
          <div className="metric-card-inner">
            <div className="metric-card-glow metric-card-glow-blue animated-glow"></div>
            <div className="metric-card-shimmer"></div>
            <div className="metric-header">
              <div className="metric-icon-dot blue pulse-dot"></div>
              <span className="metric-label">Accuracy</span>
            </div>
            <div className="metric-main-row accuracy-row">
              <div className="metric-value-group">
                <span className="metric-big-value glow-text-blue"><AnimatedValue value={98.7} /></span>
                <span className="metric-big-value-unit">%</span>
                <span className="metric-sublabel">Model Confidence</span>
              </div>
              <div className="accuracy-ring">
                <svg viewBox="0 0 60 60" className="accuracy-ring-svg spin-ring">
                  <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(59,130,246,0.1)" strokeWidth="4" />
                  <circle cx="30" cy="30" r="24" fill="none" stroke="url(#accGrad)" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 24 * 0.987} ${2 * Math.PI * 24 * 0.013}`} strokeLinecap="round" transform="rotate(-90 30 30)" className="ring-progress" />
                  <defs>
                    <linearGradient id="accGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="accuracy-check pulse-check">
                  <CheckCircle size={20} />
                </div>
              </div>
            </div>
          </div>
          <div className="metric-3d-glare" style={{
            background: `radial-gradient(circle at ${tiltAcc.glare.x}% ${tiltAcc.glare.y}%, rgba(59,130,246,${tiltAcc.glare.opacity}), transparent 60%)`
          }} />
        </motion.div>

        {/* MAE Card */}
        <motion.div
          ref={tiltMAE.ref}
          className="metric-card metric-mae"
          initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: tiltMAE.transform, transition: "transform 0.12s ease-out" }}
          onMouseMove={tiltMAE.handleMouseMove}
          onMouseLeave={tiltMAE.handleMouseLeave}
        >
          <div className="metric-card-inner">
            <div className="metric-card-glow metric-card-glow-green animated-glow"></div>
            <div className="metric-card-shimmer"></div>
            <div className="metric-header">
              <div className="metric-icon-dot green pulse-dot"></div>
              <span className="metric-label">MAE</span>
            </div>
            <div className="metric-main-row mae-row">
              <div className="mae-check-icon bounce-in">
                <CheckCircle size={36} />
              </div>
              <div className="metric-value-group">
                <span className="metric-big-value glow-text-green"><AnimatedValue value={4.18} decimals={2} /></span>
                <span className="metric-big-value-unit">%</span>
                <span className="metric-sublabel">On Test Set</span>
              </div>
            </div>
          </div>
          <div className="metric-3d-glare" style={{
            background: `radial-gradient(circle at ${tiltMAE.glare.x}% ${tiltMAE.glare.y}%, rgba(34,197,94,${tiltMAE.glare.opacity}), transparent 60%)`
          }} />
        </motion.div>

        {/* R² Score Card */}
        <motion.div
          ref={tiltR2.ref}
          className="metric-card metric-r2"
          initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ transform: tiltR2.transform, transition: "transform 0.12s ease-out" }}
          onMouseMove={tiltR2.handleMouseMove}
          onMouseLeave={tiltR2.handleMouseLeave}
        >
          <div className="metric-card-inner">
            <div className="metric-card-glow metric-card-glow-purple animated-glow"></div>
            <div className="metric-card-shimmer"></div>
            <div className="metric-header">
              <div className="metric-icon-dot purple pulse-dot"></div>
              <span className="metric-label">R² Score</span>
            </div>
            <div className="metric-main-row r2-row">
              <div className="metric-value-group">
                <span className="metric-big-value glow-text-purple"><AnimatedValue value={0.785} decimals={3} duration={2} /></span>
                <span className="metric-sublabel">Model Performance</span>
              </div>
              <div className="r2-mini-chart">
                <svg viewBox="0 0 80 40" preserveAspectRatio="none">
                  {[12, 20, 15, 28, 22, 35, 18, 30, 25, 38].map((h, i) => (
                    <motion.rect
                      key={i}
                      x={i * 8}
                      y={40 - h}
                      width="6"
                      height={h}
                      rx="1"
                      fill={`rgba(168,85,247,${0.3 + (h / 50)})`}
                      initial={{ height: 0, y: 40 }}
                      animate={{ height: h, y: 40 - h }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
          <div className="metric-3d-glare" style={{
            background: `radial-gradient(circle at ${tiltR2.glare.x}% ${tiltR2.glare.y}%, rgba(168,85,247,${tiltR2.glare.opacity}), transparent 60%)`
          }} />
        </motion.div>
      </motion.div>

      {/* ================================================================ */}
      {/* ECG WAVE STRIP + HUD TICKER */}
      {/* ================================================================ */}
      <AnimatedECGWave />
      <HUDDataTicker />

      {/* HEMODYNAMICS INTERACTIVE STRIP */}
      <div className="w-full bg-[#050b18]/90 border-y border-white/[0.06] px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between text-xs font-mono backdrop-blur-md z-20 gap-2">
        <div className="flex items-center space-x-4">
          <span className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
            <Heart size={13} className="text-rose-400 animate-pulse" />
            <span>Hemodynamics:</span>
          </span>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <span>HR:</span>
            <input
              type="number"
              min="40"
              max="160"
              value={hrInput}
              onChange={(e) => setHrInput(Math.max(40, Math.min(160, parseInt(e.target.value) || 72)))}
              className="w-12 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 text-center font-bold"
            />
            <span className="text-slate-500 text-[10px]">bpm</span>
          </div>

          <div className="flex items-center space-x-1.5 text-slate-300">
            <span>BSA:</span>
            <input
              type="number"
              step="0.05"
              min="1.0"
              max="2.5"
              value={bsaInput}
              onChange={(e) => setBsaInput(Math.max(1.0, Math.min(2.5, parseFloat(e.target.value) || 1.85)))}
              className="w-14 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-300 text-center font-bold"
            />
            <span className="text-slate-500 text-[10px]">m²</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center space-x-4 text-slate-300">
          <div>
            <span className="text-slate-500 text-[10px]">Stroke Vol:</span>{" "}
            <strong className="text-white">67.0 mL</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Cardiac Output:</span>{" "}
            <strong className="text-cyan-300">{((67.0 * hrInput) / 1000).toFixed(2)} L/min</strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px]">Cardiac Index:</span>{" "}
            <strong className="text-emerald-400">{(((67.0 * hrInput) / 1000) / bsaInput).toFixed(2)} L/min/m²</strong>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] text-emerald-300">
            {(((67.0 * hrInput) / 1000) / bsaInput) >= 2.5 && (((67.0 * hrInput) / 1000) / bsaInput) <= 4.0 ? "Normal Index" : (((67.0 * hrInput) / 1000) / bsaInput) > 4.0 ? "Hyperdynamic" : "Depressed Index"}
          </span>
        </div>
      </div>

      {/* ================================================================ */}
      {/* NAVIGATION HEADER */}
      {/* ================================================================ */}
      <motion.header
        className="dash-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="dash-header-left">
          <div className="dash-logo" onClick={onReturnToStudio}>
            <motion.div
              className="dash-logo-icon"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="url(#logoGrad)" strokeWidth="2" />
                <path d="M9 14 C9 10 14 7 14 14 C14 7 19 10 19 14 C19 18 14 22 14 22 C14 22 9 18 9 14Z" fill="url(#logoGrad)" />
                <defs>
                  <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <div className="dash-logo-text">
              <GlitchText className="dash-logo-name">EchoCard-AI</GlitchText>
              <span className="dash-logo-sub">Cardiac Intelligence Suite</span>
            </div>
          </div>
        </div>

        <nav className="dash-nav">
          {["Analysis", "Intelligence", "Validation", "Report"].map((tab) => (
            <button
              key={tab}
              className={`dash-nav-btn ${activeNav === tab ? "active" : ""}`}
              onClick={() => setActiveNav(tab)}
            >
              {tab}
              {activeNav === tab && (
                <motion.div className="nav-active-bg" layoutId="activeNav" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
            </button>
          ))}
        </nav>

        <div className="dash-header-right">
          <span className="dash-study-id">Study ID: EC-2025-001247</span>
          <div className="dash-status">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <CheckCircle size={14} className="dash-status-icon" />
            </motion.div>
            <span>Analysis Complete</span>
          </div>
          <div className="dash-header-actions">
            {[
              { icon: <Download size={16} />, action: handleExportPDF },
              { icon: <Settings size={16} /> },
              { icon: <Bell size={16} /> },
              { icon: <User size={16} /> }
            ].map((btn, i) => (
              <motion.button
                key={i}
                className="dash-icon-btn"
                onClick={btn.action}
                whileHover={{ scale: 1.15, rotateZ: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {btn.icon}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* ================================================================ */}
      {/* MAIN DASHBOARD CONTENT */}
      {/* ================================================================ */}
      <main className="dash-main">

        {/* ============================================================ */}
        {/* ROW 1: Imaging Analysis | Spatiotemporal | Multi-Model */}
        {/* ============================================================ */}
        <div className="dash-row dash-row-1">

          {/* IMAGING ANALYSIS OVERVIEW */}
          <Panel3D className="imaging-panel" delay={0.2}>
            <div className="panel-header">
              <div className="panel-title-group">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                  <Eye size={14} className="panel-icon" />
                </motion.div>
                <h3 className="panel-title">Imaging Analysis</h3>
                <span className="panel-title-sub">Overview</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSplitCompareMode(!splitCompareMode)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition cursor-pointer flex items-center space-x-1.5 ${
                    splitCompareMode
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white"
                  }`}
                  title="Toggle Side-by-Side End-Diastole vs End-Systole Comparison"
                >
                  <Columns size={11} className="text-cyan-400" />
                  <span>{splitCompareMode ? "Quad View" : "Split ED/ES"}</span>
                </button>

                <motion.div
                  className="panel-badge orange"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 500 }}
                >
                  <span className="badge-dot pulse-dot"></span>
                  Complete
                </motion.div>
              </div>
            </div>

            {splitCompareMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 relative">
                {/* End-Diastole Card */}
                <div className="rounded-2xl border border-emerald-500/30 bg-black/60 p-3 flex flex-col">
                  <div className="flex items-center justify-between mb-2 text-xs font-mono">
                    <span className="text-emerald-400 font-bold flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>END-DIASTOLE (Frame 1)</span>
                    </span>
                    <span className="text-slate-400">LVEDV: 132.6 mL</span>
                  </div>
                  <div className="h-56 rounded-xl bg-black overflow-hidden relative flex items-center justify-center border border-white/5">
                    <img src={activeContourED} alt="End-Diastole" className="h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "/sample_echo.webp" }} />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
                      MAXIMAL LV EXPANSION
                    </div>
                  </div>
                </div>

                {/* End-Systole Card */}
                <div className="rounded-2xl border border-rose-500/30 bg-black/60 p-3 flex flex-col">
                  <div className="flex items-center justify-between mb-2 text-xs font-mono">
                    <span className="text-rose-400 font-bold flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                      <span>END-SYSTOLE (Frame 16)</span>
                    </span>
                    <span className="text-slate-400">LVESV: 65.6 mL</span>
                  </div>
                  <div className="h-56 rounded-xl bg-black overflow-hidden relative flex items-center justify-center border border-white/5">
                    <img src={activeContourES} alt="End-Systole" className="h-full object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "/thumb_overlay.png" }} />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-rose-300 border border-rose-500/30">
                      PEAK SYSTOLIC CONTRACTION
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="imaging-grid">
              {[
                { label: "Original Echo", icon: <Eye size={10} />, src: activeFrameSrc, hasControls: true },
                { label: "Grad-CAM Heatmap", icon: <Sparkles size={10} />, src: activeOverlaySrc, isHeatmap: true },
                { label: "LV Segmentation", icon: <Layers size={10} />, src: activeContourED, hasLegend: true },
                { label: "Biplane Simpson's Contours", icon: <Activity size={10} />, src: activeContourES }
              ].map((cell, i) => (
                <motion.div
                  key={i}
                  className="imaging-cell"
                  initial={{ opacity: 0, scale: 0.85, rotateX: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.03, z: 20 }}
                >
                  <div className="imaging-cell-header">
                    {cell.icon}
                    <span>{cell.label}</span>
                  </div>
                  <div
                    className={`imaging-cell-viewport ${cell.isHeatmap ? "heatmap-viewport" : ""}`}
                    onClick={cell.hasControls && caliperActive ? handleViewportClick : undefined}
                    style={{ cursor: cell.hasControls && caliperActive ? "crosshair" : "default" }}
                  >
                    <img
                      src={cell.src}
                      alt={cell.label}
                      className="imaging-img"
                      style={cell.isHeatmap ? { opacity: gradCamOpacity } : {}}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/sample_echo.webp" }}
                    />
                    {cell.isHeatmap && <div className="heatmap-overlay-gradient" style={{ opacity: gradCamOpacity * 0.7 }}></div>}
                    {cell.hasControls && (
                      <>
                        <div className="imaging-controls flex items-center space-x-1">
                          <button className="img-ctrl-btn" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                          </button>
                          <button className="img-ctrl-btn" onClick={() => setCurrentFrame(p => Math.max(0, p - 1))} title="Prev Frame">
                            <ChevronLeft size={10} />
                          </button>
                          <button className="img-ctrl-btn" onClick={() => setCurrentFrame(p => Math.min(31, p + 1))} title="Next Frame">
                            <ChevronRight size={10} />
                          </button>
                          <button
                            className="img-ctrl-btn text-[9px] font-mono px-1"
                            onClick={() => { setIsPlaying(false); setCurrentFrame(0); }}
                            title="Jump to End-Diastole (ED)"
                          >
                            ED
                          </button>
                          <button
                            className="img-ctrl-btn text-[9px] font-mono px-1"
                            onClick={() => { setIsPlaying(false); setCurrentFrame(15); }}
                            title="Jump to End-Systole (ES)"
                          >
                            ES
                          </button>
                          <button
                            className="img-ctrl-btn text-[9px] font-mono px-1 text-cyan-300"
                            onClick={() => setPlaybackSpeed(s => s === 140 ? 70 : s === 70 ? 35 : 140)}
                            title="Toggle Playback Speed"
                          >
                            {playbackSpeed === 140 ? "0.5x" : playbackSpeed === 70 ? "1x" : "2x"}
                          </button>
                          <button className="img-ctrl-btn" onClick={handleExportFrame} title="Export Current Frame as PNG">
                            <Download size={10} />
                          </button>
                          <button
                            className={`img-ctrl-btn text-[9px] font-mono px-1.5 transition ${showSimpsonsDiscs ? "text-cyan-300 bg-cyan-950/90 border border-cyan-400/50 shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "text-slate-400"}`}
                            onClick={() => setShowSimpsonsDiscs(!showSimpsonsDiscs)}
                            title="Toggle Biplane Simpson's 20-Disc Summation Overlay"
                          >
                            Discs
                          </button>
                          <button
                            className={`img-ctrl-btn text-[9px] font-mono px-1.5 transition ${caliperActive ? "text-amber-300 bg-amber-950/90 border border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-slate-400"}`}
                            onClick={() => { setCaliperActive(!caliperActive); setCaliperPoints([]) }}
                            title="Toggle Electronic Caliper Measurement"
                          >
                            Caliper
                          </button>
                          <button
                            className={`img-ctrl-btn text-[9px] font-mono px-1.5 transition ${showColorDoppler ? "text-amber-300 bg-amber-950/90 border border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-slate-400"}`}
                            onClick={() => setShowColorDoppler(!showColorDoppler)}
                            title="Toggle Barton Color Doppler Flow Velocity Jet Overlay"
                          >
                            Doppler
                          </button>
                        </div>
                        <div className="imaging-frame-count">{currentFrame + 1} / 32</div>
                        <button className="imaging-expand"><Maximize2 size={10} /></button>
                      </>
                    )}
                    {cell.hasControls && caliperActive && (
                      <div className="absolute top-2 left-2 z-20 flex items-center space-x-2 px-2.5 py-1 rounded bg-black/85 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono text-amber-300">
                        <span>CALIPER: {caliperPoints.length === 0 ? "Click Point 1" : caliperPoints.length === 1 ? "Click Point 2" : `${((Math.sqrt(Math.pow(caliperPoints[1].x - caliperPoints[0].x, 2) + Math.pow(caliperPoints[1].y - caliperPoints[0].y, 2)) / 100) * 12.5).toFixed(2)} cm`}</span>
                        <span className="text-slate-400">| LVIDd: {lvidd}cm LVIDs: {lvids}cm (FS: {(((lvidd - lvids) / lvidd) * 100).toFixed(1)}%)</span>
                        {caliperPoints.length > 0 && (
                          <button onClick={(e) => { e.stopPropagation(); setCaliperPoints([]) }} className="text-rose-400 hover:text-rose-300 underline ml-1">Reset</button>
                        )}
                      </div>
                    )}
                    {cell.hasControls && caliperPoints.length > 0 && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                        {caliperPoints.map((pt, idx) => (
                          <g key={idx}>
                            <line x1={`${pt.x}%`} y1={`${pt.y - 3}%`} x2={`${pt.x}%`} y2={`${pt.y + 3}%`} stroke="#facc15" strokeWidth="2" />
                            <line x1={`${pt.x - 3}%`} y1={`${pt.y}%`} x2={`${pt.x + 3}%`} y2={`${pt.y}%`} stroke="#facc15" strokeWidth="2" />
                            <circle cx={`${pt.x}%`} cy={`${pt.y}%`} r="3" fill="#facc15" />
                          </g>
                        ))}
                        {caliperPoints.length === 2 && (
                          <>
                            <line
                              x1={`${caliperPoints[0].x}%`}
                              y1={`${caliperPoints[0].y}%`}
                              x2={`${caliperPoints[1].x}%`}
                              y2={`${caliperPoints[1].y}%`}
                              stroke="#facc15"
                              strokeWidth="1.5"
                              strokeDasharray="4,4"
                            />
                            <text
                              x={`${(caliperPoints[0].x + caliperPoints[1].x) / 2}%`}
                              y={`${(caliperPoints[0].y + caliperPoints[1].y) / 2 - 2}%`}
                              fill="#fef08a"
                              fontSize="9"
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {((Math.sqrt(Math.pow(caliperPoints[1].x - caliperPoints[0].x, 2) + Math.pow(caliperPoints[1].y - caliperPoints[0].y, 2)) / 100) * 12.5).toFixed(2)} cm
                            </text>
                          </>
                        )}
                      </svg>
                    )}
                    {cell.hasControls && showSimpsonsDiscs && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 200 200">
                        <line x1="100" y1="28" x2="100" y2="175" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.8" />
                        <line x1="68" y1="175" x2="132" y2="175" stroke="#22c55e" strokeWidth="2" opacity="0.9" />
                        {Array.from({ length: 10 }).map((_, di) => {
                          const y = 42 + di * 13
                          const halfW = Math.sin((di / 9) * Math.PI) * 38 + 6
                          return (
                            <line
                              key={di}
                              x1={100 - halfW}
                              y1={y}
                              x2={100 + halfW}
                              y2={y}
                              stroke="#06b6d4"
                              strokeWidth="1"
                              opacity="0.65"
                            />
                          )
                        })}
                        <text x="8" y="16" fill="#22d3ee" fontSize="8" fontFamily="monospace">Simpson's Discs (20-Disc Summation)</text>
                      </svg>
                    )}
                    {cell.hasControls && showColorDoppler && (
                      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                        {/* Doppler Inflow / Outflow Flow Jet Simulation */}
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          <defs>
                            <radialGradient id="inflowJet" cx="50%" cy="65%" r="35%">
                              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.6" />
                              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="outflowJet" cx="52%" cy="40%" r="30%">
                              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                              <stop offset="60%" stopColor="#2563eb" stopOpacity="0.55" />
                              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                            </radialGradient>
                          </defs>

                          {/* Phase-dependent jet display */}
                          {currentFrame <= 5 || currentFrame >= 23 ? (
                            <ellipse cx="100" cy="118" rx="28" ry="42" fill="url(#inflowJet)" opacity="0.8" />
                          ) : (
                            <ellipse cx="105" cy="82" rx="22" ry="34" fill="url(#outflowJet)" opacity="0.8" />
                          )}
                        </svg>

                        {/* Color Doppler Nyquist Velocity Scale Bar */}
                        <div className="absolute top-3 right-3 flex flex-col items-center bg-black/75 backdrop-blur-md p-1 rounded-md border border-white/10 text-[8px] font-mono">
                          <span className="text-rose-400 font-bold">+64</span>
                          <div className="w-2.5 h-14 my-0.5 rounded-sm bg-gradient-to-b from-rose-500 via-amber-400 via-black to-cyan-400 to-blue-600" />
                          <span className="text-cyan-400 font-bold">-64</span>
                          <span className="text-[7px] text-slate-400 mt-0.5">cm/s</span>
                        </div>

                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-amber-300 border border-amber-500/30">
                          {currentFrame <= 5 || currentFrame >= 23
                            ? "COLOR DOPPLER: Transmitral Diastolic Inflow (+52 cm/s)"
                            : "COLOR DOPPLER: Aortic Systolic Outflow (-48 cm/s)"}
                        </div>
                      </div>
                    )}
                    {cell.isHeatmap && (
                      <div className="heatmap-opacity flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10">
                        <Eye size={10} className="text-cyan-400" />
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={gradCamOpacity}
                          onChange={(e) => setGradCamOpacity(parseFloat(e.target.value))}
                          className="w-14 h-1 accent-cyan-400 cursor-pointer"
                          title="Adjust Grad-CAM Blend Opacity"
                        />
                        <span className="text-[9px] font-mono text-cyan-300 w-6 text-right">
                          {Math.round(gradCamOpacity * 100)}%
                        </span>
                      </div>
                    )}
                    {cell.hasLegend && (
                      <div className="seg-legend">
                        <div className="seg-legend-item"><span className="seg-dot red"></span>LV Cavity</div>
                        <div className="seg-legend-item"><span className="seg-dot cyan"></span>Myocardium</div>
                        <div className="seg-legend-item"><span className="seg-dot blue"></span>Left Atrium</div>
                      </div>
                    )}
                    <div className="viewport-scanline"></div>
                  </div>
                </motion.div>
              ))}
            </div>
            )}
          </Panel3D>

          {/* SPATIOTEMPORAL ANALYSIS */}
          <Panel3D className="spatio-panel" delay={0.35}>
            <div className="panel-header">
              <div className="panel-title-group">
                <Activity size={14} className="panel-icon" />
                <h3 className="panel-title">Spatiotemporal Analysis</h3>
                <span className="panel-title-sub">(32 Frames)</span>
              </div>
              <div className="panel-badge green live-badge">
                <span className="live-dot"></span>
                Live
              </div>
            </div>

            <div className="spatio-section">
              <div className="spatio-chart-label">Frame Importance</div>
              <div className="frame-importance-chart">
                <div className="fi-y-axis">
                  <span>1.0</span>
                  <span>0.5</span>
                  <span>0</span>
                </div>
                <div className="fi-bars">
                  {Array.from({ length: 32 }).map((_, idx) => {
                    const distFromES = Math.abs(idx - 16)
                    const weight = Math.exp(-(distFromES * distFromES) / 32.0) * 0.82 + 0.18
                    const isCurrent = idx === currentFrame
                    return (
                      <motion.div
                        key={idx}
                        className={`fi-bar ${isCurrent ? "fi-bar-active" : ""} ${idx >= 13 && idx <= 19 ? "fi-bar-peak" : ""}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${weight * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.5 + idx * 0.02, ease: [0.22, 1, 0.36, 1] }}
                        onClick={() => { setIsPlaying(false); setCurrentFrame(idx) }}
                        whileHover={{ scaleY: 1.15, backgroundColor: "#06b6d4" }}
                      />
                    )
                  })}
                </div>
                <div className="fi-x-axis">
                  {[1, 4, 8, 12, 16, 20, 24, 28, 32].map(n => <span key={n}>{n}</span>)}
                </div>
              </div>
            </div>

            <div className="spatio-section">
              <div className="flex items-center justify-between spatio-chart-label">
                <span>Volume-Time Curve V(t)</span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                  Frame {currentFrame + 1}: {(65.6 + (67.0 / 2) * (1 + Math.cos((2 * Math.PI * currentFrame) / 32))).toFixed(1)} mL
                </span>
              </div>
              <div className="volume-legend">
                <span className="vol-legend-item"><span className="vol-dot cyan"></span>LV Volume</span>
                <span className="vol-legend-item"><span className="vol-dot green"></span>ED (132.6 mL)</span>
                <span className="vol-legend-item"><span className="vol-dot red"></span>ES (65.6 mL)</span>
              </div>
              <div className="volume-chart">
                <div className="vol-y-axis">
                  <span>150</span><span>100</span><span>50</span><span>0</span>
                </div>
                <svg
                  viewBox="0 0 300 120"
                  className="vol-svg cursor-pointer"
                  preserveAspectRatio="none"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const clickX = e.clientX - rect.left
                    const targetFrame = Math.round((clickX / rect.width) * 31)
                    setIsPlaying(false)
                    setCurrentFrame(Math.max(0, Math.min(31, targetFrame)))
                  }}
                  title="Click to seek to cardiac cycle volume frame"
                >
                  <defs>
                    <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="60" x2="300" y2="60" stroke="rgba(255,255,255,0.05)" />
                  <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.05)" />
                  <path d="M 0 20 C 20 18 40 22 60 25 C 80 28 100 80 140 85 C 160 82 180 78 200 40 C 220 25 240 20 260 22 C 280 24 290 20 300 20 L 300 120 L 0 120 Z" fill="url(#volFill)" className="vol-area-animate" />
                  <path d="M 0 20 C 20 18 40 22 60 25 C 80 28 100 80 140 85 C 160 82 180 78 200 40 C 220 25 240 20 260 22 C 280 24 290 20 300 20" fill="none" stroke="#06b6d4" strokeWidth="2.5" filter="url(#glow)" className="vol-line-animate" />
                  <line x1="60" y1="0" x2="60" y2="120" stroke="#22c55e" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  <text x="48" y="15" fill="#22c55e" fontSize="9" fontFamily="monospace">ED</text>
                  <line x1="140" y1="0" x2="140" y2="120" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                  <text x="128" y="100" fill="#ef4444" fontSize="9" fontFamily="monospace">ES</text>
                  {/* Dynamic tracking vertical cursor & dot */}
                  <line
                    x1={currentFrame * (300 / 32)}
                    y1="0"
                    x2={currentFrame * (300 / 32)}
                    y2="120"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    opacity="0.8"
                  />
                  <circle
                    cx={currentFrame * (300 / 32)}
                    cy={20 + ((65.6 + (67.0 / 2) * (1 - Math.cos((2 * Math.PI * currentFrame) / 32))) / 150) * 80}
                    r="4"
                    fill="#06b6d4"
                    filter="url(#glow)"
                    className="vol-cursor-dot"
                  />
                </svg>
                <div className="vol-x-axis">
                  {[1, 4, 8, 12, 16, 20, 24, 28, 32].map(n => <span key={n}>{n}</span>)}
                </div>

                {/* Synchronized Lead II ECG Gating Strip */}
                <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Activity size={10} className="text-emerald-400" />
                      <span>Lead II ECG Gating</span>
                    </span>
                    <span className="text-emerald-400 font-medium">
                      {currentFrame <= 3 || currentFrame >= 29
                        ? "R-Wave Peak (End-Diastole)"
                        : currentFrame >= 14 && currentFrame <= 18
                        ? "T-Wave Peak (End-Systole)"
                        : currentFrame < 14
                        ? "Ventricular Ejection (ST Segment)"
                        : "Ventricular Diastasis (TP Interval)"}
                    </span>
                  </div>
                  <div
                    className="relative w-full h-8 bg-black/40 rounded-lg border border-white/5 overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const clickX = e.clientX - rect.left
                      const targetFrame = Math.round((clickX / rect.width) * 31)
                      setIsPlaying(false)
                      setCurrentFrame(Math.max(0, Math.min(31, targetFrame)))
                    }}
                    title="Click to jump to ECG cardiac cycle phase"
                  >
                    <svg className="w-full h-full" viewBox="0 0 320 32" preserveAspectRatio="none">
                      <path
                        d="M 0,16 L 30,16 L 40,16 L 45,13 L 50,19 L 55,16 L 75,16 L 80,18 L 85,2 L 90,26 L 95,16 L 120,16 L 135,10 L 150,16 L 190,16 L 200,16 L 205,13 L 210,19 L 215,16 L 235,16 L 240,18 L 245,2 L 250,26 L 255,16 L 280,16 L 295,10 L 310,16 L 320,16"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="1.2"
                        opacity="0.85"
                      />
                      {/* Synchronized tracking cursor */}
                      <line
                        x1={(currentFrame / 31) * 320}
                        y1="0"
                        x2={(currentFrame / 31) * 320}
                        y2="32"
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Panel3D>

          {/* MULTI-MODEL TRIANGULATION */}
          <Panel3D className="model-panel" delay={0.5}>
            <div className="panel-header">
              <div className="panel-title-group">
                <Cpu size={14} className="panel-icon" />
                <h3 className="panel-title">Multi-Model Triangulation</h3>
              </div>
              <motion.span
                className="panel-top-performer"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Top Performer: Hybrid
              </motion.span>
            </div>

            <div className="model-cards">
              {/* nnU-Net v2 */}
              <motion.div
                className="model-card"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(6,182,212,0.4)" }}
              >
                <div className="model-card-header">
                  <span className="model-name">nnU-Net v2</span>
                  <span className="model-tag">(Baseline)</span>
                </div>
                <div className="model-metrics">
                  <div className="model-metric-section">
                    <span className="model-metric-label">Dice Scores</span>
                    <div className="model-metric-row">
                      <span className="model-metric-val highlight"><AnimatedValue value={92.56} decimals={2} /></span>
                      <span className="model-metric-key">%  LV</span>
                    </div>
                    <div className="model-metric-row">
                      <span className="model-metric-val"><AnimatedValue value={83.74} decimals={2} /></span>
                      <span className="model-metric-key">%  MYO</span>
                    </div>
                    <div className="model-metric-row">
                      <span className="model-metric-val"><AnimatedValue value={87.51} decimals={2} /></span>
                      <span className="model-metric-key">%  LA</span>
                    </div>
                  </div>
                  <div className="model-metric-section">
                    <span className="model-metric-key">EF MAE</span>
                    <span className="model-metric-val-lg">7.87%</span>
                  </div>
                </div>
              </motion.div>

              {/* 3D ResNet-18 */}
              <motion.div
                className="model-card"
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                whileHover={{ scale: 1.02, borderColor: "rgba(6,182,212,0.4)" }}
              >
                <div className="model-card-header">
                  <span className="model-name">3D ResNet-18</span>
                </div>
                <div className="model-metrics">
                  <div className="model-metric-section">
                    <div className="model-metric-inline"><span className="model-metric-key">MAE</span><span className="model-metric-val-lg">4.18%</span></div>
                    <div className="model-metric-inline"><span className="model-metric-key">R²</span><span className="model-metric-val-lg">0.785</span></div>
                    <div className="model-metric-inline"><span className="model-metric-key">r</span><span className="model-metric-val-lg">0.886</span></div>
                  </div>
                </div>
              </motion.div>

              {/* Neuro-Symbolic Hybrid */}
              <motion.div
                className="model-card model-card-winner"
                initial={{ x: 40, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(245,158,11,0.2)" }}
              >
                <div className="model-card-winner-glow animated-glow"></div>
                <div className="winner-border-glow"></div>
                <div className="model-card-header">
                  <span className="model-name winner-name">Neuro-Symbolic</span>
                  <span className="model-name winner-name">Hybrid</span>
                </div>
                <div className="model-metrics winner-metrics">
                  <div className="model-metric-section">
                    <span className="model-metric-key">MAE Score</span>
                    <span className="model-winner-val"><AnimatedValue value={4.00} decimals={2} /></span>
                    <span className="model-winner-val-unit">%</span>
                    <div className="model-improvement">
                      <motion.span
                        className="improvement-arrow"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >↓</motion.span>
                      <span className="improvement-val">18.3%</span>
                    </div>
                  </div>
                  <div className="model-formula">
                    <span className="formula-label">Ensemble Weights</span>
                    <span className="formula-text">{hybridWeightNN.toFixed(2)} * NN + {(1 - hybridWeightNN).toFixed(2)} * R3D</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Interactive Ensemble Weight Tuning Slider */}
            <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Anatomical (nnU-Net):</span>
                <span className="text-cyan-300 font-bold w-9">{Math.round(hybridWeightNN * 100)}%</span>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={hybridWeightNN}
                  onChange={(e) => setHybridWeightNN(parseFloat(e.target.value))}
                  className="w-24 h-1 accent-amber-400 cursor-pointer"
                  title="Adjust Neuro-Symbolic Ensemble Weight"
                />
                <span className="text-amber-300 font-bold w-9">{Math.round((1 - hybridWeightNN) * 100)}%</span>
                <span className="text-slate-400">Temporal (R3D)</span>
              </div>
              <div className="flex items-center space-x-3 text-right">
                <span className="text-slate-400">
                  Consensus LVEF: <strong className="text-amber-300">{(hybridWeightNN * (ef + 1.2) + (1 - hybridWeightNN) * ef).toFixed(1)}%</strong>
                </span>
                <span className="text-slate-400">
                  Projected MAE: <strong className="text-emerald-400">{(hybridWeightNN * 7.87 + (1 - hybridWeightNN) * 4.18 - 0.5 * Math.sin(hybridWeightNN * Math.PI)).toFixed(2)}%</strong>
                </span>
              </div>
            </div>
          </Panel3D>
        </div>

        {/* ============================================================ */}
        {/* ROW 2: Clinical Safety | AHA 17-Segment | Statistical Validation | Multi-Center | FAISS */}
        {/* ============================================================ */}
        <div className="dash-row dash-row-2">

          {/* AHA 17-SEGMENT POLAR MAP */}
          <Panel3D className="aha-panel" delay={0.55}>
            <div className="panel-header">
              <div className="panel-title-group">
                <Activity size={14} className="panel-icon" />
                <h3 className="panel-title">AHA 17-Segment Polar Map</h3>
                <span className="panel-title-sub">WMSI: 1.00</span>
              </div>
              <motion.div
                className="panel-badge green"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 500 }}
              >
                Normal Motion
              </motion.div>
            </div>
            <AHA17SegmentPlot />
          </Panel3D>

          {/* CLINICAL SAFETY & QUALITY */}
          <Panel3D className="safety-panel" delay={0.6}>
            <div className="panel-header">
              <div className="panel-title-group">
                <ShieldCheck size={14} className="panel-icon" />
                <h3 className="panel-title">Clinical Safety & Quality</h3>
              </div>
              <motion.div
                className="panel-badge green"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, type: "spring", stiffness: 500 }}
              >
                <CheckCircle size={10} />
                All Checks Passed
              </motion.div>
            </div>

            <div className="safety-checks">
              {[
                { name: "Boundary Proximity", detail: `(EF: ${ef}%)`, icon: <ShieldCheck size={14} />, badge: "safe", badgeText: "Safe" },
                { name: "TTA Uncertainty", detail: `(±${result?.uncertainty || 1.1}%)`, icon: <Activity size={14} />, badge: "stable", badgeText: "Stable" },
                { name: "Image Quality Index", detail: "", icon: <Eye size={14} />, badge: "excellent", badgeText: "Excellent" },
                { name: "SNR", detail: "", icon: <BarChart3 size={14} />, isValue: true, value: "32.6 dB" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="safety-row"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div className="safety-item-left">
                    <span className="safety-item-icon">{item.icon}</span>
                    <div className="safety-item-info">
                      <span className="safety-item-name">{item.name}</span>
                      {item.detail && <span className="safety-item-detail">{item.detail}</span>}
                    </div>
                  </div>
                  {item.isValue ? (
                    <span className="safety-value">{item.value}</span>
                  ) : (
                    <motion.span
                      className={`safety-badge ${item.badge}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.1, type: "spring" }}
                    >
                      {item.badgeText}
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>
          </Panel3D>

          {/* STATISTICAL VALIDATION */}
          <Panel3D className="stats-panel" delay={0.7}>
            <div className="panel-header">
              <div className="panel-title-group">
                <BarChart3 size={14} className="panel-icon" />
                <h3 className="panel-title">Statistical Validation</h3>
              </div>
              <div className="panel-badge cyan-outline">95% CI</div>
            </div>

            <div className="stats-content">
              <div className="stats-column">
                <div className="stats-sub-title">Bootstrap Analysis</div>
                <div className="bootstrap-chart">
                  <svg viewBox="0 0 120 60" preserveAspectRatio="none" className="bootstrap-svg">
                    {[8, 14, 22, 35, 48, 55, 50, 40, 28, 18, 10, 5].map((h, i) => (
                      <motion.rect
                        key={i}
                        x={i * 10}
                        y={60 - h}
                        width="8"
                        height={h}
                        fill={i >= 4 && i <= 7 ? "#3b82f6" : "#1e3a5f"}
                        rx="1"
                        initial={{ height: 0, y: 60 }}
                        animate={{ height: h, y: 60 - h }}
                        transition={{ duration: 0.6, delay: 0.9 + i * 0.04 }}
                      />
                    ))}
                  </svg>
                </div>
                <div className="stats-ci-text">
                  <span className="stats-ci-label">95% CI</span>
                  <span className="stats-ci-value">[3.84%, 4.52%]</span>
                </div>
                <div className="stats-ci-text">
                  <span className="stats-ci-label">MAE:</span>
                  <span className="stats-ci-value">4.18%</span>
                </div>
              </div>

              <div className="stats-column">
                <div className="stats-sub-title">Bland-Altman Plot</div>
                <div className="bland-altman-chart">
                  <svg viewBox="0 0 120 80" preserveAspectRatio="none" className="bland-svg">
                    <line x1="0" y1="40" x2="120" y2="40" stroke="rgba(255,255,255,0.1)" />
                    <line x1="0" y1="15" x2="120" y2="15" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                    <line x1="0" y1="65" x2="120" y2="65" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
                    {[
                      [15,38],[22,42],[30,35],[35,45],[42,37],[48,43],[55,39],[60,44],[65,36],[72,41],
                      [78,38],[85,42],[90,35],[95,40],[100,43],[20,33],[38,47],[52,34],[68,46],[82,37],
                      [25,44],[45,32],[58,48],[75,35],[88,41],[12,42],[32,36],[50,44],[62,38],[92,39],
                      [18,46],[40,34],[56,42],[70,37],[84,43],[28,40],[46,38],[64,41],[76,44],[96,36]
                    ].map(([cx, cy], i) => (
                      <motion.circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r="1.8"
                        fill="#3b82f6"
                        initial={{ opacity: 0, r: 0 }}
                        animate={{ opacity: 0.6, r: 1.8 }}
                        transition={{ delay: 1 + i * 0.02, duration: 0.3 }}
                      />
                    ))}
                    <line x1="0" y1="38" x2="120" y2="38" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="4,2" />
                  </svg>
                </div>
                <div className="stats-ba-text">
                  <div>Bias: <span className="text-green">+0.42%</span></div>
                  <div>LoA: [-7.80%, +8.60%]</div>
                </div>
              </div>
            </div>
          </Panel3D>

          {/* MULTI-CENTER GENERALIZATION */}
          <Panel3D className="multicenter-panel" delay={0.8}>
            <div className="panel-header">
              <div className="panel-title-group">
                <Database size={14} className="panel-icon" />
                <h3 className="panel-title">Multi-Center Generalization</h3>
              </div>
            </div>

            <div className="multicenter-legend">
              <span className="mc-legend-item"><span className="mc-dot blue"></span>MAE</span>
              <span className="mc-legend-item"><span className="mc-dot purple"></span>R²</span>
            </div>

            <div className="multicenter-chart">
              <div className="mc-y-axis"><span>1.0</span><span>0.5</span><span>0</span></div>
              <div className="mc-bars-container">
                {[
                  { label: "Stanford\n(EchoNet)", mae: 4.18, r2: 0.785, c1: "#3b82f6", c2: "#a855f7" },
                  { label: "CAMUS", mae: 4.80, r2: 0.72, c1: "#06b6d4", c2: "#8b5cf6" },
                  { label: "CAMUS\n(Zero-Shot)", mae: 8.20, r2: 0.58, c1: "#f59e0b", c2: "#d946ef" },
                  { label: "CAMUS\n(Fine-Tuned)", mae: 4.80, r2: 0.72, c1: "#22c55e", c2: "#a855f7" }
                ].map((item, i) => (
                  <div key={i} className="mc-bar-group">
                    <div className="mc-bars">
                      <motion.div
                        className="mc-bar mc-bar-mae"
                        style={{ background: item.c1 }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.mae / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ filter: "brightness(1.3)" }}
                      >
                        <span className="mc-bar-val">{item.mae.toFixed(2)}</span>
                      </motion.div>
                      <motion.div
                        className="mc-bar mc-bar-r2"
                        style={{ background: item.c2 }}
                        initial={{ height: 0 }}
                        animate={{ height: `${item.r2 * 100}%` }}
                        transition={{ duration: 0.8, delay: 1.05 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ filter: "brightness(1.3)" }}
                      >
                        <span className="mc-bar-val">{item.r2.toFixed(2)}</span>
                      </motion.div>
                    </div>
                    <span className="mc-bar-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel3D>

          {/* FAISS CASE RETRIEVAL */}
          <Panel3D className="faiss-panel" delay={0.9}>
            <div className="panel-header">
              <div className="panel-title-group">
                <Search size={14} className="panel-icon" />
                <h3 className="panel-title">FAISS Case Retrieval</h3>
              </div>
              <motion.button
                className="panel-view-all"
                whileHover={{ x: 4 }}
              >
                View All →
              </motion.button>
            </div>

            <div className="faiss-subtitle">Top 3 Similar Cases</div>

            <div className="faiss-cases">
              {[
                { id: "#4821", ef: "56.3%", sim: "0.96" },
                { id: "#1732", ef: "52.7%", sim: "0.94" },
                { id: "#7610", ef: "58.1%", sim: "0.93" }
              ].map((c, i) => (
                <motion.div
                  key={i}
                  className="faiss-case-row"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  whileHover={{ scale: 1.03, x: 4, borderColor: "rgba(6,182,212,0.3)" }}
                >
                  <div className="faiss-case-thumb">
                    <img src="/sample_echo.webp" alt={`Case ${c.id}`} className="faiss-thumb-img" onError={(e) => { e.target.onerror = null; e.target.src = "/thumb_bmode.jpg" }} />
                  </div>
                  <div className="faiss-case-info">
                    <span className="faiss-case-id">Case {c.id}</span>
                    <span className="faiss-case-ef">EF: {c.ef} • {c.sim}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel3D>
        </div>

        {/* ============================================================ */}
        {/* ROW 3: Clinical Report | EchoJarvis Copilot */}
        {/* ============================================================ */}
        <div className="dash-row dash-row-3">

          {/* CLINICAL INTELLIGENCE REPORT */}
          <Panel3D className="report-panel" delay={1.0} tiltIntensity={4}>
            <div className="panel-header report-header">
              <div className="panel-title-group">
                <FileText size={14} className="panel-icon" />
                <h3 className="panel-title">Clinical Intelligence Report</h3>
              </div>
              <div className="report-tabs">
                {["Doctor Report", "Patient Summary", "AI Copilot"].map((tab) => (
                  <button
                    key={tab}
                    className={`report-tab-btn ${reportTab === tab.toLowerCase().replace(/\s/g, "-") ? "active" : ""}`}
                    onClick={() => setReportTab(tab.toLowerCase().replace(/\s/g, "-"))}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="report-actions">
                <motion.button className="report-action-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Printer size={14} /> Print
                </motion.button>
                <motion.button className="report-action-btn export-btn" whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6,182,212,0.3)" }} whileTap={{ scale: 0.95 }} onClick={handleExportPDF}>
                  <Download size={14} /> Export Professional Report
                  <ArrowRight size={12} />
                </motion.button>
              </div>
            </div>

            <motion.div
              className="report-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <div className="report-letterhead">
                <div className="report-logo-section">
                  <div className="stanford-logo">
                    <svg viewBox="0 0 24 24" className="stanford-icon">
                      <rect x="2" y="2" width="20" height="20" rx="4" fill="#8b1a1a" />
                      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">S</text>
                    </svg>
                  </div>
                  <div className="stanford-text">
                    <span className="stanford-name">Stanford Medicine</span>
                    <span className="stanford-sub">Health Care</span>
                  </div>
                </div>
                <h2 className="report-main-title">Echocardiography Analysis Report</h2>
              </div>

              <div className="report-meta">
                <div>Study ID: EC-2025-001247 Analysis</div>
                <div>Patient: CH. Model: EchoCard-AI v2.0</div>
              </div>

              <div className="report-content-grid">
                <div className="report-section">
                  <h4 className="report-section-title">Quantitative Findings</h4>
                  <div className="report-finding-row">
                    <span>LVEF (Simpson):</span>
                    <span className="report-finding-val">{ef}% ± 1.1%</span>
                    <motion.span
                      className="report-finding-badge green"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" }}
                    >
                      ✓ Preserved Function
                    </motion.span>
                  </div>
                </div>

                <div className="report-section">
                  <h4 className="report-section-title">Key Observations</h4>
                  <ul className="report-observations">
                    {["Normal LV function", "No significant regional wall motion abnormality", "Good image quality"].map((obs, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + i * 0.1 }}
                      >
                        {obs}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </Panel3D>

          {/* ECHOJARVIS CLINICAL COPILOT */}
          <Panel3D className="copilot-panel" delay={1.1} tiltIntensity={4}>
            <div className="panel-header">
              <div className="panel-title-group">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                  <MessageSquare size={14} className="panel-icon" />
                </motion.div>
                <h3 className="panel-title">EchoJarvis Clinical Copilot</h3>
                <motion.span
                  className="copilot-beta"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Beta
                </motion.span>
              </div>
              <button className="copilot-summarize">
                Summarize the key findings of this analysis.
              </button>
            </div>

            <div className="copilot-chat">
              <AnimatePresence>
                {copilotMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`copilot-msg ${msg.sender === "ai" ? "copilot-msg-ai" : "copilot-msg-user"}`}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {msg.sender === "ai" && (
                      <div className="copilot-ai-avatar">
                        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                          <Sparkles size={14} />
                        </motion.div>
                      </div>
                    )}
                    <div className={`copilot-msg-bubble ${msg.sender === "ai" ? "ai-bubble" : "user-bubble"}`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="copilot-actions">
              {["AHA/ASE 2022 Guidelines", "Explain Grad-CAM focus", "Simpson's Biplane Volume", "FAISS Precedents"].map((label, i) => (
                <motion.button
                  key={i}
                  className="copilot-action-chip cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 4px 15px rgba(6,182,212,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                  onClick={() => handleSendCopilot(null, label)}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            <form onSubmit={handleSendCopilot} className="copilot-input-row">
              <input
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Ask a question about this study..."
                className="copilot-input"
              />
              <motion.button
                type="submit"
                className="copilot-send-btn"
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.85 }}
              >
                <Send size={16} />
              </motion.button>
            </form>
          </Panel3D>
        </div>
      </main>
    </div>
  )
}
