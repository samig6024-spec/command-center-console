import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import type { Campaign, ContentPiece } from "@/types";
import { Panel, PanelHeader, PanelBody, Meter } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { distributionService } from "@/services/api";
import { CONTENT_STATES, currency, number } from "@/lib/format";

export const Route = createFileRoute("/distribucion")({
  head: () => ({
    meta: [
      { title: "Centro de distribución · Command Center" },
      {
        name: "description",
        content:
          "Calendario editorial, estado del contenido por canal y rendimiento de las campañas de adquisición.",
      },
      { property: "og:title", content: "Centro de distribución · Command Center" },
      { property: "og:description", content: "Contenido, canales y campañas en una sola vista." },
    ],
  }),
  component: Page,
});

function Page() {
  const content = useAsync<ContentPiece[]>(() => distributionService.content());
  const campaigns = useAsync<Campaign[]>(() => distributionService.campaigns());

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader
          title="Producción de contenido"
          description="Cada pieza avanza de la idea a la publicación."
          icon={<Megaphone className="size-4" />}
        />
        <PanelBody>
          <AsyncBoundary state={content} loadingRows={4} onRetry={content.reload}>
            {(items) => (
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max gap-3">
                  {CONTENT_STATES.map((col) => {
                    const list = items.filter((c) => c.state === col.id);
                    return (
                      <div key={col.id} className="w-60 shrink-0">
                        <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 px-3 py-2">
                          <p className="text-xs font-semibold">{col.label}</p>
                          <span className="text-[11px] tabular-nums text-muted-foreground">{list.length}</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          {list.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-[11px] text-muted-foreground">
                              Sin piezas
                            </p>
                          ) : (
                            list.map((c) => (
                              <article key={c.id} className="rounded-lg border border-border bg-card p-3">
                                <p className="text-sm font-medium">{c.title}</p>
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  {c.channel} · {c.owner} · {c.date}
                                </p>
                                <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
                                  Alcance estimado: {number(c.reach)}
                                </p>
                              </article>
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

      <Panel>
        <PanelHeader title="Campañas" description="Presupuesto, gasto y resultados por campaña." />
        <AsyncBoundary state={campaigns} loadingRows={3} onRetry={campaigns.reload}>
          {(list) =>
            list.length === 0 ? (
              <EmptyState title="Sin campañas registradas" />
            ) : (
              <ul className="divide-y divide-border/70">
                {list.map((c) => {
                  const used = Math.round((c.spent / c.budget) * 100);
                  return (
                    <li key={c.id} className="px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.channel}</p>
                        </div>
                        <StatusBadge
                          tone={c.state === "activa" ? "green" : c.state === "planificada" ? "blue" : "neutral"}
                        >
                          {c.state}
                        </StatusBadge>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <div className="sm:col-span-2">
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="text-muted-foreground">Presupuesto consumido</span>
                            <span className="font-medium tabular-nums">
                              {currency(c.spent)} / {currency(c.budget)}
                            </span>
                          </div>
                          <Meter value={used} tone={used >= 85 ? "amber" : "blue"} className="mt-2" />
                        </div>
                        <div className="text-xs">
                          <p className="text-muted-foreground">Resultados</p>
                          <p className="mt-0.5 font-medium tabular-nums">
                            {number(c.leads)} leads · {c.conversion}% conversión
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )
          }
        </AsyncBoundary>
      </Panel>
    </div>
  );
}
