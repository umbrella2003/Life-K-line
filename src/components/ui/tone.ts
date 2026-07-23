// 全站统一的配色/主题令牌。
//
// 注意:Tailwind 的 JIT 扫描是对源码文本做静态正则匹配,不会执行 JS,
// 所以这里的每个字段都必须是完整、字面量的 className 片段(不能在别处用
// `` `focus:${x}` `` 这种方式拼出一半前缀 + 变量,那样生成不出对应的工具类)。
// 组件里可以安全地把多个完整字段拼接成一个 className 字符串。

export type Family = "east" | "west" | "science";
export type Accent = "gold" | "jade" | "amber" | "cyan";

interface FamilyTokens {
  pageBg: string;
  cardBg: string;
  cardBorderDefault: string;
  body: string;
  muted: string;
  mutedHover: string;
  error: string;
  heading: string; // 标题字体
}

interface AccentTokens {
  family: Family;
  text: string;
  border: string;
  borderStrong: string;
  focusBorder: string;
  bgSoft: string;
  bgSoftHover: string;
  solid: string;
  solidText: string;
  ring: string;
  track: string; // 进度条底色
  fill: string; // 进度条/强调填充色
}

export const FAMILY: Record<Family, FamilyTokens> = {
  east: {
    pageBg: "bg-ink",
    cardBg: "bg-white/[0.04]",
    cardBorderDefault: "border-white/10",
    body: "text-stone-400",
    muted: "text-stone-500",
    mutedHover: "hover:text-stone-300",
    error: "text-cinnabar",
    heading: "font-serif",
  },
  west: {
    pageBg: "bg-[#0f0a1f]",
    cardBg: "bg-gradient-to-b from-[#1a1035]/80 to-[#150f2e]/80",
    cardBorderDefault: "border-amber-300/20",
    body: "text-violet-300/70",
    muted: "text-violet-300/60",
    mutedHover: "hover:text-violet-200",
    error: "text-rose-300",
    heading: "font-serif",
  },
  science: {
    pageBg: "bg-slate-950",
    cardBg: "bg-slate-900/80",
    cardBorderDefault: "border-slate-700",
    body: "text-slate-400",
    muted: "text-slate-500",
    mutedHover: "hover:text-slate-300",
    error: "text-rose-400",
    heading: "font-semibold",
  },
};

export const ACCENT: Record<Accent, AccentTokens> = {
  gold: {
    family: "east",
    text: "text-gold",
    border: "border-gold/20",
    borderStrong: "border-gold",
    focusBorder: "focus:border-gold/70",
    bgSoft: "bg-gold/10",
    bgSoftHover: "hover:bg-gold/20",
    solid: "bg-gold hover:bg-gold-soft",
    solidText: "text-ink",
    ring: "focus-visible:ring-gold/40",
    track: "bg-black/30",
    fill: "bg-gold",
  },
  jade: {
    family: "east",
    text: "text-jade-soft",
    border: "border-jade/30",
    borderStrong: "border-jade",
    focusBorder: "focus:border-jade/80",
    bgSoft: "bg-jade/10",
    bgSoftHover: "hover:bg-jade/20",
    solid: "bg-jade hover:bg-jade-soft",
    solidText: "text-white",
    ring: "focus-visible:ring-jade/40",
    track: "bg-black/30",
    fill: "bg-jade",
  },
  amber: {
    family: "west",
    text: "text-amber-200",
    border: "border-amber-300/20",
    borderStrong: "border-amber-300/60",
    focusBorder: "focus:border-amber-300/60",
    bgSoft: "bg-amber-300/10",
    bgSoftHover: "hover:bg-amber-300/20",
    solid: "bg-gradient-to-r from-amber-300 to-amber-500 hover:opacity-90",
    solidText: "text-[#150f2e]",
    ring: "focus-visible:ring-amber-300/40",
    track: "bg-black/30",
    fill: "bg-amber-300",
  },
  cyan: {
    family: "science",
    text: "text-cyan-400",
    border: "border-cyan-400/30",
    borderStrong: "border-cyan-400/60",
    focusBorder: "focus:border-cyan-400/60",
    bgSoft: "bg-cyan-400/10",
    bgSoftHover: "hover:bg-cyan-400/20",
    solid: "bg-cyan-400 hover:bg-cyan-300",
    solidText: "text-slate-950",
    ring: "focus-visible:ring-cyan-400/40",
    track: "bg-slate-800",
    fill: "bg-cyan-400",
  },
};

export function fieldClass(accent: Accent): string {
  const a = ACCENT[accent];
  return [
    "w-full rounded-xl border bg-black/25 px-3.5 py-2.5 text-[15px] text-stone-100",
    "placeholder:text-stone-500 transition-colors duration-200",
    "focus:outline-none",
    a.border,
    a.focusBorder,
    a.ring,
    "focus-visible:ring-2",
  ].join(" ");
}

export function cardClass(accent: Accent, extra = ""): string {
  const f = FAMILY[ACCENT[accent].family];
  const a = ACCENT[accent];
  return `rounded-2xl border ${a.border} ${f.cardBg} p-6 shadow-card backdrop-blur-sm ${extra}`.trim();
}
