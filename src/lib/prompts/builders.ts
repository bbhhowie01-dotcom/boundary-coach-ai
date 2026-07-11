import type {
  CoachAiAction,
  CoachSession,
  CoachStreamAction,
  ReplyStyle,
} from "@/types/coach";
import {
  EMOTION_FOLLOWUP_PROMPT,
  FORMAL_REPLY_PROMPT,
  MESSAGE_ANALYSIS_PROMPT,
  MUTUAL_UNDERSTANDING_PROMPT,
  SELF_UNDERSTANDING_PROMPT,
} from "@/lib/prompts/system";
import {
  formatSelectedWithOther,
  replyStyleLabel,
} from "@/lib/stages/staticContent";

function formatRelationship(session: CoachSession): string {
  if (session.relationshipType === "其他" && session.relationshipDescription) {
    return session.relationshipDescription;
  }
  return session.relationshipType;
}

export function buildSessionContext(session: CoachSession): string {
  const lines = [
    `關係：${formatRelationship(session)}`,
    `訊息來自：${session.senderName}`,
    `回覆稱謂：${session.addressTerm}`,
    `收到的訊息（僅供後期階段參考，前期請勿分析）：`,
    `"""`,
    session.message,
    `"""`,
  ];

  if (session.bodySensations.length > 0) {
    lines.push(`身體感受：${session.bodySensations.join("、")}`);
  }
  if (session.firstFeelings.length > 0) {
    lines.push(
      `第一時間感受：${formatSelectedWithOther(session.firstFeelings, session.firstFeelingOther)}`,
    );
  }
  if (session.mostImpactfulLine) {
    lines.push(`最在意的話：${session.mostImpactfulLine}`);
  }
  if (session.touchPoints.length > 0) {
    lines.push(
      `觸動點：${formatSelectedWithOther(session.touchPoints, session.touchPointOther)}`,
    );
  }
  if (session.worries.length > 0) {
    lines.push(
      `最擔心的事：${formatSelectedWithOther(session.worries, session.worryOther)}`,
    );
  }
  if (session.selfAdvocacy) {
    lines.push(`想替自己說的話：${session.selfAdvocacy}`);
  }
  if (session.selectedReplyStyle) {
    lines.push(
      `選定回覆風格：${replyStyleLabel(session.selectedReplyStyle)}（${session.selectedReplyStyle}）`,
    );
  }

  return lines.join("\n");
}

export function buildActionUserPrompt(
  action: CoachAiAction,
  session: CoachSession,
  userInput?: string,
): string {
  const context = buildSessionContext(session);

  switch (action) {
    case "emotion_followup":
      return `${context}

使用者剛回答：${userInput ?? ""}

請給出陪伴式追問或回應。`;

    case "self_understanding":
      return `${context}

請根據以上分享，整理使用者的自我理解。`;

    case "mutual_understanding":
      return `${context}

請整理雙方可能的需求，不評判對錯。`;

    case "message_analysis":
      return `${context}

請分析這則訊息（現在才可以分析）。`;

    case "formal_reply": {
      const style = (session.selectedReplyStyle ??
        (userInput as ReplyStyle | undefined) ??
        "gentle") as ReplyStyle;
      return `${context}

選定風格：${replyStyleLabel(style)}（${style}）
訊息來自：${session.senderName}
稱謂：${session.addressTerm.trim()}

請撰寫正式回覆。務必先真誠理解與感謝，再進入自己的表達。使用上述稱謂開頭。`;
    }

    default:
      return context;
  }
}

export function getActionTaskPrompt(action: CoachAiAction): string {
  switch (action) {
    case "emotion_followup":
      return EMOTION_FOLLOWUP_PROMPT;
    case "self_understanding":
      return SELF_UNDERSTANDING_PROMPT;
    case "mutual_understanding":
      return MUTUAL_UNDERSTANDING_PROMPT;
    case "message_analysis":
      return MESSAGE_ANALYSIS_PROMPT;
    case "formal_reply":
      return FORMAL_REPLY_PROMPT;
  }
}

export function isStreamAction(
  action: CoachAiAction,
): action is CoachStreamAction {
  return (
    action === "emotion_followup" ||
    action === "self_understanding" ||
    action === "formal_reply"
  );
}
