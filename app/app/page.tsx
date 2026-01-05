import { requireUser } from "@/lib/auth";
import { SiteHeader } from "@/components/shared/site-header";
import { TodayTask } from "@/components/shared/today-task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AppPage() {
  await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold">今日の1分</h1>
          <p className="text-muted-foreground">
            1分で人生がちょっと進むタスクをお届けします。
          </p>
        </section>
        <TodayTask />
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-none bg-muted/40">
            <CardHeader>
              <CardTitle className="text-lg">週次ふりかえり</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              直近7日をまとめて、来週の1つだけ改善提案を出します。
            </CardContent>
          </Card>
          <Card className="border-none bg-muted/40">
            <CardHeader>
              <CardTitle className="text-lg">共有カード</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              その日のタスク・XP・ストリークをまとめたカードを作成できます。
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
