import type { CoachStageId, CoachStageKey } from "@/types/coach";

export interface CoachStageConfig {
  id: CoachStageId;
  key: CoachStageKey;
  title: string;
  subtitle?: string;
  requiresAi: boolean;
}
