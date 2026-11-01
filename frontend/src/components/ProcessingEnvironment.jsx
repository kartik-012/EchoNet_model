import React, { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Activity, AlertTriangle, ArrowLeft, CheckCircle2, Cpu, Sparkles } from "lucide-react"
import { runPredictionOnFile, runPredictionOnSample } from "../services/api"

const STAGES = [
  { id: 1, label: "Input Validation & SNR Calibration" },
  { id: 2, label: "32-Frame Spatiotemporal Tensor Sampling" },
  { id: 3, label: "PyTorch 3D ResNet-18 Ejection Fraction Inference" },
  { id: 4, label: "Simpson's Biplane Endocardial Contour Extraction" },
  { id: 5, label: "3D Grad-CAM Attention Heatmap Backpropagation" },
  { id: 6, label: "FAISS Precedent Retrieval & Report Synthesis" }
]

export default function ProcessingEnvironment({
  analysisPayload,
  onAnalysisSuccess,
  onAnalysisError,
  onCancel
}) {
  const [currentStage, setCurrentStage] = useState(1)
  const [progressPercent, setProgressPercent] = useState(15)
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    let isCancelled = false

    async function execute() {
      try {
        // Stage 1
        setCurrentStage(1)
        setProgressPercent(18)
        await new Promise((r) => setTimeout(r, 280))

        // Stage 2
        if (isCancelled) return
        setCurrentStage(2)
        setProgressPercent(35)
        await new Promise((r) => setTimeout(r, 300))

        // Stage 3: Real Backend Inference
        if (isCancelled) return
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

        // Stage 4
        if (isCancelled) return
        setCurrentStage(4)
        setProgressPercent(72)
        await new Promise((r) => setTimeout(r, 260))

        // Stage 5
        if (isCancelled) return
        setCurrentStage(5)
        setProgressPercent(88)
        await new Promise((r) => setTimeout(r, 260))

        // Stage 6
        if (isCancelled) return
        setCurrentStage(6)
        setProgressPercent(100)
        await new Promise((r) => setTimeout(r, 350))

        if (isCancelled) return
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
      {/* Background ambient radial glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-base font-medium tracking-wide text-white">
            EchoCard<span className="text-cyan-400">·AI</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest pl-2">
            Inference Pipeline
          </span>
        </div>

        <button
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] text-xs text-slate-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Cancel</span>
        </button>
      </header>

      {/* CENTER PROCESSING DISPLAY */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-xl mx-auto w-full text-center">
        {errorMsg ? (
          <div className="p-8 rounded-3xl bg-rose-950/30 border border-rose-500/40 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-white">Inference Pipeline Interrupted</h2>
            <p className="text-xs text-rose-300 font-mono max-w-md">{errorMsg}</p>
            <button
              onClick={onCancel}
              className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
            >
              Return to Upload Studio
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {/* Concentric Pulsing Ultrasonic Scanner Rings */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              {/* Outer Ripple */}
              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping opacity-30" />
              {/* Middle Ring */}
              <div className="absolute inset-4 rounded-full border border-teal-400/30 animate-pulse" />
              {/* Radar Sweep Arc */}
              <div className="absolute inset-8 rounded-full border-t-2 border-r-2 border-cyan-300 animate-spin" style={{ animationDuration: "2s" }} />
              {/* Center Glow Heart Icon */}
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center text-cyan-300">
                <Activity className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            {/* Glowing Lead II ECG wave */}
            <div className="w-64 h-8 overflow-hidden opacity-80 mb-6">
              <svg viewBox="0 0 200 40" className="w-full h-full text-cyan-400 fill-none stroke-current stroke-2">
                <path d="M 0 20 L 40 20 L 48 20 L 52 8 L 56 32 L 60 4 L 66 36 L 70 20 L 78 20 L 86 16 L 94 20 L 140 20 L 148 20 L 152 8 L 156 32 L 160 4 L 166 36 L 170 20 L 200 20" />
              </svg>
            </div>

            {/* Title & Stage indicator */}
            <h2 className="text-2xl font-light text-white tracking-tight mb-2">
              Quantifying Cardiac Function...
            </h2>
            <p className="text-xs font-mono text-cyan-300/90 h-5 mb-8">
              Stage {currentStage} of 6 — {STAGES[currentStage - 1]?.label}
            </p>

            {/* Progress Bar */}
            <div className="w-full max-w-md bg-white/[0.08] h-1.5 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 rounded-full shadow-[0_0_12px_#00f0ff]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
            <div className="text-[11px] font-mono text-slate-500 tracking-wider">
              {progressPercent}% COMPLETED
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-light">
        <span>Stanford Medicine EchoNet-Dynamic R3D-18</span>
        <span>AHA / ASE / EACVI Metric Stratification</span>
      </footer>
    </div>
  )
}
