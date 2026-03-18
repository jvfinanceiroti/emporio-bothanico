"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export function StoreHeader() {
  const router = useRouter();
  const [totalItens, setTotalItens] = useState(0);
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState<{ id: number; nome: string; slug: string }[]>([
    { id: -1, nome: "Aromas", slug: "aromas" },
    { id: -2, nome: "Aromaterapia", slug: "aromaterapia" },
    { id: -3, nome: "Banho", slug: "banho" },
    { id: -4, nome: "Delicadezas e Presentes", slug: "delicadezas-e-presentes" },
    { id: -5, nome: "Essências", slug: "essencias" },
    { id: -6, nome: "Perfumes", slug: "perfumes" },
    { id: -7, nome: "Kits", slug: "kits" },
  ]);
  const CATEGORIAS_CACHE_KEY = "categorias_cache_v1";
  const CATEGORIAS_CACHE_TTL_MS = 10 * 60 * 1000;
  const CATEGORIAS_TIMEOUT_MS = 10_000;

  useEffect(() => {
    const update = () => {
      const salvo = localStorage.getItem("carrinho");
      if (salvo) {
        const arr = JSON.parse(salvo);
        setTotalItens(arr.reduce((acc: number, i: any) => acc + (i.quantidade || 1), 0));
      }
    };
    update();
    const onStorage = () => update();
    window.addEventListener("carrinho-changed", onStorage);
    return () => window.removeEventListener("carrinho-changed", onStorage);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CATEGORIAS_CACHE_KEY);
      if (raw) {
        const cache = JSON.parse(raw);
        const valido = Date.now() - Number(cache?.ts || 0) < CATEGORIAS_CACHE_TTL_MS;
        if (valido && Array.isArray(cache?.rows)) {
          setCategorias(cache.rows);
        }
      }
    } catch {}

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CATEGORIAS_TIMEOUT_MS);

    fetch(`${API_URL}/catalogo?include=categorias`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { categorias: [] }))
      .then((payload) => {
        const rows = Array.isArray(payload) ? payload : payload?.categorias;
        const lista = Array.isArray(rows) ? rows : [];
        setCategorias(lista);
        try {
          localStorage.setItem(CATEGORIAS_CACHE_KEY, JSON.stringify({ ts: Date.now(), rows: lista }));
        } catch {}
      })
      .catch(() => {})
      .finally(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(busca.trim())}`);
    } else {
      router.push("/produtos");
    }
  };

  const headerBg = "bg-[#2d5a4a]";
  const headerBgDark = "bg-[#234a3d]";
  const categoriasOrdenadas = [...categorias].sort((a, b) => {
    const aIsKits = a.slug === "kits";
    const bIsKits = b.slug === "kits";
    if (aIsKits !== bIsKits) return aIsKits ? 1 : -1;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  return (
    <>
      {/* Barra 0: Frete grátis - oculto no mobile para economizar espaço */}
      <div className="hidden sm:block bg-gradient-to-r from-[#1a3d32] via-[#2d5a4a] to-[#1a3d32] text-white py-2 overflow-hidden" style={{ fontFamily: "var(--font-tagline)" }}>
        <div className="marquee-container">
          <div className="marquee-content">
            <span className="inline-flex items-center gap-3 mx-8 text-xs sm:text-sm">
              <span className="text-amber-300/90">✧</span>
              <span className="font-bold tracking-wider uppercase">Frete grátis</span>
              <span className="text-white/95">nas compras acima de R$ 299</span>
              <span className="text-amber-300/90">✧</span>
            </span>
            <span className="inline-flex items-center gap-3 mx-8 text-xs sm:text-sm">
              <span className="text-amber-300/90">✧</span>
              <span className="font-bold tracking-wider uppercase">Frete grátis</span>
              <span className="text-white/95">nas compras acima de R$ 299</span>
              <span className="text-amber-300/90">✧</span>
            </span>
            <span className="inline-flex items-center gap-3 mx-8 text-xs sm:text-sm">
              <span className="text-amber-300/90">✧</span>
              <span className="font-bold tracking-wider uppercase">Frete grátis</span>
              <span className="text-white/95">nas compras acima de R$ 299</span>
              <span className="text-amber-300/90">✧</span>
            </span>
          </div>
        </div>
      </div>

      {/* Barra 1: Social + Promo - oculto no mobile */}
      <div className={`hidden md:block ${headerBg} text-white py-2 px-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
          </a>
          <p className="text-xs font-medium text-center flex-1 mx-4">
            Sua jornada olfativa começa aqui: explore fragrâncias exclusivas e encontre o seu aroma perfeito!
          </p>
          <div className="w-5" />
        </div>
      </div>

      {/* Barra 2: Logo + Busca + Ações - compacto no mobile */}
      <div className={`${headerBg} text-white py-3 sm:py-4 lg:py-5 px-3 sm:px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:gap-6">
          {/* Mobile: logo e ícones na mesma linha */}
          <div className="flex items-center justify-between gap-2 sm:contents">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 no-underline text-white hover:opacity-90 shrink-0">
              <img src="/logo.png" alt="Empório Bothânico" className="h-9 w-9 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain brightness-0 invert" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl lg:text-2xl font-semibold tracking-tight leading-tight truncate" style={{ fontFamily: "var(--font-logo)" }}>Empório Bothânico</h1>
                <p className="text-[9px] sm:text-[10px] lg:text-xs font-light uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/90 hidden sm:block" style={{ fontFamily: "var(--font-tagline)" }}>Delicadezas e Banho</p>
              </div>
            </Link>
            <div className="flex sm:hidden items-center gap-2">
              <a href="https://wa.me/553195503794" target="_blank" rel="noopener noreferrer" className="p-1.5 hover:opacity-80" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              </a>
              <Link href="/meus-pedidos" className="p-1.5 hover:opacity-80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </Link>
              <Link href="/carrinho" className="relative p-1.5 hover:opacity-80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                {totalItens > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center bg-white text-[var(--accent)] text-[9px] font-bold rounded-full">
                    {totalItens}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 w-full min-w-0 sm:max-w-xl lg:max-w-2xl lg:mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="O que você está buscando?"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] border-0 text-sm sm:text-base focus:ring-2 focus:ring-white/50 outline-none"
              />
              <button type="submit" className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
            </div>
          </form>

          <div className="hidden sm:flex items-center justify-center lg:justify-end gap-4 lg:gap-6 shrink-0">
            <a href="https://wa.me/553195503794" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <span className="text-[9px] lg:text-[10px] font-medium uppercase">Atendimento</span>
            </a>
            <Link href="/meus-pedidos" className="flex flex-col items-center gap-0.5 text-white no-underline hover:opacity-90 transition-opacity">
              <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span className="text-[9px] lg:text-[10px] font-medium uppercase">Meus pedidos</span>
            </Link>
            <Link href="/carrinho" className="relative flex flex-col items-center gap-0.5 text-white no-underline hover:opacity-90 transition-opacity">
              <span className="relative inline-block">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                {totalItens > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[16px] h-[16px] flex items-center justify-center bg-white text-[var(--accent)] text-[9px] font-bold rounded-full">
                    {totalItens}
                  </span>
                )}
              </span>
              <span className="text-[9px] lg:text-[10px] font-medium uppercase">Carrinho</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra 3: Menu de categorias - scroll horizontal no mobile */}
      <div className={`${headerBgDark} text-white py-2 sm:py-2.5 px-3 sticky top-0 z-50`}>
        <nav className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -mx-1" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <Link href="/#mais-vendidos" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase rounded transition-colors flex items-center gap-1 bg-amber-300/15 text-amber-300 border border-amber-300/40">
            Mais Vendidos
            <span className="text-[10px]">★</span>
          </Link>
          {categoriasOrdenadas.map((cat) => (
            <Link key={cat.id} href={`/produtos?categoria=${cat.slug}`} className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase hover:bg-white/10 rounded transition-colors flex items-center gap-1">
              {cat.nome}
            </Link>
          ))}
          <Link href="/promocoes" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase hover:bg-white/10 rounded transition-colors flex items-center gap-1 text-amber-300">
            Promoções
            <span className="text-[10px]">🔥</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
