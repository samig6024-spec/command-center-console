/**
 * Capa de servicios desacoplada.
 *
 * Hoy resuelve desde archivos de datos demo (src/mock-data). Para conectar la
 * API real basta con reemplazar el cuerpo de cada función por una llamada
 * `request()` contra `API_BASE_URL`; los componentes no cambian.
 */
import { API_BASE_URL, USE_MOCK_DATA, MOCK_LATENCY_MS } from "@/config/env";
import { products } from "@/mock-data/products";
import { agentRuns, agents, departments, tasks, users, workflows } from "@/mock-data/organization";
import {
  activity,
  approvals,
  auditEvents,
  burnSeries,
  campaigns,
  channelPerformance,
  contentPieces,
  costs,
  departmentBudgetSeries,
  exitReadiness,
  funnel,
  incidents,
  metrics,
  opportunities,
  reports,
  voiceBriefings,
  voiceUsage,
} from "@/mock-data/operations";

function delay<T>(data: T): Promise<T> {
  if (!USE_MOCK_DATA) {
    throw new Error(`API real no configurada todavía (${API_BASE_URL}).`);
  }
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), MOCK_LATENCY_MS));
}

export const productsService = {
  list: () => delay(products),
  get: (id: string) => delay(products.find((p) => p.id === id) ?? null),
  exitReadiness: () => delay(exitReadiness),
};

export const agentsService = {
  list: () => delay(agents),
  get: (id: string) => delay(agents.find((a) => a.id === id) ?? null),
  runs: (agentId?: string) => delay(agentId ? agentRuns.filter((r) => r.agentId === agentId) : agentRuns),
};

export const tasksService = {
  list: () => delay(tasks),
  workflows: () => delay(workflows),
};

export const approvalsService = {
  list: () => delay(approvals),
};

export const departmentsService = {
  list: () => delay(departments),
  get: (id: string) => delay(departments.find((d) => d.id === id) ?? null),
};

export const metricsService = {
  list: () => delay(metrics),
  activity: () => delay(activity),
  incidents: () => delay(incidents),
  funnel: () => delay(funnel),
  channels: () => delay(channelPerformance),
};

export const costsService = {
  list: () => delay(costs),
  burnSeries: () => delay(burnSeries),
  departmentBudgets: () => delay(departmentBudgetSeries),
  voiceUsage: () => delay(voiceUsage),
};

export const reportsService = {
  list: () => delay(reports),
  audit: () => delay(auditEvents),
};

export const voiceBriefingsService = {
  list: () => delay(voiceBriefings),
};

export const incubatorService = {
  opportunities: () => delay(opportunities),
};

export const distributionService = {
  content: () => delay(contentPieces),
  campaigns: () => delay(campaigns),
};

export const usersService = {
  list: () => delay(users),
};
