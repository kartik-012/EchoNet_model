import React from "react";
import { GlassCard } from "./ui/GlassCard";
import {
  GraduationCap,
  UserCheck,
  FileText,
  BookOpen,
  Calendar,
  Building,
  Award
} from "lucide-react";
import { GithubIcon } from "./ui/GithubIcon";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B12] border-t border-[rgba(255,255,255,0.06)]"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-3.5 py-1.5 backdrop-blur-md mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8655FF]" />
            <span className="font-mono text-[11px] tracking-wider text-[#A1A1B0] uppercase">
              Academic Attribution & Research Team
            </span>
          </div>
          <h2 className="text-[32px] sm:text-[40px] font-medium tracking-tight text-[#F5F5F7] leading-tight">
            About the EchoNet-AI Project
          </h2>
          <p className="mt-3 text-[15px] text-[#A1A1B0] leading-relaxed">
            Developed as a capstone Major Project fulfilling Bachelor of Engineering degree requirements
            in Artificial Intelligence & Machine Learning at Visvesvaraya Technological University (VTU).
          </p>
        </div>

        {/* 2-Column Academic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Principal Investigator / Student */}
          <GlassCard className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.1)] text-[#8655FF]">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#8655FF]">
                  Project Lead & Neural Systems Engineer
                </span>
                <h3 className="mt-1 text-[22px] font-medium text-[#F5F5F7]">
                  Kartik Raikar
                </h3>
                <p className="font-mono text-[13px] text-[#A78BFA] mt-0.5">
                  USN: 2JI23CI016
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-[#A1A1B0]">
                  Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning),
                  Jain College of Engineering, Belagavi.
                  Architected the 3D-CNN spatiotemporal regression pipeline, attention U-Net, and real-time WebGL spatial visualization engine.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Card 2: Faculty Guide & Academic Supervision */}
          <GlassCard className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(76,141,255,0.4)] bg-[rgba(76,141,255,0.1)] text-[#4C8DFF]">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#4C8DFF]">
                  Academic Research Guide
                </span>
                <h3 className="mt-1 text-[22px] font-medium text-[#F5F5F7]">
                  Dr. Poorna Chandra S
                </h3>
                <p className="font-mono text-[13px] text-[#7FD6FF] mt-0.5">
                  Professor & Head of Department
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-[#A1A1B0]">
                  Department of Computer Science & Engineering (Artificial Intelligence & Machine Learning),
                  Jain College of Engineering, Belagavi.
                  Supervised cardiovascular kinematics formalization, clinical consensus methodology, and medical publication drafting.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Institution & Publication Banner */}
        <GlassCard className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-[#F5F5F7]">
                <Building className="h-4 w-4 text-[#8655FF]" />
                <span className="text-[16px] font-medium">
                  Jain College of Engineering, Belagavi – 590014
                </span>
              </div>
              <p className="text-[13px] text-[#A1A1B0]">
                Affiliated to Visvesvaraya Technological University (VTU), Belagavi, Karnataka • Academic Year 2025–2026
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4 font-mono text-[11px] text-[#525266] pt-1">
                <span>Degree: B.E. in CSE (AI & ML)</span>
                <span>•</span>
                <span>Course Code: 21AIML81</span>
              </div>
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/reports/EchoCard_AI_Technical_Paper.docx"
                download="EchoNet_AI_Technical_Paper.docx"
                className="flex items-center gap-2 rounded-full border border-[rgba(134,85,255,0.5)] bg-[#8655FF] px-5 py-2.5 text-[13px] font-medium text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                <span>Download IEEE Technical Paper</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-5 py-2.5 text-[13px] font-medium text-[#F5F5F7] transition-colors hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)]"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};
