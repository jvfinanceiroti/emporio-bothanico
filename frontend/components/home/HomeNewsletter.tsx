"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SectionHeading } from "@/components/luxury/SectionHeading";

export function HomeNewsletter() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEnviado(true);
      setEmail("");
    }
  };

  return (
    <section className="lux-section-cream py-20 sm:py-24 px-4 sm:px-6 lg:px-10 border-t border-[var(--lux-gold)]/10">
      <div className="max-w-[640px] mx-auto text-center">
        <SectionHeading
          eyebrow="Newsletter"
          title="Receba novidades exclusivas"
          subtitle="Seja a primeira a conhecer lançamentos, ofertas especiais e dicas de aromaterapia."
          align="center"
        />

        {enviado ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-[var(--lux-gold-muted)]"
          >
            Obrigado por se inscrever. Em breve você receberá nossas novidades.
          </motion.p>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--lux-warm-gray)]" strokeWidth={1.5} />
              <input
                type="email"
                required
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-5 rounded-full border border-[var(--lux-gold)]/20 bg-white text-sm text-[var(--lux-deep)] placeholder:text-[var(--lux-warm-gray)] focus:outline-none focus:border-[var(--lux-gold)]/50 transition-colors duration-400"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 rounded-full bg-[var(--lux-deep)] text-[var(--lux-cream)] text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-[var(--lux-deep-soft)] transition-all duration-400 shrink-0"
            >
              Inscrever-se
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}
