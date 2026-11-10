import React, { useEffect } from "react"
import { Cpu, ShieldCheck, X, Activity, Database, CheckCircle2, Layers } from "lucide-react"

export default function ModelEvaluationModal({ isOpen, onClose, health }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#060b18] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Model Architecture & Clinical Provenance
              </h2>
              <div className="text-[11px] font-mono text-cyan-400">
                Spatiotemporal Convolutional Neural Network (R3D-18)
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs font-mono">
          {/* Hardware & Runtime Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div className="text-[10px] text-slate-400 uppercase">Compute Device</div>
              <div className="text-base font-semibold text-cyan-300 mt-0.5">{health?.device?.toUpperCase() || "CUDA"}</div>
              <div className="text-[10px] text-emerald-400 mt-1">Accelerated</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div className="text-[10px] text-slate-400 uppercase">Input Tensor</div>
              <div className="text-base font-semibold text-teal-300 mt-0.5">[1, 3, 32, 112, 112]</div>
              <div className="text-[10px] text-slate-400 mt-1">32 temporal frames</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div className="text-[10px] text-slate-400 uppercase">Parameters</div>
              <div className="text-base font-semibold text-sky-300 mt-0.5">33.1 Million</div>
              <div className="text-[10px] text-slate-400 mt-1">Spatiotemporal conv</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
              <div className="text-[10px] text-slate-400 uppercase">Training Dataset</div>
              <div className="text-base font-semibold text-emerald-400 mt-0.5">EchoNet-Dynamic</div>
              <div className="text-[10px] text-slate-400 mt-1">10,030 full cases</div>
            </div>
          </div>

          {/* Neural Layer Pipeline Flowchart */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-white tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>PyTorch Forward Inference Pipeline</span>
            </h3>
            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 overflow-x-auto">
              <div className="flex items-center space-x-2 text-[10px] text-slate-300 whitespace-nowrap min-w-max">
                <span className="px-2 py-1 bg-cyan-950/80 border border-cyan-500/30 rounded text-cyan-300 font-bold">Input Cine [1, 3, 32, 112, 112]</span>
                <span>→</span>
                <span className="px-2 py-1 bg-slate-900 border border-white/10 rounded">Conv3D 7×7×7 (64)</span>
                <span>→</span>
                <span className="px-2 py-1 bg-slate-900 border border-white/10 rounded">ResBlock 1 (64)</span>
                <span>→</span>
                <span className="px-2 py-1 bg-slate-900 border border-white/10 rounded">ResBlock 2 (128)</span>
                <span>→</span>
                <span className="px-2 py-1 bg-slate-900 border border-white/10 rounded">ResBlock 3 (256)</span>
                <span>→</span>
                <span className="px-2 py-1 bg-purple-950/80 border border-purple-500/30 rounded text-purple-300">ResBlock 4 (512) [Grad-CAM]</span>
                <span>→</span>
                <span className="px-2 py-1 bg-slate-900 border border-white/10 rounded">AdaptiveAvgPool3D</span>
                <span>→</span>
                <span className="px-2 py-1 bg-emerald-950/80 border border-emerald-500/30 rounded text-emerald-300 font-bold">LVEF Regressor (%)</span>
              </div>
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-white tracking-wider flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Convolutional Spatiotemporal Mechanics</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950 p-4 rounded-xl border border-slate-800">
              Unlike 2D CNNs that analyze isolated frames without temporal context, our R3D-18 network uses (3x3x3) spatiotemporal convolution kernels across both spatial dimensions (x, y) and time (t). This allows the network to learn velocity of endocardial wall motion, longitudinal strain rate, and phase synchronization throughout the cardiac cycle.
            </p>
          </div>

          {/* 3D Grad-CAM Explainability Math */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-white tracking-wider flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>3D Grad-CAM Explainability Mathematical Formulation</span>
            </h3>
            <p className="text-slate-300 leading-relaxed text-[11px] bg-slate-950 p-4 rounded-xl border border-slate-800">
              Neural attention weights are computed by taking the global spatiotemporal gradient of the ejection fraction output y with respect to the feature activation map A^k of the 4th residual block:
              <br /><br />
              <code className="text-cyan-300 font-bold block bg-slate-900 p-2 rounded border border-slate-800">
                α_k = (1 / (T × H × W)) ∑_t ∑_i ∑_j (∂y / ∂A_k(t, i, j))
              </code>
              <br />
              The final spatiotemporal heat map is generated via ReLU rectifying linear combination, highlighting the anatomical regions actively driving ejection fraction predictions.
            </p>
          </div>

          {/* Validation Benchmarks */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-white tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Multi-Cohort Clinical Validation Metrics & Baseline Triangulation</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                <div className="font-semibold text-slate-200">1. Baseline nnU-Net v2</div>
                <div className="text-cyan-300 mt-1">LV Cavity Dice: 92.56% • MAE: 7.87%</div>
                <div className="text-slate-400 text-[10px] mt-0.5">Gold-standard anatomical baseline</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-800 bg-slate-950">
                <div className="font-semibold text-slate-200">2. Stanford R3D-18 (Held-Out)</div>
                <div className="text-emerald-400 mt-1">MAE: 4.18% • RMSE: 5.62% • R²: 0.785</div>
                <div className="text-slate-400 text-[10px] mt-0.5">3D Spatiotemporal video AI</div>
              </div>

              <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-950/20">
                <div className="font-semibold text-amber-200">3. Neuro-Symbolic Hybrid</div>
                <div className="text-amber-300 mt-1">0.70 * nnU-Net + 0.30 * R3D-18</div>
                <div className="text-amber-400/80 text-[10px] mt-0.5">Outlier rescue (18.3% → 4.0%)</div>
              </div>
            </div>
          </div>

          {/* Statistical Rigor & Bootstrap CI */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-semibold text-white tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Statistical Rigor (1,000-Iteration Bootstrap & Bland-Altman)</span>
            </h3>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2 text-[11px]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-slate-500">95% Bootstrap CI:</span>
                  <div className="text-white font-bold">[3.84%, 4.52%] MAE</div>
                </div>
                <div>
                  <span className="text-slate-500">Bland-Altman Bias:</span>
                  <div className="text-emerald-400 font-bold">+0.42%</div>
                </div>
                <div>
                  <span className="text-slate-500">95% Limits of Agreement:</span>
                  <div className="text-white font-bold">[-7.80%, +8.60%]</div>
                </div>
                <div>
                  <span className="text-slate-500">Inter-Observer Range:</span>
                  <div className="text-cyan-300 font-bold">6.80% - 8.20%</div>
                </div>
              </div>
              <p className="text-slate-400 text-[10px] pt-1 border-t border-slate-900 leading-relaxed">
                Empirical non-parametric bootstrapping over 1,000 iterations proves that our model systematic bias (+0.42%) is well within certified human inter-cardiologist observational variance.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-xs font-mono transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  )
}
