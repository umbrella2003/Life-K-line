import fs from "fs";
import path from "path";

export interface OrderRecord {
  id: string;
  type:
    | "bazi"
    | "mbti"
    | "tarot"
    | "personality"
    | "astrology"
    | "ziwei"
    | "numerology"
    | "bigfive"
    | "workstyle";
  provider: "wechat" | "alipay" | "dev";
  outTradeNo: string;
  amountFen: number;
  status: "pending" | "paid" | "closed";
  payload: unknown;
  result: string | null;
  createdAt: number;
  paidAt: number | null;
}

// 本地文件存储:本地开发/部署到有持久化文件系统的服务器(如自己的云主机)时使用,
// 简单可靠,订单量小的单机小型应用不需要引入真正的数据库。
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "orders.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, "[]", "utf-8");
}

function readAll(): OrderRecord[] {
  ensureFile();
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw) as OrderRecord[];
  } catch {
    return [];
  }
}

let writeQueue: Promise<void> = Promise.resolve();
function writeAll(orders: OrderRecord[]): Promise<void> {
  writeQueue = writeQueue.then(
    () =>
      new Promise<void>((resolve, reject) => {
        fs.writeFile(DB_FILE, JSON.stringify(orders, null, 2), "utf-8", (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
  );
  return writeQueue;
}

const fileBackend = {
  async insert(order: OrderRecord): Promise<void> {
    const all = readAll();
    all.push(order);
    await writeAll(all);
  },
  async updateById(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const all = readAll();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...patch };
    await writeAll(all);
    return all[idx];
  },
  async findById(id: string): Promise<OrderRecord | undefined> {
    return readAll().find((o) => o.id === id);
  },
  async findByOutTradeNo(outTradeNo: string): Promise<OrderRecord | undefined> {
    return readAll().find((o) => o.outTradeNo === outTradeNo);
  },
};

// Vercel KV(或任何兼容 @vercel/kv REST 协议的 Upstash Redis)存储:
// 部署到 Vercel 这类无持久化文件系统的 serverless 平台时使用。
// 只在检测到 KV_REST_API_URL 时才会加载 @vercel/kv,本地开发默认走文件存储,不受影响。
function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

const ORDER_KEY = (id: string) => `order:${id}`;
const OUT_TRADE_NO_KEY = (outTradeNo: string) => `order:outtrade:${outTradeNo}`;

const kvBackend = {
  async insert(order: OrderRecord): Promise<void> {
    const { kv } = await import("@vercel/kv");
    await kv.set(ORDER_KEY(order.id), order);
    await kv.set(OUT_TRADE_NO_KEY(order.outTradeNo), order.id);
  },
  async updateById(id: string, patch: Partial<OrderRecord>): Promise<OrderRecord | null> {
    const { kv } = await import("@vercel/kv");
    const existing = await kv.get<OrderRecord>(ORDER_KEY(id));
    if (!existing) return null;
    const updated = { ...existing, ...patch };
    await kv.set(ORDER_KEY(id), updated);
    return updated;
  },
  async findById(id: string): Promise<OrderRecord | undefined> {
    const { kv } = await import("@vercel/kv");
    const order = await kv.get<OrderRecord>(ORDER_KEY(id));
    return order ?? undefined;
  },
  async findByOutTradeNo(outTradeNo: string): Promise<OrderRecord | undefined> {
    const { kv } = await import("@vercel/kv");
    const id = await kv.get<string>(OUT_TRADE_NO_KEY(outTradeNo));
    if (!id) return undefined;
    const order = await kv.get<OrderRecord>(ORDER_KEY(id));
    return order ?? undefined;
  },
};

function backend() {
  return isKvConfigured() ? kvBackend : fileBackend;
}

export async function insertOrder(order: OrderRecord): Promise<void> {
  return backend().insert(order);
}

export async function updateOrderById(
  id: string,
  patch: Partial<OrderRecord>
): Promise<OrderRecord | null> {
  return backend().updateById(id, patch);
}

export async function findOrderById(id: string): Promise<OrderRecord | undefined> {
  return backend().findById(id);
}

export async function findOrderByOutTradeNo(outTradeNo: string): Promise<OrderRecord | undefined> {
  return backend().findByOutTradeNo(outTradeNo);
}
