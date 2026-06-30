import type { MetadataRoute } from "next";
import { fetchCatalogoBackend } from "@/lib/catalogo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://emporiobothanico.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");

  const paginas: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/produtos`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/ajuda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/trocas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/entregas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacidade`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const { produtos } = await fetchCatalogoBackend({
      includeCategorias: false,
      timeoutMs: 15_000,
      retries: 2,
    });

    const urlsProdutos: MetadataRoute.Sitemap = produtos
      .filter((p) => p.ativo !== false)
      .map((p) => ({
        url: `${base}/produto/${p.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    return [...paginas, ...urlsProdutos];
  } catch {
    return paginas;
  }
}
