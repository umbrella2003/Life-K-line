import { astro } from "iztro";

export interface ZiweiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "male" | "female";
}

export interface ZiweiStar {
  name: string;
  brightness?: string;
  mutagen?: string;
}

export interface ZiweiPalace {
  index: number;
  name: string;
  isBodyPalace: boolean;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: ZiweiStar[];
  minorStars: ZiweiStar[];
  adjectiveStars: ZiweiStar[];
  decadalRange: [number, number];
}

export interface ZiweiChart {
  solarDate: string;
  lunarDate: string;
  chineseDate: string;
  sign: string;
  zodiac: string;
  fiveElementsClass: string;
  soul: string;
  body: string;
  soulPalaceBranch: string;
  bodyPalaceBranch: string;
  palaces: ZiweiPalace[];
}

// 早子时(00:00-00:59)对应索引0,丑时(01:00-02:59)对应1,……,晚子时(23:00-23:59)对应12,
// 与 iztro 库的 timeIndex 定义一致,可以用统一公式 floor((hour+1)/2) 换算,无需分支特判。
function timeIndexFromHour(hour: number): number {
  return Math.floor((hour + 1) / 2);
}

function mapStar(s: { name: string; brightness?: string; mutagen?: string }): ZiweiStar {
  return { name: s.name, brightness: s.brightness, mutagen: s.mutagen };
}

// 用 iztro(轻量级紫微斗数排盘开源库)按传统安星法精确排出十二宫、主星辅星与大限,
// 这是本地确定性算法,对同一个人保证结果可复现,而非查表估算。
export function calcZiweiChart(input: ZiweiInput): ZiweiChart {
  const dateStr = `${input.year}-${input.month}-${input.day}`;
  const timeIndex = timeIndexFromHour(input.hour);
  const genderName = input.gender === "male" ? "男" : "女";
  const astrolabe = astro.bySolar(dateStr, timeIndex, genderName, true, "zh-CN");

  const palaces: ZiweiPalace[] = astrolabe.palaces.map((p) => ({
    index: p.index,
    name: p.name,
    isBodyPalace: p.isBodyPalace,
    heavenlyStem: p.heavenlyStem,
    earthlyBranch: p.earthlyBranch,
    majorStars: p.majorStars.map(mapStar),
    minorStars: p.minorStars.map(mapStar),
    adjectiveStars: p.adjectiveStars.map(mapStar),
    decadalRange: p.decadal.range,
  }));

  return {
    solarDate: astrolabe.solarDate,
    lunarDate: astrolabe.lunarDate,
    chineseDate: astrolabe.chineseDate,
    sign: astrolabe.sign,
    zodiac: astrolabe.zodiac,
    fiveElementsClass: astrolabe.fiveElementsClass,
    soul: astrolabe.soul,
    body: astrolabe.body,
    soulPalaceBranch: astrolabe.earthlyBranchOfSoulPalace,
    bodyPalaceBranch: astrolabe.earthlyBranchOfBodyPalace,
    palaces,
  };
}
