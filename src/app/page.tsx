import Link from "next/link";

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] text-stone-500 border border-white/10 rounded-full px-2.5 py-1 tracking-wide">
      {children}
    </span>
  );
}

function ModuleCard({
  href,
  icon,
  title,
  desc,
  cta,
  borderClass,
  textClass,
  bgClass,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  cta: string;
  borderClass: string;
  textClass: string;
  bgClass?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex flex-col rounded-2xl border ${borderClass} ${bgClass ?? "bg-white/[0.04]"} p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:bg-white/[0.07]`}
    >
      <div
        className={`text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border ${borderClass} bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110`}
      >
        {icon}
      </div>
      <h3 className={`font-serif text-lg sm:text-xl mb-2 ${textClass}`}>{title}</h3>
      <p className="text-sm text-stone-400 leading-relaxed flex-1">{desc}</p>
      <span
        className={`inline-flex items-center gap-1 mt-5 text-sm font-medium ${textClass}/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1`}
      >
        {cta}
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

const NAV_ITEMS = [
  { href: "#east", label: "东方玄学" },
  { href: "#west", label: "西方玄学" },
  { href: "#science", label: "现代科学" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-ink via-[#14171d] to-ink">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <span className="font-serif text-gold text-base tracking-wide">人生K线</span>
          <nav className="flex items-center gap-5 sm:gap-7">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs sm:text-sm text-stone-400 hover:text-stone-100 transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="px-5 sm:px-8 py-14 sm:py-20">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 animate-fade-up">
          <p className="inline-flex items-center gap-2 text-gold/80 tracking-widest text-xs sm:text-sm mb-5 border border-gold/25 rounded-full px-4 py-1.5">
            AI × 东西方命理 × 现代心理学
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold mb-5 tracking-wide">
            人生K线
          </h1>
          <p className="text-stone-300 text-[15px] sm:text-base leading-relaxed max-w-xl mx-auto">
            东方玄学看八字与卦象,西方玄学问塔罗与星盘,现代科学测人格与特质——
            <br className="hidden sm:block" />
            全部解读由 AI 实时生成,仅供娱乐与自我参考。
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
          {/* 东方玄学 */}
          <section id="east" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-6 sm:mb-7">
              <span className="text-2xl">☯</span>
              <h2 className="font-serif text-xl sm:text-2xl text-gold">东方玄学</h2>
              <SectionTag>生辰八字 · 周易六十四卦 · 紫微斗数</SectionTag>
            </div>
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
              <ModuleCard
                href="/bazi"
                icon="☯"
                title="生辰八字 · 人生K线"
                desc="输入出生年月日时,系统按传统八字排盘,推算大运流年,绘制专属人生K线图,并给出AI命理建议。"
                cta="开始排盘"
                borderClass="border-gold/25"
                textClass="text-gold"
              />
              <ModuleCard
                href="/mbti"
                icon="☰"
                title="性格问答 · 易经解析"
                desc="用一组日常小问题测出你的 MBTI 人格倾向,并结合周易六十四卦与梅花易数进行解读,给出人际与职业建议。"
                cta="开始测试"
                borderClass="border-jade/40"
                textClass="text-jade-soft"
              />
              <ModuleCard
                href="/ziwei"
                icon="⭐"
                title="紫微斗数 · 十二宫命盘"
                desc="输入出生年月日时,系统按传统安星法精确排出命宫、身宫与十二宫主星辅星,并给出AI命理建议。"
                cta="开始排盘"
                borderClass="border-gold/25"
                textClass="text-gold"
              />
            </div>
          </section>

          {/* 西方玄学 */}
          <section id="west" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-6 sm:mb-7">
              <span className="text-2xl">🔮</span>
              <h2 className="font-serif text-xl sm:text-2xl text-amber-200">西方玄学</h2>
              <SectionTag>塔罗牌 · 占星术 · 数字命理</SectionTag>
            </div>
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
              <Link
                href="/tarot"
                className="group relative overflow-hidden rounded-2xl border border-amber-300/25 bg-gradient-to-br from-[#1a1035] via-[#241a45] to-[#150f2e] p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:from-[#20143f] hover:to-[#1a1235]"
              >
                <span className="absolute top-4 right-6 text-amber-200/30 text-lg">✦</span>
                <span className="absolute bottom-6 right-16 text-violet-300/20 text-xs">✧</span>
                <div className="text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border border-amber-300/25 bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110">
                  🔮
                </div>
                <h3 className="font-serif text-lg sm:text-xl mb-2 text-amber-200">塔罗牌</h3>
                <p className="text-sm text-violet-200/70 leading-relaxed">
                  遵循标准韦特塔罗规则:洗牌、随机抽牌、判定正逆位,单张指引或时间之流三牌阵,AI 为你串联解读。
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-amber-200/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  ✦ 开始占卜 <span aria-hidden="true">→</span>
                </span>
              </Link>

              <Link
                href="/astrology"
                className="group relative overflow-hidden rounded-2xl border border-amber-300/25 bg-gradient-to-br from-[#1a1035] via-[#241a45] to-[#150f2e] p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:from-[#20143f] hover:to-[#1a1235]"
              >
                <span className="absolute top-4 right-6 text-amber-200/30 text-lg">✦</span>
                <span className="absolute bottom-6 right-16 text-violet-300/20 text-xs">✧</span>
                <div className="text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border border-amber-300/25 bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110">
                  ✨
                </div>
                <h3 className="font-serif text-lg sm:text-xl mb-2 text-amber-200">占星术</h3>
                <p className="text-sm text-violet-200/70 leading-relaxed">
                  输入出生时间与地点,用真实天文历法算出太阳、月亮、上升星座与五大行星位置,绘制专属本命盘。
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-amber-200/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  ✦ 生成本命盘 <span aria-hidden="true">→</span>
                </span>
              </Link>

              <Link
                href="/numerology"
                className="group relative overflow-hidden rounded-2xl border border-amber-300/25 bg-gradient-to-br from-[#1a1035] via-[#241a45] to-[#150f2e] p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:from-[#20143f] hover:to-[#1a1235]"
              >
                <span className="absolute top-4 right-6 text-amber-200/30 text-lg">✦</span>
                <span className="absolute bottom-6 right-16 text-violet-300/20 text-xs">✧</span>
                <div className="text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border border-amber-300/25 bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110">
                  🔢
                </div>
                <h3 className="font-serif text-lg sm:text-xl mb-2 text-amber-200">数字命理</h3>
                <p className="text-sm text-violet-200/70 leading-relaxed">
                  输入出生日期(及可选姓名),用毕达哥拉斯数字命理算法算出生命历程数、表达数等核心数字,AI 给出解读与建议。
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-amber-200/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  ✦ 开始计算 <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>
          </section>

          {/* 现代科学 */}
          <section id="science" className="scroll-mt-20">
            <div className="flex items-center gap-3 mb-6 sm:mb-7">
              <span className="text-2xl">🧠</span>
              <h2 className="font-serif text-xl sm:text-2xl text-cyan-400">现代科学</h2>
              <SectionTag>MBTI · 大五人格 · 职场性格</SectionTag>
            </div>
            <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
              <Link
                href="/personality"
                className="group rounded-2xl border border-slate-700 bg-slate-900/60 p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:bg-slate-900"
              >
                <div className="text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border border-slate-700 bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110">
                  🧠
                </div>
                <h3 className="text-lg sm:text-xl mb-2 text-cyan-400 font-semibold">MBTI 人格测试</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  标准四维二分理论测评,测一次即可,结果保存在本机,随时可以重新测试。
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-cyan-400/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  开始测试 <span aria-hidden="true">→</span>
                </span>
              </Link>

              <Link
                href="/bigfive"
                className="group rounded-2xl border border-slate-700 bg-slate-900/60 p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:bg-slate-900"
              >
                <div className="text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border border-slate-700 bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110">
                  🧭
                </div>
                <h3 className="text-lg sm:text-xl mb-2 text-cyan-400 font-semibold">大五人格模型测试</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  国际学界广泛使用的大五人格(OCEAN)测评,五个维度输出连续分数,可随时重新测试。
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-cyan-400/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  开始测试 <span aria-hidden="true">→</span>
                </span>
              </Link>

              <Link
                href="/workstyle"
                className="group rounded-2xl border border-slate-700 bg-slate-900/60 p-7 sm:p-8 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-1 hover:shadow-card-lg hover:bg-slate-900"
              >
                <div className="text-2xl mb-4 h-11 w-11 flex items-center justify-center rounded-xl border border-slate-700 bg-black/20 transition-transform duration-300 ease-smooth group-hover:scale-110">
                  💼
                </div>
                <h3 className="text-lg sm:text-xl mb-2 text-cyan-400 font-semibold">职场性格七维度测评</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  参考职业心理学界公开讨论的职场人格维度框架构建,输出七维度分数与协作、职业发展建议。
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-cyan-400/90 transition-transform duration-300 ease-smooth group-hover:translate-x-1">
                  开始测试 <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>
          </section>
        </div>

        <p className="text-center text-stone-500 text-xs mt-20 max-w-2xl mx-auto leading-relaxed border-t border-white/5 pt-8">
          本站内容基于传统命理/易学文化、塔罗象征体系与心理学理论,结合大模型生成,仅供娱乐与自我参考,不能替代专业的医疗、法律、财务或心理咨询建议。
        </p>
      </div>
    </main>
  );
}
