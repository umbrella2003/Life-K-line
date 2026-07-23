"use client";

import { useState } from "react";
import PayPanel from "@/components/PayPanel";
import MarkdownView from "@/components/MarkdownView";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { cardClass } from "@/components/ui/tone";
import { MBTI_QUESTIONS, ANSWER_LABELS } from "@/lib/mbti";
import type { MbtiResult, MbtiAnswer } from "@/lib/mbti";
import type { HexagramResult } from "@/lib/hexagram";

interface PreviewData {
  mbti: MbtiResult;
  hexagram: HexagramResult;
  priceFen: number;
}

export default function MbtiPage() {
  const [answers, setAnswers] = useState<MbtiAnswer[]>([]);
  const [index, setIndex] = useState(0);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState(false);

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
      const res = await fetch("/api/mbti/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "计算失败");
      setPreview(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "计算失败,请重试");
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setAnswers([]);
    setIndex(0);
    setPreview(null);
    setReading(null);
    setError(null);
  };

  const onUnlocked = async (orderId: string) => {
    setPayOpen(false);
    setUnlocking(true);
    try {
      const res = await fetch("/api/mbti/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成解析失败");
      setReading(data.reading);
    } catch (e) {
      setError(e instanceof Error ? e.message : "生成解析失败");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink px-4 sm:px-6 py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        <PageHeader
          accent="jade"
          icon="☰"
          eyebrow="东方玄学"
          title="性格问答 · 易经解析"
          description={`回答 ${total} 道日常小问题,系统会测出你的 MBTI 类型,并结合梅花易数为你起一卦。`}
        />

        {!preview && (
          <div className={`${cardClass("jade")} animate-fade-up`}>
            <div className="mb-6">
              <ProgressBar accent="jade" percent={(index / total) * 100} />
            </div>
            <p className="text-xs text-stone-500 mb-2 tabular-nums">
              第 {index + 1} / {total} 题
            </p>
            <p key={index} className="text-stone-100 text-base mb-5 leading-relaxed animate-fade-in">
              {question.text}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ANSWER_LABELS.map((opt) => (
                <button
                  key={opt.key}
                  disabled={loading}
                  onClick={() => answer(opt.key)}
                  className="rounded-xl border border-jade/30 bg-black/20 px-4 py-3 text-sm text-stone-100 transition-all duration-200 ease-smooth hover:bg-jade/15 hover:-translate-y-0.5 hover:border-jade/60 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {loading && (
              <p className="text-stone-400 text-sm mt-4 animate-fade-in">正在起卦、计算类型...</p>
            )}
            {error && <p className="text-cinnabar text-sm mt-4 animate-fade-in">{error}</p>}
          </div>
        )}

        {preview && (
          <div className="space-y-6 animate-fade-up">
            <section className={`${cardClass("jade")} text-center`}>
              <p className="text-xs text-stone-500 mb-1">你的 MBTI 类型</p>
              <p className="font-serif text-4xl text-jade-soft mb-4 tracking-wide">
                {preview.mbti.type}
              </p>
              <div className="flex justify-center gap-4 text-3xl mb-2">
                <span title={preview.hexagram.upperTrigram.name}>
                  {preview.hexagram.upperTrigram.symbol}
                </span>
                <span title={preview.hexagram.lowerTrigram.name}>
                  {preview.hexagram.lowerTrigram.symbol}
                </span>
              </div>
              <p className="text-lg text-gold font-serif">{preview.hexagram.hexagramName}</p>
              <p className="text-xs text-stone-500 mt-1">
                上卦{preview.hexagram.upperTrigram.name} · 下卦{preview.hexagram.lowerTrigram.name}{" "}
                · 动爻第{preview.hexagram.changingLine}爻
              </p>
            </section>

            {!reading && (
              <Button
                accent="jade"
                variant="outline"
                fullWidth
                loading={unlocking}
                loadingText="AI 解析生成中,请稍候..."
                onClick={() => setPayOpen(true)}
              >
                开通 AI 性格解析 · ¥{(preview.priceFen / 100).toFixed(2)}
              </Button>
            )}

            {reading && (
              <section className={`${cardClass("jade")} animate-fade-up`}>
                <h2 className="font-serif text-lg text-jade-soft mb-2">AI 性格解析</h2>
                <MarkdownView text={reading} accentClassName="text-jade-soft" />
              </section>
            )}

            {error && <p className="text-cinnabar text-sm">{error}</p>}

            <Button accent="jade" variant="ghost" onClick={restart} className="!px-0 !py-1">
              重新测试
            </Button>
          </div>
        )}
      </div>

      <PayPanel
        open={payOpen}
        onClose={() => setPayOpen(false)}
        type="mbti"
        payload={{ answers }}
        priceFen={preview?.priceFen ?? 100}
        onUnlocked={onUnlocked}
      />
    </main>
  );
}
