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
      <header className="sticky top-0 z-50">
        <StoreHeader />
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
