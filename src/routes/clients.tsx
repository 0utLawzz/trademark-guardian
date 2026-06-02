import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, Mail, Phone, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
import { useDB, api } from "@/lib/store";

export const Route = createFileRoute("/clients")({
  head: () => ({ meta: [{ title: "Clients — Trademark Guardian" }] }),
  component: Clients,
});

function Clients() {
  const db = useDB();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", city: "" });

  const filtered = db.clients.filter((c) =>
    `${c.name} ${c.company} ${c.email} ${c.city}`.toLowerCase().includes(q.toLowerCase()),
  );

  const submit = () => {
    if (!form.name || !form.company) return;
    api.addClient(form);
    setForm({ name: "", company: "", email: "", phone: "", city: "" });
    setOpen(false);
  };

  const caseCount = (id: string) => db.cases.filter((c) => c.clientId === id).length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">{db.clients.length} clients on record</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Client</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              {([
                ["name", "Contact Name"],
                ["company", "Company"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["city", "City"],
              ] as const).map(([k, label]) => (
                <div key={k} className="grid gap-1.5">
                  <Label>{label}</Label>
                  <Input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={submit}>Save Client</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search clients..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{c.company}</p>
                  <p className="text-sm text-muted-foreground">{c.name}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {caseCount(c.id)} cases
                </span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {c.email}</p>
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {c.phone}</p>
                <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {c.city}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
