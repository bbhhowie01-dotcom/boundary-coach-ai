"use client";

import { useEffect, useRef, useState } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { CopyBlock } from "@/components/coach/CopyBlock";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachStream } from "@/components/coach/hooks/useCoachStream";
import {
  REPLY_STYLE_OPTIONS,
  replyStyleLabel,
} from "@/lib/stages/staticContent";
import type {
  CoachSession,
  FormalRepliesCache,
  ReplyStyle,
} from "@/types/coach";

type Props = {
  session: CoachSession;
  cachedReplies?: FormalRepliesCache;
  onStyleChange: (style: ReplyStyle) => void;
  onReplyCached: (style: ReplyStyle, reply: string) => void;
  onContinue: () => void;
  onBack?: () => void;
};

export function StageFormalReply({
  session,
  cachedReplies = {},
  onStyleChange,
  onReplyCached,
  onContinue,
  onBack,
}: Props) {
  const initialStyle = session.selectedReplyStyle ?? "gentle";
  const { text, loading, error, stream, setText, reset } = useCoachStream();
  const [viewStyle, setViewStyle] = useState<ReplyStyle>(initialStyle);
  const sessionRef = useRef(session);
  const cacheRef = useRef(cachedReplies);
  const onReplyCachedRef = useRef(onReplyCached);
  const requestedStyles = useRef<Set<ReplyStyle>>(new Set());

  sessionRef.current = session;
  cacheRef.current = cachedReplies;
  onReplyCachedRef.current = onReplyCached;

  const display = text || cachedReplies[viewStyle] || "";

  useEffect(() => {
    const cached = cacheRef.current[viewStyle];
    if (cached) {
      setText(cached);
      return;
    }

    if (requestedStyles.current.has(viewStyle)) return;
    requestedStyles.current.add(viewStyle);

    void (async () => {
      const full = await stream({
        action: "formal_reply",
        session: {
          ...sessionRef.current,
          selectedReplyStyle: viewStyle,
        },
      });
      if (full) {
        onReplyCachedRef.current(viewStyle, full);
      } else {
        requestedStyles.current.delete(viewStyle);
      }
    })();
  }, [viewStyle, stream, setText]);

  async function regenerate() {
    requestedStyles.current.delete(viewStyle);
    reset();
    requestedStyles.current.add(viewStyle);
    const full = await stream({
      action: "formal_reply",
      session: {
        ...sessionRef.current,
        selectedReplyStyle: viewStyle,
      },
    });
    if (full) {
      onReplyCachedRef.current(viewStyle, full);
    } else {
      requestedStyles.current.delete(viewStyle);
    }
  }

  function handleSelectStyle(style: ReplyStyle) {
    if (style === viewStyle) return;
    setViewStyle(style);
    onStyleChange(style);
    const cached = cacheRef.current[style];
    setText(cached ?? "");
  }

  const styleTitle = replyStyleLabel(viewStyle);
  const generatedCount = REPLY_STYLE_OPTIONS.filter(
    (item) => cachedReplies[item.id],
  ).length;

  return (
    <JourneyShell
      stageId={13}
      title="這則回覆，可以這樣說"
      subtitle={`寫給「${session.senderName}」· 以「${session.addressTerm}」開頭 · 先理解與感謝，再表達自己`}
      onBack={onBack}
    >
      <CompanionBubble>
        {`我會先幫你寫出真誠的理解與感謝。
下面可以切換不同風格對照看看，
找到比較適合此刻的說法。
你可以改、可以不用，也可以先不送出。`}
      </CompanionBubble>

      <div className="flex flex-wrap gap-2">
        {REPLY_STYLE_OPTIONS.map((style) => {
          const active = viewStyle === style.id;
          const ready = Boolean(cachedReplies[style.id]);
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => handleSelectStyle(style.id)}
              disabled={loading && viewStyle !== style.id && !ready}
              className={`rounded-2xl border px-4 py-2.5 text-sm transition duration-200 disabled:opacity-45 ${
                active
                  ? "border-soft-green-deep/40 bg-soft-green/60 text-warm-ink"
                  : "border-cream-deep bg-white/55 text-warm-gray hover:border-soft-blue/50 hover:bg-white/80"
              }`}
            >
              {style.title}
              {ready ? " ✓" : ""}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-warm-gray">
        目前查看：{styleTitle}
        {generatedCount > 1 ? ` · 已可對照 ${generatedCount} 種風格` : ""}
      </p>

      {loading && !display && (
        <CompanionBubble>我正在慢慢寫「{styleTitle}」給你看…</CompanionBubble>
      )}

      {display && (
        <div className="relative">
          <CopyBlock title={`${styleTitle} · 正式回覆`} content={display} />
          {loading && (
            <span className="absolute bottom-4 right-5 inline-block h-4 w-1 animate-pulse rounded-full bg-soft-blue-deep/70" />
          )}
        </div>
      )}

      {error && !display && (
        <CompanionBubble>
          這次沒能完整寫出回覆。你可以再試一次，或先切換其他風格看看。
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
