import React, { useState } from "react";
import {
  Download,
  FileCode,
  RotateCcw,
  Eye,
  Layers,
  Heart,
  CheckCircle2,
  AlertTriangle,
  Activity,
  FileCheck2,
  ShieldCheck,
  Printer
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import type { StudyResult } from "../../lib/api";

interface DashboardScreenProps {
  result: StudyResult;
  onNewAnalysis: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  result,
  onNewAnalysis
}) => {
  const [showMask, setShowMask] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Category specific colors and labels
  const getCategoryTheme = (category: StudyResult["category"]) => {
    switch (category) {
      case "preserved":
        return {
          color: "#3DDC97",
          bgAlpha: "rgba(61,220,151,0.1)",
          border: "rgba(61,220,151,0.3)"
        };
      case "mildly_reduced":
        return {
          color: "#E8B84A",
          bgAlpha: "rgba(232,184,74,0.1)",
          border: "rgba(232,184,74,0.3)"
        };
      case "reduced":
        return {
          color: "#FF4D6D",
          bgAlpha: "rgba(255,77,109,0.1)",
          border: "rgba(255,77,109,0.3)"
        };
    }
  };

  const theme = getCategoryTheme(result.category);

  // Export JSON mask data
  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            studyId: result.id,
            patientHash: result.patientHash,
            timestamp: result.timestamp,
            lvef: result.lvef,
            maskCoordinates: result.maskCoordinates,
            volumeCurve: result.volumeCurve
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${result.patientHash}_segmentation_masks.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export PDF clinical summary
  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-[#050507] px-4 sm:px-6 lg:px-8 py-4 flex flex-col justify-between">
      <div className="w-full max-w-7xl mx-auto flex flex-col h-full justify-between space-y-4">
        {/* Top PACS Patient Study Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)] gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.1)] text-[#8655FF]">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[14px] font-medium text-[#F5F5F7]">
                  STUDY: {result.patientHash}
                </span>
                <span
                  className="rounded-full border px-2 py-0.5 font-mono text-[10px]"
                  style={{
                    backgroundColor: theme.bgAlpha,
                    borderColor: theme.border,
                    color: theme.color
                  }}
                >
                  {result.categoryLabel}
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#A1A1B0] mt-0.5">
                Acquisition: Transthoracic A4C • {result.timestamp} • PACS Node: JCE-VTU-PACS
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[12px] font-medium text-[#F5F5F7] transition-colors hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-[#7FD6FF]" />
              <span>Print / PDF Report</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-[12px] font-medium text-[#F5F5F7] transition-colors hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>Export Masks (JSON)</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(134,85,255,0.5)] bg-[#8655FF] px-3.5 py-1.5 text-[12px] font-medium text-white shadow-md shadow-violet-500/20 hover:bg-[#7846ea] transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* Main 3-Column Diagnostic Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
          {/* Column 1: LVEF Dial & Hemodynamic Quantitation (3.5 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
            {/* Circular Dial Gauge Card */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 text-center">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#A1A1B0]">
                Left Ventricular Ejection Fraction (LVEF)
              </span>

              <div className="relative mx-auto my-3 flex h-40 w-40 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="8"
                    strokeDasharray="326.7"
                    strokeDashoffset="65"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="transparent"
                    stroke={theme.color}
                    strokeWidth="9"
                    strokeDasharray="326.7"
                    strokeDashoffset={326.7 - (326.7 - 65) * (result.lvef / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-[38px] font-medium text-[#F5F5F7] tracking-tight">
                    {result.lvef.toFixed(1)}%
                  </span>
                  <span className="font-mono text-[10px] text-[#A1A1B0]">
                    95% CI: [{result.confidenceInterval[0]}% - {result.confidenceInterval[1]}%]
                  </span>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium"
                style={{
                  backgroundColor: theme.bgAlpha,
                  borderColor: theme.border,
                  color: theme.color
                }}
              >
                <Heart className="h-3 w-3 fill-current" />
                <span>{result.categoryLabel}</span>
              </div>
            </div>

            {/* Quantitative Hemodynamics Card */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex-1 flex flex-col justify-between">
              <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#A1A1B0]">
                Quantitative Hemodynamic Biomarkers
              </span>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-2.5">
                  <span className="font-mono text-[10px] text-[#A1A1B0]">End-Diastolic Vol (EDV)</span>
                  <p className="font-mono text-[17px] font-medium text-[#F5F5F7]">
                    {result.edv} <span className="text-[11px] text-[#A1A1B0]">mL</span>
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-2.5">
                  <span className="font-mono text-[10px] text-[#A1A1B0]">End-Systolic Vol (ESV)</span>
                  <p className="font-mono text-[17px] font-medium text-[#F5F5F7]">
                    {result.esv} <span className="text-[11px] text-[#A1A1B0]">mL</span>
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-2.5">
                  <span className="font-mono text-[10px] text-[#A1A1B0]">Stroke Volume (SV)</span>
                  <p className="font-mono text-[17px] font-medium text-[#F5F5F7]">
                    {result.strokeVolume} <span className="text-[11px] text-[#A1A1B0]">mL</span>
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-2.5">
                  <span className="font-mono text-[10px] text-[#A1A1B0]">Cardiac Output (CO)</span>
                  <p className="font-mono text-[17px] font-medium text-[#F5F5F7]">
                    {result.cardiacOutput} <span className="text-[11px] text-[#A1A1B0]">L/min</span>
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] font-mono text-[#A1A1B0]">
                <span>Heart Rate: {result.heartRate} BPM</span>
                <span className="text-[#3DDC97]">Model MAE: 4.84%</span>
              </div>
            </div>
          </div>

          {/* Column 2: Keyframe Inspector & Doctor's Note (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            {/* Keyframe Comparison Viewer */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex-1">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.08)]">
                <div>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#A78BFA]">
                    Optical Ventricular Kinematics
                  </span>
                  <h4 className="text-[15px] font-medium text-[#F5F5F7]">
                    Keyframe Delineation (ED vs. ES)
                  </h4>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showMask}
                    onClick={() => setShowMask(!showMask)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium cursor-pointer ${
                      showMask
                        ? "border-[rgba(61,220,151,0.4)] bg-[rgba(61,220,151,0.12)] text-[#3DDC97]"
                        : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0]"
                    }`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>Mask</span>
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={showHeatmap}
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium cursor-pointer ${
                      showHeatmap
                        ? "border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.12)] text-[#A78BFA]"
                        : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0]"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Grad-CAM</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Keyframes */}
              <div className="grid grid-cols-2 gap-3 mt-3">
                {/* Frame ED */}
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#030306] p-2">
                  <div className="flex items-center justify-between pb-1 font-mono text-[10px]">
                    <span className="text-[#7FD6FF]">FRAME 01 • ED</span>
                    <span className="text-[#A1A1B0]">{result.edv} mL</span>
                  </div>
                  <div className="relative h-36 w-full rounded-lg bg-[#080811] flex items-center justify-center overflow-hidden border border-[rgba(255,255,255,0.04)]">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <path
                        d="M 50,10 L 88,90 A 60,60 0 0,1 12,90 Z"
                        fill="rgba(255,255,255,0.025)"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.5"
                      />
                      {showHeatmap && (
                        <circle cx="50" cy="56" r="28" fill="url(#gradcam-grad-d)" opacity="0.55" />
                      )}
                      <path
                        d="M 50,22 Q 78,40 76,75 Q 50,90 24,75 Q 22,40 50,22 Z"
                        fill="rgba(76,141,255,0.18)"
                        stroke={showMask ? "#3DDC97" : "rgba(255,255,255,0.25)"}
                        strokeWidth={showMask ? "1.8" : "1"}
                        strokeDasharray={showMask ? "none" : "2,2"}
                      />
                      <defs>
                        <radialGradient id="gradcam-grad-d" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#8655FF" stopOpacity="0.8" />
                          <stop offset="60%" stopColor="#4C8DFF" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#050507" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                    <span className="absolute bottom-1 left-2 font-mono text-[8px] text-[#525266]">
                      PEAK DIASTOLE
                    </span>
                  </div>
                </div>

                {/* Frame ES */}
                <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#030306] p-2">
                  <div className="flex items-center justify-between pb-1 font-mono text-[10px]">
                    <span className="text-[#FF4D6D]">FRAME 13 • ES</span>
                    <span className="text-[#A1A1B0]">{result.esv} mL</span>
                  </div>
                  <div className="relative h-36 w-full rounded-lg bg-[#080811] flex items-center justify-center overflow-hidden border border-[rgba(255,255,255,0.04)]">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <path
                        d="M 50,10 L 88,90 A 60,60 0 0,1 12,90 Z"
                        fill="rgba(255,255,255,0.025)"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.5"
                      />
                      {showHeatmap && (
                        <circle cx="50" cy="58" r="22" fill="url(#gradcam-grad-d)" opacity="0.55" />
                      )}
                      <path
                        d="M 50,30 Q 68,45 66,70 Q 50,82 34,70 Q 32,45 50,30 Z"
                        fill="rgba(255,77,109,0.18)"
                        stroke={showMask ? "#FF4D6D" : "rgba(255,255,255,0.25)"}
                        strokeWidth={showMask ? "1.8" : "1"}
                        strokeDasharray={showMask ? "none" : "2,2"}
                      />
                    </svg>
                    <span className="absolute bottom-1 left-2 font-mono text-[8px] text-[#525266]">
                      PEAK SYSTOLE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor's Note / Clinical Impression */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-3.5">
              <div className="flex items-center gap-1.5 pb-1 text-[#3DDC97]">
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#F5F5F7]">
                  Automated Clinical Impression (AI Diagnostic Report)
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-[#A1A1B0]">
                {result.clinicalImpression}
              </p>
            </div>
          </div>

          {/* Column 3: Volume Curve & Model Consensus (3.5 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-3">
            {/* Ventricular Volume-Time Area Chart */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[#A78BFA]">
                  Volume-Time Curve
                </span>
                <span className="font-mono text-[10px] text-[#A1A1B0]">
                  32-Frame Cycle
                </span>
              </div>

              {/* Chart */}
              <div className="h-40 w-full pt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.volumeCurve} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="volumeColorD" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8655FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8655FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="frame"
                      stroke="#525266"
                      tickLine={false}
                      tick={{ fill: "#A1A1B0", fontSize: 10, fontFamily: "Geist Mono" }}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      stroke="#525266"
                      tickLine={false}
                      tick={{ fill: "#A1A1B0", fontSize: 10, fontFamily: "Geist Mono" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0B0B12]/95 p-2 font-mono text-[10px] shadow-xl backdrop-blur-md">
                              <p className="text-[#8655FF]">Frame {data.frame} ({data.timeSec}s)</p>
                              <p className="text-[#F5F5F7] font-medium text-[12px]">{data.volumeMl} mL</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="volumeMl"
                      stroke="#8655FF"
                      strokeWidth={1.8}
                      fillOpacity={1}
                      fill="url(#volumeColorD)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-[10px] font-mono text-[#A1A1B0]">
                <span>EDV: {result.edv} mL</span>
                <span>ESV: {result.esv} mL</span>
                <span className="text-[#7FD6FF]">SV: {result.strokeVolume} mL</span>
              </div>
            </div>

            {/* Model Consensus & Quality Assurance Card */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 space-y-2">
              <div className="flex items-center gap-2 text-[#F5F5F7]">
                <ShieldCheck className="h-4 w-4 text-[#8655FF]" />
                <span className="font-mono text-[11px] font-medium">Model Consensus</span>
              </div>
              <div className="space-y-1 font-mono text-[11px] text-[#A1A1B0]">
                <div className="flex justify-between">
                  <span>3D ResNet Kinematics:</span>
                  <span className="text-[#F5F5F7]">65% Weight</span>
                </div>
                <div className="flex justify-between">
                  <span>Simpson's Biplane Rule:</span>
                  <span className="text-[#F5F5F7]">35% Weight</span>
                </div>
                <div className="flex justify-between">
                  <span>Attention Confidence:</span>
                  <span className="text-[#3DDC97]">{result.attentionConfidence}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#0B0B12] p-6 shadow-2xl text-[#F5F5F7]">
            <div className="flex items-center gap-3 text-[#E03131]">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-[18px] font-medium">Start New Analysis?</h4>
            </div>
            <p className="mt-2 text-[13px] text-[#A1A1B0] leading-relaxed">
              This will clear the current telemetry session for study {result.patientHash} and return to the Upload Studio.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-[12px] text-[#A1A1B0] hover:text-[#F5F5F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onNewAnalysis();
                }}
                className="rounded-lg border border-[#E03131] bg-[#E03131] px-4 py-2 text-[12px] font-medium text-white hover:bg-red-700 cursor-pointer shadow-lg shadow-red-900/40"
              >
                Confirm & Return to Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
