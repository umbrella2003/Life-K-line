import type { MbtiAnswer } from "./mbti";

// 八卦,先天顺序:乾兑离震巽坎艮坤
export interface Trigram {
  name: string;
  symbol: string;
  nature: string;
  keywords: string;
}

export const TRIGRAMS: Trigram[] = [
  { name: "乾", symbol: "☰", nature: "天", keywords: "刚健、领导、进取" },
  { name: "兑", symbol: "☱", nature: "泽", keywords: "喜悦、沟通、社交" },
  { name: "离", symbol: "☲", nature: "火", keywords: "光明、热情、表达" },
  { name: "震", symbol: "☳", nature: "雷", keywords: "行动、冲劲、变动" },
  { name: "巽", symbol: "☴", nature: "风", keywords: "顺势、灵活、渗透" },
  { name: "坎", symbol: "☵", nature: "水", keywords: "深沉、智慧、险中求进" },
  { name: "艮", symbol: "☶", nature: "山", keywords: "稳重、克制、止静" },
  { name: "坤", symbol: "☷", nature: "地", keywords: "包容、承载、柔顺" },
];

// 六十四卦表:行=上卦,列=下卦,顺序均为 乾兑离震巽坎艮坤
const HEXAGRAM_TABLE: string[][] = [
  ["乾为天", "天泽履", "天火同人", "天雷无妄", "天风姤", "天水讼", "天山遁", "天地否"],
  ["泽天夬", "兑为泽", "泽火革", "泽雷随", "泽风大过", "泽水困", "泽山咸", "泽地萃"],
  ["火天大有", "火泽睽", "离为火", "火雷噬嗑", "火风鼎", "火水未济", "火山旅", "火地晋"],
  ["雷天大壮", "雷泽归妹", "雷火丰", "震为雷", "雷风恒", "雷水解", "雷山小过", "雷地豫"],
  ["风天小畜", "风泽中孚", "风火家人", "风雷益", "巽为风", "风水涣", "风山渐", "风地观"],
  ["水天需", "水泽节", "水火既济", "水雷屯", "水风井", "坎为水", "水山蹇", "水地比"],
  ["山天大畜", "山泽损", "山火贲", "山雷颐", "山风蛊", "山水蒙", "艮为山", "山地剥"],
  ["地天泰", "地泽临", "地火明夷", "地雷复", "地风升", "地水师", "地山谦", "坤为地"],
];

export interface HexagramResult {
  upperIndex: number;
  lowerIndex: number;
  upperTrigram: Trigram;
  lowerTrigram: Trigram;
  hexagramName: string;
  changingLine: number; // 1~6
}

const ANSWER_NUMBER: Record<MbtiAnswer, number> = { A: 1, B: 2, C: 3, D: 4 };

// 以答题序列作为"心中所动之数"起卦,呼应梅花易数"物物皆数、心动则数生"的取数思路。
// 同一份答案永远推出同一个卦,保证结果可复现。
export function deriveHexagram(answers: MbtiAnswer[]): HexagramResult {
  const bits = answers.map((a) => ANSWER_NUMBER[a]);
  const half = Math.ceil(bits.length / 2);
  const firstHalfSum = bits.slice(0, half).reduce((a, b) => a + b, 0);
  const secondHalfSum = bits.slice(half).reduce((a, b) => a + b, 0);
  const totalSum = firstHalfSum + secondHalfSum;

  const upperIndex = firstHalfSum % 8;
  const lowerIndex = secondHalfSum % 8;
  const changingLine = (totalSum % 6) + 1;

  return {
    upperIndex,
    lowerIndex,
    upperTrigram: TRIGRAMS[upperIndex],
    lowerTrigram: TRIGRAMS[lowerIndex],
    hexagramName: HEXAGRAM_TABLE[upperIndex][lowerIndex],
    changingLine,
  };
}
