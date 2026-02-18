"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import LayoutInstitucional from "@/components/LayoutInstitucional";

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
      
      // NOVO ENDPOINT SIMPLES!
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
      console.error("❌ Erro completo:", error);
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
      const url = `${API_URL}/pedidos/${id}/detalhes`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setPedidoSelecionado(data);
    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      alert("Erro ao carregar detalhes do pedido: " + error.message);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aguardando_pagamento":
        return { label: "⏳ Aguardando Pagamento", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
      case "pago":
      case "aprovado":
        return { label: "✓ Pago", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
      case "enviado":
        return { label: "📦 Enviado", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" };
      case "entregue":
        return { label: "✓ Entregue", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" };
      case "cancelado":
        return { label: "✗ Cancelado", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
      default:
        return { label: status, color: "#9ca3af", bg: "rgba(156, 163, 175, 0.1)" };
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
        minute: "2-digit"
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
    <LayoutInstitucional titulo="📦 Meus Pedidos" breadcrumbLabel="Meus Pedidos">
      <p className="text-[var(--muted)] text-center mb-8">
        Acompanhe o status dos seus pedidos. Busque por email ou CPF.
      </p>

      {/* Barra de Pesquisa */}
      <div className="store-card p-6 sm:p-8 mb-8">
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <button
            type="button"
            onClick={() => { setTipoBusca("email"); setBusca(""); }}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all min-h-[48px] border-2 ${
              tipoBusca === "email"
                ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                : "bg-white border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--accent-light)]"
            }`}
          >
            📧 Buscar por Email
          </button>
          <button
            type="button"
            onClick={() => { setTipoBusca("cpf"); setBusca(""); }}
            className={`px-8 py-3.5 rounded-xl font-bold text-sm transition-all min-h-[48px] border-2 ${
              tipoBusca === "cpf"
                ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                : "bg-white border-[var(--foreground)] text-[var(--foreground)] hover:bg-[var(--accent-light)]"
            }`}
          >
            🆔 Buscar por CPF
          </button>
        </div>

        <div className="flex gap-3 flex-wrap">
          <input
            type={tipoBusca === "email" ? "email" : "text"}
            value={busca}
            onChange={(e) => {
              const valor = e.target.value;
              setBusca(tipoBusca === "cpf" ? formatarCPF(valor) : valor);
            }}
            placeholder={tipoBusca === "email" ? "Digite seu email" : "Digite seu CPF"}
            className="flex-1 min-w-[280px] px-6 py-4 border-2 border-[var(--border)] rounded-xl text-base font-medium text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
          <button
            type="button"
            onClick={buscarPedidos}
            disabled={carregando}
            className="px-10 py-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--muted-light)] text-white font-bold rounded-xl transition-colors min-h-[56px] whitespace-nowrap disabled:cursor-not-allowed"
          >
            {carregando ? "Buscando..." : "🔍 Buscar Pedidos"}
          </button>
        </div>
      </div>

      {/* Resultados */}
      {buscaRealizada && (
        <div>
          {pedidos.length === 0 ? (
            <div className="store-card p-16 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-[var(--muted)] text-sm">
                Verifique se o {tipoBusca === "email" ? "email" : "CPF"} está correto
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {pedidos.map((pedido) => {
                const statusInfo = getStatusInfo(pedido.status);
                return (
                  <div
                    key={pedido.id}
                    className="store-card p-6 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg border-2 border-transparent hover:border-[var(--accent)]"
                    onClick={() => carregarDetalhesPedido(pedido.id)}
                  >
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <span className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wide block mb-3">
                          Pedido #{pedido.id}
                        </span>
                        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
                          {pedido.cliente_nome}
                        </h3>
                        <p className="text-sm text-[var(--muted)] mb-1">
                          📅 {formatarData(pedido.criado_em)}
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                          {getFormaPagamentoLabel(pedido.forma_pagamento)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block px-4 py-2 rounded-lg text-xs font-bold mb-3"
                          style={{ background: statusInfo.bg, color: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                        <div className="text-2xl font-extrabold text-[var(--foreground)]">
                          R$ {Number(pedido.total).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalhes */}
      {pedidoSelecionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5 backdrop-blur-sm"
          onClick={() => setPedidoSelecionado(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[700px] w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
                Detalhes do Pedido #{pedidoSelecionado.pedido.id}
              </h2>
              <button
                type="button"
                onClick={() => setPedidoSelecionado(null)}
                className="w-9 h-9 rounded-lg bg-[var(--warm-200)] border-none cursor-pointer flex items-center justify-center text-lg hover:bg-[var(--muted-light)] transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-[var(--warm-100)] rounded-xl p-5 mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-[var(--muted)] font-semibold">STATUS</span>
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: getStatusInfo(pedidoSelecionado.pedido.status).bg, color: getStatusInfo(pedidoSelecionado.pedido.status).color }}
                >
                  {getStatusInfo(pedidoSelecionado.pedido.status).label}
                </span>
              </div>
              <div className="text-sm text-[var(--muted)]">
                📅 Pedido realizado em {formatarData(pedidoSelecionado.pedido.criado_em)}
              </div>
              {pedidoSelecionado.pedido.codigo_rastreio && (
                <div className="text-sm text-[var(--muted)] mt-2">
                  📦 Código de rastreio: <strong>{pedidoSelecionado.pedido.codigo_rastreio}</strong>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-base font-bold text-[var(--foreground)] mb-3">👤 Informações do Cliente</h3>
              <div className="text-sm text-[var(--muted)] leading-relaxed">
                <p><strong>Nome:</strong> {pedidoSelecionado.pedido.cliente_nome}</p>
                <p><strong>Email:</strong> {pedidoSelecionado.pedido.cliente_email}</p>
                <p><strong>Telefone:</strong> {pedidoSelecionado.pedido.cliente_telefone}</p>
              </div>
            </div>

            {pedidoSelecionado.pedido.endereco_rua && (
              <div className="mb-6">
                <h3 className="text-base font-bold text-[var(--foreground)] mb-3">📍 Endereço de Entrega</h3>
                <div className="text-sm text-[var(--muted)] leading-relaxed">
                  <p>{pedidoSelecionado.pedido.endereco_rua}, {pedidoSelecionado.pedido.endereco_numero}</p>
                  {pedidoSelecionado.pedido.endereco_complemento && <p>{pedidoSelecionado.pedido.endereco_complemento}</p>}
                  <p>{pedidoSelecionado.pedido.endereco_bairro}</p>
                  <p>{pedidoSelecionado.pedido.endereco_cidade} - {pedidoSelecionado.pedido.endereco_estado}</p>
                  <p>CEP: {pedidoSelecionado.pedido.endereco_cep}</p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-base font-bold text-[var(--foreground)] mb-4">🛒 Itens do Pedido</h3>
              <div className="flex flex-col gap-3">
                {pedidoSelecionado.itens.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-[var(--warm-100)] rounded-lg">
                    <div>
                      <div className="text-sm font-semibold text-[var(--foreground)] mb-1">{item.nome}</div>
                      <div className="text-xs text-[var(--muted)]">
                        Quantidade: {item.quantidade} × R$ {Number(item.preco_unitario).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-base font-bold text-[var(--foreground)]">
                      R$ {(item.quantidade * Number(item.preco_unitario)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t-2 border-[var(--border)] pt-5">
              {(pedidoSelecionado.pedido.frete ?? 0) > 0 ? (
                <div className="flex justify-between mb-3">
                  <span className="text-sm text-[var(--muted)]">Frete:</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    R$ {Number(pedidoSelecionado.pedido.frete).toFixed(2)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[var(--foreground)]">Total:</span>
                <span className="text-2xl font-extrabold text-[var(--foreground)]">
                  R$ {Number(pedidoSelecionado.pedido.total).toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-[var(--muted)] mt-2">
                {getFormaPagamentoLabel(pedidoSelecionado.pedido.forma_pagamento)}
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutInstitucional>
  );
}
