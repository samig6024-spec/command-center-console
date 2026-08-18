import { Link, createFileRoute } from "@tanstack/react-router";
import { Building2, ListChecks, Workflow as WorkflowIcon } from "lucide-react";
import { useState } from "react";
import type { Agent, Department, Task, Workflow } from "@/types";
import { Panel, PanelBody, PanelHeader, Meter } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge, agentStatusTone, taskTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsync } from "@/hooks/useAsync";
import { agentsService, departmentsService, tasksService } from "@/services/api";
import { AGENT_STATUS_LABEL, TASK_STATE_LABEL, currency } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/departamentos")({
  head: () => ({
    meta: [
      { title: "Departamentos operativos · Command Center" },
      {
        name: "description",
        content:
          "Departamentos de la incubadora con sus agentes, tareas abiertas, bloqueos, presupuesto consumido y flujos automatizados.",
      },
      { property: "og:title", content: "Departamentos operativos · Command Center" },
      {
        property: "og:description",
        content: "Estructura operativa: quién hace qué y con qué presupuesto.",
      },
    ],
  }),
  component: Page,
});

const accentBox: Record<string, string> = {
  blue: "border-primary/30 bg-primary/10 text-primary",
  violet: "border-nova/30 bg-nova/10 text-nova",
  green: "border-success/30 bg-success/10 text-success",
  amber: "border-warning/30 bg-warning/10 text-warning",
};

function Page() {
  const departments = useAsync<Department[]>(() => departmentsService.list());
  const agents = useAsync<Agent[]>(() => agentsService.list());
  const tasks = useAsync<Task[]>(() => tasksService.list());
  const workflows = useAsync<Workflow[]>(() => tasksService.workflows());
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <AsyncBoundary state={departments} loadingRows={4} onRetry={departments.reload}>
        {(deps) => (
          <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {deps.map((d) => {
              const used = Math.round((d.budgetUsed / d.budgetTotal) * 100);
              const isActive = active === d.id;
              return (
                <article
                  key={d.id}
                  className={cn(
                    "panel flex flex-col gap-4 p-5 transition-colors",
                    isActive ? "border-primary/50" : "hover:border-primary/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                        accentBox[d.accent],
                      )}
                    >
                      <Building2 className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold">{d.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">{d.objective}</p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Abiertas", value: d.openTasks },
                      { label: "Completadas", value: d.doneTasks },
                      { label: "Bloqueos", value: d.blockers },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg border border-border/70 bg-secondary/40 px-2 py-2">
                        <dt className="text-[11px] text-muted-foreground">{s.label}</dt>
                        <dd className="text-lg font-semibold tabular-nums">{s.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-muted-foreground">Presupuesto consumido</span>
                        <span className="font-medium tabular-nums">
                          {currency(d.budgetUsed)} / {currency(d.budgetTotal)}
                        </span>
                      </div>
                      <Meter value={used} tone={used >= 85 ? "red" : used >= 70 ? "amber" : "blue"} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-muted-foreground">Calidad del trabajo</span>
                        <span className="font-medium tabular-nums">{d.quality}%</span>
                      </div>
                      <Meter value={d.quality} tone="green" className="mt-2" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {d.agents.map((name) => (
                      <span
                        key={name}
                        className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[11px]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
                    <span className="text-[11px] text-muted-foreground">Última actividad: {d.lastActivity}</span>
                    <Button variant="outline" size="sm" onClick={() => setActive(isActive ? null : d.id)}>
                      {isActive ? "Ocultar detalle" : "Ver detalle"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </AsyncBoundary>

      <Tabs defaultValue="tareas">
        <TabsList>
          <TabsTrigger value="tareas">Tareas</TabsTrigger>
          <TabsTrigger value="agentes">Agentes por departamento</TabsTrigger>
          <TabsTrigger value="flujos">Flujos automatizados</TabsTrigger>
        </TabsList>

        <TabsContent value="tareas" className="mt-4">
          <Panel>
            <PanelHeader
              title={active ? "Tareas del departamento seleccionado" : "Tareas de todos los departamentos"}
              description="Estado, responsable y fecha objetivo."
              icon={<ListChecks className="size-4" />}
              action={
                active ? (
                  <Button variant="ghost" size="sm" onClick={() => setActive(null)}>
                    Quitar filtro
                  </Button>
                ) : undefined
              }
            />
            <AsyncBoundary state={tasks} loadingRows={5} onRetry={tasks.reload}>
              {(list) => {
                const visible = active ? list.filter((t) => t.departmentId === active) : list;
                if (visible.length === 0) return <EmptyState title="Sin tareas registradas" />;
                return (
                  <ul className="divide-y divide-border/70">
                    {visible.map((t) => (
                      <li key={t.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{t.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {t.assignee}
                            {t.productId ? ` · ${t.productId.replace("app-", "App ")}` : ""} · vence {t.dueDate}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge tone={t.priority === "alta" ? "red" : t.priority === "media" ? "amber" : "neutral"} dot={false}>
                            {t.priority}
                          </StatusBadge>
                          <StatusBadge tone={taskTone(t.state)}>{TASK_STATE_LABEL[t.state]}</StatusBadge>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              }}
            </AsyncBoundary>
          </Panel>
        </TabsContent>

        <TabsContent value="agentes" className="mt-4">
          <Panel>
            <PanelHeader title="Agentes asignados" description="Equipo automatizado por departamento." />
            <AsyncBoundary state={agents} loadingRows={5} onRetry={agents.reload}>
              {(list) => {
                const visible = active ? list.filter((a) => a.departmentId === active) : list;
                if (visible.length === 0) return <EmptyState title="Sin agentes" />;
                return (
                  <ul className="divide-y divide-border/70">
                    {visible.map((a) => (
                      <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <Link
                            to="/agentes/$agentId"
                            params={{ agentId: a.id }}
                            className="text-sm font-medium hover:text-primary"
                          >
                            {a.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{a.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs tabular-nums text-muted-foreground">
                            {currency(a.accumulatedCost)}
                          </span>
                          <StatusBadge tone={agentStatusTone(a.status)}>{AGENT_STATUS_LABEL[a.status]}</StatusBadge>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              }}
            </AsyncBoundary>
          </Panel>
        </TabsContent>

        <TabsContent value="flujos" className="mt-4">
          <Panel>
            <PanelHeader
              title="Flujos automatizados"
              description="Secuencias que los agentes ejecutan sin intervención."
              icon={<WorkflowIcon className="size-4" />}
            />
            <AsyncBoundary state={workflows} loadingRows={4} onRetry={workflows.reload}>
              {(list) => {
                const visible = active ? list.filter((w) => w.departmentId === active) : list;
                if (visible.length === 0) return <EmptyState title="Sin flujos configurados" />;
                return (
                  <PanelBody className="grid gap-3 lg:grid-cols-2">
                    {visible.map((w) => (
                      <article key={w.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold">{w.name}</h3>
                          <StatusBadge tone={w.active ? "green" : "neutral"}>
                            {w.active ? "Activo" : "Pausado"}
                          </StatusBadge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Disparador: {w.trigger}</p>
                        <ol className="mt-3 space-y-1.5">
                          {w.steps.map((s, i) => (
                            <li key={s} className="flex items-start gap-2 text-xs">
                              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-primary/40 text-[10px] text-primary">
                                {i + 1}
                              </span>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </article>
                    ))}
                  </PanelBody>
                );
              }}
            </AsyncBoundary>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
