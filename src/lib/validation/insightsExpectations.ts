import type { ComprehensiveInsightsResult } from "@/types/coach";

/** 產品規格測試案例：父母／回家／工作累 */
export const FREE_INPUT_TEST_CASE = {
  relationshipType: "父母" as const,
  senderName: "媽媽",
  addressTerm: "媽",
  message: "你現在都不回家，養你這麼大有什麼用？",
  userFreeInput: `我其實前兩週都有回家，只是這週工作很累。
我不是不在乎家人，只是我真的需要休息。
我希望媽媽知道我有努力，但不要用責備的方式跟我說話。`,
};

const GENERIC_REPLY_PATTERNS = [
  "我最近比較忙，希望你理解",
  "最近比較忙",
  "希望你理解",
];

type ValidationResult = {
  passed: boolean;
  checks: { name: string; passed: boolean; detail?: string }[];
};

function includesAny(text: string, keywords: string[]): boolean {
  const normalized = text.replace(/\s/g, "");
  return keywords.some((keyword) => normalized.includes(keyword.replace(/\s/g, "")));
}

function excludesGeneric(reply: string): boolean {
  return !GENERIC_REPLY_PATTERNS.some((pattern) => reply.includes(pattern));
}

/** 驗證 AI 回傳是否反映自由輸入（可用於手動或自動測試） */
export function validateFreeInputTestCase(
  result: ComprehensiveInsightsResult,
): ValidationResult {
  const heardText = result.heardSummary.join(" ");
  const replies = result.replyOptions
    ? Object.values(result.replyOptions)
    : [];
  const repliesWithHome = replies.filter(
    (reply) =>
      includesAny(reply, ["前兩週", "回家", "都有回家"]) ||
      includesAny(reply, ["這週", "休息", "工作很累", "很累"]),
  );

  const checks = [
    {
      name: "heardSummary 提到前兩週都有回家",
      passed: includesAny(heardText, ["前兩週", "都有回家", "有回家"]),
    },
    {
      name: "heardSummary 提到這週工作很累",
      passed: includesAny(heardText, ["這週", "工作", "累", "疲憊", "休息"]),
    },
    {
      name: "selfStatement 提到不是不在乎家人",
      passed: includesAny(result.selfStatement, [
        "不是不在乎",
        "在乎家人",
        "不是不關心",
      ]),
    },
    {
      name: "replyOptions 至少兩個版本含具體元素（若已產生回覆）",
      passed: !result.replyOptions || repliesWithHome.length >= 2,
      detail: result.replyOptions
        ? `符合 ${repliesWithHome.length} / 4 則`
        : "尚未產生回覆（可選）",
    },
    {
      name: "replyOptions 避免過度通用句（若已產生回覆）",
      passed: !result.replyOptions || replies.every(excludesGeneric),
    },
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks,
  };
}
