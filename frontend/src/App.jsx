import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Cpu, History, Eye, HelpCircle } from "lucide-react"
import CinematicIntro from "./components/CinematicIntro"
import UploadStudio from "./components/UploadStudio"
import ProcessingEnvironment from "./components/ProcessingEnvironment"
import IntelligenceReport from "./components/IntelligenceReport"
import ModelEvaluationModal from "./components/ModelEvaluationModal"
import HistoryModal from "./components/HistoryModal"
import { fetchHealth } from "./services/api"

export default function App() {
  // Application Stage: 'intro' | 'studio' | 'processing' | 'report'
  const [currentView, setCurrentView] = useState("intro")

  // Accessibility: High-Contrast & Reduced Motion
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Backend Health Telemetry
  const [health, setHealth] = useState(null)

  // Staged Analysis Payload from Studio
  const [analysisPayload, setAnalysisPayload] = useState(null)

  // Completed Medical Report Data
  const [reportResult, setReportResult] = useState(null)
  const [activeConfig, setActiveConfig] = useState(null)

  // Session Study History
  const [studyHistory, setStudyHistory] = useState([])

  // Modals
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((err) => console.warn("Backend not yet connected:", err.message))

    const handleGlobalKeys = (e) => {
      if (e.key === "?" || e.key === "h" || e.key === "H") {
        if (!["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) {
          setIsModelInfoOpen((prev) => !prev)
        }
      }
    }
    window.addEventListener("keydown", handleGlobalKeys)
    return () => window.removeEventListener("keydown", handleGlobalKeys)
  }, [])

  // Transition from Intro to Studio
  const handleEnterStudio = () => {
    setCurrentView("studio")
  }

  // Start AI Analysis from Studio
  const handleStartAnalysis = (payload) => {
    setAnalysisPayload(payload)
    setCurrentView("processing")
  }

  // AI Inference Completed Successfully
  const handleAnalysisSuccess = (result, payload) => {
    setReportResult(result)
    setActiveConfig(payload.config)

    // Save to history
    setStudyHistory((prev) => [
      {
        result,
        config: payload.config,
        timestamp: new Date().toISOString()
      },
      ...prev
    ])

    setCurrentView("report")
  }

  // AI Inference Error
  const handleAnalysisError = (err) => {
    console.error("Analysis failed:", err)
  }

  // Return to Studio from Report
  const handleReturnToStudio = () => {
    setCurrentView("studio")
  }

  // Return to Cinematic 3D Intro from Studio
  const handleReturnToIntro = () => {
    setCurrentView("intro")
  }

  // New Analysis action from Report
  const handleNewAnalysis = () => {
    setAnalysisPayload(null)
    setReportResult(null)
    setCurrentView("studio")
  }

  // Reopen past case from history
  const handleSelectHistoryCase = (item) => {
    setReportResult(item.result)
    setActiveConfig(item.config)
    setCurrentView("report")
  }

  return (
    <div className={`w-full min-h-screen bg-[#040711] text-slate-100 font-sans overflow-x-hidden ${highContrast ? "high-contrast-mode" : ""}`}>
      {/* Top Cyber-Medical System Telemetry Bar */}
      <div className="cyber-telemetry-bar w-full px-4 py-1.5 flex items-center justify-between text-[11px] font-mono z-40 relative">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider">ECHOCARD-AI</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="flex items-center space-x-1.5 text-slate-400 hidden sm:flex">
            <Cpu size={12} className="text-cyan-400" />
            <span>CUDA RTX 3050 (12ms WS)</span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">DICOM PS 3.3 • 32F @ 50fps</span>
        </div>

        {/* View Switcher / Quick Navigation */}
        <div className="flex items-center space-x-1">
          {[
            { id: "intro", label: "Intro" },
            { id: "studio", label: "Studio" },
            { id: "report", label: "Report", disabled: !reportResult }
          ].map((v) => (
            <button
              key={v.id}
              disabled={v.disabled}
              onClick={() => setCurrentView(v.id)}
              className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                currentView === v.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold"
                  : v.disabled
                  ? "text-slate-600 cursor-not-allowed opacity-40"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Global Action Icons */}
        <div className="flex items-center space-x-2 text-slate-400">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-1 rounded hover:text-white transition cursor-pointer flex items-center space-x-1 ${
              highContrast ? "text-amber-400 bg-amber-950/40 border border-amber-500/30" : "text-slate-400"
            }`}
            title="Toggle Clinical High-Contrast Mode"
          >
            <Eye size={12} />
            <span className="text-[9px] hidden lg:inline">{highContrast ? "Contrast ON" : "Contrast"}</span>
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-1 rounded hover:text-white transition cursor-pointer flex items-center space-x-1"
            title="View Study History"
          >
            <History size={12} className="text-cyan-400" />
            <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1 rounded-full border border-cyan-500/30">
              {studyHistory.length}
            </span>
          </button>

          <button
            onClick={() => setIsModelInfoOpen(true)}
            className="p-1 rounded hover:text-white transition cursor-pointer"
            title="Model Verification & Benchmark (Press ?)"
          >
            <HelpCircle size={12} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* 1. CINEMATIC 3D INTRODUCTION */}
        {currentView === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <CinematicIntro
              onEnterStudio={handleEnterStudio}
              reducedMotion={reducedMotion}
              setReducedMotion={setReducedMotion}
            />
          </motion.div>
        )}

        {/* 2. UPLOAD STUDIO (FOCUSED DRAG & DROP — NO SIDEBAR, NO TABS) */}
        {currentView === "studio" && (
          <motion.div
            key="studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full"
          >
            <UploadStudio
              onStartAnalysis={handleStartAnalysis}
              onReturnToIntro={handleReturnToIntro}
            />
          </motion.div>
        )}

        {/* 3. DEDICATED CINEMATIC PROCESSING ENVIRONMENT */}
        {currentView === "processing" && analysisPayload && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <ProcessingEnvironment
              analysisPayload={analysisPayload}
              onAnalysisSuccess={handleAnalysisSuccess}
              onAnalysisError={handleAnalysisError}
              onCancel={handleReturnToStudio}
            />
          </motion.div>
        )}

        {/* 4. PROFESSIONAL MEDICAL INTELLIGENCE REPORT (FULL WIDTH, NO SIDEBAR) */}
        {currentView === "report" && reportResult && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <IntelligenceReport
              result={reportResult}
              studyConfig={activeConfig}
              onReturnToStudio={handleReturnToStudio}
              onNewAnalysis={handleNewAnalysis}
              onOpenModelInfo={() => setIsModelInfoOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL MODALS */}
      <ModelEvaluationModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
        health={health}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={studyHistory}
        onSelectHistoryCase={handleSelectHistoryCase}
      />
    </div>
  )
}
