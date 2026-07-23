export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function callDeepSeek(
  messages: ChatMessage[],
  opts: { temperature?: number } = {}
): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      "DEEPSEEK_API_KEY 未配置。请在项目根目录 .env 文件中设置 DEEPSEEK_API_KEY 后重启服务。"
    );
  }
  const baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  const model = process.env.DEEPSEEK_MODEL || "deepseek-chat";

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.85,
      stream: false,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`DeepSeek API 请求失败 (HTTP ${resp.status}): ${text.slice(0, 500)}`);
  }

  const data = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("DeepSeek 返回内容为空,请稍后重试。");
  }
  return content;
}
