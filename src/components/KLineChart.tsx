"use client";

import { useEffect, useRef } from "react";
import { createChart, CandlestickSeries, type IChartApi } from "lightweight-charts";
import type { KLinePoint, Interval } from "@/lib/kline";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDays(dateStr: string, delta: number) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

// 非"人生"整体视图时,默认聚焦在"今天"附近的一个窗口,更像真实交易软件的短周期图
const WINDOW_DAYS: Record<Interval, number | null> = {
  day: 30,
  week: 90,
  month: 365,
  year: null, // null 表示展示全部
};

function chartHeightFor(width: number): number {
  if (width < 480) return 260;
  if (width < 768) return 320;
  return 380;
}

export default function KLineChart({
  points,
  interval = "year",
}: {
  points: KLinePoint[];
  interval?: Interval;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const initialWidth = containerRef.current.clientWidth;

    const chart = createChart(containerRef.current, {
      width: initialWidth,
      height: chartHeightFor(initialWidth),
      layout: {
        background: { color: "transparent" },
        textColor: "#d9c9a3",
      },
      grid: {
        vertLines: { color: "rgba(201,162,74,0.08)" },
        horzLines: { color: "rgba(201,162,74,0.08)" },
      },
      timeScale: {
        borderColor: "rgba(201,162,74,0.3)",
      },
      rightPriceScale: {
        borderColor: "rgba(201,162,74,0.3)",
      },
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#c9a24a",
      downColor: "#3a6b57",
      borderUpColor: "#e0bc6b",
      borderDownColor: "#4f8a70",
      wickUpColor: "#e0bc6b",
      wickDownColor: "#4f8a70",
    });

    series.setData(
      points.map((p) => ({
        time: p.time as unknown as never,
        open: p.open,
        high: p.high,
        low: p.low,
        close: p.close,
      }))
    );

    const windowDays = WINDOW_DAYS[interval];
    if (windowDays && points.length > 0) {
      const today = todayStr();
      const from = addDays(today, -windowDays);
      const to = addDays(today, windowDays);
      const minTime = points[0].time;
      const maxTime = points[points.length - 1].time;
      chart.timeScale().setVisibleRange({
        from: (from < minTime ? minTime : from) as unknown as never,
        to: (to > maxTime ? maxTime : to) as unknown as never,
      });
    } else {
      chart.timeScale().fitContent();
    }

    // 用 ResizeObserver 而非 window resize:容器宽度变化(如侧边栏、方向切换、
    // 移动端地址栏收起)都能触发,比只监听 window resize 更适配各种设备。
    const resizeObserver = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) {
        chart.applyOptions({ width, height: chartHeightFor(width) });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, [points, interval]);

  return <div ref={containerRef} className="w-full animate-fade-in" />;
}
