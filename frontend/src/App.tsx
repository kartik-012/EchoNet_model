import React, { useState } from "react";
import { Navbar, type ScreenId } from "./components/Navbar";
import { StartScreen } from "./components/screens/StartScreen";
import { UploadScreen } from "./components/screens/UploadScreen";
import { ProcessingScreen } from "./components/screens/ProcessingScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { ValidationModal } from "./components/modals/ValidationModal";
import { PipelineModal } from "./components/modals/PipelineModal";
import { AboutModal } from "./components/modals/AboutModal";
import { IntroOverlay } from "./components/IntroOverlay";
import { CLINICAL_PRESETS, type ClinicalPresetId, type StudyResult } from "./lib/api";

export const App: React.FC = () => {
  const [introActive, setIntroActive] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>("start");
  
  // Active study parameters
  const [selectedPreset, setSelectedPreset] = useState<ClinicalPresetId>("normal");
  const [selectedFileName, setSelectedFileName] = useState<string>(
    "Stanford_EchoNet_00124_A4C_Normal.mp4"
  );
  
  // Results store (pre-seeded with normal preset for immediate inspection if navigated to)
  const [analyzedResult, setAnalyzedResult] = useState<StudyResult>(
    CLINICAL_PRESETS.normal
  );

  // Modals state
  const [isValidationOpen, setIsValidationOpen] = useState<boolean>(false);
  const [isPipelineOpen, setIsPipelineOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  const handleIntroComplete = () => {
    setIntroActive(false);
  };

  const handleStartAnalysis = () => {
    setCurrentScreen("upload");
  };

  const handleProceedToProcessing = (presetId: ClinicalPresetId, fileName: string) => {
    setSelectedPreset(presetId);
    setSelectedFileName(fileName);
    setCurrentScreen("processing");
  };

  const handleInferenceFinished = (result: StudyResult) => {
    setAnalyzedResult(result);
    setCurrentScreen("dashboard");
  };

  const handleNewAnalysis = () => {
    setCurrentScreen("upload");
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#050507] text-[#F5F5F7] selection:bg-[#8655FF]/30 selection:text-white">
      {/* 12-Second Cinematic Intro Sequence with Skip [Esc] */}
      {introActive && (
        <IntroOverlay
          onComplete={handleIntroComplete}
          onProgressUpdate={() => {}}
        />
      )}

      {/* Global Fixed Navigation Bar with Clinical Stepper */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        onOpenValidation={() => setIsValidationOpen(true)}
        onOpenPipeline={() => setIsPipelineOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        hasResult={Boolean(analyzedResult)}
      />

      {/* Main Viewport-Fitted Application Workspace (No Page Scroll) */}
      <main className="pt-16 h-screen w-full overflow-hidden">
        {/* Screen 1: Start / Project Overview & 3D Interactive Heart */}
        {currentScreen === "start" && (
          <StartScreen
            onStartAnalysis={handleStartAnalysis}
            onOpenPipeline={() => setIsPipelineOpen(true)}
            onOpenValidation={() => setIsValidationOpen(true)}
          />
        )}

        {/* Screen 2: Dedicated Clinical Upload Studio */}
        {currentScreen === "upload" && (
          <UploadScreen
            onBack={() => setCurrentScreen("start")}
            onProceedToProcessing={handleProceedToProcessing}
          />
        )}

        {/* Screen 3: Neural Spatiotemporal Inference Execution Monitor */}
        {currentScreen === "processing" && (
          <ProcessingScreen
            presetId={selectedPreset}
            fileName={selectedFileName}
            onInferenceFinished={handleInferenceFinished}
          />
        )}

        {/* Screen 4: Diagnostic Cardiology Clinical Report Dashboard */}
        {currentScreen === "dashboard" && (
          <DashboardScreen
            result={analyzedResult}
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </main>

      {/* Technical Modals (Overlay without leaving active screen) */}
      <ValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
      />

      <PipelineModal
        isOpen={isPipelineOpen}
        onClose={() => setIsPipelineOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};

export default App;
