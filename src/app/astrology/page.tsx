"use client";

import { useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatTile from "@/components/ui/StatTile";
import { cardClass, fieldClass } from "@/components/ui/tone";
import { COMMON_CITIES } from "@/lib/astrology";
import type { NatalChart, PlanetPosition, NatalChartInput } from "@/lib/astrology";

interface PreviewData {
  chart: NatalChart;
  priceFen: number;
}

const PLANET_ROWS: { key: keyof NatalChart; label: string }[] = [
  { key: "sun", label: "太阳" },
  { key: "moon", label: "月亮" },
  { key: "mercury", label: "水星" },
  { key: "venus", label: "金星" },
  { key: "mars", label: "火星" },
  { key: "jupiter", label: "木星" },
  { key: "saturn", label: "土星" },
];

export default function AstrologyPage() {
  const [date, setDate] = useState("1995-06-15");
  const [time, setTime] = useState("08:30");
  const [cityIndex, setCityIndex] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customLat, setCustomLat] = useState("39.9042");
  const [customLon, setCustomLon] = useState("116.4074");

  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [submittedInput, setSubmittedInput] = useState<NatalChartInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

  const buildInput = (): NatalChartInput => {
    const [year, month, day] = date.split("-").map(Number);
    const [hour, minute] = time.split(":").map(Number);
    const city = COMMON_CITIES[cityIndex];
    const latitude = customMode ? parseFloat(customLat) : city.latitude;
    const longitude = customMode ? parseFloat(customLon) : city.longitude;
    return { year, month, day, hour, minute, timezoneOffsetHours: 8, latitude, longitude };
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    setReading(null);
    const input = buildInput();
    try {
      const res = await fetch("/api/astrology/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "计算失败");
      setPreview(data);
      setSubmittedInput(input);
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
      const res = await fetch("/api/astrology/analyze", {
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

  const renderPlanet = (p: PlanetPosition) => (
    <div className="flex items-center justify-between rounded-lg bg-black/20 px-4 py-2.5 transition-colors duration-200 hover:bg-black/30">
      <span className="text-violet-200/80 text-sm">{p.body}</span>
      <span className="text-amber-200 text-sm font-serif tabular-nums">
        {p.sign.symbol} {p.sign.name} {p.degreeInSign.toFixed(1)}°
      </span>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f0a1f] relative overflow-hidden px-4 sm:px-6 py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
        <span className="absolute top-10 left-[8%] text-amber-200/40 text-lg">✦</span>
        <span className="absolute top-24 left-[80%] text-violet-300/40 text-sm">✧</span>
        <span className="absolute top-[40%] left-[4%] text-amber-200/30 text-xs">✦</span>
        <span className="absolute top-[60%] left-[90%] text-violet-300/30 text-lg">✧</span>
        <span className="absolute top-[80%] left-[15%] text-amber-200/30 text-sm">✦</span>
      </div>

      <div className="max-w-2xl mx-auto relative">
        <PageHeader
          accent="amber"
          icon="✨"
          eyebrow="西方玄学"
          title="占星术"
          description="输入出生日期、时间与地点,用真实天文历法算出太阳、月亮、上升星座及五大行星的黄道位置,绘制本命盘。"
        />

        {!preview && (
          <div className={`${cardClass("amber")} space-y-5 animate-fade-up`}>
            <div className="grid grid-cols-2 gap-4">
              <label className="text-sm text-violet-300/70">
                出生日期(阳历)
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`mt-1.5 ${fieldClass("amber")}`}
                />
              </label>
              <label className="text-sm text-violet-300/70">
                出生时间
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`mt-1.5 ${fieldClass("amber")}`}
                />
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-violet-300/70 tracking-widest">出生地点</p>
                <button
                  onClick={() => setCustomMode(!customMode)}
                  className="text-xs text-amber-200/70 hover:text-amber-200 transition-colors duration-200"
                >
                  {customMode ? "改用城市选择" : "手动输入经纬度"}
                </button>
              </div>

              {!customMode ? (
                <select
                  value={cityIndex}
                  onChange={(e) => setCityIndex(Number(e.target.value))}
                  className={fieldClass("amber")}
                >
                  {COMMON_CITIES.map((c, i) => (
                    <option key={c.name} value={i}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="纬度,如 39.9042"
                    className={fieldClass("amber")}
                  />
                  <input
                    value={customLon}
                    onChange={(e) => setCustomLon(e.target.value)}
                    placeholder="经度,如 116.4074"
                    className={fieldClass("amber")}
                  />
                </div>
              )}
              <p className="text-[11px] text-violet-400/50 mt-2">
                默认按中国民用时区(UTC+8)计算,海外出生请用手动经纬度并自行换算时间。
              </p>
            </div>

            <Button accent="amber" fullWidth loading={loading} loadingText="推算星盘中..." onClick={submit}>
              ✦ 生成本命盘 ✦
            </Button>
            {error && <p className="text-rose-300 text-sm animate-fade-in">{error}</p>}
          </div>
        )}

        {preview && (
          <div className="space-y-6 animate-fade-up">
            <section className={cardClass("amber")}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <StatTile
                  accent="amber"
                  label="太阳星座"
                  value={preview.chart.sun.sign.symbol}
                  sub={preview.chart.sun.sign.name}
                  emphasis
                />
                <StatTile
                  accent="amber"
                  label="月亮星座"
                  value={preview.chart.moon.sign.symbol}
                  sub={preview.chart.moon.sign.name}
                  emphasis
                />
                <StatTile
                  accent="amber"
                  label="上升星座"
                  value={preview.chart.ascendant.sign.symbol}
                  sub={preview.chart.ascendant.sign.name}
                  emphasis
                />
              </div>

              <p className="text-xs text-violet-300/60 mb-2 tracking-widest">本命盘 · 行星分布</p>
              <div className="space-y-2">
                {PLANET_ROWS.map((row) => (
                  <div key={row.key}>{renderPlanet(preview.chart[row.key] as PlanetPosition)}</div>
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
                ✦ 开通 AI 占星解读 · ¥{(preview.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {reading && (
              <section className={`${cardClass("amber")} animate-fade-up`}>
                <h2 className="font-serif text-lg text-amber-200 mb-2">占星解读</h2>
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
              }}
            >
              重新推算
            </Button>
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="astrology"
        payload={submittedInput ?? buildInput()}
        priceFen={preview?.priceFen ?? 500}
        onUnlocked={onUnlocked}
        theme="west"
      />
    </main>
  );
}
