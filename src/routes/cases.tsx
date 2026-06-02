import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseTable } from "@/components/case-table";
import { useDB, api, TRADEMARK_PHASES, type CaseType } from "@/lib/store";

export const Route = createFileRoute("/cases")({
  head: () => ({ meta: [{ title: "All Cases — Trademark Guardian" }] }),
  component: Cases,
});

const types: CaseType[] = ["Trademark", "NTN", "Copyright", "Company"];

function Cases() {
  const db = useDB();
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    appNumber: "",
    title: "",
    type: "Trademark" as CaseType,
    clientId: db.clients[0]?.id ?? "",
    agentId: db.agents[0]?.id ?? "",
    class: "",
    fee: "",
    driveUrl: "",
  });

  const filtered = db.cases.filter((c) => {
    const matchesQ = `${c.appNumber} ${c.title}`.toLowerCase().includes(q.toLowerCase());
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    return matchesQ && matchesType;
  });

  const submit = () => {
    if (!form.title || !form.appNumber) return;
    api.addCase({
      ...form,
      fee: Number(form.fee) || 0,
      paid: 0,
      phase: "Filing",
      status: "Pending",
      payment: "Unpaid",
      filedAt: new Date().toISOString().slice(0, 10),
      nextDeadline: "",
    });
    setOpen(false);
    setForm({ ...form, appNumber: "", title: "", class: "", fee: "", driveUrl: "" });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Cases</h1>
          <p className="text-sm text-muted-foreground">{db.cases.length} total cases across all types</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> New Case</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Case</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label>Application Number</Label>
                <Input value={form.appNumber} onChange={(e) => setForm({ ...form, appNumber: e.target.value })} placeholder="TM-2025-00000" />
              </div>
              <div className="grid gap-1.5">
                <Label>Title / Mark</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as CaseType })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Class</Label>
                  <Input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} placeholder="e.g. 30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Client</Label>
                  <Select value={form.clientId} onValueChange={(v) => setForm({ ...form, clientId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{db.clients.map((c) => <SelectItem key={c.id} value={c.id}>{c.company}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Agent</Label>
                  <Select value={form.agentId} onValueChange={(v) => setForm({ ...form, agentId: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{db.agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Fee (Rs)</Label>
                  <Input type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label>Drive Folder URL</Label>
                  <Input value={form.driveUrl} onChange={(e) => setForm({ ...form, driveUrl: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter><Button onClick={submit}>Create Case</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by app number or title..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <CaseTable cases={filtered} />
      <p className="text-xs text-muted-foreground">Phases: {TRADEMARK_PHASES.join(" → ")}</p>
    </div>
  );
}
