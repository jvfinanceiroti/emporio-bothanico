"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface LayoutInstitucionalProps {
  titulo: string;
  children: ReactNode;
}

export default function LayoutInstitucional({ titulo, children }: LayoutInstitucionalProps) {
  return (
    <div className="layout-institucional">
      <header className="rounded-2xl mb-6 p-4 md:p-6 border border-[var(--border)] shadow-[var(--shadow-md)]" style={{ background: "var(--surface)" }}>
        <div className="store-container py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <img src="/logo.png" alt="Empório Bothânico" className="h-12 w-12 object-contain" />
              <span className="text-xl font-extrabold text-[var(--accent)] tracking-tight">
                Empório Bothânico
              </span>
            </Link>
            <Link
              href="/"
              className="btn-primary !inline-flex"
            >
              ← Voltar à Loja
            </Link>
          </div>
        </div>
      </header>

      <main className="content-card">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--accent)] mb-8 tracking-tight">
          {titulo}
        </h1>
        <div className="text-[var(--muted)] leading-relaxed text-base">
          {children}
        </div>
      </main>

      <footer className="mt-10 py-8 px-6 bg-white/95 rounded-2xl shadow-[var(--shadow-md)] border border-[var(--border)]">
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 text-sm font-semibold">
          <Link href="/produtos" className="store-link">Produtos</Link>
          <Link href="/sobre" className="store-link">Sobre Nós</Link>
          <Link href="/contato" className="store-link">Contato</Link>
          <Link href="/ajuda" className="store-link">Ajuda</Link>
          <Link href="/trocas" className="store-link">Trocas</Link>
          <Link href="/entregas" className="store-link">Entregas</Link>
          <Link href="/privacidade" className="store-link">Privacidade</Link>
        </nav>
        <div className="text-center text-sm text-[var(--muted)] space-y-1">
          <p>CNPJ 04.280.033/0001-93 | LAMBARI PERFUMARIA LTDA - ME</p>
          <p>Tel: 31 - 3831-0866</p>
          <p>© 2026 Empório Bothânico. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
