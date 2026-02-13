"use client";

import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

    setCarregando(true);
    setBuscaRealizada(false);
    setPedidos([]);

    try {
      const valor = tipoBusca === "cpf" ? busca.replace(/\D/g, "") : busca;
      const response = await fetch(`${API_URL}/pedidos/buscar?tipo=${tipoBusca}&valor=${encodeURIComponent(valor)}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro na resposta:", errorData);
        throw new Error(errorData.error || "Erro ao buscar pedidos");
      }

      const data = await response.json();
      setPedidos(data || []);
      setBuscaRealizada(true);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      alert(`Erro ao buscar pedidos: ${error.message}`);
      setPedidos([]);
      setBuscaRealizada(true);
    } finally {
      setCarregando(false);
    }
  };

  const carregarDetalhesPedido = async (id: number) => {
    setCarregandoDetalhes(true);
    try {
      const response = await fetch(`${API_URL}/pedidos/${id}/detalhes`);
      const data = await response.json();
      setPedidoSelecionado(data);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      alert("Erro ao carregar detalhes do pedido");
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

  const getFormaPagamentoLabel = (forma?: string) => {
    switch (forma) {
      case "pix": return "💰 PIX";
      case "cartao": return "💳 Cartão de Crédito";
      case "boleto": return "📄 Boleto Bancário";
      default: return "Não informado";
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "clamp(20px, 5vw, 40px) clamp(16px, 4vw, 20px)"
    }}>
      {/* Header */}
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto clamp(24px, 6vw, 40px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <h1 style={{
          fontSize: "clamp(24px, 6vw, 32px)",
          fontWeight: "800",
          color: "white",
          margin: 0
        }}>
          📦 Meus Pedidos
        </h1>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            padding: "clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)",
            background: "rgba(255,255,255,0.2)",
            color: "white",
            borderRadius: "clamp(8px, 2vw, 12px)",
            fontSize: "clamp(13px, 3vw, 14px)",
            fontWeight: "600",
            border: "2px solid rgba(255,255,255,0.3)",
            transition: "all 0.2s",
            backdropFilter: "blur(10px)"
          }}
        >
          ← Voltar para Loja
        </Link>
      </div>

      {/* Container Principal */}
      <div style={{
        maxWidth: "1000px",
        margin: "0 auto",
        background: "white",
        borderRadius: "clamp(16px, 4vw, 24px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        overflow: "hidden"
      }}>
        {/* Formulário de Busca */}
        <div style={{
          padding: "clamp(24px, 6vw, 40px)",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)"
        }}>
          <h2 style={{
            fontSize: "clamp(18px, 4.5vw, 24px)",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "clamp(16px, 4vw, 24px)",
            textAlign: "center"
          }}>
            Rastreie seus pedidos
          </h2>

          <div style={{
            display: "flex",
            gap: "clamp(12px, 3vw, 16px)",
            marginBottom: "clamp(16px, 4vw, 20px)",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => {
                setTipoBusca("email");
                setBusca("");
              }}
              style={{
                padding: "clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)",
                background: tipoBusca === "email" ? "#667eea" : "white",
                color: tipoBusca === "email" ? "white" : "#667eea",
                border: `2px solid #667eea`,
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(13px, 3vw, 14px)",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s",
                minHeight: "44px"
              }}
            >
              📧 Email
            </button>
            <button
              onClick={() => {
                setTipoBusca("cpf");
                setBusca("");
              }}
              style={{
                padding: "clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)",
                background: tipoBusca === "cpf" ? "#667eea" : "white",
                color: tipoBusca === "cpf" ? "white" : "#667eea",
                border: `2px solid #667eea`,
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(13px, 3vw, 14px)",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.2s",
                minHeight: "44px"
              }}
            >
              🆔 CPF
            </button>
          </div>

          <div style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 12px)",
            flexWrap: "wrap"
          }}>
            <input
              type={tipoBusca === "email" ? "email" : "text"}
              placeholder={tipoBusca === "email" ? "Digite seu email" : "Digite seu CPF"}
              value={busca}
              onChange={(e) => {
                const valor = e.target.value;
                setBusca(tipoBusca === "cpf" ? formatarCPF(valor) : valor);
              }}
              onKeyPress={(e) => e.key === "Enter" && buscarPedidos()}
              style={{
                flex: 1,
                padding: "clamp(12px, 3vw, 16px)",
                border: "2px solid #e5e7eb",
                borderRadius: "clamp(10px, 2.5vw, 12px)",
                fontSize: "clamp(14px, 3.5vw, 16px)",
                fontWeight: "500",
                color: "#0a0a0a",
                outline: "none",
                transition: "all 0.2s",
                minHeight: "52px"
              }}
            />
            <button
              onClick={buscarPedidos}
              disabled={carregando}
              style={{
                padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)",
                background: carregando ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "clamp(10px, 2.5vw, 12px)",
                fontSize: "clamp(14px, 3.5vw, 16px)",
                fontWeight: "700",
                cursor: carregando ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                minHeight: "52px",
                whiteSpace: "nowrap"
              }}
            >
              {carregando ? "Buscando..." : "🔍 Buscar"}
            </button>
          </div>
        </div>

        {/* Resultados */}
        <div style={{ padding: "clamp(24px, 6vw, 40px)" }}>
          {carregando && (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              Carregando...
            </div>
          )}

          {!carregando && buscaRealizada && pedidos.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "clamp(32px, 8vw, 60px)",
              color: "#666"
            }}>
              <div style={{ fontSize: "clamp(48px, 12vw, 64px)", marginBottom: "16px" }}>📭</div>
              <h3 style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: "600", marginBottom: "8px" }}>
                Nenhum pedido encontrado
              </h3>
              <p style={{ fontSize: "clamp(13px, 3vw, 14px)" }}>
                Verifique se o {tipoBusca === "email" ? "email" : "CPF"} está correto
              </p>
            </div>
          )}

          {pedidos.length > 0 && (
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 3vw, 16px)"
            }}>
              {pedidos.map((pedido) => {
                const statusInfo = getStatusInfo(pedido.status);
                return (
                  <div
                    key={pedido.id}
                    onClick={() => carregarDetalhesPedido(pedido.id)}
                    style={{
                      border: "2px solid #e5e7eb",
                      borderRadius: "clamp(12px, 3vw, 16px)",
                      padding: "clamp(16px, 4vw, 20px)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: "white"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#667eea";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#e5e7eb";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "clamp(12px, 3vw, 16px)",
                      flexWrap: "wrap"
                    }}>
                      <div style={{ flex: 1, minWidth: "min(200px, 100%)" }}>
                        <div style={{
                          fontSize: "clamp(12px, 3vw, 14px)",
                          color: "#667eea",
                          fontWeight: "700",
                          marginBottom: "8px"
                        }}>
                          Pedido #{pedido.id}
                        </div>
                        <div style={{
                          fontSize: "clamp(14px, 3.5vw, 16px)",
                          fontWeight: "700",
                          color: "#0a0a0a",
                          marginBottom: "4px"
                        }}>
                          {pedido.cliente_nome}
                        </div>
                        <div style={{
                          fontSize: "clamp(11px, 2.8vw, 12px)",
                          color: "#666"
                        }}>
                          {formatarData(pedido.criado_em)}
                        </div>
                      </div>

                      <div style={{
                        textAlign: "right",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        alignItems: "flex-end"
                      }}>
                        <div style={{
                          fontSize: "clamp(18px, 4.5vw, 24px)",
                          fontWeight: "800",
                          color: "#10b981"
                        }}>
                          R$ {Number(pedido.total).toFixed(2)}
                        </div>
                        <span style={{
                          padding: "clamp(4px, 1vw, 6px) clamp(12px, 3vw, 16px)",
                          background: statusInfo.bg,
                          color: statusInfo.color,
                          borderRadius: "clamp(6px, 1.5vw, 8px)",
                          fontSize: "clamp(11px, 2.8vw, 12px)",
                          fontWeight: "700",
                          whiteSpace: "nowrap"
                        }}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE DETALHES */}
      {pedidoSelecionado && (
        <div
          onClick={() => setPedidoSelecionado(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 4vw, 20px)",
            overflowY: "auto"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "clamp(16px, 4vw, 20px)",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)"
            }}
          >
            {/* Header do Modal */}
            <div style={{
              padding: "clamp(20px, 5vw, 32px)",
              borderBottom: "2px solid #f3f4f6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
              flexWrap: "wrap"
            }}>
              <div>
                <h3 style={{
                  fontSize: "clamp(20px, 5vw, 24px)",
                  fontWeight: "800",
                  color: "#0a0a0a",
                  margin: "0 0 8px 0"
                }}>
                  Pedido #{pedidoSelecionado.pedido.id}
                </h3>
                <p style={{
                  fontSize: "clamp(12px, 3vw, 14px)",
                  color: "#666",
                  margin: 0
                }}>
                  {formatarData(pedidoSelecionado.pedido.criado_em)}
                </p>
              </div>
              <button
                onClick={() => setPedidoSelecionado(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "clamp(20px, 5vw, 24px)",
                  cursor: "pointer",
                  color: "#999",
                  padding: "clamp(4px, 1vw, 8px)",
                  minWidth: "44px",
                  minHeight: "44px"
                }}
              >
                ✕
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
              {/* Status e Pagamento */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
                gap: "clamp(12px, 3vw, 16px)",
                marginBottom: "clamp(20px, 5vw, 32px)"
              }}>
                <div style={{
                  background: "#fafafa",
                  padding: "clamp(16px, 4vw, 20px)",
                  borderRadius: "clamp(10px, 2.5vw, 12px)"
                }}>
                  <div style={{
                    fontSize: "clamp(11px, 2.8vw, 13px)",
                    color: "#666",
                    marginBottom: "8px",
                    fontWeight: "600"
                  }}>
                    Status
                  </div>
                  {(() => {
                    const statusInfo = getStatusInfo(pedidoSelecionado.pedido.status);
                    return (
                      <span style={{
                        padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)",
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        borderRadius: "clamp(6px, 1.5vw, 8px)",
                        fontSize: "clamp(12px, 3vw, 14px)",
                        fontWeight: "700",
                        display: "inline-block"
                      }}>
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>

                <div style={{
                  background: "#fafafa",
                  padding: "clamp(16px, 4vw, 20px)",
                  borderRadius: "clamp(10px, 2.5vw, 12px)"
                }}>
                  <div style={{
                    fontSize: "clamp(11px, 2.8vw, 13px)",
                    color: "#666",
                    marginBottom: "8px",
                    fontWeight: "600"
                  }}>
                    Pagamento
                  </div>
                  <div style={{
                    fontSize: "clamp(13px, 3.2vw, 15px)",
                    fontWeight: "700",
                    color: "#0a0a0a"
                  }}>
                    {getFormaPagamentoLabel(pedidoSelecionado.pedido.forma_pagamento)}
                  </div>
                </div>
              </div>

              {/* Código de Rastreio */}
              {pedidoSelecionado.pedido.codigo_rastreio && (
                <div style={{
                  background: "#fafafa",
                  padding: "clamp(16px, 4vw, 20px)",
                  borderRadius: "clamp(10px, 2.5vw, 12px)",
                  marginBottom: "clamp(20px, 5vw, 24px)"
                }}>
                  <div style={{
                    fontSize: "clamp(11px, 2.8vw, 13px)",
                    color: "#666",
                    marginBottom: "8px",
                    fontWeight: "600"
                  }}>
                    📦 Código de Rastreio
                  </div>
                  <div style={{
                    fontSize: "clamp(14px, 3.5vw, 16px)",
                    fontWeight: "700",
                    color: "#667eea",
                    fontFamily: "monospace",
                    wordBreak: "break-all"
                  }}>
                    {pedidoSelecionado.pedido.codigo_rastreio}
                  </div>
                </div>
              )}

              {/* Itens do Pedido */}
              <div style={{ marginBottom: "clamp(20px, 5vw, 24px)" }}>
                <h4 style={{
                  fontSize: "clamp(15px, 3.8vw, 18px)",
                  fontWeight: "700",
                  color: "#0a0a0a",
                  marginBottom: "clamp(12px, 3vw, 16px)"
                }}>
                  Itens do Pedido
                </h4>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(8px, 2vw, 12px)"
                }}>
                  {pedidoSelecionado.itens.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "clamp(12px, 3vw, 16px)",
                        background: "#fafafa",
                        borderRadius: "clamp(8px, 2vw, 10px)",
                        gap: "clamp(8px, 2vw, 12px)",
                        flexWrap: "wrap"
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "min(150px, 100%)" }}>
                        <div style={{
                          fontSize: "clamp(13px, 3.2vw, 14px)",
                          fontWeight: "700",
                          color: "#0a0a0a",
                          marginBottom: "4px"
                        }}>
                          {item.nome}
                        </div>
                        <div style={{
                          fontSize: "clamp(11px, 2.8vw, 12px)",
                          color: "#666"
                        }}>
                          Quantidade: {item.quantidade}
                        </div>
                      </div>
                      <div style={{
                        fontSize: "clamp(14px, 3.5vw, 16px)",
                        fontWeight: "700",
                        color: "#10b981"
                      }}>
                        R$ {(Number(item.preco_unitario) * item.quantidade).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endereço de Entrega */}
              {pedidoSelecionado.pedido.endereco_rua && (
                <div style={{
                  background: "#fafafa",
                  padding: "clamp(16px, 4vw, 20px)",
                  borderRadius: "clamp(10px, 2.5vw, 12px)",
                  marginBottom: "clamp(20px, 5vw, 24px)"
                }}>
                  <h4 style={{
                    fontSize: "clamp(13px, 3.2vw, 15px)",
                    fontWeight: "700",
                    color: "#0a0a0a",
                    marginBottom: "clamp(8px, 2vw, 12px)"
                  }}>
                    📍 Endereço de Entrega
                  </h4>
                  <div style={{
                    fontSize: "clamp(12px, 3vw, 13px)",
                    color: "#666",
                    lineHeight: "1.6"
                  }}>
                    {pedidoSelecionado.pedido.endereco_rua}, {pedidoSelecionado.pedido.endereco_numero}
                    {pedidoSelecionado.pedido.endereco_complemento && ` - ${pedidoSelecionado.pedido.endereco_complemento}`}
                    <br />
                    {pedidoSelecionado.pedido.endereco_bairro}
                    <br />
                    {pedidoSelecionado.pedido.endereco_cidade} - {pedidoSelecionado.pedido.endereco_estado}
                    <br />
                    CEP: {pedidoSelecionado.pedido.endereco_cep}
                  </div>
                </div>
              )}

              {/* Total */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "clamp(16px, 4vw, 20px)",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "clamp(10px, 2.5vw, 12px)",
                color: "white",
                flexWrap: "wrap",
                gap: "clamp(8px, 2vw, 12px)"
              }}>
                <div style={{
                  fontSize: "clamp(16px, 4vw, 18px)",
                  fontWeight: "700"
                }}>
                  Total do Pedido
                </div>
                <div style={{
                  fontSize: "clamp(20px, 5vw, 28px)",
                  fontWeight: "800"
                }}>
                  R$ {Number(pedidoSelecionado.pedido.total).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
