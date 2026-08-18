import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  FileText,
  History,
  Megaphone,
  PieChart,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { Agent, Product } from "@/types";
import { Panel, PanelBody, PanelHeader, Meter, Field } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge, agentStatusTone, healthTone, riskTone } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAsync } from "@/hooks/useAsync";
import { agentsService, productsService } from "@/services/api";
import { AGENT_STATUS_LABEL, currency, number, percent, stageLabel } from "@/lib/format";

export const Route = createFileRoute("/portafolio/$productId")({
  head: () => ({
    meta: [
      { title: "Detalle de aplicación · Command Center" },
      {
        name: "description",
        content:
          "Ficha completa de la aplicación: mercado, tecnología, diseño, distribución, finanzas, riesgos y documentos.",
      },
      { property: "og:title", content: "Detalle de aplicación · Command Center" },
      {
        property: "og:description",
        content: "Estado técnico, comercial y financiero de una aplicación del portafolio.",
      },
    ],
  }),
  component: Page,
});

const chartConfig = {
  usuarios: { label: "Usuarios", color: "var(--primary)" },
  ingresos: { label: "Ingresos", color: "var(--nova)" },
};

function Page() {
  const { productId } = Route.useParams();
  const state = useAsync<Product | null>(() => productsService.get(productId), [productId]);
  const agentsState = useAsync<Agent[]>(() => agentsService.list());

  return (
    <div className="space-y-5">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/portafolio">
          <ArrowLeft className="size-4" /> Volver al portafolio
        </Link>
      </Button>

      <AsyncBoundary
        state={state}
        loadingRows={6}
        onRetry={state.reload}
        empty={
          <Panel>
            <EmptyState
              title="Aplicación no encontrada"
              description="El identificador solicitado no existe en los datos demo."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link to="/portafolio">Ir al portafolio</Link>
                </Button>
              }
            />
          </Panel>
        }
      >
        {(product) => {
          const relatedAgents = (agentsState.data ?? []).filter((a) => a.products.includes(product.id));
          return (
            <div className="space-y-5">
              <Panel className="relative overflow-hidden">
                <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-50" aria-hidden />
                <div className="relative flex flex-wrap items-start justify-between gap-4 p-5 lg:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold tracking-tight">{product.code}</h2>
                      <StatusBadge tone="blue">{stageLabel(product.stage)}</StatusBadge>
                      <StatusBadge tone={healthTone(product.health)}>{product.health}</StatusBadge>
                      <StatusBadge tone={riskTone(product.risk)}>Riesgo {product.risk}</StatusBadge>
                    </div>
                    <p className="mt-1.5 text-sm font-medium">{product.name}</p>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
                      <span>
                        Responsable: <span className="text-foreground">{product.owner}</span> ({product.ownerRole})
                      </span>
                      <span>
                        Mercado: <span className="text-foreground">{product.country}</span>
                      </span>
                      <span>
                        Modelo: <span className="text-foreground">{product.businessModel}</span>
                      </span>
                      <span>
                        Lanzamiento: <span className="text-foreground">{product.launchDate}</span>
                      </span>
                    </div>
                  </div>
                  <div className="w-full max-w-xs space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">Progreso general</span>
                        <span className="text-2xl font-semibold tabular-nums">{product.progress}%</span>
                      </div>
                      <Meter value={product.progress} className="mt-2" />
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">Índice de salud</span>
                        <span className="text-sm font-semibold tabular-nums">{product.healthScore}/100</span>
                      </div>
                      <Meter
                        value={product.healthScore}
                        tone={product.healthScore >= 75 ? "green" : product.healthScore >= 55 ? "amber" : "red"}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Ingresos mensuales", value: currency(product.mrr) },
                  { label: "Usuarios", value: number(product.users) },
                  { label: "Costo mensual", value: currency(product.monthlyCost) },
                  { label: "Margen", value: percent(product.finance.margin) },
                ].map((k) => (
                  <div key={k.label} className="panel p-4">
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums">{k.value}</p>
                  </div>
                ))}
              </div>

              <Tabs defaultValue="resumen">
                <TabsList className="flex w-full flex-wrap justify-start">
                  <TabsTrigger value="resumen">Resumen</TabsTrigger>
                  <TabsTrigger value="mercado">Mercado</TabsTrigger>
                  <TabsTrigger value="tecnologia">Tecnología</TabsTrigger>
                  <TabsTrigger value="distribucion">Distribución</TabsTrigger>
                  <TabsTrigger value="finanzas">Finanzas</TabsTrigger>
                  <TabsTrigger value="riesgos">Riesgos</TabsTrigger>
                  <TabsTrigger value="documentos">Documentos</TabsTrigger>
                  <TabsTrigger value="historial">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="mt-4 space-y-4">
                  <div className="grid gap-4 xl:grid-cols-2">
                    <Panel>
                      <PanelHeader
                        title="Evolución de usuarios e ingresos"
                        description="Serie mensual de datos demo."
                        icon={<BarChart3 className="size-4" />}
                      />
                      <PanelBody>
                        <ChartContainer config={chartConfig} className="h-64 w-full">
                          <AreaChart data={product.metricsSeries}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
                            <YAxis tickLine={false} axisLine={false} fontSize={11} width={40} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                              type="monotone"
                              dataKey="usuarios"
                              stroke="var(--primary)"
                              fill="var(--primary)"
                              fillOpacity={0.15}
                              strokeWidth={2}
                            />
                            <Area
                              type="monotone"
                              dataKey="ingresos"
                              stroke="var(--nova)"
                              fill="var(--nova)"
                              fillOpacity={0.12}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ChartContainer>
                      </PanelBody>
                    </Panel>

                    <Panel>
                      <PanelHeader
                        title="Agentes asignados"
                        description="Equipo automatizado responsable de esta aplicación."
                        icon={<Bot className="size-4" />}
                      />
                      {relatedAgents.length === 0 ? (
                        <EmptyState
                          title="Sin agentes asignados"
                          description="Aún no hay agentes vinculados a esta aplicación."
                        />
                      ) : (
                        <ul className="divide-y divide-border/70">
                          {relatedAgents.map((a) => (
                            <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
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
                              <StatusBadge tone={agentStatusTone(a.status)}>
                                {AGENT_STATUS_LABEL[a.status]}
                              </StatusBadge>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Panel>
                  </div>

                  <Panel>
                    <PanelHeader title="Estado operativo" icon={<Sparkles className="size-4" />} />
                    <PanelBody className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      <Field label="Estado técnico">{product.techStatus}</Field>
                      <Field label="Estado comercial">{product.commercialStatus}</Field>
                      <Field label="Próximo hito">{product.nextMilestone}</Field>
                      <Field label="Preparada para venta">{product.exitReady ? "Sí" : "Todavía no"}</Field>
                    </PanelBody>
                  </Panel>
                </TabsContent>

                <TabsContent value="mercado" className="mt-4">
                  <Panel>
                    <PanelHeader title="Mercado y competencia" icon={<PieChart className="size-4" />} />
                    <PanelBody className="grid gap-4 sm:grid-cols-2">
                      <Field label="Mercado total (TAM)">{product.market.tam}</Field>
                      <Field label="Mercado alcanzable (SAM)">{product.market.sam}</Field>
                      <Field label="Competidores">{product.market.competitors.join(", ")}</Field>
                      <Field label="Diferenciación">{product.market.differentiation}</Field>
                    </PanelBody>
                  </Panel>
                </TabsContent>

                <TabsContent value="tecnologia" className="mt-4 grid gap-4 xl:grid-cols-2">
                  <Panel>
                    <PanelHeader title="Tecnología" icon={<Wrench className="size-4" />} />
                    <PanelBody className="space-y-4">
                      <Field label="Stack">{product.tech.stack.join(" · ")}</Field>
                      <div>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-muted-foreground">Cobertura de pruebas</span>
                          <span className="font-semibold tabular-nums">{product.tech.coverage}%</span>
                        </div>
                        <Meter value={product.tech.coverage} className="mt-2" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Disponibilidad">{product.tech.uptime}%</Field>
                        <Field label="Incidencias abiertas">{product.tech.openIssues}</Field>
                      </div>
                    </PanelBody>
                  </Panel>
                  <Panel>
                    <PanelHeader title="Diseño" icon={<Sparkles className="size-4" />} />
                    <PanelBody className="grid gap-4 sm:grid-cols-2">
                      <Field label="Sistema de diseño">{product.design.system}</Field>
                      <Field label="Pantallas terminadas">{product.design.screens}</Field>
                      <Field label="Pantallas pendientes">{product.design.pending}</Field>
                    </PanelBody>
                  </Panel>
                </TabsContent>

                <TabsContent value="distribucion" className="mt-4">
                  <Panel>
                    <PanelHeader title="Distribución" icon={<Megaphone className="size-4" />} />
                    <PanelBody className="grid gap-4 sm:grid-cols-3">
                      <Field label="Canales">{product.distribution.channels.join(", ")}</Field>
                      <Field label="Lista de espera">{number(product.distribution.waitlist)}</Field>
                      <Field label="Piezas de contenido">{product.distribution.contentPieces}</Field>
                    </PanelBody>
                  </Panel>
                </TabsContent>

                <TabsContent value="finanzas" className="mt-4">
                  <Panel>
                    <PanelHeader title="Finanzas de la aplicación" icon={<BarChart3 className="size-4" />} />
                    <PanelBody className="grid gap-4 sm:grid-cols-3">
                      <Field label="Ingresos acumulados">{currency(product.finance.revenue)}</Field>
                      <Field label="Costos acumulados">{currency(product.finance.costs)}</Field>
                      <Field label="Margen">{percent(product.finance.margin)}</Field>
                    </PanelBody>
                  </Panel>
                </TabsContent>

                <TabsContent value="riesgos" className="mt-4">
                  <Panel>
                    <PanelHeader title="Riesgos y mitigaciones" icon={<ShieldAlert className="size-4" />} />
                    {product.risks.length === 0 ? (
                      <EmptyState title="Sin riesgos registrados" />
                    ) : (
                      <ul className="divide-y divide-border/70">
                        {product.risks.map((r) => (
                          <li key={r.id} className="px-5 py-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium">{r.label}</p>
                              <StatusBadge tone={riskTone(r.level)}>{r.level}</StatusBadge>
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Mitigación: {r.mitigation}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </TabsContent>

                <TabsContent value="documentos" className="mt-4">
                  <Panel>
                    <PanelHeader title="Documentos" icon={<FileText className="size-4" />} />
                    {product.documents.length === 0 ? (
                      <EmptyState title="Sin documentos" />
                    ) : (
                      <ul className="divide-y divide-border/70">
                        {product.documents.map((d) => (
                          <li key={d.id} className="flex items-center justify-between gap-3 px-5 py-3">
                            <div className="flex items-center gap-3">
                              <FileText className="size-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{d.name}</p>
                                <p className="text-xs text-muted-foreground">{d.type}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{d.updatedAt}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Panel>
                </TabsContent>

                <TabsContent value="historial" className="mt-4">
                  <Panel>
                    <PanelHeader title="Historial de decisiones" icon={<History className="size-4" />} />
                    {product.history.length === 0 ? (
                      <EmptyState title="Sin historial" />
                    ) : (
                      <ol className="divide-y divide-border/70">
                        {product.history.map((h) => (
                          <li key={h.id} className="px-5 py-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm">{h.label}</p>
                              <span className="text-xs text-muted-foreground">{h.date}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Registrado por {h.author}</p>
                          </li>
                        ))}
                      </ol>
                    )}
                  </Panel>
                </TabsContent>
              </Tabs>
            </div>
          );
        }}
      </AsyncBoundary>
    </div>
  );
}
