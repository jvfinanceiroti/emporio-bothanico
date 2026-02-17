"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  quantidade: number;
}

function getProdutoImagem(p: any) {
  const url = p?.imagem_url;
  if (url && !url.includes("placeholder")) return url;
  const n = (p?.nome || "").toLowerCase();
  if (n.includes("essência") || n.includes("essencia")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=85";
  if (n.includes("refil") && n.includes("sabonete")) return "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=85";
  if (n.includes("difusor")) return "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=85";
  if (n.includes("sabonete") && (n.includes("lavanda") || n.includes("artesanal"))) return "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&q=85";
  if (n.includes("vela") || n.includes("baunilha")) return "https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=400&q=85";
  if (n.includes("spray") || n.includes("eucalipto") || n.includes("home spray")) return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=85";
  return "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=85";
}

export default function CarrinhoPage() {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho") || "[]");
    const carrinhoAgrupado = carrinhoSalvo.reduce((acc: ItemCarrinho[], item: any) => {
      const existente = acc.find((i) => i.id === item.id);
      if (existente) existente.quantidade += 1;
      else acc.push({ ...item, quantidade: 1 });
      return acc;
    }, []);
    setCarrinho(carrinhoAgrupado);
  }, []);

  const atualizarLocalStorage = (novoCarrinho: ItemCarrinho[]) => {
    const paraSalvar = novoCarrinho.flatMap((item) =>
      Array(item.quantidade).fill({ ...item, quantidade: undefined })
    );
    localStorage.setItem("carrinho", JSON.stringify(paraSalvar));
    window.dispatchEvent(new Event("carrinho-changed"));
  };

  const alterarQuantidade = (id: number, delta: number) => {
    const novo = carrinho.map((item) =>
      item.id === id ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
    );
    setCarrinho(novo);
    atualizarLocalStorage(novo);
  };

  const removerProduto = (id: number) => {
    const novo = carrinho.filter((item) => item.id !== id);
    setCarrinho(novo);
    atualizarLocalStorage(novo);
  };

  const calcularFrete = async () => {
    const cepNum = cep.replace(/\D/g, "");
    if (cepNum.length !== 8) {
      setErroFrete("CEP inválido. Digite 8 dígitos.");
      return;
    }
    setCarregandoFrete(true);
    setErroFrete("");
    await new Promise((r) => setTimeout(r, 1200));
    const n = parseInt(cepNum);
    if (n >= 1000000 && n <= 5999999) setFrete(0);
    else if (n >= 6000000 && n <= 19999999) setFrete(15);
    else if (n >= 20000000 && n <= 28999999) setFrete(12);
    else if (n >= 29000000 && n <= 39999999) setFrete(18);
    else setFrete(25);
    setCarregandoFrete(false);
  };

  const subtotal = carrinho.reduce((acc, i) => acc + Number(i.preco) * i.quantidade, 0);
  const total = subtotal + (frete ?? 0);
  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);

  const formatarCep = (v: string) => {
    const n = v.replace(/\D/g, "");
    return n.length <= 5 ? n : `${n.slice(0, 5)}-${n.slice(5, 8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/produtos" className="hover:text-[var(--accent)]">Produtos</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium">Carrinho</span>
        </nav>

        {carrinho.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] p-12 sm:p-20 text-center">
            <div className="text-7xl sm:text-8xl mb-6">🛒</div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] mb-3" style={{ fontFamily: "var(--font-logo)" }}>
              Seu carrinho está vazio
            </h2>
            <p className="text-[var(--muted)] mb-8 max-w-sm mx-auto">Adicione produtos para continuar comprando e descobrir nossas fragrâncias.</p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-white font-bold rounded-2xl hover:bg-[var(--accent-hover)] hover:scale-105 transition-all"
            >
              Explorar Produtos
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
            {/* Lista de itens */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-logo)" }}>
                Itens no Carrinho ({totalItens})
              </h1>
              <div className="space-y-4">
                {carrinho.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 sm:p-6 border border-[var(--border)] shadow-sm hover:shadow-lg hover:border-[var(--border-strong)] transition-all"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-light)]/30 to-[var(--warm-100)] flex items-center justify-center overflow-hidden">
                        <img
                          src={getProdutoImagem(item)}
                          alt={item.nome}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).src = getProdutoImagem(item); }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[var(--foreground)] text-base sm:text-lg mb-1 line-clamp-2">{item.nome}</h3>
                        <div className="text-xl font-black text-[var(--accent)] mb-4">R$ {Number(item.preco).toFixed(2).replace(".", ",")}</div>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center rounded-xl border-2 border-[var(--border)] bg-[var(--warm-50)] overflow-hidden">
                            <button onClick={() => alterarQuantidade(item.id, -1)} className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-[var(--accent-light)] transition-colors">
                              −
                            </button>
                            <span className="w-12 text-center font-bold text-sm">{item.quantidade}</span>
                            <button onClick={() => alterarQuantidade(item.id, 1)} className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-[var(--accent-light)] transition-colors">
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removerProduto(item.id)}
                            className="flex items-center gap-2 text-red-500 font-semibold text-sm hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumo - sticky */}
            <div className="lg:sticky lg:top-36">
              <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.08)] border border-[var(--border)] p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-logo)" }}>
                  Resumo do Pedido
                </h2>

                {/* Frete */}
                <div className="mb-6 pb-6 border-b border-[var(--border)]">
                  <label className="block text-xs font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Calcular frete</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(formatarCep(e.target.value))}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--warm-50)] text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all"
                    />
                    <button
                      onClick={calcularFrete}
                      disabled={carregandoFrete}
                      className="px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-hover)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {carregandoFrete ? "..." : "OK"}
                    </button>
                  </div>
                  {erroFrete && <p className="text-red-500 text-sm mt-2 font-medium">{erroFrete}</p>}
                  {frete !== null && (
                    <p className="flex items-center gap-2 mt-3 text-[var(--success)] font-semibold text-sm">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      {frete === 0 ? "Frete grátis!" : `Frete: R$ ${frete.toFixed(2).replace(".", ",")}`}
                    </p>
                  )}
                </div>

                {/* Valores */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Subtotal ({totalItens} {totalItens === 1 ? "item" : "itens"})</span>
                    <span className="font-semibold text-[var(--foreground)]">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  {frete !== null && (
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>Frete</span>
                      <span className="font-semibold text-[var(--foreground)]">{frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2).replace(".", ",")}`}</span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t-2 border-[var(--border)] mb-6">
                  <span className="text-lg font-bold text-[var(--foreground)]">Total</span>
                  <span className="text-2xl sm:text-3xl font-black text-[var(--accent)]" style={{ fontFamily: "var(--font-logo)" }}>
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-5 rounded-2xl bg-[var(--accent)] text-white font-bold text-lg hover:bg-[var(--accent-hover)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                >
                  Finalizar Compra
                </button>
                <Link href="/produtos" className="block text-center text-[var(--muted)] font-medium mt-4 hover:text-[var(--accent)] transition-colors">
                  ← Continuar comprando
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                {["🚚 Envio rápido", "🔒 Compra segura", "↩️ Troca fácil"].map((t, i) => (
                  <span key={i} className="text-xs text-[var(--muted)] font-medium">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
