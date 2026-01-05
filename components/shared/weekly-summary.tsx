"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function WeeklySummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/weekly/generate", { method: "POST" });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as { summary: string };
        setSummary(data.summary);
      } catch (err) {
        setError("サマリ生成に失敗しました。時間を置いて再試行してください。");
      }
    });
  };

  return (
    <Card className="border-none bg-muted/30 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">週次ふりかえり</h2>
          <p className="text-sm text-muted-foreground">
            直近7日分の完了状況からサマリを作成します。
          </p>
        </div>
        <Button variant="secondary" onClick={handleGenerate} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> 生成
        </Button>
      </div>
      <div className="mt-6 whitespace-pre-wrap text-base">
        {error ?? summary ?? "まだサマリがありません。生成ボタンを押してください。"}
      </div>
    </Card>
  );
}
