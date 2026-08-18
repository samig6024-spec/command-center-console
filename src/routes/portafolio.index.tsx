import { createFileRoute } from "@tanstack/react-router";
import { LayoutGrid, Rows3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Product, Stage } from "@/types";
import { Panel, PanelBody, PanelHeader, Meter } from "@/components/common/Panel";
import { ProductCard } from "@/components/common/ProductCard";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge, healthTone, riskTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@tanstack/react-router";
import { useAsync } from "@/hooks/useAsync";
import { productsService } from "@/services/api";
import { STAGES, currency, number, stageLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/portafolio/")({
  head: () => ({
    meta: [
      { title: "Portafolio de aplicaciones · Command Center" },
      {
        name: "description",
        content:
          "Listado completo de las aplicaciones de la incubadora con fase, salud, ingresos, costos y riesgo.",
      },
      { property: "og:title", content: "Portafolio de aplicaciones · Command Center" },
      {
        property: "og:description",
        content: "Estado, salud y economía de cada aplicación del portafolio.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const state = useAsync<Product[]>(() => productsService.list());
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<Stage | "todas">("todas");
  const [health, setHealth] = useState<string>("todas");
  const [view, setView] = useState<"tarjetas" | "tabla">("tarjetas");

  const filtered = useMemo(() => {
    const list = state.data ?? [];
    return list.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchQuery && (stage === "todas" || p.stage === stage) && (health === "todas" || p.health === health);
    });
  }, [state.data, query, stage, health]);

  const clear = () => {
    setQuery("");
    setStage("todas");
    setHealth("todas");
  };

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Filtros del portafolio"
          description="Busca por nombre o código y filtra por fase y estado de salud."
          icon={<Search className="size-4" />}
          action={
            <div className="flex items-center gap-1 rounded-lg border border-border bg-secondary/50 p-1">
              {(["tarjetas", "tabla"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    view === v ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v === "tarjetas" ? <LayoutGrid className="size-3.5" /> : <Rows3 className="size-3.5" />}
                  {v === "tarjetas" ? "Tarjetas" : "Tabla"}
                </button>
              ))}
            </div>
          }
        />
        <PanelBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aplicación…"
            aria-label="Buscar aplicación"
          />
          <Select value={stage} onValueChange={(v) => setStage(v as Stage | "todas")}>
            <SelectTrigger aria-label="Filtrar por fase">
              <SelectValue placeholder="Fase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las fases</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={health} onValueChange={setHealth}>
            <SelectTrigger aria-label="Filtrar por salud">
              <SelectValue placeholder="Salud" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Cualquier salud</SelectItem>
              <SelectItem value="saludable">Saludable</SelectItem>
              <SelectItem value="atencion">Atención</SelectItem>
              <SelectItem value="riesgo">Riesgo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={clear}>
            Limpiar filtros
          </Button>
        </PanelBody>
      </Panel>

      <AsyncBoundary state={state} loadingRows={4} onRetry={state.reload}>
        {() =>
          filtered.length === 0 ? (
            <Panel>
              <EmptyState
                title="Ninguna aplicación coincide"
                description="Prueba con otro término de búsqueda o restablece los filtros."
                action={
                  <Button variant="outline" size="sm" onClick={clear}>
                    Limpiar filtros
                  </Button>
                }
              />
            </Panel>
          ) : view === "tarjetas" ? (
            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Panel>
              <PanelHeader title={`${filtered.length} aplicaciones`} description="Vista comparativa del portafolio." />
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aplicación</TableHead>
                      <TableHead>Fase</TableHead>
                      <TableHead>Progreso</TableHead>
                      <TableHead className="text-right">Ingresos</TableHead>
                      <TableHead className="text-right">Usuarios</TableHead>
                      <TableHead className="text-right">Costo mensual</TableHead>
                      <TableHead>Salud</TableHead>
                      <TableHead>Riesgo</TableHead>
                      <TableHead className="text-right">Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <p className="font-medium">{p.code}</p>
                          <p className="text-xs text-muted-foreground">{p.name}</p>
                        </TableCell>
                        <TableCell className="text-xs">{stageLabel(p.stage)}</TableCell>
                        <TableCell className="w-40">
                          <Meter value={p.progress} />
                          <span className="mt-1 block text-[11px] tabular-nums text-muted-foreground">
                            {p.progress}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{currency(p.mrr)}</TableCell>
                        <TableCell className="text-right tabular-nums">{number(p.users)}</TableCell>
                        <TableCell className="text-right tabular-nums">{currency(p.monthlyCost)}</TableCell>
                        <TableCell>
                          <StatusBadge tone={healthTone(p.health)}>{p.health}</StatusBadge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge tone={riskTone(p.risk)} dot={false}>
                            {p.risk}
                          </StatusBadge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link to="/portafolio/$productId" params={{ productId: p.id }}>
                              Abrir
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          )
        }
      </AsyncBoundary>
    </div>
  );
}
