"use client";

import { useEffect, useState } from "react";
import { SoftButton } from "@/components/coach/SoftButton";
import { OptionChip } from "@/components/coach/OptionChip";
import {
  RELATIONSHIP_OPTIONS,
  suggestAddressTerm,
} from "@/lib/stages/staticContent";
import type { RelationshipType } from "@/types/coach";

export type HomeFormValues = {
  relationshipType: RelationshipType;
  relationshipDescription?: string;
  senderName: string;
  addressTerm: string;
  message: string;
};

type HomeFormProps = {
  onStart: (data: HomeFormValues) => void;
  initialValues?: Partial<HomeFormValues> | null;
};

export function HomeForm({ onStart, initialValues }: HomeFormProps) {
  const [relationshipType, setRelationshipType] =
    useState<RelationshipType | null>(initialValues?.relationshipType ?? null);
  const [relationshipDescription, setRelationshipDescription] = useState(
    initialValues?.relationshipDescription ?? "",
  );
  const [senderName, setSenderName] = useState(initialValues?.senderName ?? "");
  const [addressTerm, setAddressTerm] = useState(
    initialValues?.addressTerm ?? "",
  );
  const [message, setMessage] = useState(initialValues?.message ?? "");
  const [addressTouched, setAddressTouched] = useState(
    Boolean(initialValues?.addressTerm),
  );

  useEffect(() => {
    if (!initialValues) return;
    setRelationshipType(initialValues.relationshipType ?? null);
    setRelationshipDescription(initialValues.relationshipDescription ?? "");
    setSenderName(initialValues.senderName ?? "");
    setAddressTerm(initialValues.addressTerm ?? "");
    setMessage(initialValues.message ?? "");
    setAddressTouched(Boolean(initialValues.addressTerm));
  }, [initialValues]);

  useEffect(() => {
    if (!relationshipType || addressTouched) return;
    setAddressTerm(suggestAddressTerm(relationshipType));
  }, [relationshipType, addressTouched]);

  const canSubmit =
    Boolean(relationshipType) &&
    senderName.trim().length > 0 &&
    addressTerm.trim().length > 0 &&
    message.trim().length > 0 &&
    (relationshipType !== "其他" || relationshipDescription.trim().length > 0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!relationshipType || !canSubmit) return;

    onStart({
      relationshipType,
      relationshipDescription:
        relationshipType === "其他"
          ? relationshipDescription.trim()
          : undefined,
      senderName: senderName.trim(),
      addressTerm: addressTerm.trim(),
      message: message.trim(),
    });
  }

  return (
    <div className="mx-auto w-full max-w-xl animate-fade-up">
      <header className="mb-10 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight tracking-tight text-warm-ink sm:text-5xl">
          Boundary Coach
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-8 text-warm-gray">
          不是教你如何回覆別人。
          <br />
          而是陪你先聽見自己。
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-warm-gray/85">
          用最溫柔的語氣，守護最堅定的您。
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-warm-ink">
            關係類型
          </legend>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((option) => (
              <OptionChip
                key={option}
                label={option}
                selected={relationshipType === option}
                onClick={() => setRelationshipType(option)}
              />
            ))}
          </div>
          {relationshipType === "其他" && (
            <input
              type="text"
              value={relationshipDescription}
              onChange={(e) => setRelationshipDescription(e.target.value)}
              placeholder="請描述你們的關係"
              className="mt-3 w-full rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
            />
          )}
        </fieldset>

        <div>
          <label
            htmlFor="sender-name"
            className="mb-3 block text-sm font-semibold text-warm-ink"
          >
            這段訊息來自誰？
          </label>
          <input
            id="sender-name"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="例如：媽媽、前男友、主管、客戶小陳…"
            className="w-full rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
          />
        </div>

        <div>
          <label
            htmlFor="address-term"
            className="mb-3 block text-sm font-semibold text-warm-ink"
          >
            你想怎麼稱呼對方？
          </label>
          <input
            id="address-term"
            type="text"
            value={addressTerm}
            onChange={(e) => {
              setAddressTouched(true);
              setAddressTerm(e.target.value);
            }}
            placeholder="例如：媽、親愛的、王經理、小明…"
            className="w-full rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {["媽", "爸", "親愛的", "你"].map((hint) => (
              <OptionChip
                key={hint}
                label={hint}
                selected={addressTerm === hint}
                onClick={() => {
                  setAddressTouched(true);
                  setAddressTerm(hint);
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-3 block text-sm font-semibold text-warm-ink"
          >
            發生了什麼事？
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            placeholder={`把讓你不舒服的訊息貼在這裡。
不需要整理。
不需要修飾。
就照原本的樣子給我就好。`}
            className="w-full resize-y rounded-3xl border border-cream-deep bg-white/70 px-4 py-4 text-sm leading-7 text-warm-ink outline-none transition placeholder:text-warm-gray/55 focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
          />
        </div>

        <div className="flex justify-center pt-2">
          <SoftButton type="submit" disabled={!canSubmit} className="min-w-40">
            陪我看看
          </SoftButton>
        </div>
      </form>
    </div>
  );
}
