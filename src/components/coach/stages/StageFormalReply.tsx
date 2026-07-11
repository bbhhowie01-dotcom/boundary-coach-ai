"use client";

import { useEffect, useRef } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { CopyBlock } from "@/components/coach/CopyBlock";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachStream } from "@/components/coach/hooks/useCoachStream";
import { replyStyleLabel } from "@/lib/stages/staticContent";
import type { CoachSession, FormalReplyResult } from "@/types/coach";

type Props = {
  session: CoachSession;
  cached?: FormalReplyResult;
  onCached: (data: FormalReplyResult) => void;
  onContinue: () => void;
};

export function StageFormalReply({
  session,
  cached,
  onCached,
  onContinue,
}: Props) {
  const { text, loading, error, stream, setText } = useCoachStream();
  const requested = useRef(false);
  const display = text || cached?.reply || "";

  useEffect(() => {
    if (cached?.reply) {
      setText(cached.reply);
      return;
    }
    if (requested.current || !session.selectedReplyStyle) return;
    requested.current = true;

    void (async () => {
      const full = await stream({
        action: "formal_reply",
        session,
      });
      if (full) {
        onCached({ reply: full });
      }
    })();
  }, [cached, session, stream, onCached, setText]);

  async function regenerate() {
    requested.current = true;
    const full = await stream({
      action: "formal_reply",
      session,
    });
    if (full) {
      onCached({ reply: full });
    }
  }

  const styleTitle = session.selectedReplyStyle
    ? replyStyleLabel(session.selectedReplyStyle)
    : "回覆";

  return (
    <JourneyShell
      stageId={13}
      title="這則回覆，可以這樣說"
      subtitle={`寫給「${session.senderName}」· 以「${session.addressTerm}」開頭 · ${styleTitle} · 先理解與感謝，再表達自己`}
    >
      <CompanionBubble>
        {`我會先幫你寫出真誠的理解與感謝，
再依你選的風格，把想說的話說清楚。
你可以改、可以不用，也可以先不送出。`}
      </CompanionBubble>

      {loading && !display && (
        <CompanionBubble>我正在慢慢寫給你看…</CompanionBubble>
      )}

      {display && (
        <div className="relative">
          <CopyBlock title="正式回覆" content={display} />
          {loading && (
            <span className="absolute bottom-4 right-5 inline-block h-4 w-1 animate-pulse rounded-full bg-soft-blue-deep/70" />
          )}
        </div>
      )}

      {error && !display && (
        <CompanionBubble>
          這次沒能完整寫出回覆。你可以再試一次，或先用自己的話說。
        </CompanionBubble>
      )}
      {error && (
        <p className="text-center text-xs text-warm-gray">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3">
        <SoftButton variant="ghost" onClick={regenerate} disabled={loading}>
          再寫一版
        </SoftButton>
        <SoftButton onClick={onContinue} disabled={loading || !display.trim()}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
