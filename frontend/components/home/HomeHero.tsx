"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  Sparkles,
  Gift,
  Truck,
  Clock,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const BENEFICIOS_HERO = [
  { icon: Leaf, lines: ["Ingredientes", "Selecionados"] },
  { icon: Sparkles, lines: ["Aromas", "Exclusivos"] },
  { icon: Gift, lines: ["Embalagens", "Encantadoras"] },
];

const TRUST_ITEMS = [
  { icon: Truck, title: "Frete grátis", desc: "nas compras acima de R$ 299" },
  { icon: Clock, title: "Envio rápido", desc: "para todo o Brasil" },
  { icon: ShieldCheck, title: "Pagamento seguro", desc: "em até 6x sem juros" },
  { icon: Headphones, title: "Atendimento humanizado", desc: "estamos aqui para você" },
];

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const [reducedMotion, setReducedMotion] = useState(false);

  const contentOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const contentY = useTransform(scrollY, [0, 350], [0, -24]);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[640px] max-h-[1100px] overflow-hidden"
      aria-label="Empório Bothânico — Hero"
    >
      {/* Fotografia editorial — protagonista */}
      <div className="absolute inset-0">
        <img
          src="/banner-loja.png?v=hero2026"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[58%_center] sm:object-[62%_42%]"
        />
      </div>

      {/* Overlay leve — só à esquerda para legibilidade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(15, 36, 27, 0.52) 0%, rgba(15, 36, 27, 0.18) 40%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[38%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(15, 36, 27, 0.45) 0%, rgba(15, 36, 27, 0.08) 45%, transparent 100%)",
        }}
      />

      {/* Conteúdo — alinhamento preservado */}
      <motion.div
        style={{ opacity: contentOpacity, y: reducedMotion ? 0 : contentY }}
        className="relative z-10 h-full flex flex-col justify-start px-5 sm:px-8 lg:px-14 xl:px-20 pt-[var(--lux-header-offset)] pb-[148px] sm:pb-[156px]"
      >
        <div className="max-w-[520px]">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.45em] text-[var(--lux-gold)] mb-8 sm:mb-10 font-medium"
          >
            Sua jornada olfativa
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[clamp(3rem,9.5vw,6.5rem)] leading-[0.95] text-[var(--lux-cream)] font-normal tracking-[-0.01em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Começa
            <br />
            <span className="italic text-[var(--lux-gold)]">aqui.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 sm:mt-10 text-sm sm:text-[15px] text-[var(--lux-cream)]/65 leading-[1.85] max-w-[420px]"
          >
            Explore fragrâncias exclusivas e encontre o seu aroma perfeito.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-wrap gap-4 sm:gap-5 mt-10 sm:mt-12"
          >
            <HeroCTA href="/produtos" variant="gold" icon={<ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />}>
              Explorar Produtos
            </HeroCTA>
            <HeroCTA href="/#mais-vendidos" variant="outline">
              Mais Vendidos
            </HeroCTA>
          </motion.div>

          {/* Três ícones — discretos, como na referência */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="hidden sm:flex gap-10 lg:gap-12 mt-12 lg:mt-14"
          >
            {BENEFICIOS_HERO.map(({ icon: Icon, lines }) => (
              <div key={lines[0]} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-[var(--lux-gold)]/40 flex items-center justify-center text-[var(--lux-gold)] shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-[var(--lux-cream)]/50 leading-[1.7]">
                  {lines.map((l) => (
                    <span key={l} className="block">{l}</span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Selo — direita, discreto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="hidden lg:flex absolute right-12 xl:right-20 top-1/2 -translate-y-[42%] flex-col items-center pointer-events-none"
        >
          <div className="w-28 h-28 xl:w-32 xl:h-32 rounded-full border border-[var(--lux-gold)]/35 flex items-center justify-center">
            <div className="text-center px-3">
              <Leaf className="w-5 h-5 text-[var(--lux-gold)] mx-auto mb-1.5" strokeWidth={1.5} />
              <p className="text-[8px] uppercase tracking-[0.2em] text-[var(--lux-gold)]/85 leading-relaxed">
                Feito para
                <br />
                transformar
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Barra de benefícios — 4 colunas iguais, sem sobreposição */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 lg:px-10 pb-5 sm:pb-6">
        <div className="max-w-[1200px] mx-auto lux-hero-trust-bar rounded-[18px] sm:rounded-[20px] px-4 sm:px-6 py-4 sm:py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 lg:gap-y-0">
            {TRUST_ITEMS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`flex items-center gap-3 sm:gap-4 px-2 sm:px-4 min-h-[52px] ${
                  i < TRUST_ITEMS.length - 1 ? "lg:border-r lg:border-[var(--lux-gold)]/10" : ""
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border border-[var(--lux-gold)]/35 flex items-center justify-center text-[var(--lux-gold)]">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] sm:text-xs text-[var(--lux-cream)] font-medium leading-tight">{title}</p>
                  <p className="text-[10px] text-[var(--lux-cream)]/45 leading-snug mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCTA({
  href,
  children,
  variant,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  variant: "gold" | "outline";
  icon?: React.ReactNode;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2.5 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-medium overflow-hidden transition-all duration-400";

  if (variant === "gold") {
    return (
      <Link href={href} className={`${base} lux-btn-gold hover:brightness-105`}>
        <span className="relative z-10">{children}</span>
        {icon && (
          <span className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-300">
            {icon}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`${base} border border-[var(--lux-gold)]/45 text-[var(--lux-cream)] hover:border-[var(--lux-gold)] hover:bg-[var(--lux-gold)]/8`}
    >
      <span className="relative">{children}</span>
    </Link>
  );
}
