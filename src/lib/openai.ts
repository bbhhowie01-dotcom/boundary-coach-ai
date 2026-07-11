import OpenAI from "openai";
import {
  buildActionUserPrompt,
  getActionTaskPrompt,
  isStreamAction,
} from "@/lib/prompts/builders";
import { COACH_SYSTEM_PROMPT } from "@/lib/prompts/system";
import type {
  CoachAiAction,
  CoachAiData,
  CoachSession,
  CoachStreamAction,
  EmotionFollowupResult,
  FormalReplyResult,
  MessageAnalysisResult,
  MutualUnderstandingResult,
  SelfUnderstandingResult,
} from "@/types/coach";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY 尚未設定");
  }
  return new OpenAI({ apiKey });
}

function getModel() {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

function buildMessages(action: CoachAiAction, session: CoachSession, userInput?: string) {
  const taskPrompt = getActionTaskPrompt(action);
  const userPrompt = buildActionUserPrompt(action, session, userInput);
  return [
    { role: "system" as const, content: `${COACH_SYSTEM_PROMPT}\n\n${taskPrompt}` },
    { role: "user" as const, content: userPrompt },
  ];
}

function parseAiData(action: CoachAiAction, content: string): CoachAiData {
  if (isStreamAction(action)) {
    const text = content.trim();
    if (!text) throw new Error("AI 回傳格式不完整");
    if (action === "emotion_followup") {
      return { message: text } satisfies EmotionFollowupResult;
    }
    if (action === "self_understanding") {
      return { reflection: text } satisfies SelfUnderstandingResult;
    }
    return { reply: text } satisfies FormalReplyResult;
  }

  const parsed = JSON.parse(content) as unknown;

  switch (action) {
    case "mutual_understanding": {
      const data = parsed as MutualUnderstandingResult;
      if (!Array.isArray(data?.userNeeds) || !data?.summary) {
        throw new Error("AI 回傳格式不完整");
      }
      return {
        userNeeds: data.userNeeds,
        otherNeeds: Array.isArray(data.otherNeeds) ? data.otherNeeds : [],
        summary: data.summary,
      };
    }
    case "message_analysis": {
      const data = parsed as MessageAnalysisResult;
      if (!data?.emotionalIntensity || !data?.conflictFocus) {
        throw new Error("AI 回傳格式不完整");
      }
      return {
        emotionalIntensity: data.emotionalIntensity,
        communicationPatterns: Array.isArray(data.communicationPatterns)
          ? data.communicationPatterns
          : [],
        possibleNeeds: Array.isArray(data.possibleNeeds)
          ? data.possibleNeeds
          : [],
        possibleMisunderstandings: Array.isArray(
          data.possibleMisunderstandings,
        )
          ? data.possibleMisunderstandings
          : [],
        conflictFocus: data.conflictFocus,
      };
    }
    default:
      throw new Error("未知的 AI action");
  }
}

export async function runCoachAi(
  action: CoachAiAction,
  session: CoachSession,
  userInput?: string,
): Promise<CoachAiData> {
  const client = getOpenAIClient();
  const messages = buildMessages(action, session, userInput);
  const useJson = !isStreamAction(action);

  const completion = await client.chat.completions.create({
    model: getModel(),
    temperature: action === "formal_reply" ? 0.7 : 0.6,
    ...(useJson ? { response_format: { type: "json_object" as const } } : {}),
    messages,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI 未回傳有效內容");
  }

  return parseAiData(action, content);
}

/** 串流純文字陪伴／正式回覆 */
export async function streamCoachAiText(
  action: CoachStreamAction,
  session: CoachSession,
  userInput?: string,
): Promise<ReadableStream<Uint8Array>> {
  const client = getOpenAIClient();
  const messages = buildMessages(action, session, userInput);

  const completion = await client.chat.completions.create({
    model: getModel(),
    temperature: action === "formal_reply" ? 0.7 : 0.6,
    stream: true,
    messages,
  });

  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            controller.enqueue(encoder.encode(delta));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
