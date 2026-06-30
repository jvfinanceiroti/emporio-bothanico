"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/luxury/SectionHeading";
import { LuxuryProductCard } from "@/components/luxury/LuxuryProductCard";
import type { Produto } from "@/lib/catalogo";

interface HomeBestSellersProps {
  produtos: Produto[];
  carregando: boolean;
  getProdutoImagem: (p: Produto) => string;
  onAddToCart: (produto: Produto, e: React.MouseEvent) => void;
  ultimoAdicionadoId: number | null;
}

export function HomeBestSellers({
  produtos,
  carregando,
  getProdutoImagem,
  onAddToCart,
  ultimoAdicionadoId,
}: HomeBestSellersProps) {
  const maisVendidos = produtos.slice(0, 8);

  return (
    <section id="mais-vendidos" className="lux-section-cream py-14 sm:py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 sm:mb-10">
          <SectionHeading
            eyebrow="Seleção especial"
            title="Mais vendidos"
            subtitle="Os favoritos de quem já conhece a essência Empório Bothânico."
            compact
          />
          <Link
            href="/produtos"
            className="hidden sm:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold-muted)] hover:text-[var(--lux-gold)] transition-colors duration-400 shrink-0 mb-8"
          >
            Ver todos
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        {carregando && maisVendidos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="lux-spinner mb-6" />
            <p className="text-sm text-[var(--lux-warm-gray)]">Carregando coleção...</p>
          </div>
        ) : maisVendidos.length === 0 ? (
          <div className="text-center py-20 rounded-[22px] border border-[var(--lux-gold)]/10 bg-white">
            <p className="text-[var(--lux-warm-gray)]" style={{ fontFamily: "var(--font-display)" }}>
              Novos produtos em breve
            </p>
            <Link
              href="/produtos"
              className="inline-block mt-6 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold-muted)] hover:text-[var(--lux-gold)]"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {maisVendidos.map((produto, i) => (
              <LuxuryProductCard
                key={produto.id}
                produto={produto}
                imagem={getProdutoImagem(produto)}
                onAddToCart={onAddToCart}
                adicionado={ultimoAdicionadoId === produto.id}
                index={i}
                compact
              />
            ))}
          </div>
        )}

        <div className="sm:hidden text-center mt-10">
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold-muted)]"
          >
            Ver todos os produtos
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
