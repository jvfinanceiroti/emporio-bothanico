import { HomeClient } from "@/components/HomeClient";
import { API_URL } from "@/lib/api";

export const revalidate = 60;
const SSR_FETCH_TIMEOUT_MS = 4500;

async function getProdutosIniciais() {
  const url = `${API_URL}/produtos`;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  try {
    // Em produção, se API_URL cair para localhost por variável ausente,
    // não bloqueia o build da home.
    if (process.env.NODE_ENV === "production" && API_URL.includes("localhost")) {
      console.warn("SSR home: API_URL local em produção, pulando preload de produtos.");
      return [];
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), SSR_FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });

    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.filter((p: any) => p.ativo !== false && (p.estoque ?? 0) > 0);
  } catch (err) {
    const isAbortError =
      err instanceof Error &&
      (err.name === "AbortError" || err.message.toLowerCase().includes("aborted"));

    if (isAbortError) {
      // Timeout no preload SSR não deve poluir log de build.
      return [];
    }

    console.error("Erro SSR produtos:", err);
    return [];
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export default async function Home() {
  const produtosIniciais = await getProdutosIniciais();
  return <HomeClient produtosIniciais={produtosIniciais} />;
}
