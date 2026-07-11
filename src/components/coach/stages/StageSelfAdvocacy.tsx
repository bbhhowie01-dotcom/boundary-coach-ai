"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onContinue: () => void;
};

export function StageSelfAdvocacy({ value, onChange, onContinue }: Props) {
  return (
    <JourneyShell stageId={8} title="替自己說話">
      <CompanionBubble>
        {`如果有一個真正理解你的人坐在旁邊，
你希望對方知道什麼？

或者——
如果給你一次機會，
你最想替自己說的一句話是什麼？
這句話可以很小聲，也可以只寫給自己。`}
      </CompanionBubble>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="這句話只給你自己聽也可以。"
        className="w-full resize-y rounded-3xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
      />

      <div className="flex justify-center">
        <SoftButton onClick={onContinue} disabled={!value.trim()}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
