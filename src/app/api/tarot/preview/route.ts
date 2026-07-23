import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { drawCards, SPREAD_LABELS } from "@/lib/tarot";
import { priceForProduct } from "@/lib/order";

export const dynamic = "force-dynamic";

const schema = z.object({
  spread: z.enum(["single", "three"]),
  question: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { spread, question } = schema.parse(body);

    const cards = drawCards(spread);

    return NextResponse.json({
      cards,
      spread,
      spreadName: SPREAD_LABELS[spread].name,
      question: question || "",
      priceFen: priceForProduct("tarot"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求参数有误";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
