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
              <span className="text-xl font-semibold text-[var(--accent)] tracking-tight" style={{ fontFamily: "var(--font-logo)" }}>
                Empório Bothânico
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <Link href="/" className="btn-primary !inline-flex">← Voltar à Loja</Link>
            </div>
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
