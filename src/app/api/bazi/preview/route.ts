import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calcBazi } from "@/lib/bazi";
import { buildDailySeries, aggregateDaily, summarizeYearly, toCompactDaily } from "@/lib/kline";
import { priceForProduct } from "@/lib/order";

export const dynamic = "force-dynamic";

const schema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  gender: z.enum(["male", "female"]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = schema.parse(body);

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

    return NextResponse.json({
      bazi,
      daily: toCompactDaily(daily),
      kline: { points: yearPoints, summary },
      priceFen: priceForProduct("bazi"),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "请求参数有误";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
