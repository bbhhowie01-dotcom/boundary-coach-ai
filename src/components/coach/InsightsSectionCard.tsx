"use client";

import type { ReactNode } from "react";

type InsightsSectionCardProps = {
  title: string;
  children: ReactNode;
  variant?: "default" | "heard" | "opening";
  className?: string;
};

export function InsightsSectionCard({
  title,
  children,
  variant = "default",
  className = "",
}: InsightsSectionCardProps) {
  const variantClass =
    variant === "opening"
      ? "border-soft-green/45 bg-soft-green/20"
      : variant === "heard"
        ? "border-amber-200/70 bg-amber-50/60 shadow-[0_8px_32px_-20px_rgba(180,140,80,0.35)]"
        : "border-cream-deep bg-white/65";

  return (
    <section
      className={`rounded-3xl border px-5 py-5 ${variantClass} ${className}`}
    >
      <h3 className="mb-3 font-[family-name:var(--font-display)] text-lg text-warm-ink">
        {title}
      </h3>
      <div className="text-sm leading-7 text-warm-gray">{children}</div>
    </section>
  );
}
