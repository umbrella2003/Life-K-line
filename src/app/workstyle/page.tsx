"use client";

import { useEffect, useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import TraitBar from "@/components/ui/TraitBar";
import { cardClass } from "@/components/ui/tone";
import {
  WORKSTYLE_QUESTIONS,
  ANSWER_LABELS,
  TRAIT_ORDER,
  TRAIT_LABELS,
  TRAIT_ANCHORS,
} from "@/lib/workstyle";
import type { WorkstyleAnswer, WorkstyleResult } from "@/lib/workstyle";

const STORAGE_KEY = "workstyle_test_v1";

interface SavedState {
  answers: WorkstyleAnswer[];
  result: WorkstyleResult;
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

export default function WorkstylePage() {
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<"quiz" | "result">("quiz");
  const [saved, setSaved] = useState<SavedState | null>(null);
  const [answers, setAnswers] = useState<WorkstyleAnswer[]>([]);
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

  const question = WORKSTYLE_QUESTIONS[index];
  const total = WORKSTYLE_QUESTIONS.length;

  const answer = async (choice: WorkstyleAnswer) => {
    const next = [...answers, choice];
    setAnswers(next);
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/workstyle/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "计算失败");
      persist({ answers: next, result: data.result, priceFen: data.priceFen });
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
      const res = await fetch("/api/workstyle/analyze", {
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
          icon="💼"
          eyebrow="现代科学 · 职业心理"
          title="职场性格七维度测评"
          description={`参考职业心理学界公开讨论的职场人格维度框架构建的 ${total} 题测评(情绪稳定度/进取动力/社交活力/人际敏感度/谨慎自律/好奇探索/学习钻研),测一次即可,结果会保存在本机,无需重复作答。`}
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
            {loading && <p className="text-slate-500 text-sm mt-4 animate-fade-in">正在计算维度分数...</p>}
            {error && <p className="text-rose-400 text-sm mt-4 animate-fade-in">{error}</p>}
          </div>
        )}

        {stage === "result" && saved && (
          <div className="space-y-6 animate-fade-up">
            <section className={cardClass("cyan")}>
              <p className="text-xs text-slate-500 mb-4">你的职场性格七维度得分(0-100)</p>
              <div className="space-y-5">
                {TRAIT_ORDER.map((t) => (
                  <TraitBar
                    key={t}
                    accent="cyan"
                    label={TRAIT_LABELS[t]}
                    score={saved.result.scores[t]}
                    lowLabel={TRAIT_ANCHORS[t][0]}
                    highLabel={TRAIT_ANCHORS[t][1]}
                  />
                ))}
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
        type="workstyle"
        payload={{ answers: saved?.answers ?? answers }}
        priceFen={saved?.priceFen ?? 500}
        onUnlocked={onUnlocked}
        theme="science"
      />
    </main>
  );
}
