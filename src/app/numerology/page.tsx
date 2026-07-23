"use client";

import { useEffect, useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import StatTile from "@/components/ui/StatTile";
import { cardClass, fieldClass } from "@/components/ui/tone";
import { NUMBER_KEYWORDS } from "@/lib/numerology";
import type { NumerologyInput, NumerologyResult } from "@/lib/numerology";

const STORAGE_KEY = "numerology_test_v1";

interface SavedState {
  input: NumerologyInput;
  result: NumerologyResult;
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

export default function NumerologyPage() {
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [date, setDate] = useState("1995-06-15");
  const [name, setName] = useState("");
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

  const buildInput = (): NumerologyInput => {
    const [year, month, day] = date.split("-").map(Number);
    return { year, month, day, name: name.trim() || undefined };
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    const input = buildInput();
    try {
      const res = await fetch("/api/numerology/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "计算失败");
      persist({ input, result: data.result, priceFen: data.priceFen });
    } catch (e) {
      setError(e instanceof Error ? e.message : "计算失败,请检查输入");
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
      const res = await fetch("/api/numerology/analyze", {
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
    return <main className="min-h-screen bg-[#0f0a1f]" />;
  }

  const hasName = !!saved?.result.nameUsed;

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
          icon="🔢"
          eyebrow="西方玄学"
          title="数字命理"
          description="输入出生日期(及可选的英文/拼音姓名),用毕达哥拉斯数字命理算法计算生命历程数等数字,测一次即可,结果会保存在本机,也可以随时重新测试。"
        />

        {!saved && (
          <div className={`${cardClass("amber")} space-y-5 animate-fade-up`}>
            <label className="block text-sm text-violet-300/70">
              出生日期(阳历)
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`mt-1.5 ${fieldClass("amber")}`}
              />
            </label>

            <label className="block text-sm text-violet-300/70">
              姓名(英文或拼音,可选)
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如 Zhang San,留空则只计算生命历程数与生日数"
                className={`mt-1.5 ${fieldClass("amber")}`}
              />
              <span className="block text-[11px] text-violet-400/50 mt-2">
                用于计算表达数、灵魂数与人格数,仅识别英文字母,中文姓名请填拼音。
              </span>
            </label>

            <Button accent="amber" fullWidth loading={loading} loadingText="计算中..." onClick={submit}>
              ✦ 免费计算数字命理 ✦
            </Button>
            {error && <p className="text-rose-300 text-sm animate-fade-in">{error}</p>}
          </div>
        )}

        {saved && (
          <div className="space-y-6 animate-fade-up">
            <section className={cardClass("amber")}>
              <p className="text-xs text-violet-300/60 mb-3 tracking-widest">核心数字</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <StatTile
                  accent="amber"
                  label="生命历程数"
                  value={saved.result.lifePathNumber}
                  sub={NUMBER_KEYWORDS[saved.result.lifePathNumber]}
                  emphasis
                />
                <StatTile
                  accent="amber"
                  label="生日数"
                  value={saved.result.birthdayNumber}
                  sub={NUMBER_KEYWORDS[saved.result.birthdayNumber]}
                  emphasis
                />
              </div>

              {hasName ? (
                <>
                  <p className="text-xs text-violet-300/60 mb-3 mt-5 tracking-widest">
                    姓名数字(基于 {saved.result.nameUsed})
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <StatTile
                      accent="amber"
                      label="表达数"
                      value={saved.result.expressionNumber!}
                      sub={NUMBER_KEYWORDS[saved.result.expressionNumber!]}
                    />
                    <StatTile
                      accent="amber"
                      label="灵魂数"
                      value={saved.result.soulUrgeNumber!}
                      sub={NUMBER_KEYWORDS[saved.result.soulUrgeNumber!]}
                    />
                    <StatTile
                      accent="amber"
                      label="人格数"
                      value={saved.result.personalityNumber!}
                      sub={NUMBER_KEYWORDS[saved.result.personalityNumber!]}
                    />
                    <StatTile
                      accent="amber"
                      label="成熟数"
                      value={saved.result.maturityNumber!}
                      sub={NUMBER_KEYWORDS[saved.result.maturityNumber!]}
                    />
                  </div>
                </>
              ) : (
                <p className="text-xs text-violet-400/50 mt-4">
                  未提供姓名,如需查看表达数/灵魂数/人格数,请重新测试并填写英文或拼音姓名。
                </p>
              )}
            </section>

            {!saved.reading && (
              <Button
                accent="amber"
                variant="outline"
                fullWidth
                loading={unlocking}
                loadingText="AI 解读生成中,请稍候..."
                onClick={() => setPayOpen(true)}
              >
                ✦ 开通 AI 数字命理解读 · ¥{(saved.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {saved.reading && (
              <section className={`${cardClass("amber")} animate-fade-up`}>
                <h2 className="font-serif text-lg text-amber-200 mb-2">数字命理解读</h2>
                <MarkdownView text={saved.reading} accentClassName="text-amber-300" />
              </section>
            )}

            {error && <p className="text-rose-300 text-sm">{error}</p>}

            <Button accent="amber" variant="ghost" className="!px-0 !py-1" onClick={retake}>
              重新测试
            </Button>
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="numerology"
        payload={saved?.input ?? buildInput()}
        priceFen={saved?.priceFen ?? 300}
        onUnlocked={onUnlocked}
        theme="west"
      />
    </main>
  );
}
