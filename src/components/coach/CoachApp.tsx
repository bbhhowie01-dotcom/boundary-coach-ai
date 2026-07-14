"use client";

import { useCallback, useState } from "react";
import { HomeForm, type HomeFormValues } from "@/components/coach/HomeForm";
import { SoftButton } from "@/components/coach/SoftButton";
import { StageBodyCare } from "@/components/coach/stages/StageBodyCare";
import { StageBoundary } from "@/components/coach/stages/StageBoundary";
import { StageCatch } from "@/components/coach/stages/StageCatch";
import { StageClosing } from "@/components/coach/stages/StageClosing";
import { StageEmotionAwareness } from "@/components/coach/stages/StageEmotionAwareness";
import { StageEmotionCompanion } from "@/components/coach/stages/StageEmotionCompanion";
import { StageEmotionSource } from "@/components/coach/stages/StageEmotionSource";
import { StageFormalReply } from "@/components/coach/stages/StageFormalReply";
import { StageMessageAnalysis } from "@/components/coach/stages/StageMessageAnalysis";
import { StageMutualUnderstanding } from "@/components/coach/stages/StageMutualUnderstanding";
import { StageReplyStyle } from "@/components/coach/stages/StageReplyStyle";
import { StageSelfAdvocacy } from "@/components/coach/stages/StageSelfAdvocacy";
import { StageSelfUnderstanding } from "@/components/coach/stages/StageSelfUnderstanding";
import { StageSettling } from "@/components/coach/stages/StageSettling";
import type {
  BodySensation,
  CoachSession,
  JourneyAiCache,
  ReplyStyle,
} from "@/types/coach";

type View = "home" | "journey";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}`;
}

export function CoachApp() {
  const [view, setView] = useState<View>("home");
  const [stage, setStage] = useState(1);
  const [session, setSession] = useState<CoachSession | null>(null);
  const [aiCache, setAiCache] = useState<JourneyAiCache>({});

  const goNext = useCallback(() => {
    setStage((s) => Math.min(s + 1, 14));
  }, []);

  const goBack = useCallback(() => {
    setStage((s) => {
      if (s <= 1) {
        setView("home");
        return 1;
      }
      return s - 1;
    });
  }, []);

  function handleStart(data: HomeFormValues) {
    setSession((prev) => ({
      sessionId: prev?.sessionId ?? createSessionId(),
      startedAt: prev?.startedAt ?? new Date().toISOString(),
      relationshipType: data.relationshipType,
      relationshipDescription: data.relationshipDescription,
      senderName: data.senderName,
      addressTerm: data.addressTerm,
      message: data.message,
      bodySensations: prev?.bodySensations ?? [],
      firstFeelings: prev?.firstFeelings ?? [],
      firstFeelingOther: prev?.firstFeelingOther,
      mostImpactfulLine: prev?.mostImpactfulLine,
      touchPoints: prev?.touchPoints ?? [],
      touchPointOther: prev?.touchPointOther,
      worries: prev?.worries ?? [],
      worryOther: prev?.worryOther,
      selfAdvocacy: prev?.selfAdvocacy,
      selectedReplyStyle: prev?.selectedReplyStyle,
    }));
    if (!session) {
      setAiCache({});
    }
    setStage(1);
    setView("journey");
  }

  function handleRestart() {
    setView("home");
    setStage(1);
    setSession(null);
    setAiCache({});
  }

  function patchSession(patch: Partial<CoachSession>) {
    setSession((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  const homeInitial = session
    ? {
        relationshipType: session.relationshipType,
        relationshipDescription: session.relationshipDescription,
        senderName: session.senderName,
        addressTerm: session.addressTerm,
        message: session.message,
      }
    : null;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Atmosphere />

      <div className="relative z-10 flex flex-1 flex-col">
        {view === "home" && (
          <HomeForm onStart={handleStart} initialValues={homeInitial} />
        )}

        {view === "journey" && session && (
          <>
            {stage > 1 && stage < 14 && (
              <div className="mb-4 flex justify-end">
                <SoftButton variant="ghost" onClick={handleRestart}>
                  先停在這裡
                </SoftButton>
              </div>
            )}

            {stage === 1 && (
              <StageCatch onContinue={goNext} onBack={goBack} />
            )}

            {stage === 2 && (
              <StageBodyCare
                selected={session.bodySensations}
                onChange={(bodySensations: BodySensation[]) =>
                  patchSession({ bodySensations })
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 3 && (
              <StageSettling onContinue={goNext} onBack={goBack} />
            )}

            {stage === 4 && (
              <StageEmotionCompanion
                selected={session.firstFeelings}
                otherText={session.firstFeelingOther}
                onChange={(firstFeelings) => patchSession({ firstFeelings })}
                onOtherChange={(firstFeelingOther) =>
                  patchSession({ firstFeelingOther })
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 5 && (
              <StageEmotionAwareness
                session={session}
                mostImpactfulLine={session.mostImpactfulLine}
                touchPoints={session.touchPoints}
                touchPointOther={session.touchPointOther}
                cachedFollowup={aiCache.emotionFollowup?.message}
                onLineChange={(mostImpactfulLine) =>
                  patchSession({ mostImpactfulLine })
                }
                onTouchChange={(touchPoints) => patchSession({ touchPoints })}
                onTouchOtherChange={(touchPointOther) =>
                  patchSession({ touchPointOther })
                }
                onFollowupCached={(message) =>
                  setAiCache((c) => ({
                    ...c,
                    emotionFollowup: { message },
                  }))
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 6 && (
              <StageEmotionSource
                selected={session.worries}
                otherText={session.worryOther}
                onChange={(worries) => patchSession({ worries })}
                onOtherChange={(worryOther) => patchSession({ worryOther })}
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 7 && (
              <StageSelfUnderstanding
                session={session}
                cached={aiCache.selfUnderstanding}
                onCached={(selfUnderstanding) =>
                  setAiCache((c) => ({ ...c, selfUnderstanding }))
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 8 && (
              <StageSelfAdvocacy
                value={session.selfAdvocacy ?? ""}
                onChange={(selfAdvocacy) => patchSession({ selfAdvocacy })}
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 9 && (
              <StageMutualUnderstanding
                session={session}
                cached={aiCache.mutualUnderstanding}
                onCached={(mutualUnderstanding) =>
                  setAiCache((c) => ({ ...c, mutualUnderstanding }))
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 10 && (
              <StageBoundary onContinue={goNext} onBack={goBack} />
            )}

            {stage === 11 && (
              <StageMessageAnalysis
                session={session}
                cached={aiCache.messageAnalysis}
                onCached={(messageAnalysis) =>
                  setAiCache((c) => ({ ...c, messageAnalysis }))
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 12 && (
              <StageReplyStyle
                selectedStyle={session.selectedReplyStyle}
                senderName={session.senderName}
                addressTerm={session.addressTerm}
                onStyleChange={(selectedReplyStyle: ReplyStyle) =>
                  patchSession({ selectedReplyStyle })
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 13 && (
              <StageFormalReply
                session={session}
                cachedReplies={aiCache.formalReplies}
                onStyleChange={(selectedReplyStyle: ReplyStyle) =>
                  patchSession({ selectedReplyStyle })
                }
                onReplyCached={(style, reply) =>
                  setAiCache((c) => ({
                    ...c,
                    formalReplies: {
                      ...c.formalReplies,
                      [style]: reply,
                    },
                  }))
                }
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 14 && (
              <StageClosing onRestart={handleRestart} onBack={goBack} />
            )}
          </>
        )}
      </div>

      <footer className="relative z-10 mt-16 pb-4 text-center text-xs leading-6 text-warm-gray/80">
        這裡是陪伴與守護，不是診斷，也不能取代專業心理諮商。
        <br />
        若你正處於人身安全風險，請優先尋求身邊可信賴的人或專業協助。
      </footer>
    </div>
  );
}

function Atmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-soft-blue/35 blur-3xl" />
      <div className="absolute -right-16 top-40 h-80 w-80 rounded-full bg-soft-green/40 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-cream-deep/80 blur-3xl" />
    </div>
  );
}
