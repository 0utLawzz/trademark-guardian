import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CaseStatus, PaymentStatus, TrademarkPhase } from "@/lib/store";

const statusStyles: Record<CaseStatus, string> = {
  Active: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Pending: "bg-accent/20 text-accent-foreground border-accent/40",
  "On Hold": "bg-muted text-muted-foreground border-border",
  Completed: "bg-primary/10 text-primary border-primary/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const payStyles: Record<PaymentStatus, string> = {
  Paid: "bg-chart-2/15 text-chart-2 border-chart-2/30",
  Partial: "bg-accent/20 text-accent-foreground border-accent/40",
  Unpaid: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: CaseStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", statusStyles[status])}>
      {status}
    </Badge>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", payStyles[status])}>
      {status}
    </Badge>
  );
}

export function PhaseBadge({ phase }: { phase: TrademarkPhase }) {
  return (
    <Badge variant="outline" className="border-primary/20 bg-primary/5 font-medium text-primary">
      {phase}
    </Badge>
  );
}
