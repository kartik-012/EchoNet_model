import React from "react"
import { Clock, X, FileText, ChevronRight, Activity } from "lucide-react"

export default function HistoryModal({ isOpen, onClose, history = [], onSelectHistoryCase }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#060b18] border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Clinical Study History
              </h2>
              <div className="text-[11px] font-mono text-slate-400">
                {history.length} Analyzed Cases in Current Session
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 text-xs font-mono">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No previous studies evaluated yet in this session.</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Run an analysis from the Studio to populate clinical history.
              </p>
            </div>
          ) : (
            history.map((item, idx) => {
              const res = item.result
              const conf = item.config
              const isNormal = res.predicted_ef >= 50

              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectHistoryCase(item)
                    onClose()
                  }}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 hover:border-cyan-500/50 hover:bg-cyan-950/20 cursor-pointer transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {conf?.patientId || res.study_uid}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {res.image_quality?.view_detected} • {res.filename || "Uploaded Cineloop"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-bold text-cyan-300">
                        {res.predicted_ef}% EF
                      </div>
                      <div className={`text-[9px] uppercase px-1.5 py-0.5 rounded border inline-block ${
                        isNormal ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"
                      }`}>
                        {res.severity}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
