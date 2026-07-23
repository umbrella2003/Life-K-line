export type BigFiveTrait = "O" | "C" | "E" | "A" | "N";
export type BigFiveAnswer = "A" | "B" | "C" | "D";

export interface BigFiveQuestion {
  id: number;
  trait: BigFiveTrait;
  keyed: 1 | -1; // 1=正向计分(同意得高分),-1=反向计分(同意得低分)
  text: string;
}

// 采用国际学界广泛使用、可自由使用的大五人格(Big Five/OCEAN)题项风格构建——
// 五个维度(开放性/尽责性/外向性/宜人性/情绪稳定性)各10题,每题正向/反向计分各占一半,
// 与市面上主流大五测试的结构一致:用陈述句 + 同意程度作答,最终每个维度输出 0-100 的连续分数
// (而非像 MBTI 那样输出二分类型)。
export const BIGFIVE_QUESTIONS: BigFiveQuestion[] = [
  // 开放性 Openness
  { id: 1, trait: "O", keyed: 1, text: "我喜欢想象力丰富、天马行空的点子" },
  { id: 2, trait: "O", keyed: 1, text: "我对艺术、音乐或文学有浓厚兴趣" },
  { id: 3, trait: "O", keyed: 1, text: "我喜欢尝试从没做过的新鲜事物" },
  { id: 4, trait: "O", keyed: 1, text: "遇到抽象、复杂的问题,我会觉得很有意思" },
  { id: 5, trait: "O", keyed: 1, text: "我常常有很多与众不同的想法" },
  { id: 6, trait: "O", keyed: -1, text: "我不太喜欢想象或空想那些不切实际的事情" },
  { id: 7, trait: "O", keyed: -1, text: "相比抽象理论,我更关注具体实际的东西" },
  { id: 8, trait: "O", keyed: -1, text: "我不太容易被艺术作品打动" },
  { id: 9, trait: "O", keyed: -1, text: "我更喜欢熟悉的事物,而不是去冒险尝试新事物" },
  { id: 10, trait: "O", keyed: -1, text: "绕来绕去、复杂的想法会让我觉得厌烦" },
  // 尽责性 Conscientiousness
  { id: 11, trait: "C", keyed: 1, text: "我做事情喜欢提前做好充分准备" },
  { id: 12, trait: "C", keyed: 1, text: "我对自己要求很严格,做事一丝不苟" },
  { id: 13, trait: "C", keyed: 1, text: "答应别人的事情,我基本都会按时完成" },
  { id: 14, trait: "C", keyed: 1, text: "我做事很有条理,东西摆放整齐" },
  { id: 15, trait: "C", keyed: 1, text: "开始一件事后,我通常会坚持做完" },
  { id: 16, trait: "C", keyed: -1, text: "我做事经常丢三落四" },
  { id: 17, trait: "C", keyed: -1, text: "我常常把事情一拖再拖" },
  { id: 18, trait: "C", keyed: -1, text: "我对细节不太上心,容易马虎" },
  { id: 19, trait: "C", keyed: -1, text: "我的东西经常摆放得比较凌乱" },
  { id: 20, trait: "C", keyed: -1, text: "定好的计划,我很少认真执行" },
  // 外向性 Extraversion
  { id: 21, trait: "E", keyed: 1, text: "我在人群中通常很健谈" },
  { id: 22, trait: "E", keyed: 1, text: "认识新朋友对我来说很轻松" },
  { id: 23, trait: "E", keyed: 1, text: "我喜欢成为聚会中的焦点" },
  { id: 24, trait: "E", keyed: 1, text: "和很多人在一起时,我会觉得很有活力" },
  { id: 25, trait: "E", keyed: 1, text: "我很容易主动和陌生人开启话题" },
  { id: 26, trait: "E", keyed: -1, text: "我在陌生人面前话不多" },
  { id: 27, trait: "E", keyed: -1, text: "长时间社交后我需要独处来恢复精力" },
  { id: 28, trait: "E", keyed: -1, text: "我更喜欢安静地待在角落,而不是成为焦点" },
  { id: 29, trait: "E", keyed: -1, text: "在团体活动中,我通常比较沉默" },
  { id: 30, trait: "E", keyed: -1, text: "我不太主动去认识新的人" },
  // 宜人性 Agreeableness
  { id: 31, trait: "A", keyed: 1, text: "我很容易体谅和理解别人的处境" },
  { id: 32, trait: "A", keyed: 1, text: "我愿意花时间关心别人的感受" },
  { id: 33, trait: "A", keyed: 1, text: "别人有困难时,我很乐意伸出援手" },
  { id: 34, trait: "A", keyed: 1, text: "我很少与人发生争执" },
  { id: 35, trait: "A", keyed: 1, text: "我信任大多数人" },
  { id: 36, trait: "A", keyed: -1, text: "我对别人的感受不太上心" },
  { id: 37, trait: "A", keyed: -1, text: "我说话有时会比较直接,不太顾及对方感受" },
  { id: 38, trait: "A", keyed: -1, text: "我不太容易信任陌生人" },
  { id: 39, trait: "A", keyed: -1, text: "遇到分歧时,我倾向先维护自己的立场" },
  { id: 40, trait: "A", keyed: -1, text: "我不太愿意为别人的事情花费时间和精力" },
  // 情绪稳定性 Emotional Stability(反向即神经质)
  { id: 41, trait: "N", keyed: 1, text: "大部分时候我的情绪比较平稳" },
  { id: 42, trait: "N", keyed: 1, text: "遇到压力时,我能比较快调整过来" },
  { id: 43, trait: "N", keyed: 1, text: "我很少无缘无故感到焦虑" },
  { id: 44, trait: "N", keyed: 1, text: "面对突发状况,我通常能保持冷静" },
  { id: 45, trait: "N", keyed: 1, text: "我很少因为小事而心情低落" },
  { id: 46, trait: "N", keyed: -1, text: "我很容易因为小事而感到烦躁" },
  { id: 47, trait: "N", keyed: -1, text: "我经常会担心一些还没发生的事情" },
  { id: 48, trait: "N", keyed: -1, text: "遇到压力时,我容易情绪失控" },
  { id: 49, trait: "N", keyed: -1, text: "我的情绪起伏比较大,容易大喜大悲" },
  { id: 50, trait: "N", keyed: -1, text: "我常常会感到紧张不安" },
];

export const ANSWER_LABELS: { key: BigFiveAnswer; label: string }[] = [
  { key: "A", label: "非常同意" },
  { key: "B", label: "比较同意" },
  { key: "C", label: "比较不同意" },
  { key: "D", label: "非常不同意" },
];

const POINT_OF_ANSWER: Record<BigFiveAnswer, number> = { A: 4, B: 3, C: 2, D: 1 };

export const TRAIT_ORDER: BigFiveTrait[] = ["O", "C", "E", "A", "N"];

export const TRAIT_LABELS: Record<BigFiveTrait, string> = {
  O: "开放性",
  C: "尽责性",
  E: "外向性",
  A: "宜人性",
  N: "情绪稳定性",
};

export const TRAIT_ANCHORS: Record<BigFiveTrait, [string, string]> = {
  O: ["务实保守", "富有想象"],
  C: ["随性灵活", "严谨自律"],
  E: ["安静内敛", "外向活跃"],
  A: ["独立直接", "友善合作"],
  N: ["情绪敏感", "情绪稳定"],
};

export interface BigFiveResult {
  scores: Record<BigFiveTrait, number>; // 归一化到 0-100
  raw: Record<BigFiveTrait, number>; // 原始累加分,每维度 10-40
}

export function scoreBigFive(answers: BigFiveAnswer[]): BigFiveResult {
  const raw: Record<BigFiveTrait, number> = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  BIGFIVE_QUESTIONS.forEach((q, idx) => {
    const ans = answers[idx];
    if (!ans) return;
    const point = POINT_OF_ANSWER[ans];
    raw[q.trait] += q.keyed === 1 ? point : 5 - point;
  });
  const scores = {} as Record<BigFiveTrait, number>;
  TRAIT_ORDER.forEach((t) => {
    scores[t] = Math.round(((raw[t] - 10) / 30) * 100);
  });
  return { scores, raw };
}
