import { createFileRoute } from "@tanstack/react-router";
import { BadgeDollarSign } from "lucide-react";
import type { ExitReadiness } from "@/types";
import { Panel, PanelBody, PanelHeader, Meter } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { productsService } from "@/services/api";
import { products } from "@/mock-data/products";

export const Route = createFileRoute("/exit-room")({
  head: () => ({
    meta: [
      { title: "Exit Room · Command Center" },
      {
        name: "description",
        content:
          "Preparación de venta por aplicación: madurez, documentación del data room y puntos pendientes antes de negociar.",
      },
      { property: "og:title", content: "Exit Room · Command Center" },
      { property: "og:description", content: "Qué falta para que una aplicación sea vendible." },
    ],
  }),
  component: Page,
});

function Page() {
  const state = useAsync<ExitReadiness[]>(() => productsService.exitReadiness());

  return (
    <AsyncBoundary state={state} loadingRows={4} onRetry={state.reload}>
      {(list) =>
        list.length === 0 ? (
          <Panel>
            <EmptyState title="Sin aplicaciones evaluadas" />
          </Panel>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {list.map((e) => {
              const product = products.find((p) => p.id === e.productId);
              return (
                <Panel key={e.productId}>
                  <PanelHeader
                    title={product ? `${product.code} · ${product.name}` : e.productId}
                    description="Índice de preparación para la venta."
                    icon={<BadgeDollarSign className="size-4" />}
                    action={
                      <StatusBadge tone={e.score >= 70 ? "green" : e.score >= 45 ? "amber" : "red"}>
                        {e.score}/100
                      </StatusBadge>
                    }
                  />
                  <PanelBody className="space-y-4">
                    {e.items.map((i) => (
                      <div key={i.label}>
                        <div className="flex items-baseline justify-between text-xs">
                          <span className="text-muted-foreground">{i.label}</span>
                          <span className="font-medium tabular-nums">{i.value}%</span>
                        </div>
                        <Meter
                          value={i.value}
                          tone={i.value >= 70 ? "green" : i.value >= 45 ? "amber" : "red"}
                          className="mt-2"
                        />
                        <p className="mt-1 text-[11px] text-muted-foreground">{i.note}</p>
                      </div>
                    ))}
                    <div className="border-t border-border/70 pt-4">
                      <p className="text-xs text-muted-foreground">Data room</p>
                      <ul className="mt-2 space-y-1.5">
                        {e.dataRoom.map((d) => (
                          <li key={d.label} className="flex items-center justify-between gap-2 text-xs">
                            <span>{d.label}</span>
                            <StatusBadge
                              tone={d.state === "listo" ? "green" : d.state === "parcial" ? "amber" : "red"}
                              dot={false}
                            >
                              {d.state}
                            </StatusBadge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </PanelBody>
                </Panel>
              );
            })}
          </div>
        )
      }
    </AsyncBoundary>
  );
}
