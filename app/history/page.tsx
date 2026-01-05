import { requireUser } from "@/lib/auth";
import { SiteHeader } from "@/components/shared/site-header";
import { HistoryCalendar } from "@/components/shared/history-calendar";

export default async function HistoryPage() {
  await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold">履歴</h1>
          <p className="text-muted-foreground">
            完了した日がひと目でわかるカレンダーです。
          </p>
        </section>
        <div className="mt-6">
          <HistoryCalendar />
        </div>
      </main>
    </div>
  );
}
