"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { API_URL } from "@/lib/api";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  peso_kg?: number;
  altura_cm?: number;
  largura_cm?: number;
  comprimento_cm?: number;
  quantidade: number;
}

interface OpcaoFrete {
  servico: string;
  preco: number;
  prazo: number;
  erro: string | null;
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
  const FRETE_GRATIS_MINIMO = 299;
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [cep, setCep] = useState("");
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[]>([]);
  const [tipoEnvio, setTipoEnvio] = useState<string>("PAC");
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");
  const [freteCalculado, setFreteCalculado] = useState(false);
  const [animacaoQtdItemId, setAnimacaoQtdItemId] = useState<number | null>(null);
  const [animacaoQtdBotao, setAnimacaoQtdBotao] = useState<{ id: number; delta: number } | null>(null);

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
      item.id === id
        ? { ...item, quantidade: Math.max(1, item.quantidade + delta) }
        : item
    );
    setAnimacaoQtdBotao({ id, delta });
    setAnimacaoQtdItemId(id);
    setTimeout(() => setAnimacaoQtdBotao(null), 160);
    setTimeout(() => setAnimacaoQtdItemId((atual) => (atual === id ? null : atual)), 170);
    setCarrinho(novo);
    atualizarLocalStorage(novo);
    if (freteCalculado) {
      setFreteCalculado(false);
      setOpcoesFrete([]);
    }
  };

  const removerProduto = (id: number) => {
    const novo = carrinho.filter((item) => item.id !== id);
    setCarrinho(novo);
    atualizarLocalStorage(novo);
    if (freteCalculado) {
      setFreteCalculado(false);
      setOpcoesFrete([]);
    }
  };

  const calcularFrete = async () => {
    const cepNum = cep.replace(/\D/g, "");
    if (cepNum.length !== 8) {
      setErroFrete("CEP inválido. Digite 8 dígitos.");
      return;
    }
    if (carrinho.length === 0) return;

    setCarregandoFrete(true);
    setErroFrete("");
    setOpcoesFrete([]);

    try {
      const res = await fetch(`${API_URL}/frete/calcular`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cepDestino: cepNum,
          produtos: carrinho.map(item => ({
            id: item.id,
            peso_kg: item.peso_kg,
            altura_cm: item.altura_cm,
            largura_cm: item.largura_cm,
            comprimento_cm: item.comprimento_cm,
            preco: item.preco,
            quantidade: item.quantidade,
          })),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody?.detalhe || errBody?.error || "Erro ao calcular frete");
      }
      const data: OpcaoFrete[] = await res.json();

      if (data.length === 0) {
        setErroFrete("Não foi possível calcular o frete para este CEP.");
      } else {
        setOpcoesFrete(data);
        setFreteCalculado(true);
        const temPac = data.find(o => o.servico.toUpperCase().includes("PAC"));
        const temSedex = data.find(o => o.servico.toUpperCase().includes("SEDEX"));
        const temRetirada = data.find(o => o.servico.toUpperCase().includes("RETIRADA"));
        if (temPac) setTipoEnvio("PAC");
        else if (temSedex) setTipoEnvio("SEDEX");
        else if (temRetirada) setTipoEnvio("RETIRADA");
        else setTipoEnvio("PAC");
      }
    } catch (err: any) {
      setErroFrete(err?.message || "Erro ao calcular frete. Tente novamente.");
    } finally {
      setCarregandoFrete(false);
    }
  };

  const subtotal = carrinho.reduce((acc, i) => acc + Number(i.preco) * i.quantidade, 0);
  const labelTipoEnvio =
    tipoEnvio.toUpperCase().includes("RETIRADA")
      ? "RETIRADA NA LOJA"
      : tipoEnvio.toUpperCase().includes("SEDEX")
      ? "SEDEX"
      : "PAC";

  const getFreteValor = () => {
    if (!freteCalculado || opcoesFrete.length === 0) return null;
    const opcao = opcoesFrete.find(o => o.servico.toUpperCase().includes(tipoEnvio.toUpperCase())) || opcoesFrete[0];
    return opcao.preco;
  };

  const freteAtual = getFreteValor();
  const elegivelFreteGratis = subtotal >= FRETE_GRATIS_MINIMO;
  const faltaParaFreteGratis = Math.max(0, FRETE_GRATIS_MINIMO - subtotal);
  const progressoFreteGratis = Math.min(100, (subtotal / FRETE_GRATIS_MINIMO) * 100);
  const freteComDesconto = freteAtual !== null && elegivelFreteGratis && !labelTipoEnvio.includes("RETIRADA") ? 0 : freteAtual;
  const total = subtotal + (freteComDesconto ?? 0);
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
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl bg-gradient-to-br from-[var(--accent-light)]/30 to-[var(--warm-100)] flex items-center justify-center overflow-hidden mx-auto sm:mx-0">
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
                            <button
                              onClick={() => alterarQuantidade(item.id, -1)}
                              className={`w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold hover:bg-[var(--accent-light)] transition-all duration-150 ${
                                animacaoQtdBotao?.id === item.id && animacaoQtdBotao?.delta < 0 ? "scale-110" : "scale-100"
                              }`}
                            >
                              −
                            </button>
                            <span
                              className={`w-12 text-center font-bold text-sm transition-all duration-150 ease-out ${
                                animacaoQtdItemId === item.id ? "opacity-70 -translate-y-[1px]" : "opacity-100 translate-y-0"
                              }`}
                            >
                              {item.quantidade}
                            </span>
                            <button
                              onClick={() => alterarQuantidade(item.id, 1)}
                              className={`w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-bold hover:bg-[var(--accent-light)] transition-all duration-150 ${
                                animacaoQtdBotao?.id === item.id && animacaoQtdBotao?.delta > 0 ? "scale-110" : "scale-100"
                              }`}
                            >
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

            <div className="lg:sticky lg:top-36">
              <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.08)] border border-[var(--border)] p-6 sm:p-8">
                <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--warm-50)] p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {elegivelFreteGratis
                      ? "Parabéns! Você ganhou frete grátis."
                      : `Faltam R$ ${faltaParaFreteGratis.toFixed(2).replace(".", ",")} para ganhar frete grátis`}
                  </p>
                  <div className="mt-3 h-2.5 rounded-full bg-[var(--accent-light)]/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
                      style={{ width: `${progressoFreteGratis}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--muted)] mt-2">Meta para frete grátis: R$ {FRETE_GRATIS_MINIMO.toFixed(2).replace(".", ",")}</p>
                </div>

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
                      {carregandoFrete ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : "OK"}
                    </button>
                  </div>
                  {erroFrete && <p className="text-red-500 text-sm mt-2 font-medium">{erroFrete}</p>}

                  {/* Opções PAC / SEDEX */}
                  {freteCalculado && opcoesFrete.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {opcoesFrete.map((opcao) => {
                        const isSedex = opcao.servico.toUpperCase().includes("SEDEX");
                        const isRetirada = opcao.servico.toUpperCase().includes("RETIRADA");
                        const chaveServico = isSedex ? "SEDEX" : isRetirada ? "RETIRADA" : "PAC";
                        const selecionado = tipoEnvio.toUpperCase().includes(chaveServico);

                        return (
                          <button
                            key={opcao.servico}
                            onClick={() => setTipoEnvio(chaveServico)}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                              selecionado
                                ? "border-[var(--accent)] bg-[var(--accent-light)]"
                                : "border-[var(--border)] hover:border-[var(--accent)]/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  selecionado ? "border-[var(--accent)]" : "border-[var(--muted-light)]"
                                }`}>
                                  {selecionado && <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />}
                                </div>
                                <div>
                                  <span className="font-bold text-sm text-[var(--foreground)]">
                                    {isRetirada ? "RETIRADA NA LOJA" : isSedex ? "SEDEX" : "PAC"}
                                  </span>
                                  {opcao.prazo > 0 && (
                                    <span className="text-xs text-[var(--muted)] ml-2">
                                      {opcao.prazo} {opcao.prazo === 1 ? "dia útil" : "dias úteis"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-sm text-[var(--foreground)]">
                                  {isRetirada ? "Grátis" : `R$ ${opcao.preco.toFixed(2).replace(".", ",")}`}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Valores */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-[var(--muted)]">
                    <span>Subtotal ({totalItens} {totalItens === 1 ? "item" : "itens"})</span>
                    <span className="font-semibold text-[var(--foreground)]">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                  </div>
                  {freteAtual !== null && (
                    <div className="flex justify-between text-[var(--muted)]">
                      <span>Frete ({labelTipoEnvio})</span>
                      <span className="font-semibold text-[var(--foreground)]">
                        {freteComDesconto === 0 ? (
                          <>
                            {freteAtual > 0 && <span className="text-[var(--muted)] line-through mr-2">R$ {freteAtual.toFixed(2).replace(".", ",")}</span>}
                            Grátis
                          </>
                        ) : (
                          `R$ ${freteComDesconto?.toFixed(2).replace(".", ",")}`
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 px-3 rounded-2xl border-2 border-[var(--accent-light)] bg-[var(--accent-light)]/20 mb-6">
                  <span className="text-lg font-bold text-[var(--foreground)]">Total</span>
                  <span className="text-3xl sm:text-4xl font-black text-[var(--accent)]" style={{ fontFamily: "var(--font-logo)" }}>
                    R$ {total.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-5 rounded-2xl bg-[var(--accent)] text-white font-bold text-lg hover:bg-[var(--accent-hover)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_8px_20px_rgba(44,90,74,0.25)] hover:shadow-[0_12px_26px_rgba(44,90,74,0.28)]"
                >
                  Finalizar Compra
                </button>
                <p className="text-xs text-[var(--muted)] text-center mt-2">Seu carrinho está reservado por alguns minutos.</p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { icon: "🚚", texto: "Envio rápido" },
                    { icon: "🔒", texto: "Compra segura" },
                    { icon: "↩️", texto: "Troca facilitada" },
                  ].map((item) => (
                    <div key={item.texto} className="rounded-xl border border-[var(--border)] bg-[var(--warm-50)] px-3 py-2 text-xs font-medium text-[var(--foreground)] text-center">
                      <span className="mr-1">{item.icon}</span>
                      {item.texto}
                    </div>
                  ))}
                </div>

                <Link href="/produtos" className="block text-center text-[var(--muted)] font-medium mt-4 hover:text-[var(--accent)] transition-colors">
                  ← Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
