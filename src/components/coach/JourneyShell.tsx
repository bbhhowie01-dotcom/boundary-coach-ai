"use client";

import type { ReactNode } from "react";
import { ProgressDots } from "@/components/coach/ProgressDots";
import { SoftButton } from "@/components/coach/SoftButton";
import { TOTAL_STAGES } from "@/lib/stages/config";

type JourneyShellProps = {
  stageId: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
};

export function JourneyShell({
  stageId,
  title,
  subtitle,
  children,
  onBack,
}: JourneyShellProps) {
  return (
    <div className="mx-auto w-full max-w-xl animate-fade-up">
      <div className="mb-8 text-center">
        <p className="font-[family-name:var(--font-display)] text-lg text-warm-ink">
          Boundary Coach
        </p>
        <div className="mt-4">
          <ProgressDots current={stageId} total={TOTAL_STAGES} />
        </div>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl text-warm-ink sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm leading-6 text-warm-gray">{subtitle}</p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
      {onBack && (
        <div className="mt-6 flex justify-center">
          <SoftButton variant="ghost" onClick={onBack}>
            回到上一頁
          </SoftButton>
        </div>
      )}
    </div>
  );
}
