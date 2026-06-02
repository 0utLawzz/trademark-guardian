import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Briefcase } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDB, api } from "@/lib/store";

export const Route = createFileRoute("/agents")({
  head: () => ({ meta: [{ title: "Agents — Trademark Guardian" }] }),
  component: Agents,
});

function Agents() {
  const db = useDB();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  const load = (id: string) => db.cases.filter((c) => c.agentId === id && c.status === "Active").length;

  const submit = () => {
    if (!form.name) return;
    api.addAgent(form);
    setForm({ name: "", email: "", role: "" });
    setOpen(false);
  };

  const initials = (n: string) => n.split(" ").map((p) => p[0]).slice(0, 2).join("");

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agents</h1>
          <p className="text-sm text-muted-foreground">{db.agents.length} team members</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Add Agent</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Agent</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-1.5"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="grid gap-1.5"><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Trademark Agent" /></div>
            </div>
            <DialogFooter><Button onClick={submit}>Save Agent</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {db.agents.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center gap-4 p-5">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">{initials(a.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{a.name}</p>
                <p className="truncate text-sm text-muted-foreground">{a.role}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Briefcase className="h-3 w-3" /> {load(a.id)} active cases
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
