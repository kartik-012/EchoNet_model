import React, { useRef, useState, useCallback } from "react";
import { cn } from "../../lib/utils";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  highlight?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  interactive = false,
  highlight = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, [interactive]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative rounded-[16px] border border-[rgba(255,255,255,0.08)]",
        "bg-[rgba(255,255,255,0.035)] backdrop-blur-[24px] saturate-[140%]",
        "shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08),0_24px_48px_-12px_rgba(134,85,255,0.08)]",
        interactive && "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(255,255,255,0.18)] hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.14),0_28px_56px_-12px_rgba(134,85,255,0.18)] cursor-pointer",
        highlight && "border-[rgba(134,85,255,0.35)] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.12),0_24px_48px_-12px_rgba(134,85,255,0.18)]",
        "p-4 md:p-6",
        className
      )}
      {...props}
    >
      {/* Specular sheen tracked to cursor on interactive cards */}
      {interactive && isHovered && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, rgba(134, 85, 255, 0.15), transparent 70%)`
          }}
        />
      )}

      {/* Top 1px specular highlight edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] rounded-t-[16px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.22)] to-transparent" />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Glassmorphism card container styles verified.
