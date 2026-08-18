import { Link, createFileRoute } from "@tanstack/react-router";
import { Bot, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Agent } from "@/types";
import { Panel, PanelBody, PanelHeader } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge, agentStatusTone, riskTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAsync } from "@/hooks/useAsync";
import { agentsService } from "@/services/api";
import { departments } from "@/mock-data/organization";
import { AGENT_STATUS_LABEL, currency } from "@/lib/format";

export const Route = createFileRoute("/agentes/")({
  head: () => ({
    meta: [
      { title: "Agentes de IA · Command Center" },
      {
        name: "description",
        content:
          "Directorio de agentes especializados: función, capacidades, herramientas, estado de ejecución y costo acumulado.",
      },
      { property: "og:title", content: "Agentes de IA · Command Center" },
      {
        property: "og:description",
        content: "Quién ejecuta el trabajo automatizado de la incubadora y en qué estado está.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const state = useAsync<Agent[]>(() => agentsService.list());
  const [query, setQuery] = useState("");
  const [dep, setDep] = useState("todos");
  const [status, setStatus] = useState("todos");

  const filtered = useMemo(() => {
    const list = state.data ?? [];
    const q = query.trim().toLowerCase();
    return list.filter(
      (a) =>
        (!q || a.name.toLowerCase().includes(q) || a.role.toLowerCase().includes(q)) &&
        (dep === "todos" || a.departmentId === dep) &&
        (status === "todos" || a.status === status),
    );
  }, [state.data, query, dep, status]);

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Directorio de agentes"
          description="Cada agente es un especialista con permisos y herramientas propias."
          icon={<Search className="size-4" />}
        />
        <PanelBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar agente…"
            aria-label="Buscar agente"
          />
          <Select value={dep} onValueChange={setDep}>
            <SelectTrigger aria-label="Filtrar por departamento">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los departamentos</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filtrar por estado">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Cualquier estado</SelectItem>
              {Object.entries(AGENT_STATUS_LABEL).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => {
              setQuery("");
              setDep("todos");
              setStatus("todos");
            }}
          >
            Limpiar filtros
          </Button>
        </PanelBody>
      </Panel>

      <AsyncBoundary state={state} loadingRows={5} onRetry={state.reload}>
        {() =>
          filtered.length === 0 ? (
            <Panel>
              <EmptyState title="Ningún agente coincide" description="Ajusta los filtros para ver más resultados." />
            </Panel>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((a) => {
                const dept = departments.find((d) => d.id === a.departmentId);
                return (
                  <article key={a.id} className="panel flex flex-col gap-4 p-5 transition-colors hover:border-primary/35">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                          <Bot className="size-5" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold">{a.name}</h3>
                          <p className="text-xs text-muted-foreground">{a.role}</p>
                          <p className="text-[11px] text-muted-foreground">{dept?.name}</p>
                        </div>
                      </div>
                      <StatusBadge tone={agentStatusTone(a.status)}>{AGENT_STATUS_LABEL[a.status]}</StatusBadge>
                    </div>

                    <p className="text-sm text-muted-foreground">{a.description}</p>

                    <div className="rounded-lg border border-border/70 bg-secondary/40 px-3 py-2 text-xs">
                      <p className="text-muted-foreground">Tarea actual</p>
                      <p className="mt-0.5 font-medium">{a.currentTask ?? "Sin tarea asignada"}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {a.capabilities.slice(0, 4).map((c) => (
                        <span key={c} className="rounded-md border border-border bg-secondary/50 px-2 py-0.5 text-[11px]">
                          {c}
                        </span>
                      ))}
                    </div>

                    <dl className="grid grid-cols-2 gap-3 border-t border-border/70 pt-3 text-xs">
                      <div>
                        <dt className="text-muted-foreground">Última ejecución</dt>
                        <dd className="font-medium">{a.lastRun}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Próxima ejecución</dt>
                        <dd className="font-medium">{a.nextRun}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Costo acumulado</dt>
                        <dd className="font-medium tabular-nums">{currency(a.accumulatedCost)}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Nivel de riesgo</dt>
                        <dd className="mt-0.5">
                          <StatusBadge tone={riskTone(a.riskLevel)} dot={false}>
                            {a.riskLevel}
                          </StatusBadge>
                        </dd>
                      </div>
                    </dl>

                    <Button asChild variant="outline" className="w-full">
                      <Link to="/agentes/$agentId" params={{ agentId: a.id }}>
                        Ver ficha del agente
                      </Link>
                    </Button>
                  </article>
                );
              })}
            </div>
          )
        }
      </AsyncBoundary>
    </div>
  );
}
