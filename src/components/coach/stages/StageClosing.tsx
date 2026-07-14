"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { CLOSING_MESSAGE } from "@/lib/stages/staticContent";

type Props = { onRestart: () => void; onBack?: () => void };

export function StageClosing({ onRestart, onBack }: Props) {
  return (
    <JourneyShell stageId={14} title="陪伴總結" onBack={onBack}>
      <CompanionBubble>{CLOSING_MESSAGE}</CompanionBubble>
      <div className="flex justify-center pt-2">
        <SoftButton variant="ghost" onClick={onRestart}>
          回到開始
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
