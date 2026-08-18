export const currency = (v: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

export const currency2 = (v: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

export const number = (v: number) => new Intl.NumberFormat("es-ES").format(v);

export const percent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

export const dateTimeLong = (d: Date) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(d);

export const timeShort = (d: Date) =>
  new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(d);

export const STAGES = [
  { id: "idea", label: "Idea" },
  { id: "inteligencia", label: "Inteligencia" },
  { id: "validacion", label: "Validación" },
  { id: "diseno", label: "Diseño" },
  { id: "desarrollo", label: "Desarrollo" },
  { id: "qa", label: "QA" },
  { id: "lanzamiento", label: "Lanzamiento" },
  { id: "crecimiento", label: "Crecimiento" },
  { id: "venta", label: "Venta" },
] as const;

export const stageLabel = (id: string) => STAGES.find((s) => s.id === id)?.label ?? id;

export const AGENT_STATUS_LABEL: Record<string, string> = {
  disponible: "Disponible",
  programado: "Programado",
  ejecutando: "Ejecutando",
  esperando_aprobacion: "Esperando aprobación",
  bloqueado: "Bloqueado",
  error: "Error",
};

export const TASK_STATE_LABEL: Record<string, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  en_revision: "En revisión",
  completada: "Completada",
  bloqueada: "Bloqueada",
};

export const OPPORTUNITY_STAGES = [
  { id: "idea_capturada", label: "Idea capturada" },
  { id: "investigacion", label: "Investigación" },
  { id: "problema_validado", label: "Problema validado" },
  { id: "mercado_validado", label: "Mercado validado" },
  { id: "aprobada", label: "Aprobada" },
  { id: "en_construccion", label: "En construcción" },
  { id: "lanzada", label: "Lanzada" },
  { id: "archivada", label: "Archivada" },
] as const;

export const CONTENT_STATES = [
  { id: "idea", label: "Idea" },
  { id: "guion", label: "Guion" },
  { id: "produccion", label: "Producción" },
  { id: "revision", label: "Revisión" },
  { id: "programado", label: "Programado" },
  { id: "publicado", label: "Publicado" },
] as const;
