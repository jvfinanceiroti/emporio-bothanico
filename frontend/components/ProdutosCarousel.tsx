"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { SectionHeading } from "@/components/luxury/SectionHeading";
import type { Produto } from "@/lib/catalogo";

export function ProdutosCarousel({
  produtos,
  carregando = false,
  getProdutoImagem,
  adicionarAoCarrinho,
  ultimoAdicionadoId,
  luxury = false,
}: {
  produtos: Produto[];
  carregando?: boolean;
  getProdutoImagem: (p: Produto) => string;
  adicionarAoCarrinho: (p: Produto, e: React.MouseEvent) => void;
  ultimoAdicionadoId?: number | null;
  luxury?: boolean;
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
  const paginas = Array.from({ length: totalPaginas }, (_, i) =>
    sliceProdutos.slice(i * perPage, (i + 1) * perPage)
  );

  const sectionCls = luxury
    ? "lux-section-dark py-20 sm:py-28 px-4 sm:px-6 lg:px-10"
    : "py-16 lg:py-24 px-4 sm:px-6 bg-white";

  if (carregando) {
    return (
      <section className={sectionCls}>
        <div className="max-w-[1440px] mx-auto">
          {luxury ? (
            <SectionHeading eyebrow="Coleção" title="Queridinhos do Empório" light />
          ) : (
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-8">Queridinhos do Empório</h2>
          )}
          <div className="flex flex-col items-center py-24">
            <div className={luxury ? "lux-spinner mb-6" : "w-14 h-14 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mb-6"} />
            <p className={luxury ? "text-[var(--lux-cream)]/50 text-sm" : "text-[var(--muted)]"}>Carregando produtos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (produtos.length === 0) {
    return (
      <section className={sectionCls}>
        <div className="max-w-[1440px] mx-auto text-center py-20">
          <p className={luxury ? "text-[var(--lux-cream)]/50" : "text-[var(--muted)]"} style={luxury ? { fontFamily: "var(--font-display)" } : undefined}>
            Novos produtos em breve...
          </p>
          <Link
            href="/produtos"
            className={luxury ? "inline-block mt-6 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]" : "btn-primary mt-6 inline-flex"}
          >
            Ver Catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionCls}>
      <div className="max-w-[1440px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-10 sm:mb-14">
          {luxury ? (
            <SectionHeading eyebrow="Coleção" title="Queridinhos do Empório" light />
          ) : (
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]" style={{ color: "#2d5a4a" }}>
              Queridinhos do Empório
            </h2>
          )}
          <Link
            href="/produtos"
            className={`hidden sm:inline-flex items-center gap-2 shrink-0 mb-12 ${
              luxury
                ? "text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/70 hover:text-[var(--lux-gold)] transition-colors"
                : "text-sm font-semibold text-[var(--accent)] hover:underline"
            }`}
          >
            Ver todos
            {luxury && <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index <= 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-400 disabled:opacity-30 disabled:pointer-events-none ${
              luxury
                ? "border border-[var(--lux-gold)]/30 text-[var(--lux-gold)] hover:border-[var(--lux-gold)] hover:bg-[var(--lux-gold)]/10"
                : "bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)]"
            }`}
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            disabled={index >= totalPaginas - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-400 disabled:opacity-30 disabled:pointer-events-none ${
              luxury
                ? "border border-[var(--lux-gold)]/30 text-[var(--lux-gold)] hover:border-[var(--lux-gold)] hover:bg-[var(--lux-gold)]/10"
                : "bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)]"
            }`}
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalPaginas }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-400 ${
                  luxury
                    ? i === index ? "w-6 h-1.5 bg-[var(--lux-gold)]" : "w-1.5 h-1.5 bg-[var(--lux-gold)]/25"
                    : i === index ? "w-2.5 h-2.5 bg-[var(--accent)] scale-110" : "w-2.5 h-2.5 bg-[var(--muted-light)]"
                }`}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(paginas[index] || []).map((produto, idx) => (
              <motion.div
                key={produto.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
                className={`group flex flex-col rounded-[22px] overflow-hidden lux-card-hover ${
                  luxury
                    ? "bg-[var(--lux-deep-soft)] border border-[var(--lux-gold)]/10 hover:border-[var(--lux-gold)]/25"
                    : "bg-white border border-[var(--border)]"
                }`}
              >
                <Link href={`/produto/${produto.id}`} className="block flex-1">
                  <div className={`relative aspect-square flex items-center justify-center p-4 overflow-hidden ${luxury ? "bg-[#0a1a14]" : "bg-[#fafafa]"}`}>
                    <img
                      src={getProdutoImagem(produto)}
                      alt={produto.nome}
                      className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80";
                      }}
                    />
                    {produto.estoque <= 5 && produto.estoque > 0 && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] uppercase tracking-wider rounded-full ${
                        luxury ? "bg-[var(--lux-gold)]/90 text-[var(--lux-deep)]" : "bg-[var(--foreground)] text-white"
                      }`}>
                        Últimas unidades
                      </span>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3
                      className={`text-sm sm:text-base line-clamp-2 mb-2 ${
                        luxury ? "text-[var(--lux-cream)]" : "font-bold text-[var(--foreground)]"
                      }`}
                      style={luxury ? { fontFamily: "var(--font-display)" } : undefined}
                    >
                      {produto.nome}
                    </h3>
                    <p className={`text-lg ${luxury ? "text-[var(--lux-gold)]" : "font-black text-[var(--foreground)]"}`} style={luxury ? { fontFamily: "var(--font-display)" } : undefined}>
                      R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </Link>
                <div className="p-4 sm:p-5 pt-0 flex gap-2">
                  <Link
                    href={`/produto/${produto.id}`}
                    className={`flex-1 py-3 text-center text-[10px] uppercase tracking-[0.15em] font-medium rounded-full transition-all duration-400 ${
                      luxury
                        ? "bg-[var(--lux-gold)] text-[var(--lux-deep)] hover:bg-[var(--lux-gold-light)]"
                        : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
                    }`}
                  >
                    Comprar
                  </Link>
                  <button
                    onClick={(e) => adicionarAoCarrinho(produto, e)}
                    disabled={produto.estoque === 0}
                    className={`shrink-0 flex items-center justify-center rounded-full border transition-all duration-400 disabled:opacity-40 ${
                      ultimoAdicionadoId === produto.id
                        ? luxury ? "bg-[var(--lux-gold)]/20 border-[var(--lux-gold)] text-[var(--lux-gold)] px-3" : "bg-[var(--success)] border-[var(--success)] text-white px-3"
                        : luxury
                          ? "w-11 h-11 border-[var(--lux-gold)]/30 text-[var(--lux-gold)] hover:border-[var(--lux-gold)]"
                          : "w-12 h-12 border-[var(--accent)] text-[var(--accent)]"
                    }`}
                    aria-label="Adicionar ao carrinho"
                  >
                    {ultimoAdicionadoId === produto.id ? (
                      <Check className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
