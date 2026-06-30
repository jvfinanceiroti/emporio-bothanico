"use client";

import { motion } from "framer-motion";
import { Truck, FlaskConical, Leaf, Users } from "lucide-react";
import { SectionHeading } from "@/components/luxury/SectionHeading";

const BENEFICIOS = [
  {
    icon: Truck,
    title: "Envio rápido",
    desc: "Despacho em até 24h para todo o Brasil com embalagem cuidadosa.",
  },
  {
    icon: FlaskConical,
    title: "Produtos artesanais",
    desc: "Formulações exclusivas, feitas com dedicação e atenção a cada detalhe.",
  },
  {
    icon: Leaf,
    title: "Ingredientes selecionados",
    desc: "Matérias-primas premium que elevam sua experiência sensorial.",
  },
  {
    icon: Users,
    title: "1000+ clientes",
    desc: "Uma comunidade que confia na qualidade Empório Bothânico.",
  },
];

export function HomeBenefits() {
  return (
    <section className="lux-section-dark py-20 sm:py-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <SectionHeading
          eyebrow="Diferenciais"
          title="Por que nos escolher"
          subtitle="Cada detalhe foi pensado para oferecer uma experiência digna das melhores casas de perfumaria do mundo."
          align="center"
          light
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {BENEFICIOS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
              className="lux-glass-light rounded-[22px] p-7 sm:p-8 text-center lux-card-hover group"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-[var(--lux-gold)]/20 flex items-center justify-center text-[var(--lux-gold)] group-hover:border-[var(--lux-gold)]/50 transition-all duration-500">
                <Icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl text-[var(--lux-cream)] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--lux-cream)]/45 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
