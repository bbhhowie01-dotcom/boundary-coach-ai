"use client";

import { useEffect, useRef, useState } from "react";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { CopyBlock } from "@/components/coach/CopyBlock";
import { InsightsSectionCard } from "@/components/coach/InsightsSectionCard";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { useCoachAi } from "@/components/coach/hooks/useCoachAi";
import { formatRelationshipBackground } from "@/lib/stages/staticContent";
import type {
  CoachSession,
  ComprehensiveInsightsReplyOptions,
  ComprehensiveInsightsResult,
} from "@/types/coach";

const REPLY_LABELS: {
  key: keyof ComprehensiveInsightsReplyOptions;
  title: string;
}[] = [
  { key: "gentle", title: "溫和版" },
  { key: "rational", title: "理性版" },
  { key: "boundary", title: "界線版" },
  { key: "short", title: "極簡版" },
];

type Props = {
  session: CoachSession;
  cached?: ComprehensiveInsightsResult;
  onCached: (data: ComprehensiveInsightsResult) => void;
  onRestart: () => void;
  onBack?: () => void;
};

export function StageInsights({
  session,
  cached,
  onCached,
  onRestart,
  onBack,
}: Props) {
  const { run, loading, error } = useCoachAi();
  const {
    run: runReplies,
    loading: replyLoading,
    error: replyError,
  } = useCoachAi();
  const requested = useRef(false);
  const [viewReply, setViewReply] =
    useState<keyof ComprehensiveInsightsReplyOptions>("gentle");
  const [wantsReply, setWantsReply] = useState(false);
  const [declinedReply, setDeclinedReply] = useState(false);
  const [replySupplement, setReplySupplement] = useState("");
  const [localReplies, setLocalReplies] =
    useState<ComprehensiveInsightsReplyOptions | null>(
      cached?.replyOptions ?? null,
    );

  useEffect(() => {
    if (cached || requested.current) return;
    requested.current = true;
    void (async () => {
      const data = await run("comprehensive_insights", session);
      if (data && "heardSummary" in data) {
        onCached(data);
        if (data.replyOptions) {
          setLocalReplies(data.replyOptions);
          setWantsReply(true);
        }
      }
    })();
  }, [cached, session, run, onCached]);

  useEffect(() => {
    if (cached?.replyOptions) {
      setLocalReplies(cached.replyOptions);
      setWantsReply(true);
    }
  }, [cached?.replyOptions]);

  async function generateReplies(supplement?: string) {
    setWantsReply(true);
    setDeclinedReply(false);
    const data = await runReplies(
      "reply_options",
      session,
      supplement?.trim() || undefined,
    );
    if (data && "replyOptions" in data && data.replyOptions) {
      setLocalReplies(data.replyOptions);
      if (cached) {
        onCached({ ...cached, replyOptions: data.replyOptions });
      }
    }
  }

  const insights = cached;
  const relationshipBg = formatRelationshipBackground({
    relationshipType: session.relationshipType,
    parentChildRole: session.parentChildRole,
    customRelationship:
      session.customRelationship ?? session.relationshipDescription,
    customParentChildContext: session.customParentChildContext,
  });

  return (
    <JourneyShell
      stageId={8}
      title="陪伴整理"
      subtitle="先被接住，再被聽見，再被理解。回覆可以之後再說。"
      onBack={onBack}
    >
      {loading && !insights && (
        <CompanionBubble>
          我在慢慢讀你寫的話，
          <br />
          先陪你停一下…
        </CompanionBubble>
      )}

      {error && !insights && (
        <CompanionBubble>
          這次沒能完整整理出來。你可以回到上一頁補充更多想說的話，再試一次。
        </CompanionBubble>
      )}

      {insights && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-cream-deep/80 bg-white/50 px-5 py-4 text-sm leading-7 text-warm-gray">
            <p className="mb-1 text-xs font-semibold tracking-wide text-warm-gray/90">
              這段訊息的關係背景
            </p>
            <p className="text-warm-ink">{relationshipBg.title}</p>
            <p>{relationshipBg.detail}</p>
          </div>

          <InsightsSectionCard title="先陪你停一下" variant="opening">
            <p className="whitespace-pre-line text-[15px] leading-8 text-warm-ink">
              {insights.openingSupport}
            </p>
          </InsightsSectionCard>

          <InsightsSectionCard title="我聽見你說的是" variant="heard">
            <ul className="space-y-3 text-[15px] leading-8 text-warm-ink">
              {insights.heardSummary.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-amber-600/70" aria-hidden>
                    ·
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </InsightsSectionCard>

          <InsightsSectionCard title="你可能真正想替自己說的是">
            <p className="whitespace-pre-line text-warm-ink">
              {insights.selfStatement}
            </p>
          </InsightsSectionCard>

          <InsightsSectionCard title="這份情緒可能從哪裡來">
            <p className="whitespace-pre-line">{insights.emotionSource}</p>
          </InsightsSectionCard>

          <InsightsSectionCard title="你可能真正需要的是">
            <ul className="space-y-1.5">
              {insights.userNeeds.map((need) => (
                <li key={need}>· {need}</li>
              ))}
            </ul>
          </InsightsSectionCard>

          <InsightsSectionCard title="對方可能在意的是">
            <ul className="space-y-1.5">
              {insights.otherSideNeeds.map((need) => (
                <li key={need}>· {need}</li>
              ))}
            </ul>
          </InsightsSectionCard>

          <InsightsSectionCard title="目前衝突的核心">
            <p className="whitespace-pre-line">{insights.conflictCore}</p>
          </InsightsSectionCard>

          <InsightsSectionCard title="這段訊息可能帶來的壓力">
            <ul className="space-y-1.5">
              {insights.messagePattern.map((pattern) => (
                <li key={pattern}>· {pattern}</li>
              ))}
            </ul>
          </InsightsSectionCard>

          <InsightsSectionCard title="界線提醒">
            <p className="whitespace-pre-line">{insights.boundaryReminder}</p>
          </InsightsSectionCard>

          <InsightsSectionCard title="最後陪你整理一下">
            <p className="whitespace-pre-line text-warm-ink">
              {insights.coachNote}
            </p>
          </InsightsSectionCard>

          <InsightsSectionCard title="關於回覆">
            {!wantsReply && !declinedReply && (
              <div className="space-y-4">
                <p className="leading-7 text-warm-ink">
                  到這裡，也許你已經比較清楚自己的感受了。
                  <br />
                  答案有時就在心裡，不一定要立刻回覆對方。
                  <br />
                  <br />
                  如果你只想被陪伴與理解，可以先停在這裡。
                  <br />
                  若你準備好了，也可以請我幫你整理一則回覆。
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <SoftButton
                    variant="ghost"
                    onClick={() => setDeclinedReply(true)}
                  >
                    先停在這裡就好
                  </SoftButton>
                  <SoftButton
                    onClick={() => void generateReplies()}
                    disabled={replyLoading}
                  >
                    {replyLoading ? "正在整理回覆…" : "請幫我整理回覆"}
                  </SoftButton>
                </div>
              </div>
            )}

            {declinedReply && !wantsReply && (
              <div className="space-y-4">
                <p className="leading-7 text-warm-ink">
                  好，那就先陪自己一下。
                  <br />
                  之後若想整理回覆，隨時可以再回來。
                </p>
                <div className="flex justify-center">
                  <SoftButton
                    variant="ghost"
                    onClick={() => void generateReplies()}
                    disabled={replyLoading}
                  >
                    {replyLoading ? "正在整理回覆…" : "還是請幫我整理回覆"}
                  </SoftButton>
                </div>
              </div>
            )}

            {wantsReply && (
              <div className="space-y-4">
                {replyLoading && !localReplies && (
                  <CompanionBubble>
                    我在慢慢幫你整理回覆，稍等一下…
                  </CompanionBubble>
                )}

                {replyError && !localReplies && (
                  <p className="text-sm leading-7 text-warm-gray">
                    這次沒能完整寫出回覆。你可以再試一次，或先補充一點想說的話。
                  </p>
                )}

                {localReplies && (
                  <>
                    <p className="text-sm leading-7 text-warm-gray">
                      請選擇一種回覆風格查看（一次選一個）。
                      <br />
                      每一則都可以改、可以不用，也可以先不送出。
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {REPLY_LABELS.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setViewReply(item.key)}
                          className={`rounded-2xl border px-3.5 py-2 text-sm transition ${
                            viewReply === item.key
                              ? "border-soft-green-deep/40 bg-soft-green/50 text-warm-ink"
                              : "border-cream-deep bg-white/55 text-warm-gray hover:bg-white/80"
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                    <CopyBlock
                      title={
                        REPLY_LABELS.find((item) => item.key === viewReply)
                          ?.title ?? ""
                      }
                      content={localReplies[viewReply]}
                    />
                  </>
                )}

                <div className="space-y-3 border-t border-cream-deep/60 pt-4">
                  <label
                    htmlFor="reply-supplement"
                    className="block text-sm font-semibold text-warm-ink"
                  >
                    還想讓回覆更靠近你嗎？
                  </label>
                  <p className="text-xs leading-6 text-warm-gray">
                    若覺得不夠詳細，或想補一句原本沒說清楚的話，寫在這裡後再生成一次。
                  </p>
                  <textarea
                    id="reply-supplement"
                    value={replySupplement}
                    onChange={(e) => setReplySupplement(e.target.value)}
                    rows={4}
                    placeholder={`例如：
我想強調這週真的很累
希望語氣再溫柔一點
不要提到工作細節
我想先說「我有回家」這件事`}
                    className="w-full resize-y rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-warm-gray/55 focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
                  />
                  <div className="flex flex-wrap justify-center gap-3">
                    <SoftButton
                      onClick={() => void generateReplies(replySupplement)}
                      disabled={replyLoading}
                    >
                      {replyLoading ? "正在重新整理…" : "再幫我整理一版"}
                    </SoftButton>
                  </div>
                  {replyError && localReplies && (
                    <p className="text-center text-xs text-warm-gray">
                      {replyError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </InsightsSectionCard>

          <div className="flex justify-center pt-2">
            <SoftButton onClick={onRestart}>重新開始</SoftButton>
          </div>
        </div>
      )}
    </JourneyShell>
  );
}
