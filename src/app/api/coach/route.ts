import { NextResponse } from "next/server";
import { runCoachAi } from "@/lib/openai";
import type {
  CoachAiAction,
  CoachAiErrorResponse,
  CoachAiRequest,
  CoachAiResponse,
  CoachSession,
} from "@/types/coach";

const VALID_ACTIONS: CoachAiAction[] = [
  "emotion_followup",
  "self_understanding",
  "mutual_understanding",
  "message_analysis",
  "formal_reply",
];

function isValidSession(session: unknown): session is CoachSession {
  if (!session || typeof session !== "object") return false;
  const s = session as CoachSession;
  return Boolean(
    s.message?.trim() &&
      s.relationshipType &&
      s.senderName?.trim() &&
      s.addressTerm?.trim(),
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CoachAiRequest;

    if (!VALID_ACTIONS.includes(body.action)) {
      return NextResponse.json<CoachAiErrorResponse>(
        { success: false, error: "無效的 action" },
        { status: 400 },
      );
    }

    if (!isValidSession(body.session)) {
      return NextResponse.json<CoachAiErrorResponse>(
        { success: false, error: "session 資料不完整" },
        { status: 400 },
      );
    }

    if (body.session.message.length > 4000) {
      return NextResponse.json<CoachAiErrorResponse>(
        { success: false, error: "訊息長度不可超過 4000 字" },
        { status: 400 },
      );
    }

    if (body.action === "formal_reply" && !body.session.selectedReplyStyle) {
      return NextResponse.json<CoachAiErrorResponse>(
        { success: false, error: "請先選擇回覆風格" },
        { status: 400 },
      );
    }

    const data = await runCoachAi(
      body.action,
      body.session,
      body.userInput?.trim(),
    );

    return NextResponse.json<CoachAiResponse>({
      success: true,
      action: body.action,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "陪伴過程發生未知錯誤";

    console.error("[coach]", error);

    return NextResponse.json<CoachAiErrorResponse>(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
