import { randomUUID } from "crypto";
import {
  findOrderById,
  findOrderByOutTradeNo,
  insertOrder,
  updateOrderById,
  type OrderRecord,
} from "./db";

export type ProductType =
  | "bazi"
  | "mbti"
  | "tarot"
  | "personality"
  | "astrology"
  | "ziwei"
  | "numerology"
  | "bigfive"
  | "workstyle";

export function isDevMode(): boolean {
  return process.env.PAY_DEV_MODE === "true";
}

const DEFAULT_PRICE_FEN: Record<ProductType, number> = {
  bazi: 660,
  mbti: 100,
  tarot: 990,
  personality: 500,
  astrology: 500,
  ziwei: 300,
  numerology: 300,
  bigfive: 500,
  workstyle: 500,
};

const PRICE_ENV_KEY: Record<ProductType, string> = {
  bazi: "PRICE_BAZI_FEN",
  mbti: "PRICE_MBTI_FEN",
  tarot: "PRICE_TAROT_FEN",
  personality: "PRICE_PERSONALITY_FEN",
  astrology: "PRICE_ASTROLOGY_FEN",
  ziwei: "PRICE_ZIWEI_FEN",
  numerology: "PRICE_NUMEROLOGY_FEN",
  bigfive: "PRICE_BIGFIVE_FEN",
  workstyle: "PRICE_WORKSTYLE_FEN",
};

export function priceForProduct(type: ProductType): number {
  return Number(process.env[PRICE_ENV_KEY[type]] || DEFAULT_PRICE_FEN[type]);
}

export async function createOrder(
  type: ProductType,
  payload: unknown
): Promise<OrderRecord> {
  const id = randomUUID();
  const outTradeNo = `${type.toUpperCase()}${Date.now()}${Math.floor(
    Math.random() * 10000
  )}`;
  const order: OrderRecord = {
    id,
    type,
    provider: "dev",
    outTradeNo,
    amountFen: priceForProduct(type),
    status: "pending",
    payload,
    result: null,
    createdAt: Date.now(),
    paidAt: null,
  };
  await insertOrder(order);

  if (isDevMode()) {
    // 开发直通模式:未配置真实商户信息时,下单即视为已支付,方便本地调试整条链路。
    return (await updateOrderById(id, {
      status: "paid",
      paidAt: Date.now(),
      provider: "dev",
    })) as OrderRecord;
  }

  return order;
}

export async function getOrder(id: string): Promise<OrderRecord | undefined> {
  return findOrderById(id);
}

export async function markPaidByOutTradeNo(
  outTradeNo: string,
  provider: OrderRecord["provider"]
): Promise<OrderRecord | null> {
  const order = await findOrderByOutTradeNo(outTradeNo);
  if (!order) return null;
  if (order.status === "paid") return order;
  return updateOrderById(order.id, {
    status: "paid",
    paidAt: Date.now(),
    provider,
  });
}

export async function setOrderProvider(
  id: string,
  provider: OrderRecord["provider"]
): Promise<OrderRecord | null> {
  return updateOrderById(id, { provider });
}

export async function saveOrderResult(
  id: string,
  result: string
): Promise<OrderRecord | null> {
  return updateOrderById(id, { result });
}

export type { OrderRecord };
