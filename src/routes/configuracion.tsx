import { createFileRoute } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import type { AuditEvent } from "@/types";
import { Panel, PanelBody, PanelHeader, Field } from "@/components/common/Panel";
import { AsyncBoundary, EmptyState } from "@/components/common/States";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAsync } from "@/hooks/useAsync";
import { reportsService } from "@/services/api";
import { useSession } from "@/hooks/useSession";
import { USE_MOCK_DATA, API_BASE_URL } from "@/config/env";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración y auditoría · Command Center" },
      {
        name: "description",
        content: "Rol activo, tema visual, origen de datos de la interfaz y registro de auditoría de acciones.",
      },
      { property: "og:title", content: "Configuración y auditoría · Command Center" },
      { property: "og:description", content: "Ajustes del panel y trazabilidad de las acciones." },
    ],
  }),
  component: Page,
});

function Page() {
  const { user, role, setRole, theme, toggleTheme } = useSession();
  const audit = useAsync<AuditEvent[]>(() => reportsService.audit());

  return (
    <div className="space-y-5">
      <Panel>
        <PanelHeader title="Sesión y preferencias" description="Ajustes locales de la interfaz." icon={<Settings2 className="size-4" />} />
        <PanelBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Usuario activo">
            {user.name} · {user.title}
          </Field>
          <Field label="Asistente asignado">{user.assistant}</Field>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Rol de la sesión</p>
            <div className="flex gap-2">
              <Button variant={role === "ceo" ? "default" : "outline"} size="sm" onClick={() => setRole("ceo")}>
                CEO / Fundador
              </Button>
              <Button
                variant={role === "distribucion" ? "default" : "outline"}
                size="sm"
                onClick={() => setRole("distribucion")}
              >
                Distribución
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Tema visual</p>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              Cambiar a modo {theme === "dark" ? "claro" : "oscuro"}
            </Button>
          </div>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Origen de datos" description="La interfaz está desacoplada de su fuente de datos." />
        <PanelBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Modo actual">
            <StatusBadge tone={USE_MOCK_DATA ? "amber" : "green"}>
              {USE_MOCK_DATA ? "Datos de demostración" : "API conectada"}
            </StatusBadge>
          </Field>
          <Field label="Destino de la API">{API_BASE_URL}</Field>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Registro de auditoría" description="Acciones registradas sobre el sistema." />
        <AsyncBoundary state={audit} loadingRows={4} onRetry={audit.reload}>
          {(list) =>
            list.length === 0 ? (
              <EmptyState title="Sin eventos registrados" />
            ) : (
              <ul className="divide-y divide-border/70">
                {list.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                    <span>
                      <span className="font-medium">{e.actor}</span> — {e.action}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {e.target} · {e.at}
                    </span>
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
