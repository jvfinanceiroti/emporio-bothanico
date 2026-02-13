"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";

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
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [pedidoSelecionado, setPedidoSelecionado] = useState<DetalhesPedido | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 20;

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
      
      const response = await fetch("http://localhost:3001/admin/pedidos", {
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
      const response = await fetch(`http://localhost:3001/admin/pedidos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPedidoSelecionado(data);
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <AdminHeader />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px"
      }}>
        {/* Título e Filtros */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "24px",
          border: "1px solid rgba(0,0,0,0.08)"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "24px",
            letterSpacing: "-0.8px"
          }}>
            Pedidos Realizados
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "16px"
          }}>
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar por nome ou email do cliente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                padding: "14px 20px",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                fontSize: "15px",
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
                padding: "14px 20px",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "600",
                outline: "none",
                cursor: "pointer",
                minWidth: "180px",
                background: "white"
              }}
            >
              <option value="todos">Todos os Status</option>
              <option value="aguardando_pagamento">Pendente</option>
              <option value="pago">Pago</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div style={{
            marginTop: "16px",
            fontSize: "14px",
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

        {/* Tabela */}
        {carregando ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "80px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
            <p style={{ color: "#666", fontSize: "16px" }}>Carregando pedidos...</p>
          </div>
        ) : pedidosFiltrados.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "80px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#0a0a0a",
              marginBottom: "8px"
            }}>
              Nenhum pedido encontrado
            </h3>
            <p style={{ color: "#666", fontSize: "15px" }}>
              {filtro || statusFiltro !== "todos" 
                ? "Tente ajustar os filtros de busca" 
                : "Ainda não há pedidos realizados"}
            </p>
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "20px",
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse"
              }}>
                <thead>
                  <tr style={{
                    background: "#fafafa",
                    borderBottom: "2px solid rgba(0,0,0,0.06)"
                  }}>
                    <th style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      ID
                    </th>
                    <th style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Cliente
                    </th>
                    <th style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Contato
                    </th>
                    <th style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Valor
                    </th>
                    <th style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Status
                    </th>
                    <th style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosPaginados.map((pedido, index) => {
                    const statusInfo = getStatusColor(pedido.status);
                    return (
                      <tr
                        key={pedido.id}
                        onClick={() => carregarDetalhesPedido(pedido.id)}
                        style={{
                          borderBottom: index < pedidosPaginados.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                          transition: "all 0.2s",
                          cursor: "pointer"
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
                        <td style={{
                          padding: "24px",
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#0a0a0a"
                        }}>
                          #{pedido.id}
                        </td>
                        <td style={{
                          padding: "24px",
                          fontSize: "15px",
                          fontWeight: "600",
                          color: "#0a0a0a"
                        }}>
                          {pedido.cliente_nome}
                        </td>
                        <td style={{
                          padding: "24px",
                          fontSize: "14px",
                          color: "#666"
                        }}>
                          <div>{pedido.cliente_email}</div>
                          <div style={{ marginTop: "4px", fontSize: "13px" }}>
                            {pedido.cliente_telefone}
                          </div>
                        </td>
                        <td style={{
                          padding: "24px",
                          fontSize: "18px",
                          fontWeight: "800",
                          color: "#10b981",
                          letterSpacing: "-0.5px"
                        }}>
                          R$ {Number(pedido.total).toFixed(2)}
                        </td>
                        <td style={{ padding: "24px" }}>
                          <span style={{
                            padding: "8px 16px",
                            background: statusInfo.bg,
                            color: statusInfo.color,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            display: "inline-block"
                          }}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td style={{
                          padding: "24px",
                          fontSize: "14px",
                          color: "#666",
                          whiteSpace: "nowrap"
                        }}>
                          {formatarData(pedido.criado_em)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resumo */}
        {pedidosFiltrados.length > 0 && (
          <div style={{
            marginTop: "24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Total de Pedidos
              </div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#0a0a0a", letterSpacing: "-1px" }}>
                {pedidosFiltrados.length}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Valor Total
              </div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#10b981", letterSpacing: "-1px" }}>
                R$ {pedidosFiltrados.reduce((acc, p) => acc + Number(p.total), 0).toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px"
          }}>
            {/* Botão Anterior */}
            <button
              onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
              disabled={paginaAtual === 1}
              style={{
                padding: "12px 24px",
                background: paginaAtual === 1 ? "#e5e5e5" : "white",
                color: paginaAtual === 1 ? "#999" : "#0a0a0a",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                fontSize: "15px",
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
              gap: "8px",
              alignItems: "center"
            }}>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((numPagina) => {
                // Mostrar apenas algumas páginas (primeira, última, atual e adjacentes)
                const mostrar = 
                  numPagina === 1 ||
                  numPagina === totalPaginas ||
                  Math.abs(numPagina - paginaAtual) <= 1;

                const mostrarReticencias = 
                  (numPagina === 2 && paginaAtual > 3) ||
                  (numPagina === totalPaginas - 1 && paginaAtual < totalPaginas - 2);

                if (mostrarReticencias) {
                  return (
                    <span key={numPagina} style={{ color: "#999", fontSize: "18px", fontWeight: "700" }}>
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
                      padding: "12px 16px",
                      background: paginaAtual === numPagina 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "white",
                      color: paginaAtual === numPagina ? "white" : "#0a0a0a",
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: "12px",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      minWidth: "48px"
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
                padding: "12px 24px",
                background: paginaAtual === totalPaginas ? "#e5e5e5" : "white",
                color: paginaAtual === totalPaginas ? "#999" : "#0a0a0a",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                fontSize: "15px",
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
              marginLeft: "16px",
              padding: "12px 20px",
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
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
                              display: "inline-block"
                            }}>
                              {statusInfo.label}
                            </span>
                          );
                        })()}
                      </div>
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
