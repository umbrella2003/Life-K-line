import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrder, saveOrderResult } from "@/lib/order";
import { calcBazi, type BaziInput } from "@/lib/bazi";
import { buildDailySeries, aggregateDaily, summarizeYearly } from "@/lib/kline";
import { buildBaziPrompt } from "@/lib/prompts";
import { callDeepSeek } from "@/lib/deepseek";

export const dynamic = "force-dynamic";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = schema.parse(body);

    const order = getOrder(orderId);
    if (!order || order.type !== "bazi") {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }
    if (order.status !== "paid") {
      return NextResponse.json({ error: "订单尚未支付" }, { status: 402 });
    }

    const input = order.payload as BaziInput;
    const bazi = calcBazi(input);
    const daily = buildDailySeries({
      birthYear: input.year,
      birthMonth: input.month,
      birthDay: input.day,
      dayMasterWuXing: bazi.dayMasterWuXing,
      dayJiaZiIndex: bazi.dayJiaZiIndex,
      daYunList: bazi.daYunList,
    });
    const yearPoints = aggregateDaily(daily, "year");
    const summary = summarizeYearly(yearPoints);

    let reading = order.result;
    if (!reading) {
      const messages = buildBaziPrompt(bazi, summary);
      reading = await callDeepSeek(messages);
      await saveOrderResult(order.id, reading);
    }

    return NextResponse.json({ bazi, kline: { points: yearPoints, summary }, reading });
  } catch (err) {
    const message = err instanceof Error ? err.message : "解读生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
