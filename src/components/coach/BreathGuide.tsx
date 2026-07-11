"use client";

import { useEffect, useState } from "react";
import { BREATH_CONFIG } from "@/lib/stages/staticContent";

type Phase = "inhale" | "hold" | "exhale" | "done";

const PHASE_LABEL: Record<Phase, string> = {
  inhale: "慢慢吸氣",
  hold: "輕輕停留",
  exhale: "慢慢吐氣",
  done: "很好，你可以休息一下",
};

export function BreathGuide() {
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (!started || phase === "done") return;

    const durationMs =
      phase === "inhale"
        ? BREATH_CONFIG.inhaleSeconds * 1000
        : phase === "hold"
          ? BREATH_CONFIG.holdSeconds * 1000
          : BREATH_CONFIG.exhaleSeconds * 1000;

    const timer = window.setTimeout(() => {
      if (phase === "inhale") {
        setPhase("hold");
      } else if (phase === "hold") {
        setPhase("exhale");
      } else if (phase === "exhale") {
        if (round >= BREATH_CONFIG.rounds) {
          setPhase("done");
        } else {
          setRound((r) => r + 1);
          setPhase("inhale");
        }
      }
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [started, phase, round]);

  const animClass =
    phase === "inhale"
      ? "breath-inhale"
      : phase === "hold"
        ? "breath-hold"
        : phase === "exhale"
          ? "breath-exhale"
          : "";

  return (
    <div className="rounded-3xl border border-soft-green/50 bg-soft-green/25 px-5 py-6 text-center">
      <p className="text-sm text-warm-gray">呼吸引導</p>
      <p className="mt-1 text-xs text-warm-gray/80">
        吸氣 {BREATH_CONFIG.inhaleSeconds} 秒 · 停留 {BREATH_CONFIG.holdSeconds}{" "}
        秒 · 吐氣 {BREATH_CONFIG.exhaleSeconds} 秒 · 重複{" "}
        {BREATH_CONFIG.rounds} 次
      </p>

      {!started ? (
        <button
          type="button"
          onClick={() => {
            setStarted(true);
            setPhase("inhale");
            setRound(1);
          }}
          className="mt-5 rounded-2xl bg-white/70 px-5 py-2.5 text-sm font-medium text-warm-ink transition hover:bg-white"
        >
          跟我一起呼吸
        </button>
      ) : (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div
            key={`${phase}-${round}`}
            className={`flex h-28 w-28 items-center justify-center rounded-full bg-soft-blue/50 ${animClass}`}
          >
            <div className="h-16 w-16 rounded-full bg-white/70" />
          </div>
          <p className="text-sm font-medium text-warm-ink">
            {PHASE_LABEL[phase]}
          </p>
          {phase !== "done" && (
            <p className="text-xs text-warm-gray">
              第 {round} / {BREATH_CONFIG.rounds} 次
            </p>
          )}
          {phase === "done" && (
            <button
              type="button"
              onClick={() => {
                setPhase("inhale");
                setRound(1);
              }}
              className="text-xs text-soft-blue-deep underline-offset-2 hover:underline"
            >
              再做一輪
            </button>
          )}
        </div>
      )}
    </div>
  );
}
