"use client";

import { useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface Pedido {
  id: number;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  total: number;
  status: string;
  criado_em: string;
  endereco_cep?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  frete?: number;
  forma_pagamento?: string;
  codigo_rastreio?: string;
}

interface ItemPedido {
  id: number;
  produto_id: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
}

interface DetalhesPedido {
  pedido: Pedido;
  itens: ItemPedido[];
}

export default function MeusPedidos() {
  const [busca, setBusca] = useState("");
  const [tipoBusca, setTipoBusca] = useState<"email" | "cpf">("email");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<DetalhesPedido | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const formatarCPF = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return numeros.slice(0, 11);
  };

  const buscarPedidos = async () => {
    if (!busca.trim()) {
      alert("Por favor, digite seu email ou CPF");
      return;
    }
    if (!API_URL) {
      alert("Aguarde, carregando configurações...");
      return;
    }
    setCarregando(true);
    setBuscaRealizada(false);
    setPedidos([]);
    try {
      const valor = tipoBusca === "cpf" ? busca.replace(/\D/g, "") : busca;
      const parametro = tipoBusca === "cpf" ? "cpf" : "email";
      const url = `${API_URL}/api/buscar-pedido-simples?${parametro}=${encodeURIComponent(valor)}`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ao buscar pedidos (${response.status})`);
      }
      const data = await response.json();
      setPedidos(data || []);
      setBuscaRealizada(true);
    } catch (error: any) {
      alert(`Erro ao buscar pedidos: ${error.message}`);
      setPedidos([]);
      setBuscaRealizada(true);
    } finally {
      setCarregando(false);
    }
  };

  const carregarDetalhesPedido = async (id: number) => {
    if (!API_URL) {
      alert("Erro: API URL não configurada. Aguarde um momento e tente novamente.");
      return;
    }
    setCarregandoDetalhes(true);
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}/detalhes`);
      if (!response.ok) throw new Error(`Erro ${response.status}`);
      const data = await response.json();
      setPedidoSelecionado(data);
    } catch (error: any) {
      alert("Erro ao carregar detalhes do pedido: " + error.message);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aguardando_pagamento":
        return { label: "⏳ Aguardando Pagamento", color: "var(--warning)", bg: "var(--warning-bg)" };
      case "pago":
      case "aprovado":
        return { label: "✓ Pago", color: "var(--success)", bg: "var(--success-bg)" };
      case "enviado":
        return { label: "📦 Enviado", color: "var(--accent)", bg: "var(--accent-light)" };
      case "entregue":
        return { label: "✓ Entregue", color: "var(--success)", bg: "var(--success-bg)" };
      case "cancelado":
        return { label: "✗ Cancelado", color: "var(--error)", bg: "var(--error-bg)" };
      default:
        return { label: status, color: "var(--muted)", bg: "var(--warm-200)" };
    }
  };

  const formatarData = (data: string | null | undefined) => {
    if (!data) return "Data não disponível";
    try {
      const dataObj = new Date(data);
      if (isNaN(dataObj.getTime())) return "Data inválida";
      return dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Data inválida";
    }
  };

  const getFormaPagamentoLabel = (forma?: string) => {
    switch (forma) {
      case "pix": return "💳 PIX";
      case "cartao": return "💳 Cartão de Crédito";
      case "boleto": return "📄 Boleto";
      default: return "💳 Não informado";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium">Meus Pedidos</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] overflow-hidden">
          <div className="px-6 sm:px-10 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-logo)" }}>
              📦 Meus Pedidos
            </h1>
            <p className="text-[var(--muted)] text-base mb-8">
              Acompanhe o status dos seus pedidos. Digite seu email ou CPF para buscar.
            </p>

            {/* Barra de Pesquisa */}
            <div className="mb-10">
              <div className="flex gap-3 mb-6 justify-center flex-wrap">
                <button
                  onClick={() => { setTipoBusca("email"); setBusca(""); }}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    tipoBusca === "email"
                      ? "bg-[var(--accent)] text-white border-2 border-[var(--accent)]"
                      : "bg-white text-[var(--foreground)] border-2 border-[var(--border-strong)] hover:border-[var(--accent)]"
                  }`}
                >
                  📧 Buscar por Email
                </button>
                <button
                  onClick={() => { setTipoBusca("cpf"); setBusca(""); }}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm transition-all ${
                    tipoBusca === "cpf"
                      ? "bg-[var(--accent)] text-white border-2 border-[var(--accent)]"
                      : "bg-white text-[var(--foreground)] border-2 border-[var(--border-strong)] hover:border-[var(--accent)]"
                  }`}
                >
                  🆔 Buscar por CPF
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                <input
                  type={tipoBusca === "email" ? "email" : "text"}
                  value={busca}
                  onChange={(e) => setBusca(tipoBusca === "cpf" ? formatarCPF(e.target.value) : e.target.value)}
                  placeholder={tipoBusca === "email" ? "Digite seu email" : "Digite seu CPF"}
                  className="flex-1 min-w-[200px] px-5 py-4 border-2 border-[var(--border)] rounded-xl text-[var(--foreground)] placeholder:text-[var(--muted-light)] focus:border-[var(--accent)] focus:outline-none transition-colors"
                />
                <button
                  onClick={buscarPedidos}
                  disabled={carregando}
                  className="btn-primary shrink-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:transform-none"
                >
                  {carregando ? "Buscando..." : "🔍 Buscar Pedidos"}
                </button>
              </div>
            </div>

            {/* Resultados */}
            {buscaRealizada && (
              <div>
                {pedidos.length === 0 ? (
                  <div className="store-card p-12 sm:p-16 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-[var(--muted)]">
                      Verifique se o {tipoBusca === "email" ? "email" : "CPF"} está correto
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {pedidos.map((pedido) => {
                      const statusInfo = getStatusInfo(pedido.status);
                      return (
                        <button
                          key={pedido.id}
                          type="button"
                          onClick={() => carregarDetalhesPedido(pedido.id)}
                          disabled={carregandoDetalhes}
                          className="store-card p-5 sm:p-6 text-left w-full cursor-pointer hover:border-[var(--accent)] transition-all disabled:opacity-70"
                        >
                          <div className="flex flex-wrap justify-between items-start gap-4">
                            <div className="flex-1 min-w-[180px]">
                              <span className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wide block mb-2">
                                Pedido #{pedido.id}
                              </span>
                              <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">
                                {pedido.cliente_nome}
                              </h3>
                              <p className="text-sm text-[var(--muted)]">📅 {formatarData(pedido.criado_em)}</p>
                              <p className="text-sm text-[var(--muted)]">{getFormaPagamentoLabel(pedido.forma_pagamento)}</p>
                            </div>
                            <div className="text-right">
                              <span
                                className="inline-block px-4 py-2 rounded-lg text-xs font-bold mb-2"
                                style={{ background: statusInfo.bg, color: statusInfo.color }}
                              >
                                {statusInfo.label}
                              </span>
                              <div className="text-2xl font-extrabold text-[var(--foreground)]">
                                R$ {Number(pedido.total).toFixed(2).replace(".", ",")}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Detalhes */}
      {pedidoSelecionado && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-4"
          onClick={() => setPedidoSelecionado(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[var(--shadow-xl)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]" style={{ fontFamily: "var(--font-logo)" }}>
                Detalhes do Pedido #{pedidoSelecionado.pedido.id}
              </h2>
              <button
                onClick={() => setPedidoSelecionado(null)}
                className="w-10 h-10 rounded-xl bg-[var(--warm-200)] hover:bg-[var(--warm-200)]/80 flex items-center justify-center text-[var(--foreground)] font-bold"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl p-5 mb-6 bg-[var(--warm-100)] border border-[var(--border)]">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-[var(--muted)] font-semibold uppercase">STATUS</span>
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: getStatusInfo(pedidoSelecionado.pedido.status).bg, color: getStatusInfo(pedidoSelecionado.pedido.status).color }}
                >
                  {getStatusInfo(pedidoSelecionado.pedido.status).label}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)]">
                📅 Pedido realizado em {formatarData(pedidoSelecionado.pedido.criado_em)}
              </p>
              {pedidoSelecionado.pedido.codigo_rastreio && (
                <p className="text-sm text-[var(--muted)] mt-2">
                  📦 Código de rastreio: <strong className="text-[var(--foreground)]">{pedidoSelecionado.pedido.codigo_rastreio}</strong>
                </p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">👤 Informações do Cliente</h3>
              <div className="text-sm text-[var(--muted)] space-y-1 leading-relaxed">
                <p><strong className="text-[var(--foreground)]">Nome:</strong> {pedidoSelecionado.pedido.cliente_nome}</p>
                <p><strong className="text-[var(--foreground)]">Email:</strong> {pedidoSelecionado.pedido.cliente_email}</p>
                <p><strong className="text-[var(--foreground)]">Telefone:</strong> {pedidoSelecionado.pedido.cliente_telefone}</p>
              </div>
            </div>

            {pedidoSelecionado.pedido.endereco_rua && (
              <div className="mb-6">
                <h3 className="font-bold text-[var(--foreground)] mb-3 flex items-center gap-2">📍 Endereço de Entrega</h3>
                <div className="text-sm text-[var(--muted)] space-y-1 leading-relaxed">
                  <p>{pedidoSelecionado.pedido.endereco_rua}, {pedidoSelecionado.pedido.endereco_numero}</p>
                  {pedidoSelecionado.pedido.endereco_complemento && <p>{pedidoSelecionado.pedido.endereco_complemento}</p>}
                  <p>{pedidoSelecionado.pedido.endereco_bairro}</p>
                  <p>{pedidoSelecionado.pedido.endereco_cidade} - {pedidoSelecionado.pedido.endereco_estado}</p>
                  <p>CEP: {pedidoSelecionado.pedido.endereco_cep}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">🛒 Itens do Pedido</h3>
              <div className="space-y-3">
                {pedidoSelecionado.itens.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-[var(--warm-100)] border border-[var(--border)]"
                  >
                    <div>
                      <div className="font-semibold text-[var(--foreground)] text-sm">{item.nome}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {item.quantidade} × R$ {Number(item.preco_unitario).toFixed(2).replace(".", ",")}
                      </div>
                    </div>
                    <div className="font-bold text-[var(--foreground)]">
                      R$ {(item.quantidade * Number(item.preco_unitario)).toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[var(--border)] pt-5">
              {pedidoSelecionado.pedido.frete ? (
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-[var(--muted)]">Frete:</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    R$ {Number(pedidoSelecionado.pedido.frete).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center">
                <span className="font-bold text-[var(--foreground)]">Total:</span>
                <span className="text-2xl font-extrabold text-[var(--foreground)]">
                  R$ {Number(pedidoSelecionado.pedido.total).toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p className="text-sm text-[var(--muted)] mt-2">
                {getFormaPagamentoLabel(pedidoSelecionado.pedido.forma_pagamento)}
              </p>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
