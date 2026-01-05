"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HistoryCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState<Task | null>(null);

  useEffect(() => {
    const load = async () => {
      const month = format(currentMonth, "yyyy-MM");
      const res = await fetch(`/api/history?month=${month}`);
      const data = (await res.json()) as { tasks: Task[] };
      setTasks(data.tasks);
    };
    load();
  }, [currentMonth]);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = addDays(monthEnd, 7);

    const rows = [] as Date[][];
    let day = startDate;

    while (day <= endDate) {
      const row = [] as Date[];
      for (let i = 0; i < 7; i += 1) {
        row.push(day);
        day = addDays(day, 1);
      }
      rows.push(row);
    }

    return rows;
  }, [currentMonth]);

  const completedDates = tasks.filter((task) => task.status === "completed");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{format(currentMonth, "yyyy年MM月")}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            aria-label="前の月"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            aria-label="次の月"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Card className="overflow-hidden border-none bg-muted/30 p-4">
        <div className="grid grid-cols-7 gap-2 text-xs text-muted-foreground">
          {["月", "火", "水", "木", "金", "土", "日"].map((label) => (
            <div key={label} className="text-center">
              {label}
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {weeks.map((week, index) => (
            <div key={index} className="grid grid-cols-7 gap-2">
              {week.map((day) => {
                const task = completedDates.find((t) => isSameDay(new Date(t.date), day));
                const isCurrentMonth = isSameMonth(day, currentMonth);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelected(task ?? null)}
                    className={cn(
                      "flex h-10 items-center justify-center rounded-2xl text-sm transition",
                      isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground/40",
                      task
                        ? "bg-primary text-primary-foreground"
                        : "bg-background/80 hover:bg-accent"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
      <Card className="border-none bg-muted/30 p-4">
        <h3 className="text-sm font-semibold text-muted-foreground">選択した日のタスク</h3>
        <p className="mt-2 text-base">
          {selected
            ? `${format(new Date(selected.date), "yyyy/MM/dd")}：${selected.prompt}`
            : "完了した日を選ぶと内容が表示されます"}
        </p>
      </Card>
    </div>
  );
}
