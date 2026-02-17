import { HomeClient } from "@/components/HomeClient";
import { API_URL } from "@/lib/api";

export const revalidate = 60;

async function getProdutosIniciais() {
  const url = `${API_URL}/produtos`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
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
