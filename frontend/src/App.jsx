import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
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

  // Accessibility: Reduced Motion
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
    <div className="w-full min-h-screen bg-[#040711] text-slate-100 font-sans overflow-x-hidden">
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
