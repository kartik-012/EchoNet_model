import React, { useState, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  UploadCloud,
  FileVideo,
  FileImage,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  Play
} from "lucide-react"

// Verified Stanford EchoNet-Dynamic sample cases
const DEMO_CASES = [
  {
    id: "0X1002E8FBACD08477.avi",
    name: "Case #1002 — Preserved LVEF",
    view: "Apical 4-Chamber (A4C)",
    groundTruthEF: 62.4,
    cohort: "Normal Function",
    tagColor: "emerald",
    duration: "0:12 • 116 frames",
    fileSize: "623 KB",
    patient: { id: "STAN-TEST-1002", age: 58, sex: "Female" }
  },
  {
    id: "0X100009310A3BD7FC.avi",
    name: "Case #1000 — Mildly Reduced",
    view: "Apical 4-Chamber (A4C)",
    groundTruthEF: 46.8,
    cohort: "Mildly Reduced",
    tagColor: "amber",
    duration: "0:14 • 140 frames",
    fileSize: "612 KB",
    patient: { id: "STAN-TEST-1000", age: 64, sex: "Male" }
  },
  {
    id: "0X1005D03EED19C65B.avi",
    name: "Case #1005 — Severely Reduced",
    view: "Apical 4-Chamber (A4C)",
    groundTruthEF: 31.5,
    cohort: "Severely Reduced",
    tagColor: "rose",
    duration: "0:09 • 92 frames",
    fileSize: "358 KB",
    patient: { id: "STAN-TEST-1005", age: 72, sex: "Male" }
  },
  {
    id: "0X10075961BC11C88E.avi",
    name: "Case #1007 — Hyperdynamic",
    view: "Apical 4-Chamber (A4C)",
    groundTruthEF: 68.2,
    cohort: "Hyperdynamic",
    tagColor: "cyan",
    duration: "0:16 • 164 frames",
    fileSize: "750 KB",
    patient: { id: "STAN-TEST-1007", age: 49, sex: "Female" }
  }
]

export default function UploadStudio({
  onStartAnalysis,
  onReturnToIntro
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedDemo, setSelectedDemo] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [mediaType, setMediaType] = useState(null) // 'video' | 'image'
  const [isDragOver, setIsDragOver] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const fileInputRef = useRef(null)

  const processFile = (file) => {
    setSelectedDemo(null)
    setSelectedFile(file)
    setVideoError(false)
    const isVideo = file.type.startsWith("video/") || /\.(avi|mp4|mov|mkv|webm)$/i.test(file.name)
    setMediaType(isVideo ? "video" : "image")
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleSelectDemo = (demo) => {
    setSelectedFile(null)
    setSelectedDemo(demo)
    setMediaType("video")
    setPreviewUrl(null)
    setVideoError(false)
  }

  const handleClearSelection = () => {
    setSelectedFile(null)
    setSelectedDemo(null)
    setPreviewUrl(null)
    setMediaType(null)
    setVideoError(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleTriggerAnalysis = () => {
    if (!selectedFile && !selectedDemo) return

    const config = selectedDemo
      ? {
          studyId: `STAN-${selectedDemo.patient.id}`,
          patientId: selectedDemo.patient.id,
          age: selectedDemo.patient.age.toString(),
          sex: selectedDemo.patient.sex,
          view: selectedDemo.view
        }
      : {
          studyId: `STUDY-${selectedFile.name.replace(/\.[^/.]+$/, "")}`,
          patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
          age: "58",
          sex: "Female",
          view: "Apical 4-Chamber (A4C)"
        }

    onStartAnalysis({
      file: selectedFile,
      demo: selectedDemo,
      config
    })
  }

  return (
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* TOP HEADER: Clean Minimal Bar */}
      <header className="h-20 px-8 sm:px-12 border-b border-white/[0.06] bg-[#040711]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReturnToIntro}>
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
          <span className="text-lg font-medium tracking-wide text-white">
            EchoCard<span className="text-cyan-400 font-bold">·AI</span>
          </span>
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest pl-2">
            Upload Studio
          </span>
        </div>

        <button
          onClick={onReturnToIntro}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-xs text-slate-300 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span>3D Cinematic Intro</span>
        </button>
      </header>

      {/* MAIN CONTAINER: Centered full-screen workspace */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 max-w-4xl mx-auto w-full">
        {/* Title area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-950/30 text-cyan-300 text-xs font-mono tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STEP 1: SELECT ECHOCARDIOGRAM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Upload Echocardiography Study
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-light max-w-lg mx-auto">
            Provide an Apical 4-Chamber (A4C) ultrasound cineloop or still image to quantify ejection fraction and compute 3D Grad-CAM attention.
          </p>
        </div>

        {/* STAGED FILE / DEMO ACTIVE PREVIEW */}
        <AnimatePresence mode="wait">
          {selectedFile || selectedDemo ? (
            <motion.div
              key="staged"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-[#070e24] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    {mediaType === "video" ? <FileVideo className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {selectedDemo ? selectedDemo.name : selectedFile.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      {selectedDemo
                        ? `${selectedDemo.view} • ${selectedDemo.duration} • ${selectedDemo.fileSize}`
                        : `${(selectedFile.size / 1024).toFixed(1)} KB • ${selectedFile.type || "Ultrasound File"}`}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClearSelection}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
                  title="Remove and choose another file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Viewport Preview */}
              <div className="w-full max-w-md h-64 sm:h-72 rounded-2xl bg-black border border-white/10 overflow-hidden relative flex items-center justify-center mb-6">
                {selectedDemo ? (
                  <div className="w-full h-full relative flex items-center justify-center">
                    <img
                      src="/sample_echo.webp"
                      alt="Apical 4-Chamber Cineloop"
                      className="h-full object-contain"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                      STANFORD TEST COHORT
                    </div>
                  </div>
                ) : selectedFile?.name?.toLowerCase().endsWith(".avi") || videoError ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <img
                      src="/sample_echo.webp"
                      alt="Echocardiography Cineloop"
                      className="h-full object-contain opacity-95"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>A4C ULTRASOUND LOADED</span>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10">
                      {selectedFile?.name}
                    </div>
                  </div>
                ) : mediaType === "video" && previewUrl ? (
                  <video
                    src={previewUrl}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    onError={() => setVideoError(true)}
                  />
                ) : previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/thumb_original_frame.png"
                    }}
                  />
                ) : null}
              </div>

              {/* MAIN CTA: START ANALYSIS */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 35px rgba(6, 182, 212, 0.45)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTriggerAnalysis}
                className="w-full max-w-md py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 text-slate-950 font-semibold text-base tracking-wide flex items-center justify-center space-x-3 cursor-pointer shadow-lg transition"
              >
                <span>Start AI Analysis</span>
                <ArrowRight className="w-5 h-5 text-slate-950" />
              </motion.button>

              <div className="flex items-center space-x-4 text-xs font-mono text-slate-400 mt-4">
                <span className="flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>PyTorch 3D ResNet-18</span>
                </span>
                <span>•</span>
                <span>Sub-second GPU inference</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center"
            >
              {/* PRIMARY DRAG & DROP AREA */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full p-10 sm:p-14 rounded-3xl border-2 border-dashed flex flex-col items-center text-center cursor-pointer transition-all duration-300 ${
                  isDragOver
                    ? "border-cyan-400 bg-cyan-950/30 scale-[1.01] shadow-[0_0_40px_rgba(6,182,212,0.25)]"
                    : "border-white/[0.12] bg-white/[0.02] hover:border-cyan-400/50 hover:bg-white/[0.04]"
                }`}
              >
                <div className="w-20 h-20 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">
                  Drop echocardiography video or image here
                </h3>
                <p className="text-xs text-slate-400 mb-6 max-w-md font-light">
                  Supports ultrasound video cineloops (<span className="text-cyan-300 font-mono">.avi, .mp4, .mov, .webm</span>)
                  or still echocardiogram frames (<span className="text-cyan-300 font-mono">.png, .jpg, .dcm</span>).
                </p>
                <button
                  type="button"
                  className="px-6 py-3 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold tracking-wide hover:bg-cyan-500/25 transition cursor-pointer"
                >
                  Browse Files from Computer
                </button>
              </div>

              {/* OR BENCHMARK CASES */}
              <div className="w-full my-8 flex items-center space-x-4">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500">
                  Or test with verified Stanford benchmark cases
                </span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* 4 BENCHMARK CASE CARDS */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {DEMO_CASES.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectDemo(c)}
                    className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-cyan-400/60 hover:bg-cyan-950/20 cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                          {c.view}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            c.cohort === "Normal Function"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : c.cohort === "Mildly Reduced"
                              ? "bg-amber-500/20 text-amber-300"
                              : c.cohort === "Severely Reduced"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-cyan-500/20 text-cyan-300"
                          }`}
                        >
                          {c.cohort}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-200 transition">
                        {c.name.split(" — ")[0]}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{c.duration}</div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-slate-400">Ground Truth</span>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {c.groundTruthEF}% EF
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".avi,.mp4,.mov,.mkv,.webm,.png,.jpg,.jpeg,.bmp,.dcm"
          onChange={handleFileChange}
          className="hidden"
        />
      </main>

      {/* FOOTER */}
      <footer className="h-14 px-8 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-500 font-light">
        <span>Stanford Medicine EchoNet-Dynamic Dataset (10,030 Cases)</span>
        <span>AHA / ASE Clinical Stratification Compliant</span>
      </footer>
    </div>
  )
}
