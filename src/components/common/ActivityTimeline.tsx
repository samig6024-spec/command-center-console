import { Link } from "@tanstack/react-router";
import { Bot, FileText } from "lucide-react";
import type { ActivityItem } from "@/types";
import { StatusBadge, activityTone } from "./StatusBadge";
import { departments } from "@/mock-data/organization";
import { Button } from "@/components/ui/button";

const STATE_LABEL: Record<string, string> = {
  completado: "Completado",
  alerta: "Alerta",
  error: "Error",
  en_curso: "En curso",
};

export function ActivityTimeline({
  items,
  onOpenReport,
}: {
  items: ActivityItem[];
  onOpenReport?: ((item: ActivityItem) => void) | undefined;
}) {
  return (
    <ul className="divide-y divide-border/70">
      {items.map((item) => {
        const dep = departments.find((d) => d.id === item.departmentId);
        return (
          <li key={item.id} className="flex flex-wrap items-start gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/35">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground">
              <Bot className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{item.agent}</span>
                <span className="text-[11px] text-muted-foreground">{dep?.name}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{item.action}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                {item.productId && (
                  <Link
                    to="/portafolio/$productId"
                    params={{ productId: item.productId }}
                    className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 hover:border-primary/40 hover:text-primary"
                  >
                    {item.productId.replace("app-", "App ")}
                  </Link>
                )}
                <span>{item.result}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge tone={activityTone(item.state)}>{STATE_LABEL[item.state]}</StatusBadge>
              <span className="text-xs tabular-nums text-muted-foreground">{item.time}</span>
              {onOpenReport && (
                <Button variant="ghost" size="icon" aria-label="Ver reporte" onClick={() => onOpenReport(item)}>
                  <FileText className="size-4" />
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
