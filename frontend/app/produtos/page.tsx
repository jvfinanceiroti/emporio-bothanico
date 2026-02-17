"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

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

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");
  const [carrinho, setCarrinho] = useState<any[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

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

    const notif = document.createElement("div");
    notif.className = "fixed top-5 right-5 z-[10000] px-6 py-4 rounded-xl font-bold text-sm text-white shadow-xl";
    notif.style.background = "var(--success)";
    notif.textContent = `✓ ${produto.nome} adicionado ao carrinho!`;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  };

  const produtosFiltrados = produtos.filter(p => 
    p.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const totalItens = carrinho.reduce((acc: number, i: any) => acc + (i.quantidade || 1), 0);

  const iconesCategoria: Record<string, string> = { perfume: "🌸", aromas: "🕯️", banho: "🛁" };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* TOP BAR */}
      <div className="bg-[var(--accent)] text-white py-2.5 text-center text-sm font-semibold">
        <span className="hidden sm:inline">✨ Frete grátis em compras acima de R$ 199 </span>
        <span className="sm:hidden">✨ Frete grátis acima de R$ 199</span>
        <span className="mx-2 opacity-75">|</span>
        <span>Entrega para todo o Brasil</span>
      </div>

      {/* HEADER */}
      <header className="store-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-3 no-underline group">
              <img src="/logo.png" alt="Empório Bothânico" className="h-10 w-10 lg:h-12 lg:w-12 object-contain" />
              <div>
                <h1 className="text-lg lg:text-xl font-extrabold text-[var(--foreground)] tracking-tight group-hover:text-[var(--accent)] transition-colors">Empório Bothânico</h1>
                <p className="text-[10px] lg:text-xs text-[var(--muted)] font-medium uppercase tracking-wider">Delicadezas & Banho</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/produtos" className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--accent)] bg-[var(--accent-light)]">Produtos</Link>
              <Link href="/meus-pedidos" className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors">Meus Pedidos</Link>
              <Link href="/sobre" className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors">Sobre</Link>
            </nav>

            <Link href="/carrinho" className="relative flex items-center gap-2 px-4 py-2.5 bg-[var(--foreground)] text-white rounded-xl font-bold text-sm hover:bg-[var(--accent)] transition-all hover:scale-105 active:scale-95">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
              Carrinho
              {totalItens > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">{totalItens}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO PRODUTOS */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-[var(--foreground)]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[var(--accent-light)] font-semibold text-sm uppercase tracking-[0.3em] mb-3">Catálogo Completo</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
            Nossos Produtos
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl">
            Descubra fragrâncias exclusivas e produtos de banho selecionados para transformar seu dia a dia.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Pesquisa e Categorias */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="input-store pl-12"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {termoBusca && (
              <button onClick={() => setTermoBusca("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors">
                ×
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoriaSelecionada(null)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                categoriaSelecionada === null 
                  ? "bg-[var(--foreground)] text-white shadow-lg" 
                  : "bg-white text-[var(--muted)] border-2 border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              ✨ Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSelecionada(cat.slug)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  categoriaSelecionada === cat.slug 
                    ? "bg-[var(--foreground)] text-white shadow-lg" 
                    : "bg-white text-[var(--muted)] border-2 border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                <span>{iconesCategoria[cat.slug] || "📦"}</span>
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos */}
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mb-4" />
            <p className="text-[var(--muted)] font-medium">Carregando produtos...</p>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-[var(--border)]">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Nenhum produto encontrado</h3>
            <p className="text-[var(--muted)] mb-6">Tente outra categoria ou termo de busca.</p>
            <button onClick={() => { setCategoriaSelecionada(null); setTermoBusca(""); }} className="btn-primary">
              Limpar Filtros
            </button>
          </div>
        ) : (
          <>
            <p className="text-[var(--muted)] text-sm mb-6">
              {produtosFiltrados.length} produto{produtosFiltrados.length !== 1 ? "s" : ""} encontrado{produtosFiltrados.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {produtosFiltrados.map((produto) => (
                <Link key={produto.id} href={`/produto/${produto.id}`} className="group no-underline">
                  <div className="store-card overflow-hidden h-full flex flex-col hover:-translate-y-1">
                    <div className="relative aspect-square bg-[var(--accent-light)] overflow-hidden">
                      {produto.imagem_url ? (
                        <img 
                          src={produto.imagem_url} 
                          alt={produto.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/400/fafafa/ccc?text=Produto"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">🌸</div>
                      )}
                      {produto.estoque <= 5 && produto.estoque > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--foreground)] text-white text-xs font-bold uppercase rounded-lg">Últimas unidades</span>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      {produto.categoria_nome && (
                        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-2">{produto.categoria_nome}</span>
                      )}
                      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">{produto.nome}</h3>
                      {produto.descricao && <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4 flex-1">{produto.descricao}</p>}
                      <div className="mt-auto">
                        <div className="text-2xl font-black text-[var(--foreground)] mb-3">R$ {Number(produto.preco).toFixed(2)}</div>
                        <p className={`text-xs font-semibold flex items-center gap-2 mb-4 ${produto.estoque > 5 ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
                          <span className={`w-2 h-2 rounded-full ${produto.estoque > 5 ? "bg-[var(--success)]" : "bg-[var(--warning)]"}`} />
                          {produto.estoque} em estoque
                        </p>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adicionarAoCarrinho(produto); }}
                          disabled={produto.estoque === 0}
                          className="w-full py-3.5 bg-[var(--foreground)] text-white font-bold rounded-xl border-2 border-[var(--foreground)] hover:bg-white hover:text-[var(--foreground)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--foreground)] disabled:hover:text-white"
                        >
                          {produto.estoque === 0 ? "Indisponível" : "Adicionar ao Carrinho"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* CTA BOTTOM */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--accent-light)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold text-[var(--foreground)] mb-4">Não encontrou o que procura?</h2>
          <p className="text-[var(--muted)] mb-6">Entre em contato conosco. Estamos à disposição para ajudar.</p>
          <Link href="/contato" className="btn-primary text-lg px-10 py-4">
            Fale Conosco
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--foreground)] text-white py-12 px-4 sm:px-6">
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
