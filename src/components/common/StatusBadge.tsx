import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "blue" | "violet" | "green" | "amber" | "red" | "neutral";

const toneClass: Record<Tone, string> = {
  blue: "bg-primary/12 text-primary border-primary/30",
  violet: "bg-nova/12 text-nova border-nova/30",
  green: "bg-success/12 text-success border-success/30",
  amber: "bg-warning/12 text-warning border-warning/30",
  red: "bg-destructive/12 text-destructive border-destructive/35",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  tone = "neutral",
  children,
  dot = true,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export const healthTone = (h: string): Tone =>
  h === "saludable" ? "green" : h === "atencion" ? "amber" : "red";

export const riskTone = (r: string): Tone => (r === "bajo" ? "green" : r === "medio" ? "amber" : "red");

export const agentStatusTone = (s: string): Tone =>
  s === "disponible"
    ? "green"
    : s === "ejecutando"
      ? "blue"
      : s === "programado"
        ? "neutral"
        : s === "esperando_aprobacion"
          ? "amber"
          : s === "bloqueado"
            ? "amber"
            : "red";

export const taskTone = (s: string): Tone =>
  s === "completada"
    ? "green"
    : s === "en_curso"
      ? "blue"
      : s === "en_revision"
        ? "violet"
        : s === "bloqueada"
          ? "red"
          : "neutral";

export const activityTone = (s: string): Tone =>
  s === "completado" ? "green" : s === "alerta" ? "amber" : s === "error" ? "red" : "blue";
