"use client";

import { CompanionBubble } from "@/components/coach/CompanionBubble";
import { JourneyShell } from "@/components/coach/JourneyShell";
import { SoftButton } from "@/components/coach/SoftButton";
import { REPLY_STYLE_OPTIONS } from "@/lib/stages/staticContent";
import type { ReplyStyle } from "@/types/coach";

type Props = {
  selectedStyle?: ReplyStyle;
  senderName: string;
  addressTerm: string;
  onStyleChange: (style: ReplyStyle) => void;
  onContinue: () => void;
};

export function StageReplyStyle({
  selectedStyle,
  senderName,
  addressTerm,
  onStyleChange,
  onContinue,
}: Props) {
  return (
    <JourneyShell
      stageId={12}
      title="你想用什麼方式回應？"
      subtitle="正式的回覆文字，我們下一步再一起慢慢寫。"
    >
      <CompanionBubble>
        {`這段訊息來自「${senderName}」。
回覆時，會用「${addressTerm}」來稱呼對方。

到這裡，你已經比較靠近自己了。
現在不用一次想完美，
先選一個比較適合此刻的語氣就好。`}
      </CompanionBubble>

      <div className="space-y-2">
        {REPLY_STYLE_OPTIONS.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onStyleChange(style.id)}
            className={`w-full rounded-3xl border px-4 py-4 text-left transition duration-200 ${
              selectedStyle === style.id
                ? "border-soft-green-deep/40 bg-soft-green/50"
                : "border-cream-deep bg-white/55 hover:border-soft-blue/50 hover:bg-white/80"
            }`}
          >
            <p className="text-sm font-semibold text-warm-ink">{style.title}</p>
            <p className="mt-1 text-sm leading-6 text-warm-gray">
              {style.description}
            </p>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <SoftButton onClick={onContinue} disabled={!selectedStyle}>
          幫我寫正式回覆
        </SoftButton>
      </div>
    </JourneyShell>
  );
}
