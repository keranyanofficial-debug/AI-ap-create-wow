import { requireUser } from "@/lib/auth";
import { SiteHeader } from "@/components/shared/site-header";
import { WeeklySummary } from "@/components/shared/weekly-summary";

export default async function WeeklyPage() {
  await requireUser();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <section className="space-y-3">
          <h1 className="text-3xl font-semibold">週次ふりかえり</h1>
          <p className="text-muted-foreground">
            良かった点、詰まりポイント、来週の改善提案をまとめます。
          </p>
        </section>
        <div className="mt-6">
          <WeeklySummary />
        </div>
      </main>
    </div>
  );
}
