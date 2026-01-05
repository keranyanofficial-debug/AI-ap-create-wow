import { NextResponse } from "next/server";
import { subDays, format } from "date-fns";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTodayString } from "@/lib/date";
import { xpForDifficulty } from "@/lib/task-utils";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getTodayString();
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today)
    .maybeSingle();

  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  if (task.status === "completed") {
    const { data: stats } = await supabase
      .from("stats")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    return NextResponse.json({ task, stats });
  }

  const completedAt = new Date().toISOString();
  const { data: updatedTask, error: taskError } = await supabase
    .from("tasks")
    .update({ status: "completed", completed_at: completedAt })
    .eq("id", task.id)
    .select("*")
    .single();

  if (taskError || !updatedTask) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }

  const { data: stats } = await supabase
    .from("stats")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const { data: yesterdayTask } = await supabase
    .from("tasks")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", yesterday)
    .eq("status", "completed")
    .maybeSingle();

  const currentStreak = stats?.streak ?? 0;
  const nextStreak = yesterdayTask ? currentStreak + 1 : 1;
  const xpGain = xpForDifficulty(task.difficulty);
  const nextXp = (stats?.xp ?? 0) + xpGain;
  const bestStreak = Math.max(stats?.best_streak ?? 0, nextStreak);

  const { data: updatedStats } = await supabase
    .from("stats")
    .upsert({
      user_id: user.id,
      xp: nextXp,
      streak: nextStreak,
      best_streak: bestStreak,
      updated_at: new Date().toISOString()
    })
    .select("*")
    .single();

  return NextResponse.json({ task: updatedTask, stats: updatedStats ?? null });
}
