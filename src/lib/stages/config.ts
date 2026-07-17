import type { CoachStageConfig } from "@/lib/stages/types";

export const STAGE_CONFIGS: CoachStageConfig[] = [
  {
    id: 1,
    key: "catch",
    title: "接住你",
    requiresAi: false,
  },
  {
    id: 2,
    key: "body_care",
    title: "照顧身體",
    requiresAi: false,
  },
  {
    id: 3,
    key: "settling",
    title: "心理安頓",
    requiresAi: false,
  },
  {
    id: 4,
    key: "emotion_companion",
    title: "情緒陪伴",
    requiresAi: false,
  },
  {
    id: 5,
    key: "emotion_awareness",
    title: "情緒覺察",
    requiresAi: true,
  },
  {
    id: 6,
    key: "emotion_source",
    title: "情緒來源",
    requiresAi: false,
  },
  {
    id: 7,
    key: "self_advocacy",
    title: "替自己說話",
    requiresAi: false,
  },
  {
    id: 8,
    key: "comprehensive_insights",
    title: "陪伴整理",
    requiresAi: true,
  },
];

export const TOTAL_STAGES = STAGE_CONFIGS.length;

export function getStageConfig(id: number) {
  return STAGE_CONFIGS.find((s) => s.id === id);
}
