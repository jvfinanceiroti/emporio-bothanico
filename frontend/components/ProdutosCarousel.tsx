"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function ProdutosCarousel({
  produtos,
  carregando = false,
  getProdutoImagem,
  adicionarAoCarrinho,
  ultimoAdicionadoId,
}: {
  produtos: any[];
  carregando?: boolean;
  getProdutoImagem: (p: any) => string;
  adicionarAoCarrinho: (p: any, e: React.MouseEvent) => void;
  ultimoAdicionadoId?: number | null;
}) {
  const [index, setIndex] = useState(0);
  const [perPage, setPerPage] = useState(4);
  useEffect(() => {
    const upd = () => setPerPage(window.innerWidth >= 1280 ? 4 : window.innerWidth >= 768 ? 3 : 2);
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);
  const sliceProdutos = produtos.slice(0, 12);
  const totalPaginas = Math.max(1, Math.ceil(sliceProdutos.length / perPage));
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, totalPaginas - 1)));
  const paginas = Array.from({ length: totalPaginas }, (_, i) => sliceProdutos.slice(i * perPage, (i + 1) * perPage));

  if (carregando) {
    return (
      <section className="py-20 lg:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]" style={{ color: "#2d5a4a" }}>Queridinhos do Empório</h2>
          </div>
          <div className="text-center py-24 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
            <div className="w-14 h-14 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-6" />
            <p className="text-[var(--muted)] font-medium">Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (produtos.length === 0) {
    return (
      <section className="py-20 lg:py-28 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-24 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
            <div className="text-6xl mb-4">🌿</div>
            <p className="text-[var(--muted)] text-lg font-medium">Novos produtos em breve...</p>
            <Link href="/produtos" className="btn-primary mt-6 inline-flex">Ver Catálogo</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]" style={{ color: "#2d5a4a" }}>Queridinhos do Empório</h2>
          <Link href="/produtos" className="text-sm font-semibold text-[var(--accent)] hover:underline shrink-0">Ver todos →</Link>
        </div>
        <div className="relative">
          <button onClick={() => goTo(index - 1)} disabled={index <= 0} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:pointer-events-none" aria-label="Anterior">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={() => goTo(index + 1)} disabled={index >= totalPaginas - 1} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:pointer-events-none" aria-label="Próximo">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button key={i} onClick={() => goTo(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? "bg-[var(--accent)] scale-110" : "bg-[var(--muted-light)] hover:bg-[var(--muted)]"}`} aria-label={`Página ${i + 1}`} />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(paginas[index] || []).map((produto) => (
              <div key={produto.id} className="group bg-white rounded-2xl border border-[var(--border)] overflow-hidden hover:shadow-xl transition-all flex flex-col">
                <Link href={`/produto/${produto.id}`} className="block flex-1">
                  <div className="relative aspect-square bg-[#fafafa] flex items-center justify-center p-4">
                    <img src={getProdutoImagem(produto)} alt={produto.nome} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80"; }} />
                    {produto.estoque <= 5 && produto.estoque > 0 && <span className="absolute top-3 left-3 px-2.5 py-1 bg-[var(--foreground)] text-white text-[10px] font-bold uppercase rounded-lg">Últimas unidades</span>}
                    {produtos.indexOf(produto) < 2 && <span className="absolute top-3 right-3 px-2.5 py-1 bg-white border-2 border-[var(--accent)] text-[var(--accent)] text-[10px] font-bold uppercase rounded-lg">Lançamento</span>}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm sm:text-base font-bold text-[var(--foreground)] mb-1 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">{produto.nome}</h3>
                    {produto.descricao && <p className="text-xs text-[var(--muted)] line-clamp-2 mb-3">{produto.descricao}</p>}
                    <div className="mb-3">
                      <span className="text-lg sm:text-xl font-black text-[var(--foreground)]">R$ {Number(produto.preco).toFixed(2).replace(".", ",")}</span>
                      <span className="text-xs text-[var(--muted)] ml-1">ou 3x R$ {(Number(produto.preco) / 3).toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                </Link>
                <div className="p-4 pt-0 flex gap-2">
                  <Link href={`/produto/${produto.id}`} className="flex-1 py-3 bg-[var(--accent)] text-white font-bold text-sm rounded-xl text-center hover:bg-[var(--accent-hover)] transition-colors">Comprar</Link>
                  <button onClick={(e) => adicionarAoCarrinho(produto, e)} disabled={produto.estoque === 0} className={`shrink-0 flex items-center justify-center gap-2 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${ultimoAdicionadoId === produto.id ? "bg-[var(--success)] border-[var(--success)] text-white px-3 py-2.5" : "w-12 h-12 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-light)]"}`} aria-label={ultimoAdicionadoId === produto.id ? "Adicionado ao carrinho" : "Adicionar ao carrinho"}>
                    {ultimoAdicionadoId === produto.id ? (
                      <><svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg><span className="font-bold text-sm whitespace-nowrap">Adicionado!</span></>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
