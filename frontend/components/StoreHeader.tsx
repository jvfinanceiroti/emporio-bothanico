"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageCircle,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useCatalogo } from "@/hooks/useCatalogo";

const CATEGORIAS_FALLBACK = [
  { id: -1, nome: "Aromas", slug: "aromas" },
  { id: -2, nome: "Aromaterapia", slug: "aromaterapia" },
  { id: -3, nome: "Banho", slug: "banho" },
  { id: -4, nome: "Delicadezas e Presentes", slug: "delicadezas-e-presentes" },
  { id: -5, nome: "Essências", slug: "essencias" },
  { id: -6, nome: "Perfumes", slug: "perfumes" },
  { id: -7, nome: "Kits", slug: "kits" },
];

export function StoreHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [totalItens, setTotalItens] = useState(0);
  const [busca, setBusca] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const { categorias: categoriasApi } = useCatalogo(
    { includeProdutos: false },
    [],
    CATEGORIAS_FALLBACK
  );
  const categorias = categoriasApi.length > 0 ? categoriasApi : CATEGORIAS_FALLBACK;

  useEffect(() => {
    const update = () => {
      const salvo = localStorage.getItem("carrinho");
      if (salvo) {
        const arr = JSON.parse(salvo);
        setTotalItens(arr.reduce((acc: number, i: { quantidade?: number }) => acc + (i.quantidade || 1), 0));
      }
    };
    update();
    window.addEventListener("carrinho-changed", update);
    return () => window.removeEventListener("carrinho-changed", update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuAberto(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (busca.trim()) {
      router.push(`/produtos?q=${encodeURIComponent(busca.trim())}`);
    } else {
      router.push("/produtos");
    }
  };

  const categoriasOrdenadas = [...categorias].sort((a, b) => {
    if (a.slug === "kits") return 1;
    if (b.slug === "kits") return -1;
    return a.nome.localeCompare(b.nome, "pt-BR");
  });

  const headerCls = isHome
    ? `lux-header-sticky ${scrolled ? "lux-header-glass" : "lux-header-overlay"}`
    : "lux-header-solid";

  return (
    <header className={headerCls}>
      {/* Top bar — frete grátis */}
      <div className={`hidden sm:block py-2 overflow-hidden transition-colors duration-500 ${isHome && !scrolled ? "border-b border-[var(--lux-gold)]/10" : "border-b border-[var(--lux-gold)]/8"}`}>
        <div className="flex lux-marquee whitespace-nowrap">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-3 mx-10 text-[10px] uppercase tracking-[0.25em] text-[var(--lux-cream)]/50"
                >
                  <span className="text-[var(--lux-gold)]">◆</span>
                  <span className="text-[var(--lux-gold)] font-medium">Frete grátis</span>
                  <span>nas compras acima de R$ 299</span>
                  <span className="text-[var(--lux-gold)]">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4 lg:gap-8 py-4 lg:py-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 sm:gap-4 shrink-0 group">
            <img
              src="/logo.png?v=20260630t"
              alt="Empório Bothânico"
              className="w-16 h-16 sm:w-[72px] sm:h-[72px] lg:w-20 lg:h-20 object-contain shrink-0 transition-transform duration-400 group-hover:scale-[1.03]"
            />
            <div className="hidden sm:block">
              <h1
                className="text-lg lg:text-xl text-[var(--lux-cream)] font-medium leading-tight tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Empório Bothânico
              </h1>
              <p className="text-[9px] lg:text-[10px] uppercase tracking-[0.3em] text-[var(--lux-gold)]/70 mt-0.5">
                Delicadezas e Banho
              </p>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-auto">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="O que você está buscando?"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={`w-full h-14 lg:h-[56px] pl-6 pr-14 rounded-full text-sm transition-all duration-400 ${
                  isHome && !scrolled ? "lux-search-glass" : "lux-search-input"
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-[var(--lux-gold)] hover:text-[var(--lux-gold-light)] transition-colors duration-300"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3 lg:gap-5 ml-auto">
            <a
              href="https://www.instagram.com/emporiobothanicoita/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center justify-center w-9 h-9 text-[var(--lux-cream)]/40 hover:text-[var(--lux-gold-light)] transition-all duration-400 rounded-full hover:shadow-[0_0_20px_rgba(218,185,123,0.15)]"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://wa.me/553195503794"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex flex-col items-center gap-1 text-[var(--lux-cream)]/50 hover:text-[var(--lux-gold)] transition-colors duration-300 p-2"
            >
              <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[8px] uppercase tracking-[0.15em] hidden lg:block">Atendimento</span>
            </a>
            <Link
              href="/meus-pedidos"
              className="hidden sm:flex flex-col items-center gap-1 text-[var(--lux-cream)]/50 hover:text-[var(--lux-gold)] transition-colors duration-300 p-2"
            >
              <User className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[8px] uppercase tracking-[0.15em] hidden lg:block">Meus Pedidos</span>
            </Link>
            <Link
              href="/carrinho"
              className="relative flex flex-col items-center gap-1 text-[var(--lux-cream)]/50 hover:text-[var(--lux-gold)] transition-colors duration-300 p-2"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItens > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] flex items-center justify-center bg-[var(--lux-gold)] text-[var(--lux-deep)] text-[9px] font-semibold rounded-full">
                  {totalItens}
                </span>
              )}
              <span className="text-[8px] uppercase tracking-[0.15em] hidden lg:block">Carrinho</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuAberto(!menuAberto)}
              className="md:hidden p-2 text-[var(--lux-cream)]/70 hover:text-[var(--lux-gold)] transition-colors"
              aria-label="Menu"
            >
              {menuAberto ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="O que você está buscando?"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={`w-full h-12 pl-5 pr-12 rounded-full text-sm ${
                isHome && !scrolled ? "lux-search-glass" : "lux-search-input"
              }`}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-[var(--lux-gold)]">
              <Search className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </form>

        {/* Nav categories — desktop */}
        <nav className={`hidden md:flex items-center gap-1 pb-3 overflow-x-auto scrollbar-hide pt-3 transition-colors duration-500 ${isHome && !scrolled ? "border-t border-[var(--lux-gold)]/10" : "border-t border-[var(--lux-gold)]/6"}`}>
          <Link href="/#mais-vendidos" className="lux-nav-link active px-4 py-2">
            Mais Vendidos ★
          </Link>
          {categoriasOrdenadas.map((cat) => (
            <Link
              key={cat.id}
              href={`/produtos?categoria=${cat.slug}`}
              className="lux-nav-link px-4 py-2"
            >
              {cat.nome}
            </Link>
          ))}
          <Link href="/promocoes" className="lux-nav-link px-4 py-2 text-[var(--lux-gold)]">
            Promoções
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuAberto && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden border-t border-[var(--lux-gold)]/8 overflow-hidden"
          >
            <nav className="px-4 py-4 flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
              <Link href="/#mais-vendidos" className="lux-nav-link active py-3 px-2">
                Mais Vendidos ★
              </Link>
              {categoriasOrdenadas.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/produtos?categoria=${cat.slug}`}
                  className="lux-nav-link py-3 px-2"
                >
                  {cat.nome}
                </Link>
              ))}
              <Link href="/promocoes" className="lux-nav-link py-3 px-2 text-[var(--lux-gold)]">
                Promoções
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
