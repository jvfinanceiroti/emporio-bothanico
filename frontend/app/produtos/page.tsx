"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { LayoutGrid, List, ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useCatalogo } from "@/hooks/useCatalogo";
import { getProdutoImagemPadrao, type Produto } from "@/lib/catalogo";
import { ProdutosSidebar, contarProdutosPorCategoria } from "@/components/produtos/ProdutosSidebar";
import { ProdutoCardCatalog } from "@/components/produtos/ProdutoCardCatalog";
import { ProdutosTrustBar } from "@/components/produtos/ProdutosTrustBar";

const POR_PAGINA = 12;

function ProdutosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(searchParams.get("categoria") || null);
  const [termoBusca, setTermoBusca] = useState(searchParams.get("q") || "");
  const [carrinho, setCarrinho] = useState<(Produto & { quantidade?: number })[]>([]);
  const [produtoAdicionadoId, setProdutoAdicionadoId] = useState<number | null>(null);
  const [ordem, setOrdem] = useState<"recente" | "nome" | "preco">("recente");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [pagina, setPagina] = useState(1);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [precoLimite, setPrecoLimite] = useState<number | null>(null);

  const { produtos: todosProdutos, categorias, carregando } = useCatalogo({});

  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
    try {
      const fav = localStorage.getItem("favoritos");
      if (fav) setFavoritos(new Set(JSON.parse(fav)));
    } catch {}
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("categoria");
    if (q !== null) setTermoBusca(q);
    if (cat !== null) setCategoriaSelecionada(cat);
  }, [searchParams]);

  const precoMin = useMemo(() => {
    if (!todosProdutos.length) return 0;
    return Math.floor(Math.min(...todosProdutos.map((p) => Number(p.preco) || 0)));
  }, [todosProdutos]);

  const precoMaximo = useMemo(() => {
    if (!todosProdutos.length) return 0;
    return Math.ceil(Math.max(...todosProdutos.map((p) => Number(p.preco) || 0)));
  }, [todosProdutos]);

  useEffect(() => {
    if (precoMaximo > 0 && precoLimite === null) setPrecoLimite(precoMaximo);
  }, [precoMaximo, precoLimite]);

  const limitePreco = precoLimite ?? precoMaximo;

  const produtosFiltrados = useMemo(() => {
    let lista = [...todosProdutos];

    if (categoriaSelecionada) {
      lista = lista.filter((p) => p.categoria_slug === categoriaSelecionada);
    }
    if (termoBusca.trim()) {
      const q = termoBusca.toLowerCase();
      lista = lista.filter((p) => p.nome.toLowerCase().includes(q));
    }
    if (limitePreco < precoMaximo) {
      lista = lista.filter((p) => Number(p.preco) <= limitePreco);
    }

    lista.sort((a, b) => {
      if (ordem === "nome") return (a.nome || "").localeCompare(b.nome || "", "pt-BR");
      if (ordem === "preco") return Number(a.preco) - Number(b.preco);
      return (b.id || 0) - (a.id || 0);
    });

    return lista;
  }, [todosProdutos, categoriaSelecionada, termoBusca, limitePreco, precoMaximo, ordem]);

  const totalPaginas = Math.max(1, Math.ceil(produtosFiltrados.length / POR_PAGINA));
  const produtosPagina = produtosFiltrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  useEffect(() => {
    setPagina(1);
  }, [categoriaSelecionada, termoBusca, ordem, limitePreco]);

  const selecionarCategoria = (slug: string | null) => {
    setCategoriaSelecionada(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("categoria", slug);
    else params.delete("categoria");
    router.push(`/produtos${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const adicionarAoCarrinho = (produto: Produto) => {
    const novo = [...carrinho];
    const idx = novo.findIndex((i) => i.id === produto.id);
    if (idx >= 0) novo[idx].quantidade = (novo[idx].quantidade || 1) + 1;
    else novo.push({ ...produto, quantidade: 1 });
    setCarrinho(novo);
    localStorage.setItem("carrinho", JSON.stringify(novo));
    window.dispatchEvent(new Event("carrinho-changed"));
    setProdutoAdicionadoId(produto.id);
    setTimeout(() => setProdutoAdicionadoId(null), 1800);
  };

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem("favoritos", JSON.stringify([...next]));
      return next;
    });
  };

  const limparFiltros = () => {
    setCategoriaSelecionada(null);
    setTermoBusca("");
    setPrecoLimite(precoMaximo);
    setPagina(1);
    router.push("/produtos", { scroll: false });
  };

  const categoriaAtual = categorias.find((c) => c.slug === categoriaSelecionada);
  const titulo = categoriaAtual?.nome || "Produtos";

  const sidebarProps = {
    categorias,
    categoriaSelecionada,
    onCategoria: selecionarCategoria,
    termoBusca,
    onBusca: setTermoBusca,
    precoMin,
    precoMax: precoMaximo,
    precoLimite: limitePreco,
    onPrecoLimite: setPrecoLimite,
    precoMaximo,
    onLimpar: limparFiltros,
    contarPorCategoria: (slug: string) => contarProdutosPorCategoria(todosProdutos, slug),
    totalProdutos: todosProdutos.length,
  };

  return (
    <div className="min-h-screen bg-[var(--lux-cream)] overflow-x-hidden">
      <StoreHeader />

      {/* Hero da página */}
      <div className="bg-[var(--lux-cream)] border-b border-[var(--lux-gold)]/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-8 sm:pb-10">
          <nav className="text-[11px] text-[var(--lux-warm-gray)] mb-6">
            <Link href="/" className="hover:text-[var(--lux-gold-muted)] transition-colors">Início</Link>
            <span className="mx-2">›</span>
            <span className="text-[var(--lux-deep)]">{titulo}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl text-[var(--lux-deep)] font-normal tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {titulo}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-[var(--lux-warm-gray)] max-w-lg">
                Encontre fragrâncias exclusivas e transforme sua rotina.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value as typeof ordem)}
                  className="appearance-none h-11 pl-4 pr-10 rounded-full border border-[var(--lux-gold)]/20 bg-white text-xs uppercase tracking-[0.12em] text-[var(--lux-deep)] focus:outline-none focus:border-[var(--lux-gold)]/50 cursor-pointer"
                >
                  <option value="recente">Mais recentes</option>
                  <option value="nome">Nome (A–Z)</option>
                  <option value="preco">Menor preço</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lux-warm-gray)] pointer-events-none" strokeWidth={1.5} />
              </div>

              <div className="flex rounded-full border border-[var(--lux-gold)]/20 overflow-hidden bg-white">
                <button
                  onClick={() => setLayout("grid")}
                  className={`p-2.5 transition-colors ${layout === "grid" ? "bg-[var(--lux-deep)] text-[var(--lux-cream)]" : "text-[var(--lux-warm-gray)] hover:text-[var(--lux-deep)]"}`}
                  aria-label="Grade"
                >
                  <LayoutGrid className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`p-2.5 transition-colors ${layout === "list" ? "bg-[var(--lux-deep)] text-[var(--lux-cream)]" : "text-[var(--lux-warm-gray)] hover:text-[var(--lux-deep)]"}`}
                  aria-label="Lista"
                >
                  <List className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* Mobile filtros */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setFiltrosAbertos(!filtrosAbertos)}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-full border border-[var(--lux-gold)]/20 bg-white text-[10px] uppercase tracking-[0.2em] text-[var(--lux-deep)]"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
            Filtros
          </button>
          {filtrosAbertos && (
            <div className="mt-4">
              <ProdutosSidebar {...sidebarProps} mobile />
            </div>
          )}
        </div>

        <div className="flex gap-8 lg:gap-10">
          <ProdutosSidebar {...sidebarProps} />

          <div className="flex-1 min-w-0">
            {!carregando && produtosFiltrados.length > 0 && (
              <p className="text-xs text-[var(--lux-warm-gray)] mb-6">
                {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""}
              </p>
            )}

            {carregando ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="lux-spinner mb-6" />
                <p className="text-sm text-[var(--lux-warm-gray)]">Carregando coleção...</p>
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[22px] border border-[var(--lux-gold)]/10">
                <p className="text-lg text-[var(--lux-deep)]" style={{ fontFamily: "var(--font-display)" }}>
                  Nenhum produto encontrado
                </p>
                <p className="text-sm text-[var(--lux-warm-gray)] mt-2 mb-8">Tente outra categoria ou termo de busca.</p>
                <button
                  onClick={limparFiltros}
                  className="px-8 py-3 rounded-full bg-[var(--lux-deep)] text-[var(--lux-cream)] text-[10px] uppercase tracking-[0.2em]"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <div className={
                  layout === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6"
                    : "flex flex-col gap-4 sm:gap-5"
                }>
                  {produtosPagina.map((produto, idx) => (
                    <ProdutoCardCatalog
                      key={produto.id}
                      produto={produto}
                      imagem={getProdutoImagemPadrao(produto)}
                      onAddToCart={adicionarAoCarrinho}
                      adicionado={produtoAdicionadoId === produto.id}
                      index={idx}
                      favorito={favoritos.has(produto.id)}
                      onToggleFavorito={() => toggleFavorito(produto.id)}
                      layout={layout}
                    />
                  ))}
                </div>

                {/* Paginação */}
                {totalPaginas > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 sm:mt-16">
                    <button
                      onClick={() => setPagina((p) => Math.max(1, p - 1))}
                      disabled={pagina <= 1}
                      className="w-10 h-10 rounded-full border border-[var(--lux-gold)]/25 flex items-center justify-center text-[var(--lux-warm-gray)] hover:border-[var(--lux-gold)] disabled:opacity-30 transition-colors"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === totalPaginas || Math.abs(n - pagina) <= 1)
                      .map((n, i, arr) => (
                        <span key={n} className="flex items-center">
                          {i > 0 && arr[i - 1] !== n - 1 && (
                            <span className="px-1 text-[var(--lux-warm-gray)]">…</span>
                          )}
                          <button
                            onClick={() => setPagina(n)}
                            className={`w-10 h-10 rounded-full text-sm transition-all duration-300 ${
                              pagina === n
                                ? "bg-[var(--lux-deep)] text-[var(--lux-cream)]"
                                : "text-[var(--lux-warm-gray)] hover:bg-white border border-transparent hover:border-[var(--lux-gold)]/20"
                            }`}
                          >
                            {n}
                          </button>
                        </span>
                      ))}
                    <button
                      onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                      disabled={pagina >= totalPaginas}
                      className="w-10 h-10 rounded-full border border-[var(--lux-gold)]/25 flex items-center justify-center text-[var(--lux-warm-gray)] hover:border-[var(--lux-gold)] disabled:opacity-30 transition-colors"
                      aria-label="Próxima página"
                    >
                      <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <ProdutosTrustBar />

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 text-center bg-[var(--lux-cream)]">
        <h2 className="text-2xl sm:text-3xl text-[var(--lux-deep)]" style={{ fontFamily: "var(--font-display)" }}>
          Não encontrou o que procura?
        </h2>
        <p className="text-sm text-[var(--lux-warm-gray)] mt-3 mb-8">Estamos à disposição para ajudar.</p>
        <Link
          href="/contato"
          className="inline-flex px-10 py-3.5 rounded-full bg-[var(--lux-deep)] text-[var(--lux-cream)] text-[10px] uppercase tracking-[0.2em] hover:bg-[var(--lux-deep-soft)] transition-colors"
        >
          Fale conosco
        </Link>
      </section>

      <div className="bg-[var(--lux-deep)]">
        <SiteFooter />
      </div>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--lux-cream)] flex flex-col">
          <StoreHeader />
          <div className="flex-1 flex items-center justify-center py-32">
            <div className="lux-spinner" />
          </div>
        </div>
      }
    >
      <ProdutosContent />
    </Suspense>
  );
}
