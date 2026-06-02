import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDB, api, fmtMoney } from "@/lib/store";
import { PaymentBadge } from "@/components/status-badges";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments — Trademark Guardian" }] }),
  component: Payments,
});

function Payments() {
  const db = useDB();
  const billed = db.cases.reduce((s, c) => s + c.fee, 0);
  const collected = db.cases.reduce((s, c) => s + c.paid, 0);
  const outstanding = billed - collected;
  const client = (id: string) => db.clients.find((c) => c.id === id)?.company ?? "—";

  const markPaid = (id: string, fee: number) =>
    api.updateCase(id, { paid: fee, payment: "Paid" });

  const cards = [
    { label: "Total Billed", value: fmtMoney(billed) },
    { label: "Collected", value: fmtMoney(collected) },
    { label: "Outstanding", value: fmtMoney(outstanding) },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Fees, collections and outstanding balances.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-2xl font-bold">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>App No.</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="w-[160px]">Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {db.cases.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.appNumber}</TableCell>
                <TableCell>{client(c.clientId)}</TableCell>
                <TableCell className="text-right">{fmtMoney(c.fee)}</TableCell>
                <TableCell className="text-right">{fmtMoney(c.paid)}</TableCell>
                <TableCell><Progress value={c.fee ? (c.paid / c.fee) * 100 : 0} /></TableCell>
                <TableCell><PaymentBadge status={c.payment} /></TableCell>
                <TableCell className="text-right">
                  {c.payment !== "Paid" && (
                    <Button size="sm" variant="outline" onClick={() => markPaid(c.id, c.fee)}>
                      Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
