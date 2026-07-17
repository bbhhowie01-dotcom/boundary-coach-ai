import type {
  BodySensation,
  FirstFeeling,
  ParentChildRole,
  RelationshipType,
  ReplyStyle,
  TouchPoint,
  WorryConcern,
} from "@/types/coach";

export const RELATIONSHIP_OPTIONS = [
  "父母",
  "親子",
  "伴侶",
  "前任",
  "親戚",
  "朋友",
  "同事",
  "主管",
  "客戶",
  "其他",
] as const satisfies readonly RelationshipType[];

export const PARENT_CHILD_ROLE_OPTIONS: ParentChildRole[] = [
  "我是子女，訊息來自父母",
  "我是父母，訊息來自子女",
  "我是媽媽，訊息來自子女",
  "我是爸爸，訊息來自子女",
  "我是成年子女，訊息來自父母",
  "其他親子情境",
];

export const BODY_SENSATION_OPTIONS: BodySensation[] = [
  "呼吸有點急",
  "胸口悶悶的",
  "肩膀很緊",
  "心跳變快",
  "手心出汗",
  "胃不舒服",
  "頭痛或頭重",
  "喉嚨緊緊的",
  "全身發熱或發冷",
  "身體發麻",
  "想哭",
  "想立刻反擊",
  "想逃避",
  "整個人僵住",
  "沒有特別感覺",
  "說不上來",
];

export const FIRST_FEELING_OPTIONS: FirstFeeling[] = [
  "不知道",
  "很亂",
  "很煩",
  "很累",
  "很委屈",
  "很生氣",
  "很害怕",
  "很失望",
  "很無助",
  "很羞愧",
  "很孤單",
  "很焦慮",
  "很受傷",
  "很無奈",
  "很委屈又生氣",
  "心裡空空的",
  "其他",
];

export const TOUCH_POINT_OPTIONS: TouchPoint[] = [
  "被誤解",
  "被否定",
  "被責怪",
  "被控制",
  "被忽視",
  "不被尊重",
  "不公平",
  "被比較",
  "被威脅",
  "被羞辱",
  "被冷暴力",
  "被情緒勒索",
  "付出不被看見",
  "界線被踩過",
  "被要求立刻回應",
  "被打壓或貶低",
  "其他",
];

export const WORRY_OPTIONS: WorryConcern[] = [
  "我不想讓對方失望",
  "我不想失去這段關係",
  "我覺得自己不被理解",
  "我擔心事情會變得更糟",
  "我害怕衝突升級",
  "我擔心自己不夠好",
  "我怕被責怪或被討厭",
  "我擔心影響工作／生活",
  "我怕說了也沒用",
  "我擔心自己會失控",
  "我怕之後會後悔",
  "我覺得自己要一個人扛",
  "我擔心對方會更生氣",
  "我怕自己的需要不重要",
  "其他",
];

export const REPLY_STYLE_OPTIONS: {
  id: ReplyStyle;
  title: string;
  description: string;
}[] = [
  {
    id: "gentle",
    title: "溫和版",
    description: "先接住對方，再溫柔說出自己的感受與需要。",
  },
  {
    id: "rational",
    title: "理性版",
    description: "語氣平穩，清楚整理事實、感受與期待。",
  },
  {
    id: "boundary",
    title: "界線版",
    description: "尊重對方，同時把底線說得清楚、溫柔而堅定。",
  },
  {
    id: "minimal",
    title: "極簡版",
    description: "簡短回應，保留空間，不捲入情緒拉扯。",
  },
];

export const MULTI_SELECT_HINT = "可以選多個，想到什麼就點什麼。";

export const STAGE_1_MESSAGE = `謝謝你願意把這段訊息帶來這裡。
有些話，光是看見，心就已經先緊了一下。
現在不用急著回覆對方，
也不用急著弄清楚誰對誰錯。
我們先好好待在你身邊就好。`;

export const CARE_TIPS = [
  "如果可以，先喝幾口水。",
  "肩膀可以輕輕放下來一點。",
  "沒有人規定，現在就要把這件事處理完。",
];

export const STAGE_3_MESSAGE = `現在不用急著把情緒整理得很漂亮。
也不用強迫自己立刻冷靜。
只要允許自己停一下，
讓呼吸慢一點，
就已經很好了。`;

export const STAGE_3_REMINDERS = [
  "你不需要立刻回覆。",
  "你不需要立刻做決定。",
  "你也不需要現在就顯得堅強。",
];

export const BOUNDARY_REMINDERS = [
  {
    title: "理解對方",
    body: "不等於同意對方",
  },
  {
    title: "同理對方",
    body: "不等於承擔對方情緒",
  },
  {
    title: "建立界線",
    body: "不等於自私",
  },
  {
    title: "拒絕",
    body: "不等於傷害對方",
  },
];

export const CLOSING_MESSAGE = `謝謝你願意讓我陪你走到這裡。
無論最後決定怎麼做、要不要送出那則回覆，
至少現在的你，
比剛看到那則訊息時，
多理解了自己一點點。
這就很不容易了。`;

export const BREATH_CONFIG = {
  inhaleSeconds: 4,
  holdSeconds: 4,
  exhaleSeconds: 6,
  rounds: 3,
};

/** 依關係類型給出稱謂建議（可再由使用者修改） */
export function suggestAddressTerm(
  type: RelationshipType,
  parentChildRole?: ParentChildRole,
): string {
  switch (type) {
    case "父母":
      return "爸／媽";
    case "親子":
      if (
        parentChildRole === "我是子女，訊息來自父母" ||
        parentChildRole === "我是成年子女，訊息來自父母"
      ) {
        return "爸／媽";
      }
      if (
        parentChildRole === "我是父母，訊息來自子女" ||
        parentChildRole === "我是媽媽，訊息來自子女" ||
        parentChildRole === "我是爸爸，訊息來自子女"
      ) {
        return "";
      }
      return "";
    case "伴侶":
      return "親愛的";
    case "主管":
      return "主管";
    case "客戶":
      return "";
    case "前任":
    case "親戚":
    case "朋友":
    case "同事":
    case "其他":
    default:
      return "";
  }
}

/** 結果頁／摘要顯示用的關係背景文字 */
export function formatRelationshipBackground(input: {
  relationshipType: RelationshipType;
  parentChildRole?: ParentChildRole;
  customRelationship?: string;
  customParentChildContext?: string;
  relationshipDescription?: string;
}): { title: string; detail: string } {
  const customOther =
    input.customRelationship?.trim() ||
    input.relationshipDescription?.trim() ||
    "";

  if (input.relationshipType === "親子") {
    const role =
      input.parentChildRole === "其他親子情境" &&
      input.customParentChildContext?.trim()
        ? input.customParentChildContext.trim()
        : input.parentChildRole ?? "尚未說明位置";
    return {
      title: "親子關係",
      detail: `你的位置：${role}`,
    };
  }

  if (input.relationshipType === "父母") {
    return {
      title: "父母",
      detail: "對方是你的父母",
    };
  }

  if (input.relationshipType === "其他" && customOther) {
    return {
      title: "其他關係",
      detail: customOther,
    };
  }

  return {
    title: input.relationshipType,
    detail: `對方與你的關係：${input.relationshipType}`,
  };
}

export function replyStyleLabel(style: ReplyStyle): string {
  return (
    REPLY_STYLE_OPTIONS.find((item) => item.id === style)?.title ?? style
  );
}

/** 陣列選項切換（複選） */
export function toggleOption<T extends string>(
  selected: T[],
  option: T,
): T[] {
  return selected.includes(option)
    ? selected.filter((item) => item !== option)
    : [...selected, option];
}

export function formatSelectedWithOther(
  selected: string[],
  otherText?: string,
): string {
  const parts = selected.map((item) =>
    item === "其他" && otherText?.trim() ? `其他（${otherText.trim()}）` : item,
  );
  return parts.join("、");
}
