import { NextResponse } from "next/server";
import { endOfMonth, parse, startOfMonth } from "date-fns";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const monthParam = searchParams.get("month") ?? "";
  const parsed = parse(`${monthParam}-01`, "yyyy-MM-dd", new Date());
  const monthDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .gte("date", start.toISOString().slice(0, 10))
    .lte("date", end.toISOString().slice(0, 10))
    .order("date", { ascending: true });

  return NextResponse.json({ tasks: tasks ?? [] });
}
