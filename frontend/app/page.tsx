import { HomeClient } from "@/components/HomeClient";
import { API_URL } from "@/lib/api";

export const revalidate = 60;
const SSR_FETCH_TIMEOUT_MS = 4500;

async function getProdutosIniciais() {
  const url = `${API_URL}/produtos`;
  try {
    // Em produção, se API_URL cair para localhost por variável ausente,
    // não bloqueia o build da home.
    if (process.env.NODE_ENV === "production" && API_URL.includes("localhost")) {
      console.warn("SSR home: API_URL local em produção, pulando preload de produtos.");
      return [];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SSR_FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const data = await res.json();
    const arr = Array.isArray(data) ? data : [];
    return arr.filter((p: any) => p.ativo !== false && (p.estoque ?? 0) > 0);
  } catch (err) {
    console.error("Erro SSR produtos:", err);
    return [];
  }
}

export default async function Home() {
  const produtosIniciais = await getProdutosIniciais();
  return <HomeClient produtosIniciais={produtosIniciais} />;
}
