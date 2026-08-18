import { createFileRoute } from "@tanstack/react-router";
import { CircleDollarSign } from "lucide-react";
import type { Cost } from "@/types";
import { Panel, PanelBody, PanelHeader } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useAsync } from "@/hooks/useAsync";
import { costsService } from "@/services/api";
import { burnSeries } from "@/mock-data/operations";
import { currency } from "@/lib/format";

export const Route = createFileRoute("/finanzas")({
  head: () => ({
    meta: [
      { title: "Finanzas de la incubadora · Command Center" },
      {
        name: "description",
        content: "Ingresos, costos de IA e infraestructura, burn mensual y gasto por aplicación.",
      },
      { property: "og:title", content: "Finanzas de la incubadora · Command Center" },
      { property: "og:description", content: "Economía del portafolio y control de gasto operativo." },
    ],
  }),
  component: Page,
});

const config = {
  ingresos: { label: "Ingresos", color: "var(--primary)" },
  costos: { label: "Costos", color: "var(--nova)" },
};

function Page() {
  const costs = useAsync<Cost[]>(() => costsService.list());

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Ingresos frente a costos"
          description="Serie mensual de datos demo."
          icon={<CircleDollarSign className="size-4" />}
        />
        <PanelBody>
          <ChartContainer config={config} className="h-72 w-full">
            <BarChart data={burnSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} width={44} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ingresos" fill="var(--primary)" radius={4} />
              <Bar dataKey="costos" fill="var(--nova)" radius={4} />
            </BarChart>
          </ChartContainer>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Desglose de costos del mes" description="Por categoría y aplicación." />
        <AsyncBoundary state={costs} loadingRows={4} onRetry={costs.reload}>
          {(list) =>
            list.length === 0 ? (
              <EmptyState title="Sin costos registrados" />
            ) : (
              <ul className="divide-y divide-border/70">
                {list.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="text-sm font-medium">{c.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.productId ? c.productId.replace("app-", "App ") : "Transversal"} · {c.month}
                      </p>
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{currency(c.amount)}</span>
                  </li>
                ))}
              </ul>
            )
          }
        </AsyncBoundary>
      </Panel>
    </div>
  );
}
