import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getLocalPrompt,
  getRandomCategory,
  getRandomDifficulty
} from "@/lib/task-generator";
import { generateTaskWithOpenAI } from "@/lib/openai";
import { getTodayString } from "@/lib/date";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .maybeSingle();

  const timezone =
    profile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const today = getTodayString(timezone);

  await supabase.from("profiles").upsert({
    id: user.id,
    name: user.email?.split("@")[0] ?? "ユーザー",
    timezone
  });

  const { data: existing } = await supabase
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

  if (existing) {
    return NextResponse.json({ task: existing, stats, isNew: false });
  }

  const category = getRandomCategory();
  const difficulty = getRandomDifficulty();

  const aiPrompt = await generateTaskWithOpenAI(category, difficulty);
  const prompt = aiPrompt ?? getLocalPrompt(category, difficulty);

  const { data: task, error } = await supabase
    .from("tasks")
    .upsert(
      {
        user_id: user.id,
        date: today,
        category,
        difficulty,
        prompt,
        status: "pending"
      },
      { onConflict: "user_id,date" }
    )
    .select("*")
    .single();

  if (error || !task) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  let nextStats = stats;
  if (!stats) {
    const { data: createdStats } = await supabase
      .from("stats")
      .upsert({
        user_id: user.id,
        xp: 0,
        streak: 0,
        best_streak: 0
      })
      .select("*")
      .single();
    nextStats = createdStats ?? null;
  }

  return NextResponse.json({ task, stats: nextStats ?? null, isNew: true });
}
