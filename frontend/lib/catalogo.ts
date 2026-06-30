import { getBackendUrlsToTry } from "./api";

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  imagem_url?: string;
  descricao?: string;
  ativo?: boolean;
  categoria_nome?: string;
  categoria_slug?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
  descricao?: string;
}

export interface CatalogoResponse {
  categorias: Categoria[];
  produtos: Produto[];
}

export interface CatalogoOptions {
  categoria?: string | null;
  includeCategorias?: boolean;
  includeProdutos?: boolean;
  comEstoque?: boolean;
  /** Timeout por tentativa em ms */
  timeoutMs?: number;
  /** Número de tentativas */
  retries?: number;
}

const DEFAULT_TIMEOUT_MS = 25_000;
const DEFAULT_RETRIES = 3;
const DEV_TIMEOUT_MS = 8_000;
const DEV_RETRIES = 1;
const RETRY_DELAY_MS = 1_500;

const CATALOGO_VAZIO: CatalogoResponse = { categorias: [], produtos: [] };

function normalizarCatalogo(data: CatalogoResponse | null | undefined): CatalogoResponse {
  return {
    categorias: Array.isArray(data?.categorias) ? data.categorias : [],
    produtos: Array.isArray(data?.produtos) ? data.produtos : [],
  };
}
const REVALIDATE_SECONDS = 60;

const CATALOG_CACHE_PREFIX = "catalogo_cache_v2:";
const CATALOG_CACHE_TTL_MS = 5 * 60 * 1000;

function buildCatalogoQuery(options: CatalogoOptions = {}): string {
  const params = new URLSearchParams();
  const parts: string[] = [];
  if (options.includeCategorias !== false) parts.push("categorias");
  if (options.includeProdutos !== false) parts.push("produtos");
  if (parts.length) params.set("include", parts.join(","));
  if (options.categoria) params.set("categoria", options.categoria);
  if (options.comEstoque) params.set("com_estoque", "true");
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function getCacheKey(options: CatalogoOptions): string {
  return `${CATALOG_CACHE_PREFIX}${options.categoria || "todos"}:${options.comEstoque ? "estoque" : "all"}`;
}

export function lerCacheCatalogo(options: CatalogoOptions = {}): CatalogoResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getCacheKey(options));
    if (!raw) return null;
    const cache = JSON.parse(raw);
    if (Date.now() - Number(cache?.ts || 0) > CATALOG_CACHE_TTL_MS) return null;
    if (!cache?.data) return null;
    return cache.data as CatalogoResponse;
  } catch {
    return null;
  }
}

export function salvarCacheCatalogo(data: CatalogoResponse, options: CatalogoOptions = {}): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      getCacheKey(options),
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {}
}

async function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonComRetry<T>(
  url: string,
  options: { timeoutMs?: number; retries?: number; next?: RequestInit["next"] } = {}
): Promise<T> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options.retries ?? DEFAULT_RETRIES;
  let ultimoErro: unknown;

  for (let tentativa = 0; tentativa < retries; tentativa++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        next: options.next,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return (await res.json()) as T;
    } catch (err) {
      ultimoErro = err;
      if (tentativa < retries - 1) await esperar(RETRY_DELAY_MS * (tentativa + 1));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw ultimoErro;
}

/** Busca catálogo diretamente no backend (SSR / API routes). Nunca lança erro. */
export async function fetchCatalogoBackend(
  options: CatalogoOptions = {}
): Promise<CatalogoResponse> {
  const query = buildCatalogoQuery(options);
  const isDev = process.env.NODE_ENV !== "production";
  const timeoutMs = options.timeoutMs ?? (isDev ? DEV_TIMEOUT_MS : DEFAULT_TIMEOUT_MS);
  const retries = options.retries ?? (isDev ? DEV_RETRIES : DEFAULT_RETRIES);

  for (const base of getBackendUrlsToTry()) {
    try {
      const data = await fetchJsonComRetry<CatalogoResponse>(`${base}/catalogo${query}`, {
        timeoutMs,
        retries,
        next: { revalidate: REVALIDATE_SECONDS },
      });
      const normalizado = normalizarCatalogo(data);
      if (normalizado.produtos.length > 0 || normalizado.categorias.length > 0) {
        return normalizado;
      }
    } catch {
      // tenta próxima URL
    }
  }

  return CATALOGO_VAZIO;
}

/** Busca catálogo via rota interna do Next (cliente). */
export async function fetchCatalogoClient(
  options: CatalogoOptions = {}
): Promise<CatalogoResponse> {
  const query = buildCatalogoQuery(options);
  const url = `/api/catalogo${query}`;

  try {
    const data = await fetchJsonComRetry<CatalogoResponse>(url, {
      timeoutMs: options.timeoutMs ?? 20_000,
      retries: options.retries ?? 2,
    });
    return normalizarCatalogo(data);
  } catch {
    return CATALOGO_VAZIO;
  }
}

/** Busca catálogo com fallback de cache local (cliente). */
export async function fetchCatalogoComCache(
  options: CatalogoOptions = {}
): Promise<{ data: CatalogoResponse; fromCache: boolean }> {
  const cache = lerCacheCatalogo(options);
  try {
    const data = await fetchCatalogoClient(options);
    salvarCacheCatalogo(data, options);
    return { data, fromCache: false };
  } catch {
    if (cache) return { data: cache, fromCache: true };
    return { data: { categorias: [], produtos: [] }, fromCache: false };
  }
}

/** Produtos ativos para exibição na loja. */
export function filtrarProdutosVisiveis(produtos: Produto[]): Produto[] {
  return produtos.filter((p) => p.ativo !== false);
}

export function getProdutoImagemPadrao(p: Produto | { nome?: string; imagem_url?: string }): string {
  const url = p?.imagem_url;
  if (url && !url.includes("placeholder")) return url;
  const n = (p?.nome || "").toLowerCase();
  if (n.includes("essência") || n.includes("essencia")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=85";
  if (n.includes("refil") && n.includes("sabonete")) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85";
  if (n.includes("difusor")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=85";
  if (n.includes("sabonete") && (n.includes("lavanda") || n.includes("artesanal"))) return "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&q=85";
  if (n.includes("vela") || n.includes("baunilha")) return "https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=500&q=85";
  if (n.includes("spray") || n.includes("eucalipto") || n.includes("home spray")) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85";
  return "/logo.png";
}
