"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface LayoutInstitucionalProps {
  titulo: string;
  breadcrumbLabel?: string;
  children: ReactNode;
}

export default function LayoutInstitucional({ titulo, breadcrumbLabel, children }: LayoutInstitucionalProps) {
  const label = breadcrumbLabel ?? titulo;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium">{label}</span>
        </nav>

        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] overflow-hidden">
          <div className="px-6 sm:px-10 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-8" style={{ fontFamily: "var(--font-logo)" }}>
              {titulo}
            </h1>
            <div className="prose prose-emerald max-w-none text-[var(--foreground)] leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
