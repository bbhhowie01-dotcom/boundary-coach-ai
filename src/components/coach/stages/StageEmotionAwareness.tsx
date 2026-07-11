"use client";

import { useEffect, useRef, useState } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { OptionChip } from "@/components/coach/OptionChip";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachStream } from "@/components/coach/hooks/useCoachStream";
import {
  MULTI_SELECT_HINT,
  TOUCH_POINT_OPTIONS,
  toggleOption,
} from "@/lib/stages/staticContent";
import type { CoachSession, TouchPoint } from "@/types/coach";

type Props = {
  session: CoachSession;
  mostImpactfulLine?: string;
  touchPoints: TouchPoint[];
  touchPointOther?: string;
  onLineChange: (value: string) => void;
  onTouchChange: (next: TouchPoint[]) => void;
  onTouchOtherChange: (value: string) => void;
  onFollowupCached: (message: string) => void;
  cachedFollowup?: string;
  onContinue: () => void;
};

export function StageEmotionAwareness({
  session,
  mostImpactfulLine = "",
  touchPoints,
  touchPointOther = "",
  onLineChange,
  onTouchChange,
  onTouchOtherChange,
  onFollowupCached,
  cachedFollowup,
  onContinue,
}: Props) {
  const { text, loading, error, stream, setText } = useCoachStream();
  const [step, setStep] = useState<"line" | "touch">(
    cachedFollowup || mostImpactfulLine.trim() ? "touch" : "line",
  );
  const requested = useRef(false);
  const followup = text || cachedFollowup || "";

  useEffect(() => {
    if (step !== "touch") return;
    if (cachedFollowup) {
      setText(cachedFollowup);
      return;
    }
    if (followup || requested.current || !mostImpactfulLine.trim()) return;

    requested.current = true;
    void (async () => {
      const full = await stream({
        action: "emotion_followup",
        session,
        userInput: mostImpactfulLine,
      });
      if (full) {
        onFollowupCached(full);
      } else {
        const fallback =
          "原來如此。那句話好像特別碰觸到你。如果願意，可以說說它最觸動你的地方是什麼嗎？可以一次選好幾個。";
        setText(fallback);
        onFollowupCached(fallback);
      }
    })();
  }, [
    step,
    cachedFollowup,
    followup,
    mostImpactfulLine,
    session,
    stream,
    onFollowupCached,
    setText,
  ]);

  const canContinue =
    touchPoints.length > 0 &&
    (!touchPoints.includes("其他") || touchPointOther.trim().length > 0);

  return (
    <JourneyShell
      stageId={5}
      title="情緒覺察"
      subtitle={`我們一起慢慢看，不用急著下結論。${MULTI_SELECT_HINT}`}
    >
      {step === "line" && (
        <>
          <CompanionBubble>
            {`如果要挑一句最讓你在意的話，
你會選哪一句？
不用選得很精準，感覺到的那句就好。`}
          </CompanionBubble>
          <textarea
            value={mostImpactfulLine}
            onChange={(e) => onLineChange(e.target.value)}
            rows={4}
            placeholder="把那一句貼在這裡，或用自己的話寫下。"
            className="w-full resize-y rounded-3xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
          />
          <div className="flex justify-center">
            <SoftButton
              onClick={() => setStep("touch")}
              disabled={!mostImpactfulLine.trim()}
            >
              慢慢繼續
            </SoftButton>
          </div>
        </>
      )}

      {step === "touch" && (
        <>
          <CompanionBubble>
            {loading && !followup
              ? "我在聽你說…"
              : followup ||
                "原來如此。那句話好像特別碰觸到你。如果願意，可以說說它最觸動你的地方是什麼嗎？可以一次選好幾個。"}
            {loading && followup ? "▍" : ""}
          </CompanionBubble>
          {error && (
            <p className="text-center text-xs text-warm-gray">{error}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {TOUCH_POINT_OPTIONS.map((option) => (
              <OptionChip
                key={option}
                label={option}
                selected={touchPoints.includes(option)}
                onClick={() => onTouchChange(toggleOption(touchPoints, option))}
              />
            ))}
          </div>
          {touchPoints.includes("其他") && (
            <input
              type="text"
              value={touchPointOther}
              onChange={(e) => onTouchOtherChange(e.target.value)}
              placeholder="用你的話說說看"
              className="w-full rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm outline-none focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
            />
          )}
          <div className="flex justify-center">
            <SoftButton onClick={onContinue} disabled={!canContinue || loading}>
              慢慢繼續
            </SoftButton>
          </div>
        </>
      )}
    </JourneyShell>
  );
}
