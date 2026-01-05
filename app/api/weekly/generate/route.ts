import { NextResponse } from "next/server";
import { format, startOfWeek, subDays } from "date-fns";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generateWeeklySummary } from "@/lib/weekly-summary";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const end = new Date();
  const start = subDays(end, 6);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", format(start, "yyyy-MM-dd"))
    .lte("date", format(end, "yyyy-MM-dd"));

  const summary = await generateWeeklySummary(tasks ?? []);
  const weekStart = startOfWeek(end, { weekStartsOn: 1 });

  await supabase.from("weekly_summaries").upsert({
    user_id: user.id,
    week_start: format(weekStart, "yyyy-MM-dd"),
    summary
  });

  return NextResponse.json({ summary });
}
