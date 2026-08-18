import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Bot, CheckCircle2, CircleDot, FileText, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Agent, AgentRun } from "@/types";
import { Panel, PanelBody, PanelHeader, Field } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge, agentStatusTone, riskTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAsync } from "@/hooks/useAsync";
import { agentsService } from "@/services/api";
import { departments } from "@/mock-data/organization";
import { AGENT_STATUS_LABEL, currency } from "@/lib/format";

export const Route = createFileRoute("/agentes/$agentId")({
  head: () => ({
    meta: [
      { title: "Ficha de agente · Command Center" },
      {
        name: "description",
        content:
          "Ficha del agente: capacidades, herramientas, historial de ejecuciones, evidencia y trazabilidad de cada acción.",
      },
      { property: "og:title", content: "Ficha de agente · Command Center" },
      {
        property: "og:description",
        content: "Trazabilidad completa del trabajo ejecutado por un agente de IA.",
      },
    ],
  }),
  component: Page,
});

const stepIcon = { ok: CheckCircle2, error: XCircle, curso: CircleDot };

function Page() {
  const { agentId } = Route.useParams();
  const state = useAsync<Agent | null>(() => agentsService.get(agentId), [agentId]);
  const runsState = useAsync<AgentRun[]>(() => agentsService.runs(agentId), [agentId]);
  const [run, setRun] = useState<AgentRun | null>(null);

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/agentes">
          <ArrowLeft className="size-4" /> Volver a agentes
        </Link>
      </Button>

      <AsyncBoundary
        state={state}
        loadingRows={5}
        onRetry={state.reload}
        empty={
          <Panel>
            <EmptyState
              title="Agente no encontrado"
              description="El identificador solicitado no existe en los datos demo."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/agentes">Ir al directorio</Link>
                </Button>
              }
            />
          </Panel>
        }
      >
        {(agent) => {
          const dept = departments.find((d) => d.id === agent.departmentId);
          return (
            <div className="space-y-5">
              <Panel>
                <div className="flex flex-wrap items-start justify-between gap-4 p-5 lg:p-6">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                      <Bot className="size-6" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight">{agent.name}</h2>
                        <StatusBadge tone={agentStatusTone(agent.status)}>
                          {AGENT_STATUS_LABEL[agent.status]}
                        </StatusBadge>
                        <StatusBadge tone={riskTone(agent.riskLevel)}>Riesgo {agent.riskLevel}</StatusBadge>
                      </div>
                      <p className="mt-1 text-sm font-medium">{agent.role}</p>
                      <p className="text-xs text-muted-foreground">{dept?.name}</p>
                      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{agent.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        toast.info("Ejecución no disponible en la demostración", {
                          description: "La orquestación real de agentes se conectará desde el backend.",
                        })
                      }
                    >
                      Ejecutar ahora
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        toast.info("Pausa no disponible en la demostración", {
                          description: "El control de ejecución se habilitará con el backend.",
                        })
                      }
                    >
                      Pausar agente
                    </Button>
                  </div>
                </div>
              </Panel>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Tarea actual", value: agent.currentTask ?? "Sin tarea" },
                  { label: "Última ejecución", value: agent.lastRun },
                  { label: "Próxima ejecución", value: agent.nextRun },
                  { label: "Costo acumulado", value: currency(agent.accumulatedCost) },
                ].map((k) => (
                  <div key={k.label} className="panel p-4">
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className="mt-1 text-sm font-semibold">{k.value}</p>
                  </div>
                ))}
              </div>

              <Tabs defaultValue="perfil">
                <TabsList>
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="ejecuciones">Ejecuciones</TabsTrigger>
                </TabsList>

                <TabsContent value="perfil" className="mt-4 grid gap-4 xl:grid-cols-2">
                  <Panel>
                    <PanelHeader title="Capacidades y herramientas" icon={<ShieldCheck className="size-4" />} />
                    <PanelBody className="space-y-4">
                      <Field label="Capacidades">{agent.capabilities.join(" · ")}</Field>
                      <Field label="Herramientas con acceso">{agent.tools.join(" · ")}</Field>
                      <Field label="Aplicaciones asignadas">
                        {agent.products.length > 0
                          ? agent.products.map((p) => p.replace("app-", "App ")).join(", ")
                          : "Sin asignaciones"}
                      </Field>
                    </PanelBody>
                  </Panel>
                  <Panel>
                    <PanelHeader title="Aplicaciones relacionadas" />
                    {agent.products.length === 0 ? (
                      <EmptyState title="Sin aplicaciones asignadas" />
                    ) : (
                      <ul className="divide-y divide-border/70">
                        {agent.products.map((p) => (
                          <li key={p} className="px-5 py-3">
                            <Link
                              to="/portafolio/$productId"
                              params={{ productId: p }}
                              className="text-sm font-medium hover:text-primary"
                            >
                              {p.replace("app-", "App ")}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </TabsContent>

                <TabsContent value="ejecuciones" className="mt-4">
                  <Panel>
                    <PanelHeader
                      title="Historial de ejecuciones"
                      description="Abre una ejecución para ver pasos, resultados y evidencia."
                      icon={<FileText className="size-4" />}
                    />
                    <AsyncBoundary state={runsState} loadingRows={4} onRetry={runsState.reload}>
                      {(runs) => (
                        <ul className="divide-y divide-border/70">
                          {runs.map((r) => (
                            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                              <div className="min-w-0">
                                <p className="text-sm font-medium">{r.objective}</p>
                                <p className="text-xs text-muted-foreground">
                                  {r.startedAt} · {r.duration} · {currency(r.cost)} · {r.retries} reintentos
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <StatusBadge
                                  tone={r.status === "completado" ? "green" : r.status === "fallido" ? "red" : "blue"}
                                >
                                  {r.status === "completado"
                                    ? "Completado"
                                    : r.status === "fallido"
                                      ? "Fallido"
                                      : "En curso"}
                                </StatusBadge>
                                <Button variant="ghost" size="sm" onClick={() => setRun(r)}>
                                  Ver detalle
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </AsyncBoundary>
                  </Panel>
                </TabsContent>
              </Tabs>
            </div>
          );
        }}
      </AsyncBoundary>

      <Sheet open={run !== null} onOpenChange={(o) => !o && setRun(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {run && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle>Ejecución {run.id}</SheetTitle>
                <SheetDescription>{run.objective}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Inicio">{run.startedAt}</Field>
                  <Field label="Duración">{run.duration}</Field>
                  <Field label="Costo">{currency(run.cost)}</Field>
                  <Field label="Reintentos">{run.retries}</Field>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Datos de entrada</p>
                  <ul className="mt-2 space-y-1.5">
                    {run.inputs.map((i) => (
                      <li key={i} className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs">
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Pasos ejecutados</p>
                  <ol className="mt-2 space-y-2">
                    {run.steps.map((s) => {
                      const Icon = stepIcon[s.state];
                      return (
                        <li key={s.label} className="flex items-start gap-2 text-xs">
                          <Icon
                            className={
                              s.state === "ok"
                                ? "mt-0.5 size-3.5 shrink-0 text-success"
                                : s.state === "error"
                                  ? "mt-0.5 size-3.5 shrink-0 text-destructive"
                                  : "mt-0.5 size-3.5 shrink-0 text-primary"
                            }
                          />
                          {s.label}
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Resultados</p>
                  <ul className="mt-2 space-y-1.5">
                    {run.outputs.map((o) => (
                      <li key={o} className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Evidencia</p>
                  <ul className="mt-2 space-y-1.5">
                    {run.evidence.map((e) => (
                      <li key={e.ref} className="flex items-center justify-between gap-2 text-xs">
                        <span>{e.label}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{e.ref}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Traza de auditoría</p>
                  <ol className="mt-2 space-y-1.5">
                    {run.audit.map((a) => (
                      <li key={a.at + a.event} className="flex items-start gap-2 text-xs">
                        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{a.at}</span>
                        <span>{a.event}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
