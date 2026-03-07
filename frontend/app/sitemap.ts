import type { MetadataRoute } from "next";
import { API_URL } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";
const SITEMAP_FETCH_TIMEOUT_MS = 4000;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");

  // Páginas estáticas
  const paginas: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/produtos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/contato`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/ajuda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/trocas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/entregas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/privacidade`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Produtos dinâmicos
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  try {
    // Em produção, evita travar build se API_URL cair para localhost
    // por variável de ambiente ausente.
    if (process.env.NODE_ENV === "production" && API_URL.includes("localhost")) {
      return paginas;
    }

    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), SITEMAP_FETCH_TIMEOUT_MS);
    const res = await fetch(`${API_URL}/produtos`, { signal: controller.signal });
    if (!res.ok) return paginas;

    const produtos = await res.json();
    const lista = Array.isArray(produtos) ? produtos : [];

    const urlsProdutos: MetadataRoute.Sitemap = lista
      .filter((p: { ativo?: boolean }) => p.ativo !== false)
      .map((p: { id: number; nome?: string; updated_at?: string }) => ({
        url: `${base}/produto/${p.id}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...paginas, ...urlsProdutos];
  } catch {
    return paginas;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}
