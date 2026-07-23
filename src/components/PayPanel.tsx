"use client";

import { useEffect, useRef, useState } from "react";
import Spinner from "@/components/ui/Spinner";

type Method = "wechat" | "alipay";

export default function PayPanel({
  open,
  onClose,
  type,
  payload,
  priceFen,
  onUnlocked,
  theme = "east",
}: {
  open: boolean;
  onClose: () => void;
  type:
    | "bazi"
    | "mbti"
    | "tarot"
    | "personality"
    | "astrology"
    | "ziwei"
    | "numerology"
    | "bigfive"
    | "workstyle";
  payload: unknown;
  priceFen: number;
  onUnlocked: (orderId: string) => void;
  theme?: "east" | "west" | "science";
}) {
  const [method, setMethod] = useState<Method | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  // 挂载态比 open 多停留一帧动画时长,用来在关闭时播放淡出而不是瞬间消失
  const [mounted, setMounted] = useState(open);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    setMethod(null);
    setLoading(false);
    setError(null);
    setQrDataUrl(null);
    setOrderId(null);
    if (pollRef.current) clearInterval(pollRef.current);
    const t = window.setTimeout(() => setMounted(false), 180);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const panelBg =
    theme === "west"
      ? "border-amber-300/30 bg-gradient-to-b from-[#1a1035] to-[#150f2e]"
      : theme === "science"
        ? "border-slate-700 bg-slate-900"
        : "border-gold/30 bg-ink";
  const titleColor = theme === "west" ? "text-amber-200" : theme === "science" ? "text-cyan-400" : "text-gold";
  const accentColor = theme === "west" ? "text-amber-300" : theme === "science" ? "text-cyan-400" : "text-gold";
  const errorColor = theme === "science" ? "text-rose-400" : theme === "west" ? "text-rose-300" : "text-cinnabar";

  const startPolling = (id: string) => {
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/pay/status?orderId=${id}`);
      const data = await res.json();
      if (data.status === "paid") {
        if (pollRef.current) clearInterval(pollRef.current);
        onUnlocked(id);
      }
    }, 2000);
  };

  const choose = async (m: Method) => {
    setMethod(m);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, method: m, payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "下单失败");

      setOrderId(data.orderId);
      if (data.status === "paid") {
        onUnlocked(data.orderId);
        return;
      }
      setQrDataUrl(data.qrDataUrl);
      startPolling(data.orderId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "下单失败,请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 transition-opacity duration-200 ease-smooth ${
        open ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-sm rounded-2xl border ${panelBg} p-6 shadow-2xl transition-all duration-200 ease-smooth ${
          open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-serif text-lg ${titleColor}`}>开通 AI 解读</h3>
          <button
            onClick={onClose}
            aria-label="关闭"
            className="rounded-full h-8 w-8 flex items-center justify-center text-stone-400 hover:text-stone-100 hover:bg-white/10 transition-colors duration-150"
          >
            ✕
          </button>
        </div>

        <p className="text-sm text-stone-300 mb-4 leading-relaxed">
          解读由大模型实时生成,需消耗算力,费用
          <span className={`font-semibold tabular-nums ${accentColor}`}> ¥{(priceFen / 100).toFixed(2)} </span>
          用于覆盖 API 调用成本。
        </p>

        {error && (
          <p className={`text-sm mb-3 whitespace-pre-wrap animate-fade-in ${errorColor}`}>{error}</p>
        )}

        {!qrDataUrl && (
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={loading}
              onClick={() => choose("wechat")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-jade/50 bg-jade/10 py-3 text-sm text-stone-100 transition-all duration-200 ease-smooth hover:bg-jade/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading && method === "wechat" && <Spinner className="h-4 w-4" />}
              {loading && method === "wechat" ? "生成中..." : "微信支付"}
            </button>
            <button
              disabled={loading}
              onClick={() => choose("alipay")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/50 bg-gold/10 py-3 text-sm text-stone-100 transition-all duration-200 ease-smooth hover:bg-gold/20 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading && method === "alipay" && <Spinner className="h-4 w-4" />}
              {loading && method === "alipay" ? "生成中..." : "支付宝"}
            </button>
          </div>
        )}

        {qrDataUrl && (
          <div className="flex flex-col items-center gap-3 animate-scale-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="支付二维码" className="w-56 h-56 rounded-xl bg-white p-2 shadow-lg" />
            <p className="text-sm text-stone-300 text-center">
              请使用{method === "wechat" ? "微信" : "支付宝"}扫码支付,支付完成后将自动解锁
            </p>
            <p className="text-xs text-stone-500 inline-flex items-center gap-1.5">
              <Spinner className="h-3 w-3" />
              等待支付结果...
            </p>
            {orderId && <p className="text-[11px] text-stone-600">订单号:{orderId}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
