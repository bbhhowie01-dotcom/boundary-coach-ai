"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { OptionChip } from "@/components/coach/OptionChip";
import { SoftButton } from "@/components/coach/SoftButton";
import {
  MULTI_SELECT_HINT,
  WORRY_OPTIONS,
  toggleOption,
} from "@/lib/stages/staticContent";
import type { WorryConcern } from "@/types/coach";

type Props = {
  selected: WorryConcern[];
  otherText?: string;
  onChange: (next: WorryConcern[]) => void;
  onOtherChange: (value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
};

export function StageEmotionSource({
  selected,
  otherText = "",
  onChange,
  onOtherChange,
  onContinue,
  onBack,
}: Props) {
  const canContinue =
    selected.length > 0 &&
    (!selected.includes("其他") || otherText.trim().length > 0);

  return (
    <JourneyShell
      stageId={6}
      title="情緒來源"
      subtitle={MULTI_SELECT_HINT}
      onBack={onBack}
    >
      <CompanionBubble>
        {`當這件事情發生時，
你最擔心的是什麼？
不用說得很完整，想到什麼就選什麼。`}
      </CompanionBubble>

      <div className="flex flex-wrap gap-2">
        {WORRY_OPTIONS.map((option) => (
          <OptionChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => onChange(toggleOption(selected, option))}
          />
        ))}
      </div>

      {selected.includes("其他") && (
        <textarea
          value={otherText}
          onChange={(e) => onOtherChange(e.target.value)}
          rows={3}
          placeholder="用你自己的話說也可以。"
          className="w-full resize-y rounded-3xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
        />
      )}

      <CompanionBubble className="bg-soft-blue/20 border-soft-blue/30">
        {`謝謝你願意說出這些。
我好像慢慢懂了，
為什麼這件事會這麼牽動你。`}
      </CompanionBubble>

      <div className="flex justify-center">
        <SoftButton onClick={onContinue} disabled={!canContinue}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
