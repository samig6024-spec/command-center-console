import { AlertTriangle, Check, MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Approval } from "@/types";
import { StatusBadge, riskTone } from "./StatusBadge";
import { Field } from "./Panel";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { currency } from "@/lib/format";
import { departments } from "@/mock-data/organization";
import { products } from "@/mock-data/products";
import { cn } from "@/lib/utils";

export type ApprovalDecision = "aprobada" | "rechazada" | "cambios";

const DECISION_LABEL: Record<ApprovalDecision, string> = {
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  cambios: "Cambios solicitados",
};

export function ApprovalCard({
  approval,
  onDecision,
  compact = false,
}: {
  approval: Approval;
  onDecision: (id: string, decision: ApprovalDecision) => void;
  compact?: boolean;
}) {
  const [pending, setPending] = useState<ApprovalDecision | null>(null);
  const dep = departments.find((d) => d.id === approval.departmentId);
  const product = products.find((p) => p.id === approval.productId);
  const decided = approval.state !== "pendiente";

  const confirm = () => {
    if (!pending) return;
    onDecision(approval.id, pending);
    toast.success(`${DECISION_LABEL[pending]} en el panel`, {
      description: "Registro local de demostración: no se ejecutó ninguna acción externa.",
    });
    setPending(null);
  };

  return (
    <article className={cn("border-b border-border/70 px-5 py-4 last:border-b-0", decided && "opacity-70")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">{approval.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {approval.requestedBy} · {dep?.name}
            {product ? ` · ${product.code}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge tone={riskTone(approval.risk)}>Riesgo {approval.risk}</StatusBadge>
          <span className="text-sm font-semibold tabular-nums">{currency(approval.cost)}</span>
        </div>
      </div>

      {!compact && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Qué se propone">{approval.proposal}</Field>
            <Field label="Por qué">{approval.reason}</Field>
            <Field label="Beneficio esperado">{approval.benefit}</Field>
            <Field label="Puede aprobar">
              {approval.approver === "ceo" ? "CEO / Fundador" : "Directora de distribución"}
            </Field>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {approval.evidence.map((e) => (
              <span
                key={e}
                className="rounded-md border border-border bg-secondary/50 px-2 py-1 text-[11px] text-muted-foreground"
              >
                {e}
              </span>
            ))}
          </div>

          <p className="mt-4 flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/8 px-3 py-2 text-xs">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>
              <span className="font-medium">Recomendación del sistema: </span>
              {approval.recommendation}
            </span>
          </p>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground">Fecha límite: {approval.deadline}</p>
        {decided ? (
          <StatusBadge tone={approval.state === "aprobada" ? "green" : approval.state === "rechazada" ? "red" : "amber"}>
            {DECISION_LABEL[approval.state as ApprovalDecision]}
          </StatusBadge>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setPending("aprobada")}>
              <Check className="size-4" /> Aprobar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPending("cambios")}>
              <MessageSquare className="size-4" /> Solicitar cambios
            </Button>
            <Button size="sm" variant="destructive" onClick={() => setPending("rechazada")}>
              <X className="size-4" /> Rechazar
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={pending !== null} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending === "aprobada"
                ? "Confirmar aprobación"
                : pending === "rechazada"
                  ? "Confirmar rechazo"
                  : "Solicitar cambios"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              “{approval.title}”. Esta decisión se registra únicamente en el estado local de la interfaz de
              demostración; no ejecuta ninguna acción en sistemas externos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </article>
  );
}
