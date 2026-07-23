"use client";

import { useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import TarotCardView from "@/components/TarotCardView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { cardClass, fieldClass } from "@/components/ui/tone";
import type { DrawnCard, Spread } from "@/lib/tarot";

interface PreviewData {
  cards: DrawnCard[];
  spread: Spread;
  spreadName: string;
  question: string;
  priceFen: number;
}

const SPREADS: { key: Spread; label: string; desc: string }[] = [
  { key: "single", label: "单张指引", desc: "抽一张牌,回应你当下最关心的问题" },
  { key: "three", label: "时间之流", desc: "过去 · 现在 · 未来,三张牌看清事情走向" },
];

export default function TarotPage() {
  const [spread, setSpread] = useState<Spread>("three");
  const [question, setQuestion] = useState("");
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const draw = async () => {
    setLoading(true);
    setError(null);
    setReading(null);
    setRevealed(false);
    setPreview(null);
    try {
      const res = await fetch("/api/tarot/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spread, question: question.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "抽牌失败");
      setPreview(data);
      window.setTimeout(() => setRevealed(true), 200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "抽牌失败,请重试");
    } finally {
      setLoading(false);
    }
  };

  const onUnlocked = async (orderId: string) => {
    setPayOpen(false);
    setUnlocking(true);
    try {
      const res = await fetch("/api/tarot/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成解读失败");
      setReading(data.reading);
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成解读失败");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0a1f] relative overflow-hidden px-4 sm:px-6 py-10 sm:py-14">
      {/* 装饰星光 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <span className="absolute top-10 left-[8%] text-amber-200/40 text-lg">✦</span>
        <span className="absolute top-24 left-[80%] text-violet-300/40 text-sm">✧</span>
        <span className="absolute top-[40%] left-[4%] text-amber-200/30 text-xs">✦</span>
        <span className="absolute top-[60%] left-[90%] text-violet-300/30 text-lg">✧</span>
        <span className="absolute top-[80%] left-[15%] text-amber-200/30 text-sm">✦</span>
        <span className="absolute top-[15%] left-[45%] text-violet-300/20 text-xs">✧</span>
      </div>

      <div className="max-w-2xl mx-auto relative">
        <PageHeader
          accent="amber"
          icon="🔮"
          eyebrow="西方玄学"
          title="塔罗牌"
          description="遵循标准韦特塔罗规则:洗牌、随机抽牌、判定正逆位,再由 AI 结合牌阵为你解读。"
        />

        {!preview && (
          <div className={`${cardClass("amber")} space-y-5 animate-fade-up`}>
            <div>
              <p className="text-xs text-violet-300/70 mb-2 tracking-widest">选择牌阵</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPREADS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSpread(s.key)}
                    className={`text-left rounded-xl border px-4 py-3 transition-all duration-200 ease-smooth ${
                      spread === s.key
                        ? "border-amber-300/70 bg-amber-300/10 shadow-glow-amber"
                        : "border-violet-400/20 hover:bg-white/5 hover:border-violet-400/40"
                    }`}
                  >
                    <p className="text-amber-100 text-sm font-serif">{s.label}</p>
                    <p className="text-violet-300/60 text-xs mt-1">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-violet-300/70 mb-2 tracking-widest">
                你想问什么问题?(选填)
              </p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                maxLength={200}
                rows={2}
                placeholder="例如:这段感情接下来会如何发展?"
                className={fieldClass("amber")}
              />
            </div>

            <Button accent="amber" fullWidth loading={loading} loadingText="洗牌中..." onClick={draw}>
              ✦ 洗牌抽卡 ✦
            </Button>
            {error && <p className="text-rose-300 text-sm animate-fade-in">{error}</p>}
          </div>
        )}

        {preview && (
          <div className="space-y-8 animate-fade-up">
            <section className={cardClass("amber")}>
              <p className="text-center text-xs text-violet-300/60 mb-6 tracking-widest">
                {preview.spreadName}
                {preview.question ? ` · "${preview.question}"` : ""}
              </p>
              <div className="flex justify-center gap-4 sm:gap-8 flex-wrap">
                {preview.cards.map((c, i) => (
                  <TarotCardView key={i} drawn={c} revealed={revealed} delayMs={i * 250} />
                ))}
              </div>
            </section>

            {!reading && (
              <Button
                accent="amber"
                variant="outline"
                fullWidth
                loading={unlocking}
                loadingText="AI 解读生成中,请稍候..."
                onClick={() => setPayOpen(true)}
              >
                ✦ 开通 AI 塔罗解读 · ¥{(preview.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {reading && (
              <section className={`${cardClass("amber")} animate-fade-up`}>
                <h2 className="font-serif text-lg text-amber-200 mb-2">塔罗解读</h2>
                <MarkdownView text={reading} accentClassName="text-amber-300" />
              </section>
            )}

            <Button
              accent="amber"
              variant="ghost"
              className="!px-0 !py-1"
              onClick={() => {
                setPreview(null);
                setReading(null);
                setRevealed(false);
              }}
            >
              重新抽牌
            </Button>
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="tarot"
        payload={preview ? { cards: preview.cards, spread: preview.spread, question: preview.question } : null}
        priceFen={preview?.priceFen ?? 990}
        onUnlocked={onUnlocked}
        theme="west"
      />
    </main>
  );
}
