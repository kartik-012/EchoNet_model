import React from "react";
import { X, GraduationCap, UserCheck, Building, FileText, Mail } from "lucide-react";
import { GithubIcon } from "../ui/GithubIcon";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#0B0B12] p-6 sm:p-8 shadow-2xl text-[#F5F5F7]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-lg p-2 text-[#A1A1B0] hover:text-white hover:bg-[rgba(255,255,255,0.06)] cursor-pointer"
          aria-label="Close Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(134,85,255,0.4)] bg-[rgba(134,85,255,0.1)] text-[#8655FF]">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[11px] font-medium text-[#8655FF] uppercase tracking-wider">
              Academic Major Project & Research Attribution
            </span>
            <h3 className="text-[22px] font-medium text-[#F5F5F7]">
              EchoNet-AI Research Team
            </h3>
          </div>
        </div>

        {/* 4 Authors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Author 1: Kartik Raikar */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8655FF] uppercase tracking-wider">
                  Lead Author & Developer
                </span>
                <span className="font-mono text-[11px] text-[#A78BFA]">USN: 2JI23CI016</span>
              </div>
              <h4 className="mt-1 text-[16px] font-medium text-[#F5F5F7]">Kartik Raikar</h4>
              <p className="mt-1 text-[12px] leading-relaxed text-[#A1A1B0]">
                Dept. of CSE (AI & ML). Designed the 3D-CNN spatiotemporal kinematic model, attention U-Net, and WebGL diagnostic workstation.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 font-mono text-[11px] text-[#7FD6FF]">
              <Mail className="h-3 w-3 text-[#A1A1B0]" />
              <a href="mailto:kartikraikar2005@gmail.com" className="hover:underline">
                kartikraikar2005@gmail.com
              </a>
            </div>
          </div>

          {/* Author 2: Abhay Patange */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8655FF] uppercase tracking-wider">
                  Co-Author & Research Scholar
                </span>
                <span className="font-mono text-[11px] text-[#A78BFA]">USN: 2JI23CI001</span>
              </div>
              <h4 className="mt-1 text-[16px] font-medium text-[#F5F5F7]">Abhay Patange</h4>
              <p className="mt-1 text-[12px] leading-relaxed text-[#A1A1B0]">
                Dept. of CSE (AI & ML). Implemented DICOM ingestion pipelines, kinematic optical flow tracking, and spatiotemporal QC preprocessing.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 font-mono text-[11px] text-[#7FD6FF]">
              <Mail className="h-3 w-3 text-[#A1A1B0]" />
              <a href="mailto:abhay87927@gmail.com" className="hover:underline">
                abhay87927@gmail.com
              </a>
            </div>
          </div>

          {/* Author 3: Chinmayi Magdum */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#8655FF] uppercase tracking-wider">
                  Co-Author & Research Scholar
                </span>
                <span className="font-mono text-[11px] text-[#A78BFA]">USN: 2JI24CI403</span>
              </div>
              <h4 className="mt-1 text-[16px] font-medium text-[#F5F5F7]">Chinmayi Magdum</h4>
              <p className="mt-1 text-[12px] leading-relaxed text-[#A1A1B0]">
                Dept. of CSE (AI & ML). Conducted CAMUS cross-cohort clinical validation, volume-time curve mathematical integration, and statistical evaluation.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 font-mono text-[11px] text-[#7FD6FF]">
              <Mail className="h-3 w-3 text-[#A1A1B0]" />
              <a href="mailto:chinmayimagdum2005@gmail.com" className="hover:underline">
                chinmayimagdum2005@gmail.com
              </a>
            </div>
          </div>

          {/* Author 4: Dr. Poorna Chandra S */}
          <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-4 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] text-[#4C8DFF] uppercase tracking-wider">
                Academic Project Guide
              </span>
              <h4 className="mt-1 text-[16px] font-medium text-[#F5F5F7]">Dr. Poorna Chandra S</h4>
              <p className="mt-1 text-[12px] leading-relaxed text-[#A1A1B0]">
                Associate Professor & Project Guide, Dept. of CSE (AI & ML). Supervised mathematical Simpson consensus, cardiac kinematics formalization, and manuscript drafting.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-1.5 font-mono text-[11px] text-[#7FD6FF]">
              <Mail className="h-3 w-3 text-[#A1A1B0]" />
              <a href="mailto:drpoornachandra@jainbgm.in" className="hover:underline">
                drpoornachandra@jainbgm.in
              </a>
            </div>
          </div>
        </div>

        {/* Institution Banner */}
        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.3)] p-4 mb-6">
          <div className="flex items-center gap-2.5 text-[#F5F5F7]">
            <Building className="h-4 w-4 text-[#8655FF]" />
            <h5 className="text-[14px] font-medium">Jain College of Engineering, Belagavi – 590014</h5>
          </div>
          <p className="mt-1 text-[12px] text-[#A1A1B0]">
            Affiliated to Visvesvaraya Technological University (VTU), Belagavi, Karnataka
          </p>
          <p className="font-mono text-[10px] text-[#525266] mt-1">
            B.E. Final Year Major Project • Academic Year 2026–2027 • DrillBit Plagiarism Check: 8% (Verified)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
          <a
            href="/reports/EchoNet_AI_Clean_Technical_Paper.docx"
            download="EchoNet_AI_Clean_Technical_Paper.docx"
            className="flex items-center gap-2 rounded-full border border-[rgba(134,85,255,0.5)] bg-[#8655FF] px-5 py-2 text-[13px] font-medium text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-105 cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Download Paper (.docx)</span>
          </a>

          <a
            href="/reports/EchoNet_AI_Clean_Technical_Paper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-[13px] text-[#F5F5F7] hover:border-[rgba(255,255,255,0.35)] cursor-pointer"
          >
            <FileText className="h-4 w-4 text-[#7FD6FF]" />
            <span>View Formatted PDF</span>
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-[13px] text-[#A1A1B0] hover:border-[rgba(255,255,255,0.25)] hover:text-white cursor-pointer"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};
