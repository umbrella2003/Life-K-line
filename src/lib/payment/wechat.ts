import WxPay from "wechatpay-node-v3";

export function isWechatConfigured(): boolean {
  return !!(
    process.env.WECHAT_APPID &&
    process.env.WECHAT_MCHID &&
    process.env.WECHAT_API_V3_KEY &&
    process.env.WECHAT_PRIVATE_KEY &&
    process.env.WECHAT_PUBLIC_CERT
  );
}

function pem(envVal: string | undefined): Buffer {
  return Buffer.from((envVal || "").replace(/\\n/g, "\n"));
}

let payInstance: WxPay | null = null;

function getPay(): WxPay {
  if (!isWechatConfigured()) {
    throw new Error("微信支付未配置,请检查 .env 中 WECHAT_ 相关变量");
  }
  if (!payInstance) {
    payInstance = new WxPay({
      appid: process.env.WECHAT_APPID!,
      mchid: process.env.WECHAT_MCHID!,
      serial_no: process.env.WECHAT_SERIAL_NO,
      publicKey: pem(process.env.WECHAT_PUBLIC_CERT), // 商户证书 apiclient_cert.pem
      privateKey: pem(process.env.WECHAT_PRIVATE_KEY), // 商户私钥 apiclient_key.pem
      key: process.env.WECHAT_API_V3_KEY, // APIv3密钥
    });
  }
  return payInstance;
}

export async function createWechatNativeOrder(params: {
  outTradeNo: string;
  description: string;
  amountFen: number;
  notifyUrl: string;
}): Promise<string> {
  const pay = getPay();
  const result = await pay.transactions_native({
    description: params.description,
    out_trade_no: params.outTradeNo,
    notify_url: params.notifyUrl,
    amount: { total: params.amountFen },
  });
  const codeUrl = result?.data?.code_url;
  if (!result || result.status !== 200 || !codeUrl) {
    throw new Error(
      `微信下单失败: ${JSON.stringify(result?.error || result?.data || result)}`
    );
  }
  return codeUrl as string;
}

export interface WechatNotifyPayload {
  id: string;
  event_type: string;
  resource: {
    ciphertext: string;
    associated_data: string;
    nonce: string;
  };
}

// 验证微信支付异步通知签名并解密,返回 { out_trade_no, trade_state } 等业务字段;签名不合法返回 null
export async function verifyAndDecryptWechatNotify(
  headers: { signature: string; serial: string; nonce: string; timestamp: string },
  rawBody: string
): Promise<{ out_trade_no: string; trade_state: string } | null> {
  const pay = getPay();
  const isValid = await pay.verifySign({
    timestamp: headers.timestamp,
    nonce: headers.nonce,
    body: rawBody,
    serial: headers.serial,
    signature: headers.signature,
  });
  if (!isValid) return null;

  const payload = JSON.parse(rawBody) as WechatNotifyPayload;
  const decrypted = pay.decipher_gcm<{ out_trade_no: string; trade_state: string }>(
    payload.resource.ciphertext,
    payload.resource.associated_data,
    payload.resource.nonce,
    process.env.WECHAT_API_V3_KEY
  );
  return decrypted;
}

export async function queryWechatOrder(outTradeNo: string) {
  const pay = getPay();
  const result = await pay.query({ out_trade_no: outTradeNo });
  return result?.data;
}
