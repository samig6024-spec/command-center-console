import { AlertTriangle, Inbox, RefreshCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "Sin datos para mostrar",
  description = "Ajusta los filtros o vuelve a intentarlo más tarde.",
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground">
        {icon ?? <Inbox className="size-5" />}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ rows = 4, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3 p-5", className)} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex size-11 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold">No se pudo cargar la información</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
          {message ?? "Ocurrió un error al consultar la capa de servicios."}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCcw className="size-3.5" /> Reintentar
        </Button>
      )}
    </div>
  );
}

export function AsyncBoundary<T>({
  state,
  children,
  loadingRows,
  empty,
  onRetry,
}: {
  state: { data: T | null; loading: boolean; error: string | null };
  children: (data: T) => ReactNode;
  loadingRows?: number;
  empty?: ReactNode;
  onRetry?: () => void;
}) {
  if (state.loading) return <LoadingState rows={loadingRows} />;
  if (state.error) return <ErrorState message={state.error} onRetry={onRetry} />;
  if (!state.data || (Array.isArray(state.data) && state.data.length === 0))
    return <>{empty ?? <EmptyState />}</>;
  return <>{children(state.data)}</>;
}
