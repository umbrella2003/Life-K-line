export const GAN_WUXING: Record<string, string> = {
  甲: "木",
  乙: "木",
  丙: "火",
  丁: "火",
  戊: "土",
  己: "土",
  庚: "金",
  辛: "金",
  壬: "水",
  癸: "水",
};

export const ZHI_WUXING: Record<string, string> = {
  子: "水",
  丑: "土",
  寅: "木",
  卯: "木",
  辰: "土",
  巳: "火",
  午: "火",
  未: "土",
  申: "金",
  酉: "金",
  戌: "土",
  亥: "水",
};

// X 生 who
const GENERATES: Record<string, string> = {
  木: "火",
  火: "土",
  土: "金",
  金: "水",
  水: "木",
};

// X 克 who
const RESTRAINS: Record<string, string> = {
  木: "土",
  土: "水",
  水: "火",
  火: "金",
  金: "木",
};

export type Relation =
  | "peer" // 比肩劫财:五行相同
  | "support" // 印:对方生日主
  | "drain" // 食伤:日主生对方,泄气
  | "pressure" // 官杀:对方克日主
  | "control" // 财:日主克对方
  | "neutral";

export function relationOf(dayMaster: string, target: string): Relation {
  if (!dayMaster || !target) return "neutral";
  if (target === dayMaster) return "peer";
  if (GENERATES[target] === dayMaster) return "support";
  if (GENERATES[dayMaster] === target) return "drain";
  if (RESTRAINS[target] === dayMaster) return "pressure";
  if (RESTRAINS[dayMaster] === target) return "control";
  return "neutral";
}

// 相对日主的正向性打分,用于人生K线的运势指数计算。
// 五种关系(peer/support/drain/pressure/control)在随机干支序列中出现频率大致相当,
// 因此这组分数之和特意配平为 0:如果均值不为0,累加起来会产生一个与实际命理无关的
// 系统性单向偏移,导致K线不管命好命差都一路只涨不跌(或只跌不涨)。
export const RELATION_SCORE: Record<Relation, number> = {
  support: 8, // 印:被生,最有利
  peer: 3, // 比劫:同类相助,偏正面
  control: 1, // 财:日主克对方,需要付出但仍算掌控
  drain: -4, // 食伤:泄气耗神
  pressure: -8, // 官杀:被克,压力最大
  neutral: 0,
};

export function elementsOfGanZhi(ganZhi: string): { ganEl: string; zhiEl: string } {
  const gan = ganZhi.charAt(0);
  const zhi = ganZhi.charAt(1);
  return {
    ganEl: GAN_WUXING[gan] || "",
    zhiEl: ZHI_WUXING[zhi] || "",
  };
}

export function ganZhiScore(dayMaster: string, ganZhi: string): number {
  const { ganEl, zhiEl } = elementsOfGanZhi(ganZhi);
  const s1 = RELATION_SCORE[relationOf(dayMaster, ganEl)];
  const s2 = RELATION_SCORE[relationOf(dayMaster, zhiEl)];
  return (s1 + s2) / 2;
}

export const GAN_LIST = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
export const ZHI_LIST = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 六十甲子:天干地支各自循环(10、12),两者最小公倍数60构成一个完整循环
export function jiaZiIndexOf(ganZhi: string): number {
  const gi = GAN_LIST.indexOf(ganZhi.charAt(0));
  const zi = ZHI_LIST.indexOf(ganZhi.charAt(1));
  for (let i = 0; i < 60; i++) {
    if (i % 10 === gi && i % 12 === zi) return i;
  }
  return 0;
}

export function ganZhiAtJiaZiIndex(index: number): string {
  const i = ((index % 60) + 60) % 60;
  return GAN_LIST[i % 10] + ZHI_LIST[i % 12];
}

// 地支中土占4/12、其余四行各占2/12,分布并不均匀,天干10个则是每行均2个、完全均匀。
// 这意味着单看 ganZhiScore 的长期平均值会因日主五行不同而产生一个恒定偏移
// (比如日主为水时,长期看任意干支相对日主的平均分并不是0,而是固定偏向负或正)。
// 这里预先算出"该日主在完全随机干支下的期望得分",人生K线用实际得分减去这个期望值,
// 保证长期均值趋于0,累加漂移只反映"比平常好/差多少",而不是被这个结构性偏移主宰。
export function expectedGanZhiScore(dayMaster: string): number {
  const ganScores = GAN_LIST.map((g) => RELATION_SCORE[relationOf(dayMaster, GAN_WUXING[g])]);
  const zhiScores = ZHI_LIST.map((z) => RELATION_SCORE[relationOf(dayMaster, ZHI_WUXING[z])]);
  const avgGan = ganScores.reduce((a, b) => a + b, 0) / ganScores.length;
  const avgZhi = zhiScores.reduce((a, b) => a + b, 0) / zhiScores.length;
  return (avgGan + avgZhi) / 2;
}
