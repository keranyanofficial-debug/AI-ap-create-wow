import { requireUser } from "@/lib/auth";
import { SiteHeader } from "@/components/shared/site-header";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SettingsPage() {
  await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold">設定</h1>
          <p className="text-muted-foreground">
            習慣ガチャの使い心地を調整します。
          </p>
        </section>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="border-none bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">通知（任意）</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>時間だけ指定して、押し付けない通知にします。デフォルトはOFFです。</p>
              <div className="space-y-2">
                <Label htmlFor="notify">通知時間</Label>
                <Input id="notify" type="time" disabled placeholder="09:00" />
                <p className="text-xs">通知機能は次のフェーズで追加予定です。</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">テーマ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>ライト / ダークを切り替えられます。</p>
              <ThemeToggle />
            </CardContent>
          </Card>
          <Card className="border-none bg-muted/30 md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Google / Appleログイン設定ガイド</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                SupabaseのダッシュボードでAuth → Providersに移動し、
                GoogleまたはAppleを有効化してください。
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>OAuth設定でコールバックURLを登録する</li>
                <li>取得したClient ID/SecretをSupabaseに保存する</li>
                <li>ドメインを本番URLに合わせて更新する</li>
              </ul>
              <p>
                MVPではメールログインが優先なので、追加設定は任意です。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
