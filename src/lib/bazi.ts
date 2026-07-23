import { Solar } from "lunar-typescript";
import { GAN_WUXING, ZHI_WUXING, jiaZiIndexOf } from "./wuxing";

export interface BaziInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: "male" | "female";
}

export interface Pillar {
  gan: string;
  zhi: string;
  ganZhi: string;
  wuxing: string; // 例如 "木土"
  naYin: string;
  shiShenGan: string;
  shiShenZhi: string;
}

export interface LiuNianInfo {
  year: number;
  age: number;
  ganZhi: string;
}

export interface DaYunInfo {
  index: number;
  startYear: number;
  endYear: number;
  startAge: number;
  endAge: number;
  ganZhi: string;
  liuNian: LiuNianInfo[];
}

export interface BaziResult {
  solarDate: string;
  lunarDate: string;
  shengXiao: string;
  gender: "male" | "female";
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    time: Pillar;
  };
  dayMasterGan: string;
  dayMasterWuXing: string;
  wuxingCount: Record<string, number>;
  strongestWuxing: string;
  weakestWuxing: string;
  daYunStartAge: number;
  daYunList: DaYunInfo[];
  dayJiaZiIndex: number; // 出生日在六十甲子中的序号(0-59),用于按天推演人生K线
}

function buildPillar(
  gan: string,
  zhi: string,
  wuxing: string,
  naYin: string,
  shiShenGan: string,
  shiShenZhi: string[]
): Pillar {
  return {
    gan,
    zhi,
    ganZhi: `${gan}${zhi}`,
    wuxing,
    naYin,
    shiShenGan,
    shiShenZhi: shiShenZhi?.[0] || "",
  };
}

export function calcBazi(input: BaziInput): BaziResult {
  const solar = Solar.fromYmdHms(
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    0
  );
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();

  const pillars = {
    year: buildPillar(
      ec.getYearGan(),
      ec.getYearZhi(),
      ec.getYearWuXing(),
      ec.getYearNaYin(),
      ec.getYearShiShenGan(),
      ec.getYearShiShenZhi()
    ),
    month: buildPillar(
      ec.getMonthGan(),
      ec.getMonthZhi(),
      ec.getMonthWuXing(),
      ec.getMonthNaYin(),
      ec.getMonthShiShenGan(),
      ec.getMonthShiShenZhi()
    ),
    day: buildPillar(
      ec.getDayGan(),
      ec.getDayZhi(),
      ec.getDayWuXing(),
      ec.getDayNaYin(),
      ec.getDayShiShenGan(),
      ec.getDayShiShenZhi()
    ),
    time: buildPillar(
      ec.getTimeGan(),
      ec.getTimeZhi(),
      ec.getTimeWuXing(),
      ec.getTimeNaYin(),
      ec.getTimeShiShenGan(),
      ec.getTimeShiShenZhi()
    ),
  };

  const dayMasterGan = ec.getDayGan();
  const dayMasterWuXing = GAN_WUXING[dayMasterGan] || "";

  const wuxingCount: Record<string, number> = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  const allChars = [
    pillars.year.gan,
    pillars.year.zhi,
    pillars.month.gan,
    pillars.month.zhi,
    pillars.day.gan,
    pillars.day.zhi,
    pillars.time.gan,
    pillars.time.zhi,
  ];
  for (const ch of allChars) {
    const el = GAN_WUXING[ch] || ZHI_WUXING[ch];
    if (el) wuxingCount[el] = (wuxingCount[el] || 0) + 1;
  }
  const sortedWuxing = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
  const strongestWuxing = sortedWuxing[0][0];
  const weakestWuxing = sortedWuxing[sortedWuxing.length - 1][0];

  const genderCode = input.gender === "male" ? 1 : 0;
  const yun = ec.getYun(genderCode);
  const rawDaYun = yun.getDaYun(10); // 取前10步大运,覆盖约100年

  const daYunList: DaYunInfo[] = rawDaYun.map((dy, idx) => ({
    index: idx,
    startYear: dy.getStartYear(),
    endYear: dy.getEndYear(),
    startAge: dy.getStartAge(),
    endAge: dy.getEndAge(),
    ganZhi: dy.getGanZhi(),
    liuNian: dy.getLiuNian().map((ln) => ({
      year: ln.getYear(),
      age: ln.getAge(),
      ganZhi: ln.getGanZhi(),
    })),
  }));

  // getDaYun() 的第一项在起运前是一个 ganZhi 为空的占位大运(对应尚未起运的年龄段),
  // 真正的起运年龄取第一个有干支的大运的 startAge。
  const firstRealDaYun = daYunList.find((d) => d.ganZhi) || daYunList[0];

  return {
    solarDate: solar.toYmdHms(),
    lunarDate: lunar.toString(),
    shengXiao: lunar.getYearShengXiao(),
    gender: input.gender,
    pillars,
    dayMasterGan,
    dayMasterWuXing,
    wuxingCount,
    strongestWuxing,
    weakestWuxing,
    daYunStartAge: firstRealDaYun.startAge,
    daYunList,
    dayJiaZiIndex: jiaZiIndexOf(pillars.day.ganZhi),
  };
}
