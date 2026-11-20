import React, { useState } from "react";
import { X, Video, Cpu, Scan, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PipelineModal: React.FC<PipelineModalProps> = ({ isOpen, onClose }) => {
  const [activeStepId, setActiveStepId] = useState<number>(1);

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      number: "01",
      title: "Video Ingestion & Spatiotemporal QC",
      subtitle: "Apical-4-Chamber Preprocessing",
      description:
        "Raw DICOM and MP4 recordings are resampled to 50 FPS and sliced into 32 contiguous frames. Center cropping normalizes inputs into (1, 3, 32, 112, 112) tensors.",
      icon: Video,
      tensorShape: "Tensor: (1, 3, 32, 112, 112) [Float32]",
      codeSnippet: `def preprocess_echo_volume(video_path: str, clip_len: int = 32):
    frames = load_dicom_or_mp4(video_path)
    resampled = temporal_resample(frames, target_fps=50)
    tensor = normalize_and_crop(resampled, size=(112, 112))
    return torch.from_numpy(tensor).permute(0, 4, 1, 2, 3)`
    },
    {
      id: 2,
      number: "02",
      title: "Kinematic Keyframe Extraction",
      subtitle: "Automated ED & ES Identification",
      description:
        "Optical flow velocity profiles determine peak cavity expansion (End-Diastole, ED) and maximal contraction (End-Systole, ES).",
      icon: Scan,
      tensorShape: "Keyframes: t_ED, t_ES in [1..32]",
      codeSnippet: `def identify_cardiac_keyframes(displacement_curve: np.ndarray):
    t_ED = np.argmax(displacement_curve)
    t_ES = np.argmin(displacement_curve[t_ED:]) + t_ED
    return {"end_diastole": int(t_ED), "end_systole": int(t_ES)}`
    },
    {
      id: 3,
      number: "03",
      title: "Attention-Guided LV Segmentation",
      subtitle: "Endocardial Boundary Delineation",
      description:
        "A customized U-Net augmented with spatial attention gates filters ultrasound speckle noise and yields precise myocardial contours (Dice 0.91).",
      icon: Cpu,
      tensorShape: "Mask Output: (1, 1, 112, 112)",
      codeSnippet: `class SpatialAttentionGate(nn.Module):
    def forward(self, g, x):
        psi = self.relu(self.W_g(g) + self.W_x(x))
        alpha = torch.sigmoid(self.psi(psi))
        return x * alpha`
    },
    {
      id: 4,
      number: "04",
      title: "Consensus Volumetrics & Regression",
      subtitle: "Simpson's Biplane & 3D ResNet Fusion",
      description:
        "Blends mathematical Simpson's rule with continuous 3D ResNet-18 spatiotemporal feature embeddings for robust clinical predictions.",
      icon: Activity,
      tensorShape: "Regression Target: LVEF in [15%..85%]",
      codeSnippet: `def compute_lvef(edv: float, esv: float, r3d_pred: float):
    simpson_ef = ((edv - esv) / edv) * 100.0
    consensus_ef = 0.65 * r3d_pred + 0.35 * simpson_ef
    return float(np.clip(consensus_ef, 15.0, 85.0))`
    }
  ];

  const currentStep = steps.find((s) => s.id === activeStepId) || steps[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#0B0B12] p-6 sm:p-8 shadow-2xl text-[#F5F5F7]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-[#A1A1B0] hover:text-white hover:bg-[rgba(255,255,255,0.06)] cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.1)] text-[#8655FF]">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[11px] font-medium text-[#8655FF] uppercase tracking-wider">
              Neural Processing Specification
            </span>
            <h3 className="text-[22px] font-medium text-[#F5F5F7]">
              EchoNet-AI Deep Learning Architecture
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-3">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === activeStepId;
              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStepId(step.id)}
                  className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                    isActive
                      ? "border-[rgba(134,85,255,0.5)] bg-[rgba(134,85,255,0.08)]"
                      : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,255,255,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isActive ? "bg-[#8655FF] text-white" : "text-[#A1A1B0]"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] text-[#8655FF]">STAGE {step.number}</span>
                        <h4 className="text-[14px] font-medium text-[#F5F5F7]">{step.title}</h4>
                      </div>
                    </div>
                    {isActive && <CheckCircle2 className="h-4 w-4 text-[#8655FF]" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="md:col-span-7 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.35)] p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[rgba(255,255,255,0.08)]">
              <div>
                <span className="font-mono text-[10px] text-[#A78BFA] uppercase">Stage {currentStep.number} Inspector</span>
                <h4 className="text-[16px] font-medium text-[#F5F5F7]">{currentStep.subtitle}</h4>
              </div>
              <span className="rounded-full border border-[rgba(127,214,255,0.3)] bg-[rgba(127,214,255,0.08)] px-2.5 py-0.5 font-mono text-[10px] text-[#7FD6FF]">
                {currentStep.tensorShape}
              </span>
            </div>

            <p className="mt-3 text-[13px] leading-relaxed text-[#A1A1B0]">{currentStep.description}</p>

            <div className="mt-4">
              <span className="font-mono text-[10px] uppercase text-[#A1A1B0]">PyTorch Kernel Snippet:</span>
              <pre className="mt-1 overflow-x-auto rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#050507] p-3 font-mono text-[11px] text-[#A78BFA]">
                <code>{currentStep.codeSnippet}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
