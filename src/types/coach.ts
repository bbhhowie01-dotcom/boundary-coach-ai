/** Boundary Coach — 核心型別定義 */

export type RelationshipType =
  | "父母"
  | "伴侶"
  | "前任"
  | "親戚"
  | "朋友"
  | "同事"
  | "主管"
  | "客戶"
  | "其他";

export type BodySensation =
  | "呼吸有點急"
  | "胸口悶悶的"
  | "肩膀很緊"
  | "心跳變快"
  | "手心出汗"
  | "胃不舒服"
  | "頭痛或頭重"
  | "喉嚨緊緊的"
  | "全身發熱或發冷"
  | "身體發麻"
  | "想哭"
  | "想立刻反擊"
  | "想逃避"
  | "整個人僵住"
  | "沒有特別感覺"
  | "說不上來";

export type FirstFeeling =
  | "不知道"
  | "很亂"
  | "很煩"
  | "很累"
  | "很委屈"
  | "很生氣"
  | "很害怕"
  | "很失望"
  | "很無助"
  | "很羞愧"
  | "很孤單"
  | "很焦慮"
  | "很受傷"
  | "很無奈"
  | "很委屈又生氣"
  | "心裡空空的"
  | "其他";

export type TouchPoint =
  | "被誤解"
  | "被否定"
  | "被責怪"
  | "被控制"
  | "被忽視"
  | "不被尊重"
  | "不公平"
  | "被比較"
  | "被威脅"
  | "被羞辱"
  | "被冷暴力"
  | "被情緒勒索"
  | "付出不被看見"
  | "界線被踩過"
  | "被要求立刻回應"
  | "被打壓或貶低"
  | "其他";

export type WorryConcern =
  | "我不想讓對方失望"
  | "我不想失去這段關係"
  | "我覺得自己不被理解"
  | "我擔心事情會變得更糟"
  | "我害怕衝突升級"
  | "我擔心自己不夠好"
  | "我怕被責怪或被討厭"
  | "我擔心影響工作／生活"
  | "我怕說了也沒用"
  | "我擔心自己會失控"
  | "我怕之後會後悔"
  | "我覺得自己要一個人扛"
  | "我擔心對方會更生氣"
  | "我怕自己的需要不重要"
  | "其他";

export type ReplyStyle = "gentle" | "rational" | "boundary" | "minimal";

export type CoachStageId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14;

export type CoachStageKey =
  | "catch"
  | "body_care"
  | "settling"
  | "emotion_companion"
  | "emotion_awareness"
  | "emotion_source"
  | "self_understanding"
  | "self_advocacy"
  | "mutual_understanding"
  | "boundary"
  | "message_analysis"
  | "reply_style"
  | "formal_reply"
  | "closing";

export interface CoachSessionInput {
  relationshipType: RelationshipType;
  relationshipDescription?: string;
  /** 令人不舒服的訊息來自誰 */
  senderName: string;
  /** 回覆時使用的稱謂 */
  addressTerm: string;
  message: string;
}

export interface CoachSessionResponses {
  bodySensations: BodySensation[];
  firstFeelings: FirstFeeling[];
  firstFeelingOther?: string;
  mostImpactfulLine?: string;
  touchPoints: TouchPoint[];
  touchPointOther?: string;
  worries: WorryConcern[];
  worryOther?: string;
  selfAdvocacy?: string;
  selectedReplyStyle?: ReplyStyle;
}

export interface CoachSession extends CoachSessionInput, CoachSessionResponses {
  sessionId: string;
  startedAt: string;
}

export interface StageConfig {
  id: CoachStageId;
  key: CoachStageKey;
  title: string;
  subtitle?: string;
  requiresAi: boolean;
}

/** AI 可處理的 stage action */
export type CoachAiAction =
  | "self_understanding"
  | "mutual_understanding"
  | "message_analysis"
  | "emotion_followup"
  | "formal_reply";

/** 適合以純文字串流輸出的 action */
export type CoachStreamAction =
  | "emotion_followup"
  | "self_understanding"
  | "formal_reply";

export interface CoachAiRequest {
  action: CoachAiAction;
  session: CoachSession;
  userInput?: string;
}

export interface SelfUnderstandingResult {
  reflection: string;
}

export interface MutualUnderstandingResult {
  userNeeds: string[];
  otherNeeds: string[];
  summary: string;
}

export interface MessageAnalysisResult {
  emotionalIntensity: string;
  communicationPatterns: string[];
  possibleNeeds: string[];
  possibleMisunderstandings: string[];
  conflictFocus: string;
}

export interface FormalReplyResult {
  reply: string;
}

export interface EmotionFollowupResult {
  message: string;
}

export type CoachAiData =
  | SelfUnderstandingResult
  | MutualUnderstandingResult
  | MessageAnalysisResult
  | FormalReplyResult
  | EmotionFollowupResult;

export interface CoachAiResponse {
  success: true;
  action: CoachAiAction;
  data: CoachAiData;
}

export interface CoachAiErrorResponse {
  success: false;
  error: string;
}

export interface JourneyAiCache {
  selfUnderstanding?: SelfUnderstandingResult;
  mutualUnderstanding?: MutualUnderstandingResult;
  messageAnalysis?: MessageAnalysisResult;
  formalReply?: FormalReplyResult;
  emotionFollowup?: EmotionFollowupResult;
}
