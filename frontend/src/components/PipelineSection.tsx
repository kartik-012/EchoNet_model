import React, { useState } from "react";
import { GlassCard } from "./ui/GlassCard";
import { Video, Cpu, Scan, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

interface PipelineStep {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  tensorShape: string;
  codeSnippet: string;
  mathematicalBasis: string;
}

export const PipelineSection: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  const steps: PipelineStep[] = [
    {
      id: 1,
      number: "01",
      title: "Video Ingestion & Spatiotemporal QC",
      subtitle: "Apical-4-Chamber Preprocessing",
      description:
        "Raw DICOM and MP4 video recordings are ingested, resampled to 50 FPS, and sliced into 32 contiguous frames. Rigid center-crop normalization produces 112×112 spatiotemporal tensors while filtering acoustic dropouts.",
      icon: Video,
      tensorShape: "Tensor: (Batch, 3, 32, 112, 112) [Float32]",
      codeSnippet: `# Spatiotemporal Volume Tensor Ingestion
def preprocess_echo_volume(video_path: str, clip_len: int = 32):
    frames = load_dicom_or_mp4(video_path)
    resampled = temporal_resample(frames, target_fps=50)
    tensor = normalize_and_crop(resampled, size=(112, 112))
    return torch.from_numpy(tensor).permute(0, 4, 1, 2, 3) # (B, C, T, H, W)`,
      mathematicalBasis: "Input manifold: V in R^{C x T x H x W}, where C=3 channels, T=32 frames, H=W=112 pixels."
    },
    {
      id: 2,
      number: "02",
      title: "Kinematic Keyframe Extraction",
      subtitle: "Automated ED & ES Identification",
      description:
        "Optical flow vectors compute the velocity profile of myocardial wall displacement. The maximum ventricular expansion frame is designated as End-Diastole (ED), and the maximal systolic contraction nadir is designated as End-Systole (ES).",
      icon: Scan,
      tensorShape: "Keyframes: t_ED in [1, 32], t_ES in [1, 32]",
      codeSnippet: `# Kinematic Inflection & Frame Detection
def identify_cardiac_keyframes(displacement_curve: np.ndarray):
    t_ED = np.argmax(displacement_curve) # Peak cavity dilation
    t_ES = np.argmin(displacement_curve[t_ED:]) + t_ED # Peak contraction
    return {"end_diastole": int(t_ED), "end_systole": int(t_ES)}`,
      mathematicalBasis: "ED = argmax_t Area(LV_t),  ES = argmin_t Area(LV_t) for t in cardiac cycle."
    },
    {
      id: 3,
      number: "03",
      title: "Attention-Guided LV Segmentation",
      subtitle: "Endocardial Boundary Delineation",
      description:
        "A customized U-Net augmented with spatial attention gates suppresses ultrasound speckle noise and background tissue artifacts, generating high-fidelity segmentation contours for the left ventricular cavity (Dice = 0.91).",
      icon: Cpu,
      tensorShape: "Mask Output: (Batch, 1, 112, 112) [0.0 - 1.0]",
      codeSnippet: `# Spatial Attention Gate & U-Net Forward Pass
class SpatialAttentionGate(nn.Module):
    def forward(self, g, x):
        psi = self.relu(self.W_g(g) + self.W_x(x))
        alpha = torch.sigmoid(self.psi(psi))
        return x * alpha # Attention-weighted feature map`,
      mathematicalBasis: "Loss = L_{Dice}(M, G) + lambda * L_{BCE}(M, G), yielding Dice score 0.91."
    },
    {
      id: 4,
      number: "04",
      title: "Consensus Volumetrics & Regression",
      subtitle: "Simpson's Biplane & 3D ResNet Fusion",
      description:
        "Integrates continuous 3D ResNet-18 spatiotemporal feature regression with mathematical Simpson's rule (summation of cylindrical disks) to generate clinically plausible Left Ventricular Ejection Fraction (LVEF) estimates.",
      icon: Activity,
      tensorShape: "Regression Target: LVEF in [15.0%, 85.0%]",
      codeSnippet: `# Hybrid Volumetric & Kinematic Consensus
def compute_lvef(edv: float, esv: float, r3d_pred: float):
    simpson_ef = ((edv - esv) / edv) * 100.0
    # Consensus weighting (0.65 3D-CNN + 0.35 Simpson Disk Rule)
    consensus_ef = 0.65 * r3d_pred + 0.35 * simpson_ef
    return float(np.clip(consensus_ef, 15.0, 85.0))`,
      mathematicalBasis: "LVEF = [(EDV - ESV) / EDV] x 100%, regularized by R3D-18 spatio-temporal embeddings."
    }
  ];

  const currentStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <section
      id="pipeline"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B12] border-t border-[rgba(255,255,255,0.06)]"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1.5 backdrop-blur-md mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8655FF]" />
            <span className="font-mono text-[11px] tracking-wider text-[#A1A1B0] uppercase">
              End-to-End Deep Learning Architecture
            </span>
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-medium tracking-tight text-[#F5F5F7] leading-tight">
            The EchoNet-AI Processing Pipeline
          </h2>
          <p className="mt-3 text-[15px] text-[#A1A1B0] leading-relaxed">
            From raw ultrasound DICOM cine loops to automated ejection fraction estimation in 1.15 seconds.
            Select any processing stage to inspect mathematical representations and active tensor schemas.
          </p>
        </div>

        {/* 2-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 4 Interactive Pipeline Step Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === activeStepId;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`group relative rounded-[16px] border p-5 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-[rgba(134,85,255,0.5)] bg-[rgba(134,85,255,0.08)] shadow-[0_12px_32px_rgba(134,85,255,0.15)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.18)] hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                          isActive
                            ? "border-[rgba(134,85,255,0.6)] bg-[#8655FF] text-white"
                            : "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] text-[#A1A1B0] group-hover:text-[#F5F5F7]"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-mono text-[11px] font-medium text-[#8655FF]">
                          STAGE {step.number}
                        </span>
                        <h3 className="text-[16px] font-medium text-[#F5F5F7]">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    {isActive && (
                      <CheckCircle2 className="h-5 w-5 text-[#8655FF] shrink-0" />
                    )}
                  </div>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-[#A1A1B0]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Code & Tensor Inspector Panel (7 cols) */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                <div>
                  <span className="font-mono text-[11px] text-[#A78BFA] uppercase tracking-wider">
                    Active Subsystem Inspector • Stage {currentStep.number}
                  </span>
                  <h4 className="text-[20px] font-medium text-[#F5F5F7] mt-0.5">
                    {currentStep.subtitle}
                  </h4>
                </div>
                <div className="rounded-full border border-[rgba(127,214,255,0.3)] bg-[rgba(127,214,255,0.08)] px-3 py-1 font-mono text-[11px] text-[#7FD6FF]">
                  {currentStep.tensorShape}
                </div>
              </div>

              {/* Mathematical Formulations */}
              <div className="mt-5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.35)] p-3.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1B0]">
                  Mathematical Formulation
                </span>
                <p className="mt-1 font-mono text-[13px] text-[#F5F5F7]">
                  {currentStep.mathematicalBasis}
                </p>
              </div>

              {/* Live Code Implementation Preview */}
              <div className="mt-4">
                <div className="flex items-center justify-between pb-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1B0]">
                    Python / PyTorch Architecture Kernel
                  </span>
                  <span className="font-mono text-[10px] text-[#525266]">
                    echonet_engine.py
                  </span>
                </div>
                <pre className="overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#050507] p-4 font-mono text-[12px] leading-relaxed text-[#A78BFA]">
                  <code>{currentStep.codeSnippet}</code>
                </pre>
              </div>

              {/* Pipeline Flow Stepper Footer */}
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-[rgba(255,255,255,0.08)] text-[12px] text-[#A1A1B0]">
                <span>Stage {activeStepId} of 4</span>
                <button
                  onClick={() =>
                    setActiveStepId((prev) => (prev % 4) + 1)
                  }
                  className="flex items-center gap-1.5 text-[#8655FF] hover:text-[#A78BFA] font-medium cursor-pointer"
                >
                  <span>Advance Pipeline Stage</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};
