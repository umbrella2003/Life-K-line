import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrder, saveOrderResult } from "@/lib/order";
import { scoreBigFive, BIGFIVE_QUESTIONS, type BigFiveAnswer } from "@/lib/bigfive";
import { buildBigFivePrompt } from "@/lib/prompts";
import { callDeepSeek } from "@/lib/deepseek";

export const dynamic = "force-dynamic";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = schema.parse(body);

    const order = await getOrder(orderId);
    if (!order || order.type !== "bigfive") {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }
    if (order.status !== "paid") {
      return NextResponse.json({ error: "订单尚未支付" }, { status: 402 });
    }

    const { answers } = order.payload as { answers: BigFiveAnswer[] };
    if (!Array.isArray(answers) || answers.length !== BIGFIVE_QUESTIONS.length) {
      return NextResponse.json({ error: "答题数据不完整" }, { status: 400 });
    }

    const result = scoreBigFive(answers);

    let reading = order.result;
    if (!reading) {
      const messages = buildBigFivePrompt(result);
      reading = await callDeepSeek(messages);
      await saveOrderResult(order.id, reading);
    }

    return NextResponse.json({ result, reading });
  } catch (err) {
    const message = err instanceof Error ? err.message : "解读生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
