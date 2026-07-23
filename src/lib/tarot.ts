export type Orientation = "upright" | "reversed";
export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Spread = "single" | "three";

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  arcana: "major" | "minor";
  suit?: Suit;
  icon: string; // 用于卡面展示的图标(emoji,避免使用受版权保护的具体牌面插画)
  uprightKeywords: string;
  reversedKeywords: string;
}

export interface DrawnCard {
  card: TarotCard;
  orientation: Orientation;
  position: number;
  positionLabel: string;
}

// 大阿尔卡那 22 张(标准韦特塔罗牌序与象征意义,属通用命理知识,非某一具体版本插画的复刻)
export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: "愚者", nameEn: "The Fool", arcana: "major", icon: "🃏", uprightKeywords: "天真、冒险精神、新的开始、自由", reversedKeywords: "草率鲁莽、缺乏方向、不负责任" },
  { id: 1, name: "魔术师", nameEn: "The Magician", arcana: "major", icon: "🎩", uprightKeywords: "创造力、行动力、资源整合、心想事成", reversedKeywords: "能力被浪费、操纵、自欺" },
  { id: 2, name: "女祭司", nameEn: "The High Priestess", arcana: "major", icon: "🌙", uprightKeywords: "直觉、潜意识、神秘智慧、耐心等待", reversedKeywords: "忽视直觉、信息隐瞒、迷失方向" },
  { id: 3, name: "皇后", nameEn: "The Empress", arcana: "major", icon: "👑", uprightKeywords: "丰盛、母性、创造与滋养、感性", reversedKeywords: "依赖过度、创造力受阻、缺乏自我关怀" },
  { id: 4, name: "皇帝", nameEn: "The Emperor", arcana: "major", icon: "🏛️", uprightKeywords: "权威、秩序、掌控、稳固结构", reversedKeywords: "专制、僵化、失控" },
  { id: 5, name: "教皇", nameEn: "The Hierophant", arcana: "major", icon: "⛪", uprightKeywords: "传统、体制、信仰、指导", reversedKeywords: "墨守成规、反叛传统、教条主义" },
  { id: 6, name: "恋人", nameEn: "The Lovers", arcana: "major", icon: "💞", uprightKeywords: "爱情、和谐关系、价值一致、选择", reversedKeywords: "关系失衡、价值冲突、犹豫不决" },
  { id: 7, name: "战车", nameEn: "The Chariot", arcana: "major", icon: "🏎️", uprightKeywords: "意志力、胜利、掌控方向、决心", reversedKeywords: "方向迷失、缺乏自控、受挫" },
  { id: 8, name: "力量", nameEn: "Strength", arcana: "major", icon: "🦁", uprightKeywords: "勇气、内在力量、温柔的坚定、耐心", reversedKeywords: "自我怀疑、软弱、失控的情绪" },
  { id: 9, name: "隐士", nameEn: "The Hermit", arcana: "major", icon: "🏮", uprightKeywords: "内省、独处、寻求真理、智慧", reversedKeywords: "孤立、逃避现实、迷失方向" },
  { id: 10, name: "命运之轮", nameEn: "Wheel of Fortune", arcana: "major", icon: "🎡", uprightKeywords: "命运转折、机遇、周期循环、变化", reversedKeywords: "运势受阻、抗拒改变、恶性循环" },
  { id: 11, name: "正义", nameEn: "Justice", arcana: "major", icon: "⚖️", uprightKeywords: "公平、真相、因果、理性判断", reversedKeywords: "不公、偏见、逃避责任" },
  { id: 12, name: "倒吊人", nameEn: "The Hanged Man", arcana: "major", icon: "🙃", uprightKeywords: "换位思考、暂停、牺牲带来领悟、放手", reversedKeywords: "停滞不前、无谓牺牲、抗拒改变" },
  { id: 13, name: "死神", nameEn: "Death", arcana: "major", icon: "💀", uprightKeywords: "结束与重生、转变、放下过去", reversedKeywords: "抗拒改变、停滞、恐惧未知" },
  { id: 14, name: "节制", nameEn: "Temperance", arcana: "major", icon: "🍷", uprightKeywords: "平衡、调和、耐心、中道", reversedKeywords: "失衡、过度、缺乏耐心" },
  { id: 15, name: "恶魔", nameEn: "The Devil", arcana: "major", icon: "😈", uprightKeywords: "束缚、欲望、物质诱惑、阴影面", reversedKeywords: "打破束缚、觉察执念、重获自由" },
  { id: 16, name: "塔", nameEn: "The Tower", arcana: "major", icon: "🗼", uprightKeywords: "剧变、崩塌、觉醒、突发事件", reversedKeywords: "逃避崩溃、延迟的变化、内在动荡" },
  { id: 17, name: "星星", nameEn: "The Star", arcana: "major", icon: "⭐", uprightKeywords: "希望、疗愈、灵感、信念", reversedKeywords: "失去信心、理想落空、迷茫" },
  { id: 18, name: "月亮", nameEn: "The Moon", arcana: "major", icon: "🌕", uprightKeywords: "潜意识、幻象、不安、直觉暗流", reversedKeywords: "困惑消散、压抑的情绪浮现、恢复清明" },
  { id: 19, name: "太阳", nameEn: "The Sun", arcana: "major", icon: "☀️", uprightKeywords: "成功、活力、乐观、真我绽放", reversedKeywords: "暂时受阻的喜悦、过度自信、能量低迷" },
  { id: 20, name: "审判", nameEn: "Judgement", arcana: "major", icon: "📯", uprightKeywords: "觉醒、重生、总结与召唤、清算过往", reversedKeywords: "自我批判、拖延觉醒、逃避召唤" },
  { id: 21, name: "世界", nameEn: "The World", arcana: "major", icon: "🌍", uprightKeywords: "圆满、成就、完整循环、整合", reversedKeywords: "未竟之事、缺乏闭环、延迟的成功" },
];

const SUITS: { key: Suit; name: string; nameEn: string; icon: string; domain: string }[] = [
  { key: "wands", name: "权杖", nameEn: "Wands", icon: "🔥", domain: "事业与行动力" },
  { key: "cups", name: "圣杯", nameEn: "Cups", icon: "🏆", domain: "情感与人际关系" },
  { key: "swords", name: "宝剑", nameEn: "Swords", icon: "⚔️", domain: "思维决策与沟通" },
  { key: "pentacles", name: "星币", nameEn: "Pentacles", icon: "🪙", domain: "金钱物质与现实生活" },
];

const NUMBER_RANKS: { name: string; nameEn: string; up: string; rev: string }[] = [
  { name: "首牌", nameEn: "Ace", up: "新的开始、潜力、契机", rev: "错失机会、延迟、能量分散" },
  { name: "二", nameEn: "Two", up: "平衡、选择、伙伴关系", rev: "犹豫不决、失衡、对立" },
  { name: "三", nameEn: "Three", up: "合作、成长、初步成果", rev: "团队问题、缺乏支持" },
  { name: "四", nameEn: "Four", up: "稳定、结构、休整", rev: "停滞、固执、抗拒改变" },
  { name: "五", nameEn: "Five", up: "冲突、变化、挑战", rev: "冲突未解、逃避" },
  { name: "六", nameEn: "Six", up: "和谐、给予、过渡", rev: "失衡的付出、旧事重现" },
  { name: "七", nameEn: "Seven", up: "反思、评估、坚持", rev: "自我怀疑、方向不明" },
  { name: "八", nameEn: "Eight", up: "行动、推进、精进", rev: "停滞不前、抗拒变化" },
  { name: "九", nameEn: "Nine", up: "接近完成、内在力量、警觉", rev: "焦虑、孤立、执念" },
  { name: "十", nameEn: "Ten", up: "完成、圆满、新周期前夜", rev: "负担过重、周期结束的阵痛" },
];

const COURT_RANKS: { name: string; nameEn: string; up: string; rev: string }[] = [
  { name: "侍从", nameEn: "Page", up: "学习者、好奇心、新讯息", rev: "不成熟、三心二意" },
  { name: "骑士", nameEn: "Knight", up: "行动派、追求目标、冲劲", rev: "冲动、鲁莽、半途而废" },
  { name: "王后", nameEn: "Queen", up: "掌控与滋养、成熟、直觉", rev: "情绪化、控制欲、不安全感" },
  { name: "国王", nameEn: "King", up: "权威、掌控全局、领导力", rev: "专断、滥用权力、僵化" },
];

function buildMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  let id = MAJOR_ARCANA.length;
  for (const suit of SUITS) {
    NUMBER_RANKS.forEach((rank) => {
      cards.push({
        id: id++,
        name: `${suit.name}${rank.name}`,
        nameEn: `${rank.nameEn} of ${suit.nameEn}`,
        arcana: "minor",
        suit: suit.key,
        icon: suit.icon,
        uprightKeywords: `${rank.up}(聚焦${suit.domain})`,
        reversedKeywords: `${rank.rev}(聚焦${suit.domain})`,
      });
    });
    COURT_RANKS.forEach((rank) => {
      cards.push({
        id: id++,
        name: `${suit.name}${rank.name}`,
        nameEn: `${rank.nameEn} of ${suit.nameEn}`,
        arcana: "minor",
        suit: suit.key,
        icon: suit.icon,
        uprightKeywords: `${rank.up}(聚焦${suit.domain})`,
        reversedKeywords: `${rank.rev}(聚焦${suit.domain})`,
      });
    });
  }
  return cards;
}

export const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA, ...buildMinorArcana()]; // 78 张

export const SPREAD_LABELS: Record<Spread, { name: string; positions: string[] }> = {
  single: { name: "单张指引", positions: ["指引"] },
  three: { name: "时间之流(过去·现在·未来)", positions: ["过去", "现在", "未来"] },
};

// 每次抽牌都是真随机(而非按生辰确定性推算),这才符合塔罗"当下起卦"的传统玩法——
// 同一个人不同时刻来问,结果本就应该不同。
export function drawCards(spread: Spread): DrawnCard[] {
  const positions = SPREAD_LABELS[spread].positions;
  const deck = [...TAROT_DECK];
  // Fisher-Yates 洗牌
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return positions.map((label, i) => ({
    card: deck[i],
    orientation: Math.random() < 0.5 ? "upright" : "reversed",
    position: i,
    positionLabel: label,
  }));
}

export function findCardById(id: number): TarotCard | undefined {
  return TAROT_DECK.find((c) => c.id === id);
}
