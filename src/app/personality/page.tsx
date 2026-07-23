"use client";

import { useEffect, useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { cardClass } from "@/components/ui/tone";
import { MBTI_QUESTIONS, ANSWER_LABELS } from "@/lib/mbti";
import type { MbtiResult, MbtiAnswer } from "@/lib/mbti";

const STORAGE_KEY = "personality_test_v1";

interface SavedState {
  answers: MbtiAnswer[];
  mbti: MbtiResult;
  typeName: string;
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

export default function PersonalityPage() {
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<"quiz" | "result">("quiz");
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [answers, setAnswers] = useState<MbtiAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const existing = loadSaved();
    if (existing) {
      setSaved(existing);
      setStage("result");
    }
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

  const question = MBTI_QUESTIONS[index];
  const total = MBTI_QUESTIONS.length;

  const answer = async (choice: MbtiAnswer) => {
    const next = [...answers, choice];
    setAnswers(next);
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/personality/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "计算失败");
      persist({ answers: next, mbti: data.mbti, typeName: data.typeName, priceFen: data.priceFen });
      setStage("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "计算失败,请重试");
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
    setAnswers([]);
    setIndex(0);
    setError(null);
    setStage("quiz");
  };

  const onUnlocked = async (orderId: string) => {
    setPayOpen(false);
    setUnlocking(true);
    try {
      const res = await fetch("/api/personality/analyze", {
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
    return <main className="min-h-screen bg-slate-950" />;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          accent="cyan"
          icon="🧠"
          eyebrow="现代科学 · 心理学"
          title="MBTI 人格测试"
          description={`基于标准四维二分理论(E/I、S/N、T/F、J/P)的 ${total} 题人格测评,测一次即可,结果会保存在本机,无需重复作答。`}
        />

        {stage === "quiz" && (
          <div className={`${cardClass("cyan")} animate-fade-up`}>
            <div className="mb-6">
              <ProgressBar accent="cyan" percent={(index / total) * 100} />
            </div>
            <p className="text-xs text-slate-500 mb-2 tabular-nums">
              第 {index + 1} / {total} 题
            </p>
            <p key={index} className="text-slate-100 text-base mb-5 leading-relaxed animate-fade-in">
              {question.text}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ANSWER_LABELS.map((opt) => (
                <button
                  key={opt.key}
                  disabled={loading}
                  onClick={() => answer(opt.key)}
                  className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 transition-all duration-200 ease-smooth hover:bg-slate-800 hover:-translate-y-0.5 hover:border-cyan-400/40 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {loading && <p className="text-slate-500 text-sm mt-4 animate-fade-in">正在计算类型...</p>}
            {error && <p className="text-rose-400 text-sm mt-4 animate-fade-in">{error}</p>}
          </div>
        )}

        {stage === "result" && saved && (
          <div className="space-y-6 animate-fade-up">
            <section className={`${cardClass("cyan")} text-center`}>
              <p className="text-xs text-slate-500 mb-1">你的 MBTI 类型</p>
              <p className="text-5xl font-bold text-cyan-400 mb-2 tracking-wide">{saved.mbti.type}</p>
              {saved.typeName && <p className="text-slate-300 text-sm mb-4">「{saved.typeName}」</p>}
              <div className="grid grid-cols-4 gap-2 text-xs text-slate-400 mt-4 tabular-nums">
                <div>E{saved.mbti.counts.E} / I{saved.mbti.counts.I}</div>
                <div>S{saved.mbti.counts.S} / N{saved.mbti.counts.N}</div>
                <div>T{saved.mbti.counts.T} / F{saved.mbti.counts.F}</div>
                <div>J{saved.mbti.counts.J} / P{saved.mbti.counts.P}</div>
              </div>
            </section>

            {!saved.reading && (
              <Button
                accent="cyan"
                variant="outline"
                fullWidth
                loading={unlocking}
                loadingText="AI 解读生成中,请稍候..."
                onClick={() => setPayOpen(true)}
              >
                开通 AI 深度解读 · ¥{(saved.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {saved.reading && (
              <section className={`${cardClass("cyan")} animate-fade-up`}>
                <h2 className="text-lg text-cyan-400 font-semibold mb-2">AI 深度解读</h2>
                <MarkdownView
                  text={saved.reading}
                  accentClassName="text-cyan-400"
                  headingFontClassName="font-semibold"
                />
              </section>
            )}

            {error && <p className="text-rose-400 text-sm">{error}</p>}

            <Button accent="cyan" variant="ghost" className="!px-0 !py-1" onClick={retake}>
              重新测试
            </Button>
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="personality"
        payload={{ answers: saved?.answers ?? answers }}
        priceFen={saved?.priceFen ?? 500}
        onUnlocked={onUnlocked}
        theme="science"
      />
    </main>
  );
}
