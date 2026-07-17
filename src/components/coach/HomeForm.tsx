"use client";

import { useEffect, useState } from "react";
import { SoftButton } from "@/components/coach/SoftButton";
import { OptionChip } from "@/components/coach/OptionChip";
import {
  PARENT_CHILD_ROLE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  suggestAddressTerm,
} from "@/lib/stages/staticContent";
import type { ParentChildRole, RelationshipType } from "@/types/coach";

export type HomeFormValues = {
  relationshipType: RelationshipType;
  parentChildRole?: ParentChildRole;
  customRelationship?: string;
  customParentChildContext?: string;
  senderName: string;
  addressTerm: string;
  message: string;
  userFreeInput?: string;
};

type HomeFormProps = {
  onStart: (data: HomeFormValues) => void;
  initialValues?: Partial<HomeFormValues> | null;
};

export function HomeForm({ onStart, initialValues }: HomeFormProps) {
  const [relationshipType, setRelationshipType] =
    useState<RelationshipType | null>(initialValues?.relationshipType ?? null);
  const [parentChildRole, setParentChildRole] = useState<ParentChildRole | null>(
    initialValues?.parentChildRole ?? null,
  );
  const [customRelationship, setCustomRelationship] = useState(
    initialValues?.customRelationship ?? "",
  );
  const [customParentChildContext, setCustomParentChildContext] = useState(
    initialValues?.customParentChildContext ?? "",
  );
  const [senderName, setSenderName] = useState(initialValues?.senderName ?? "");
  const [addressTerm, setAddressTerm] = useState(
    initialValues?.addressTerm ?? "",
  );
  const [message, setMessage] = useState(initialValues?.message ?? "");
  const [userFreeInput, setUserFreeInput] = useState(
    initialValues?.userFreeInput ?? "",
  );
  const [addressTouched, setAddressTouched] = useState(
    Boolean(initialValues?.addressTerm),
  );
  const [showParentChildHint, setShowParentChildHint] = useState(false);

  useEffect(() => {
    if (!initialValues) return;
    setRelationshipType(initialValues.relationshipType ?? null);
    setParentChildRole(initialValues.parentChildRole ?? null);
    setCustomRelationship(initialValues.customRelationship ?? "");
    setCustomParentChildContext(initialValues.customParentChildContext ?? "");
    setSenderName(initialValues.senderName ?? "");
    setAddressTerm(initialValues.addressTerm ?? "");
    setMessage(initialValues.message ?? "");
    setUserFreeInput(initialValues.userFreeInput ?? "");
    setAddressTouched(Boolean(initialValues.addressTerm));
  }, [initialValues]);

  useEffect(() => {
    if (!relationshipType || addressTouched) return;
    setAddressTerm(suggestAddressTerm(relationshipType, parentChildRole ?? undefined));
  }, [relationshipType, parentChildRole, addressTouched]);

  const parentChildComplete =
    relationshipType !== "親子" ||
    (Boolean(parentChildRole) &&
      (parentChildRole !== "其他親子情境" ||
        customParentChildContext.trim().length > 0));

  const otherComplete =
    relationshipType !== "其他" || customRelationship.trim().length > 0;

  const canSubmit =
    Boolean(relationshipType) &&
    senderName.trim().length > 0 &&
    addressTerm.trim().length > 0 &&
    message.trim().length > 0 &&
    parentChildComplete &&
    otherComplete;

  function handleSelectRelationship(option: RelationshipType) {
    setRelationshipType(option);
    setShowParentChildHint(false);
    if (option !== "親子") {
      setParentChildRole(null);
      setCustomParentChildContext("");
    }
    if (option !== "其他") {
      setCustomRelationship("");
    }
    if (!addressTouched) {
      setAddressTerm(suggestAddressTerm(option, undefined));
    }
  }

  function handleSelectParentChildRole(role: ParentChildRole) {
    setParentChildRole(role);
    setShowParentChildHint(false);
    if (role !== "其他親子情境") {
      setCustomParentChildContext("");
    }
    if (!addressTouched) {
      setAddressTerm(
        suggestAddressTerm(relationshipType ?? "親子", role),
      );
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!relationshipType) return;

    if (
      relationshipType === "親子" &&
      (!parentChildRole ||
        (parentChildRole === "其他親子情境" &&
          !customParentChildContext.trim()))
    ) {
      setShowParentChildHint(true);
      return;
    }

    if (!canSubmit) return;

    onStart({
      relationshipType,
      parentChildRole:
        relationshipType === "親子" ? parentChildRole ?? undefined : undefined,
      customRelationship:
        relationshipType === "其他" ? customRelationship.trim() : undefined,
      customParentChildContext:
        relationshipType === "親子" && parentChildRole === "其他親子情境"
          ? customParentChildContext.trim()
          : undefined,
      senderName: senderName.trim(),
      addressTerm: addressTerm.trim(),
      message: message.trim(),
      userFreeInput: userFreeInput.trim() || undefined,
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
          <legend className="mb-2 text-sm font-semibold text-warm-ink">
            這段訊息來自誰？
          </legend>
          <p className="mb-4 text-sm leading-7 text-warm-gray">
            請選擇「傳這段讓你不舒服訊息的人」和你的關係。
            <br />
            這會幫助 AI 更準確地理解你所在的位置，
            <br />
            但不會儲存你的個人資料。
          </p>
          <div className="flex flex-wrap gap-2">
            {RELATIONSHIP_OPTIONS.map((option) => (
              <OptionChip
                key={option}
                label={option}
                selected={relationshipType === option}
                onClick={() => handleSelectRelationship(option)}
              />
            ))}
          </div>

          {relationshipType === "父母" && (
            <p className="mt-3 text-xs leading-6 text-warm-gray/90">
              「父母」代表：對方是你的父親或母親。
            </p>
          )}

          {relationshipType === "親子" && (
            <div className="mt-5 space-y-3 rounded-3xl border border-cream-deep/90 bg-white/55 px-4 py-4">
              <p className="text-sm font-semibold text-warm-ink">
                你在這段親子關係中的位置是？
              </p>
              <p className="text-xs leading-6 text-warm-gray">
                這會幫助我更靠近你的處境——
                <br />
                子女收到父母的訊息，和父母收到子女的訊息，感受往往很不一樣。
              </p>
              <div className="flex flex-wrap gap-2">
                {PARENT_CHILD_ROLE_OPTIONS.map((role) => (
                  <OptionChip
                    key={role}
                    label={role}
                    selected={parentChildRole === role}
                    onClick={() => handleSelectParentChildRole(role)}
                  />
                ))}
              </div>

              {parentChildRole === "其他親子情境" && (
                <div>
                  <label
                    htmlFor="custom-parent-child"
                    className="mb-2 block text-sm font-semibold text-warm-ink"
                  >
                    請簡單描述你們的親子關係
                  </label>
                  <textarea
                    id="custom-parent-child"
                    value={customParentChildContext}
                    onChange={(e) =>
                      setCustomParentChildContext(e.target.value)
                    }
                    rows={3}
                    placeholder={`例如：
我是照顧年邁父母的成年子女
我是單親媽媽，訊息來自成年子女
我是父親，訊息來自青春期孩子`}
                    className="w-full resize-y rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-warm-gray/55 focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
                  />
                </div>
              )}

              {showParentChildHint ||
              (relationshipType === "親子" && !parentChildRole) ? (
                <p className="text-sm leading-7 text-warm-ink">
                  請先選擇你在這段親子關係中的位置，
                  <br />
                  這會幫助 AI 更準確地陪你理解這段訊息。
                </p>
              ) : null}
            </div>
          )}

          {relationshipType === "其他" && (
            <div className="mt-4">
              <label
                htmlFor="custom-relationship"
                className="mb-2 block text-sm font-semibold text-warm-ink"
              >
                請描述你們的關係
              </label>
              <textarea
                id="custom-relationship"
                value={customRelationship}
                onChange={(e) => setCustomRelationship(e.target.value)}
                rows={3}
                placeholder={`例如：
從小一起長大的朋友
前公司主管
很久沒聯絡的親戚
合作過的客戶`}
                className="w-full resize-y rounded-2xl border border-cream-deep bg-white/70 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-warm-gray/55 focus:border-soft-blue-deep/50 focus:ring-2 focus:ring-soft-blue/40"
              />
            </div>
          )}
        </fieldset>

        <div>
          <label
            htmlFor="sender-name"
            className="mb-3 block text-sm font-semibold text-warm-ink"
          >
            對方的名字或你心裡的叫法是？
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

        <div>
          <label
            htmlFor="user-free-input"
            className="mb-3 block text-sm font-semibold text-warm-ink"
          >
            想補充的背景或故事（選填）
          </label>
          <textarea
            id="user-free-input"
            value={userFreeInput}
            onChange={(e) => setUserFreeInput(e.target.value)}
            rows={5}
            placeholder={`這裡可以寫你的立場、背景、感受。
例如：其實前兩週都有回家、這週工作很累、
你希望對方用什麼方式跟你說話…

你寫得越具體，我越能真的聽見你。`}
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
