"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/luxury/SectionHeading";
import { LuxuryButton } from "@/components/luxury/LuxuryButton";

export function HomeInstagram() {
  return (
    <section className="lux-section-dark py-20 sm:py-28 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <div className="absolute inset-0 lux-hero-glow opacity-50 pointer-events-none" />
      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <SectionHeading
          eyebrow="Nosso dia a dia"
          title="Siga-nos no Instagram"
          subtitle="Fragrâncias, novidades e um vislumbre da nossa loja em Itabira."
          align="center"
          light
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <LuxuryButton href="https://www.instagram.com/emporiobothanicoita/" variant="outline">
            @emporiobothanicoita
          </LuxuryButton>
        </motion.div>
      </div>
    </section>
  );
}
