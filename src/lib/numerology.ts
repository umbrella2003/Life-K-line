// 西方毕达哥拉斯数字命理学(Pythagorean Numerology)字母对应表
const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

// 数字命理约减规则:反复对各位数字求和直到得到个位数,
// 但 11 / 22 / 33 是"主数"(Master Number),约减到这三个数即停止,不再继续约减。
function reduceNumber(n: number): number {
  let value = n;
  while (value > 9 && value !== 11 && value !== 22 && value !== 33) {
    value = String(value)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return value;
}

function sumLetters(letters: string, filter?: (ch: string) => boolean): number {
  let sum = 0;
  for (const ch of letters) {
    if (!/[A-Z]/.test(ch)) continue;
    if (filter && !filter(ch)) continue;
    sum += LETTER_VALUES[ch] || 0;
  }
  return sum;
}

export interface NumerologyInput {
  year: number;
  month: number;
  day: number;
  name?: string; // 英文名/姓名拼音,可选,用于计算表达数/灵魂数/人格数
}

export interface NumerologyResult {
  lifePathNumber: number;
  birthdayNumber: number;
  nameUsed?: string;
  expressionNumber?: number;
  soulUrgeNumber?: number;
  personalityNumber?: number;
  maturityNumber?: number;
}

// 全部为本地确定性算法:生命历程数由出生日期换算,表达数/灵魂数/人格数由姓名字母换算,
// 对同一个人(同一出生日期+同一姓名拼写)保证结果可复现。
export function calcNumerology(input: NumerologyInput): NumerologyResult {
  const dateDigits = `${input.year}${String(input.month).padStart(2, "0")}${String(input.day).padStart(2, "0")}`;
  const dateSum = dateDigits.split("").reduce((sum, d) => sum + Number(d), 0);
  const lifePathNumber = reduceNumber(dateSum);
  const birthdayNumber = reduceNumber(input.day);

  const result: NumerologyResult = { lifePathNumber, birthdayNumber };

  const cleanedName = (input.name || "").toUpperCase().replace(/[^A-Z]/g, "");
  if (cleanedName) {
    const expressionNumber = reduceNumber(sumLetters(cleanedName));
    const soulUrgeNumber = reduceNumber(sumLetters(cleanedName, (ch) => VOWELS.has(ch)));
    const personalityNumber = reduceNumber(sumLetters(cleanedName, (ch) => !VOWELS.has(ch)));
    const maturityNumber = reduceNumber(lifePathNumber + expressionNumber);
    result.nameUsed = cleanedName;
    result.expressionNumber = expressionNumber;
    result.soulUrgeNumber = soulUrgeNumber;
    result.personalityNumber = personalityNumber;
    result.maturityNumber = maturityNumber;
  }

  return result;
}

export const NUMBER_KEYWORDS: Record<number, string> = {
  1: "领导者 · 独立开拓",
  2: "协调者 · 温和敏感",
  3: "表达者 · 创意乐观",
  4: "建造者 · 务实稳健",
  5: "自由者 · 变化冒险",
  6: "守护者 · 责任关怀",
  7: "探索者 · 思考灵性",
  8: "掌控者 · 目标物质",
  9: "博爱者 · 理想利他",
  11: "直觉大师 · 主数",
  22: "务实大师 · 主数",
  33: "无私导师 · 主数",
};
