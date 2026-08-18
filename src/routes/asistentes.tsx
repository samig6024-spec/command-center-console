import { createFileRoute } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { Panel, PanelBody, PanelHeader, Meter, Field } from "@/components/common/Panel";
import { StatusBadge } from "@/components/common/StatusBadge";
import { VoiceOrb } from "@/components/common/VoiceAssistant";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { voiceUsage } from "@/mock-data/operations";

export const Route = createFileRoute("/asistentes")({
  head: () => ({
    meta: [
      { title: "Asistentes de voz · Command Center" },
      {
        name: "description",
        content:
          "ZADAR y NOVA: alcance de cada asistente ejecutivo, frase de activación, estados de voz y control de créditos.",
      },
      { property: "og:title", content: "Asistentes de voz · Command Center" },
      { property: "og:description", content: "Control de los asistentes ejecutivos por voz." },
    ],
  }),
  component: Page,
});

const ASSISTANTS = [
  {
    id: "ZADAR" as const,
    title: "Secretario ejecutivo del fundador",
    scope: "Portafolio, tecnología, finanzas, estrategia, riesgos y aprobaciones.",
  },
  {
    id: "NOVA" as const,
    title: "Secretaria ejecutiva de distribución",
    scope: "Contenido, comunidad, campañas, crecimiento y calendario editorial.",
  },
];

function Page() {
  const { voiceState, openAssistant } = useSession();

  return (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-2">
        {ASSISTANTS.map((a) => (
          <Panel key={a.id}>
            <PanelHeader title={a.id} description={a.title} icon={<Radio className="size-4" />} />
            <PanelBody className="space-y-4">
              <div className="flex items-center gap-4">
                <VoiceOrb assistant={a.id} state={voiceState} />
                <div>
                  <p className="text-sm font-medium">Frase de activación</p>
                  <p className="text-lg font-semibold">“Hora del show”</p>
                  <StatusBadge tone="neutral">Demostración visual, sin escucha real</StatusBadge>
                </div>
              </div>
              <Field label="Alcance de decisiones">{a.scope}</Field>
              <Button variant="outline" className="w-full" onClick={() => openAssistant(a.id)}>
                Abrir panel de {a.id}
              </Button>
            </PanelBody>
          </Panel>
        ))}
      </div>

      <Panel>
        <PanelHeader title="Créditos de voz" description="El límite no se amplía sin decisión del fundador." />
        <PanelBody>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-muted-foreground">{voiceUsage.label}</span>
            <span className="font-semibold tabular-nums">
              {voiceUsage.used}% de {voiceUsage.limit}%
            </span>
          </div>
          <Meter value={voiceUsage.used} tone={voiceUsage.used >= 85 ? "red" : "amber"} className="mt-3" />
        </PanelBody>
      </Panel>
    </div>
  );
}
