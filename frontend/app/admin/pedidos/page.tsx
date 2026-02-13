"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import { ProtegerRota, usePodeExecutar } from "@/lib/ProtegerRota";

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
  subtotal: number;
}

interface DetalhesPedido {
  pedido: Pedido;
  itens: ItemPedido[];
}

export default function AdminPedidos() {
  return (
    <ProtegerRota permissoesRequeridas={['pode_visualizar_pedidos']}>
      <PedidosConteudo />
    </ProtegerRota>
  );
}

function PedidosConteudo() {
  const router = useRouter();
  const podeAlterar = usePodeExecutar('pode_alterar_status_pedidos');
  const podeCancelar = usePodeExecutar('pode_cancelar_pedidos');
  const podeAdicionarRastreio = usePodeExecutar('pode_adicionar_rastreio');
  
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [pedidoSelecionado, setPedidoSelecionado] = useState<DetalhesPedido | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;
  const [editandoStatus, setEditandoStatus] = useState(false);
  const [novoStatus, setNovoStatus] = useState("");
  const [codigoRastreio, setCodigoRastreio] = useState("");
  const [salvandoStatus, setSalvandoStatus] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/admin/login");
        return;
      }
      
      const response = await fetch(`${API_URL}/admin/pedidos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("token");
        router.push("/admin/login");
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Garantir que data é um array
      if (Array.isArray(data)) {
        setPedidos(data);
      } else {
        console.error("Resposta não é um array:", data);
        setPedidos([]);
      }
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      setPedidos([]);
    } finally {
      setCarregando(false);
    }
  };

  const carregarDetalhesPedido = async (id: number) => {
    setCarregandoDetalhes(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPedidoSelecionado(data);
      setNovoStatus(data.pedido.status);
      setCodigoRastreio(data.pedido.codigo_rastreio || "");
      setEditandoStatus(false);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchNome = pedido.cliente_nome?.toLowerCase().includes(filtro.toLowerCase()) || false;
    const matchEmail = pedido.cliente_email?.toLowerCase().includes(filtro.toLowerCase()) || false;
    const matchStatus = statusFiltro === "todos" || pedido.status === statusFiltro;
    
    return (matchNome || matchEmail) && matchStatus;
  });

  // Cálculo da paginação
  const totalPaginas = Math.ceil(pedidosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const indiceFinal = indiceInicial + itensPorPagina;
  const pedidosPaginados = pedidosFiltrados.slice(indiceInicial, indiceFinal);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro, statusFiltro]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
      case "aprovado":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", label: "✓ Pago" };
      case "enviado":
        return { bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", label: "📦 Enviado" };
      case "entregue":
        return { bg: "rgba(34, 197, 94, 0.1)", color: "#22c55e", label: "✓ Entregue" };
      case "pendente":
      case "aguardando_pagamento":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", label: "⏳ Pendente" };
      case "cancelado":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", label: "✗ Cancelado" };
      default:
        return { bg: "rgba(156, 163, 175, 0.1)", color: "#9ca3af", label: status };
    }
  };

  const formatarData = (data: string) => {
    if (!data) return "Data não disponível";
    try {
      return new Date(data).toLocaleDateString("pt-BR", {
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

  const getFormaPagamentoLabel = (forma: string) => {
    switch (forma) {
      case "pix": return "💰 PIX";
      case "cartao": return "💳 Cartão de Crédito";
      case "boleto": return "📄 Boleto Bancário";
      default: return forma || "Não informado";
    }
  };

  const atualizarStatusPedido = async () => {
    if (!pedidoSelecionado) return;
    
    setSalvandoStatus(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/pedidos/${pedidoSelecionado.pedido.id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: novoStatus,
          codigo_rastreio: codigoRastreio
        })
      });

      if (response.ok) {
        // Atualizar pedido na lista
        setPedidos(prev => prev.map(p => 
          p.id === pedidoSelecionado.pedido.id 
            ? { ...p, status: novoStatus } 
            : p
        ));
        
        // Atualizar pedido selecionado
        setPedidoSelecionado({
          ...pedidoSelecionado,
          pedido: {
            ...pedidoSelecionado.pedido,
            status: novoStatus,
            codigo_rastreio: codigoRastreio
          }
        });
        
        setEditandoStatus(false);
        
        // Notificação de sucesso
        const notification = document.createElement("div");
        notification.innerHTML = "✓ Status atualizado com sucesso!";
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 10000;
          animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
      } else {
        throw new Error("Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    } finally {
      setSalvandoStatus(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <AdminHeader />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(16px, 4vw, 40px)"
      }}>
        {/* Título e Filtros */}
        <div style={{
          background: "white",
          borderRadius: "clamp(12px, 3vw, 20px)",
          padding: "clamp(16px, 4vw, 32px)",
          marginBottom: "clamp(16px, 4vw, 24px)",
          border: "1px solid rgba(0,0,0,0.08)"
        }}>
          <h2 style={{
            fontSize: "clamp(18px, 4.5vw, 28px)",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "clamp(16px, 4vw, 24px)",
            letterSpacing: "-0.8px"
          }}>
            Pedidos Realizados
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: "clamp(12px, 3vw, 16px)"
          }}>
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                padding: "clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 20px)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(12px, 2.5vw, 15px)",
                fontWeight: "500",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
            />

            {/* Filtro de Status */}
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              style={{
                padding: "clamp(10px, 2.5vw, 14px) clamp(12px, 3vw, 20px)",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(12px, 2.5vw, 15px)",
                fontWeight: "600",
                outline: "none",
                cursor: "pointer",
                background: "white"
              }}
            >
              <option value="todos">Todos os Status</option>
              <option value="aguardando_pagamento">Pendente</option>
              <option value="pago">Pago</option>
              <option value="enviado">Enviado</option>
              <option value="entregue">Entregue</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div style={{
            marginTop: "clamp(12px, 3vw, 16px)",
            fontSize: "clamp(11px, 2.2vw, 14px)",
            color: "#666"
          }}>
            <span style={{ fontWeight: "600" }}>{pedidosFiltrados.length}</span> pedido(s) encontrado(s)
            {totalPaginas > 1 && (
              <span style={{ marginLeft: "8px" }}>
                • Mostrando {indiceInicial + 1}-{Math.min(indiceFinal, pedidosFiltrados.length)} de {pedidosFiltrados.length}
              </span>
            )}
          </div>
        </div>

        {/* Lista de Pedidos - Cards Mobile-First */}
        {carregando ? (
          <div style={{
            background: "white",
            borderRadius: "clamp(12px, 3vw, 20px)",
            padding: "clamp(40px, 10vw, 80px)",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "clamp(32px, 8vw, 48px)", marginBottom: "16px" }}>⏳</div>
            <p style={{ color: "#666", fontSize: "clamp(12px, 2.5vw, 16px)" }}>Carregando pedidos...</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "clamp(12px, 3vw, 20px)",
            padding: "clamp(40px, 10vw, 80px)",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "clamp(48px, 12vw, 64px)", marginBottom: "16px" }}>📦</div>
            <h3 style={{
              fontSize: "clamp(16px, 4vw, 20px)",
              fontWeight: "700",
              color: "#0a0a0a",
              marginBottom: "8px"
            }}>
              Nenhum pedido encontrado
            </h3>
            <p style={{ color: "#666", fontSize: "clamp(12px, 2.5vw, 15px)" }}>
              {filtro || statusFiltro !== "todos" 
                ? "Tente ajustar os filtros de busca" 
                : "Ainda não há pedidos realizados"}
            </p>
          </div>
        ) : (
          <>
            {/* NO MOBILE: Cards empilhados verticalmente */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 3vw, 16px)"
            }}>
              {pedidosPaginados.map((pedido) => {
                const statusInfo = getStatusColor(pedido.status);
                return (
                  <div
                    key={pedido.id}
                    onClick={() => carregarDetalhesPedido(pedido.id)}
                    style={{
                      background: "white",
                      borderRadius: "clamp(8px, 2vw, 12px)",
                      padding: "clamp(12px, 3vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.08)",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#fafafa";
                      e.currentTarget.style.transform = "scale(1.01)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 2vw, 12px)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                        <div style={{ flex: "1", minWidth: "150px" }}>
                          <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginBottom: "4px" }}>
                            Pedido #{pedido.id}
                          </div>
                          <div style={{ fontSize: "clamp(13px, 2.8vw, 15px)", fontWeight: "600", color: "#0a0a0a", marginBottom: "4px" }}>
                            {pedido.cliente_nome}
                          </div>
                          <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666" }}>
                            {pedido.cliente_email}
                          </div>
                          <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginTop: "2px" }}>
                            {pedido.cliente_telefone}
                          </div>
                        </div>
                        
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: "800", color: "#10b981", marginBottom: "8px" }}>
                            R$ {Number(pedido.total).toFixed(2)}
                          </div>
                          <span style={{
                            padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
                            background: statusInfo.bg,
                            color: statusInfo.color,
                            borderRadius: "clamp(6px, 1.5vw, 8px)",
                            fontSize: "clamp(10px, 2vw, 11px)",
                            fontWeight: "700",
                            display: "inline-block",
                            whiteSpace: "nowrap"
                          }}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: "clamp(10px, 2vw, 12px)", color: "#999", paddingTop: "8px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        {formatarData(pedido.criado_em)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Resumo */}
        {pedidosFiltrados.length > 0 && (
          <div style={{
            marginTop: "clamp(16px, 4vw, 24px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: "clamp(12px, 3vw, 16px)"
          }}>
            <div style={{
              background: "white",
              borderRadius: "clamp(12px, 3vw, 16px)",
              padding: "clamp(16px, 4vw, 24px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Total de Pedidos
              </div>
              <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "900", color: "#0a0a0a", letterSpacing: "-1px" }}>
                {pedidosFiltrados.length}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "clamp(12px, 3vw, 16px)",
              padding: "clamp(16px, 4vw, 24px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Valor Total
              </div>
              <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "900", color: "#10b981", letterSpacing: "-1px" }}>
                R$ {pedidosFiltrados.reduce((acc, p) => acc + Number(p.total), 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div style={{
            marginTop: "clamp(16px, 4vw, 24px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "clamp(8px, 2vw, 12px)",
            flexWrap: "wrap"
          }}>
            {/* Botão Anterior */}
            <button
              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
              style={{
                padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)",
                background: paginaAtual === 1 ? "#e5e5e5" : "white",
                color: paginaAtual === 1 ? "#999" : "#0a0a0a",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(11px, 2.2vw, 13px)",
                fontWeight: "700",
                cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                if (paginaAtual > 1) {
                  e.currentTarget.style.background = "#fafafa";
                }
              }}
              onMouseOut={(e) => {
                if (paginaAtual > 1) {
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              ← Anterior
            </button>

            {/* Números de página */}
            <div style={{
              display: "flex",
              gap: "clamp(6px, 1.5vw, 8px)",
              alignItems: "center",
              flexWrap: "wrap"
            }}>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => {
                const mostrar = 
                  numPagina === 1 ||
                  numPagina === totalPaginas ||
                  Math.abs(numPagina - paginaAtual) <= 1;

                const mostrarReticencias = 
                  (numPagina === 2 && paginaAtual > 3) ||
                  (numPagina === totalPaginas - 1 && paginaAtual < totalPaginas - 2);

                if (mostrarReticencias) {
                  return (
                    <span key={numPagina} style={{ color: "#999", fontSize: "clamp(14px, 3vw, 18px)", fontWeight: "700" }}>
                      ...
                    </span>
                  );
                }

                if (!mostrar) return null;

                return (
                  <button
                    key={numPagina}
                    onClick={() => setPaginaAtual(numPagina)}
                    style={{
                      padding: "clamp(8px, 2vw, 12px) clamp(10px, 2.5vw, 14px)",
                      background: paginaAtual === numPagina 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "white",
                      color: paginaAtual === numPagina ? "white" : "#0a0a0a",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "clamp(8px, 2vw, 12px)",
                      fontSize: "clamp(11px, 2.2vw, 13px)",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "clamp(36px, 9vw, 48px)"
                    }}
                    onMouseOver={(e) => {
                      if (paginaAtual !== numPagina) {
                        e.currentTarget.style.background = "#fafafa";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (paginaAtual !== numPagina) {
                        e.currentTarget.style.background = "white";
                      }
                    }}
                  >
                    {numPagina}
                  </button>
                );
              })}
            </div>

            {/* Botão Próximo */}
            <button
              onClick={() => setPaginaAtual(Math.min(totalPaginas, paginaAtual + 1))}
              disabled={paginaAtual === totalPaginas}
              style={{
                padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)",
                background: paginaAtual === totalPaginas ? "#e5e5e5" : "white",
                color: paginaAtual === totalPaginas ? "#999" : "#0a0a0a",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(11px, 2.2vw, 13px)",
                fontWeight: "700",
                cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => {
                if (paginaAtual < totalPaginas) {
                  e.currentTarget.style.background = "#fafafa";
                }
              }}
              onMouseOut={(e) => {
                if (paginaAtual < totalPaginas) {
                  e.currentTarget.style.background = "white";
                }
              }}
            >
              Próximo →
            </button>

            {/* Info de página */}
            <div style={{
              padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)",
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "clamp(8px, 2vw, 12px)",
              fontSize: "clamp(10px, 2vw, 12px)",
              color: "#666",
              fontWeight: "600"
            }}>
              Página {paginaAtual} de {totalPaginas}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE DETALHES */}
      {pedidoSelecionado && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            overflowY: "auto"
          }}
          onClick={() => setPedidoSelecionado(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {carregandoDetalhes ? (
              <div style={{ padding: "80px", textAlign: "center" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
                <p style={{ color: "#666" }}>Carregando detalhes...</p>
              </div>
            ) : (
              <>
                {/* Header do Modal */}
                <div style={{
                  padding: "32px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <h3 style={{
                      fontSize: "28px",
                      fontWeight: "800",
                      color: "#0a0a0a",
                      marginBottom: "8px",
                      letterSpacing: "-0.8px"
                    }}>
                      Pedido #{pedidoSelecionado.pedido.id}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#666" }}>
                      {formatarData(pedidoSelecionado.pedido.criado_em)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPedidoSelecionado(null)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                      color: "#999",
                      padding: "8px",
                      transition: "color 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
                    onMouseOut={(e) => e.currentTarget.style.color = "#999"}
                  >
                    ✕
                  </button>
                </div>

                {/* Conteúdo */}
                <div style={{ padding: "32px" }}>
                  {/* Status e Pagamento */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    marginBottom: "32px"
                  }}>
                    <div style={{
                      background: "#fafafa",
                      padding: "20px",
                      borderRadius: "12px"
                    }}>
                      <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                        Status do Pedido
                      </div>
                      {editandoStatus ? (
                        <div>
                          <select
                            value={novoStatus}
                            onChange={(e) => setNovoStatus(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "10px",
                              border: "1px solid #d1d5db",
                              borderRadius: "8px",
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#0a0a0a",
                              marginBottom: "12px"
                            }}
                          >
                            <option value="aguardando_pagamento">⏳ Pendente</option>
                            <option value="pago">✓ Pago</option>
                            <option value="enviado">📦 Enviado</option>
                            <option value="entregue">✓ Entregue</option>
                            <option value="cancelado">✗ Cancelado</option>
                          </select>
                          
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              onClick={atualizarStatusPedido}
                              disabled={salvandoStatus}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                                cursor: salvandoStatus ? "wait" : "pointer",
                                opacity: salvandoStatus ? 0.7 : 1
                              }}
                            >
                              {salvandoStatus ? "Salvando..." : "Salvar"}
                            </button>
                            <button
                              onClick={() => {
                                setEditandoStatus(false);
                                setNovoStatus(pedidoSelecionado.pedido.status);
                              }}
                              disabled={salvandoStatus}
                              style={{
                                flex: 1,
                                padding: "8px 12px",
                                background: "#e5e7eb",
                                color: "#374151",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "13px",
                                fontWeight: "700",
                                cursor: "pointer"
                              }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {(() => {
                            const statusInfo = getStatusColor(pedidoSelecionado.pedido.status);
                            return (
                              <span style={{
                                padding: "8px 16px",
                                background: statusInfo.bg,
                                color: statusInfo.color,
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "700",
                                display: "inline-block",
                                marginBottom: "12px"
                              }}>
                                {statusInfo.label}
                              </span>
                            );
                          })()}
                          <button
                            onClick={() => setEditandoStatus(true)}
                            style={{
                              display: "block",
                              width: "100%",
                              padding: "8px",
                              background: "#667eea",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: "700",
                              cursor: "pointer",
                              transition: "background 0.2s"
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = "#5568d3"}
                            onMouseOut={(e) => e.currentTarget.style.background = "#667eea"}
                          >
                            Alterar Status
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{
                      background: "#fafafa",
                      padding: "20px",
                      borderRadius: "12px"
                    }}>
                      <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                        Forma de Pagamento
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#0a0a0a" }}>
                        {getFormaPagamentoLabel(pedidoSelecionado.pedido.forma_pagamento || "")}
                      </div>
                    </div>
                  </div>

                  {/* Código de Rastreio */}
                  <div style={{
                    background: "#fafafa",
                    padding: "20px",
                    borderRadius: "12px",
                    marginBottom: "24px"
                  }}>
                    <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                      📦 Código de Rastreio
                    </div>
                    {editandoStatus ? (
                      <input
                        type="text"
                        value={codigoRastreio}
                        onChange={(e) => setCodigoRastreio(e.target.value)}
                        placeholder="Digite o código de rastreio..."
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#0a0a0a"
                        }}
                      />
                    ) : (
                      <div style={{ fontSize: "15px", fontWeight: "700", color: "#0a0a0a" }}>
                        {pedidoSelecionado.pedido.codigo_rastreio || "Não informado"}
                      </div>
                    )}
                  </div>

                  {/* Dados do Cliente */}
                  <div style={{
                    background: "#fafafa",
                    padding: "24px",
                    borderRadius: "16px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "16px"
                    }}>
                      👤 Dados do Cliente
                    </h4>
                    <div style={{ display: "grid", gap: "12px" }}>
                      <div>
                        <span style={{ fontSize: "13px", color: "#666" }}>Nome: </span>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#0a0a0a" }}>
                          {pedidoSelecionado.pedido.cliente_nome}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px", color: "#666" }}>Email: </span>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#0a0a0a" }}>
                          {pedidoSelecionado.pedido.cliente_email}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: "13px", color: "#666" }}>Telefone: </span>
                        <span style={{ fontSize: "15px", fontWeight: "600", color: "#0a0a0a" }}>
                          {pedidoSelecionado.pedido.cliente_telefone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Endereço de Entrega */}
                  {pedidoSelecionado.pedido.endereco_rua && (
                    <div style={{
                      background: "#fafafa",
                      padding: "24px",
                      borderRadius: "16px",
                      marginBottom: "24px"
                    }}>
                      <h4 style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#0a0a0a",
                        marginBottom: "16px"
                      }}>
                        📍 Endereço de Entrega
                      </h4>
                      <div style={{ fontSize: "15px", color: "#0a0a0a", lineHeight: "1.6" }}>
                        {pedidoSelecionado.pedido.endereco_rua}, {pedidoSelecionado.pedido.endereco_numero}
                        {pedidoSelecionado.pedido.endereco_complemento && 
                          ` - ${pedidoSelecionado.pedido.endereco_complemento}`}
                        <br />
                        {pedidoSelecionado.pedido.endereco_bairro} - {pedidoSelecionado.pedido.endereco_cidade}/{pedidoSelecionado.pedido.endereco_estado}
                        <br />
                        CEP: {pedidoSelecionado.pedido.endereco_cep}
                      </div>
                    </div>
                  )}

                  {/* Itens do Pedido */}
                  <div style={{
                    background: "#fafafa",
                    padding: "24px",
                    borderRadius: "16px",
                    marginBottom: "24px"
                  }}>
                    <h4 style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "16px"
                    }}>
                      🛒 Itens do Pedido
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {pedidoSelecionado.itens.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px",
                            background: "white",
                            borderRadius: "8px"
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "15px", fontWeight: "600", color: "#0a0a0a" }}>
                              {item.nome}
                            </div>
                            <div style={{ fontSize: "13px", color: "#666" }}>
                              Quantidade: {item.quantidade}
                            </div>
                          </div>
                          <div style={{ fontSize: "16px", fontWeight: "800", color: "#10b981" }}>
                            R$ {Number(item.preco_unitario * item.quantidade).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo de Valores */}
                  <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "24px",
                    borderRadius: "16px",
                    color: "white"
                  }}>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                      fontSize: "15px"
                    }}>
                      <span>Subtotal:</span>
                      <span style={{ fontWeight: "600" }}>
                        R$ {(Number(pedidoSelecionado.pedido.total) - Number(pedidoSelecionado.pedido.frete || 0)).toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid rgba(255,255,255,0.2)",
                      fontSize: "15px"
                    }}>
                      <span>Frete:</span>
                      <span style={{ fontWeight: "600" }}>
                        R$ {Number(pedidoSelecionado.pedido.frete || 0).toFixed(2)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "24px",
                      fontWeight: "900",
                      letterSpacing: "-0.8px"
                    }}>
                      <span>Total:</span>
                      <span>R$ {Number(pedidoSelecionado.pedido.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
