import { createFileRoute } from "@tanstack/react-router";
import { Stamp } from "lucide-react";
import { useMemo, useState } from "react";
import type { Approval } from "@/types";
import { Panel, PanelHeader } from "@/components/common/Panel";
import { ApprovalCard, type ApprovalDecision } from "@/components/common/ApprovalCard";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAsync } from "@/hooks/useAsync";
import { approvalsService } from "@/services/api";

export const Route = createFileRoute("/aprobaciones")({
  head: () => ({
    meta: [
      { title: "Aprobaciones y decisiones · Command Center" },
      {
        name: "description",
        content:
          "Bandeja de decisiones del fundador: propuestas de los agentes con motivo, beneficio, costo, riesgo y evidencia.",
      },
      { property: "og:title", content: "Aprobaciones y decisiones · Command Center" },
      {
        property: "og:description",
        content: "Todo lo que requiere criterio humano, en un solo lugar.",
      },
    ],
  }),
  component: Page,
});

const BUCKETS = [
  { id: "urgente", label: "Urgentes" },
  { id: "hoy", label: "Para hoy" },
  { id: "semana", label: "Esta semana" },
  { id: "informativa", label: "Informativas" },
  { id: "resuelta", label: "Resueltas" },
] as const;

function Page() {
  const state = useAsync<Approval[]>(() => approvalsService.list());
  const [decisions, setDecisions] = useState<Record<string, ApprovalDecision>>({});

  const list = useMemo(
    () => (state.data ?? []).map((a) => (decisions[a.id] ? { ...a, state: decisions[a.id]! } : a)),
    [state.data, decisions],
  );

  return (
    <Tabs defaultValue="urgente" className="space-y-4">
      <TabsList className="flex w-full flex-wrap justify-start">
        {BUCKETS.map((b) => (
          <TabsTrigger key={b.id} value={b.id}>
            {b.label}
            <span className="ml-1.5 text-[11px] tabular-nums text-muted-foreground">
              {list.filter((a) => a.bucket === b.id).length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {BUCKETS.map((b) => (
        <TabsContent key={b.id} value={b.id}>
          <Panel>
            <PanelHeader
              title={b.label}
              description="Cada decisión incluye propuesta, motivo, beneficio esperado, costo, riesgo y evidencia."
              icon={<Stamp className="size-4" />}
            />
            <AsyncBoundary state={state} loadingRows={4} onRetry={state.reload}>
              {() => {
                const visible = list.filter((a) => a.bucket === b.id);
                if (visible.length === 0)
                  return (
                    <EmptyState
                      title="Sin decisiones en esta bandeja"
                      description="Los agentes continúan trabajando dentro de los límites aprobados."
                    />
                  );
                return (
                  <div>
                    {visible.map((a) => (
                      <ApprovalCard
                        key={a.id}
                        approval={a}
                        onDecision={(id, d) => setDecisions((prev) => ({ ...prev, [id]: d }))}
                      />
                    ))}
                  </div>
                );
              }}
            </AsyncBoundary>
          </Panel>
        </TabsContent>
      ))}
    </Tabs>
  );
}
