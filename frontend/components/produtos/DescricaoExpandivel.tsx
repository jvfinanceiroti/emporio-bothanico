"use client";

import { useState } from "react";

const LIMITE_CARACTERES = 120;

interface DescricaoExpandivelProps {
  texto: string;
  limite?: number;
  className?: string;
}

export function DescricaoExpandivel({
  texto,
  limite = LIMITE_CARACTERES,
  className = "",
}: DescricaoExpandivelProps) {
  const [expandido, setExpandido] = useState(false);
  const precisaTruncar = texto.length > limite;
  const textoExibido =
    expandido || !precisaTruncar
      ? texto
      : `${texto.slice(0, limite).trimEnd()}…`;

  return (
    <div className={className}>
      <p className="text-xs text-[var(--lux-warm-gray)] leading-relaxed">{textoExibido}</p>
      {precisaTruncar && (
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--lux-gold-muted)] hover:text-[var(--lux-gold)] transition-colors"
        >
          {expandido ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </div>
  );
}
