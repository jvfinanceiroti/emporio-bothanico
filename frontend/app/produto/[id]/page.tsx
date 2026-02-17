"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";

export const dynamic = "force-dynamic";

function getProdutoImagem(p: any) {
  const url = p?.imagem_url;
  if (url && !url.includes("placeholder")) return url;
  const n = (p?.nome || "").toLowerCase();
  if (n.includes("essência") || n.includes("essencia")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=85";
  if (n.includes("refil") && n.includes("sabonete")) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=85";
  if (n.includes("difusor")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=85";
  if (n.includes("sabonete") && (n.includes("lavanda") || n.includes("artesanal"))) return "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&q=85";
  if (n.includes("vela") || n.includes("baunilha")) return "https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=500&q=85";
  if (n.includes("spray") || n.includes("eucalipto") || n.includes("home spray")) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85";
  return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=85";
}

function ProdutoContent() {
  const params = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState<any[]>([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`${API_URL}/produtos/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data));
  }, [params]);

  // Resetar toast ao trocar de produto (evita mostrar "adicionado" ao entrar na página)
  useEffect(() => {
    setMostrarToast(false);
  }, [params?.id]);

  useEffect(() => {
    if (!produto) return;
    fetch(`${API_URL}/produtos`)
      .then((res) => res.json())
      .then((lista: any[]) => {
        const outros = (lista || []).filter((p) => p.id !== produto.id && p.ativo !== false);
        const mesmaCategoria = outros.filter((p) => p.categoria_id === produto.categoria_id);
        const restante = outros.filter((p) => p.categoria_id !== produto.categoria_id);
        setProdutosRelacionados([...mesmaCategoria, ...restante].slice(0, 4));
      })
      .catch(() => setProdutosRelacionados([]));
  }, [produto]);

  const adicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(localStorage.getItem("carrinho") || "[]");
    for (let i = 0; i < quantidade; i++) carrinhoAtual.push(produto);
    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));
    window.dispatchEvent(new Event("carrinho-changed"));
    setMostrarToast(true);
    setTimeout(() => setMostrarToast(false), 2500);
  };

  if (!produto) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f6f3] to-white flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const imgUrl = produto.imagem_url && !produto.imagem_url.includes("placeholder") ? produto.imagem_url : getProdutoImagem(produto);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      {/* Toast */}
      <div className={`fixed top-6 right-6 z-[2000] px-6 py-4 rounded-2xl bg-[var(--success)] text-white font-semibold shadow-xl flex items-center gap-3 transition-all duration-300 ${mostrarToast ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"}`}>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
        Produto adicionado ao carrinho!
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/produtos" className="hover:text-[var(--accent)]">Produtos</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium truncate max-w-[200px] sm:max-w-xs inline-block align-bottom">{produto.nome}</span>
        </nav>

        {/* Card principal - Produto */}
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.08)] border border-[var(--border)] overflow-hidden mb-16">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Coluna imagem */}
            <div className="relative bg-gradient-to-br from-[var(--accent-light)]/30 to-[var(--warm-100)] p-8 sm:p-12 lg:p-16 flex items-center justify-center min-h-[340px] sm:min-h-[480px]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,90,74,0.03)_0%,transparent_70%)]" />
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={imgUrl}
                  alt={produto.nome}
                  className="max-w-full max-h-[320px] sm:max-h-[420px] object-contain drop-shadow-2xl"
                  onError={(e) => { (e.target as HTMLImageElement).src = getProdutoImagem(produto); }}
                />
              </div>
              {produto.estoque <= 5 && produto.estoque > 0 && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg">Últimas {produto.estoque} unidades</span>
              )}
              {produto.estoque === 0 && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg">Esgotado</span>
              )}
            </div>

            {/* Coluna detalhes */}
            <div className="p-8 sm:p-10 lg:p-14 flex flex-col">
              <p className="text-[var(--accent)] text-xs font-semibold uppercase tracking-[0.25em] mb-3" style={{ fontFamily: "var(--font-tagline)" }}>Empório Bothânico</p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[var(--foreground)] leading-tight mb-4" style={{ fontFamily: "var(--font-logo)" }}>
                {produto.nome}
              </h1>
              {produto.descricao && (
                <p className="text-[var(--muted)] text-base leading-relaxed mb-6">{produto.descricao}</p>
              )}
              {produto.sku && (
                <p className="text-sm text-[var(--muted)] mb-4">SKU: {produto.sku}</p>
              )}

              {/* Preço + Estoque */}
              <div className="mt-auto">
                <div className="inline-block bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] rounded-2xl px-6 py-5 mb-6">
                  <div className="text-3xl sm:text-4xl font-black text-[var(--accent)]" style={{ fontFamily: "var(--font-logo)" }}>
                    R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-1">ou 3x de R$ {(Number(produto.preco) / 3).toFixed(2).replace(".", ",")}</p>
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold mb-6 ${produto.estoque > 5 ? "text-[var(--success)]" : produto.estoque > 0 ? "text-[var(--warning)]" : "text-red-500"}`}>
                  <span className={`w-3 h-3 rounded-full ${produto.estoque > 5 ? "bg-[var(--success)]" : produto.estoque > 0 ? "bg-[var(--warning)]" : "bg-red-500"}`} />
                  {produto.estoque > 0 ? `${produto.estoque} em estoque` : "Produto indisponível"}
                </div>

                {/* Quantidade + Botão */}
                {produto.estoque > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Quantidade</label>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center rounded-xl border-2 border-[var(--border)] overflow-hidden bg-[var(--warm-50)]">
                        <button
                          onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                          className="w-12 h-12 flex items-center justify-center text-xl font-bold text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-colors"
                        >−</button>
                        <span className="w-14 text-center text-lg font-bold">{quantidade}</span>
                        <button
                          onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                          className="w-12 h-12 flex items-center justify-center text-xl font-bold text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-colors"
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={adicionarAoCarrinho}
                  disabled={produto.estoque <= 0}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    produto.estoque > 0
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/></svg>
                  {produto.estoque > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
                </button>
                <Link href="/produtos" className="block text-center text-[var(--muted)] font-medium mt-5 hover:text-[var(--accent)] transition-colors">
                  ← Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { icon: "🚚", titulo: "Envio para todo Brasil", desc: "Rastreamento incluído" },
            { icon: "🔒", titulo: "Compra segura", desc: "Pagamento protegido" },
            { icon: "↩️", titulo: "Troca facilitada", desc: "7 dias para trocar" },
            { icon: "💚", titulo: "100% original", desc: "Produtos selecionados" },
          ].map((b, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-[var(--border)] flex items-center gap-4 hover:border-[var(--accent)] hover:shadow-md transition-all">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <div className="font-bold text-sm text-[var(--foreground)]">{b.titulo}</div>
                <div className="text-xs text-[var(--muted)]">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Veja também */}
        {produtosRelacionados.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-logo)" }}>Veja também</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {produtosRelacionados.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-xl hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square bg-gradient-to-br from-[var(--accent-light)]/20 to-[var(--warm-100)] flex items-center justify-center p-4">
                    <img src={getProdutoImagem(p)} alt={p.nome} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" onError={(ev) => { (ev.target as HTMLImageElement).src = getProdutoImagem(p); }} />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[var(--foreground)] text-sm line-clamp-2 mb-2 group-hover:text-[var(--accent)]">{p.nome}</h3>
                    <div className="text-lg font-black text-[var(--accent)]">R$ {Number(p.preco).toFixed(2).replace(".", ",")}</div>
                    <p className="text-xs text-[var(--muted)]">À vista no PIX</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default function ProdutoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f6f3] flex flex-col">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin" />
        </div>
      </div>
    }>
      <ProdutoContent />
    </Suspense>
  );
}
