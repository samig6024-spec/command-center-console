import { Link } from "@tanstack/react-router";
import { ActivitySquare, ArrowUpRight, CalendarDays, Flag, Leaf, Package, UserRound } from "lucide-react";
import type { Product } from "@/types";
import { Meter } from "./Panel";
import { StatusBadge, healthTone, riskTone } from "./StatusBadge";
import { stageLabel } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const accentMap = {
  blue: { box: "border-primary/30 bg-primary/10 text-primary", meter: "blue" as const, text: "text-primary" },
  violet: { box: "border-nova/30 bg-nova/10 text-nova", meter: "violet" as const, text: "text-nova" },
  green: { box: "border-success/30 bg-success/10 text-success", meter: "green" as const, text: "text-success" },
};

const iconMap = { blue: Package, violet: ActivitySquare, green: Leaf };

export function ProductCard({ product }: { product: Product }) {
  const a = accentMap[product.accent];
  const Icon = iconMap[product.accent];

  return (
    <article className="panel flex flex-col gap-4 p-5 transition-colors hover:border-primary/35">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl border", a.box)}>
            <Icon className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold">{product.code}</h3>
              <StatusBadge tone={a.meter === "violet" ? "violet" : a.meter === "green" ? "green" : "blue"}>
                {stageLabel(product.stage)}
              </StatusBadge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{product.name}</p>
          </div>
        </div>
        <StatusBadge tone={healthTone(product.health)}>
          {product.health === "saludable" ? "Saludable" : product.health === "atencion" ? "Atención" : "Riesgo"}
        </StatusBadge>
      </div>

      <p className="text-sm text-muted-foreground">{product.description}</p>

      <div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className={cn("text-3xl font-semibold tracking-tight tabular-nums", a.text)}>{product.progress}%</p>
            <p className="text-[11px] text-muted-foreground">Progreso general</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Fase actual</p>
            <p className="text-sm font-medium">{stageLabel(product.stage)}</p>
          </div>
        </div>
        <Meter value={product.progress} tone={a.meter} className="mt-3" />
      </div>

      <dl className="grid grid-cols-2 gap-3 border-t border-border/70 pt-4 text-xs">
        <div className="flex items-start gap-2">
          <UserRound className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <dt className="text-muted-foreground">Responsable</dt>
            <dd className="truncate font-medium">{product.owner}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <dt className="text-muted-foreground">Lanzamiento estimado</dt>
            <dd className="truncate font-medium">{product.launchDate}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Flag className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <dt className="text-muted-foreground">Próximo hito</dt>
            <dd className="truncate font-medium">{product.nextMilestone}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ActivitySquare className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <dt className="text-muted-foreground">Riesgo actual</dt>
            <dd className="mt-0.5">
              <StatusBadge tone={riskTone(product.risk)} dot={false}>
                {product.risk}
              </StatusBadge>
            </dd>
          </div>
        </div>
      </dl>

      <div className="grid gap-2 text-xs sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-secondary/40 px-3 py-2">
          <p className="text-muted-foreground">Estado técnico</p>
          <p className="mt-0.5 font-medium">{product.techStatus}</p>
        </div>
        <div className="rounded-lg border border-border/70 bg-secondary/40 px-3 py-2">
          <p className="text-muted-foreground">Estado comercial</p>
          <p className="mt-0.5 font-medium">{product.commercialStatus}</p>
        </div>
      </div>

      <Button asChild variant="outline" className="w-full">
        <Link to="/portafolio/$productId" params={{ productId: product.id }}>
          Ver aplicación <ArrowUpRight className="size-4" />
        </Link>
      </Button>
    </article>
  );
}
