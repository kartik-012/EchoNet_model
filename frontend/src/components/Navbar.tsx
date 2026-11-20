import React, { useState } from "react";
import {
  Activity,
  BarChart2,
  Cpu,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  ArrowRight
} from "lucide-react";
import { GithubIcon } from "./ui/GithubIcon";

export type ScreenId = "start" | "upload" | "processing" | "dashboard";

interface NavbarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenValidation: () => void;
  onOpenPipeline: () => void;
  onOpenAbout: () => void;
  hasResult?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onOpenValidation,
  onOpenPipeline,
  onOpenAbout,
  hasResult = true
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const workflowSteps: { id: ScreenId; number: string; title: string }[] = [
    { id: "start", number: "1", title: "Overview" },
    { id: "upload", number: "2", title: "Upload" },
    { id: "processing", number: "3", title: "Processing" },
    { id: "dashboard", number: "4", title: "Clinical Report" }
  ];

  const getStepStatus = (stepId: ScreenId) => {
    const order: ScreenId[] = ["start", "upload", "processing", "dashboard"];
    const currentIndex = order.indexOf(currentScreen);
    const stepIndex = order.indexOf(stepId);

    if (currentScreen === stepId) return "active";
    if (stepIndex < currentIndex) return "completed";
    return "upcoming";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-[rgba(255,255,255,0.08)] bg-[#050507]/95 backdrop-blur-[24px]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate("start")}
          className="group flex items-center gap-2.5 text-left transition-transform hover:scale-[1.01] cursor-pointer"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.08)] shadow-[0_0_15px_rgba(134,85,255,0.15)] transition-transform group-hover:scale-105">
            <Activity className="h-4 w-4 text-[#8655FF]" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#3DDC97]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-medium tracking-tight text-[#F5F5F7]">
              EchoNet-AI
            </span>
            <span className="font-mono text-[9px] tracking-wider text-[#A1A1B0] uppercase">
              Cardiac DL Platform
            </span>
          </div>
        </button>

        {/* Center 4-Step Clinical Breadcrumb Stepper */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-3 py-1.5 backdrop-blur-md">
          {workflowSteps.map((step, idx) => {
            const status = getStepStatus(step.id);
            const isClickable =
              step.id === "start" ||
              step.id === "upload" ||
              (step.id === "dashboard" && hasResult) ||
              (step.id === "processing" && currentScreen === "processing");

            return (
              <React.Fragment key={step.id}>
                <button
                  disabled={!isClickable}
                  onClick={() => isClickable && onNavigate(step.id)}
                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium transition-all ${
                    status === "active"
                      ? "bg-[#8655FF]/20 text-white shadow-[0_0_12px_rgba(134,85,255,0.3)] border border-[#8655FF]/40"
                      : status === "completed"
                      ? "text-[#A78BFA] hover:text-white cursor-pointer"
                      : "text-[#A1A1B0]/60 cursor-not-allowed"
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded-full font-mono text-[10px] ${
                      status === "active"
                        ? "bg-[#8655FF] text-white"
                        : status === "completed"
                        ? "bg-[#8655FF]/20 text-[#A78BFA]"
                        : "bg-[rgba(255,255,255,0.05)] text-[#A1A1B0]/50"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span>{step.title}</span>
                </button>
                {idx < workflowSteps.length - 1 && (
                  <ChevronRight className="h-3 w-3 text-[rgba(255,255,255,0.2)]" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Right Action Suite (Modals & Trigger) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Architecture Pipeline Modal Trigger */}
          <button
            onClick={onOpenPipeline}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[12px] text-[#A1A1B0] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-[#F5F5F7] cursor-pointer"
          >
            <Cpu className="h-3.5 w-3.5 text-[#7FD6FF]" />
            <span>Architecture</span>
          </button>

          {/* Statistical Validation Modal Trigger */}
          <button
            onClick={onOpenValidation}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[12px] text-[#A1A1B0] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-[#F5F5F7] cursor-pointer"
          >
            <BarChart2 className="h-3.5 w-3.5 text-[#3DDC97]" />
            <span>Validation</span>
          </button>

          {/* Academic Team / About Trigger */}
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[12px] text-[#A1A1B0] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-[#F5F5F7] cursor-pointer"
          >
            <GraduationCap className="h-3.5 w-3.5 text-[#A78BFA]" />
            <span>VTU Paper</span>
          </button>

          {/* GitHub Source Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Source on GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[#A1A1B0] transition-colors hover:border-[rgba(255,255,255,0.2)] hover:text-[#F5F5F7]"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          {/* Fast Switch Action */}
          {currentScreen !== "upload" && currentScreen !== "processing" && (
            <button
              onClick={() => onNavigate("upload")}
              className="flex items-center gap-2 rounded-full border border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.12)] px-3.5 py-1.5 text-[12px] font-medium text-[#F5F5F7] shadow-[0_0_15px_rgba(134,85,255,0.2)] transition-all hover:bg-[#8655FF] cursor-pointer"
            >
              <span>Analyze Echo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          {currentScreen !== "upload" && (
            <button
              onClick={() => onNavigate("upload")}
              className="rounded-full bg-[#8655FF] px-3 py-1 text-[11px] font-medium text-white"
            >
              Analyze
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-[#A1A1B0] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[rgba(255,255,255,0.08)] bg-[#0B0B12]/98 p-4 md:hidden shadow-2xl space-y-3">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#A1A1B0] uppercase px-2">Navigation</span>
            {workflowSteps.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  onNavigate(step.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] ${
                  currentScreen === step.id
                    ? "bg-[#8655FF]/20 text-white font-medium"
                    : "text-[#A1A1B0] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <span>{step.number}. {step.title}</span>
                {currentScreen === step.id && <span className="h-1.5 w-1.5 rounded-full bg-[#8655FF]" />}
              </button>
            ))}
          </div>

          <div className="border-t border-[rgba(255,255,255,0.08)] pt-2 space-y-1">
            <span className="font-mono text-[10px] text-[#A1A1B0] uppercase px-2">Documentation</span>
            <button
              onClick={() => {
                onOpenPipeline();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[#A1A1B0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              <Cpu className="h-4 w-4 text-[#7FD6FF]" />
              <span>R3D-18 Architecture Pipeline</span>
            </button>
            <button
              onClick={() => {
                onOpenValidation();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[#A1A1B0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              <BarChart2 className="h-4 w-4 text-[#3DDC97]" />
              <span>Validation & Benchmarks</span>
            </button>
            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] text-[#A1A1B0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              <GraduationCap className="h-4 w-4 text-[#A78BFA]" />
              <span>VTU Paper & Author</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
