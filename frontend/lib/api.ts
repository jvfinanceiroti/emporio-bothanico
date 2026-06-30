import { getAdminLoginPath } from "./admin-paths";

const FALLBACK_API_URL = "https://emporio-bothanico.onrender.com";
const LOCAL_API_URL = "http://localhost:3001";

/** URL principal do backend Express (Render ou local). */
export function getBackendUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV === "production") {
    return FALLBACK_API_URL;
  }
  return LOCAL_API_URL;
}

/** URLs a tentar em ordem — útil quando o backend local não está rodando. */
export function getBackendUrlsToTry(): string[] {
  const urls: string[] = [];
  const primary = getBackendUrl();
  urls.push(primary);

  if (process.env.NODE_ENV !== "production") {
    if (primary !== LOCAL_API_URL) urls.push(LOCAL_API_URL);
    if (primary !== FALLBACK_API_URL) urls.push(FALLBACK_API_URL);
  }

  return [...new Set(urls)];
}

/** @deprecated Use getBackendUrl() — mantido para compatibilidade. */
export const API_URL = getBackendUrl();

// Helper para fazer requests públicos
export async function apiRequest(endpoint: string, options?: RequestInit) {
  const url = `${getBackendUrl()}${endpoint}`;
  const headers: Record<string, string> = { ...(options?.headers as Record<string, string>) };
  if (!headers["Content-Type"] && options?.method !== "GET") {
    headers["Content-Type"] = "application/json";
  }
  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error((errBody as { error?: string })?.error || `Erro: ${response.status}`);
  }

  return response.json();
}

// Helper para requests autenticados (admin) - retorna headers com token
export function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

// Request autenticado para painel admin
export async function apiRequestAuth(endpoint: string, options?: RequestInit) {
  const url = `${getBackendUrl()}${endpoint}`;
  const headers = new Headers(options?.headers);
  const auth = getAuthHeaders() as Record<string, string>;
  Object.entries(auth).forEach(([k, v]) => headers.set(k, v));
  if (!headers.has("Content-Type") && options?.body && typeof options.body === "string") {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = getAdminLoginPath();
    }
    throw new Error("Sessão expirada");
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error((errBody as { error?: string })?.error || `Erro: ${response.status}`);
  }

  return response.json();
}
