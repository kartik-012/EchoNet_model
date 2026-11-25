import React from "react";
import { Activity, ShieldAlert, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.08)] bg-[#050507] py-16 px-4 sm:px-6 lg:px-8 text-[#A1A1B0]">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[rgba(255,255,255,0.06)]">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(134,85,255,0.3)] bg-[rgba(134,85,255,0.08)]">
                <Activity className="h-4 w-4 text-[#8655FF]" />
              </div>
              <span className="text-[17px] font-medium text-[#F5F5F7] tracking-tight">
                EchoNet-AI
              </span>
            </div>
            <p className="text-[13px] leading-relaxed max-w-sm">
              Automated Cardiac Ejection Fraction Estimation Using Deep Learning.
              A spatiotemporal artificial intelligence research system developed for apical-4-chamber echocardiographic cine analysis.
            </p>
            <div className="rounded-lg border border-[rgba(232,184,74,0.3)] bg-[rgba(232,184,74,0.04)] p-3 text-[12px] text-[#A1A1B0] flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 text-[#E8B84A] shrink-0 mt-0.5" />
              <span>
                Research prototype. Not a certified medical device. Not for clinical diagnosis.
              </span>
            </div>
          </div>

          {/* Quick Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#F5F5F7]">
              Navigation
            </span>
            <ul className="space-y-2 text-[13px]">
              <li>
                <a href="#overview" className="hover:text-[#F5F5F7] transition-colors">
                  System Overview
                </a>
              </li>
              <li>
                <a href="#pipeline" className="hover:text-[#F5F5F7] transition-colors">
                  Deep Learning Pipeline
                </a>
              </li>
              <li>
                <a href="#analyze" className="hover:text-[#F5F5F7] transition-colors">
                  Clinical Analyze Studio
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-[#F5F5F7] transition-colors">
                  Analysis Dashboard
                </a>
              </li>
              <li>
                <a href="#validation" className="hover:text-[#F5F5F7] transition-colors">
                  Model Validation & Benchmarks
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F5F5F7] transition-colors">
                  Academic Team & JCE Belagavi
                </a>
              </li>
            </ul>
          </div>

          {/* Dataset & Primary Citations (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#F5F5F7]">
              Research Citations & Datasets
            </span>
            <ul className="space-y-2 text-[12px] leading-relaxed">
              <li>
                <strong className="text-[#F5F5F7]">Stanford EchoNet-Dynamic:</strong> Ouyang et al., "Video-based AI for beat-to-beat assessment of cardiac function," <em>Nature</em>, Vol. 580, pp. 252–256, 2020.
              </li>
              <li>
                <strong className="text-[#F5F5F7]">CAMUS Dataset:</strong> Leclerc et al., "Deep Learning for Segmentation Using an Open Large-Scale Dataset in 2D Echocardiography," <em>IEEE TMI</em>, Vol. 38, pp. 2198–2210, 2019.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Affiliation & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px]">
          <p>
            © 2026 EchoNet-AI Research Group. Jain College of Engineering, Belagavi (Affiliated to VTU).
          </p>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#525266]">
            <span>ENGINEERED BY KARTIK RAIKAR</span>
            <span>•</span>
            <span>USN 2JI23CI016</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// PACS footer clinical citation references verified.
