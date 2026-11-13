import React, { useState, useEffect, useRef } from "react"
import { Search, Command, ArrowRight, X, Sparkles, Sliders, Shield, History, Eye, FileText, Play, MoveRight } from "lucide-react"

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onNavigate,
  onToggleContrast,
  onOpenModelInfo,
  onOpenHistory,
  onExportPDF,
  hasReport,
  highContrast
}) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const commands = [
    {
      id: "nav-intro",
      title: "Switch to 3D Cinematic Intro",
      category: "Navigation",
      hotkey: "1",
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => { onNavigate("intro"); onClose() }
    },
    {
      id: "nav-studio",
      title: "Switch to DICOM Upload Studio",
      category: "Navigation",
      hotkey: "2",
      icon: <Sliders className="w-4 h-4 text-teal-400" />,
      action: () => { onNavigate("studio"); onClose() }
    },
    {
      id: "nav-report",
      title: "View Clinical Intelligence Report",
      category: "Navigation",
      hotkey: "3",
      disabled: !hasReport,
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      action: () => { if (hasReport) { onNavigate("report"); onClose() } }
    },
    {
      id: "action-pdf",
      title: "Export Clinical PDF Dossier",
      category: "Clinical Export",
      hotkey: "P",
      disabled: !hasReport,
      icon: <FileText className="w-4 h-4 text-amber-400" />,
      action: () => { if (hasReport && onExportPDF) { onExportPDF(); onClose() } }
    },
    {
      id: "action-contrast",
      title: highContrast ? "Disable High-Contrast Mode" : "Enable Clinical High-Contrast Mode",
      category: "Display & Accessibility",
      hotkey: "C",
      icon: <Eye className="w-4 h-4 text-sky-400" />,
      action: () => { onToggleContrast(); onClose() }
    },
    {
      id: "action-model",
      title: "Inspect Model Architecture & Bland-Altman / ROC",
      category: "Verification & Audit",
      hotkey: "M",
      icon: <Shield className="w-4 h-4 text-purple-400" />,
      action: () => { onOpenModelInfo(); onClose() }
    },
    {
      id: "action-history",
      title: "Browse PACS Study History Archive",
      category: "Archive & PACS",
      hotkey: "H",
      icon: <History className="w-4 h-4 text-blue-400" />,
      action: () => { onOpenHistory(); onClose() }
    }
  ]

  const filteredCommands = commands.filter((cmd) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return cmd.title.toLowerCase().includes(q) || cmd.category.toLowerCase().includes(q) || cmd.hotkey?.toLowerCase() === q
  })

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length))
      } else if (e.key === "Enter") {
        e.preventDefault()
        const selected = filteredCommands[selectedIndex]
        if (selected && !selected.disabled) {
          selected.action()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-24 px-4 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-2xl bg-[#060b18] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-slate-100 font-sans animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-950/90 flex items-center space-x-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, hotkeys, or clinical workflows... (e.g., PDF, Studio, Model)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-slate-500">
              No matching clinical commands or workflows found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    if (!cmd.disabled) cmd.action()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-mono transition cursor-pointer ${
                    cmd.disabled
                      ? "opacity-40 cursor-not-allowed text-slate-600"
                      : isSelected
                      ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-200"
                      : "hover:bg-slate-900 text-slate-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">{cmd.title}</div>
                      <div className="text-[10px] text-slate-400">{cmd.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {cmd.hotkey && (
                      <kbd className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-700 text-[10px] text-slate-300 font-bold">
                        {cmd.hotkey}
                      </kbd>
                    )}
                    {isSelected && !cmd.disabled && (
                      <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Clinical Keyboard Hotkey Reference Guide Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/95 flex items-center justify-between text-[10px] font-mono text-slate-400">
          <div className="flex items-center space-x-3">
            <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800">Space</kbd> Play/Pause</span>
            <span><kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800">[ / ]</kbd> Frame Step</span>
          </div>
          <span className="text-cyan-400">EchoCard-AI Command Center</span>
        </div>
      </div>
    </div>
  )
}
