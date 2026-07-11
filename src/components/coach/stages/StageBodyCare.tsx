"use client";

import { BreathGuide } from "@/components/coach/BreathGuide";
import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { OptionChip } from "@/components/coach/OptionChip";
import { SoftButton } from "@/components/coach/SoftButton";
import {
  BODY_SENSATION_OPTIONS,
  CARE_TIPS,
  MULTI_SELECT_HINT,
  toggleOption,
} from "@/lib/stages/staticContent";
import type { BodySensation } from "@/types/coach";

type Props = {
  selected: BodySensation[];
  onChange: (next: BodySensation[]) => void;
  onContinue: () => void;
};

export function StageBodyCare({ selected, onChange, onContinue }: Props) {
  return (
    <JourneyShell
      stageId={2}
      title="你的身體還好嗎？"
      subtitle={`先不用談情緒。我們先看看身體現在怎麼樣。${MULTI_SELECT_HINT}`}
    >
      <div className="flex flex-wrap gap-2">
        {BODY_SENSATION_OPTIONS.map((option) => (
          <OptionChip
            key={option}
            label={option}
            selected={selected.includes(option)}
            onClick={() => onChange(toggleOption(selected, option))}
          />
        ))}
      </div>

      <CompanionBubble>{CARE_TIPS.join("\n")}</CompanionBubble>

      <BreathGuide />

      <div className="flex justify-center pt-2">
        <SoftButton onClick={onContinue} disabled={selected.length === 0}>
          慢慢繼續
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
