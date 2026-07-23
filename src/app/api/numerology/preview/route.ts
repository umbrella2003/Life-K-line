import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calcNumerology } from "@/lib/numerology";
import { priceForProduct } from "@/lib/order";

export const dynamic = "force-dynamic";

const schema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  name: z.string().max(80).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = schema.parse(body);

    const result = calcNumerology(input);

    return NextResponse.json({ result, priceFen: priceForProduct("numerology") });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求参数有误";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
