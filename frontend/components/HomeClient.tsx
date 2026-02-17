"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ProdutosCarousel } from "./ProdutosCarousel";

const AVALIACOES_GOOGLE = [
  { nome: "Ana Paula Morais", iniciais: "AP", texto: "Que loja maravilhosa, cheirosa, cheia de detalhes, tudo encanta! Mas eu preciso destacar o conhecimento que a Nayara tem sobre os aromas, e suas aplicações! Coloquei um aroma na minha empresa e todos os dias é uma chuva de elogios.", extra: "Local Guide • Google" },
  { nome: "César Marcos", iniciais: "CM", texto: "Eu trabalho de home office e ganhei um aromatizador para ambiente de alecrim. O cheiro é simplesmente maravilhoso, melhora o meu humor e me faz sentir melhor. Simplesmente perfeito!", extra: "Local Guide • Google" },
  { nome: "Fernanda R.", iniciais: "FR", texto: "Atendimento impecável! A Nayara é super atenciosa e conhece cada produto. Comprei sabonetes e velas, tudo com cheiro divino. Já indiquei para várias amigas!", extra: "Avaliação Google" },
  { nome: "Roberto L.", iniciais: "RL", texto: "Loja encantadora! Ambiente aconchegante, produtos de qualidade e preços justos. O difusor que comprei dura meses. Recomendo demais!", extra: "Avaliação Google" },
  { nome: "Mariana C.", iniciais: "MC", texto: "Melhor loja de perfumaria da região! Variedade incrível, tudo muito bem apresentado. Sempre que preciso de presente já sei onde ir.", extra: "Avaliação Google" },
  { nome: "Paulo H.", iniciais: "PH", texto: "Produtos excelentes e entrega rápida. Comprei online e superou as expectativas. Embalagem linda, como presente. Parabéns à equipe!", extra: "Avaliação Google" },
];

export function HomeClient({ produtosIniciais = [] }: { produtosIniciais?: any[] }) {
  const [produtos, setProdutos] = useState<any[]>(produtosIniciais);
  const [carregando, setCarregando] = useState(produtosIniciais.length === 0);
  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [ultimoAdicionadoId, setUltimoAdicionadoId] = useState<number | null>(null);

  useEffect(() => {
    if (produtosIniciais.length > 0) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    fetch(`${API_URL}/produtos`)
      .then(res => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then(data => {
        const arr = Array.isArray(data) ? data : [];
        setProdutos(arr.filter((p: any) => p.ativo !== false && (p.estoque ?? 0) > 0));
      })
      .catch(err => {
        console.error("Erro ao carregar produtos:", err);
        setProdutos([]);
      })
      .finally(() => setCarregando(false));
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, [produtosIniciais.length]);

  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) setCarrinho(JSON.parse(salvo));
  }, []);

  const adicionarAoCarrinho = (produto: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const novo = [...carrinho];
    const idx = novo.findIndex((i: any) => i.id === produto.id);
    if (idx >= 0) novo[idx].quantidade += 1;
    else novo.push({ ...produto, quantidade: 1 });
    setCarrinho(novo);
    localStorage.setItem("carrinho", JSON.stringify(novo));
    window.dispatchEvent(new Event("carrinho-changed"));
    setUltimoAdicionadoId(produto.id);
    setTimeout(() => setUltimoAdicionadoId(null), 1800);
  };

  const totalItens = carrinho.reduce((acc: number, i: any) => acc + (i.quantidade || 1), 0);

  const getProdutoImagem = (p: any) => {
    const url = p?.imagem_url;
    if (url && !url.includes("placeholder")) return url;
    const n = (p?.nome || "").toLowerCase();
    if (n.includes("essência") || n.includes("essencia")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80";
    if (n.includes("refil") || n.includes("sabonete líquido")) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80";
    if (n.includes("difusor")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80";
    if (n.includes("sabonete") && n.includes("lavanda")) return "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&q=80";
    if (n.includes("vela") || n.includes("baunilha")) return "https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=400&q=80";
    if (n.includes("spray") || n.includes("eucalipto") || n.includes("home spray")) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80";
    return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80";
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      {/* BANNER */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] lg:min-h-[60vh] flex overflow-hidden">
        <div className="absolute inset-0 bg-[#2d5a4a] flex items-center justify-center overflow-hidden">
          <img
            src="/banner-loja.png"
            alt="Empório Bothânico - Nossa loja em Itabira"
            className="w-full h-full object-cover object-[55%_center] lg:object-cover lg:object-center lg:scale-[0.82]"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"; }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2d5a4a]/95 via-[#2d5a4a]/75 to-[#2d5a4a]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col justify-center py-8 sm:py-10">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-white leading-[1.05] mb-2 drop-shadow-lg" style={{ fontFamily: "var(--font-logo)" }}>
                Empório Bothânico
              </h1>
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/90 mb-4" style={{ fontFamily: "var(--font-tagline)" }}>
                Delicadezas e Banho
              </p>
              <p className="text-white/95 text-base sm:text-lg max-w-md mb-6 leading-relaxed">
                Fragrâncias exclusivas e produtos de banho que transformam seu dia a dia. Conheça nossa loja em Itabira.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/produtos" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2d5a4a] font-bold text-sm rounded-xl hover:scale-105 transition-transform shadow-xl">
                  Explorar Produtos
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
                <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border-2 border-white text-white font-semibold text-sm rounded-xl hover:bg-white/15 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162z"/></svg>
                  @emporiobothanicoita
                </a>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-end">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 max-w-sm">
                <p className="text-white/80 text-xs uppercase tracking-[0.3em] mb-2" style={{ fontFamily: "var(--font-tagline)" }}>Ao vivo no Instagram</p>
                <p className="text-white text-2xl sm:text-3xl font-semibold mb-2" style={{ fontFamily: "var(--font-logo)" }}>Lives semanais</p>
                <p className="text-white/90 text-sm mb-4">Novidades, dicas de aromas e promoções exclusivas. Siga e ative as notificações!</p>
                <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#2d5a4a] font-bold rounded-xl hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162z"/></svg>
                  Ver no Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16 mt-8 sm:mt-10 text-white/95 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-xl sm:text-2xl stars-google">{"★".repeat(5)}</div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-logo)" }}>5,0</div>
              <div className="text-xs sm:text-sm font-medium" style={{ fontFamily: "var(--font-tagline)" }}>Nota no Google</div>
              <a href="https://www.google.com/maps/search/Emp%C3%B3rio+Both%C3%A2nico+Itabira+MG" target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-white/70 hover:text-white hover:underline mt-1 inline-block">18 avaliações →</a>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-logo)" }}>24h</div>
              <div className="text-xs sm:text-sm font-medium" style={{ fontFamily: "var(--font-tagline)" }}>Envio em 1 dia útil</div>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              </div>
              <div className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-logo)" }}>1000+</div>
              <div className="text-xs sm:text-sm font-medium" style={{ fontFamily: "var(--font-tagline)" }}>Clientes que confiam</div>
            </div>
          </div>
        </div>
      </section>

      <ProdutosCarousel
        produtos={produtos}
        carregando={carregando}
        getProdutoImagem={getProdutoImagem}
        adicionarAoCarrinho={adicionarAoCarrinho}
        ultimoAdicionadoId={ultimoAdicionadoId}
      />

      {/* BANNER BENEFÍCIOS */}
      <section className="relative py-20 lg:py-24 px-4 sm:px-6 overflow-hidden text-white">
        {/* Fundo enriquecido: gradiente + orbs + padrão botânico sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)] via-[#2d5a4a] to-[#234a3d]" />
        <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 8-8 14-14 16 6 2 12 8 14 16 2-8 8-14 14-16-6-2-12-8-14-16z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E\")" }} />
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full bg-amber-200/5 blur-2xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 35%)" }} />
        {/* Bordas decorativas */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-extrabold text-center mb-14">Por que comprar conosco?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Nacional</h3>
              <p className="text-white/90 text-sm">Enviamos para todo o Brasil com rastreamento</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Qualidade Garantida</h3>
              <p className="text-white/90 text-sm">Produtos 100% originais</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Pagamento Seguro</h3>
              <p className="text-white/90 text-sm">Ambiente criptografado</p>
            </div>
            <div className="text-center group">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Embalagem Premium</h3>
              <p className="text-white/90 text-sm">Cuidadosamente embalado para presentear</p>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-[var(--background)] to-[#f0f4f2]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-[0.25em] mb-3">Nosso dia a dia</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] mb-4">Siga-nos no Instagram</h2>
            <p className="text-[var(--muted)] max-w-xl mx-auto mb-8">Fragrâncias, novidades e um pouquinho da nossa loja em Itabira.</p>
            <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all hover:scale-105 shadow-lg" style={{ background: "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @emporiobothanicoita
            </a>
          </div>
        </div>
      </section>

      <AvaliacoesCarousel />
      <SiteFooter />
    </div>
  );
}

function AvaliacoesCarousel() {
  const [index, setIndex] = useState(0);
  const totalSlides = Math.ceil(AVALIACOES_GOOGLE.length / 2);
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, totalSlides - 1)));
  const visible = AVALIACOES_GOOGLE.slice(index * 2, index * 2 + 2);

  return (
    <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-b from-white to-[var(--warm-100)] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <p className="text-[var(--accent)] font-semibold text-sm uppercase tracking-[0.2em] mb-4 text-center">Avaliações reais</p>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--foreground)] text-center mb-6 px-2">O que dizem nossos clientes no Google</h2>
        <div className="flex flex-col items-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-white border border-[var(--border)] shadow-[var(--shadow-md)]">
            <span className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">5,0</span>
            <span className="flex gap-0.5 text-xl sm:text-2xl stars-google">{"★".repeat(5)}</span>
            <span className="text-[var(--muted)] text-xs sm:text-sm hidden sm:inline">•</span>
            <span className="text-[var(--muted)] font-medium text-xs sm:text-base">18 avaliações</span>
          </div>
          <a href="https://www.google.com/maps/search/Emp%C3%B3rio+Both%C3%A2nico+Itabira+MG" target="_blank" rel="noopener noreferrer" className="mt-3 sm:mt-4 text-[var(--accent)] font-semibold text-xs sm:text-sm hover:underline">Ver todas no Google →</a>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-h-[200px]">
            {visible.map((av, i) => (
              <div key={`${index}-${i}`} className="bg-white rounded-2xl p-5 sm:p-6 border border-[var(--border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all duration-300">
                <div className="flex gap-1 mb-2 sm:mb-3 text-base sm:text-lg stars-google">{"★".repeat(5)}</div>
                <blockquote className="text-[var(--foreground)] leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base line-clamp-4 sm:line-clamp-none">&ldquo;{av.texto}&rdquo;</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--accent-light)] flex items-center justify-center text-xs sm:text-sm font-bold text-[var(--accent)] shrink-0">{av.iniciais}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-[var(--foreground)] truncate">{av.nome}</div>
                    <div className="text-xs text-[var(--muted)]">{av.extra}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
            <button onClick={() => goTo(index - 1)} disabled={index <= 0} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center shadow-lg hover:bg-[var(--accent)] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--accent)] disabled:hover:scale-100" aria-label="Anterior">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
            <div className="flex items-center gap-3">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button key={i} onClick={() => goTo(i)} className={`rounded-full transition-all duration-200 ${i === index ? "w-5 h-5 sm:w-6 sm:h-6 bg-[var(--accent)] shadow-md scale-110" : "w-4 h-4 sm:w-5 sm:h-5 bg-[var(--muted-light)] hover:bg-[var(--muted)] hover:scale-110"}`} aria-label={`Ir para avaliação ${i + 1}`} />
              ))}
            </div>
            <button onClick={() => goTo(index + 1)} disabled={index >= totalSlides - 1} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center shadow-lg hover:bg-[var(--accent)] hover:text-white hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[var(--accent)] disabled:hover:scale-100" aria-label="Próxima">
              <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
