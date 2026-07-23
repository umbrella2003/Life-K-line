"use client";

import { useMemo, useState } from "react";
import KLineChart from "@/components/KLineChart";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatTile from "@/components/ui/StatTile";
import { fieldClass, cardClass } from "@/components/ui/tone";
import type { BaziInput, BaziResult } from "@/lib/bazi";
import {
  aggregateDaily,
  fromCompactDaily,
  type CompactPoint,
  type Interval,
  type KLineResult,
} from "@/lib/kline";

interface FormState {
  date: string;
  time: string;
  gender: "male" | "female";
}

interface PreviewData {
  bazi: BaziResult;
  daily: CompactPoint[];
  kline: KLineResult;
  priceFen: number;
}

const PILLAR_LABELS: [key: "year" | "month" | "day" | "time", label: string][] = [
  ["year", "年柱"],
  ["month", "月柱"],
  ["day", "日柱"],
  ["time", "时柱"],
];

const TABS: { key: Interval; label: string }[] = [
  { key: "day", label: "24H" },
  { key: "week", label: "1W" },
  { key: "month", label: "1M" },
  { key: "year", label: "人生" },
];

export default function BaziPage() {
  const [form, setForm] = useState<FormState>({
    date: "1995-06-15",
    time: "08:30",
    gender: "male",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [submittedInput, setSubmittedInput] = useState<BaziInput | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);
  const [timeframe, setTimeframe] = useState<Interval>("year");

  const displayPoints = useMemo(() => {
    if (!preview || !submittedInput) return [];
    if (timeframe === "year") return preview.kline.points;
    const daily = fromCompactDaily(
      preview.daily,
      submittedInput.year,
      submittedInput.month,
      submittedInput.day
    );
    return aggregateDaily(daily, timeframe);
  }, [preview, submittedInput, timeframe]);

  const birthPayload = (): BaziInput => {
    const [year, month, day] = form.date.split("-").map(Number);
    const [hour, minute] = form.time.split(":").map(Number);
    return { year, month, day, hour, minute, gender: form.gender };
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    setReading(null);
    const input = birthPayload();
    try {
      const res = await fetch("/api/bazi/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "计算失败");
      setPreview(data);
      setSubmittedInput(input);
      setTimeframe("year");
    } catch (e) {
      setError(e instanceof Error ? e.message : "计算失败,请检查输入");
    } finally {
      setLoading(false);
    }
  };

  const onUnlocked = async (orderId: string) => {
    setPayOpen(false);
    setUnlocking(true);
    try {
      const res = await fetch("/api/bazi/analyze", {
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
    <main className="min-h-screen bg-ink px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-3xl lg:max-w-4xl mx-auto">
        <PageHeader
          accent="gold"
          icon="☯"
          eyebrow="东方玄学"
          title="生辰八字 · 人生K线"
          description="请输入阳历出生日期与时间(尽量精确到分钟,时辰会影响时柱排盘)。"
        />

        <div className={cardClass("gold", "mb-8 animate-fade-up")}>
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
            免费排盘 · 生成人生K线
          </Button>

          {error && <p className="text-cinnabar text-sm mt-3 animate-fade-in">{error}</p>}
        </div>

        {preview && (
          <div className="space-y-6 animate-fade-up">
            <section className={cardClass("gold")}>
              <h2 className="font-serif text-lg text-gold mb-4">八字排盘</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                {PILLAR_LABELS.map(([key, label]) => {
                  const pillar = preview.bazi.pillars[key];
                  return (
                    <StatTile
                      key={key}
                      accent="gold"
                      label={label}
                      value={pillar.ganZhi}
                      sub={pillar.wuxing}
                      emphasis
                    />
                  );
                })}
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">
                生肖:{preview.bazi.shengXiao} · 日主:{preview.bazi.dayMasterGan}(
                {preview.bazi.dayMasterWuXing}) · 五行最旺:{preview.bazi.strongestWuxing} ·
                最弱:{preview.bazi.weakestWuxing}
              </p>
              <div className="flex gap-2 mt-3.5 flex-wrap">
                {Object.entries(preview.bazi.wuxingCount).map(([el, n]) => (
                  <span
                    key={el}
                    className="text-xs px-3 py-1 rounded-full border border-gold/25 bg-black/20 text-stone-300 tabular-nums"
                  >
                    {el} × {n}
                  </span>
                ))}
              </div>
            </section>

            <section className={cardClass("gold")}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="font-serif text-lg text-gold">人生K线(0-100 运势指数)</h2>
                <div className="inline-flex rounded-xl border border-gold/25 bg-black/20 p-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setTimeframe(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-smooth ${
                        timeframe === tab.key
                          ? "bg-gold text-ink shadow"
                          : "text-stone-400 hover:text-stone-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <KLineChart points={displayPoints} interval={timeframe} />
              <p className="text-xs text-stone-500 mt-3 leading-relaxed">
                高峰年份:
                {preview.kline.summary.peakYears.map((p) => `${p.year}年(${p.age}岁)`).join("、")}
                ;低谷年份:
                {preview.kline.summary.dipYears.map((p) => `${p.year}年(${p.age}岁)`).join("、")}
              </p>
            </section>

            {!reading && (
              <Button
                accent="gold"
                variant="outline"
                fullWidth
                loading={unlocking}
                loadingText="AI 解读生成中,请稍候..."
                onClick={() => setPayOpen(true)}
              >
                开通 AI 命理解读 · ¥{(preview.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {reading && (
              <section className={cardClass("gold", "animate-fade-up")}>
                <h2 className="font-serif text-lg text-gold mb-2">AI 命理解读</h2>
                <MarkdownView text={reading} />
              </section>
            )}
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="bazi"
        payload={submittedInput ?? birthPayload()}
        priceFen={preview?.priceFen ?? 660}
        onUnlocked={onUnlocked}
      />
    </main>
  );
}
