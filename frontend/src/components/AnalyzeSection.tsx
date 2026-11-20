import React, { useState, useRef } from "react";
import { GlassCard } from "./ui/GlassCard";
import {
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Layers
} from "lucide-react";
import {
  runMockInference,
  type ClinicalPresetId,
  type ProcessingState,
  type StudyResult
} from "../lib/api";

interface AnalyzeSectionProps {
  onAnalysisComplete: (result: StudyResult) => void;
}

export const AnalyzeSection: React.FC<AnalyzeSectionProps> = ({
  onAnalysisComplete
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<ClinicalPresetId>("normal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const validateAndSelectFile = (file: File) => {
    setValidationError(null);
    const validExtensions = [".mp4", ".avi", ".dicom", ".dcm"];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setValidationError(
        "Unsupported file format. Please upload an H.264 MP4, AVI, or DICOM echocardiogram video."
      );
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setValidationError("File size exceeds 50MB. Please upload a trimmed echocardiogram clip under 50MB.");
      return;
    }

    setSelectedFileName(file.name);
    // Assign a default clinical preset for the uploaded file simulation
    setSelectedPreset("normal");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handlePresetSelect = (preset: ClinicalPresetId) => {
    setSelectedPreset(preset);
    setValidationError(null);
    if (preset === "normal") {
      setSelectedFileName("Stanford_EchoNet_00124_A4C_Normal.mp4");
    } else if (preset === "borderline") {
      setSelectedFileName("Stanford_EchoNet_00482_A4C_HFmrEF.mp4");
    } else {
      setSelectedFileName("Stanford_EchoNet_00891_A4C_HFrEF.mp4");
    }
  };

  const handleRunInference = async () => {
    setIsProcessing(true);
    setValidationError(null);

    try {
      const result = await runMockInference(selectedPreset, (state) => {
        setProcessingState(state);
      });
      setIsProcessing(false);
      onAnalysisComplete(result);

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById("results");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setIsProcessing(false);
      setValidationError(
        "Endocardial boundary detection failed due to acoustic dropout. Ensure the clip displays an Apical 4-Chamber view."
      );
    }
  };

  return (
    <section
      id="analyze"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#050507]"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1.5 backdrop-blur-md mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8655FF]" />
            <span className="font-mono text-[11px] tracking-wider text-[#A1A1B0] uppercase">
              Clinical Inference Laboratory
            </span>
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-medium tracking-tight text-[#F5F5F7] leading-tight">
            Analyze Echocardiogram
          </h2>
          <p className="mt-3 text-[15px] text-[#A1A1B0] leading-relaxed">
            Ingest transthoracic ultrasound video loops for automated myocardial segmentation,
            volumetric analysis, and continuous Left Ventricular Ejection Fraction regression.
          </p>
        </div>

        {/* Studio Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Dropzone & Preset Selection (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            {/* Drag & Drop Ingestion Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-[16px] border-2 border-dashed p-8 md:p-12 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? "border-[#8655FF] bg-[rgba(134,85,255,0.12)] scale-[1.01]"
                  : selectedFileName
                  ? "border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.04)]"
                  : "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.avi,.dicom,.dcm"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.1)] text-[#8655FF] mb-4">
                <UploadCloud className="h-7 w-7" />
              </div>

              {selectedFileName ? (
                <div>
                  <span className="font-mono text-[11px] font-medium text-[#3DDC97] uppercase tracking-wider">
                    Ready for AI Inference
                  </span>
                  <p className="mt-1 font-mono text-[16px] font-medium text-[#F5F5F7]">
                    {selectedFileName}
                  </p>
                  <p className="mt-1 text-[12px] text-[#A1A1B0]">
                    Click or drop another file to replace
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-[18px] font-medium text-[#F5F5F7]">
                    Drag and drop Apical 4-Chamber echocardiogram video
                  </h3>
                  <p className="mt-2 text-[14px] text-[#A1A1B0] max-w-md mx-auto">
                    Accepts .mp4, .avi, or .dicom loops under 50MB. Requires standard Apical-4-Chamber (A4C) acoustic window with at least 32 frames.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-1.5 text-[12px] font-medium text-[#F5F5F7]">
                    <FileVideo className="h-3.5 w-3.5 text-[#7FD6FF]" />
                    <span>Browse Local Files</span>
                  </div>
                </div>
              )}
            </div>

            {/* Validation Error Banner */}
            {validationError && (
              <div className="rounded-[12px] border border-[rgba(224,49,49,0.3)] bg-[rgba(224,49,49,0.08)] p-4 flex items-start gap-3 text-[#F5F5F7]">
                <AlertTriangle className="h-5 w-5 text-[#E03131] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-[14px] font-medium text-[#E03131]">
                    Validation Error
                  </h4>
                  <p className="mt-0.5 text-[13px] text-[#A1A1B0] leading-relaxed">
                    {validationError}
                  </p>
                </div>
              </div>
            )}

            {/* Preset Demonstration Echoes Selection */}
            <div>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A1A1B0]">
                Or select verified Stanford EchoNet clinical presets:
              </span>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handlePresetSelect("normal")}
                  className={`rounded-[12px] border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                    selectedPreset === "normal" && selectedFileName
                      ? "border-[#3DDC97] bg-[rgba(61,220,151,0.08)] shadow-[0_0_16px_rgba(61,220,151,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#3DDC97]">PRESET A</span>
                    <span className="h-2 w-2 rounded-full bg-[#3DDC97]" />
                  </div>
                  <h4 className="mt-1 text-[14px] font-medium text-[#F5F5F7]">Normal LVEF</h4>
                  <p className="mt-0.5 font-mono text-[12px] text-[#A1A1B0]">LVEF ~58.0%</p>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect("borderline")}
                  className={`rounded-[12px] border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                    selectedPreset === "borderline" && selectedFileName
                      ? "border-[#E8B84A] bg-[rgba(232,184,74,0.08)] shadow-[0_0_16px_rgba(232,184,74,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#E8B84A]">PRESET B</span>
                    <span className="h-2 w-2 rounded-full bg-[#E8B84A]" />
                  </div>
                  <h4 className="mt-1 text-[14px] font-medium text-[#F5F5F7]">Borderline</h4>
                  <p className="mt-0.5 font-mono text-[12px] text-[#A1A1B0]">LVEF ~44.2%</p>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect("reduced")}
                  className={`rounded-[12px] border p-3.5 text-left transition-all duration-200 cursor-pointer ${
                    selectedPreset === "reduced" && selectedFileName
                      ? "border-[#FF4D6D] bg-[rgba(255,77,109,0.08)] shadow-[0_0_16px_rgba(255,77,109,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#FF4D6D]">PRESET C</span>
                    <span className="h-2 w-2 rounded-full bg-[#FF4D6D]" />
                  </div>
                  <h4 className="mt-1 text-[14px] font-medium text-[#F5F5F7]">HFrEF (Low)</h4>
                  <p className="mt-0.5 font-mono text-[12px] text-[#A1A1B0]">LVEF ~28.4%</p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Console & 4-Stage Stepper (5 cols) */}
          <div className="lg:col-span-5">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#8655FF]" />
                  <h4 className="text-[16px] font-medium text-[#F5F5F7]">
                    Inference Controller
                  </h4>
                </div>
                <span className="font-mono text-[11px] text-[#A1A1B0]">
                  PACS Worker Ready
                </span>
              </div>

              {/* Stepper Progress Visualizer */}
              <div className="mt-6 space-y-4">
                {[
                  { stage: 1, name: "Parsing Spatiotemporal Tensors", pct: 25 },
                  { stage: 2, name: "Spatial Attention Gating", pct: 50 },
                  { stage: 3, name: "Endocardial Boundary Delineation", pct: 75 },
                  { stage: 4, name: "Consensus Regression & Volumetrics", pct: 100 }
                ].map((s) => {
                  const isCurrent = processingState?.stage === s.stage;
                  const isFinished = (processingState?.stage ?? 0) > s.stage;

                  return (
                    <div key={s.stage} className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono transition-colors ${
                          isFinished
                            ? "border-[#3DDC97] bg-[#3DDC97] text-black font-semibold"
                            : isCurrent
                            ? "border-[#8655FF] bg-[#8655FF] text-white animate-pulse"
                            : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0]"
                        }`}
                      >
                        {isFinished ? "✓" : s.stage}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[13px]">
                          <span
                            className={
                              isCurrent || isFinished
                                ? "text-[#F5F5F7] font-medium"
                                : "text-[#A1A1B0]"
                            }
                          >
                            {s.name}
                          </span>
                          <span className="font-mono text-[11px] text-[#525266]">
                            {s.pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Processing Status Banner */}
              {isProcessing && processingState && (
                <div className="mt-6 rounded-lg border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.08)] p-3.5">
                  <div className="flex items-center gap-2 text-[#A78BFA]">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span className="font-mono text-[12px] font-medium">
                      Executing Stage {processingState.stage}: {processingState.stageName}
                    </span>
                  </div>
                  <p className="mt-1 text-[12px] text-[#A1A1B0]">
                    {processingState.description}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <button
                  type="button"
                  disabled={isProcessing || !selectedFileName}
                  onClick={handleRunInference}
                  className={`flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[14px] font-medium transition-all duration-300 ${
                    isProcessing || !selectedFileName
                      ? "border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] text-[#525266] cursor-not-allowed"
                      : "border border-[rgba(134,85,255,0.5)] bg-[#8655FF] text-white shadow-[0_0_24px_rgba(134,85,255,0.35)] hover:shadow-[0_0_36px_rgba(134,85,255,0.5)] hover:scale-[1.01] cursor-pointer"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      <span>Running Deep Neural Inference...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Run AI Inference</span>
                    </>
                  )}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
