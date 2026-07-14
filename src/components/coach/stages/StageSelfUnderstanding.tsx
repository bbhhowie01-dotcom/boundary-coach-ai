"use client";

import { useEffect, useRef } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachStream } from "@/components/coach/hooks/useCoachStream";
import type { CoachSession, SelfUnderstandingResult } from "@/types/coach";

type Props = {
  session: CoachSession;
  cached?: SelfUnderstandingResult;
  onCached: (data: SelfUnderstandingResult) => void;
  onContinue: () => void;
  onBack?: () => void;
};

export function StageSelfUnderstanding({
  session,
  cached,
  onCached,
  onContinue,
  onBack,
}: Props) {
  const { text, loading, error, stream, setText } = useCoachStream();
  const requested = useRef(false);
  const display = text || cached?.reflection || "";

  useEffect(() => {
    if (cached?.reflection) {
      setText(cached.reflection);
      return;
    }
    if (requested.current) return;
    requested.current = true;

    void (async () => {
      const full = await stream({
        action: "self_understanding",
        session,
      });
      if (full) {
        onCached({ reflection: full });
      }
    })();
  }, [cached, session, stream, onCached, setText]);

  return (
    <JourneyShell stageId={7} title="自我理解" onBack={onBack}>
      <CompanionBubble>
        {loading && !display
          ? "我在慢慢整理你剛剛說的話…"
          : display ||
            (error
              ? "沒關係，我們可以先用你自己的感受繼續往下走。"
              : "從剛剛的分享裡，我聽見你其實很在乎這段關係。你不是不在乎對方，只是同時也希望自己的感受被看見。")}
        {loading && display ? "▍" : ""}
      </CompanionBubble>
      {error && !display && (
        <p className="text-center text-xs text-warm-gray">{error}</p>
      )}
      <div className="flex justify-center">
        <SoftButton onClick={onContinue} disabled={loading && !display}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
