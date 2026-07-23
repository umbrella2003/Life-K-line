"use client";

import { useEffect, useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatTile from "@/components/ui/StatTile";
import { cardClass, fieldClass } from "@/components/ui/tone";
import type { ZiweiChart, ZiweiInput, ZiweiPalace } from "@/lib/ziwei";

const STORAGE_KEY = "ziwei_test_v1";

interface SavedState {
  input: ZiweiInput;
  chart: ZiweiChart;
  priceFen: number;
  orderId?: string;
  reading?: string;
}

function loadSaved(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedState) : null;
  } catch {
    return null;
  }
}

function PalaceCard({ p }: { p: ZiweiPalace }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-3.5 transition-colors duration-200 hover:border-gold/25 hover:bg-black/30">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm text-gold font-serif">
          {p.name}
          {p.isBodyPalace && <span className="text-jade-soft ml-1.5 text-xs">(身宫)</span>}
        </p>
        <p className="text-xs text-stone-500 tabular-nums">
          {p.heavenlyStem}
          {p.earthlyBranch}
        </p>
      </div>
      <p className="text-xs text-stone-300 leading-relaxed">
        主星:
        {p.majorStars.length
          ? p.majorStars
              .map((s) => `${s.name}${s.brightness || ""}${s.mutagen ? "化" + s.mutagen : ""}`)
              .join("、")
          : "无"}
      </p>
      {p.minorStars.length > 0 && (
        <p className="text-xs text-stone-500 mt-0.5">
          辅星:{p.minorStars.map((s) => s.name).join("、")}
        </p>
      )}
      <p className="text-[11px] text-stone-600 mt-1.5 tabular-nums">
        大限 {p.decadalRange[0]}-{p.decadalRange[1]} 岁
      </p>
    </div>
  );
}

export default function ZiweiPage() {
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [form, setForm] = useState({
    date: "1995-06-15",
    time: "08:30",
    gender: "male" as "male" | "female",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const existing = loadSaved();
    if (existing) setSaved(existing);
    setHydrated(true);
  }, []);

  const persist = (data: SavedState) => {
    setSaved(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage 不可用时静默忽略,不影响当次测试展示
    }
  };

  const buildInput = (): ZiweiInput => {
    const [year, month, day] = form.date.split("-").map(Number);
    const [hour, minute] = form.time.split(":").map(Number);
    return { year, month, day, hour, minute, gender: form.gender };
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    const input = buildInput();
    try {
      const res = await fetch("/api/ziwei/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "排盘失败");
      persist({ input, chart: data.chart, priceFen: data.priceFen });
    } catch (e) {
      setError(e instanceof Error ? e.message : "排盘失败,请检查输入");
    } finally {
      setLoading(false);
    }
  };

  const retake = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSaved(null);
    setError(null);
  };

  const onUnlocked = async (orderId: string) => {
    setPayOpen(false);
    setUnlocking(true);
    try {
      const res = await fetch("/api/ziwei/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成解读失败");
      if (saved) persist({ ...saved, orderId, reading: data.reading });
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成解读失败");
    } finally {
      setUnlocking(false);
    }
  };

  if (!hydrated) {
    return <main className="min-h-screen bg-ink" />;
  }

  return (
    <main className="min-h-screen bg-ink px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-3xl lg:max-w-4xl mx-auto">
        <PageHeader
          accent="gold"
          icon="⭐"
          eyebrow="东方玄学"
          title="紫微斗数 · 十二宫命盘"
          description="输入阳历出生日期与时间,系统按传统安星法精确排出命宫、身宫与十二宫星曜,测一次即可,结果会保存在本机,也可以随时重新测试。"
        />

        {!saved && (
          <div className={`${cardClass("gold")} mb-8 animate-fade-up`}>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <label className="text-sm text-stone-300">
                出生日期(阳历)
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`mt-1.5 ${fieldClass("gold")}`}
                />
              </label>
              <label className="text-sm text-stone-300">
                出生时间
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={`mt-1.5 ${fieldClass("gold")}`}
                />
              </label>
            </div>

            <div className="mb-6">
              <p className="text-sm text-stone-300 mb-2">性别</p>
              <div className="inline-flex rounded-xl border border-gold/20 bg-black/25 p-1">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`px-5 py-1.5 rounded-lg text-sm transition-all duration-200 ease-smooth ${
                      form.gender === g
                        ? "bg-gold text-ink font-medium shadow"
                        : "text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {g === "male" ? "男" : "女"}
                  </button>
                ))}
              </div>
            </div>

            <Button accent="gold" fullWidth loading={loading} loadingText="排盘中..." onClick={submit}>
              免费排盘 · 生成命盘
            </Button>

            {error && <p className="text-cinnabar text-sm mt-3 animate-fade-in">{error}</p>}
          </div>
        )}

        {saved && (
          <div className="space-y-6 animate-fade-up">
            <section className={cardClass("gold")}>
              <h2 className="font-serif text-lg text-gold mb-4">命盘总览</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                <StatTile accent="gold" label="五行局" value={saved.chart.fiveElementsClass} emphasis />
                <StatTile accent="gold" label="命主" value={saved.chart.soul} emphasis />
                <StatTile accent="gold" label="身主" value={saved.chart.body} emphasis />
                <StatTile
                  accent="gold"
                  label="生肖 · 星座"
                  value={`${saved.chart.zodiac} · ${saved.chart.sign}`}
                  emphasis
                />
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                阳历:{saved.chart.solarDate} · 农历:{saved.chart.lunarDate} · 干支:
                {saved.chart.chineseDate}
              </p>
              <p className="text-sm text-stone-400 mt-1">
                命宫地支:{saved.chart.soulPalaceBranch} · 身宫地支:{saved.chart.bodyPalaceBranch}
              </p>
            </section>

            <section className={cardClass("gold")}>
              <h2 className="font-serif text-lg text-gold mb-4">十二宫详情</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {saved.chart.palaces.map((p) => (
                  <PalaceCard key={p.index} p={p} />
                ))}
              </div>
            </section>

            {!saved.reading && (
              <Button
                accent="gold"
                variant="outline"
                fullWidth
                loading={unlocking}
                loadingText="AI 解读生成中,请稍候..."
                onClick={() => setPayOpen(true)}
              >
                开通 AI 命理解读 · ¥{(saved.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {saved.reading && (
              <section className={`${cardClass("gold")} animate-fade-up`}>
                <h2 className="font-serif text-lg text-gold mb-2">AI 命理解读</h2>
                <MarkdownView text={saved.reading} />
              </section>
            )}

            {error && <p className="text-cinnabar text-sm">{error}</p>}

            <Button accent="gold" variant="ghost" onClick={retake} className="!px-0 !py-1">
              重新测试
            </Button>
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="ziwei"
        payload={saved?.input ?? buildInput()}
        priceFen={saved?.priceFen ?? 300}
        onUnlocked={onUnlocked}
      />
    </main>
  );
}
