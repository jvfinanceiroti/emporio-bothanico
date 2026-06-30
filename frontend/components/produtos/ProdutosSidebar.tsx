"use client";

import {
  Droplets,
  Flower2,
  Flame,
  Package,
  Gift,
  Sparkles,
  LayoutGrid,
  Search,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import type { Categoria, Produto } from "@/lib/catalogo";

const ICONES: Record<string, typeof Droplets> = {
  aromas: Droplets,
  aromaterapia: Flower2,
  banho: Droplets,
  "delicadezas-e-presentes": Gift,
  essencias: Flame,
  perfumes: Sparkles,
  kits: Package,
};

interface ProdutosSidebarProps {
  categorias: Categoria[];
  categoriaSelecionada: string | null;
  onCategoria: (slug: string | null) => void;
  termoBusca: string;
  onBusca: (v: string) => void;
  precoMin: number;
  precoMax: number;
  precoLimite: number;
  onPrecoLimite: (v: number) => void;
  precoMaximo: number;
  onLimpar: () => void;
  contarPorCategoria: (slug: string) => number;
  totalProdutos: number;
  mobile?: boolean;
}

export function ProdutosSidebar({
  categorias,
  categoriaSelecionada,
  onCategoria,
  termoBusca,
  onBusca,
  precoMin,
  precoMax,
  precoLimite,
  onPrecoLimite,
  precoMaximo,
  onLimpar,
  contarPorCategoria,
  totalProdutos,
  mobile = false,
}: ProdutosSidebarProps) {
  return (
    <aside className={mobile ? "" : "hidden lg:block lg:w-[280px] shrink-0"}>
      <div className="bg-[#EDE8DF] rounded-[22px] p-6 sticky top-36">
        {/* Busca */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lux-warm-gray)]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Pesquisar..."
            value={termoBusca}
            onChange={(e) => onBusca(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full border border-[var(--lux-gold)]/15 bg-white/60 text-sm text-[var(--lux-deep)] placeholder:text-[var(--lux-warm-gray)] focus:outline-none focus:border-[var(--lux-gold)]/40 transition-colors"
          />
        </div>

        {/* Categorias */}
        <div className="mb-6">
          <h3 className="text-[10px] uppercase tracking-[0.25em] text-[var(--lux-warm-gray)] mb-4 font-medium">
            Categorias
          </h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onCategoria(null)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                  categoriaSelecionada === null
                    ? "bg-white text-[var(--lux-deep)] font-medium shadow-sm"
                    : "text-[var(--lux-deep)]/70 hover:bg-white/50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4 text-[var(--lux-gold-muted)]" strokeWidth={1.5} />
                  Todos
                </span>
                <span className="text-xs text-[var(--lux-warm-gray)]">({totalProdutos})</span>
              </button>
            </li>
            {categorias.map((cat) => {
              const Icon = ICONES[cat.slug] || Flower2;
              const count = contarPorCategoria(cat.slug);
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => onCategoria(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                      categoriaSelecionada === cat.slug
                        ? "bg-white text-[var(--lux-deep)] font-medium shadow-sm"
                        : "text-[var(--lux-deep)]/70 hover:bg-white/50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[var(--lux-gold-muted)]" strokeWidth={1.5} />
                      {cat.nome}
                    </span>
                    <span className="text-xs text-[var(--lux-warm-gray)]">({count})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Faixa de preço */}
        {precoMaximo > 0 && (
          <div className="mb-6 pb-6 border-b border-[var(--lux-deep)]/8">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[var(--lux-warm-gray)] mb-4 font-medium">
              Preço
            </h3>
            <input
              type="range"
              min={precoMin}
              max={precoMaximo}
              step={1}
              value={precoLimite}
              onChange={(e) => onPrecoLimite(Number(e.target.value))}
              className="w-full accent-[var(--lux-gold)] h-1.5 rounded-full cursor-pointer"
            />
            <div className="flex justify-between mt-2 text-xs text-[var(--lux-warm-gray)]">
              <span>R$ {precoMin.toFixed(0)}</span>
              <span className="text-[var(--lux-deep)] font-medium">até R$ {precoLimite.toFixed(0)}</span>
            </div>
          </div>
        )}

        {/* Filtrar por / Avaliação — visual como referência */}
        <div className="space-y-2 mb-6">
          {["Filtrar por", "Avaliação"].map((label) => (
            <button
              key={label}
              type="button"
              className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] text-[var(--lux-warm-gray)] hover:bg-white/40 transition-colors"
            >
              {label}
              <ChevronRight className="w-3.5 h-3.5 rotate-90" strokeWidth={1.5} />
            </button>
          ))}
        </div>

        <button
          onClick={onLimpar}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-[var(--lux-deep)]/15 text-[10px] uppercase tracking-[0.2em] text-[var(--lux-deep)]/70 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold-muted)] transition-all duration-400"
        >
          <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          Limpar filtros
        </button>
      </div>
    </aside>
  );
}

export function contarProdutosPorCategoria(produtos: Produto[], slug: string): number {
  return produtos.filter((p) => p.categoria_slug === slug).length;
}
