"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { STAGE_1_MESSAGE } from "@/lib/stages/staticContent";

type Props = { onContinue: () => void };

export function StageCatch({ onContinue }: Props) {
  return (
    <JourneyShell stageId={1} title="接住你">
      <CompanionBubble>{STAGE_1_MESSAGE}</CompanionBubble>
      <div className="flex justify-center pt-2">
        <SoftButton onClick={onContinue}>慢慢繼續</SoftButton>
      </div>
    </JourneyShell>
  );
}
