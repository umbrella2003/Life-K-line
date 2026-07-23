import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecryptWechatNotify } from "@/lib/payment/wechat";
import { markPaidByOutTradeNo } from "@/lib/order";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("wechatpay-signature") || "";
    const serial = req.headers.get("wechatpay-serial") || "";
    const nonce = req.headers.get("wechatpay-nonce") || "";
    const timestamp = req.headers.get("wechatpay-timestamp") || "";

    const decrypted = await verifyAndDecryptWechatNotify(
      { signature, serial, nonce, timestamp },
      rawBody
    );

    if (!decrypted) {
      return NextResponse.json({ code: "FAIL", message: "签名验证失败" }, { status: 401 });
    }

    if (decrypted.trade_state === "SUCCESS") {
      await markPaidByOutTradeNo(decrypted.out_trade_no, "wechat");
    }

    return NextResponse.json({ code: "SUCCESS", message: "成功" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "处理通知失败";
    return NextResponse.json({ code: "FAIL", message }, { status: 500 });
  }
}
