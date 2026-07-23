import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getOrder, saveOrderResult } from "@/lib/order";
import { scoreMbti, MBTI_QUESTIONS, type MbtiAnswer } from "@/lib/mbti";
import { deriveHexagram } from "@/lib/hexagram";
import { buildMbtiPrompt } from "@/lib/prompts";
import { callDeepSeek } from "@/lib/deepseek";

export const dynamic = "force-dynamic";

const schema = z.object({ orderId: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = schema.parse(body);

    const order = await getOrder(orderId);
    if (!order || order.type !== "mbti") {
      return NextResponse.json({ error: "订单不存在" }, { status: 404 });
    }
    if (order.status !== "paid") {
      return NextResponse.json({ error: "订单尚未支付" }, { status: 402 });
    }

    const { answers } = order.payload as { answers: MbtiAnswer[] };
    if (!Array.isArray(answers) || answers.length !== MBTI_QUESTIONS.length) {
      return NextResponse.json({ error: "答题数据不完整" }, { status: 400 });
    }

    const mbti = scoreMbti(answers);
    const hexagram = deriveHexagram(answers);

    let reading = order.result;
    if (!reading) {
      const messages = buildMbtiPrompt(mbti, hexagram);
      reading = await callDeepSeek(messages);
      await saveOrderResult(order.id, reading);
    }

    return NextResponse.json({ mbti, hexagram, reading });
  } catch (err) {
    const message = err instanceof Error ? err.message : "解读生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
