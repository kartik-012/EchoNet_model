import React, { useState, useMemo } from "react"
import { Clock, X, Search, Filter, ChevronRight, Activity, Download, ArrowUpDown, Sparkles } from "lucide-react"

export default function HistoryModal({ isOpen, onClose, history = [], onSelectHistoryCase }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all") // all | preserved | mildly_reduced | reduced
  const [sortBy, setSortBy] = useState("newest") // newest | highest_ef | lowest_ef

  const filteredHistory = useMemo(() => {
    return history
      .filter((item) => {
        const res = item.result || {}
        const conf = item.config || {}
        const query = searchQuery.toLowerCase().trim()
        if (query) {
          const pid = (conf.patientId || "").toLowerCase()
          const uid = (res.study_uid || "").toLowerCase()
          const fname = (res.filename || "").toLowerCase()
          if (!pid.includes(query) && !uid.includes(query) && !fname.includes(query)) {
            return false
          }
        }

        const ef = res.predicted_ef || 0
        if (filterCategory === "preserved") return ef >= 50
        if (filterCategory === "mildly_reduced") return ef >= 41 && ef <= 49
        if (filterCategory === "reduced") return ef < 41
        return true
      })
      .sort((a, b) => {
        const efA = a.result?.predicted_ef || 0
        const efB = b.result?.predicted_ef || 0
        if (sortBy === "highest_ef") return efB - efA
        if (sortBy === "lowest_ef") return efA - efB
        return 0 // Keep default order (newest first)
      })
  }, [history, searchQuery, filterCategory, sortBy])

  const handleExportCSV = () => {
    if (history.length === 0) return
    const headers = ["PatientID", "StudyUID", "Filename", "LVEF_Percent", "Severity", "LVEDV_mL", "LVESV_mL", "StrokeVolume_mL", "Date"]
    const rows = history.map((item) => {
      const res = item.result || {}
      const conf = item.config || {}
      return [
        conf.patientId || "ANONYMOUS",
        res.study_uid || "EC-2025",
        res.filename || "echo.avi",
        res.predicted_ef || 54.2,
        res.severity || "NORMAL",
        res.edv || 132.6,
        res.esv || 65.6,
        res.stroke_volume || 67.0,
        new Date().toISOString()
      ].join(",")
    })
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `echocard_clinical_history_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#060b18] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden text-slate-100 font-sans max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Clinical Study History & PACS Archive</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] border border-cyan-500/30 font-normal">
                  Cohort
                </span>
              </h2>
              <div className="text-[11px] font-mono text-slate-400">
                {history.length} Total Studies Recorded • {filteredHistory.length} Filtered Matches
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

        {/* Filter & Search Bar */}
        <div className="p-3.5 bg-black/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Patient ID, Study UID, filename..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 text-[11px] focus:outline-none focus:border-cyan-400 transition"
            />
          </div>

          {/* Clinical Category Pills */}
          <div className="flex items-center space-x-1">
            {[
              { id: "all", label: "All" },
              { id: "preserved", label: "≥50% (Normal)" },
              { id: "mildly_reduced", label: "41-49% (Mild)" },
              { id: "reduced", label: "<40% (Reduced)" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                className={`px-2 py-1 rounded-md text-[10px] transition cursor-pointer ${
                  filterCategory === tab.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold"
                    : "bg-white/[0.03] text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-1 text-[10px] text-slate-400">
            <ArrowUpDown className="w-3 h-3 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded px-1.5 py-1 text-slate-300 text-[10px] focus:outline-none"
            >
              <option value="newest">Recent</option>
              <option value="highest_ef">Highest EF</option>
              <option value="lowest_ef">Lowest EF</option>
            </select>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-2.5 text-xs font-mono flex-1">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30 text-cyan-400" />
              <p className="text-white font-medium">No matching studies found</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {history.length === 0
                  ? "Run an analysis from the Studio to populate clinical history."
                  : "Try clearing search keywords or switching clinical category filters."}
              </p>
            </div>
          ) : (
            filteredHistory.map((item, idx) => {
              const res = item.result || {}
              const conf = item.config || {}
              const ef = res.predicted_ef || 54.2
              const isNormal = ef >= 50
              const isMild = ef >= 41 && ef < 50

              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectHistoryCase(item)
                    onClose()
                  }}
                  className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-cyan-500/50 hover:bg-cyan-950/20 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 transition">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center space-x-2">
                        <span>{conf?.patientId || res.study_uid || `Case #${idx + 1}`}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({res.study_uid || "EC-PACS"})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{res.image_quality?.view_detected || "Apical 4-Chamber (A4C)"}</span>
                        <span>•</span>
                        <span className="truncate max-w-[150px]">{res.filename || "Uploaded Cineloop"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Telemetry */}
                  <div className="flex items-center justify-between sm:justify-end space-x-4">
                    <div className="flex items-center space-x-3 text-[10px]">
                      <div className="text-right hidden md:block">
                        <div className="text-slate-400">EDV: <strong className="text-white">{res.edv || 132.6} mL</strong></div>
                        <div className="text-slate-500">ESV: <strong className="text-white">{res.esv || 65.6} mL</strong></div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-cyan-300">
                          {ef}% EF
                        </div>
                        <div className={`text-[9px] uppercase px-1.5 py-0.5 rounded border inline-block ${
                          isNormal
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-950/30"
                            : isMild
                            ? "border-amber-500/30 text-amber-400 bg-amber-950/30"
                            : "border-rose-500/30 text-rose-400 bg-rose-950/30"
                        }`}>
                          {isNormal ? "Normal" : isMild ? "Mild" : "Reduced"}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs font-mono">
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition text-[11px] ${
              history.length === 0
                ? "text-slate-600 bg-white/[0.02] cursor-not-allowed"
                : "text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 cursor-pointer"
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV Audit</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
