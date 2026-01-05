"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = { email, password };

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword(payload)
        : await supabase.auth.signUp(payload);

    if (result.error) {
      setMessage(result.error.message);
      setLoading(false);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("確認メールを送信しました。メールのリンクからログインしてください。");
      setLoading(false);
      return;
    }

    router.replace("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F7FF] via-white to-[#EAF6FF] px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-6 w-6" />
          </span>
          習慣ガチャ
        </div>
        <Card className="w-full max-w-md border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">
              {mode === "login" ? "ログイン" : "新規登録"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              {message && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {message}
                </p>
              )}
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録する"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="underline-offset-4 hover:underline"
                >
                  はじめての方はこちら
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="underline-offset-4 hover:underline"
                >
                  すでにアカウントがある方
                </button>
              )}
            </div>
          </CardContent>
        </Card>
        <Link href="/settings" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
          Google/Appleログインの設定方法を見る
        </Link>
      </div>
    </div>
  );
}
