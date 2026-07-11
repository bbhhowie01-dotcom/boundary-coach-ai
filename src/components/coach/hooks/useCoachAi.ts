"use client";

import { useCallback, useState } from "react";
import type {
  CoachAiAction,
  CoachAiData,
  CoachAiErrorResponse,
  CoachAiResponse,
  CoachSession,
} from "@/types/coach";

export function useCoachAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (
      action: CoachAiAction,
      session: CoachSession,
      userInput?: string,
    ): Promise<CoachAiData | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, session, userInput }),
        });

        const payload = (await response.json()) as
          | CoachAiResponse
          | CoachAiErrorResponse;

        if (!response.ok || !payload.success) {
          const message =
            "error" in payload ? payload.error : "陪伴過程出了一點狀況";
          throw new Error(message);
        }

        return payload.data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "陪伴過程出了一點狀況";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { run, loading, error, setError };
}
