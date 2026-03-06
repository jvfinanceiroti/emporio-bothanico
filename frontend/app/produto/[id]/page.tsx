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

function getGaleriaImagens(produto: any) {
  const fallback = getProdutoImagem(produto);
  const coletadas: string[] = [];

  const adicionar = (valor: unknown) => {
    if (typeof valor !== "string") return;
    const limpa = valor.trim();
    if (!limpa) return;
    coletadas.push(limpa);
  };

  adicionar(produto?.imagem_url);

  if (Array.isArray(produto?.imagens)) {
    produto.imagens.forEach(adicionar);
  } else if (typeof produto?.imagens === "string") {
    try {
      const parsed = JSON.parse(produto.imagens);
      if (Array.isArray(parsed)) parsed.forEach(adicionar);
      else produto.imagens.split(",").forEach(adicionar);
    } catch {
      produto.imagens.split(",").forEach(adicionar);
    }
  }

  Object.entries(produto || {}).forEach(([chave, valor]) => {
    if (typeof valor === "string" && /^imagem(_url)?(_\d+)?$/i.test(chave)) adicionar(valor);
  });

  const unicas = Array.from(new Set(coletadas.filter((u) => /^https?:\/\//i.test(u))));
  return unicas.length ? unicas : [fallback];
}

function ProdutoContent() {
  const params = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [produtosRelacionados, setProdutosRelacionados] = useState<any[]>([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [quantidade, setQuantidade] = useState(1);
  const [imagemAtiva, setImagemAtiva] = useState("");
  const [lightboxAberto, setLightboxAberto] = useState(false);
  const [quantidadeAnimando, setQuantidadeAnimando] = useState(false);
  const [botaoQtdAtivo, setBotaoQtdAtivo] = useState<"+" | "-" | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`${API_URL}/produtos/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data));
  }, [params]);

  useEffect(() => {
    if (!produto) return;
    const galeria = getGaleriaImagens(produto);
    setImagemAtiva(galeria[0]);
    setQuantidade(1);

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

  const animarQuantidade = (tipo: "+" | "-") => {
    setBotaoQtdAtivo(tipo);
    setQuantidadeAnimando(true);
    setTimeout(() => setBotaoQtdAtivo(null), 160);
    setTimeout(() => setQuantidadeAnimando(false), 170);
  };

  const diminuirQuantidade = () => {
    setQuantidade((qtdAtual: number) => {
      const proximo = Math.max(1, qtdAtual - 1);
      if (proximo !== qtdAtual) animarQuantidade("-");
      return proximo;
    });
  };

  const aumentarQuantidade = () => {
    setQuantidade((qtdAtual: number) => {
      const limite = Number(produto?.estoque || 1);
      const proximo = Math.min(limite, qtdAtual + 1);
      if (proximo !== qtdAtual) animarQuantidade("+");
      return proximo;
    });
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

  const galeriaImagens = getGaleriaImagens(produto);
  const imgUrl = imagemAtiva || galeriaImagens[0];
  const estoque = Number(produto.estoque || 0);

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
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.08)] border border-[var(--border)] overflow-hidden mb-12 sm:mb-14">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Coluna imagem */}
            <div className="relative bg-gradient-to-br from-[var(--accent-light)]/30 to-[var(--warm-100)] p-6 sm:p-8 lg:p-10 flex flex-col justify-center min-h-[360px] sm:min-h-[520px]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,90,74,0.03)_0%,transparent_70%)]" />
              <div className="relative z-10 w-full h-full flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setLightboxAberto(true)}
                  className="group relative w-full max-w-[620px] rounded-3xl bg-white/45 p-5 sm:p-7 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden"
                  aria-label="Ampliar imagem do produto"
                >
                  <div className="absolute top-4 right-4 text-[11px] uppercase tracking-wider font-semibold text-[var(--accent)] bg-white/85 rounded-full px-3 py-1">Clique para ampliar</div>
                  <img
                    src={imgUrl}
                    alt={produto.nome}
                    className="max-w-full max-h-[360px] sm:max-h-[460px] object-contain drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = getProdutoImagem(produto); }}
                  />
                </button>

                {galeriaImagens.length > 1 && (
                  <div className="mt-4 sm:mt-5 w-full max-w-[620px] flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                    {galeriaImagens.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        onClick={() => setImagemAtiva(img)}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white shadow-sm transition-all ${imagemAtiva === img ? "border-[var(--accent)] ring-2 ring-[var(--accent-light)]" : "border-[var(--border)] hover:border-[var(--accent)]/60"}`}
                        aria-label={`Selecionar imagem ${idx + 1}`}
                      >
                        <img src={img} alt={`${produto.nome} - miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {estoque <= 5 && estoque > 0 && (
                <span className="absolute top-6 left-6 px-4 py-2 bg-[var(--accent)] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg">Últimas {estoque} unidades</span>
              )}
              {estoque === 0 && (
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
                <div className="inline-block bg-gradient-to-r from-[var(--accent-light)] to-[var(--accent-warm)] rounded-2xl px-6 py-5 mb-5 border border-[var(--border)]/60">
                  <div className="text-4xl sm:text-5xl font-black text-[var(--accent)] leading-none" style={{ fontFamily: "var(--font-logo)" }}>
                    R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
                  </div>
                  <p className="text-sm text-[var(--muted)] mt-2">ou 3x de R$ {(Number(produto.preco) / 3).toFixed(2).replace(".", ",")} sem juros</p>
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold mb-6 ${estoque >= 30 ? "text-[var(--success)]" : estoque > 0 ? "text-[var(--warning)]" : "text-red-500"}`}>
                  <span className={`w-3 h-3 rounded-full ${estoque >= 30 ? "bg-[var(--success)]" : estoque > 0 ? "bg-[var(--warning)]" : "bg-red-500"}`} />
                  {estoque <= 0 ? (
                    "Produto indisponível"
                  ) : estoque < 30 ? (
                    <span className="inline-flex items-center gap-1">⚠️ Apenas {estoque} unidades disponíveis</span>
                  ) : (
                    `${estoque} unidades em estoque`
                  )}
                </div>

                {/* Quantidade + Botão */}
                {estoque > 0 && (
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Quantidade</label>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center rounded-xl border-2 border-[var(--border)] overflow-hidden bg-[var(--warm-50)]">
                        <button
                          onClick={diminuirQuantidade}
                          className={`w-12 h-12 flex items-center justify-center text-xl font-bold text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-all duration-150 ${botaoQtdAtivo === "-" ? "scale-110" : "scale-100"}`}
                        >−</button>
                        <span className={`w-14 text-center text-lg font-bold transition-all duration-150 ease-out ${quantidadeAnimando ? "opacity-70 -translate-y-[1px]" : "opacity-100 translate-y-0"}`}>
                          {quantidade}
                        </span>
                        <button
                          onClick={aumentarQuantidade}
                          className={`w-12 h-12 flex items-center justify-center text-xl font-bold text-[var(--foreground)] hover:bg-[var(--accent-light)] transition-all duration-150 ${botaoQtdAtivo === "+" ? "scale-110" : "scale-100"}`}
                        >+</button>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={adicionarAoCarrinho}
                  disabled={produto.estoque <= 0}
                  className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                    estoque > 0
                      ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/></svg>
                  {estoque > 0 ? "Adicionar ao Carrinho" : "Indisponível"}
                </button>
                {estoque > 0 && <p className="text-center text-xs text-[var(--muted)] mt-2">Pagamento protegido</p>}

                {estoque > 0 && (
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { icon: "🚚", titulo: "Envio para todo Brasil" },
                      { icon: "🔒", titulo: "Compra segura" },
                      { icon: "↩️", titulo: "Troca facilitada" },
                      { icon: "💚", titulo: "100% original" },
                    ].map((item) => (
                      <div key={item.titulo} className="rounded-xl border border-[var(--border)] bg-[var(--warm-50)]/75 px-3 py-2.5 text-sm text-[var(--foreground)] flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.titulo}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Link href="/produtos" className="block text-center text-[var(--muted)] font-medium mt-5 hover:text-[var(--accent)] transition-colors">
                  ← Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Veja também */}
        {produtosRelacionados.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-logo)" }}>Veja também</h2>
            <div className="flex sm:grid sm:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 snap-x snap-mandatory">
              {produtosRelacionados.map((p) => (
                <Link
                  key={p.id}
                  href={`/produto/${p.id}`}
                  className="group min-w-[72%] sm:min-w-0 snap-start bg-white rounded-2xl overflow-hidden border border-[var(--border)] hover:shadow-xl hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-300"
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

      {lightboxAberto && (
        <div
          className="fixed inset-0 z-[3000] bg-black/75 backdrop-blur-[2px] p-4 sm:p-8 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxAberto(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxAberto(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-8 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Fechar imagem ampliada"
          >
            ✕
          </button>
          <img
            src={imgUrl}
            alt={`${produto.nome} ampliado`}
            className="max-w-[94vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
