"use client";

import { useEffect, useRef } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachAi } from "@/components/coach/hooks/useCoachAi";
import type { CoachSession, MutualUnderstandingResult } from "@/types/coach";

type Props = {
  session: CoachSession;
  cached?: MutualUnderstandingResult;
  onCached: (data: MutualUnderstandingResult) => void;
  onContinue: () => void;
  onBack?: () => void;
};

export function StageMutualUnderstanding({
  session,
  cached,
  onCached,
  onContinue,
  onBack,
}: Props) {
  const { run, loading, error } = useCoachAi();
  const requested = useRef(false);

  useEffect(() => {
    if (cached || requested.current) return;
    requested.current = true;
    void (async () => {
      const data = await run("mutual_understanding", session);
      if (data && "userNeeds" in data) {
        onCached(data);
      }
    })();
  }, [cached, session, run, onCached]);

  return (
    <JourneyShell
      stageId={9}
      title="雙方理解"
      subtitle="現在我們才開始整理雙方可能的需要。兩邊都可以同時成立。"
      onBack={onBack}
    >
      {loading && !cached ? (
        <CompanionBubble>我在慢慢整理雙方可能的需要…</CompanionBubble>
      ) : cached ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-soft-green/40 bg-soft-green/25 p-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-warm-gray">
              你可能需要的
            </p>
            <ul className="space-y-1.5 text-sm leading-7 text-warm-ink">
              {cached.userNeeds.map((need) => (
                <li key={need}>· {need}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-soft-blue/40 bg-soft-blue/25 p-4">
            <p className="mb-2 text-xs font-semibold tracking-wide text-warm-gray">
              對方可能需要的
            </p>
            <ul className="space-y-1.5 text-sm leading-7 text-warm-ink">
              {cached.otherNeeds.map((need) => (
                <li key={need}>· {need}</li>
              ))}
            </ul>
          </div>
          <CompanionBubble>{cached.summary}</CompanionBubble>
        </div>
      ) : (
        <CompanionBubble>
          {error
            ? "沒關係。我們可以先記住：你的需要與對方的需要，都可以同時存在。"
            : "你可能需要被理解與尊重；對方也可能希望被重視與連結。兩邊都可以同時成立。"}
        </CompanionBubble>
      )}

      <div className="flex justify-center">
        <SoftButton onClick={onContinue} disabled={loading && !cached}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
