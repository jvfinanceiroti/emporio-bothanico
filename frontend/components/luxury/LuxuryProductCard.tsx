"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import type { Produto } from "@/lib/catalogo";

interface LuxuryProductCardProps {
  produto: Produto;
  imagem: string;
  onAddToCart: (produto: Produto, e: React.MouseEvent) => void;
  adicionado?: boolean;
  index?: number;
  dark?: boolean;
  compact?: boolean;
}

export function LuxuryProductCard({
  produto,
  imagem,
  onAddToCart,
  adicionado = false,
  index = 0,
  dark = false,
  compact = false,
}: LuxuryProductCardProps) {
  const preco = Number(produto.preco).toFixed(2).replace(".", ",");

  if (compact) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.45, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
        className="group flex flex-col bg-white rounded-[18px] border border-[var(--lux-gold)]/10 overflow-hidden lux-card-hover"
      >
        <Link href={`/produto/${produto.id}`} className="block">
          <div className="relative aspect-[4/3] bg-[#FAF8F5] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <img
              src={imagem}
              alt={produto.nome}
              className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
            />
          </div>
          <div className="px-3 sm:px-4 pt-3 pb-2">
            <h3
              className="text-xs sm:text-sm text-[var(--lux-deep)] line-clamp-2 min-h-[2.25rem] leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {produto.nome}
            </h3>
            <p className="mt-1.5 text-sm sm:text-base text-[var(--lux-gold)]" style={{ fontFamily: "var(--font-display)" }}>
              R$ {preco}
            </p>
          </div>
        </Link>
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 flex gap-2 mt-auto">
          <Link
            href={`/produto/${produto.id}`}
            className="flex-1 py-2 rounded-full text-center text-[9px] uppercase tracking-[0.15em] font-medium bg-[var(--lux-deep)] text-[var(--lux-cream)] hover:bg-[var(--lux-deep-soft)] transition-colors"
          >
            Comprar
          </Link>
          <button
            onClick={(e) => onAddToCart(produto, e)}
            className={`shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
              adicionado
                ? "border-[var(--lux-gold)] bg-[var(--lux-gold)]/15 text-[var(--lux-gold)]"
                : "border-[var(--lux-deep)]/15 text-[var(--lux-deep)]/60 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)]"
            }`}
            aria-label="Adicionar ao carrinho"
          >
            {adicionado ? <Check className="w-3.5 h-3.5" strokeWidth={1.5} /> : <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />}
          </button>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className={`group relative flex flex-col rounded-[22px] overflow-hidden transition-all duration-500 ${
        dark
          ? "bg-[var(--lux-deep-soft)] border border-[var(--lux-gold)]/10 hover:border-[var(--lux-gold)]/25 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          : "bg-[var(--lux-cream)] border border-[var(--lux-gold)]/8 hover:border-[var(--lux-gold)]/20 shadow-[0_16px_48px_rgba(15,36,27,0.06)]"
      } hover:-translate-y-1 hover:scale-[1.02]`}
    >
      <Link href={`/produto/${produto.id}`} className="block flex-1">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#0a1a14]">
          <img
            src={imagem}
            alt={produto.nome}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => { (e.target as HTMLImageElement).src = "/logo.png"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F241B]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="p-5 sm:p-6">
          <h3
            className={`text-sm sm:text-base font-medium line-clamp-2 min-h-[2.75rem] leading-snug ${
              dark ? "text-[var(--lux-cream)]" : "text-[var(--lux-deep)]"
            }`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {produto.nome}
          </h3>
          <p
            className="mt-2 text-lg sm:text-xl text-[var(--lux-gold)] tracking-wide"
            style={{ fontFamily: "var(--font-display)" }}
          >
            R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
          </p>
        </div>
      </Link>
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col gap-2.5">
        <Link
          href={`/produto/${produto.id}`}
          className="w-full py-3 rounded-full text-center text-[10px] uppercase tracking-[0.2em] font-medium bg-[var(--lux-gold)] text-[var(--lux-deep)] hover:bg-[var(--lux-gold-light)] transition-all duration-400"
        >
          Comprar
        </Link>
        <button
          onClick={(e) => onAddToCart(produto, e)}
          className={`w-full py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 border transition-all duration-400 ${
            adicionado
              ? "border-[var(--lux-gold)] bg-[var(--lux-gold)]/15 text-[var(--lux-gold)]"
              : dark
                ? "border-[var(--lux-gold)]/30 text-[var(--lux-cream)]/80 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)]"
                : "border-[var(--lux-deep)]/15 text-[var(--lux-deep)]/70 hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)]"
          }`}
        >
          {adicionado ? (
            <>
              <Check className="w-3.5 h-3.5" strokeWidth={1.5} />
              Adicionado
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
              Adicionar ao carrinho
            </>
          )}
        </button>
      </div>
    </motion.article>
  );
}
