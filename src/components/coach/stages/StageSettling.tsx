"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import {
  STAGE_3_MESSAGE,
  STAGE_3_REMINDERS,
} from "@/lib/stages/staticContent";

type Props = { onContinue: () => void };

export function StageSettling({ onContinue }: Props) {
  return (
    <JourneyShell stageId={3} title="心理安頓">
      <CompanionBubble>{STAGE_3_MESSAGE}</CompanionBubble>
      <CompanionBubble className="bg-soft-green/30 border-soft-green/40">
        {STAGE_3_REMINDERS.join("\n")}
      </CompanionBubble>
      <div className="flex justify-center pt-2">
        <SoftButton onClick={onContinue}>慢慢繼續</SoftButton>
      </div>
    </JourneyShell>
  );
}
