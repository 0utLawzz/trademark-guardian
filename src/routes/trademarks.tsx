import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseTable } from "@/components/case-table";
import { useDB, TRADEMARK_PHASES } from "@/lib/store";

export const Route = createFileRoute("/trademarks")({
  head: () => ({ meta: [{ title: "Trademarks — Trademark Guardian" }] }),
  component: Trademarks,
});

function Trademarks() {
  const db = useDB();
  const tms = db.cases.filter((c) => c.type === "Trademark");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Trademarks</h1>
        <p className="text-sm text-muted-foreground">Track every mark across the registration pipeline.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Pipeline</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {TRADEMARK_PHASES.map((p) => {
              const n = tms.filter((c) => c.phase === p).length;
              return (
                <div key={p} className="rounded-lg border bg-muted/30 p-3 text-center">
                  <p className="text-2xl font-bold text-primary">{n}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{p}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <CaseTable cases={tms} />
    </div>
  );
}
