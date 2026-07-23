export type Dichotomy = "EI" | "SN" | "TF" | "JP";
export type Letter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type MbtiAnswer = "A" | "B" | "C" | "D";

export interface MbtiQuestion {
  id: number;
  dichotomy: Dichotomy;
  letter: Letter; // 同意该陈述时倾向的字母
  text: string;
}

// 每题是单一陈述,用"非常同意/比较同意/比较不同意/非常不同意"四档作答(见 ANSWER_LABELS)。
// 同一维度的陈述有意穿插正反两极,避免"全部同意"时结果被单向拉偏。这是一套原创但遵循
// 标准 MBTI 四维二分理论(E/I、S/N、T/F、J/P)构建的测评,用于"东方玄学"页的易经联动测试,
// 以及"现代科学"页的独立人格测试——两处共用同一套题库与计分逻辑,结果保持一致。
export const MBTI_QUESTIONS: MbtiQuestion[] = [
  { id: 1, dichotomy: "EI", letter: "E", text: "认识新朋友对我来说很容易,社交场合我很自在" },
  { id: 2, dichotomy: "EI", letter: "I", text: "陌生环境里我更习惯先观察,再慢慢熟悉" },
  { id: 3, dichotomy: "EI", letter: "E", text: "参加聚会时,我常常是那个主动带动气氛的人" },
  { id: 4, dichotomy: "EI", letter: "I", text: "长时间独处会让我感觉很放松,而不是无聊" },
  { id: 5, dichotomy: "EI", letter: "E", text: "遇到问题,我更习惯说出来跟别人讨论着想" },
  { id: 6, dichotomy: "EI", letter: "I", text: "想清楚一件事之前,我习惯自己先琢磨" },
  { id: 7, dichotomy: "EI", letter: "E", text: "人多热闹的场合会让我觉得很有活力" },
  { id: 8, dichotomy: "EI", letter: "I", text: "我更喜欢维系几个亲密的老朋友,而不是拓展很多新关系" },
  { id: 9, dichotomy: "EI", letter: "E", text: "我说话通常比想清楚更快,喜欢边说边想" },
  { id: 10, dichotomy: "EI", letter: "I", text: "社交一整天后,我需要一段独处时间来恢复精力" },
  { id: 11, dichotomy: "EI", letter: "E", text: "假期我更想出去走走、体验新环境" },
  { id: 12, dichotomy: "EI", letter: "I", text: "相比大型聚会,我更享受小范围、深入的交谈" },
  { id: 13, dichotomy: "EI", letter: "E", text: "团队讨论时,我倾向第一时间发表看法" },
  { id: 14, dichotomy: "SN", letter: "S", text: "做计划时,我更关注具体、可执行的细节" },
  { id: 15, dichotomy: "SN", letter: "N", text: "我常常会联想到各种可能性,而不只是眼前的事实" },
  { id: 16, dichotomy: "SN", letter: "S", text: "我更相信亲眼所见、亲手验证过的东西" },
  { id: 17, dichotomy: "SN", letter: "N", text: "我喜欢跳跃式思考,先想终点再倒推过程" },
  { id: 18, dichotomy: "SN", letter: "S", text: "别人形容我比较务实、脚踏实地" },
  { id: 19, dichotomy: "SN", letter: "N", text: "别人形容我比较有想象力、爱天马行空" },
  { id: 20, dichotomy: "SN", letter: "S", text: "我喜欢按部就班、一步一步把事情做完" },
  { id: 21, dichotomy: "SN", letter: "N", text: "看小说或电影时,我更在意背后的隐喻和主题" },
  { id: 22, dichotomy: "SN", letter: "S", text: "学新东西时,我喜欢先掌握具体的操作步骤" },
  { id: 23, dichotomy: "SN", letter: "N", text: "我常常在脑子里冒出一些'如果...会怎样'的设想" },
  { id: 24, dichotomy: "SN", letter: "S", text: "我更信任经验和已被验证过的方法" },
  { id: 25, dichotomy: "SN", letter: "N", text: "我对抽象的理论和概念很感兴趣" },
  { id: 26, dichotomy: "TF", letter: "T", text: "做决定时,我更看重逻辑和道理" },
  { id: 27, dichotomy: "TF", letter: "F", text: "做决定时,我更看重当下人的感受" },
  { id: 28, dichotomy: "TF", letter: "T", text: "朋友吵架来找我,我会先帮忙分析谁对谁错" },
  { id: 29, dichotomy: "TF", letter: "F", text: "朋友吵架来找我,我会先安慰情绪、表达理解" },
  { id: 30, dichotomy: "TF", letter: "T", text: "被人说'你太理性冷静了',我不会太在意" },
  { id: 31, dichotomy: "TF", letter: "F", text: "我很在意别人是否觉得我冷漠或不近人情" },
  { id: 32, dichotomy: "TF", letter: "T", text: "评价一件事时,我倾向先问'这样做对不对'" },
  { id: 33, dichotomy: "TF", letter: "F", text: "评价一件事时,我倾向先问'大家会不会难受'" },
  { id: 34, dichotomy: "TF", letter: "T", text: "给建议时,我习惯直接指出问题所在" },
  { id: 35, dichotomy: "TF", letter: "F", text: "给建议时,我会先照顾对方的情绪再说" },
  { id: 36, dichotomy: "TF", letter: "T", text: "我做决定时,很少被个人情绪影响判断" },
  { id: 37, dichotomy: "TF", letter: "F", text: "我很容易被身边人的情绪感染" },
  { id: 38, dichotomy: "TF", letter: "T", text: "我觉得公平比照顾每个人的感受更重要" },
  { id: 39, dichotomy: "JP", letter: "J", text: "我喜欢提前把行程、计划都安排好" },
  { id: 40, dichotomy: "JP", letter: "P", text: "我喜欢随性一点,走到哪算哪" },
  { id: 41, dichotomy: "JP", letter: "J", text: "我的东西摆放分类清楚,比较有秩序" },
  { id: 42, dichotomy: "JP", letter: "P", text: "我的东西看心情摆放,乱一点也无所谓" },
  { id: 43, dichotomy: "JP", letter: "J", text: "deadline前我通常已经提早做完" },
  { id: 44, dichotomy: "JP", letter: "P", text: "deadline前我常常临时抱佛脚赶完" },
  { id: 45, dichotomy: "JP", letter: "J", text: "计划被打乱时,我会觉得不太舒服" },
  { id: 46, dichotomy: "JP", letter: "P", text: "计划被打乱时,我反而觉得有新鲜感" },
  { id: 47, dichotomy: "JP", letter: "J", text: "我倾向尽快做决定并马上执行" },
  { id: 48, dichotomy: "JP", letter: "P", text: "我倾向多保留选项,到最后再决定" },
  { id: 49, dichotomy: "JP", letter: "J", text: "出门前我喜欢确认好所有细节和路线" },
  { id: 50, dichotomy: "JP", letter: "P", text: "出门时我常常说走就走,边走边看" },
];

export const ANSWER_LABELS: { key: MbtiAnswer; label: string }[] = [
  { key: "A", label: "非常同意" },
  { key: "B", label: "比较同意" },
  { key: "C", label: "比较不同意" },
  { key: "D", label: "非常不同意" },
];

const ANSWER_WEIGHT: Record<MbtiAnswer, number> = { A: 2, B: 1, C: 1, D: 2 };
const OPPOSITE_LETTER: Record<Letter, Letter> = {
  E: "I",
  I: "E",
  S: "N",
  N: "S",
  T: "F",
  F: "T",
  J: "P",
  P: "J",
};

export interface MbtiResult {
  type: string; // 例如 "INFP"
  counts: Record<string, number>;
}

export function scoreMbti(answers: MbtiAnswer[]): MbtiResult {
  const counts: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  MBTI_QUESTIONS.forEach((q, idx) => {
    const ans = answers[idx];
    if (!ans) return;
    const agrees = ans === "A" || ans === "B";
    const letter = agrees ? q.letter : OPPOSITE_LETTER[q.letter];
    counts[letter] += ANSWER_WEIGHT[ans];
  });
  const type =
    (counts.E >= counts.I ? "E" : "I") +
    (counts.S >= counts.N ? "S" : "N") +
    (counts.T >= counts.F ? "T" : "F") +
    (counts.J >= counts.P ? "J" : "P");
  return { type, counts };
}

export const TYPE_NICKNAMES: Record<string, string> = {
  INTJ: "建筑师",
  INTP: "逻辑学家",
  ENTJ: "指挥官",
  ENTP: "辩论家",
  INFJ: "提倡者",
  INFP: "调停者",
  ENFJ: "主人公",
  ENFP: "竞选者",
  ISTJ: "物流师",
  ISFJ: "守卫者",
  ESTJ: "总经理",
  ESFJ: "执政官",
  ISTP: "鉴赏家",
  ISFP: "探险家",
  ESTP: "企业家",
  ESFP: "表演者",
};
