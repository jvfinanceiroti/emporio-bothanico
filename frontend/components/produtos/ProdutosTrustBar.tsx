"use client";

import { Truck, FlaskConical, Leaf, Star } from "lucide-react";

const ITENS = [
  { icon: Truck, title: "Envio rápido", desc: "Para todo Brasil" },
  { icon: FlaskConical, title: "Produtos artesanais", desc: "Feitos com cuidado" },
  { icon: Leaf, title: "Ingredientes selecionados", desc: "Qualidade premium" },
  { icon: Star, title: "1000+ clientes", desc: "Satisfeitos" },
];

export function ProdutosTrustBar() {
  return (
    <section className="bg-[#EDE8DF]/60 border-t border-[var(--lux-gold)]/10 py-10 sm:py-12 px-4 sm:px-6">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {ITENS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-4">
            <div className="w-11 h-11 shrink-0 rounded-full border border-[var(--lux-gold)]/25 flex items-center justify-center text-[var(--lux-gold-muted)]">
              <Icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--lux-deep)]">{title}</p>
              <p className="text-xs text-[var(--lux-warm-gray)] mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
