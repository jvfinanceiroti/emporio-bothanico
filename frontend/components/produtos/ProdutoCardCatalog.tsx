"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Check } from "lucide-react";
import type { Produto } from "@/lib/catalogo";

interface ProdutoCardCatalogProps {
  produto: Produto;
  imagem: string;
  onAddToCart: (produto: Produto) => void;
  adicionado: boolean;
  index: number;
  favorito: boolean;
  onToggleFavorito: () => void;
  layout?: "grid" | "list";
}

export function ProdutoCardCatalog({
  produto,
  imagem,
  onAddToCart,
  adicionado,
  index,
  favorito,
  onToggleFavorito,
  layout = "grid",
}: ProdutoCardCatalogProps) {
  const preco = Number(produto.preco).toFixed(2).replace(".", ",");

  if (layout === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="group flex gap-5 sm:gap-6 bg-white rounded-[22px] border border-[var(--lux-gold)]/10 p-4 sm:p-5 lux-card-hover"
      >
        <Link href={`/produto/${produto.id}`} className="shrink-0 w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-[#FAF8F5] flex items-center justify-center p-3">
          <img src={imagem} alt={produto.nome} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex justify-between gap-2">
            <Link href={`/produto/${produto.id}`}>
              <h3 className="text-base sm:text-lg text-[var(--lux-deep)] line-clamp-2" style={{ fontFamily: "var(--font-display)" }}>
                {produto.nome}
              </h3>
            </Link>
            <button onClick={onToggleFavorito} className="shrink-0 p-1.5 text-[var(--lux-warm-gray)] hover:text-[var(--lux-gold)] transition-colors" aria-label="Favorito">
              <Heart className={`w-4 h-4 ${favorito ? "fill-[var(--lux-gold)] text-[var(--lux-gold)]" : ""}`} strokeWidth={1.5} />
            </button>
          </div>
          {produto.descricao && <p className="text-xs text-[var(--lux-warm-gray)] line-clamp-2 mt-1">{produto.descricao}</p>}
          <p className="text-xl text-[var(--lux-deep)] mt-2" style={{ fontFamily: "var(--font-display)" }}>R$ {preco}</p>
          <div className="mt-auto pt-3 flex gap-2">
            <button
              onClick={() => onAddToCart(produto)}
              disabled={produto.estoque === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--lux-deep)] text-[var(--lux-cream)] text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-[var(--lux-deep-soft)] transition-all disabled:opacity-40"
            >
              {adicionado ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />}
              {adicionado ? "Adicionado" : "Adicionar ao carrinho"}
            </button>
            <Link href={`/produto/${produto.id}`} className="px-4 py-3 text-[10px] uppercase tracking-[0.15em] text-[var(--lux-gold-muted)] hover:text-[var(--lux-gold)] transition-colors">
              Ver detalhes
            </Link>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group flex flex-col bg-white rounded-[22px] border border-[var(--lux-gold)]/10 overflow-hidden lux-card-hover"
    >
      <div className="relative">
        <Link href={`/produto/${produto.id}`} className="block aspect-square bg-[#FAF8F5] flex items-center justify-center p-6 sm:p-8 overflow-hidden">
          <img
            src={imagem}
            alt={produto.nome}
            className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85";
            }}
          />
        </Link>
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorito(); }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[var(--lux-warm-gray)] hover:text-[var(--lux-gold)] shadow-sm transition-all duration-300 hover:scale-105"
          aria-label="Favorito"
        >
          <Heart className={`w-4 h-4 ${favorito ? "fill-[var(--lux-gold)] text-[var(--lux-gold)]" : ""}`} strokeWidth={1.5} />
        </button>
        {produto.estoque <= 5 && produto.estoque > 0 && (
          <span className="absolute top-4 left-4 px-2.5 py-1 bg-[var(--lux-deep)]/90 text-[var(--lux-cream)] text-[9px] uppercase tracking-wider rounded-full">
            Últimas unidades
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <Link href={`/produto/${produto.id}`}>
          <h3
            className="text-sm sm:text-base text-[var(--lux-deep)] line-clamp-2 min-h-[2.5rem] leading-snug group-hover:text-[var(--lux-gold-muted)] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {produto.nome}
          </h3>
        </Link>
        {produto.categoria_nome && (
          <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--lux-warm-gray)] mt-1.5">
            {produto.categoria_nome}
          </p>
        )}
        <p className="text-xl sm:text-2xl text-[var(--lux-deep)] mt-3" style={{ fontFamily: "var(--font-display)" }}>
          R$ {preco}
        </p>
        <p className="text-[10px] text-[var(--lux-warm-gray)] mt-0.5">
          ou 3x R$ {(Number(produto.preco) / 3).toFixed(2).replace(".", ",")}
        </p>

        <div className="mt-auto pt-5 space-y-3">
          <button
            onClick={() => onAddToCart(produto)}
            disabled={produto.estoque === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[var(--lux-deep)] text-[var(--lux-cream)] text-[10px] uppercase tracking-[0.15em] font-medium hover:bg-[var(--lux-deep-soft)] hover:shadow-[0_8px_24px_rgba(15,36,27,0.2)] transition-all duration-400 disabled:opacity-40"
          >
            {adicionado ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={2} />
                Adicionado
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
                Adicionar ao carrinho
              </>
            )}
          </button>
          <Link
            href={`/produto/${produto.id}`}
            className="block text-center text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold-muted)] hover:text-[var(--lux-gold)] transition-colors duration-300"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
