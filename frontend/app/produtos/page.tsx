"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";
import { StoreHeader } from "@/components/StoreHeader";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  estoque: number;
  categoria_nome?: string;
  categoria_slug?: string;
  descricao?: string;
}

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  descricao?: string;
}

function ProdutosContent() {
  const searchParams = useSearchParams();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(searchParams.get("categoria") || null);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState(searchParams.get("q") || "");
  const [carrinho, setCarrinho] = useState<any[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    const cat = searchParams.get("categoria");
    if (q) setTermoBusca(q);
    if (cat) setCategoriaSelecionada(cat);
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API_URL}/categorias`).then(res => res.json()).then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    setCarregando(true);
    const url = categoriaSelecionada 
      ? `${API_URL}/produtos?categoria=${categoriaSelecionada}` 
      : `${API_URL}/produtos`;
    fetch(url).then(res => res.json()).then(data => setProdutos(data || [])).catch(() => setProdutos([])).finally(() => setCarregando(false));
  }, [categoriaSelecionada]);

  const adicionarAoCarrinho = (produto: Produto) => {
    const novo = [...carrinho];
    const idx = novo.findIndex((i: any) => i.id === produto.id);
    if (idx >= 0) novo[idx].quantidade = (novo[idx].quantidade || 1) + 1;
    else novo.push({ ...produto, quantidade: 1 });
    setCarrinho(novo);
    localStorage.setItem("carrinho", JSON.stringify(novo));
    window.dispatchEvent(new Event("carrinho-changed"));

    const notif = document.createElement("div");
    notif.className = "fixed top-5 right-5 z-[10000] px-6 py-4 rounded-xl font-bold text-sm text-white shadow-xl";
    notif.style.background = "var(--success)";
    notif.textContent = `✓ ${produto.nome} adicionado ao carrinho!`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  };

  const [ordem, setOrdem] = useState<"recente" | "nome" | "preco">("recente");
  const produtosFiltrados = produtos
    .filter(p => p.nome.toLowerCase().includes(termoBusca.toLowerCase()))
    .sort((a, b) => {
      if (ordem === "nome") return (a.nome || "").localeCompare(b.nome || "");
      if (ordem === "preco") return Number(a.preco) - Number(b.preco);
      return (b.id || 0) - (a.id || 0);
    });

  const totalItens = carrinho.reduce((acc: number, i: any) => acc + (i.quantidade || 1), 0);

  const categoriaAtual = categorias.find(c => c.slug === categoriaSelecionada);

  const getProdutoImagem = (p: Produto | any) => {
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
  };

  return (
    <div className="min-h-screen bg-[#f5f5f4]">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      {/* HERO - Estilo referência: leve, clean */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-[#f5f5f4] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#374151] mb-2" style={{ fontFamily: "var(--font-logo)" }}>
                {categoriaAtual?.nome || "Produtos"}
              </h1>
              <p className="text-[var(--muted)] text-base sm:text-lg">{categoriaAtual?.descricao || "Fragrâncias exclusivas e produtos de banho que transformam seu dia a dia."}</p>
            </div>
            <p className="text-[#374151] text-lg sm:text-xl font-medium max-w-xs" style={{ fontFamily: "var(--font-logo)" }}>
              fragrâncias que contam histórias
            </p>
          </div>
        </div>
      </section>

      {/* BREADCRUMBS */}
      <div className="bg-white border-b border-[var(--border)] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <Link href="/" className="text-[var(--muted)] hover:text-[var(--accent)]">Home</Link>
            <span className="text-[var(--muted)] mx-2">›</span>
            <span className="text-[var(--accent)] font-semibold">{categoriaAtual?.nome || "Produtos"}</span>
          </nav>
        </div>
      </div>

      {/* CONTEÚDO - Sidebar + Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtros */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden lg:sticky lg:top-36">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-bold text-[var(--foreground)] text-sm uppercase tracking-wider">Filtrar por</h3>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setCategoriaSelecionada(null)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                    categoriaSelecionada === null ? "bg-[var(--accent-light)] text-[var(--accent)]" : "text-[var(--foreground)] hover:bg-[var(--warm-100)]"
                  }`}
                >
                  <span>Todos os produtos</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaSelecionada(cat.slug)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left text-sm font-medium transition-colors ${
                      categoriaSelecionada === cat.slug ? "bg-[var(--accent-light)] text-[var(--accent)]" : "text-[var(--foreground)] hover:bg-[var(--warm-100)]"
                    }`}
                  >
                    <span>{cat.nome}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-[var(--border)]">
                <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Buscar</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--warm-50)] text-sm focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div className="flex-1 min-w-0">
            {carregando ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-14 h-14 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mb-6" />
                <p className="text-[var(--muted)] font-medium">Carregando produtos...</p>
              </div>
            ) : produtosFiltrados.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-[var(--border)]">
                <div className="text-6xl mb-6">🌿</div>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Nenhum produto encontrado</h3>
                <p className="text-[var(--muted)] mb-8">Tente outra categoria ou termo de busca.</p>
                <button onClick={() => { setCategoriaSelecionada(null); setTermoBusca(""); }} className="btn-primary rounded-xl px-8 py-4">
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                {/* Header: Total + Ordenar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <p className="text-[var(--muted)] text-sm">
                    Total de <span className="font-semibold text-[var(--foreground)]">{produtosFiltrados.length}</span> produto{produtosFiltrados.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--muted)]">Ordenar por:</span>
                    <select
                      value={ordem}
                      onChange={(e) => setOrdem(e.target.value as any)}
                      className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-white text-sm font-medium text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] outline-none"
                    >
                      <option value="recente">Mais recentes</option>
                      <option value="nome">Nome (A–Z)</option>
                      <option value="preco">Menor preço</option>
                    </select>
                  </div>
                </div>

                {/* Cards - Estilo referência */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {produtosFiltrados.map((produto, idx) => (
                    <div key={produto.id} className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col hover:shadow-lg hover:border-[var(--border-strong)] transition-all">
                      <Link href={`/produto/${produto.id}`} className="block flex-1">
                        <div className="relative aspect-square bg-[#fafafa] flex items-center justify-center p-6">
                          <img
                            src={getProdutoImagem(produto)}
                            alt={produto.nome}
                            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85"; }}
                          />
                          {idx < 2 && (
                            <span className="absolute top-3 left-3 px-2.5 py-1 bg-[var(--accent)] text-white text-[10px] font-bold uppercase rounded-lg">Lançamento</span>
                          )}
                          {produto.estoque <= 5 && produto.estoque > 0 && (
                            <span className="absolute top-3 right-3 px-2.5 py-1 bg-[var(--foreground)]/90 text-white text-[10px] font-bold uppercase rounded-lg">Últimas unidades</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-[var(--foreground)] text-sm sm:text-base mb-1.5 line-clamp-2 leading-snug">{produto.nome}</h3>
                          {produto.descricao && <p className="text-[var(--muted)] text-xs line-clamp-2 mb-3">{produto.descricao}</p>}
                          <div className="space-y-1">
                            <div className="text-xl font-black text-[var(--accent)]">R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</div>
                            <p className="text-xs text-[var(--muted)]">ou 3x R$ {(Number(produto.preco) / 3).toFixed(2).replace(".", ",")}</p>
                          </div>
                        </div>
                      </Link>
                      <div className="p-4 pt-0 flex gap-2">
                        <Link href={`/produto/${produto.id}`} className="flex-1 py-3 bg-[var(--accent)] text-white font-bold text-sm rounded-xl text-center hover:bg-[var(--accent-hover)] transition-colors">
                          Comprar
                        </Link>
                        <button
                          onClick={(e) => { e.preventDefault(); adicionarAoCarrinho(produto); }}
                          disabled={produto.estoque === 0}
                          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Adicionar ao carrinho"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* CTA BOTTOM */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-[var(--accent-light)] to-[var(--warm-100)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-4">Não encontrou o que procura?</h2>
          <p className="text-[var(--muted)] mb-8">Entre em contato conosco. Estamos à disposição para ajudar.</p>
          <Link href="/contato" className="btn-primary text-lg px-12 py-4 rounded-2xl">
            Fale Conosco
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1c1917] text-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 no-underline text-white hover:opacity-90">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 invert opacity-90" />
            <span className="font-bold">Empório Bothânico</span>
          </Link>
          <div className="flex gap-6 text-sm">
            <Link href="/" className="text-white/70 hover:text-white transition-colors">Início</Link>
            <Link href="/produtos" className="text-white/70 hover:text-white transition-colors">Produtos</Link>
            <Link href="/contato" className="text-white/70 hover:text-white transition-colors">Contato</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-white/20 text-center text-white/60 text-sm">
          © 2026 Empório Bothânico. CNPJ: 04.280.033/0001-93
        </div>
      </footer>
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-14 h-14 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
      </div>
    }>
      <ProdutosContent />
    </Suspense>
  );
}
