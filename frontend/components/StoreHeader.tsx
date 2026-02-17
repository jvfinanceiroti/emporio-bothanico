"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export function StoreHeader() {
  const router = useRouter();
  const [totalItens, setTotalItens] = useState(0);
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState<{ id: number; nome: string; slug: string }[]>([]);

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
    fetch(`${API_URL}/categorias`)
      .then((r) => r.json())
      .then(setCategorias)
      .catch(() => {});
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

  return (
    <>
      {/* Barra 1: Social + Promo */}
      <div className={`${headerBg} text-white py-2.5 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center justify-center sm:justify-start gap-4 order-2 sm:order-1">
            <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100 transition-opacity" aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
          <p className="text-center sm:text-center text-xs sm:text-sm font-medium flex-1 order-1 sm:order-2">
            Sua jornada olfativa começa aqui: explore fragrâncias exclusivas e encontre o seu aroma perfeito!
          </p>
          <div className="hidden sm:block w-20 order-3" />
        </div>
      </div>

      {/* Barra 2: Logo + Busca + Ações */}
      <div className={`${headerBg} text-white py-4 sm:py-6 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center gap-6">
          <Link href="/" className="flex items-center gap-3 no-underline text-white hover:opacity-90 transition-opacity shrink-0">
            <img src="/logo.png" alt="Empório Bothânico" className="h-12 w-12 sm:h-14 sm:w-14 object-contain brightness-0 invert" />
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight uppercase">Empório Bothânico</h1>
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-[0.2em] text-white/90">Delicadezas & Banho</p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 w-full max-w-2xl mx-auto lg:mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="O que você está buscando?"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-5 pr-14 py-3.5 rounded-xl bg-white text-[var(--foreground)] placeholder:text-[var(--muted)] border-0 focus:ring-2 focus:ring-white/50 outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-lg text-[var(--accent)] hover:bg-[var(--accent-light)] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
            </div>
          </form>

          <div className="flex items-center justify-center lg:justify-end gap-6 sm:gap-8 shrink-0">
            <a href="https://wa.me/553195503794" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <span className="text-[10px] sm:text-xs font-medium uppercase">Atendimento</span>
            </a>
            <Link href="/meus-pedidos" className="flex flex-col items-center gap-1 text-white no-underline hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              <span className="text-[10px] sm:text-xs font-medium uppercase">Minha conta</span>
            </Link>
            <Link href="/carrinho" className="relative flex flex-col items-center gap-1 text-white no-underline hover:opacity-90 transition-opacity">
              <span className="relative inline-block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                {totalItens > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-white text-[var(--accent)] text-[10px] font-bold rounded-full">
                    {totalItens}
                  </span>
                )}
              </span>
              <span className="text-[10px] sm:text-xs font-medium uppercase">Meu carrinho</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra 3: Menu de categorias */}
      <div className={`${headerBgDark} text-white py-3 px-4 sticky top-0 z-50`}>
        <nav className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <Link href="/produtos" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase hover:bg-white/10 rounded transition-colors">Todos</Link>
          {categorias.map((cat) => (
            <Link key={cat.id} href={`/produtos?categoria=${cat.slug}`} className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase hover:bg-white/10 rounded transition-colors flex items-center gap-1">
              {cat.nome}
              <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </Link>
          ))}
          <Link href="/produtos" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase hover:bg-white/10 rounded transition-colors">Produtos</Link>
          <Link href="/sobre" className="px-3 py-1.5 text-xs sm:text-sm font-semibold uppercase hover:bg-white/10 rounded transition-colors">Sobre</Link>
        </nav>
      </div>
    </>
  );
}
