"use client";

import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { Check, Loader2, Share2, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Task, Stats } from "@/lib/types";
import { cn } from "@/lib/utils";

type TodayResponse = {
  task: Task;
  stats: Stats | null;
  isNew: boolean;
};

type CompleteResponse = {
  task: Task;
  stats: Stats | null;
};

export function TodayTask() {
  const [data, setData] = useState<TodayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/task/today", { method: "POST" });
        if (!res.ok) throw new Error("タスクの取得に失敗しました");
        const json = (await res.json()) as TodayResponse;
        setData(json);
      } catch (err) {
        setError("読み込みに失敗しました。時間を置いて再試行してください。");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleComplete = () => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/task/complete", { method: "POST" });
        if (!res.ok) throw new Error("完了処理に失敗しました");
        const json = (await res.json()) as CompleteResponse;
        setData((prev) =>
          prev ? { ...prev, task: json.task, stats: json.stats } : prev
        );
      } catch (err) {
        setError("完了処理に失敗しました。もう一度お試しください。");
      }
    });
  };

  const handleShare = async () => {
    const shareUrl = "/api/share-card/today";
    try {
      const res = await fetch(shareUrl);
      const blob = await res.blob();
      const file = new File([blob], "habit-gacha.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "習慣ガチャ",
          text: "今日の1分をシェアします"
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "habit-gacha.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("共有カードの生成に失敗しました。");
    }
  };

  if (loading) {
    return (
      <Card className="border-none bg-muted/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> 今日の1分
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            生成中...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-none bg-muted/40">
        <CardHeader>
          <CardTitle>今日の1分</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => location.reload()}>再読み込み</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { task, stats } = data;
  const completed = task.status === "completed";

  return (
    <Card className="border-none bg-gradient-to-br from-[#F6F4FF] via-white to-[#ECF8FF] shadow-lg dark:from-[#1A1633] dark:via-[#111827] dark:to-[#0F172A]">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{format(new Date(task.date), "yyyy年MM月dd日")}</span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium shadow dark:bg-white/10">
            今日の1分
          </span>
        </div>
        <CardTitle className="text-2xl leading-relaxed">
          {task.prompt}
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{task.category}</Badge>
          <Badge variant="outline">{task.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-white/70 p-4 text-sm shadow-sm dark:bg-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">XP合計</p>
              <p className="text-lg font-semibold">{stats?.xp ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">連続記録</p>
              <p className="text-lg font-semibold">{stats?.streak ?? 0}日</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">最高</p>
              <p className="text-lg font-semibold">{stats?.best_streak ?? 0}日</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <Button
            className={cn("w-full", completed && "pointer-events-none")}
            onClick={handleComplete}
            disabled={completed || isPending}
          >
            {completed ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> 今日の記録は完了！
              </span>
            ) : isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> 完了処理中
              </span>
            ) : (
              "完了！XPをもらう"
            )}
          </Button>
          {completed && (
            <Button variant="secondary" className="w-full" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" /> 共有カードを作成する
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
