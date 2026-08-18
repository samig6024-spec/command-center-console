import { AudioLines, Mic, Radio, ShieldAlert } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { StatusBadge } from "./StatusBadge";
import { Meter } from "./Panel";
import { useSession } from "@/hooks/useSession";
import { voiceBriefings, voiceUsage } from "@/mock-data/operations";
import { cn } from "@/lib/utils";

const STATE_LABEL: Record<string, string> = {
  inactivo: "Inactivo",
  escuchando: "Escuchando",
  procesando: "Procesando",
  respondiendo: "Respondiendo",
  error: "Error",
  limite: "Límite de voz próximo",
};

const stateTone = (s: string) =>
  s === "error" ? "red" : s === "limite" ? "amber" : s === "inactivo" ? "neutral" : "blue";

export function VoiceOrb({
  assistant,
  state,
  size = "md",
}: {
  assistant: "ZADAR" | "NOVA";
  state: string;
  size?: "sm" | "md" | "lg";
}) {
  const isNova = assistant === "NOVA";
  const dim = size === "lg" ? "size-28" : size === "sm" ? "size-14" : "size-20";
  const active = state !== "inactivo" && state !== "error";
  return (
    <div className={cn("relative flex items-center justify-center", dim)}>
      <span
        className={cn(
          "absolute inset-0 rounded-full border",
          isNova ? "border-nova/40" : "border-primary/40",
          active && "animate-ping",
        )}
      />
      <span
        className={cn(
          "absolute inset-2 rounded-full",
          isNova ? "bg-nova/12" : "bg-primary/12",
        )}
      />
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          isNova ? "shadow-[0_0_36px_-6px_var(--nova)]" : "shadow-[0_0_36px_-6px_var(--primary)]",
        )}
      />
      <AudioLines className={cn("relative size-1/3", isNova ? "text-nova" : "text-primary")} />
    </div>
  );
}

/** Widget flotante de demostración visual. No hay escucha de voz real. */
export function VoiceAssistantWidget() {
  const { assistant, assistantOpen, closeAssistant, openAssistant, voiceState, setVoiceState, user } = useSession();
  const [log, setLog] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const briefing = voiceBriefings.find((b) => b.assistant === assistant);
  const isNova = assistant === "NOVA";

  const simulate = () => {
    timers.current.forEach(clearTimeout);
    setLog([`Frase de activación reconocida: "Hora del show" (demostración)`]);
    setVoiceState("escuchando");
    timers.current = [
      setTimeout(() => {
        setVoiceState("procesando");
        setLog((l) => [...l, "Preparando resumen con datos demo del panel"]);
      }, 900),
      setTimeout(() => {
        setVoiceState("respondiendo");
        setLog((l) => [...l, briefing?.summary ?? "Resumen no disponible"]);
      }, 1900),
      setTimeout(() => setVoiceState("inactivo"), 4200),
    ];
  };

  return (
    <>
      <Button
        onClick={() => openAssistant()}
        aria-label={`Abrir ${assistant}`}
        className={cn(
          "fixed right-4 bottom-4 z-40 size-12 rounded-full p-0 shadow-glow lg:right-6 lg:bottom-6",
          isNova && "bg-nova text-nova-foreground hover:bg-nova/90",
        )}
      >
        <Mic className="size-5" />
      </Button>

      <Sheet open={assistantOpen} onOpenChange={(o) => (o ? openAssistant() : closeAssistant())}>
        <SheetContent side="right" className="w-full gap-0 overflow-y-auto sm:max-w-md">
          <SheetHeader className="border-b border-border">
            <SheetTitle className="flex items-center gap-2">
              <Radio className={cn("size-4", isNova ? "text-nova" : "text-primary")} />
              {assistant}
              <StatusBadge tone={stateTone(voiceState)}>{STATE_LABEL[voiceState]}</StatusBadge>
            </SheetTitle>
            <SheetDescription>
              {isNova
                ? "Secretaria ejecutiva de distribución: comunidad, campañas, contenido y crecimiento."
                : "Secretario ejecutivo del fundador: portafolio, tecnología, finanzas, estrategia y riesgos."}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-5 p-5">
            <div className="panel flex flex-col items-center gap-3 p-6">
              <VoiceOrb assistant={assistant} state={voiceState} size="lg" />
              <p className={cn("text-lg font-semibold", isNova ? "text-nova" : "text-primary")}>
                “Hora del show”
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Demostración visual del control de voz. No hay escucha permanente ni conexión de audio activa.
              </p>
              <Button
                onClick={simulate}
                className={cn("w-full", isNova && "bg-nova text-nova-foreground hover:bg-nova/90")}
              >
                <Mic className="size-4" /> Simular activación
              </Button>
            </div>

            <div className="panel p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">Créditos de voz del mes</p>
                <StatusBadge tone={voiceUsage.used >= 85 ? "red" : voiceUsage.used >= 75 ? "amber" : "green"}>
                  {voiceUsage.used}%
                </StatusBadge>
              </div>
              <Meter value={voiceUsage.used} tone={voiceUsage.used >= 85 ? "red" : "amber"} className="mt-3" />
              <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                Los créditos no se amplían automáticamente. La decisión corresponde al fundador.
              </p>
            </div>

            <div className="panel p-4">
              <p className="text-sm font-semibold">Último briefing</p>
              {briefing ? (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p className="text-foreground text-sm font-medium">{briefing.title}</p>
                  <p>
                    {briefing.date} · {briefing.duration}
                  </p>
                  <p className="text-foreground/85">{briefing.summary}</p>
                </div>
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">Sin briefings registrados.</p>
              )}
            </div>

            <div className="panel p-4">
              <p className="text-sm font-semibold">Registro de la sesión</p>
              {log.length === 0 ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Sin actividad en esta sesión. Rol activo: {user.title}.
                </p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {log.map((l, i) => (
                    <li key={i} className="rounded-lg border border-border bg-secondary/40 px-3 py-2 text-xs">
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
