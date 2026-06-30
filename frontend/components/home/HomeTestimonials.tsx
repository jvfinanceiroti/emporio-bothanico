"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SectionHeading } from "@/components/luxury/SectionHeading";

const AVALIACOES = [
  { nome: "Ana Paula Morais", iniciais: "AP", texto: "Que loja maravilhosa, cheirosa, cheia de detalhes, tudo encanta! O conhecimento da Nayara sobre aromas é impressionante.", extra: "Local Guide • Google" },
  { nome: "César Marcos", iniciais: "CM", texto: "O aromatizador de alecrim é simplesmente maravilhoso. Melhora o meu humor e me faz sentir melhor. Simplesmente perfeito!", extra: "Local Guide • Google" },
  { nome: "Fernanda R.", iniciais: "FR", texto: "Atendimento impecável! A Nayara é super atenciosa e conhece cada produto. Já indiquei para várias amigas!", extra: "Avaliação Google" },
  { nome: "Roberto L.", iniciais: "RL", texto: "Loja encantadora! Ambiente aconchegante, produtos de qualidade e preços justos. O difusor que comprei dura meses.", extra: "Avaliação Google" },
  { nome: "Mariana C.", iniciais: "MC", texto: "Melhor loja de perfumaria da região! Variedade incrível, tudo muito bem apresentado.", extra: "Avaliação Google" },
  { nome: "Paulo H.", iniciais: "PH", texto: "Produtos excelentes e entrega rápida. Embalagem linda, como presente. Parabéns à equipe!", extra: "Avaliação Google" },
];

export function HomeTestimonials() {
  const [index, setIndex] = useState(0);
  const totalSlides = Math.ceil(AVALIACOES.length / 2);
  const visible = AVALIACOES.slice(index * 2, index * 2 + 2);
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, totalSlides - 1)));

  return (
    <section className="lux-section-cream py-20 sm:py-28 px-4 sm:px-6 lg:px-10 overflow-hidden">
      <div className="max-w-[1000px] mx-auto">
        <SectionHeading
          eyebrow="Avaliações reais"
          title="O que dizem nossos clientes"
          align="center"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex justify-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full border border-[var(--lux-gold)]/15 bg-white shadow-[var(--lux-shadow-soft)]">
            <span className="text-3xl text-[var(--lux-deep)]" style={{ fontFamily: "var(--font-display)" }}>5,0</span>
            <div className="flex gap-0.5 text-[var(--lux-gold)]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" strokeWidth={0} />
              ))}
            </div>
            <span className="text-xs text-[var(--lux-warm-gray)]">18 avaliações no Google</span>
          </div>
        </motion.div>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.45 }}
              className="grid md:grid-cols-2 gap-5 sm:gap-6"
            >
              {visible.map((av) => (
                <div
                  key={av.nome}
                  className="rounded-[22px] p-7 sm:p-8 bg-white border border-[var(--lux-gold)]/8 shadow-[var(--lux-shadow-soft)] lux-card-hover"
                >
                  <div className="flex gap-0.5 text-[var(--lux-gold)] mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
                    ))}
                  </div>
                  <blockquote
                    className="text-[var(--lux-deep)]/80 text-sm sm:text-base leading-relaxed mb-6"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    &ldquo;{av.texto}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-[var(--lux-gold)]/25 flex items-center justify-center text-[10px] font-medium text-[var(--lux-gold-muted)]">
                      {av.iniciais}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--lux-deep)]">{av.nome}</p>
                      <p className="text-[10px] text-[var(--lux-warm-gray)]">{av.extra}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => goTo(index - 1)}
            disabled={index <= 0}
            className="w-12 h-12 rounded-full border border-[var(--lux-gold)]/30 flex items-center justify-center text-[var(--lux-gold-muted)] hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)] transition-all duration-400 disabled:opacity-30"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === index ? "w-6 h-1.5 bg-[var(--lux-gold)]" : "w-1.5 h-1.5 bg-[var(--lux-gold)]/25 hover:bg-[var(--lux-gold)]/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => goTo(index + 1)}
            disabled={index >= totalSlides - 1}
            className="w-12 h-12 rounded-full border border-[var(--lux-gold)]/30 flex items-center justify-center text-[var(--lux-gold-muted)] hover:border-[var(--lux-gold)] hover:text-[var(--lux-gold)] transition-all duration-400 disabled:opacity-30"
            aria-label="Próximo"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="text-center mt-8">
          <a
            href="https://www.google.com/maps/search/Emp%C3%B3rio+Both%C3%A2nico+Itabira+MG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.2em] text-[var(--lux-gold-muted)] hover:text-[var(--lux-gold)] transition-colors duration-400"
          >
            Ver todas no Google →
          </a>
        </div>
      </div>
    </section>
  );
}
