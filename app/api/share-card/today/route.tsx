import { ImageResponse } from "@vercel/og";
import { format } from "date-fns";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTodayString } from "@/lib/date";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const today = getTodayString();
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  const { data: stats } = await supabase
    .from("stats")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const prompt = task?.prompt ?? "今日のタスクを生成中";
  const category = task?.category ?? "健康";
  const difficulty = task?.difficulty ?? "EASY";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #EDE9FF 0%, #FFFFFF 45%, #E0F2FE 100%)",
          padding: "48px",
          fontFamily: "'Noto Sans JP', sans-serif"
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "48px",
            background: "rgba(255,255,255,0.9)",
            padding: "56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: "28px", fontWeight: 700 }}>今日の1分：習慣ガチャ</div>
            <div style={{ fontSize: "20px", color: "#64748B" }}>{format(new Date(today), "yyyy.MM.dd")}</div>
          </div>
          <div style={{ fontSize: "40px", fontWeight: 700, lineHeight: 1.4 }}>{prompt}</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                background: "#0F172A",
                color: "white",
                fontSize: "18px"
              }}
            >
              {category}
            </div>
            <div
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "2px solid #CBD5F5",
                color: "#334155",
                fontSize: "18px"
              }}
            >
              {difficulty}
            </div>
          </div>
          <div style={{ display: "flex", gap: "32px", fontSize: "22px", color: "#334155" }}>
            <div>XP合計: {stats?.xp ?? 0}</div>
            <div>Streak: {stats?.streak ?? 0}日</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
