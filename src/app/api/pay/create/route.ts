import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { createOrder, setOrderProvider, type ProductType } from "@/lib/order";
import { createWechatNativeOrder, isWechatConfigured } from "@/lib/payment/wechat";
import { createAlipayQrOrder, isAlipayConfigured } from "@/lib/payment/alipay";

export const dynamic = "force-dynamic";

const schema = z.object({
  type: z.enum([
    "bazi",
    "mbti",
    "tarot",
    "personality",
    "astrology",
    "ziwei",
    "numerology",
    "bigfive",
    "workstyle",
  ]),
  method: z.enum(["wechat", "alipay"]),
  payload: z.unknown(),
});

const PRODUCT_NAME: Record<ProductType, string> = {
  bazi: "AI八字命理解读 + 人生K线",
  mbti: "AI性格解析(MBTI+易经)",
  tarot: "塔罗牌AI解读",
  personality: "MBTI人格测试解读",
  astrology: "占星本命盘AI解读",
  ziwei: "紫微斗数AI命盘解读",
  numerology: "数字命理AI解读",
  bigfive: "大五人格AI深度解读",
  workstyle: "职场性格七维度AI解读",
};

function getBaseUrl(req: NextRequest): string {
  return process.env.APP_BASE_URL || req.nextUrl.origin;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, method, payload } = schema.parse(body);

    const order = await createOrder(type, payload);

    if (order.status === "paid") {
      // 开发直通模式,无需真实支付
      return NextResponse.json({
        orderId: order.id,
        outTradeNo: order.outTradeNo,
        status: order.status,
        amountFen: order.amountFen,
      });
    }

    const notifyUrl = `${getBaseUrl(req)}/api/pay/notify/${method}`;
    let qrTarget: string;

    if (method === "wechat") {
      if (!isWechatConfigured()) {
        return NextResponse.json(
          { error: "微信支付尚未配置,请在 .env 中填写 WECHAT_ 相关参数,或先使用 PAY_DEV_MODE=true 本地调试" },
          { status: 501 }
        );
      }
      qrTarget = await createWechatNativeOrder({
        outTradeNo: order.outTradeNo,
        description: PRODUCT_NAME[type],
        amountFen: order.amountFen,
        notifyUrl,
      });
      await setOrderProvider(order.id, "wechat");
    } else {
      if (!isAlipayConfigured()) {
        return NextResponse.json(
          { error: "支付宝支付尚未配置,请在 .env 中填写 ALIPAY_ 相关参数,或先使用 PAY_DEV_MODE=true 本地调试" },
          { status: 501 }
        );
      }
      qrTarget = await createAlipayQrOrder({
        outTradeNo: order.outTradeNo,
        subject: PRODUCT_NAME[type],
        amountFen: order.amountFen,
        notifyUrl,
      });
      await setOrderProvider(order.id, "alipay");
    }

    const qrDataUrl = await QRCode.toDataURL(qrTarget, { width: 280, margin: 1 });

    return NextResponse.json({
      orderId: order.id,
      outTradeNo: order.outTradeNo,
      status: order.status,
      amountFen: order.amountFen,
      qrDataUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "创建订单失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
