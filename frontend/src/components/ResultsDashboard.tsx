import React, { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import {
  Download,
  FileCode,
  RotateCcw,
  Eye,
  Activity,
  Layers,
  Heart,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import type { StudyResult } from "../lib/api";

interface ResultsDashboardProps {
  result: StudyResult | null;
  onReset: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onReset
}) => {
  const [showMask, setShowMask] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!result) {
    return (
      <section
        id="results"
        className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B12] border-t border-[rgba(255,255,255,0.06)]"
      >
        <div className="mx-auto max-w-4xl text-center py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0] mb-4">
            <Activity className="h-7 w-7" />
          </div>
          <h2 className="text-[24px] font-medium text-[#F5F5F7]">
            No echocardiogram study analyzed yet.
          </h2>
          <p className="mt-2 text-[14px] text-[#A1A1B0] max-w-md mx-auto">
            Select a clinical preset or upload a transthoracic video in the Analyze Studio above to compute Left Ventricular Ejection Fraction telemetry.
          </p>
          <a
            href="#analyze"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(134,85,255,0.5)] bg-[#8655FF] px-6 py-2.5 text-[13px] font-medium text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105"
          >
            <span>Open Analyze Studio</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    );
  }

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
    <section
      id="results"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B12] border-t border-[rgba(255,255,255,0.06)]"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Top Header with Telemetry Badges */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-[rgba(255,255,255,0.08)] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1 mb-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.color }} />
              <span className="font-mono text-[11px] text-[#A1A1B0] uppercase">
                PACS Study ID: {result.patientHash}
              </span>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-medium tracking-tight text-[#F5F5F7]">
              Clinical Analysis Dashboard
            </h2>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportPdf}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3.5 py-2 text-[12px] font-medium text-[#F5F5F7] transition-colors hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#7FD6FF]" />
              <span>Export Clinical PDF</span>
            </button>

            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-3.5 py-2 text-[12px] font-medium text-[#F5F5F7] transition-colors hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)] cursor-pointer"
            >
              <FileCode className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>Download JSON Masks</span>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-[rgba(224,49,49,0.3)] bg-[rgba(224,49,49,0.06)] px-3.5 py-2 text-[12px] font-medium text-[#E03131] transition-colors hover:bg-[rgba(224,49,49,0.15)] cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Studio</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Primary LVEF Gauge & Hemodynamics (4 cols) */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            {/* LVEF Dial Card */}
            <GlassCard className="p-6 text-center">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A1A1B0]">
                Left Ventricular Ejection Fraction
              </span>

              {/* Segmented Circular Dial Gauge */}
              <div className="relative mx-auto my-6 flex h-48 w-48 items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 120 120">
                  {/* Gauge Track */}
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
                  {/* Active Value Segment */}
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

                {/* Inner Readout */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-[46px] font-medium text-[#F5F5F7] tracking-tight">
                    {result.lvef.toFixed(1)}%
                  </span>
                  <span className="font-mono text-[11px] text-[#A1A1B0]">
                    95% CI: [{result.confidenceInterval[0].toFixed(1)}% - {result.confidenceInterval[1].toFixed(1)}%]
                  </span>
                </div>
              </div>

              {/* Clinical Category Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-medium"
                style={{
                  backgroundColor: theme.bgAlpha,
                  borderColor: theme.border,
                  color: theme.color
                }}
              >
                <Heart className="h-3.5 w-3.5 fill-current" />
                <span>{result.categoryLabel}</span>
              </div>
            </GlassCard>

            {/* Hemodynamic Biomarker Values */}
            <GlassCard className="p-6">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A1A1B0]">
                Quantitative Hemodynamics
              </span>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-3">
                  <span className="font-mono text-[11px] text-[#A1A1B0]">EDV (End-Diastole)</span>
                  <p className="mt-1 font-mono text-[20px] font-medium text-[#F5F5F7]">
                    {result.edv} <span className="text-[12px] text-[#A1A1B0]">mL</span>
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-3">
                  <span className="font-mono text-[11px] text-[#A1A1B0]">ESV (End-Systole)</span>
                  <p className="mt-1 font-mono text-[20px] font-medium text-[#F5F5F7]">
                    {result.esv} <span className="text-[12px] text-[#A1A1B0]">mL</span>
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-3">
                  <span className="font-mono text-[11px] text-[#A1A1B0]">Stroke Volume</span>
                  <p className="mt-1 font-mono text-[20px] font-medium text-[#F5F5F7]">
                    {result.strokeVolume} <span className="text-[12px] text-[#A1A1B0]">mL</span>
                  </p>
                </div>

                <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.3)] p-3">
                  <span className="font-mono text-[11px] text-[#A1A1B0]">Heart Rate</span>
                  <p className="mt-1 font-mono text-[20px] font-medium text-[#F5F5F7]">
                    {result.heartRate} <span className="text-[12px] text-[#A1A1B0]">BPM</span>
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Column 2: Keyframe Viewer & Volume-Time Curve (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            {/* Keyframe Comparison Viewer */}
            <GlassCard className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <div>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A78BFA]">
                    Optical Ventricular Kinematics
                  </span>
                  <h3 className="text-[18px] font-medium text-[#F5F5F7]">
                    Keyframe Comparison: End-Diastole vs. End-Systole
                  </h3>
                </div>

                {/* Overlay Toggle Switches with Accessible Roles */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showMask}
                    onClick={() => setShowMask(!showMask)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                      showMask
                        ? "border-[rgba(61,220,151,0.4)] bg-[rgba(61,220,151,0.12)] text-[#3DDC97]"
                        : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0]"
                    }`}
                  >
                    <Layers className="h-3 w-3" />
                    <span>Segmentation Mask</span>
                  </button>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={showHeatmap}
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                      showHeatmap
                        ? "border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.12)] text-[#A78BFA]"
                        : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0]"
                    }`}
                  >
                    <Eye className="h-3 w-3" />
                    <span>Grad-CAM Saliency</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Frames */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* End-Diastole View */}
                <div className="relative rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#050507] p-3 overflow-hidden">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-mono text-[11px] font-medium text-[#7FD6FF]">
                      FRAME 01 • END-DIASTOLE (ED)
                    </span>
                    <span className="font-mono text-[11px] text-[#A1A1B0]">
                      Vol: {result.edv} mL
                    </span>
                  </div>

                  {/* Synthetic Echocardiogram Canvas */}
                  <div className="relative h-48 w-full rounded-lg bg-[#080811] flex items-center justify-center overflow-hidden border border-[rgba(255,255,255,0.04)]">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      {/* Ultrasound sector cone */}
                      <path
                        d="M 50,10 L 88,90 A 60,60 0 0,1 12,90 Z"
                        fill="rgba(255,255,255,0.025)"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.5"
                      />
                      {/* Grad-CAM Heatmap overlay */}
                      {showHeatmap && (
                        <circle
                          cx="50"
                          cy="56"
                          r="28"
                          fill="url(#gradcam-grad)"
                          opacity="0.55"
                        />
                      )}
                      {/* Ventricular Cavity ED (expanded) */}
                      <path
                        d="M 50,22 Q 78,40 76,75 Q 50,90 24,75 Q 22,40 50,22 Z"
                        fill="rgba(76,141,255,0.18)"
                        stroke={showMask ? "#3DDC97" : "rgba(255,255,255,0.25)"}
                        strokeWidth={showMask ? "1.8" : "1"}
                        strokeDasharray={showMask ? "none" : "2,2"}
                      />
                      <defs>
                        <radialGradient id="gradcam-grad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#8655FF" stopOpacity="0.8" />
                          <stop offset="60%" stopColor="#4C8DFF" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#050507" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                    <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#525266]">
                      A4C • MAX EXPANSION
                    </div>
                  </div>
                </div>

                {/* End-Systole View */}
                <div className="relative rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#050507] p-3 overflow-hidden">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-mono text-[11px] font-medium text-[#FF4D6D]">
                      FRAME 13 • END-SYSTOLE (ES)
                    </span>
                    <span className="font-mono text-[11px] text-[#A1A1B0]">
                      Vol: {result.esv} mL
                    </span>
                  </div>

                  {/* Synthetic Echocardiogram Canvas */}
                  <div className="relative h-48 w-full rounded-lg bg-[#080811] flex items-center justify-center overflow-hidden border border-[rgba(255,255,255,0.04)]">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      {/* Ultrasound sector cone */}
                      <path
                        d="M 50,10 L 88,90 A 60,60 0 0,1 12,90 Z"
                        fill="rgba(255,255,255,0.025)"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="0.5"
                      />
                      {/* Grad-CAM Heatmap overlay */}
                      {showHeatmap && (
                        <circle
                          cx="50"
                          cy="58"
                          r="22"
                          fill="url(#gradcam-grad)"
                          opacity="0.55"
                        />
                      )}
                      {/* Ventricular Cavity ES (contracted) */}
                      <path
                        d="M 50,30 Q 68,45 66,70 Q 50,82 34,70 Q 32,45 50,30 Z"
                        fill="rgba(255,77,109,0.18)"
                        stroke={showMask ? "#FF4D6D" : "rgba(255,255,255,0.25)"}
                        strokeWidth={showMask ? "1.8" : "1"}
                        strokeDasharray={showMask ? "none" : "2,2"}
                      />
                    </svg>
                    <div className="absolute bottom-2 left-2 font-mono text-[9px] text-[#525266]">
                      A4C • MAX CONTRACTION
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Ventricular Volume-Time Area Chart */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between pb-3">
                <div>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#A78BFA]">
                    Hemodynamic Continuum
                  </span>
                  <h3 className="text-[18px] font-medium text-[#F5F5F7]">
                    Ventricular Volume-Time Curve (32 Frames)
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-[#A1A1B0]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3DDC97]" />
                    <span>EDV: {result.edv} mL</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#FF4D6D]" />
                    <span>ESV: {result.esv} mL</span>
                  </span>
                </div>
              </div>

              {/* Recharts Area Chart */}
              <div className="h-56 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.volumeCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="volumeColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8655FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8655FF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="frame"
                      stroke="#525266"
                      tickLine={false}
                      tick={{ fill: "#A1A1B0", fontSize: 11, fontFamily: "Geist Mono" }}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      stroke="#525266"
                      tickLine={false}
                      tick={{ fill: "#A1A1B0", fontSize: 11, fontFamily: "Geist Mono" }}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border border-[rgba(255,255,255,0.12)] bg-[#0B0B12]/95 p-2.5 font-mono text-[11px] shadow-xl backdrop-blur-md">
                              <p className="text-[#8655FF]">Frame {data.frame} ({data.timeSec}s)</p>
                              <p className="text-[#F5F5F7] font-medium text-[13px]">{data.volumeMl} mL</p>
                              <p className="text-[#A1A1B0] uppercase text-[9px]">{data.phase}</p>
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
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#volumeColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Automated Clinical Impression Paragraph */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-2 pb-2">
                <CheckCircle2 className="h-4 w-4 text-[#3DDC97]" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#F5F5F7]">
                  Automated AI Clinical Impression
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-[#A1A1B0]">
                {result.clinicalImpression}
              </p>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#0B0B12] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-[#E03131]">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="text-[18px] font-medium text-[#F5F5F7]">
                Reset Analysis Studio?
              </h4>
            </div>
            <p className="mt-2 text-[14px] text-[#A1A1B0] leading-relaxed">
              This will clear the current telemetry session for study {result.patientHash} and return the laboratory to its initial upload state.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-[rgba(255,255,255,0.1)] px-4 py-2 text-[13px] text-[#A1A1B0] hover:text-[#F5F5F7] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false);
                  onReset();
                }}
                className="rounded-lg border border-[#E03131] bg-[#E03131] px-4 py-2 text-[13px] font-medium text-white hover:bg-red-700 cursor-pointer shadow-lg shadow-red-900/40"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
