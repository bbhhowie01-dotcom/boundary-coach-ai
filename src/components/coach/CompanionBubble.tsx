"use client";

import type { ReactNode } from "react";

type CompanionBubbleProps = {
  children: ReactNode;
  className?: string;
};

export function CompanionBubble({
  children,
  className = "",
}: CompanionBubbleProps) {
  return (
    <div
      className={`animate-fade-up rounded-3xl border border-soft-blue/40 bg-white/70 px-5 py-5 text-[15px] leading-8 text-warm-ink shadow-[0_12px_40px_-24px_rgba(90,110,120,0.45)] whitespace-pre-line ${className}`}
    >
      {children}
    </div>
  );
}
