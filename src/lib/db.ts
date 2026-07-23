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

// 简单的串行写队列,避免并发请求同时写文件导致内容损坏。
// 订单量小(单机小型应用),不需要引入真正的数据库。
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

export async function insertOrder(order: OrderRecord): Promise<void> {
  const all = readAll();
  all.push(order);
  await writeAll(all);
}

export async function updateOrderById(
  id: string,
  patch: Partial<OrderRecord>
): Promise<OrderRecord | null> {
  const all = readAll();
  const idx = all.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeAll(all);
  return all[idx];
}

export function findOrderById(id: string): OrderRecord | undefined {
  return readAll().find((o) => o.id === id);
}

export function findOrderByOutTradeNo(outTradeNo: string): OrderRecord | undefined {
  return readAll().find((o) => o.outTradeNo === outTradeNo);
}
