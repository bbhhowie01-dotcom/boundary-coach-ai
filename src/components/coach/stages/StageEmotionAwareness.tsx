"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { OptionChip } from "@/components/coach/OptionChip";
import { ReferencePanel } from "@/components/coach/ReferencePanel";
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

/** 把先前貼上的訊息拆成可點選的句子／行，方便當參考 */
function splitMessageCandidates(message: string): string[] {
  const parts = message
    .split(/\n+|(?<=[。！？!?；;…])/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

  const unique: string[] = [];
  for (const part of parts) {
    if (!unique.includes(part)) unique.push(part);
  }
  return unique;
}

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

  const candidates = useMemo(
    () => splitMessageCandidates(session.message),
    [session.message],
  );

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
下面有你稍早帶來的訊息，可以直接點選，
也可以自己改寫。`}
          </CompanionBubble>

          <ReferencePanel
            label={`來自「${session.senderName}」的原始訊息（供參考）`}
          >
            {session.message}
          </ReferencePanel>

          {candidates.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide text-warm-gray">
                點一下，就能選入最在意的那句
              </p>
              <div className="flex flex-col gap-2">
                {candidates.map((candidate) => {
                  const selected = mostImpactfulLine.trim() === candidate;
                  return (
                    <button
                      key={candidate}
                      type="button"
                      onClick={() => onLineChange(candidate)}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm leading-7 transition duration-200 ${
                        selected
                          ? "border-soft-green-deep/40 bg-soft-green/50 text-warm-ink"
                          : "border-cream-deep bg-white/55 text-warm-gray hover:border-soft-blue/50 hover:bg-white/80"
                      }`}
                    >
                      {candidate}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="impactful-line"
              className="mb-2 block text-sm font-semibold text-warm-ink"
            >
              你最在意的是這一句
            </label>
            <textarea
              id="impactful-line"
              value={mostImpactfulLine}
              onChange={(e) => onLineChange(e.target.value)}
              rows={4}
              placeholder="點選上方句子，或用自己的話寫下。"
              className="w-full resize-y rounded-3xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
            />
          </div>

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
          <ReferencePanel label="你剛剛選出最在意的一句">
            {mostImpactfulLine}
          </ReferencePanel>

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
