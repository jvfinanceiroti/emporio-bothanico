"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

function getProdutoImagem(p: any) {
  const url = p?.imagem_url;
  if (url && !url.includes("placeholder")) return url;
  const n = (p?.nome || "").toLowerCase();
  if (n.includes("essência") || n.includes("essencia")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=85";
  if (n.includes("refil") && n.includes("sabonete")) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85";
  if (n.includes("difusor")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=85";
  if (n.includes("sabonete") && (n.includes("lavanda") || n.includes("artesanal"))) return "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&q=85";
  if (n.includes("vela") || n.includes("baunilha")) return "https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=500&q=85";
  if (n.includes("spray") || n.includes("eucalipto") || n.includes("home spray")) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85";
  return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85";
}

function getGaleriaImagens(produto: any) {
  const fallback = getProdutoImagem(produto);
  const coletadas: string[] = [];

  const adicionar = (valor: unknown) => {
    if (typeof valor !== "string") return;
    const limpa = valor.trim();
    if (!limpa) return;
    coletadas.push(limpa);
  };

  adicionar(produto?.imagem_url);

  if (Array.isArray(produto?.imagens)) {
    produto.imagens.forEach(adicionar);
  } else if (typeof produto?.imagens === "string") {
    try {
      const parsed = JSON.parse(produto.imagens);
      if (Array.isArray(parsed)) parsed.forEach(adicionar);
      else produto.imagens.split(",").forEach(adicionar);
    } catch {
      produto.imagens.split(",").forEach(adicionar);
    }
  }

  Object.entries(produto || {}).forEach(([chave, valor]) => {
    if (typeof valor === "string" && /^imagem(_url)?(_\d+)?$/i.test(chave)) adicionar(valor);
  });

  const unicas = Array.from(new Set(coletadas.filter((u) => /^https?:\/\//i.test(u))));
  return unicas.length ? unicas : [fallback];
}

function ProdutoContent() {
  const params = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState<any[]>([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtiva, setImagemAtiva] = useState("");
  const [lightboxAberto, setLightboxAberto] = useState(false);
  const [quantidadeAnimando, setQuantidadeAnimando] = useState(false);
  const [botaoQtdAtivo, setBotaoQtdAtivo] = useState<"+" | "-" | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const FETCH_TIMEOUT_MS = 15_000;

  const fetchJsonComTimeout = async <T,>(url: string, timeoutMs: number): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
      return await res.json();
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const esperar = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchComRetry = async <T,>(url: string, timeoutMs: number, tentativas = 2): Promise<T> => {
    let ultimoErro: unknown = null;
    for (let i = 0; i < tentativas; i++) {
      try {
        return await fetchJsonComTimeout<T>(url, timeoutMs);
      } catch (erro) {
        ultimoErro = erro;
        if (i < tentativas - 1) await esperar(1200);
      }
    }
    throw ultimoErro;
  };

  useEffect(() => {
    if (!params?.id) return;
    let cancelado = false;
    const id = String(params.id);
    setErroCarregamento(null);

    try {
      const raw = localStorage.getItem(`produto_cache_v1:${id}`);
      if (raw) {
        const cache = JSON.parse(raw);
        if (cache?.row) setProduto(cache.row);
      }
    } catch {}

    (async () => {
      try {
        const data = await fetchComRetry<any>(`${API_URL}/produtos/${id}`, FETCH_TIMEOUT_MS, 2);
        if (cancelado) return;
        setProduto(data);
        try {
          localStorage.setItem(`produto_cache_v1:${id}`, JSON.stringify({ ts: Date.now(), row: data }));
        } catch {}
      } catch {
        if (!cancelado) {
          setErroCarregamento("Não foi possível carregar o produto agora. Tente novamente em instantes.");
        }
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [params]);

  useEffect(() => {
    if (!produto) return;
    const galeria = getGaleriaImagens(produto);
    setImagemAtiva(galeria[0]);
    setQuantidade(1);
    let cancelado = false;

    const preencherRelacionados = (lista: any[]) => {
      const outros = (lista || []).filter((p) => p.id !== produto.id && p.ativo !== false);
      const mesmaCategoria = outros.filter((p) => p.categoria_id === produto.categoria_id);
      const restante = outros.filter((p) => p.categoria_id !== produto.categoria_id);
      setProdutosRelacionados([...mesmaCategoria, ...restante].slice(0, 4));
    };

    try {
      const raw = localStorage.getItem("produtos_page_cache_v1:todos");
      if (raw) {
        const cache = JSON.parse(raw);
        if (Array.isArray(cache?.rows)) preencherRelacionados(cache.rows);
      }
    } catch {}

    (async () => {
      try {
        const payload = await fetchComRetry<{ produtos?: any[] }>(`${API_URL}/catalogo?include=produtos`, FETCH_TIMEOUT_MS, 2);
        const lista = Array.isArray(payload?.produtos) ? payload.produtos : [];
        if (cancelado) return;
        preencherRelacionados(lista);
        try {
          localStorage.setItem("produtos_page_cache_v1:todos", JSON.stringify({ ts: Date.now(), rows: lista }));
        } catch {}
      } catch {
        if (!cancelado) setProdutosRelacionados([]);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [produto]);

  const adicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
    for (let i = 0; i < quantidade; i++) carrinhoAtual.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    window.dispatchEvent(new Event("carrinho-changed"));
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 2500);
  };

  const animarQuantidade = (tipo: "+" | "-") => {
    setBotaoQtdAtivo(tipo);
    setQuantidadeAnimando(true);
    setTimeout(() => setBotaoQtdAtivo(null), 160);
    setTimeout(() => setQuantidadeAnimando(false), 170);
  };

  const diminuirQuantidade = () => {
    setQuantidade((qtdAtual: number) => {
      const proximo = Math.max(1, qtdAtual - 1);
      if (proximo !== qtdAtual) animarQuantidade("-");
      return proximo;
    });
  };

  const aumentarQuantidade = () => {
    setQuantidade((qtdAtual: number) => {
      const limite = Number(produto?.estoque || 1);
      const proximo = Math.min(limite, qtdAtual + 1);
      if (proximo !== qtdAtual) animarQuantidade("+");
      return proximo;
    });
  };

  if (!produto) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f6f3] to-white flex flex-col">
        <StoreHeader />
        {erroCarregamento ? (
          <div className="flex-1 flex items-center justify-center py-20 px-4">
            <div className="max-w-md w-full bg-white border border-[var(--border)] rounded-2xl p-6 text-center">
              <p className="text-[var(--foreground)] font-semibold mb-3">Produto indisponível no momento</p>
              <p className="text-[var(--muted)] text-sm mb-5">{erroCarregamento}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin" />
          </div>
        )}
      </div>
    );
  }

  const galeriaImagens = getGaleriaImagens(produto);
  const imgUrl = imagemAtiva || galeriaImagens[0];
  const estoque = Number(produto.estoque || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      {/* Toast */}
      <div className={`fixed top-6 right-6 z-[2000] px-6 py-4 rounded-2xl bg-[var(--success)] text-white font-semibold shadow-xl flex items-center gap-3 transition-all duration-300 ${mostrarToast ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
        Produto adicionado ao carrinho!
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/produtos" className="hover:text-[var(--accent)]">Produtos</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium truncate max-w-[200px] sm:max-w-xs inline-block align-bottom">{produto.nome}</span>
        </nav>

        {/* Card principal - Produto */}
        <div className="mb-12 sm:mb-14">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(420px,520px)_1fr] gap-8 lg:gap-16 items-start">
              {/* Coluna imagem */}
              <div className="w-full">
                <div className="bg-white p-6 sm:p-8 lg:p-10 rounded-[20px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[var(--border)] flex items-center justify-center overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setLightboxAberto(true)}
                    className="group w-full flex items-center justify-center"
                    aria-label="Ampliar imagem do produto"
                  >
                    <img
                      src={imgUrl}
                      alt={produto.nome}
                      className="w-full max-w-[420px] h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      onError={(e) => { (e.target as HTMLImageElement).src = getProdutoImagem(produto); }}
                    />
                  </button>
                </div>

                {galeriaImagens.length > 1 && (
                  <div className="mt-4 w-full flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    {galeriaImagens.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        onClick={() => setImagemAtiva(img)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white shadow-sm transition-all ${imagemAtiva === img ? "border-[var(--accent)] ring-2 ring-[var(--accent-light)]" : "border-[var(--border)] hover:border-[var(--accent)]/60"}`}
                        aria-label={`Selecionar imagem ${idx + 1}`}
                      >
                        <img src={img} alt={`${produto.nome} - miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Coluna detalhes */}
              <div className="w-full max-w-[520px]">
                <p className="text-[12px] tracking-[2px] uppercase opacity-60 text-[var(--foreground)] mb-3">Empório Botânico</p>

                <h1 className="text-[clamp(28px,4vw,32px)] font-semibold leading-[1.2] text-[var(--foreground)] mb-4 max-w-[520px]">
                  {produto.nome}
                </h1>

                {produto.descricao && (
                  <p className="text-[15px] leading-[1.7] text-[#555] max-w-[520px] mb-6">
                    {produto.descricao}
                  </p>
                )}

                <div className="inline-block bg-[#f3f7f5] px-6 py-6 rounded-2xl mb-5">
                  <div className="text-[clamp(30px,4vw,36px)] font-semibold leading-none text-[#1f4d3a]">
                    R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-2">ou 3x de R$ {(Number(produto.preco) / 3).toFixed(2).replace(".", ",")} sem juros</p>
                </div>

                <div className="mb-6">
                  {estoque <= 0 ? (
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-red-500">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      Produto indisponível
                    </div>
                  ) : estoque === 1 ? (
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Apenas 1 unidade disponível
                    </div>
                  ) : estoque < 30 ? (
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      Apenas {estoque} unidades disponíveis
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--success)]">
                      <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                      {estoque} unidades em estoque
                    </div>
                  )}
                </div>

                {estoque > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Quantidade</label>
                    <div className="inline-flex items-center rounded-xl border border-[var(--border)] bg-white overflow-hidden">
                      <button
                        onClick={diminuirQuantidade}
                        className={`h-10 w-10 flex items-center justify-center text-lg font-semibold text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-all ${botaoQtdAtivo === "-" ? "scale-105" : "scale-100"}`}
                      >
                        -
                      </button>
                      <span className={`h-10 w-12 flex items-center justify-center text-base font-semibold transition-all ${quantidadeAnimando ? "opacity-70" : "opacity-100"}`}>
                        {quantidade}
                      </span>
                      <button
                        onClick={aumentarQuantidade}
                        className={`h-10 w-10 flex items-center justify-center text-lg font-semibold text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-all ${botaoQtdAtivo === "+" ? "scale-105" : "scale-100"}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={adicionarAoCarrinho}
                  disabled={produto.estoque <= 0}
                  className={`w-full h-14 rounded-[28px] font-semibold text-base flex items-center justify-center gap-3 transition-all ${
                    estoque > 0
                      ? "bg-[#1f4d3a] text-white hover:bg-[#183f30] shadow-[0_12px_24px_rgba(31,77,58,0.25)]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/></svg>
                  {estoque > 0 ? "Adicionar ao carrinho" : "Indisponível"}
                </button>

                {estoque > 0 && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: "🚚", titulo: "Envio para todo Brasil" },
                      { icon: "🔒", titulo: "Compra segura" },
                      { icon: "↩️", titulo: "Troca facilitada" },
                      { icon: "💚", titulo: "100% original" },
                    ].map((item) => (
                      <div key={item.titulo} className="rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--foreground)] flex items-center gap-2 shadow-[0_6px_14px_rgba(0,0,0,0.04)]">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.titulo}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Link href="/produtos" className="block text-center text-[var(--muted)] font-medium mt-6 hover:text-[var(--accent)] transition-colors">
                  ← Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Veja também */}
        {produtosRelacionados.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-logo)" }}>Veja também</h2>
            <div className="flex sm:grid sm:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory">
              {produtosRelacionados.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${p.id}`}
                  className="group min-w-[72%] sm:min-w-0 snap-start bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-xl hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-gradient-to-br from-[var(--accent-light)]/20 to-[var(--warm-100)] flex items-center justify-center p-4">
                    <img src={getProdutoImagem(p)} alt={p.nome} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" onError={(ev) => { (ev.target as HTMLImageElement).src = getProdutoImagem(p); }} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--foreground)] text-sm line-clamp-2 mb-2 group-hover:text-[var(--accent)]">{p.nome}</h3>
                    <div className="text-lg font-black text-[var(--accent)]">R$ {Number(p.preco).toFixed(2).replace(".", ",")}</div>
                    <p className="text-xs text-[var(--muted)]">À vista no PIX</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {lightboxAberto && (
        <div
          className="fixed inset-0 z-[3000] bg-black/75 backdrop-blur-[2px] p-4 sm:p-8 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxAberto(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxAberto(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-8 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Fechar imagem ampliada"
          >
            ✕
          </button>
          <img
            src={imgUrl}
            alt={`${produto.nome} ampliado`}
            className="max-w-[94vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

export default function ProdutoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f6f3] flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
        <SiteFooter />
      </div>
    }>
      <ProdutoContent />
    </Suspense>
  );
}
