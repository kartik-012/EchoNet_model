import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Cpu, History, Eye, HelpCircle, Command } from "lucide-react"
import CinematicIntro from "./components/CinematicIntro"
import UploadStudio from "./components/UploadStudio"
import ProcessingEnvironment from "./components/ProcessingEnvironment"
import IntelligenceReport from "./components/IntelligenceReport"
import ValidationStudio from "./components/ValidationStudio"
import ModelEvaluationModal from "./components/ModelEvaluationModal"
import HistoryModal from "./components/HistoryModal"
import CommandPaletteModal from "./components/CommandPaletteModal"
import { fetchHealth } from "./services/api"
import { generateClinicalPDF } from "./utils/pdfExport"

export default function App() {
  // Application Stage: 'intro' | 'analysis' | 'intelligence' | 'validation' | 'report' | 'processing'
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
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch((err) => console.warn("Backend not yet connected:", err.message))

    // Preload verified baseline study in background so Intelligence & Report views are immediately accessible
    import("./services/api").then(({ runPredictionOnSample }) => {
      runPredictionOnSample("0X1002E8FBACD08477.avi")
        .then((data) => {
          setReportResult(data)
          setActiveConfig({
            patientId: "STAN-TEST-1002",
            patientAge: 58,
            patientSex: "Female",
            clinicalIndication: "Routine Evaluation - Preserved LVEF",
            selectedProbe: "X5-1 xMATRIX (1-5 MHz)",
            uncertaintyMode: "Monte Carlo Dropout (30 Iterations)",
            calibrationStandard: "Stanford EchoNet (A4C Insonation)"
          })
        })
        .catch((err) => console.warn("Background preset preload error:", err.message))
    })

    const handleGlobalKeys = (e) => {
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)

      // Open Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
        return
      }

      if (isInput) return

      if (e.key === "?" || e.key === "m" || e.key === "M") {
        setIsModelInfoOpen((prev) => !prev)
      } else if (e.key === "h" || e.key === "H") {
        setIsHistoryOpen((prev) => !prev)
      } else if (e.key === "c" || e.key === "C") {
        setHighContrast((prev) => !prev)
      } else if (e.key === "0") {
        setCurrentView("intro")
      } else if (e.key === "1") {
        setCurrentView("analysis")
      } else if (e.key === "2") {
        setCurrentView("intelligence")
      } else if (e.key === "3") {
        setCurrentView("validation")
      } else if (e.key === "4") {
        setCurrentView("report")
      }
    }
    window.addEventListener("keydown", handleGlobalKeys)
    return () => window.removeEventListener("keydown", handleGlobalKeys)
  }, [])

  // Transition from Intro to Studio
  const handleEnterStudio = () => {
    setCurrentView("analysis")
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
    setCurrentView("analysis")
  }

  // Return to Cinematic 3D Intro from Studio
  const handleReturnToIntro = () => {
    setCurrentView("intro")
  }

  // New Analysis action from Report
  const handleNewAnalysis = () => {
    setAnalysisPayload(null)
    setCurrentView("analysis")
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
      <div className="cyber-telemetry-bar w-full px-4 py-2 flex items-center justify-between text-[11px] font-mono z-40 relative border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView("intro")}
            className="flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
            title="Go to Home"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider font-mono">ECHOCARD-AI</span>
          </button>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <div className="flex items-center space-x-1.5 text-slate-400 hidden sm:flex">
            <Cpu size={12} className="text-cyan-400" />
            <span>CUDA RTX 3050 (12ms WS)</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="text-slate-400 hidden md:inline">DICOM PS 3.3 • 32F @ 50fps</span>
        </div>

        {/* 4 CORE PILLARS TOP NAVIGATION BAR (Exact match to Image 2) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-900/90 border border-slate-800/80 rounded-2xl p-1 backdrop-blur-md shadow-xl">
          {/* Quick Hero Toggle */}
          <button
            onClick={() => setCurrentView("intro")}
            className={`px-2.5 sm:px-3 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer flex items-center space-x-1 ${
              currentView === "intro"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="3D Cinematic Heart Landing Hero"
          >
            <span>✨ 3D Hero</span>
          </button>

          <div className="w-px h-3.5 bg-slate-700/60 self-center" />

          {/* 4 Core Pillars from Image 2 */}
          {[
            { id: "analysis", label: "Analysis" },
            { id: "intelligence", label: "Intelligence" },
            { id: "validation", label: "Validation" },
            { id: "report", label: "Report" }
          ].map((tab) => {
            const isActive =
              currentView === tab.id ||
              (tab.id === "analysis" && currentView === "studio")
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id)}
                className={`relative px-3.5 sm:px-5 py-1 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#00c5e0] text-slate-950 font-bold shadow-lg shadow-cyan-500/25"
                    : "text-slate-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Global Action Icons */}
        <div className="flex items-center space-x-2 text-slate-400">
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-1.5 rounded-lg hover:text-white transition cursor-pointer flex items-center space-x-1 ${
              highContrast ? "text-amber-400 bg-amber-950/40 border border-amber-500/30" : "text-slate-400 hover:bg-slate-800"
            }`}
            title="Toggle Clinical High-Contrast Mode (C)"
          >
            <Eye size={12} />
            <span className="text-[9px] hidden lg:inline">{highContrast ? "Contrast ON" : "Contrast"}</span>
          </button>

          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="p-1 px-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40 transition cursor-pointer flex items-center space-x-1"
            title="Open Command Palette & Shortcuts (Ctrl+K)"
          >
            <Command size={11} className="text-cyan-400" />
            <span className="text-[9px] font-mono hidden sm:inline">⌘K</span>
          </button>

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center space-x-1"
            title="View Study History (H)"
          >
            <History size={12} className="text-cyan-400" />
            <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1 rounded-full border border-cyan-500/30">
              {studyHistory.length}
            </span>
          </button>

          <button
            onClick={() => setIsModelInfoOpen(true)}
            className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Model Verification & Benchmark (?)"
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
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <CinematicIntro
              onEnterStudio={handleEnterStudio}
              reducedMotion={reducedMotion}
              setReducedMotion={setReducedMotion}
              onNavigate={(v) => setCurrentView(v)}
            />
          </motion.div>
        )}

        {/* 2. PILLAR 1: ANALYSIS (UPLOAD STUDIO) */}
        {(currentView === "analysis" || currentView === "studio") && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
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

        {/* 4. PILLAR 2: INTELLIGENCE (3D SPATIOTEMPORAL & GRAD-CAM WORKSTATION) */}
        {currentView === "intelligence" && reportResult && (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <IntelligenceReport
              result={reportResult}
              studyConfig={activeConfig}
              onReturnToStudio={handleReturnToStudio}
              onNewAnalysis={handleNewAnalysis}
              onOpenModelInfo={() => setCurrentView("validation")}
              onNavigate={(v) => setCurrentView(v)}
              defaultNavTab="Intelligence"
            />
          </motion.div>
        )}

        {/* 5. PILLAR 3: VALIDATION (HELD-OUT BENCHMARKS & ROBUSTNESS SUITE) */}
        {currentView === "validation" && (
          <motion.div
            key="validation"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <ValidationStudio
              health={health}
              onNavigate={(v) => setCurrentView(v)}
            />
          </motion.div>
        )}

        {/* 6. PILLAR 4: REPORT (CLINICAL PACS DOSSIER & SIMPSON'S VOLUME CURVE) */}
        {currentView === "report" && reportResult && (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="w-full h-full"
          >
            <IntelligenceReport
              result={reportResult}
              studyConfig={activeConfig}
              onReturnToStudio={handleReturnToStudio}
              onNewAnalysis={handleNewAnalysis}
              onOpenModelInfo={() => setCurrentView("validation")}
              onNavigate={(v) => setCurrentView(v)}
              defaultNavTab="Report"
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

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(view) => setCurrentView(view)}
        onToggleContrast={() => setHighContrast((prev) => !prev)}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onExportPDF={() => {
          if (reportResult) {
            generateClinicalPDF(reportResult, activeConfig)
          }
        }}
        hasReport={!!reportResult}
        highContrast={highContrast}
      />
    </div>
  )
}
