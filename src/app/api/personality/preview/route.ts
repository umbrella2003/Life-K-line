import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreMbti, MBTI_QUESTIONS, TYPE_NICKNAMES } from "@/lib/mbti";
import { priceForProduct } from "@/lib/order";

export const dynamic = "force-dynamic";

const schema = z.object({
  answers: z.array(z.enum(["A", "B", "C", "D"])).length(MBTI_QUESTIONS.length),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = schema.parse(body);

    const mbti = scoreMbti(answers);

    return NextResponse.json({
      mbti,
      typeName: TYPE_NICKNAMES[mbti.type] || "",
      priceFen: priceForProduct("personality"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求参数有误";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
