import { AlipaySdk } from "alipay-sdk";

export function isAlipayConfigured(): boolean {
  return !!(
    process.env.ALIPAY_APP_ID &&
    process.env.ALIPAY_PRIVATE_KEY &&
    process.env.ALIPAY_PUBLIC_KEY
  );
}

let sdkInstance: AlipaySdk | null = null;

function getAlipay(): AlipaySdk {
  if (!isAlipayConfigured()) {
    throw new Error("支付宝支付未配置,请检查 .env 中 ALIPAY_ 相关变量");
  }
  if (!sdkInstance) {
    sdkInstance = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID!,
      privateKey: (process.env.ALIPAY_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      alipayPublicKey: (process.env.ALIPAY_PUBLIC_KEY || "").replace(/\\n/g, "\n"),
      keyType: "PKCS1",
    });
  }
  return sdkInstance;
}

export async function createAlipayQrOrder(params: {
  outTradeNo: string;
  subject: string;
  amountFen: number;
  notifyUrl: string;
}): Promise<string> {
  const alipay = getAlipay();
  const totalAmount = (params.amountFen / 100).toFixed(2);
  // alipay.trade.precreate:统一收单线下交易预创建,返回可供扫码支付的 qr_code
  const result = await alipay.exec("alipay.trade.precreate", {
    bizContent: {
      out_trade_no: params.outTradeNo,
      total_amount: totalAmount,
      subject: params.subject,
    },
    notifyUrl: params.notifyUrl,
  });
  if (result.code !== "10000" || !result.qr_code) {
    throw new Error(`支付宝下单失败: ${result.code} ${result.msg} ${result.sub_msg || ""}`);
  }
  return result.qr_code as string;
}

// 校验支付宝异步通知签名,postData 为 application/x-www-form-urlencoded 解析后的键值对
export function verifyAlipayNotify(postData: Record<string, string>): boolean {
  const alipay = getAlipay();
  return alipay.checkNotifySign(postData);
}
