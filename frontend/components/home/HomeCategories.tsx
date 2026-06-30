"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Droplets,
  Flower2,
  Bath,
  Gift,
  Leaf,
  Sparkles,
  Star,
} from "lucide-react";
import type { Categoria } from "@/lib/catalogo";

const IMG_V = "v6";

const CATEGORIAS_CONFIG: {
  slug: string;
  nome: string;
  imagem: string;
  objectPosition: string;
  icon: typeof Droplets;
}[] = [
  { slug: "aromas", nome: "Aromas", imagem: `/categorias/aromas.jpg?${IMG_V}`, objectPosition: "center center", icon: Droplets },
  { slug: "aromaterapia", nome: "Aromaterapia", imagem: `/categorias/aromaterapia.jpg?${IMG_V}`, objectPosition: "42% center", icon: Flower2 },
  { slug: "banho", nome: "Banho", imagem: `/categorias/banho.jpg?${IMG_V}`, objectPosition: "center 40%", icon: Bath },
  {
    slug: "delicadezas-e-presentes",
    nome: "Delicadezas e Presentes",
    imagem: `/categorias/presentes.jpg?${IMG_V}`,
    objectPosition: "center center",
    icon: Gift,
  },
  { slug: "essencias", nome: "Essências", imagem: `/categorias/essencias.jpg?${IMG_V}`, objectPosition: "55% center", icon: Leaf },
  { slug: "perfumes", nome: "Perfumes", imagem: `/categorias/perfumes.jpg?${IMG_V}`, objectPosition: "center center", icon: Sparkles },
];

function resolverCategorias(categorias: Categoria[]) {
  const porSlug = new Map(categorias.map((c) => [c.slug, c]));
  return CATEGORIAS_CONFIG.map((cfg) => {
    const api = porSlug.get(cfg.slug);
    return {
      ...cfg,
      id: api?.id ?? cfg.slug,
      nome: api?.nome ?? cfg.nome,
      href: `/produtos?categoria=${cfg.slug}`,
    };
  });
}

export function HomeCategories({ categorias }: { categorias: Categoria[] }) {
  const lista = resolverCategorias(categorias);

  return (
    <section className="bg-[#F5F2ED] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#B6843E] font-medium mb-4">
              Explore por categoria
            </p>
            <h2
              className="text-[clamp(2rem,4.5vw,3.25rem)] text-[#1A2E26] font-normal leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Universo de fragrâncias
            </h2>
            <p
              className="mt-3 text-sm sm:text-[15px] text-[#8A8578] leading-relaxed max-w-md"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Cada coleção foi criada para despertar sensações únicas.
            </p>
          </div>
          <Link
            href="/produtos"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#B6843E] hover:text-[#C79A54] transition-colors duration-300 shrink-0 sm:mt-10"
          >
            Ver catálogo completo
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {lista.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="isolate"
              >
                <Link
                  href={cat.href}
                  className="group grid grid-cols-[minmax(0,46%)_minmax(0,1fr)] overflow-hidden rounded-[14px] bg-[#0F241B] h-[172px] sm:h-[180px] shadow-[0_2px_16px_rgba(15,36,27,0.1)]"
                >
                  {/* Painel verde — texto */}
                  <div className="relative z-10 flex flex-col justify-between p-5 sm:p-6 bg-[#0F241B] min-w-0">
                    <div className="w-9 h-9 rounded-full border border-[#C79A54]/55 flex items-center justify-center text-[#C79A54] shrink-0">
                      <Icon className="w-[15px] h-[15px]" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3
                        className="text-[1.12rem] sm:text-[1.2rem] text-[#F5F2ED] font-normal leading-[1.2] mb-2"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {cat.nome}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.22em] text-[#C79A54] font-medium group-hover:text-[#DAB97B] transition-colors">
                        Explorar
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                      </span>
                    </div>
                  </div>

                  {/* Foto — container isolado, sem vazar */}
                  <div className="relative min-w-0 min-h-0 h-full overflow-hidden bg-[#1a3328]">
                    <img
                      src={cat.imagem}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="block w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                      style={{ objectPosition: cat.objectPosition }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 w-8 pointer-events-none"
                      style={{
                        background: "linear-gradient(to right, #0F241B 0%, transparent 100%)",
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-5 sm:mt-6 rounded-[14px] bg-[#0F241B] px-6 sm:px-8 lg:px-10 py-6 sm:py-7 flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-10"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border border-[#C79A54]/55 flex items-center justify-center text-[#C79A54]">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="text-lg sm:text-[1.35rem] text-[#F5F2ED] font-normal leading-snug"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Encontre o aroma perfeito para você
            </h3>
            <p className="mt-1.5 text-[11px] sm:text-xs text-[#F5F2ED]/50 leading-relaxed max-w-md">
              Responda algumas perguntas e descubra fragrâncias que combinam com sua essência.
            </p>
          </div>

          <Link
            href="/produtos"
            className="shrink-0 inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-[10px] text-[10px] uppercase tracking-[0.16em] font-semibold text-[#1A2E26] lux-btn-gold transition-transform duration-300 hover:scale-[1.02]"
          >
            Descobrir meu aroma
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
