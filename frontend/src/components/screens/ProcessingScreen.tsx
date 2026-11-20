import React, { useEffect, useState } from "react";
import {
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  Scan,
  ArrowRight
} from "lucide-react";
import {
  runMockInference,
  type ClinicalPresetId,
  type ProcessingState,
  type StudyResult
} from "../../lib/api";

interface ProcessingScreenProps {
  presetId: ClinicalPresetId;
  fileName: string;
  onInferenceFinished: (result: StudyResult) => void;
}

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  presetId,
  fileName,
  onInferenceFinished
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [finalResult, setFinalResult] = useState<StudyResult | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const addLog = (msg: string) => {
      if (!isCancelled) {
        setLogs((prev) => [...prev, `[${new Date().toISOString().substring(11, 19)}] ${msg}`]);
      }
    };

    addLog(`Initiating clinical session for study: ${fileName}`);
    addLog(`Allocating PyTorch tensor memory: torch.Size([1, 3, 32, 112, 112])`);

    const executeInference = async () => {
      try {
        const result = await runMockInference(presetId, (state: ProcessingState) => {
          if (isCancelled) return;
          setCurrentStage(state.stage);
          setProgressPercent(state.progressPercent);

          if (state.stage === 1) {
            addLog(`STAGE 1: Parsing 32 B-mode frames at 50 FPS... Completed.`);
            addLog(`Spatiotemporal crop: normalized 112x112 center bounding box.`);
          } else if (state.stage === 2) {
            addLog(`STAGE 2: Spatial attention gating isolating apical four-chamber cavity.`);
            addLog(`Ultrasound speckle noise suppressed via learned attention maps.`);
          } else if (state.stage === 3) {
            addLog(`STAGE 3: Delineating endocardial border at End-Diastole & End-Systole.`);
            addLog(`Segmentation Dice similarity coefficient: 0.912.`);
          } else if (state.stage === 4) {
            addLog(`STAGE 4: Computing Simpson's method of disks + R3D-18 continuous regression.`);
            addLog(`Consensus fusion complete: LVEF = ${result.lvef}% (95% CI: ${result.confidenceInterval[0]}% - ${result.confidenceInterval[1]}%).`);
            addLog(`SUCCESS: Clinical dossier generated in 1.15s.`);
          }
        });

        if (!isCancelled) {
          setFinalResult(result);
          // Auto advance to results after 800ms
          setTimeout(() => {
            if (!isCancelled) {
              onInferenceFinished(result);
            }
          }, 800);
        }
      } catch (err) {
        addLog(`ERROR: Inference failed during stage execution.`);
      }
    };

    executeInference();

    return () => {
      isCancelled = true;
    };
  }, [presetId, fileName, onInferenceFinished]);

  return (
    <div className="h-full w-full overflow-hidden bg-[#050507] px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col justify-between h-full max-h-[820px]">
        {/* Header */}
        <div className="text-center pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.08)] px-3.5 py-1 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-[#8655FF] animate-spin" />
            <span className="font-mono text-[11px] text-[#A78BFA] uppercase tracking-wider">
              PACS DEEP LEARNING WORKER ACTIVE
            </span>
          </div>
          <h2 className="text-[26px] sm:text-[32px] font-medium tracking-tight text-[#F5F5F7]">
            Processing Echocardiogram Study
          </h2>
          <p className="font-mono text-[13px] text-[#A1A1B0] mt-1">
            {fileName} • 3D ResNet-18 Spatiotemporal Kinematics
          </p>
        </div>

        {/* Central Visualizer: Ultrasound Scanning Hologram & Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-center">
          {/* Hologram / Ultrasound Sector Scanner (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative h-60 w-60 rounded-full border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.02)] p-4 flex items-center justify-center shadow-[0_0_50px_rgba(134,85,255,0.15)]">
              {/* Radar Sweeper */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-[rgba(76,141,255,0.3)] animate-spin"
                style={{ animationDuration: "6s" }}
              />

              {/* Heartbeat Pulse Ring */}
              <div className="absolute h-40 w-40 rounded-full border border-[rgba(255,77,109,0.3)] animate-ping" />

              {/* Central Ultrasound Cone Graphic */}
              <svg className="h-44 w-44" viewBox="0 0 100 100">
                <path
                  d="M 50,15 L 85,85 A 45,45 0 0,1 15,85 Z"
                  fill="rgba(134,85,255,0.08)"
                  stroke="#8655FF"
                  strokeWidth="1.2"
                />
                {/* Ventricular cavity shape */}
                <path
                  d="M 50,28 Q 72,45 70,72 Q 50,82 30,72 Q 28,45 50,28 Z"
                  fill="none"
                  stroke="#3DDC97"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                {/* Scanning line sweep */}
                <line
                  x1="50"
                  y1="15"
                  x2="50"
                  y2="85"
                  stroke="#7FD6FF"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              </svg>

              {/* Inner Center Percentage Readout */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-mono text-[38px] font-medium text-[#F5F5F7] tracking-tight">
                  {progressPercent}%
                </span>
                <span className="font-mono text-[10px] text-[#3DDC97] uppercase">
                  {currentStage === 4 && progressPercent === 100 ? "Inference Complete" : "Inferring..."}
                </span>
              </div>
            </div>
          </div>

          {/* Stepper Progress & Live Logs (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* 4-Stage Clinical Stepper */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 space-y-3">
              {[
                { stage: 1, name: "Parsing Spatiotemporal Tensors", desc: "112x112 center crop, 32 frames" },
                { stage: 2, name: "Spatial Attention Gating", desc: "Isolating left ventricular chamber" },
                { stage: 3, name: "Endocardial Boundary Delineation", desc: "Segmenting ED & ES contours (Dice 0.91)" },
                { stage: 4, name: "Consensus Volumetrics & Regression", desc: "Simpson's disks + 3D ResNet-18" }
              ].map((s) => {
                const isDone = currentStage > s.stage || (currentStage === 4 && progressPercent === 100);
                const isCurrent = currentStage === s.stage && progressPercent < 100;

                return (
                  <div key={s.stage} className="flex items-center gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] transition-all ${
                        isDone
                          ? "bg-[#3DDC97] text-black font-semibold"
                          : isCurrent
                          ? "border border-[#8655FF] bg-[#8655FF] text-white animate-pulse"
                          : "border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0]"
                      }`}
                    >
                      {isDone ? "✓" : s.stage}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[13px]">
                        <span className={isCurrent || isDone ? "text-[#F5F5F7] font-medium" : "text-[#A1A1B0]"}>
                          {s.name}
                        </span>
                        <span className="font-mono text-[11px] text-[#A1A1B0]">
                          {isDone ? "100%" : isCurrent ? `${progressPercent}%` : "Pending"}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#525266]">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Terminal Log Stream */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#030305] p-3 font-mono text-[11px] h-36 overflow-y-auto space-y-1">
              <div className="flex items-center gap-2 pb-1 border-b border-[rgba(255,255,255,0.06)] text-[#8655FF] text-[10px] uppercase">
                <Terminal className="h-3 w-3" />
                <span>PACS CUDA Inference Stream</span>
              </div>
              {logs.map((log, idx) => (
                <p key={idx} className="text-[#A1A1B0] leading-relaxed">
                  <span className="text-[#8655FF]">&gt;</span> {log}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Manual Bypass in case user wants instant click */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-[#A1A1B0]">
            <Activity className="h-4 w-4 text-[#8655FF]" />
            <span>Stanford EchoNet-Dynamic Model Loaded • PyTorch 2.4 C++ Runtime</span>
          </div>

          {finalResult && (
            <button
              onClick={() => onInferenceFinished(finalResult)}
              className="flex items-center gap-2 rounded-full border border-[rgba(61,220,151,0.5)] bg-[#3DDC97] px-5 py-2 text-[13px] font-medium text-black hover:bg-[#34c787] cursor-pointer shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105"
            >
              <span>View Clinical Report Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
