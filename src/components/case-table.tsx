import { Link, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDB, api, fmtMoney, TRADEMARK_PHASES, type TrademarkCase, type TrademarkPhase } from "@/lib/store";
import { StatusBadge, PaymentBadge } from "@/components/status-badges";

export function CaseTable({ cases }: { cases: TrademarkCase[] }) {
  const db = useDB();
  const client = (id: string) => db.clients.find((c) => c.id === id)?.company ?? "—";
  const agent = (id: string) => db.agents.find((a) => a.id === id)?.name ?? "—";

  if (!cases.length)
    return <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No cases found.</p>;

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>App No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="text-right">Fee</TableHead>
            <TableHead>Drive</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-mono text-xs">{c.appNumber}</TableCell>
              <TableCell className="font-medium">{c.title}</TableCell>
              <TableCell className="text-muted-foreground">{client(c.clientId)}</TableCell>
              <TableCell className="text-muted-foreground">{agent(c.agentId)}</TableCell>
              <TableCell>
                <Select value={c.phase} onValueChange={(v) => api.updateCase(c.id, { phase: v as TrademarkPhase })}>
                  <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TRADEMARK_PHASES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell><StatusBadge status={c.status} /></TableCell>
              <TableCell><PaymentBadge status={c.payment} /></TableCell>
              <TableCell className="text-right font-medium">{fmtMoney(c.fee)}</TableCell>
              <TableCell>
                {c.driveUrl ? (
                  <a href={c.driveUrl} target="_blank" rel="noreferrer" className="inline-flex text-primary hover:opacity-70">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <Link className="h-4 w-4 text-muted-foreground/40" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
