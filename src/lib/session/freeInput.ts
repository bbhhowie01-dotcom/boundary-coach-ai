import type { CoachSession } from "@/types/coach";
import {
  formatRelationshipBackground,
  formatSelectedWithOther,
} from "@/lib/stages/staticContent";

function resolveCustomRelationship(session: CoachSession): string {
  return (
    session.customRelationship?.trim() ||
    session.relationshipDescription?.trim() ||
    ""
  );
}

function formatRelationship(session: CoachSession): string {
  const bg = formatRelationshipBackground({
    relationshipType: session.relationshipType,
    parentChildRole: session.parentChildRole,
    customRelationship: resolveCustomRelationship(session),
    customParentChildContext: session.customParentChildContext,
  });
  return `${bg.title}｜${bg.detail}`;
}

/** 彙整所有使用者自由輸入（第一優先資料來源） */
export function collectFreeInputTexts(session: CoachSession): string[] {
  const parts: string[] = [];

  if (session.userFreeInput?.trim()) {
    parts.push(`【主要自由輸入】\n${session.userFreeInput.trim()}`);
  }
  if (session.selfAdvocacy?.trim()) {
    parts.push(`【想替自己說的話】\n${session.selfAdvocacy.trim()}`);
  }
  if (session.mostImpactfulLine?.trim()) {
    parts.push(`【最在意的話】\n${session.mostImpactfulLine.trim()}`);
  }
  if (session.worryOther?.trim()) {
    parts.push(`【擔心的事（自由描述）】\n${session.worryOther.trim()}`);
  }
  if (session.firstFeelingOther?.trim()) {
    parts.push(`【感受（自由描述）】\n${session.firstFeelingOther.trim()}`);
  }
  if (session.touchPointOther?.trim()) {
    parts.push(`【觸動點（自由描述）】\n${session.touchPointOther.trim()}`);
  }

  return parts;
}

export function hasSubstantialFreeInput(session: CoachSession): boolean {
  const texts = collectFreeInputTexts(session);
  const totalChars = texts.join("").replace(/\s/g, "").length;
  return totalChars >= 20;
}

/** 依優先順序組裝完整 API 脈絡 */
export function buildComprehensiveContext(session: CoachSession): string {
  const freeInputs = collectFreeInputTexts(session);
  const lines: string[] = [];

  lines.push("=== 第一優先：使用者自由輸入 ===");
  if (freeInputs.length > 0) {
    lines.push(freeInputs.join("\n\n"));
  } else {
    lines.push("（使用者尚未提供足夠自由輸入，請溫柔提醒並謹慎推測）");
  }

  lines.push("\n=== 第二優先：對方訊息 ===");
  lines.push(`來自：${session.senderName}`);
  lines.push(`"""${session.message}"""`);

  lines.push("\n=== 第三優先：關係背景 ===");
  lines.push(`relationshipType：${session.relationshipType}`);
  lines.push(`關係說明：${formatRelationship(session)}`);
  if (session.parentChildRole) {
    lines.push(`parentChildRole：${session.parentChildRole}`);
  }
  if (session.customParentChildContext?.trim()) {
    lines.push(
      `customParentChildContext：${session.customParentChildContext.trim()}`,
    );
  }
  const customRel = resolveCustomRelationship(session);
  if (customRel) {
    lines.push(`customRelationship：${customRel}`);
  }
  lines.push(`回覆稱謂：${session.addressTerm}`);

  if (session.relationshipType === "親子") {
    lines.push(`
【親子角色差異提醒】
請特別注意親子關係中的角色差異。
「我是子女，訊息來自父母」和「我是父母，訊息來自子女」需要完全不同的理解角度與回覆語氣。
不要只看到「親子」就生成通用回覆。`);
  }

  lines.push("\n=== 第四優先：選項（僅輔助） ===");
  if (session.bodySensations.length > 0) {
    lines.push(`身體感受：${session.bodySensations.join("、")}`);
  }
  if (session.firstFeelings.length > 0) {
    lines.push(
      `第一時間感受：${formatSelectedWithOther(session.firstFeelings, session.firstFeelingOther)}`,
    );
  }
  if (session.touchPoints.length > 0) {
    lines.push(
      `觸動點：${formatSelectedWithOther(session.touchPoints, session.touchPointOther)}`,
    );
  }
  if (session.worries.length > 0) {
    lines.push(
      `擔心的事：${formatSelectedWithOther(session.worries, session.worryOther)}`,
    );
  }

  return lines.join("\n");
}
