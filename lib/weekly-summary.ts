import type { Task } from "@/lib/types";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

const CATEGORY_LABELS: Record<string, string> = {
  健康: "健康",
  仕事: "仕事",
  人間関係: "人間関係",
  お金: "お金",
  掃除: "掃除",
  学習: "学習"
};

export function generateLocalWeeklySummary(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categories = tasks.reduce<Record<string, number>>((acc, task) => {
    acc[task.category] = (acc[task.category] ?? 0) + 1;
    return acc;
  }, {});

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  const focus = topCategory
    ? `今週は「${CATEGORY_LABELS[topCategory[0]]}」に集中できています。`
    : "今週は様々なカテゴリに触れました。";

  const praise =
    completed >= 4
      ? "完了日が多く、習慣化の流れができています。"
      : "完了が少ない日もあるので、次週は1日1分を優先してみましょう。";

  const improvement =
    completed === 0
      ? "まずはEASYを選んで、連続1日を作るのが最優先です。"
      : completed < 4
      ? "完了できた日をメモして、同じ時間帯に取り組むと続きやすいです。"
      : "次週はHARDを1回だけ混ぜて、成長の手応えを作りましょう。";

  return `【良かった点】\n${focus}\n${praise}\n\n【詰まりポイント】\n完了率は${rate}%でした。忙しい日はEASYでOKにする設計が効果的です。\n\n【来週の1つだけ改善提案】\n${improvement}`;
}

export async function generateWeeklySummary(tasks: Task[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return generateLocalWeeklySummary(tasks);

  const compact = tasks.map((task) => ({
    date: task.date,
    category: task.category,
    difficulty: task.difficulty,
    status: task.status
  }));

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
        temperature: 0.6,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "あなたは習慣アプリのコーチです。簡潔で前向きな週次サマリを日本語で返します。"
          },
          {
            role: "user",
            content: `直近7日分のタスク一覧: ${JSON.stringify(compact)}\n以下の形式で出力してください。\n【良かった点】\n...\n\n【詰まりポイント】\n...\n\n【来週の1つだけ改善提案】\n...`
          }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) return generateLocalWeeklySummary(tasks);
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    return content ?? generateLocalWeeklySummary(tasks);
  } catch (error) {
    return generateLocalWeeklySummary(tasks);
  } finally {
    clearTimeout(timeout);
  }
}
