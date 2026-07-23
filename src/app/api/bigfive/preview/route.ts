import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreBigFive, BIGFIVE_QUESTIONS } from "@/lib/bigfive";
import { priceForProduct } from "@/lib/order";

export const dynamic = "force-dynamic";

const schema = z.object({
  answers: z.array(z.enum(["A", "B", "C", "D"])).length(BIGFIVE_QUESTIONS.length),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = schema.parse(body);

    const result = scoreBigFive(answers);

    return NextResponse.json({ result, priceFen: priceForProduct("bigfive") });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求参数有误";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
