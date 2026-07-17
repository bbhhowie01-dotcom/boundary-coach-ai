"use client";

import { useCallback, useState } from "react";
import {
  ComfortSoundProvider,
  useComfortSound,
} from "@/components/coach/ComfortSoundContext";
import {
  ComfortSoundMiniBar,
} from "@/components/coach/ComfortSoundSelector";
import { HomeForm, type HomeFormValues } from "@/components/coach/HomeForm";
import { SoftButton } from "@/components/coach/SoftButton";
import { StageBodyCare } from "@/components/coach/stages/StageBodyCare";
import { StageCatch } from "@/components/coach/stages/StageCatch";
import { StageEmotionAwareness } from "@/components/coach/stages/StageEmotionAwareness";
import { StageEmotionCompanion } from "@/components/coach/stages/StageEmotionCompanion";
import { StageEmotionSource } from "@/components/coach/stages/StageEmotionSource";
import { StageInsights } from "@/components/coach/stages/StageInsights";
import { StageSelfAdvocacy } from "@/components/coach/stages/StageSelfAdvocacy";
import { StageSettling } from "@/components/coach/stages/StageSettling";
import type { BodySensation, CoachSession, JourneyAiCache } from "@/types/coach";

type View = "home" | "journey";

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}`;
}

export function CoachApp() {
  return (
    <ComfortSoundProvider>
      <CoachAppInner />
    </ComfortSoundProvider>
  );
}

function CoachAppInner() {
  const { stopAndReset } = useComfortSound();
  const [view, setView] = useState<View>("home");
  const [stage, setStage] = useState(1);
  const [session, setSession] = useState<CoachSession | null>(null);
  const [aiCache, setAiCache] = useState<JourneyAiCache>({});

  const goNext = useCallback(() => {
    setStage((s) => Math.min(s + 1, 8));
  }, []);

  const goBack = useCallback(() => {
    if (stage <= 1) {
      void stopAndReset();
      setView("home");
      setStage(1);
      return;
    }
    if (stage === 8) {
      setAiCache((c) => ({ ...c, comprehensiveInsights: undefined }));
    }
    setStage((s) => s - 1);
  }, [stage, stopAndReset]);

  const FREE_INPUT_FIELDS: (keyof CoachSession)[] = [
    "userFreeInput",
    "selfAdvocacy",
    "message",
    "mostImpactfulLine",
    "worryOther",
    "firstFeelingOther",
    "touchPointOther",
  ];

  function handleStart(data: HomeFormValues) {
    setSession((prev) => ({
      sessionId: prev?.sessionId ?? createSessionId(),
      startedAt: prev?.startedAt ?? new Date().toISOString(),
      relationshipType: data.relationshipType,
      parentChildRole: data.parentChildRole,
      customRelationship: data.customRelationship,
      customParentChildContext: data.customParentChildContext,
      relationshipDescription: data.customRelationship,
      senderName: data.senderName,
      addressTerm: data.addressTerm,
      message: data.message,
      userFreeInput: data.userFreeInput,
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
    void stopAndReset();
    setView("home");
    setStage(1);
    setSession(null);
    setAiCache({});
  }

  function patchSession(patch: Partial<CoachSession>) {
    setSession((prev) => (prev ? { ...prev, ...patch } : prev));
    if (
      Object.keys(patch).some((key) =>
        FREE_INPUT_FIELDS.includes(key as keyof CoachSession),
      )
    ) {
      setAiCache((c) => ({ ...c, comprehensiveInsights: undefined }));
    }
  }

  const homeInitial = session
    ? {
        relationshipType: session.relationshipType,
        parentChildRole: session.parentChildRole,
        customRelationship:
          session.customRelationship ?? session.relationshipDescription,
        customParentChildContext: session.customParentChildContext,
        senderName: session.senderName,
        addressTerm: session.addressTerm,
        message: session.message,
        userFreeInput: session.userFreeInput,
      }
    : null;

  const hasFreeInput =
    Boolean(session?.userFreeInput?.trim()) ||
    Boolean(session?.selfAdvocacy?.trim());

  const showMiniBar = view === "journey" && stage !== 2;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <Atmosphere />

      <div className="relative z-10 flex flex-1 flex-col">
        {view === "home" && (
          <HomeForm onStart={handleStart} initialValues={homeInitial} />
        )}

        {view === "journey" && session && (
          <>
            {stage > 1 && stage < 8 && (
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
              <StageSelfAdvocacy
                value={session.selfAdvocacy ?? ""}
                allowSkip={hasFreeInput}
                onChange={(selfAdvocacy) => patchSession({ selfAdvocacy })}
                onContinue={goNext}
                onBack={goBack}
              />
            )}

            {stage === 8 && (
              <StageInsights
                session={session}
                cached={aiCache.comprehensiveInsights}
                onCached={(comprehensiveInsights) =>
                  setAiCache((c) => ({ ...c, comprehensiveInsights }))
                }
                onRestart={handleRestart}
                onBack={goBack}
              />
            )}
          </>
        )}
      </div>

      {showMiniBar && <ComfortSoundMiniBar />}

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
