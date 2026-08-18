/**
 * Configuración de entorno. No colocar secretos aquí: sólo valores públicos.
 * Definir en un archivo .env local:
 *   VITE_API_BASE_URL=https://api.tu-dominio.com
 *   VITE_USE_MOCK_DATA=true
 */
const env = import.meta.env as Record<string, string | undefined>;

export const API_BASE_URL = env["VITE_API_BASE_URL"] ?? "http://localhost:3000/api";
export const USE_MOCK_DATA = (env["VITE_USE_MOCK_DATA"] ?? "true") !== "false";
export const MOCK_LATENCY_MS = Number(env["VITE_MOCK_LATENCY_MS"] ?? 320);
export const APP_NAME = "Command Center";
export const DEFAULT_LOCALE = "es";
