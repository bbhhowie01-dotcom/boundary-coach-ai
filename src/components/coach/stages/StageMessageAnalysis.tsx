"use client";

import { useEffect, useRef } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachAi } from "@/components/coach/hooks/useCoachAi";
import type { CoachSession, MessageAnalysisResult } from "@/types/coach";

type Props = {
  session: CoachSession;
  cached?: MessageAnalysisResult;
  onCached: (data: MessageAnalysisResult) => void;
  onContinue: () => void;
};

export function StageMessageAnalysis({
  session,
  cached,
  onCached,
  onContinue,
}: Props) {
  const { run, loading, error } = useCoachAi();
  const requested = useRef(false);

  useEffect(() => {
    if (cached || requested.current) return;
    requested.current = true;
    void (async () => {
      const data = await run("message_analysis", session);
      if (data && "emotionalIntensity" in data) {
        onCached(data);
      }
    })();
  }, [cached, session, run, onCached]);

  return (
    <JourneyShell
      stageId={11}
      title="訊息理解"
      subtitle="現在，我們才一起溫柔地看看這則訊息可能承載了什麼。"
    >
      {loading && !cached ? (
        <CompanionBubble>我在溫柔地閱讀這則訊息…</CompanionBubble>
      ) : cached ? (
        <div className="space-y-3">
          <InfoRow label="情緒強度" value={cached.emotionalIntensity} />
          <InfoList label="可能的溝通模式" items={cached.communicationPatterns} />
          <InfoList label="可能的需求" items={cached.possibleNeeds} />
          <InfoList
            label="可能的誤解"
            items={cached.possibleMisunderstandings}
          />
          <InfoRow label="衝突焦點" value={cached.conflictFocus} />
        </div>
      ) : (
        <CompanionBubble>
          {error
            ? "這次沒能完整整理訊息，沒關係。你已經比剛開始更靠近自己了。"
            : "這則訊息可能帶著強烈情緒，也夾雜著未被說清楚的需要。"}
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-cream-deep bg-white/65 px-4 py-3">
      <p className="text-xs font-semibold text-warm-gray">{label}</p>
      <p className="mt-1 text-sm leading-7 text-warm-ink">{value}</p>
    </div>
  );
}

function InfoList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-cream-deep bg-white/65 px-4 py-3">
      <p className="text-xs font-semibold text-warm-gray">{label}</p>
      <ul className="mt-1 space-y-1 text-sm leading-7 text-warm-ink">
        {items.map((item) => (
          <li key={item}>· {item}</li>
        ))}
      </ul>
    </div>
  );
}
