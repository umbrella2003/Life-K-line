import { NextRequest } from "next/server";
import { verifyAlipayNotify } from "@/lib/payment/alipay";
import { markPaidByOutTradeNo } from "@/lib/order";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const postData: Record<string, string> = {};
    formData.forEach((value, key) => {
      postData[key] = String(value);
    });

    const isValid = verifyAlipayNotify(postData);
    if (!isValid) {
      return new Response("failure", { status: 401 });
    }

    if (postData.trade_status === "TRADE_SUCCESS" || postData.trade_status === "TRADE_FINISHED") {
      await markPaidByOutTradeNo(postData.out_trade_no, "alipay");
    }

    // 支付宝要求返回纯文本 success,否则会持续重试通知
    return new Response("success");
  } catch {
    return new Response("failure", { status: 500 });
  }
}
