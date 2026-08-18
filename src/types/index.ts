// Dominio del Command Center. Estos tipos son el contrato que consumirá
// posteriormente la API real (ver src/services/*).

export type Role = "ceo" | "distribucion";

export interface User {
  id: string;
  name: string;
  role: Role;
  title: string;
  initials: string;
  assistant: "ZADAR" | "NOVA";
}

export type Stage =
  | "idea"
  | "inteligencia"
  | "validacion"
  | "diseno"
  | "desarrollo"
  | "qa"
  | "lanzamiento"
  | "crecimiento"
  | "venta";

export type Health = "saludable" | "atencion" | "riesgo";
export type Priority = "alta" | "media" | "baja";
export type RiskLevel = "bajo" | "medio" | "alto";

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  stage: Stage;
  progress: number;
  techStatus: string;
  commercialStatus: string;
  owner: string;
  ownerRole: string;
  nextMilestone: string;
  launchDate: string;
  risk: RiskLevel;
  health: Health;
  country: string;
  businessModel: string;
  priority: Priority;
  status: "activo" | "pausado" | "archivado";
  exitReady: boolean;
  healthScore: number;
  mrr: number;
  users: number;
  monthlyCost: number;
  accent: "blue" | "violet" | "green";
  market: { tam: string; sam: string; competitors: string[]; differentiation: string };
  tech: { stack: string[]; coverage: number; uptime: number; openIssues: number };
  design: { system: string; screens: number; pending: number };
  distribution: { channels: string[]; waitlist: number; contentPieces: number };
  finance: { revenue: number; costs: number; margin: number };
  risks: { id: string; label: string; level: RiskLevel; mitigation: string }[];
  documents: { id: string; name: string; type: string; updatedAt: string }[];
  history: { id: string; date: string; label: string; author: string }[];
  metricsSeries: { label: string; usuarios: number; ingresos: number }[];
}

export interface Department {
  id: string;
  name: string;
  objective: string;
  agents: string[];
  openTasks: number;
  doneTasks: number;
  blockers: number;
  budgetUsed: number;
  budgetTotal: number;
  quality: number;
  lastActivity: string;
  accent: "blue" | "violet" | "green" | "amber";
}

export type AgentStatus =
  | "disponible"
  | "programado"
  | "ejecutando"
  | "esperando_aprobacion"
  | "bloqueado"
  | "error";

export interface Agent {
  id: string;
  name: string;
  role: string;
  departmentId: string;
  description: string;
  capabilities: string[];
  tools: string[];
  products: string[];
  status: AgentStatus;
  currentTask: string | null;
  lastRun: string;
  nextRun: string;
  accumulatedCost: number;
  riskLevel: RiskLevel;
}

export interface AgentRun {
  id: string;
  agentId: string;
  objective: string;
  startedAt: string;
  duration: string;
  status: "completado" | "fallido" | "en_curso";
  inputs: string[];
  steps: { label: string; state: "ok" | "error" | "curso" }[];
  outputs: string[];
  evidence: { label: string; ref: string }[];
  cost: number;
  retries: number;
  approvals: string[];
  audit: { at: string; event: string }[];
}

export type TaskState = "pendiente" | "en_curso" | "en_revision" | "completada" | "bloqueada";

export interface Task {
  id: string;
  title: string;
  productId: string | null;
  departmentId: string;
  assignee: string;
  state: TaskState;
  priority: Priority;
  dueDate: string;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: string[];
  departmentId: string;
  active: boolean;
}

export interface Approval {
  id: string;
  title: string;
  proposal: string;
  reason: string;
  benefit: string;
  requestedBy: string;
  productId: string | null;
  departmentId: string;
  risk: RiskLevel;
  cost: number;
  bucket: "urgente" | "hoy" | "semana" | "informativa" | "resuelta";
  recommendation: string;
  approver: Role;
  deadline: string;
  evidence: string[];
  state: "pendiente" | "aprobada" | "rechazada" | "cambios";
}

export interface ActivityItem {
  id: string;
  agent: string;
  departmentId: string;
  action: string;
  productId: string | null;
  result: string;
  time: string;
  state: "completado" | "alerta" | "error" | "en_curso";
  runId: string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  delta: number;
  period: string;
  state: "ok" | "warn" | "risk";
  href: string;
  icon: string;
}

export interface Cost {
  id: string;
  category: string;
  productId: string | null;
  amount: number;
  month: string;
}

export interface Incident {
  id: string;
  title: string;
  productId: string | null;
  severity: "critica" | "alta" | "media";
  state: "abierta" | "mitigada" | "cerrada";
  openedAt: string;
}

export interface Report {
  id: string;
  title: string;
  departmentId: string;
  author: string;
  date: string;
  summary: string;
  type: string;
}

export interface AuditEvent {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
}

export interface VoiceBriefing {
  id: string;
  assistant: "ZADAR" | "NOVA";
  title: string;
  date: string;
  duration: string;
  topics: string[];
  summary: string;
}

export interface Opportunity {
  id: string;
  name: string;
  stage:
    | "idea_capturada"
    | "investigacion"
    | "problema_validado"
    | "mercado_validado"
    | "aprobada"
    | "en_construccion"
    | "lanzada"
    | "archivada";
  problem: string;
  idealCustomer: string;
  solution: string;
  competitors: string[];
  differentiation: string;
  market: string;
  size: string;
  complexity: "baja" | "media" | "alta";
  estimatedTime: string;
  regulatoryRisk: RiskLevel;
  monetization: string;
  evidence: string[];
  score: number;
  recommendation: string;
}

export interface ContentPiece {
  id: string;
  title: string;
  channel: string;
  productId: string | null;
  state: "idea" | "guion" | "produccion" | "revision" | "programado" | "publicado";
  date: string;
  owner: string;
  reach: number;
}

export interface Campaign {
  id: string;
  name: string;
  channel: string;
  productId: string | null;
  state: "activa" | "planificada" | "finalizada";
  budget: number;
  spent: number;
  leads: number;
  conversion: number;
}

export interface ExitReadiness {
  productId: string;
  score: number;
  items: { label: string; value: number; note: string }[];
  dataRoom: { label: string; state: "listo" | "parcial" | "pendiente" }[];
}
