"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { OptionChip } from "@/components/coach/OptionChip";
import { SoftButton } from "@/components/coach/SoftButton";
import {
  FIRST_FEELING_OPTIONS,
  MULTI_SELECT_HINT,
  toggleOption,
} from "@/lib/stages/staticContent";
import type { FirstFeeling } from "@/types/coach";

type Props = {
  selected: FirstFeeling[];
  otherText?: string;
  onChange: (next: FirstFeeling[]) => void;
  onOtherChange: (value: string) => void;
  onContinue: () => void;
  onBack?: () => void;
};

export function StageEmotionCompanion({
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
      stageId={4}
      title="情緒陪伴"
      subtitle={MULTI_SELECT_HINT}
      onBack={onBack}
    >
      <CompanionBubble>
        {`我有點好奇。
看到這段訊息時，
你第一時間的感覺是什麼？
不知道、很亂，也都沒關係。可以一次選好幾個。`}
      </CompanionBubble>

      <div className="flex flex-wrap gap-2">
        {FIRST_FEELING_OPTIONS.map((option) => (
          <OptionChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => onChange(toggleOption(selected, option))}
          />
        ))}
      </div>

      {selected.includes("其他") && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="用你的話說說看"
          className="w-full rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm outline-none focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
        />
      )}

      <div className="flex justify-center pt-2">
        <SoftButton onClick={onContinue} disabled={!canContinue}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
