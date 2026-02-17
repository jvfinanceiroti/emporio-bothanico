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
    <div className="min-h-screen bg-[var(--background)]">
      {/* TOP BAR */}
      <div className="bg-gradient-to-r from-[var(--accent)] to-[#3d6b5a] text-white py-3 text-center text-sm font-medium tracking-wide">
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
              <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg text-[var(--foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
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
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-gradient-to-br from-[#1c1917] via-[#252320] to-[#1c1917]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[var(--accent-light)] font-semibold text-xs sm:text-sm uppercase tracking-[0.25em] mb-2 sm:mb-3">Catálogo</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-3 sm:mb-4">
            Nossos Produtos
          </h1>
          <p className="text-white/85 text-base sm:text-lg max-w-xl">
            Fragrâncias exclusivas e produtos de banho selecionados para transformar seu dia a dia.
          </p>
        </div>
      </section>

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Barra de busca + filtros - Layout responsivo */}
        <div className="mb-8 sm:mb-12">
          <div className="relative max-w-xl mb-6">
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="w-full pl-12 pr-12 py-4 sm:py-4 rounded-2xl border-2 border-[var(--border)] bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 outline-none transition-all"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {termoBusca && (
              <button onClick={() => setTermoBusca("")} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[var(--accent-light)] text-[var(--accent)] flex items-center justify-center font-bold hover:bg-[var(--accent)] hover:text-white transition-colors">
                ×
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setCategoriaSelecionada(null)}
              className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 ${
                categoriaSelecionada === null 
                  ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                  : "bg-white text-[var(--muted)] border-2 border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              <span>✨</span> Todos
            </button>
            {categorias.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoriaSelecionada(cat.slug)}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  categoriaSelecionada === cat.slug 
                    ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20" 
                    : "bg-white text-[var(--muted)] border-2 border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                <span>{iconesCategoria[cat.slug] || "📦"}</span>
                {cat.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Produtos - Premium */}
        {carregando ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-14 h-14 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mb-6" />
            <p className="text-[var(--muted)] font-medium">Carregando produtos...</p>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-24 sm:py-32 bg-white rounded-3xl border-2 border-[var(--border)] shadow-[var(--shadow-md)]">
            <div className="text-6xl sm:text-7xl mb-6">🌿</div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">Nenhum produto encontrado</h3>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">Tente outra categoria ou termo de busca.</p>
            <button onClick={() => { setCategoriaSelecionada(null); setTermoBusca(""); }} className="btn-primary rounded-2xl px-8 py-4">
              Limpar Filtros
            </button>
          </div>
        ) : (
          <>
            <p className="text-[var(--muted)] text-sm mb-6 sm:mb-8">
              <span className="font-semibold text-[var(--foreground)]">{produtosFiltrados.length}</span> produto{produtosFiltrados.length !== 1 ? "s" : ""} encontrado{produtosFiltrados.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {produtosFiltrados.map((produto) => (
                <Link key={produto.id} href={`/produto/${produto.id}`} className="group no-underline block">
                  <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden h-full flex flex-col border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-xl)] hover:border-[var(--border-strong)] hover:-translate-y-2 transition-all duration-300">
                    <div className="relative aspect-[1] bg-[var(--warm-100)] overflow-hidden">
                      <img 
                        src={getProdutoImagem(produto)} 
                        alt={produto.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85"; }}
                      />
                      {produto.estoque <= 5 && produto.estoque > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 bg-[var(--foreground)]/90 text-white text-xs font-bold uppercase rounded-xl backdrop-blur-sm">Últimas unidades</span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col">
                      {produto.categoria_nome && (
                        <span className="text-[10px] sm:text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-1.5">{produto.categoria_nome}</span>
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors leading-snug">{produto.nome}</h3>
                      {produto.descricao && <p className="text-sm text-[var(--muted)] line-clamp-2 mb-4 flex-1 leading-relaxed">{produto.descricao}</p>}
                      <div className="mt-auto space-y-3">
                        <div className="text-xl sm:text-2xl font-black text-[var(--foreground)]">R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</div>
                        <p className={`text-xs font-semibold flex items-center gap-2 ${produto.estoque > 5 ? "text-[var(--success)]" : "text-[var(--warning)]"}`}>
                          <span className={`w-2 h-2 rounded-full ${produto.estoque > 5 ? "bg-[var(--success)]" : "bg-[var(--warning)]"}`} />
                          {produto.estoque} em estoque
                        </p>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adicionarAoCarrinho(produto); }}
                          disabled={produto.estoque === 0}
                          className="w-full py-3.5 sm:py-4 bg-[var(--accent)] text-white font-bold rounded-xl sm:rounded-2xl border-2 border-[var(--accent)] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--accent)] text-sm sm:text-base"
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
