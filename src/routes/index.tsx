import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Stamp, Users, Wallet, Clock, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useDB, fmtMoney, TRADEMARK_PHASES } from "@/lib/store";
import { StatusBadge, PhaseBadge } from "@/components/status-badges";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Trademark Guardian" },
      { name: "description", content: "Overview of trademark cases, clients, payments and phases." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const db = useDB();
  const totalFees = db.cases.reduce((s, c) => s + c.fee, 0);
  const collected = db.cases.reduce((s, c) => s + c.paid, 0);
  const active = db.cases.filter((c) => c.status === "Active").length;

  const stats = [
    { label: "Total Cases", value: db.cases.length, icon: Stamp },
    { label: "Active Clients", value: db.clients.length, icon: Users },
    { label: "Active Cases", value: active, icon: Clock },
    { label: "Collected", value: fmtMoney(collected), icon: Wallet },
  ];

  const recent = [...db.cases].slice(-5).reverse();
  const clientName = (id: string) => db.clients.find((c) => c.id === id)?.company ?? "—";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back — here's your practice at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{s.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Cases</CardTitle>
            <Link to="/cases" className="flex items-center gap-1 text-sm text-primary hover:underline">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App No.</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-xs">{c.appNumber}</TableCell>
                    <TableCell className="font-medium">{c.title}</TableCell>
                    <TableCell className="text-muted-foreground">{clientName(c.clientId)}</TableCell>
                    <TableCell><PhaseBadge phase={c.phase} /></TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">Collected</span>
                <span className="font-medium">{fmtMoney(collected)}</span>
              </div>
              <Progress value={(collected / totalFees) * 100} />
              <p className="mt-1 text-xs text-muted-foreground">of {fmtMoney(totalFees)} billed</p>
            </div>
            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Cases by Phase</p>
              {TRADEMARK_PHASES.map((p) => {
                const n = db.cases.filter((c) => c.phase === p).length;
                if (!n) return null;
                return (
                  <div key={p} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{p}</span>
                    <span className="font-medium">{n}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
