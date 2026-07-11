"use client";

import { useCallback, useRef, useState } from "react";
import type { CoachSession, CoachStreamAction } from "@/types/coach";

type StreamOptions = {
  action: CoachStreamAction;
  session: CoachSession;
  userInput?: string;
  onDelta?: (fullText: string) => void;
};

export function useCoachStream() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setText("");
    setError(null);
    setLoading(false);
  }, []);

  const stream = useCallback(async (options: StreamOptions) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setText("");

    try {
      const response = await fetch("/api/coach/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: options.action,
          session: options.session,
          userInput: options.userInput,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let message = "陪伴過程出了一點狀況";
        try {
          const payload = (await response.json()) as { error?: string };
          if (payload.error) message = payload.error;
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      if (!response.body) {
        throw new Error("無法讀取串流內容");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setText(full);
        options.onDelta?.(full);
      }

      full += decoder.decode();
      setText(full);
      options.onDelta?.(full);
      return full.trim();
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null;
      }
      const message =
        err instanceof Error ? err.message : "陪伴過程出了一點狀況";
      setError(message);
      return null;
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, []);

  return { text, loading, error, stream, reset, setText, setError };
}
