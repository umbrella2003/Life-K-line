import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreWorkstyle, WORKSTYLE_QUESTIONS } from "@/lib/workstyle";
import { priceForProduct } from "@/lib/order";

export const dynamic = "force-dynamic";

const schema = z.object({
  answers: z.array(z.enum(["A", "B", "C", "D"])).length(WORKSTYLE_QUESTIONS.length),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = schema.parse(body);

    const result = scoreWorkstyle(answers);

    return NextResponse.json({ result, priceFen: priceForProduct("workstyle") });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求参数有误";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
