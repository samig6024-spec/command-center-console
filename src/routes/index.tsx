import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowUpRight, Layers, ListChecks, Stamp } from "lucide-react";
import { useState } from "react";
import type { ActivityItem, Approval, Metric, Product, Stage } from "@/types";
import { KpiCard } from "@/components/common/KpiCard";
import { Panel, PanelHeader, PanelBody } from "@/components/common/Panel";
import { Pipeline } from "@/components/common/Pipeline";
import { ProductCard } from "@/components/common/ProductCard";
import { ActivityTimeline } from "@/components/common/ActivityTimeline";
import { ApprovalCard, type ApprovalDecision } from "@/components/common/ApprovalCard";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { approvalsService, metricsService, productsService } from "@/services/api";
import { stageLabel } from "@/lib/format";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Inicio ejecutivo · Command Center" },
      {
        name: "description",
        content:
          "Vista ejecutiva del estado de la incubadora: métricas clave, pipeline de aplicaciones, actividad de agentes y decisiones pendientes.",
      },
      { property: "og:title", content: "Inicio ejecutivo · Command Center" },
      {
        property: "og:description",
        content: "Estado global de la incubadora en una sola pantalla de mando.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useSession();
  const metrics = useAsync<Metric[]>(() => metricsService.list());
  const products = useAsync<Product[]>(() => productsService.list());
  const activity = useAsync<ActivityItem[]>(() => metricsService.activity());
  const approvals = useAsync<Approval[]>(() => approvalsService.list());
  const [stage, setStage] = useState<Stage | null>(null);
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});

  const decide = (id: string, decision: ApprovalDecision) =>
    setDecisions((d) => ({ ...d, [id]: decision }));

  return (
    <div className="space-y-6">
      <section className="panel relative overflow-hidden p-5 lg:p-6">
        <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.18em] text-muted-foreground uppercase">Centro de mando</p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight lg:text-3xl">
              Buen día, {user.name.split(" ")[0]}
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Resumen operativo de la incubadora. Los agentes trabajan de forma continua y elevan a esta
              pantalla únicamente lo que requiere criterio humano.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="green">Sistemas operativos</StatusBadge>
            <StatusBadge tone="amber">5 decisiones pendientes</StatusBadge>
          </div>
        </div>
      </section>

      <section aria-labelledby="kpis">
        <h2 id="kpis" className="sr-only">
          Indicadores principales
        </h2>
        <AsyncBoundary state={metrics} loadingRows={4} onRetry={metrics.reload}>
          {(data) => (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {data.map((m) => (
                <KpiCard key={m.id} metric={m} />
              ))}
            </div>
          )}
        </AsyncBoundary>
      </section>

      <Panel>
        <PanelHeader
          title="Pipeline de la incubadora"
          description="Nueve fases desde la idea hasta la venta. Selecciona una fase para filtrar las aplicaciones."
          icon={<Layers className="size-4" />}
          action={
            stage ? (
              <Button variant="ghost" size="sm" onClick={() => setStage(null)}>
                Quitar filtro
              </Button>
            ) : undefined
          }
        />
        <PanelBody>
          <AsyncBoundary state={products} loadingRows={2} onRetry={products.reload}>
            {(data) => (
              <>
                <Pipeline
                  products={data}
                  selected={stage}
                  onSelect={(s) => setStage((prev) => (prev === s ? null : s))}
                />
                {stage && (
                  <div className="mt-4 rounded-lg border border-border/70 bg-secondary/40 px-4 py-3 text-sm">
                    <span className="font-medium">{stageLabel(stage)}: </span>
                    {data.filter((p) => p.stage === stage).length === 0 ? (
                      <span className="text-muted-foreground">
                        Ninguna aplicación se encuentra en esta fase actualmente.
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {data
                          .filter((p) => p.stage === stage)
                          .map((p) => `${p.code} · ${p.name}`)
                          .join(" — ")}
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </AsyncBoundary>
        </PanelBody>
      </Panel>

      <section aria-labelledby="apps" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="apps" className="text-lg font-semibold tracking-tight">
            Aplicaciones en curso
          </h2>
          <Button asChild variant="outline" size="sm">
            <Link to="/portafolio">
              Ver portafolio completo <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
        <AsyncBoundary state={products} loadingRows={3} onRetry={products.reload}>
          {(data) => {
            const visible = stage ? data.filter((p) => p.stage === stage) : data;
            if (visible.length === 0)
              return (
                <Panel>
                  <EmptyState
                    title="Sin aplicaciones en esta fase"
                    description="Cambia el filtro del pipeline para ver otras aplicaciones."
                    action={
                      <Button variant="outline" size="sm" onClick={() => setStage(null)}>
                        Ver todas
                      </Button>
                    }
                  />
                </Panel>
              );
            return (
              <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            );
          }}
        </AsyncBoundary>
      </section>

      <div className="grid gap-4 xl:grid-cols-5">
        <Panel className="xl:col-span-3">
          <PanelHeader
            title="Actividad reciente de agentes"
            description="Registro de las últimas ejecuciones automatizadas."
            icon={<ListChecks className="size-4" />}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/agentes">Ver agentes</Link>
              </Button>
            }
          />
          <AsyncBoundary state={activity} loadingRows={5} onRetry={activity.reload}>
            {(data) => <ActivityTimeline items={data.slice(0, 7)} />}
          </AsyncBoundary>
        </Panel>

        <Panel className="xl:col-span-2">
          <PanelHeader
            title="Decisiones que requieren al fundador"
            description="Solo lo que no puede resolver un agente."
            icon={<Stamp className="size-4" />}
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/aprobaciones">Ver todas</Link>
              </Button>
            }
          />
          <AsyncBoundary state={approvals} loadingRows={3} onRetry={approvals.reload}>
            {(data) => {
              const urgent = data.filter((a) => a.bucket === "urgente" || a.bucket === "hoy").slice(0, 3);
              if (urgent.length === 0)
                return (
                  <EmptyState
                    title="Sin decisiones pendientes"
                    description="Los agentes están operando dentro de los límites aprobados."
                    icon={<AlertTriangle className="size-5" />}
                  />
                );
              return (
                <div>
                  {urgent.map((a) => (
                    <ApprovalCard
                      key={a.id}
                      approval={decisions[a.id] ? { ...a, state: decisions[a.id]! } : a}
                      onDecision={decide}
                      compact
                    />
                  ))}
                </div>
              );
            }}
          </AsyncBoundary>
        </Panel>
      </div>
    </div>
  );
}
