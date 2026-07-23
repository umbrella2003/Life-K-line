import type { DaYunInfo } from "./bazi";
import { ganZhiScore, ganZhiAtJiaZiIndex, expectedGanZhiScore } from "./wuxing";

export type Interval = "day" | "week" | "month" | "year";

export interface DailyPoint {
  epochDay: number; // 出生日为第0天
  year: number;
  month: number;
  day: number;
  age: number;
  value: number; // 0-100 运势指数(已归一化)
}

export interface KLinePoint {
  time: string; // "YYYY-MM-DD"
  year: number;
  age: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// 逐日数据用于网络传输时压缩成 [epochDay, value] 元组,体积只有完整对象数组的一小部分,
// year/month/day/age 都可以由出生日期 + epochDay 现算出来,不需要重复传输。
export type CompactPoint = [epochDay: number, value: number];

export function toCompactDaily(points: DailyPoint[]): CompactPoint[] {
  return points.map((p) => [p.epochDay, p.value]);
}

export function fromCompactDaily(
  compact: CompactPoint[],
  birthYear: number,
  birthMonth: number,
  birthDay: number
): DailyPoint[] {
  return compact.map(([epochDay, value]) => {
    const { year, month, day } = dateAtOffset(birthYear, birthMonth, birthDay, epochDay);
    return { epochDay, year, month, day, age: Math.floor(epochDay / 365.25), value };
  });
}

export interface KLineSummary {
  peakYears: { year: number; age: number; value: number }[];
  dipYears: { year: number; age: number; value: number }[];
  currentPoint: KLinePoint | null;
}

// 确定性伪随机数生成器(mulberry32),保证同一个人多次生成的K线走势完全一致
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

function dateAtOffset(birthYear: number, birthMonth: number, birthDay: number, epochDay: number) {
  const base = new Date(birthYear, birthMonth - 1, birthDay);
  base.setDate(base.getDate() + epochDay);
  return { year: base.getFullYear(), month: base.getMonth() + 1, day: base.getDate() };
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function dateStr(y: number, m: number, d: number) {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function minMax(values: number[]): [number, number] {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return [min, max];
}

/**
 * 生成从出生到 maxAge 岁、按天推演的运势指数序列。
 *
 * 核心思路:每一天的"涨跌"由大运(持续约10年)、流年(持续1年)、
 * 当日干支(六十甲子循环,60天一轮)与日主的五行生克关系共同决定,
 * 按小权重逐日累加(而不是每个周期独立重新打分后钳制),
 * 运势好的阶段持续上涨,运势差的阶段持续下跌,形成真正的趋势走势,
 * 而不是围绕某个中枢来回震荡。最后对整条序列做一次整体归一化,
 * 把累加结果映射到 0-100 区间,保留趋势形状。
 */
export function buildDailySeries(params: {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  dayMasterWuXing: string;
  dayJiaZiIndex: number;
  daYunList: DaYunInfo[];
  maxAge?: number;
}): DailyPoint[] {
  const {
    birthYear,
    birthMonth,
    birthDay,
    dayMasterWuXing,
    dayJiaZiIndex,
    daYunList,
    maxAge = 90,
  } = params;

  const rand = mulberry32(birthYear * 10007 + birthMonth * 97 + birthDay * 13 + 12345);
  const baseline = expectedGanZhiScore(dayMasterWuXing);

  // 年份 -> 当年所属大运干支 + 流年干支,方便按天查表
  const yearInfo = new Map<number, { dayYunGanZhi: string; liuNianGanZhi: string }>();
  for (const dy of daYunList) {
    for (const ln of dy.liuNian) {
      yearInfo.set(ln.year, { dayYunGanZhi: dy.ganZhi, liuNianGanZhi: ln.ganZhi });
    }
  }

  const totalDays = Math.round(maxAge * 365.25);
  const points: DailyPoint[] = [];

  let cursorY = birthYear;
  let cursorM = birthMonth;
  let cursorD = birthDay;
  let cumulative = 50;

  for (let epochDay = 0; epochDay < totalDays; epochDay++) {
    const age = Math.floor(epochDay / 365.25);
    const info = yearInfo.get(cursorY);
    const daYunScore = info ? ganZhiScore(dayMasterWuXing, info.dayYunGanZhi) - baseline : 0;
    const liuNianScore = info ? ganZhiScore(dayMasterWuXing, info.liuNianGanZhi) - baseline : 0;

    const dayGanZhi = ganZhiAtJiaZiIndex(dayJiaZiIndex + epochDay);
    const dayScore = ganZhiScore(dayMasterWuXing, dayGanZhi) - baseline;

    const noise = (rand() - 0.5) * 0.6;
    // 大运权重很小但持续约3650天;流年权重次之持续约365天;当日干支60天一轮,提供细粒度波动
    const drift = daYunScore * 0.00055 + liuNianScore * 0.0024 + dayScore * 0.16 + noise;
    cumulative += drift;

    points.push({ epochDay, year: cursorY, month: cursorM, day: cursorD, age, value: cumulative });

    const dim = daysInMonth(cursorY, cursorM);
    cursorD++;
    if (cursorD > dim) {
      cursorD = 1;
      cursorM++;
      if (cursorM > 12) {
        cursorM = 1;
        cursorY++;
      }
    }
  }

  const [min, max] = minMax(points.map((p) => p.value));
  const range = max - min || 1;
  for (const p of points) {
    p.value = round1(8 + ((p.value - min) / range) * 84);
  }

  return points;
}

export function aggregateDaily(points: DailyPoint[], interval: Interval): KLinePoint[] {
  if (points.length === 0) return [];

  if (interval === "day") {
    const result: KLinePoint[] = [];
    let prevClose = points[0].value;
    for (const p of points) {
      const wick = 0.4;
      const open = prevClose;
      const close = p.value;
      result.push({
        time: dateStr(p.year, p.month, p.day),
        year: p.year,
        age: p.age,
        open: round1(open),
        high: round1(Math.max(open, close) + wick),
        low: round1(Math.min(open, close) - wick),
        close: round1(close),
      });
      prevClose = close;
    }
    return result;
  }

  const bucketKey = (p: DailyPoint) => {
    if (interval === "year") return `${p.year}`;
    if (interval === "month") return `${p.year}-${p.month}`;
    return `w${Math.floor(p.epochDay / 7)}`;
  };

  const buckets = new Map<string, DailyPoint[]>();
  for (const p of points) {
    const key = bucketKey(p);
    let arr = buckets.get(key);
    if (!arr) {
      arr = [];
      buckets.set(key, arr);
    }
    arr.push(p);
  }

  const result: KLinePoint[] = [];
  let prevClose: number | null = null;
  for (const group of buckets.values()) {
    const first = group[0];
    const last = group[group.length - 1];
    const [groupMin, groupMax] = minMax(group.map((g) => g.value));
    const open = prevClose ?? first.value;
    const close = last.value;
    result.push({
      time: dateStr(first.year, first.month, first.day),
      year: first.year,
      age: first.age,
      open: round1(open),
      high: round1(Math.max(groupMax, open, close)),
      low: round1(Math.min(groupMin, open, close)),
      close: round1(close),
    });
    prevClose = close;
  }
  return result;
}

export function summarizeYearly(yearPoints: KLinePoint[], currentYear?: number): KLineSummary {
  const year = currentYear ?? new Date().getFullYear();
  const sorted = [...yearPoints].sort((a, b) => b.close - a.close);
  const peakYears = sorted.slice(0, 3).map((p) => ({ year: p.year, age: p.age, value: p.close }));
  const dipYears = sorted
    .slice(-3)
    .reverse()
    .map((p) => ({ year: p.year, age: p.age, value: p.close }));

  const currentPoint =
    yearPoints.find((p) => p.year === year) ||
    yearPoints.reduce<KLinePoint | null>((closest, p) => {
      if (!closest) return p;
      return Math.abs(p.year - year) < Math.abs(closest.year - year) ? p : closest;
    }, null);

  return { peakYears, dipYears, currentPoint };
}

export interface KLineResult {
  points: KLinePoint[];
  summary: KLineSummary;
}

// 兼容旧调用:直接生成年K与摘要(用于AI解读的既定事实)
export function buildLifeKLine(params: {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  dayMasterWuXing: string;
  dayJiaZiIndex: number;
  daYunList: DaYunInfo[];
  currentYear?: number;
  maxAge?: number;
}): KLineResult {
  const daily = buildDailySeries(params);
  const points = aggregateDaily(daily, "year");
  const summary = summarizeYearly(points, params.currentYear);
  return { points, summary };
}
