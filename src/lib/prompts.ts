import type { BaziResult } from "./bazi";
import type { KLineSummary } from "./kline";
import type { MbtiResult } from "./mbti";
import type { HexagramResult } from "./hexagram";
import type { ChatMessage } from "./deepseek";
import type { DrawnCard } from "./tarot";
import type { NatalChart } from "./astrology";
import type { ZiweiChart, ZiweiPalace } from "./ziwei";
import type { NumerologyResult } from "./numerology";
import { TRAIT_LABELS as BIGFIVE_LABELS, TRAIT_ORDER as BIGFIVE_ORDER, type BigFiveResult } from "./bigfive";
import {
  TRAIT_LABELS as WORKSTYLE_LABELS,
  TRAIT_ORDER as WORKSTYLE_ORDER,
  type WorkstyleResult,
} from "./workstyle";

const DISCLAIMER =
  "以上内容基于中国传统命理/易学文化演算与大模型生成,仅供娱乐与自我参考,不能替代专业的医疗、法律、财务或心理咨询建议。";

export function buildBaziPrompt(
  bazi: BaziResult,
  klineSummary: KLineSummary
): ChatMessage[] {
  const { pillars } = bazi;
  const wuxingLine = Object.entries(bazi.wuxingCount)
    .map(([el, n]) => `${el}${n}`)
    .join(" ");

  const peakLine = klineSummary.peakYears
    .map((p) => `${p.year}年(${p.age}岁,指数${p.value})`)
    .join("、");
  const dipLine = klineSummary.dipYears
    .map((p) => `${p.year}年(${p.age}岁,指数${p.value})`)
    .join("、");
  const current = klineSummary.currentPoint;

  const facts = `
【出生信息】阳历 ${bazi.solarDate},农历 ${bazi.lunarDate},生肖${bazi.shengXiao},性别${bazi.gender === "male" ? "男" : "女"}

【八字四柱】
年柱:${pillars.year.ganZhi}(五行${pillars.year.wuxing},纳音${pillars.year.naYin},十神${pillars.year.shiShenGan}/${pillars.year.shiShenZhi})
月柱:${pillars.month.ganZhi}(五行${pillars.month.wuxing},纳音${pillars.month.naYin},十神${pillars.month.shiShenGan}/${pillars.month.shiShenZhi})
日柱:${pillars.day.ganZhi}(五行${pillars.day.wuxing},纳音${pillars.day.naYin})
时柱:${pillars.time.ganZhi}(五行${pillars.time.wuxing},纳音${pillars.time.naYin},十神${pillars.time.shiShenGan}/${pillars.time.shiShenZhi})

【日主】${bazi.dayMasterGan}(${bazi.dayMasterWuXing})
【五行分布】${wuxingLine} (最旺:${bazi.strongestWuxing},最弱:${bazi.weakestWuxing})
【大运起始】约${bazi.daYunStartAge}岁起运

【人生K线摘要】(0-100分运势指数,由大运+流年五行与日主关系换算而来,已经过系统计算,请直接引用,不要自己重新推算)
高峰年份:${peakLine || "暂无数据"}
低谷年份:${dipLine || "暂无数据"}
当前所在阶段:${current ? `${current.year}年(${current.age}岁),运势指数${current.close}` : "暂无数据"}
`.trim();

  return [
    {
      role: "system",
      content:
        "你是一位精通中国传统命理学(八字、五行、十神、大运流年)的命理顾问,语言通俗温暖、有建设性,避免危言耸听或绝对化的断言。下面会给出一份已经用传统命理算法精确计算好的八字与人生K线数据,请直接基于这些已知数据进行解读和分析,不要重新推算或质疑这些数据的准确性。输出使用中文 Markdown,分为以下小节:\n## 命局总论\n## 五行与日主分析\n## 大运流年走势解读\n## 事业财运建议\n## 婚姻情感建议\n## 健康提示\n## 综合建议\n最后单独一行附上免责声明。每个小节3-6句话,具体、可执行,避免空话。大运流年走势解读部分请结合给出的高峰/低谷年份具体展开。",
    },
    {
      role: "user",
      content: `请根据以下命理数据,为这位用户生成完整的命理解读与人生建议:\n\n${facts}\n\n文末请另起一行写上:"${DISCLAIMER}"`,
    },
  ];
}

export function buildMbtiPrompt(
  mbti: MbtiResult,
  hexagram: HexagramResult
): ChatMessage[] {
  const facts = `
【MBTI人格类型】${mbti.type}
【各维度得分】E${mbti.counts.E} I${mbti.counts.I} / S${mbti.counts.S} N${mbti.counts.N} / T${mbti.counts.T} F${mbti.counts.F} / J${mbti.counts.J} P${mbti.counts.P}

【本卦】${hexagram.hexagramName}
上卦:${hexagram.upperTrigram.name}(${hexagram.upperTrigram.symbol} ${hexagram.upperTrigram.nature},象征${hexagram.upperTrigram.keywords})
下卦:${hexagram.lowerTrigram.name}(${hexagram.lowerTrigram.symbol} ${hexagram.lowerTrigram.nature},象征${hexagram.lowerTrigram.keywords})
动爻:第${hexagram.changingLine}爻
`.trim();

  return [
    {
      role: "system",
      content:
        "你是一位同时精通现代人格心理学(MBTI)与中国传统易学(周易六十四卦、梅花易数)的顾问,擅长把两套体系结合起来,给出有温度、可执行、不迷信恐吓的建议。下面会给出用户测得的 MBTI 类型以及由答题过程起出的本卦(已用传统方法计算好,直接使用即可,不要质疑或重新起卦)。输出使用中文 Markdown,分为以下小节:\n## 人格总览\n## 本卦解读\n## 性格优势\n## 潜在盲点\n## 人际关系建议\n## 学习与职业建议\n## 综合建议\n最后单独一行附上免责声明。每个小节3-6句话,结合 MBTI 类型与卦象象征意义具体展开,避免空话套话。",
    },
    {
      role: "user",
      content: `请根据以下信息,为这位用户生成性格解析与建议:\n\n${facts}\n\n文末请另起一行写上:"${DISCLAIMER}"`,
    },
  ];
}

function ziweiPalaceLine(p: ZiweiPalace): string {
  const major =
    p.majorStars
      .map((s) => `${s.name}${s.brightness || ""}${s.mutagen ? "化" + s.mutagen : ""}`)
      .join("、") || "无主星";
  const minor = p.minorStars.map((s) => s.name).join("、") || "无";
  const adjective = p.adjectiveStars.map((s) => s.name).join("、") || "无";
  return `${p.name}${p.isBodyPalace ? "(身宫)" : ""}:${p.heavenlyStem}${p.earthlyBranch} · 主星:${major} · 辅星:${minor} · 杂耀:${adjective} · 大限${p.decadalRange[0]}-${p.decadalRange[1]}岁`;
}

export function buildZiweiPrompt(chart: ZiweiChart): ChatMessage[] {
  const facts = `
【出生信息】阳历${chart.solarDate},农历${chart.lunarDate},干支${chart.chineseDate},生肖${chart.zodiac},星座${chart.sign}
【五行局】${chart.fiveElementsClass}
【命主】${chart.soul} 【身主】${chart.body}
【命宫地支】${chart.soulPalaceBranch} 【身宫地支】${chart.bodyPalaceBranch}

【十二宫详情】(已用传统紫微斗数排盘算法精确计算,请直接引用,不要重新排盘或质疑数据准确性)
${chart.palaces.map(ziweiPalaceLine).join("\n")}
`.trim();

  return [
    {
      role: "system",
      content:
        "你是一位精通中国传统紫微斗数的命理顾问,熟悉十二宫、十四主星、四化(禄权科忌)与大限流年,语言通俗温暖、有建设性,避免危言耸听或绝对化的断言。下面给出的十二宫星盘数据(命宫、兄弟、夫妻、子女、财帛、疾厄、迁移、仆役、官禄、田宅、福德、父母十二宫及各宫主星、辅星、大限)已经用传统安星法精确排好,请直接基于这些已知数据进行解读,不要重新排盘。输出使用中文 Markdown,分为以下小节:\n## 命盘总论\n## 命宫与性格\n## 事业财帛\n## 婚姻情感\n## 健康与福德\n## 大限流年提示\n## 综合建议\n最后单独一行附上免责声明。每个小节3-6句话,具体、可执行,结合命宫主星与相关宫位具体展开,避免空话套话。",
    },
    {
      role: "user",
      content: `请根据以下紫微斗数命盘数据,为这位用户生成完整的命理解读与人生建议:\n\n${facts}\n\n文末请另起一行写上:"${DISCLAIMER}"`,
    },
  ];
}

const WESTERN_DISCLAIMER =
  "以上内容基于塔罗牌象征体系与大模型生成,仅供娱乐与自我参考,不能替代专业的医疗、法律、财务或心理咨询建议。";

export function buildTarotPrompt(
  cards: DrawnCard[],
  spreadName: string,
  question?: string
): ChatMessage[] {
  const cardLines = cards
    .map((c) => {
      const keywords = c.orientation === "upright" ? c.card.uprightKeywords : c.card.reversedKeywords;
      const orientationCn = c.orientation === "upright" ? "正位" : "逆位";
      return `${c.positionLabel}位:${c.card.name} ${c.card.nameEn}(${orientationCn}) —— 关键词:${keywords}`;
    })
    .join("\n");

  const facts = `
【牌阵】${spreadName}
${question ? `【提问者的问题】${question}\n` : ""}【抽到的牌】(已用真实洗牌随机抽取并确定正逆位,请直接使用,不要质疑或重新抽牌)
${cardLines}
`.trim();

  return [
    {
      role: "system",
      content:
        "你是一位经验丰富的西方塔罗牌占卜师,精通韦特塔罗78张牌(22张大阿尔卡那+56张小阿尔卡那)的象征体系与正逆位解读,语言优雅、有洞察力,给出的建议温暖且具备可执行性,避免宿命论式的恐吓或绝对化断言。下面会给出已经抽好的牌(牌阵、每张牌的位置、正逆位和关键词),请据此给出连贯的占卜解读,把各张牌的含义结合牌阵位置串联成一个整体故事,而不是逐张孤立罗列。输出使用中文 Markdown,分为以下小节:\n## 牌阵总览\n## 逐位解读\n## 整体故事线\n## 行动建议\n最后单独一行附上免责声明。逐位解读要分别点出每张牌在其位置上的具体含义,整体故事线要把几张牌串成一条连贯的叙事。",
    },
    {
      role: "user",
      content: `请根据以下塔罗牌阵为提问者解读:\n\n${facts}\n\n文末请另起一行写上:"${WESTERN_DISCLAIMER}"`,
    },
  ];
}

function planetLine(p: { body: string; sign: { name: string; symbol: string; element: string; quality: string }; degreeInSign: number }) {
  return `${p.body}在${p.sign.name}${p.sign.symbol}(${p.degreeInSign.toFixed(1)}°,${p.sign.element}象·${p.sign.quality})`;
}

export function buildAstrologyPrompt(chart: NatalChart): ChatMessage[] {
  const facts = `
【出生时刻UTC】${chart.utcDate}
【太阳星座】${planetLine(chart.sun)}
【月亮星座】${planetLine(chart.moon)}
【上升星座】${chart.ascendant.sign.name}${chart.ascendant.sign.symbol}(${chart.ascendant.degreeInSign.toFixed(1)}°)
【水星】${planetLine(chart.mercury)}
【金星】${planetLine(chart.venus)}
【火星】${planetLine(chart.mars)}
【木星】${planetLine(chart.jupiter)}
【土星】${planetLine(chart.saturn)}
`.trim();

  return [
    {
      role: "system",
      content:
        "你是一位专业的西方占星师,精通本命盘解读(太阳、月亮、上升星座及水金火木土五大行星所在星座),语言优雅、有洞察力,给出的建议温暖且具备可执行性,避免宿命论式的断言。下面给出的本命盘数据已用真实天文历法精确计算(基于出生时刻与出生地经纬度换算的真实黄道位置),请直接使用,不要质疑或重新推算。输出使用中文 Markdown,分为以下小节:\n## 本命盘总览\n## 太阳星座:核心自我\n## 月亮星座:内在情感\n## 上升星座:外在人格与第一印象\n## 行星分布的性格暗示\n## 天赋与挑战\n## 人生建议\n最后单独一行附上免责声明。每个小节3-6句话,具体、可执行,避免空话套话。",
    },
    {
      role: "user",
      content: `请根据以下本命盘数据,为这位用户生成完整的占星解读:\n\n${facts}\n\n文末请另起一行写上:"${WESTERN_DISCLAIMER}"`,
    },
  ];
}

export function buildNumerologyPrompt(result: NumerologyResult): ChatMessage[] {
  const hasName = !!result.nameUsed;
  const facts = `
【生命历程数】${result.lifePathNumber}
【生日数】${result.birthdayNumber}
${
    hasName
      ? `【姓名(用于计算,仅取字母)】${result.nameUsed}\n【表达数】${result.expressionNumber}\n【灵魂数】${result.soulUrgeNumber}\n【人格数】${result.personalityNumber}\n【成熟数】${result.maturityNumber}`
      : "【姓名】未提供,本次仅能解读生命历程数与生日数"
  }
`.trim();

  return [
    {
      role: "system",
      content:
        '你是一位精通西方毕达哥拉斯数字命理学(Numerology)的顾问,语言理性、有洞察力,给出温暖且可执行的建议,避免宿命论式断言。下面给出已经用标准数字命理算法精确计算好的数据(生命历程数由出生日期换算,表达数/灵魂数/人格数由姓名字母换算),请直接使用,不要重新计算或质疑准确性。输出使用中文 Markdown,分为以下小节:\n## 数字命理总览\n## 生命历程数解读\n## 生日数解读\n## 表达数与天赋\n## 灵魂渴望与人格面具\n## 人生建议\n若用户未提供姓名,表达数/灵魂渴望/人格面具相关小节请简要说明"补充姓名可获得更完整的解读",不要编造数据。最后单独一行附上免责声明。每个小节3-6句话,具体、可执行,避免空话套话。',
    },
    {
      role: "user",
      content: `请根据以下数字命理数据,为这位用户生成完整的数字命理解读:\n\n${facts}\n\n文末请另起一行写上:"${WESTERN_DISCLAIMER}"`,
    },
  ];
}

const SCIENCE_DISCLAIMER =
  "MBTI 是一种流行的人格类型框架,以上解读基于心理学理论与大模型生成,仅供自我认知参考,不能替代专业的心理咨询或临床诊断。";

export function buildPersonalityPrompt(mbti: MbtiResult, typeName?: string): ChatMessage[] {
  const facts = `
【MBTI人格类型】${mbti.type}${typeName ? `(${typeName})` : ""}
【各维度得分】外向E${mbti.counts.E} / 内向I${mbti.counts.I} —— 实感S${mbti.counts.S} / 直觉N${mbti.counts.N} —— 理性T${mbti.counts.T} / 情感F${mbti.counts.F} —— 判断J${mbti.counts.J} / 感知P${mbti.counts.P}
`.trim();

  return [
    {
      role: "system",
      content:
        "你是一位专业的人格心理学顾问,精通 MBTI 十六型人格理论,语言科学、客观、有建设性,避免玄学化表达,也避免把性格类型当作限制个人发展的标签。下面会给出用户测得的 MBTI 类型及四个维度的得分(已计算好,直接使用)。输出使用中文 Markdown,分为以下小节:\n## 类型概览\n## 认知功能与思维方式\n## 优势与天赋\n## 成长盲点\n## 人际关系风格\n## 职业与学习建议\n## 综合建议\n最后单独一行附上免责声明。每个小节3-6句话,具体、可执行,避免星座式的空泛描述。",
    },
    {
      role: "user",
      content: `请根据以下信息,为这位用户生成 MBTI 人格解读与成长建议:\n\n${facts}\n\n文末请另起一行写上:"${SCIENCE_DISCLAIMER}"`,
    },
  ];
}

const BIGFIVE_DISCLAIMER =
  "大五人格模型(Big Five/OCEAN)是学界广泛使用的人格特质理论,以上解读基于心理学理论与大模型生成,仅供自我认知参考,不能替代专业的心理咨询或临床诊断。";

export function buildBigFivePrompt(result: BigFiveResult): ChatMessage[] {
  const facts = BIGFIVE_ORDER.map(
    (t) => `【${BIGFIVE_LABELS[t]}】${result.scores[t]} 分(0-100,已用标准计分算法算好)`
  ).join("\n");

  return [
    {
      role: "system",
      content:
        "你是一位专业的人格心理学顾问,精通大五人格模型(Big Five/OCEAN:开放性、尽责性、外向性、宜人性、情绪稳定性),语言科学、客观、有建设性,避免玄学化表达,也避免把分数当作绝对标签。下面给出用户五个维度的分数(0-100,已计算好,直接使用,不要重新计算)。输出使用中文 Markdown,分为以下小节:\n## 人格总览\n## 开放性解读\n## 尽责性解读\n## 外向性解读\n## 宜人性解读\n## 情绪稳定性解读\n## 综合建议\n最后单独一行附上免责声明。每个小节3-6句话,结合具体分数展开(如分数偏高/偏低分别意味着什么),给出可执行的建议,避免空话套话。",
    },
    {
      role: "user",
      content: `请根据以下大五人格测评数据,为这位用户生成完整的解读与建议:\n\n${facts}\n\n文末请另起一行写上:"${BIGFIVE_DISCLAIMER}"`,
    },
  ];
}

const WORKSTYLE_DISCLAIMER =
  "职场性格七维度测评是参考职业心理学界公开讨论的人格维度框架自建的娱乐化测评,并非任何商业测评机构的官方产品,以上解读基于心理学理论与大模型生成,仅供自我认知参考,不能替代专业的职业测评或心理咨询。";

export function buildWorkstylePrompt(result: WorkstyleResult): ChatMessage[] {
  const facts = WORKSTYLE_ORDER.map(
    (t) => `【${WORKSTYLE_LABELS[t]}】${result.scores[t]} 分(0-100,已用标准计分算法算好)`
  ).join("\n");

  return [
    {
      role: "system",
      content:
        "你是一位专业的组织行为学 / 职业心理顾问,擅长把职场性格测评结果转化为具体的职业发展、团队协作与管理建议,语言专业、客观、有建设性。下面给出用户在七个职场性格维度(情绪稳定度、进取动力、社交活力、人际敏感度、谨慎自律、好奇探索、学习钻研)上的分数(0-100,已计算好,直接使用,不要重新计算)。输出使用中文 Markdown,分为以下小节:\n## 职场性格总览\n## 优势维度解读\n## 潜在盲点\n## 适合的团队角色与工作方式\n## 与同事/上级的协作建议\n## 职业发展建议\n最后单独一行附上免责声明。每个小节3-6句话,结合具体分数展开,给出可执行的建议,避免空话套话。",
    },
    {
      role: "user",
      content: `请根据以下职场性格七维度测评数据,为这位用户生成完整的解读与建议:\n\n${facts}\n\n文末请另起一行写上:"${WORKSTYLE_DISCLAIMER}"`,
    },
  ];
}
