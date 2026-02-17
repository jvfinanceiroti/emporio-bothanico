"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/produtos`)
      .then(res => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setProdutos(arr.filter((p: any) => p.ativo !== false && (p.estoque ?? 0) > 0));
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        setProdutos([]);
      });
    fetch(`${API_URL}/categorias`).then(res => res.json()).then(setCategorias).catch(() => {});
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

  const adicionarAoCarrinho = (produto: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const novo = [...carrinho];
    const idx = novo.findIndex((i: any) => i.id === produto.id);
    if (idx >= 0) novo[idx].quantidade += 1;
    else novo.push({ ...produto, quantidade: 1 });
    setCarrinho(novo);
    localStorage.setItem("carrinho", JSON.stringify(novo));
    const btn = e.currentTarget as HTMLButtonElement;
    btn.textContent = "✓ Adicionado!";
    btn.classList.add("!bg-[var(--success)]", "!border-[var(--success)]");
    setTimeout(() => {
      btn.textContent = "Adicionar ao Carrinho";
      btn.classList.remove("!bg-[var(--success)]", "!border-[var(--success)]");
    }, 1500);
  };

  const totalItens = carrinho.reduce((acc: number, i: any) => acc + (i.quantidade || 1), 0);

  const categoriasDestaque = categorias.slice(0, 3).length > 0 ? categorias.slice(0, 3) : [
    { id: 1, nome: "Perfumes", slug: "perfume", descricao: "Fragrâncias exclusivas" },
    { id: 2, nome: "Aromas", slug: "aromas", descricao: "Ambientes perfumados" },
    { id: 3, nome: "Banho", slug: "banho", descricao: "Cuidados especiais" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* TOP BAR PROMOCIONAL */}
      <div className="bg-gradient-to-r from-[var(--accent)] to-[#3d6b5a] text-white py-3 text-center text-sm font-medium tracking-wide">
        <span className="hidden sm:inline">✨ Frete grátis em compras acima de R$ 199</span>
        <span className="sm:hidden">✨ Frete grátis acima de R$ 199</span>
        <span className="mx-2 opacity-80">•</span>
        <span>Entrega para todo o Brasil</span>
      </div>

      {/* HEADER PREMIUM */}
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
              <Link href="/produtos" className="px-4 py-2 rounded-lg text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors">Produtos</Link>
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
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full border-2 border-white">
                  {totalItens}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO FULL-SCREEN */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&q=80)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/75" />
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-white/90 text-sm font-semibold uppercase tracking-[0.3em] mb-4">Perfumaria Premium</p>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
            Fragrâncias que<br /><span className="text-[var(--accent-light)]">Contam Histórias</span>
          </h2>
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Cada essência é selecionada para uma experiência única. Descubra produtos que transformam momentos comuns em memórias especiais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produtos" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[var(--foreground)] font-bold text-lg rounded-xl hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-all hover:scale-105 shadow-xl">
              Explorar Coleção
            </Link>
            <Link href="/produtos" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white hover:text-[var(--foreground)] transition-all">
              Ver Produtos
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-10 lg:gap-20 mt-16 text-white/95">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black">1000+</div>
              <div className="text-sm font-medium tracking-wide">Produtos Vendidos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-2xl stars-google">★</span>
                <span className="text-3xl lg:text-4xl font-black">5,0</span>
              </div>
              <div className="text-sm font-medium tracking-wide">18 avaliações Google</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-black">24h</div>
              <div className="text-sm font-medium tracking-wide">Envio Rápido</div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIAS - Explore */}
      {categoriasDestaque.length > 0 && (
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-[0.2em] mb-2">Navegue</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] mb-14">Explore por Categoria</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {categoriasDestaque.map((cat: any) => (
                <Link 
                  key={cat.id} 
                  href={cat.slug ? `/produtos?categoria=${cat.slug}` : "/produtos"}
                  className="group relative overflow-hidden rounded-[var(--radius-xl)] aspect-[4/3] bg-gradient-to-br from-[var(--accent-light)] via-[var(--warm-50)] to-white border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300 hover:shadow-[var(--shadow-lg)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-[var(--foreground)]">
                    <h3 className="text-xl font-bold mb-1">{cat.nome}</h3>
                    <p className="text-sm text-[var(--muted)]">{cat.descricao || "Ver produtos"}</p>
                    <span className="text-[var(--accent)] font-semibold mt-2 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explorar
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUTOS EM DESTAQUE */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-widest mb-2">Nossa Seleção</p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--foreground)]">Produtos em Destaque</h2>
            </div>
            <Link href="/produtos" className="btn-primary shrink-0">
              Ver Todos os Produtos
            </Link>
          </div>

          {produtos.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-[var(--border)]">
              <div className="text-6xl mb-4">🌿</div>
              <p className="text-[var(--muted)] text-lg font-medium">Novos produtos em breve...</p>
              <Link href="/produtos" className="btn-primary mt-6 inline-flex">Ver Catálogo</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {produtos.slice(0, 8).map((produto) => (
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
                          onClick={(e) => adicionarAoCarrinho(produto, e)}
                          disabled={produto.estoque === 0}
                          className="w-full py-3.5 bg-[var(--foreground)] text-white font-bold rounded-xl border-2 border-[var(--foreground)] hover:bg-white hover:text-[var(--foreground)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--foreground)] disabled:hover:text-white"
                        >
                          Adicionar ao Carrinho
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BANNER BENEFÍCIOS */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-[var(--accent)] via-[#2d5a4a] to-[#234a3d] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-center mb-14">Por que comprar conosco?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Nacional</h3>
              <p className="text-white/90 text-sm">Enviamos para todo o Brasil com rastreamento</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Qualidade Garantida</h3>
              <p className="text-white/90 text-sm">Produtos 100% originais</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Pagamento Seguro</h3>
              <p className="text-white/90 text-sm">Ambiente criptografado</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Embalagem Premium</h3>
              <p className="text-white/90 text-sm">Cuidadosamente embalado para presentear</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--accent-light)] text-[var(--accent)] mb-6">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Receba novidades e ofertas</h2>
          <p className="text-[var(--muted)] text-sm mb-8">Cadastre seu e-mail e seja o primeiro a saber de lançamentos e promoções exclusivas.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="seu@email.com" className="input-store flex-1 rounded-xl" />
            <button type="submit" className="btn-primary shrink-0 rounded-xl">Cadastrar</button>
          </form>
        </div>
      </section>

      {/* INSTAGRAM - Siga-nos */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[var(--background)] to-[#f0f4f2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-[0.25em] mb-3">Nosso dia a dia</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] mb-4">Siga-nos no Instagram</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-8">Fragrâncias, novidades e um pouquinho da nossa loja em Itabira.</p>
            <a
              href="https://www.instagram.com/emporiobothanicoita/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 shadow-lg"
              style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @emporiobothanicoita
            </a>
          </div>
          {/* Bento grid - galeria inspirada em feed */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 max-w-4xl mx-auto">
            {[
              { img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80", alt: "Perfumes" },
              { img: "https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=400&q=80", alt: "Velas aromáticas" },
              { img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80", alt: "Produtos de banho" },
              { img: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80", alt: "Difusores" },
              { img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80", alt: "Fragrâncias", span: "md:col-span-2" },
              { img: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&q=80", alt: "Sabonetes artesanais", span: "md:col-span-2" },
            ].map((item, i) => (
              <a
                key={i}
                href="https://www.instagram.com/emporiobothanicoita/"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative aspect-square rounded-2xl overflow-hidden ${item.span || ""}`}
              >
                <img src={item.img} alt={item.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">@emporiobothanicoita</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES REAIS DO GOOGLE */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-white to-[var(--warm-100)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-[0.2em] mb-4 text-center">Avaliações reais</p>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--foreground)] text-center mb-6">O que dizem nossos clientes no Google</h2>
          {/* Badge de estrelas e total */}
          <div className="flex flex-col items-center mb-14">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white border border-[var(--border)] shadow-[var(--shadow-md)]">
              <span className="text-3xl font-black text-[var(--foreground)]">5,0</span>
              <span className="flex gap-0.5 text-2xl stars-google">{"★".repeat(5)}</span>
              <span className="text-[var(--muted)] text-sm">•</span>
              <span className="text-[var(--muted)] font-medium">18 avaliações no Google</span>
            </div>
            <a
              href="https://www.google.com/maps/search/Emp%C3%B3rio+Both%C3%A2nico+Itabira+MG"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-[var(--accent)] font-semibold text-sm hover:underline"
            >
              Ver todas as 18 avaliações no Google →
            </a>
          </div>
          <p className="text-center text-[var(--muted)] text-sm mb-10">Mostrando algumas das nossas avaliações. Tem mais no Google!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { nome: "Ana Paula Morais", iniciais: "AP", texto: "Que loja maravilhosa, cheirosa, cheia de detalhes, tudo encanta! Mas eu preciso destacar o conhecimento que a Nayara tem sobre os aromas, e suas aplicações! Coloquei um aroma na minha empresa e todos os dias é uma chuva de elogios.", extra: "Local Guide • Google" },
              { nome: "César Marcos", iniciais: "CM", texto: "Eu trabalho de home office e ganhei um aromatizador para ambiente de alecrim. O cheiro é simplesmente maravilhoso, melhora o meu humor e me faz sentir melhor. Simplesmente perfeito!", extra: "Local Guide • Google" },
            ].map((av, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all">
                <div className="flex gap-1 mb-3 text-lg stars-google">{"★".repeat(5)}</div>
                <blockquote className="text-[var(--foreground)] leading-relaxed mb-4 text-sm">
                  &ldquo;{av.texto}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-sm font-bold text-[var(--accent)] shrink-0">{av.iniciais}</div>
                  <div>
                    <div className="font-bold text-[var(--foreground)]">{av.nome}</div>
                    <div className="text-xs text-[var(--muted)]">{av.extra}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-br from-[var(--accent-light)] via-[var(--accent-warm)] to-[var(--warm-100)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl lg:text-4xl font-extrabold text-[var(--foreground)] mb-4">Pronto para descobrir?</h2>
          <p className="text-[var(--muted)] mb-10 text-lg">Explore nossa coleção completa de fragrâncias e produtos para banho.</p>
          <Link href="/produtos" className="btn-primary text-lg px-12 py-4 rounded-2xl">
            Ver Todos os Produtos
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1c1917] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <img src="/logo.png" alt="Logo" className="h-12 w-12 mb-4 invert opacity-90" />
              <h3 className="text-lg font-bold mb-2">Empório Bothânico</h3>
              <p className="text-white/70 text-sm leading-relaxed">Fragrâncias e produtos de banho selecionados para você.</p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Navegação</h4>
              <FooterLink href="/">Início</FooterLink>
              <FooterLink href="/produtos">Produtos</FooterLink>
              <FooterLink href="/sobre">Sobre Nós</FooterLink>
              <FooterLink href="/contato">Contato</FooterLink>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Atendimento</h4>
              <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
              <FooterLink href="/trocas">Trocas e Devoluções</FooterLink>
              <FooterLink href="/entregas">Política de Entrega</FooterLink>
              <FooterLink href="/privacidade">Privacidade</FooterLink>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Fale Conosco</h4>
              <p className="text-white/70 text-sm">📧 contato@emporiobothanico.com.br</p>
              <p className="text-white/70 text-sm mt-2">📱 (31) 3831-0866</p>
              <p className="text-white/70 text-sm mt-2">Seg-Sex: 9h às 18h</p>
              <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-white/70 hover:text-white transition-colors text-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                @emporiobothanicoita
              </a>
            </div>
          </div>
          <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
            <p>© 2026 Empório Bothânico. CNPJ: 04.280.033/0001-93</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-white/70 text-sm mb-3 hover:text-white transition-colors">
      {children}
    </Link>
  );
}
