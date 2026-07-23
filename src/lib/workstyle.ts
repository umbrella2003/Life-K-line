export type WorkstyleTrait =
  | "adjustment"
  | "ambition"
  | "sociability"
  | "sensitivity"
  | "prudence"
  | "inquisitive"
  | "learning";

export type WorkstyleAnswer = "A" | "B" | "C" | "D";

export interface WorkstyleQuestion {
  id: number;
  trait: WorkstyleTrait;
  keyed: 1 | -1;
  text: string;
}

// 职场性格七维度测评:参考职业心理学界公开讨论过的"职场人格七维度"框架构建
// (情绪稳定度/进取动力/社交活力/人际敏感度/谨慎自律/好奇探索/学习钻研,
// 常见于领导力与团队协作评估场景),题目与计分逻辑均为原创,不属于任何商业测评
// 机构的专有题库,仅为同类风格的娱乐化职场性格测评。七个维度各6题,3正向3反向计分,
// 输出 0-100 的连续分数。
export const WORKSTYLE_QUESTIONS: WorkstyleQuestion[] = [
  // 情绪稳定度 Adjustment
  { id: 1, trait: "adjustment", keyed: 1, text: "面对突发压力,我通常能保持镇定" },
  { id: 2, trait: "adjustment", keyed: 1, text: "被批评时,我不会立刻情绪激动" },
  { id: 3, trait: "adjustment", keyed: 1, text: "遇到挫折,我能比较快恢复过来" },
  { id: 4, trait: "adjustment", keyed: -1, text: "工作压力大时,我容易变得烦躁不安" },
  { id: 5, trait: "adjustment", keyed: -1, text: "被否定时,我会耿耿于怀很久" },
  { id: 6, trait: "adjustment", keyed: -1, text: "意外状况会让我明显慌乱" },
  // 进取动力 Ambition
  { id: 7, trait: "ambition", keyed: 1, text: "我喜欢主动争取有挑战性的任务" },
  { id: 8, trait: "ambition", keyed: 1, text: "我对晋升、成就有比较强的渴望" },
  { id: 9, trait: "ambition", keyed: 1, text: "团队缺少带头人时,我会主动站出来" },
  { id: 10, trait: "ambition", keyed: -1, text: "我不太在意自己在团队中是否突出" },
  { id: 11, trait: "ambition", keyed: -1, text: "面对竞争,我倾向顺其自然,不主动争取" },
  { id: 12, trait: "ambition", keyed: -1, text: "我对职位、头衔没有太大兴趣" },
  // 社交活力 Sociability
  { id: 13, trait: "sociability", keyed: 1, text: "我喜欢在工作中和很多人打交道" },
  { id: 14, trait: "sociability", keyed: 1, text: "陌生的社交场合,我也能很快融入" },
  { id: 15, trait: "sociability", keyed: 1, text: "我享受在人前表达、展示自己" },
  { id: 16, trait: "sociability", keyed: -1, text: "我更喜欢独立完成任务,少和人打交道" },
  { id: 17, trait: "sociability", keyed: -1, text: "大型社交场合会让我觉得有些疲惫" },
  { id: 18, trait: "sociability", keyed: -1, text: "我不太主动在会议上发言" },
  // 人际敏感度 Interpersonal Sensitivity
  { id: 19, trait: "sensitivity", keyed: 1, text: "我很在意和同事保持融洽的关系" },
  { id: 20, trait: "sensitivity", keyed: 1, text: "提出反对意见时,我会顾及对方的感受" },
  { id: 21, trait: "sensitivity", keyed: 1, text: "我很擅长察觉团队里的情绪氛围" },
  { id: 22, trait: "sensitivity", keyed: -1, text: "我说话比较直接,不太顾忌对方感受" },
  { id: 23, trait: "sensitivity", keyed: -1, text: "团队摩擦时,我不太会主动去调和" },
  { id: 24, trait: "sensitivity", keyed: -1, text: "我不太擅长察觉别人情绪上的变化" },
  // 谨慎自律 Prudence
  { id: 25, trait: "prudence", keyed: 1, text: "我做事严格按照流程和规范来" },
  { id: 26, trait: "prudence", keyed: 1, text: "交给我的任务,我会认真检查确保不出错" },
  { id: 27, trait: "prudence", keyed: 1, text: "我很少临时打破自己的计划" },
  { id: 28, trait: "prudence", keyed: -1, text: "规矩太多时,我会想办法绕过去" },
  { id: 29, trait: "prudence", keyed: -1, text: "我做事有时会图快而忽略细节" },
  { id: 30, trait: "prudence", keyed: -1, text: "我不太喜欢被条条框框束缚" },
  // 好奇探索 Inquisitive
  { id: 31, trait: "inquisitive", keyed: 1, text: "我喜欢琢磨新点子、新方法" },
  { id: 32, trait: "inquisitive", keyed: 1, text: "我对行业趋势和新技术很感兴趣" },
  { id: 33, trait: "inquisitive", keyed: 1, text: "遇到问题,我喜欢从不同角度去想解法" },
  { id: 34, trait: "inquisitive", keyed: -1, text: "我更倾向沿用已经验证过的老办法" },
  { id: 35, trait: "inquisitive", keyed: -1, text: "探索性的、不确定的任务会让我有些抵触" },
  { id: 36, trait: "inquisitive", keyed: -1, text: "我对宏观、战略性的话题兴趣不大" },
  // 学习钻研 Learning Approach
  { id: 37, trait: "learning", keyed: 1, text: "我喜欢持续学习新知识、新技能" },
  { id: 38, trait: "learning", keyed: 1, text: "遇到不懂的问题,我会主动深入研究" },
  { id: 39, trait: "learning", keyed: 1, text: "我经常主动阅读专业书籍或资料" },
  { id: 40, trait: "learning", keyed: -1, text: "学习新东西对我来说是件麻烦事" },
  { id: 41, trait: "learning", keyed: -1, text: "我更愿意用熟悉的方法,而不想学新的" },
  { id: 42, trait: "learning", keyed: -1, text: "我很少主动去钻研专业以外的知识" },
];

export const ANSWER_LABELS: { key: WorkstyleAnswer; label: string }[] = [
  { key: "A", label: "非常同意" },
  { key: "B", label: "比较同意" },
  { key: "C", label: "比较不同意" },
  { key: "D", label: "非常不同意" },
];

const POINT_OF_ANSWER: Record<WorkstyleAnswer, number> = { A: 4, B: 3, C: 2, D: 1 };

export const TRAIT_ORDER: WorkstyleTrait[] = [
  "adjustment",
  "ambition",
  "sociability",
  "sensitivity",
  "prudence",
  "inquisitive",
  "learning",
];

export const TRAIT_LABELS: Record<WorkstyleTrait, string> = {
  adjustment: "情绪稳定度",
  ambition: "进取动力",
  sociability: "社交活力",
  sensitivity: "人际敏感度",
  prudence: "谨慎自律",
  inquisitive: "好奇探索",
  learning: "学习钻研",
};

export const TRAIT_ANCHORS: Record<WorkstyleTrait, [string, string]> = {
  adjustment: ["情绪敏感", "沉稳抗压"],
  ambition: ["安于现状", "积极进取"],
  sociability: ["独立内敛", "外向健谈"],
  sensitivity: ["直接坦率", "圆融体贴"],
  prudence: ["灵活随性", "严谨自律"],
  inquisitive: ["务实保守", "求新善变"],
  learning: ["经验导向", "钻研好学"],
};

export interface WorkstyleResult {
  scores: Record<WorkstyleTrait, number>; // 归一化到 0-100
  raw: Record<WorkstyleTrait, number>; // 原始累加分,每维度 6-24
}

export function scoreWorkstyle(answers: WorkstyleAnswer[]): WorkstyleResult {
  const raw = {} as Record<WorkstyleTrait, number>;
  TRAIT_ORDER.forEach((t) => (raw[t] = 0));
  WORKSTYLE_QUESTIONS.forEach((q, idx) => {
    const ans = answers[idx];
    if (!ans) return;
    const point = POINT_OF_ANSWER[ans];
    raw[q.trait] += q.keyed === 1 ? point : 5 - point;
  });
  const scores = {} as Record<WorkstyleTrait, number>;
  TRAIT_ORDER.forEach((t) => {
    scores[t] = Math.round(((raw[t] - 6) / 18) * 100);
  });
  return { scores, raw };
}
