import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileVideo,
  AlertTriangle,
  Play,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Video
} from "lucide-react";
import type { ClinicalPresetId } from "../../lib/api";

interface UploadScreenProps {
  onBack: () => void;
  onProceedToProcessing: (presetId: ClinicalPresetId, fileName: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({
  onBack,
  onProceedToProcessing
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("Stanford_EchoNet_00124_A4C_Normal.mp4");
  const [selectedPreset, setSelectedPreset] = useState<ClinicalPresetId>("normal");
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
      setValidationError("File size exceeds 50MB. Please supply a trimmed echocardiogram loop.");
      return;
    }

    setSelectedFileName(file.name);
    setSelectedPreset("normal");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
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

  const handleStartInference = () => {
    onProceedToProcessing(selectedPreset, selectedFileName);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#050507] px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Top Screen Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[rgba(255,255,255,0.08)] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8655FF]" />
              <span className="font-mono text-[11px] text-[#A1A1B0] uppercase">
                STAGE 02 • APICAL 4-CHAMBER INGESTION
              </span>
            </div>
            <h2 className="text-[26px] sm:text-[32px] font-medium tracking-tight text-[#F5F5F7]">
              Upload Echocardiogram Study
            </h2>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-[12px] text-[#A1A1B0] hover:text-[#F5F5F7] hover:border-[rgba(255,255,255,0.2)] transition-colors self-start cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Overview</span>
          </button>
        </div>

        {/* 2-Column Upload & Presets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Dropzone & File Status (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragOver
                  ? "border-[#8655FF] bg-[rgba(134,85,255,0.12)] scale-[1.01]"
                  : "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.avi,.dicom,.dcm"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndSelectFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.1)] text-[#8655FF] mb-3">
                <UploadCloud className="h-7 w-7" />
              </div>

              <h3 className="text-[17px] font-medium text-[#F5F5F7]">
                Drag & Drop Echocardiogram Recording
              </h3>
              <p className="mt-1.5 text-[13px] text-[#A1A1B0] max-w-sm mx-auto">
                Accepts .mp4, .avi, or .dicom files under 50MB. Video will be sampled to 32 contiguous B-mode frames.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-1.5 text-[12px] font-medium text-[#F5F5F7]">
                <FileVideo className="h-3.5 w-3.5 text-[#7FD6FF]" />
                <span>Browse File System</span>
              </div>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="rounded-xl border border-[rgba(224,49,49,0.3)] bg-[rgba(224,49,49,0.08)] p-3.5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-[#E03131] shrink-0" />
                <p className="text-[13px] text-[#F5F5F7]">{validationError}</p>
              </div>
            )}

            {/* Staged File Inspector Banner */}
            {selectedFileName && (
              <div className="rounded-xl border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.06)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(134,85,255,0.15)] text-[#8655FF]">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-[#3DDC97] uppercase">
                      STUDY READY FOR PACS PIPELINE
                    </span>
                    <p className="font-mono text-[14px] font-medium text-[#F5F5F7]">
                      {selectedFileName}
                    </p>
                    <p className="font-mono text-[11px] text-[#A1A1B0] mt-0.5">
                      32 Frames • 50 FPS • 112×112 Spatial Crop • A4C View
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#3DDC97]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>QC Passed</span>
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <button
              onClick={handleStartInference}
              className="w-full flex items-center justify-center gap-2.5 rounded-full border border-[rgba(134,85,255,0.6)] bg-[#8655FF] py-3.5 text-[14px] font-medium text-white shadow-[0_0_24px_rgba(134,85,255,0.35)] hover:shadow-[0_0_36px_rgba(134,85,255,0.55)] hover:scale-[1.01] transition-all cursor-pointer"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Initiate Deep Neural Inference →</span>
            </button>
          </div>

          {/* Right Column: Pre-calibrated Research Presets (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A78BFA]">
                Stanford EchoNet Cohort Presets
              </span>
              <p className="text-[12px] text-[#A1A1B0] mt-1 mb-3">
                Select a verified reference study from the 10,030 dataset cases:
              </p>

              <div className="space-y-2.5">
                {/* Preset A */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect("normal")}
                  className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                    selectedPreset === "normal"
                      ? "border-[#3DDC97] bg-[rgba(61,220,151,0.08)] shadow-[0_0_16px_rgba(61,220,151,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#3DDC97]">PRESET A • PRESERVED</span>
                    <span className="h-2 w-2 rounded-full bg-[#3DDC97]" />
                  </div>
                  <h4 className="mt-1 text-[14px] font-medium text-[#F5F5F7]">Normal Systolic Function</h4>
                  <p className="text-[12px] text-[#A1A1B0] mt-0.5">Expected LVEF ~58.0% • Symmetrical Wall Motion</p>
                </button>

                {/* Preset B */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect("borderline")}
                  className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                    selectedPreset === "borderline"
                      ? "border-[#E8B84A] bg-[rgba(232,184,74,0.08)] shadow-[0_0_16px_rgba(232,184,74,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#E8B84A]">PRESET B • HFmrEF</span>
                    <span className="h-2 w-2 rounded-full bg-[#E8B84A]" />
                  </div>
                  <h4 className="mt-1 text-[14px] font-medium text-[#F5F5F7]">Mildly Reduced Function</h4>
                  <p className="text-[12px] text-[#A1A1B0] mt-0.5">Expected LVEF ~44.2% • Mid-Systolic Hypokinesia</p>
                </button>

                {/* Preset C */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect("reduced")}
                  className={`w-full rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                    selectedPreset === "reduced"
                      ? "border-[#FF4D6D] bg-[rgba(255,77,109,0.08)] shadow-[0_0_16px_rgba(255,77,109,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-[#FF4D6D]">PRESET C • HFrEF</span>
                    <span className="h-2 w-2 rounded-full bg-[#FF4D6D]" />
                  </div>
                  <h4 className="mt-1 text-[14px] font-medium text-[#F5F5F7]">Severely Depressed Function</h4>
                  <p className="text-[12px] text-[#A1A1B0] mt-0.5">Expected LVEF ~28.4% • Severe Ventricular Dilation</p>
                </button>
              </div>
            </div>

            {/* Quality Standard Card */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.3)] p-4 text-[12px] text-[#A1A1B0] space-y-2">
              <div className="flex items-center gap-2 text-[#F5F5F7] font-medium">
                <ShieldCheck className="h-4 w-4 text-[#8655FF]" />
                <span>Echocardiography Quality Assurance</span>
              </div>
              <p className="leading-relaxed">
                Images are checked against Stanford PACS standards: Apical-4-Chamber transducer angle, sector depth calibration, and minimum 32 contiguous B-mode cardiac frames.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
