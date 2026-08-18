import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import type { Report, VoiceBriefing } from "@/types";
import { Panel, PanelHeader } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { reportsService, voiceBriefingsService } from "@/services/api";

export const Route = createFileRoute("/briefings")({
  head: () => ({
    meta: [
      { title: "Briefings y reportes · Command Center" },
      {
        name: "description",
        content: "Historial de briefings de voz y reportes generados por los agentes de cada departamento.",
      },
      { property: "og:title", content: "Briefings y reportes · Command Center" },
      { property: "og:description", content: "Resúmenes ejecutivos y reportes de los agentes." },
    ],
  }),
  component: Page,
});

function Page() {
  const briefings = useAsync<VoiceBriefing[]>(() => voiceBriefingsService.list());
  const reports = useAsync<Report[]>(() => reportsService.list());

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel>
        <PanelHeader title="Briefings de voz" description="Resúmenes entregados por ZADAR y NOVA." icon={<FileText className="size-4" />} />
        <AsyncBoundary state={briefings} loadingRows={4} onRetry={briefings.reload}>
          {(list) =>
            list.length === 0 ? (
              <EmptyState title="Sin briefings" />
            ) : (
              <ul className="divide-y divide-border/70">
                {list.map((b) => (
                  <li key={b.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{b.title}</p>
                      <StatusBadge tone={b.assistant === "NOVA" ? "violet" : "blue"}>{b.assistant}</StatusBadge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {b.date} · {b.duration} · {b.topics.join(", ")}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{b.summary}</p>
                  </li>
                ))}
              </ul>
            )
          }
        </AsyncBoundary>
      </Panel>

      <Panel>
        <PanelHeader title="Reportes de agentes" description="Documentos generados por departamento." />
        <AsyncBoundary state={reports} loadingRows={4} onRetry={reports.reload}>
          {(list) =>
            list.length === 0 ? (
              <EmptyState title="Sin reportes" />
            ) : (
              <ul className="divide-y divide-border/70">
                {list.map((r) => (
                  <li key={r.id} className="px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium">{r.title}</p>
                      <StatusBadge tone="neutral">{r.type}</StatusBadge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.author} · {r.date}
                    </p>
                    <p className="mt-1.5 text-sm text-muted-foreground">{r.summary}</p>
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
