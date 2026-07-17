import type {
  CoachAiAction,
  CoachSession,
  CoachStreamAction,
  ReplyStyle,
} from "@/types/coach";
import { COMPREHENSIVE_INSIGHTS_PROMPT, REPLY_OPTIONS_PROMPT } from "@/lib/prompts/comprehensive";
import { buildComprehensiveContext } from "@/lib/session/freeInput";
import {
  EMOTION_FOLLOWUP_PROMPT,
  FORMAL_REPLY_PROMPT,
  MESSAGE_ANALYSIS_PROMPT,
  MUTUAL_UNDERSTANDING_PROMPT,
  SELF_UNDERSTANDING_PROMPT,
} from "@/lib/prompts/system";
import { replyStyleLabel } from "@/lib/stages/staticContent";

export function buildSessionContext(session: CoachSession): string {
  const lines = [buildComprehensiveContext(session)];

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

請撰寫正式回覆。務必先真誠理解與感謝，再進入自己的表達。使用上述稱謂開頭。
每一則回覆都必須帶入使用者自由輸入中的至少一個具體元素。`;
    }

    case "comprehensive_insights":
      return `${context}

請產出完整陪伴洞察報告（不要包含回覆建議 replyOptions）。`;

    case "reply_options":
      return `${context}

${
  userInput?.trim()
    ? `使用者補充說明（請優先納入新一版回覆）：
"""
${userInput.trim()}
"""
`
    : ""
}
請產出四種回覆建議。`;

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
    case "comprehensive_insights":
      return COMPREHENSIVE_INSIGHTS_PROMPT;
    case "reply_options":
      return REPLY_OPTIONS_PROMPT;
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
