import { streamCoachAiText } from "@/lib/openai";
import { isStreamAction } from "@/lib/prompts/builders";
import type {
  CoachAiAction,
  CoachAiErrorResponse,
  CoachAiRequest,
  CoachSession,
} from "@/types/coach";

const VALID_STREAM_ACTIONS: CoachAiAction[] = [
  "emotion_followup",
  "self_understanding",
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

    if (!VALID_STREAM_ACTIONS.includes(body.action) || !isStreamAction(body.action)) {
      return Response.json(
        { success: false, error: "此 action 不支援串流" } satisfies CoachAiErrorResponse,
        { status: 400 },
      );
    }

    if (!isValidSession(body.session)) {
      return Response.json(
        { success: false, error: "session 資料不完整" } satisfies CoachAiErrorResponse,
        { status: 400 },
      );
    }

    if (body.session.message.length > 4000) {
      return Response.json(
        {
          success: false,
          error: "訊息長度不可超過 4000 字",
        } satisfies CoachAiErrorResponse,
        { status: 400 },
      );
    }

    if (body.action === "formal_reply" && !body.session.selectedReplyStyle) {
      return Response.json(
        { success: false, error: "請先選擇回覆風格" } satisfies CoachAiErrorResponse,
        { status: 400 },
      );
    }

    const stream = await streamCoachAiText(
      body.action,
      body.session,
      body.userInput?.trim(),
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "陪伴過程發生未知錯誤";

    console.error("[coach/stream]", error);

    return Response.json(
      { success: false, error: message } satisfies CoachAiErrorResponse,
      { status: 500 },
    );
  }
}
