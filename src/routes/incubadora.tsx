import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, Plus, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Opportunity } from "@/types";
import { Panel, PanelBody, PanelHeader, Field, Meter } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge, riskTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAsync } from "@/hooks/useAsync";
import { incubatorService } from "@/services/api";
import { OPPORTUNITY_STAGES } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/incubadora")({
  head: () => ({
    meta: [
      { title: "Incubadora de ideas · Command Center" },
      {
        name: "description",
        content:
          "Tablero de oportunidades: captura de ideas, investigación de agentes, validación de problema y mercado, y decisión de construcción.",
      },
      { property: "og:title", content: "Incubadora de ideas · Command Center" },
      {
        property: "og:description",
        content: "De la idea capturada a la aplicación aprobada, con evidencia de los agentes.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const state = useAsync<Opportunity[]>(() => incubatorService.opportunities());
  const [selected, setSelected] = useState<Opportunity | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const [idea, setIdea] = useState({ name: "", problem: "", customer: "" });
  const [extra, setExtra] = useState<Opportunity[]>([]);

  const all = useMemo(() => [...extra, ...(state.data ?? [])], [extra, state.data]);

  const submitIdea = () => {
    if (!idea.name.trim() || !idea.problem.trim()) {
      toast.error("Falta información", { description: "Indica al menos el nombre y el problema a resolver." });
      return;
    }
    const created: Opportunity = {
      id: `op-local-${Date.now()}`,
      name: idea.name.trim(),
      stage: "idea_capturada",
      problem: idea.problem.trim(),
      idealCustomer: idea.customer.trim() || "Por definir",
      solution: "Pendiente de investigación por los agentes.",
      competitors: [],
      differentiation: "Pendiente de análisis.",
      market: "Por determinar",
      size: "Por determinar",
      complexity: "media",
      estimatedTime: "Por estimar",
      regulatoryRisk: "bajo",
      monetization: "Por definir",
      evidence: [],
      score: 0,
      recommendation: "Enviar a investigación de mercado.",
    };
    setExtra((e) => [created, ...e]);
    setIdea({ name: "", problem: "", customer: "" });
    setNewOpen(false);
    toast.success("Idea capturada", {
      description: "Registrada en el tablero local de demostración, en la fase Idea capturada.",
    });
  };

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Tablero de oportunidades"
          description="Cada columna representa una fase de maduración. Abre una tarjeta para ver la evidencia recogida por los agentes."
          icon={<Lightbulb className="size-4" />}
          action={
            <Dialog open={newOpen} onOpenChange={setNewOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="size-4" /> Capturar idea
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Capturar nueva idea</DialogTitle>
                  <DialogDescription>
                    La idea entra en la primera fase para que los agentes de inteligencia la investiguen. Se
                    guarda únicamente en el estado local de esta demostración.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="idea-name">Nombre de la idea</Label>
                    <Input
                      id="idea-name"
                      value={idea.name}
                      onChange={(e) => setIdea({ ...idea, name: e.target.value })}
                      placeholder="Ej. Panel de inventario para talleres"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="idea-problem">Problema que resuelve</Label>
                    <Textarea
                      id="idea-problem"
                      value={idea.problem}
                      onChange={(e) => setIdea({ ...idea, problem: e.target.value })}
                      placeholder="Describe el dolor concreto del cliente"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="idea-customer">Cliente ideal</Label>
                    <Input
                      id="idea-customer"
                      value={idea.customer}
                      onChange={(e) => setIdea({ ...idea, customer: e.target.value })}
                      placeholder="Ej. talleres independientes de 3 a 10 empleados"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={submitIdea}>Enviar a investigación</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />
        <PanelBody>
          <AsyncBoundary state={state} loadingRows={4} onRetry={state.reload}>
            {() => (
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max gap-3">
                  {OPPORTUNITY_STAGES.map((col) => {
                    const items = all.filter((o) => o.stage === col.id);
                    return (
                      <div key={col.id} className="w-64 shrink-0">
                        <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
                          <p className="text-xs font-semibold">{col.label}</p>
                          <span className="text-[11px] tabular-nums text-muted-foreground">{items.length}</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          {items.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                              Sin oportunidades
                            </p>
                          ) : (
                            items.map((o) => (
                              <button
                                key={o.id}
                                type="button"
                                onClick={() => setSelected(o)}
                                className="w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary/40"
                              >
                                <p className="text-sm font-medium">{o.name}</p>
                                <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{o.problem}</p>
                                <div className="mt-2 flex items-center justify-between gap-2">
                                  <StatusBadge tone={riskTone(o.regulatoryRisk)} dot={false}>
                                    {o.complexity}
                                  </StatusBadge>
                                  <span
                                    className={cn(
                                      "text-xs font-semibold tabular-nums",
                                      o.score >= 70 ? "text-success" : o.score >= 45 ? "text-warning" : "text-muted-foreground",
                                    )}
                                  >
                                    {o.score}/100
                                  </span>
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </AsyncBoundary>
        </PanelBody>
      </Panel>

      <Sheet open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <SheetHeader className="border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <Target className="size-4 text-primary" />
                  {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.recommendation}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 p-5">
                <div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Puntuación de oportunidad</span>
                    <span className="text-lg font-semibold tabular-nums">{selected.score}/100</span>
                  </div>
                  <Meter
                    value={selected.score}
                    tone={selected.score >= 70 ? "green" : selected.score >= 45 ? "amber" : "red"}
                    className="mt-2"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Problema">{selected.problem}</Field>
                  <Field label="Cliente ideal">{selected.idealCustomer}</Field>
                  <Field label="Solución propuesta">{selected.solution}</Field>
                  <Field label="Diferenciación">{selected.differentiation}</Field>
                  <Field label="Competidores">
                    {selected.competitors.length > 0 ? selected.competitors.join(", ") : "Sin registrar"}
                  </Field>
                  <Field label="Mercado">{selected.market}</Field>
                  <Field label="Tamaño estimado">{selected.size}</Field>
                  <Field label="Complejidad">{selected.complexity}</Field>
                  <Field label="Tiempo estimado">{selected.estimatedTime}</Field>
                  <Field label="Riesgo regulatorio">{selected.regulatoryRisk}</Field>
                  <Field label="Monetización">{selected.monetization}</Field>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Evidencia recogida</p>
                  {selected.evidence.length === 0 ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Sin evidencia todavía; los agentes aún no han investigado esta idea.
                    </p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {selected.evidence.map((e) => (
                        <li
                          key={e}
                          className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs text-muted-foreground"
                        >
                          {e}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {all.length === 0 && !state.loading && (
        <Panel>
          <EmptyState title="Sin oportunidades" description="Captura la primera idea para iniciar el proceso." />
        </Panel>
      )}
    </div>
  );
}
