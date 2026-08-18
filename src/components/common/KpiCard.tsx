import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bot,
  CircleDollarSign,
  Cpu,
  ListChecks,
  LayoutGrid,
  ShieldAlert,
  Stamp,
  Users,
} from "lucide-react";
import type { Metric } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { percent } from "@/lib/format";
import { cn } from "@/lib/utils";

const icons = {
  revenue: CircleDollarSign,
  users: Users,
  apps: LayoutGrid,
  agents: Bot,
  tasks: ListChecks,
  ai: Cpu,
  incident: ShieldAlert,
  approval: Stamp,
} as const;

const accent: Record<string, string> = {
  ok: "text-primary bg-primary/10 border-primary/25",
  warn: "text-warning bg-warning/10 border-warning/25",
  risk: "text-destructive bg-destructive/10 border-destructive/25",
};

export function KpiCard({ metric }: { metric: Metric }) {
  const Icon = icons[metric.icon as keyof typeof icons] ?? CircleDollarSign;
  const up = metric.delta > 0;
  const flat = metric.delta === 0;
  const DeltaIcon = flat ? ArrowRight : up ? ArrowUpRight : ArrowDownRight;
  const deltaGood = metric.state === "ok";

  return (
    <Link
      to={metric.href}
      className="panel group focus-visible:ring-ring flex flex-col gap-3 p-4 transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn("flex size-9 items-center justify-center rounded-lg border", accent[metric.state])}>
          <Icon className="size-4.5" />
        </div>
        <StatusBadge tone={metric.state === "ok" ? "green" : metric.state === "warn" ? "amber" : "red"}>
          {metric.state === "ok" ? "Estable" : metric.state === "warn" ? "Atención" : "Crítico"}
        </StatusBadge>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{metric.label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{metric.value}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 font-medium tabular-nums",
            flat ? "text-muted-foreground" : deltaGood ? "text-success" : "text-warning",
          )}
        >
          <DeltaIcon className="size-3.5" />
          {flat ? "0%" : percent(metric.delta)}
        </span>
        <span className="truncate text-muted-foreground">{metric.period}</span>
        <ArrowRight className="ml-auto size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
