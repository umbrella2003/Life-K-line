import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrder, saveOrderResult } from "@/lib/order";
import type { DrawnCard } from "@/lib/tarot";
import { SPREAD_LABELS, type Spread } from "@/lib/tarot";
import { buildTarotPrompt } from "@/lib/prompts";
import { callDeepSeek } from "@/lib/deepseek";

export const dynamic = "force-dynamic";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = schema.parse(body);

    const order = await getOrder(orderId);
    if (!order || order.type !== "tarot") {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }
    if (order.status !== "paid") {
      return NextResponse.json({ error: "订单尚未支付" }, { status: 402 });
    }

    const { cards, spread, question } = order.payload as {
      cards: DrawnCard[];
      spread: Spread;
      question?: string;
    };
    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: "抽牌数据不完整" }, { status: 400 });
    }

    let reading = order.result;
    if (!reading) {
      const messages = buildTarotPrompt(cards, SPREAD_LABELS[spread].name, question);
      reading = await callDeepSeek(messages);
      await saveOrderResult(order.id, reading);
    }

    return NextResponse.json({ cards, reading });
  } catch (err) {
    const message = err instanceof Error ? err.message : "解读生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
