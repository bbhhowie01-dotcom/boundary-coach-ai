"use client";

import { useState } from "react";

type CopyBlockProps = {
  title: string;
  content: string;
};

export function CopyBlock({ title, content }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-3xl border border-cream-deep bg-white/65 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-warm-ink">{title}</h3>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-soft-blue-deep hover:underline"
        >
          {copied ? "已複製" : "複製"}
        </button>
      </div>
      <p className="whitespace-pre-line text-sm leading-7 text-warm-gray">
        {content}
      </p>
    </div>
  );
}
