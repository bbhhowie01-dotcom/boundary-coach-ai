"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { BOUNDARY_REMINDERS } from "@/lib/stages/staticContent";

type Props = { onContinue: () => void };

export function StageBoundary({ onContinue }: Props) {
  return (
    <JourneyShell stageId={10} title="界線建立">
      <CompanionBubble>
        在往下看訊息、想怎麼回之前，我想先輕輕放幾句話在這裡。
      </CompanionBubble>

      <div className="grid gap-3 sm:grid-cols-2">
        {BOUNDARY_REMINDERS.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-cream-deep bg-white/60 px-4 py-4"
          >
            <p className="font-[family-name:var(--font-display)] text-lg text-warm-ink">
              {item.title}
            </p>
            <p className="mt-1 text-sm text-warm-gray">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <SoftButton onClick={onContinue}>慢慢繼續</SoftButton>
      </div>
    </JourneyShell>
  );
}
