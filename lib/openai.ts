import type { Category, Difficulty } from "@/lib/task-generator";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

export async function generateTaskWithOpenAI(
  category: Category,
  difficulty: Difficulty
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 80,
        messages: [
          {
            role: "system",
            content:
              "あなたは1分で終わる行動タスクを日本語で1つ返すアシスタントです。曖昧表現禁止。"
          },
          {
            role: "user",
            content: `カテゴリ:${category} 難易度:${difficulty} 1分以内で具体的にできるタスクを1つだけ返してください。`
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) return null;
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content ?? null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
