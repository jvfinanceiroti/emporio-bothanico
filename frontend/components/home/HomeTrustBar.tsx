"use client";

import { motion } from "framer-motion";
import { Truck, Clock, ShieldCheck, Headphones } from "lucide-react";

const ITENS = [
  {
    icon: Truck,
    title: "Frete grátis",
    desc: "Em compras acima de R$ 299",
  },
  {
    icon: Clock,
    title: "Envio em 24h",
    desc: "Para todo o Brasil",
  },
  {
    icon: ShieldCheck,
    title: "Pagamento seguro",
    desc: "Pix, cartão e boleto",
  },
  {
    icon: Headphones,
    title: "Atendimento humanizado",
    desc: "WhatsApp e Instagram",
  },
];

export function HomeTrustBar() {
  return (
    <section className="relative z-20 -mt-8 sm:-mt-12 px-4 sm:px-6 lg:px-10 pb-4">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lux-glass rounded-[24px] sm:rounded-[28px] px-6 sm:px-10 py-6 sm:py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {ITENS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="w-11 h-11 shrink-0 rounded-full border border-[var(--lux-gold)]/25 flex items-center justify-center text-[var(--lux-gold)]">
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm text-[var(--lux-cream)] font-medium">{title}</p>
                <p className="text-xs text-[var(--lux-cream)]/45 mt-0.5">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
