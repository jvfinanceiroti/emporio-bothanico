"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

interface Pedido {
  id: number;
  status: string;
  total: number;
  cliente_nome: string;
  cliente_email: string;
  forma_pagamento?: string;
  criado_em: string;
}

function SucessoContent() {
  const params = useSearchParams();
  const pedidoId = params.get("pedido");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar pedido
  const buscarPedido = async () => {
    if (!pedidoId) return;

    try {
      const res = await fetch(`${API_URL}/pedidos/${pedidoId}`);
      const data = await res.json();
      setPedido(data);
      setCarregando(false);
    } catch {
      setCarregando(false);
    }
  };

  // Buscar pedido inicial
  useEffect(() => {
    buscarPedido();
  }, [pedidoId]);

  // Atualizar status a cada 5 segundos se estiver aguardando pagamento
  useEffect(() => {
    if (!pedido || pedido.status !== "aguardando_pagamento") return;

    const interval = setInterval(() => {
      buscarPedido();
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [pedido?.status, pedidoId]);

  const getFormaPagamentoLabel = (forma?: string) => {
    switch (forma) {
      case "pix": return "PIX";
      case "cartao": return "Cartão de Crédito";
      case "boleto": return "Boleto Bancário";
      default: return "Não informado";
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aguardando_pagamento":
        return { 
          label: "⏳ Aguardando Pagamento", 
          color: "#f59e0b", 
          bg: "rgba(245, 158, 11, 0.1)" 
        };
      case "pago":
      case "aprovado":
        return { 
          label: "✓ Pago", 
          color: "#10b981", 
          bg: "rgba(16, 185, 129, 0.1)" 
        };
      case "enviado":
        return { 
          label: "📦 Enviado", 
          color: "#3b82f6", 
          bg: "rgba(59, 130, 246, 0.1)" 
        };
      case "entregue":
        return { 
          label: "✓ Entregue", 
          color: "#22c55e", 
          bg: "rgba(34, 197, 94, 0.1)" 
        };
      case "cancelado":
        return { 
          label: "✗ Cancelado", 
          color: "#ef4444", 
          bg: "rgba(239, 68, 68, 0.1)" 
        };
      default:
        return { 
          label: status, 
          color: "#9ca3af", 
          bg: "rgba(156, 163, 175, 0.1)" 
        };
    }
  };

  if (carregando) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 20px)"
      }}>
        <div style={{
          textAlign: "center",
          color: "white"
        }}>
          <div style={{
            fontSize: "clamp(32px, 8vw, 48px)",
            marginBottom: "clamp(12px, 3vw, 16px)",
            animation: "spin 1s linear infinite"
          }}>
            ⏳
          </div>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 18px)", 
            fontWeight: "600",
            wordBreak: "break-word"
          }}>Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 20px)"
      }}>
        <div style={{
          background: "white",
          borderRadius: "clamp(16px, 4vw, 24px)",
          padding: "clamp(32px, 8vw, 60px) clamp(24px, 6vw, 40px)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%"
        }}>
          <div style={{ 
            fontSize: "clamp(48px, 12vw, 64px)", 
            marginBottom: "clamp(16px, 4vw, 24px)" 
          }}>❌</div>
          <h2 style={{
            fontSize: "clamp(20px, 5vw, 24px)",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "clamp(12px, 3vw, 16px)",
            wordBreak: "break-word"
          }}>
            Pedido não encontrado
          </h2>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "clamp(16px, 4vw, 24px)",
              padding: "clamp(12px, 3vw, 14px) clamp(24px, 6vw, 32px)",
              minHeight: "44px",
              background: "#0a0a0a",
              color: "white",
              textDecoration: "none",
              borderRadius: "clamp(8px, 2vw, 12px)",
              fontSize: "clamp(14px, 3.5vw, 16px)",
              fontWeight: "700",
              transition: "all 0.3s"
            }}
          >
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes checkmark {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .checkmark-circle {
          animation: checkmark 0.6s ease-out;
        }
        
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .success-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 20px)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decoração de fundo */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "clamp(400px, 80vw, 800px)",
          height: "clamp(400px, 80vw, 800px)",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-10%",
          width: "clamp(300px, 60vw, 600px)",
          height: "clamp(300px, 60vw, 600px)",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />

        {/* Card principal */}
        <div
          className="fade-in-up"
          style={{
            background: "white",
            borderRadius: "clamp(20px, 5vw, 32px)",
            padding: "clamp(32px, 8vw, 60px) clamp(24px, 6vw, 48px)",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
            position: "relative",
            zIndex: 1
          }}
        >
          {/* Ícone de sucesso */}
          <div
            className="checkmark-circle"
            style={{
              width: "clamp(80px, 20vw, 120px)",
              height: "clamp(80px, 20vw, 120px)",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto clamp(24px, 6vw, 32px)",
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
            }}
          >
            <div style={{ 
              fontSize: "clamp(40px, 10vw, 64px)", 
              color: "white" 
            }}>✓</div>
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: "clamp(24px, 6vw, 36px)",
            fontWeight: "900",
            color: "#0a0a0a",
            marginBottom: "clamp(12px, 3vw, 16px)",
            letterSpacing: "-1px",
            wordBreak: "break-word"
          }}>
            Pedido Confirmado!
          </h1>

          <p style={{
            fontSize: "clamp(14px, 3.5vw, 18px)",
            color: "#666",
            marginBottom: "clamp(24px, 6vw, 40px)",
            lineHeight: "1.6",
            wordBreak: "break-word"
          }}>
            Obrigado pela sua compra! Seu pedido foi registrado com sucesso e está sendo processado.
          </p>

          {/* Detalhes do pedido */}
          <div style={{
            background: "#fafafa",
            borderRadius: "clamp(12px, 3vw, 20px)",
            padding: "clamp(20px, 5vw, 32px)",
            marginBottom: "clamp(24px, 6vw, 40px)",
            border: "1px solid rgba(0,0,0,0.06)"
          }}>
            {/* Número do pedido */}
            <div style={{
              marginBottom: "clamp(16px, 4vw, 24px)",
              paddingBottom: "clamp(16px, 4vw, 24px)",
              borderBottom: "2px solid rgba(0,0,0,0.06)"
            }}>
              <div style={{
                fontSize: "clamp(11px, 2.8vw, 13px)",
                color: "#666",
                marginBottom: "clamp(6px, 1.5vw, 8px)",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Número do Pedido
              </div>
              <div style={{
                fontSize: "clamp(24px, 6vw, 32px)",
                fontWeight: "900",
                color: "#0a0a0a",
                letterSpacing: "-1px",
                wordBreak: "break-word"
              }}>
                #{pedido.id}
              </div>
            </div>

            {/* Grid de informações */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
              gap: "clamp(16px, 4vw, 24px)",
              textAlign: "left"
            }}>
              <div>
                <div style={{
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  color: "#666",
                  marginBottom: "clamp(6px, 1.5vw, 8px)",
                  fontWeight: "600"
                }}>
                  Cliente
                </div>
                <div style={{
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  fontWeight: "700",
                  color: "#0a0a0a",
                  wordBreak: "break-word"
                }}>
                  {pedido.cliente_nome}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  color: "#666",
                  marginBottom: "clamp(6px, 1.5vw, 8px)",
                  fontWeight: "600"
                }}>
                  Forma de Pagamento
                </div>
                <div style={{
                  fontSize: "clamp(14px, 3.5vw, 16px)",
                  fontWeight: "700",
                  color: "#0a0a0a",
                  wordBreak: "break-word"
                }}>
                  {getFormaPagamentoLabel(pedido.forma_pagamento)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  color: "#666",
                  marginBottom: "clamp(6px, 1.5vw, 8px)",
                  fontWeight: "600"
                }}>
                  Status
                </div>
                <div>
                  {(() => {
                    const statusInfo = getStatusInfo(pedido.status);
                    return (
                      <span style={{
                        padding: "clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px)",
                        background: statusInfo.bg,
                        color: statusInfo.color,
                        borderRadius: "clamp(6px, 1.5vw, 8px)",
                        fontSize: "clamp(12px, 3vw, 14px)",
                        fontWeight: "700",
                        display: "inline-block",
                        wordBreak: "break-word",
                        transition: "all 0.3s"
                      }}>
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "clamp(11px, 2.8vw, 13px)",
                  color: "#666",
                  marginBottom: "clamp(6px, 1.5vw, 8px)",
                  fontWeight: "600"
                }}>
                  Valor Total
                </div>
                <div style={{
                  fontSize: "clamp(20px, 5vw, 24px)",
                  fontWeight: "900",
                  color: "#10b981",
                  letterSpacing: "-0.5px",
                  wordBreak: "break-word"
                }}>
                  R$ {Number(pedido.total).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem adicional */}
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)",
            borderRadius: "clamp(12px, 3vw, 16px)",
            padding: "clamp(16px, 4vw, 20px)",
            marginBottom: "clamp(24px, 6vw, 32px)",
            border: "1px solid rgba(139, 92, 246, 0.2)"
          }}>
            <div style={{ 
              fontSize: "clamp(20px, 5vw, 24px)", 
              marginBottom: "clamp(6px, 1.5vw, 8px)" 
            }}>📧</div>
            <p style={{
              fontSize: "clamp(13px, 3.2vw, 15px)",
              color: "#666",
              lineHeight: "1.6",
              margin: 0,
              wordBreak: "break-word"
            }}>
              Um e-mail de confirmação foi enviado para <strong style={{ color: "#0a0a0a" }}>{pedido.cliente_email}</strong> com todos os detalhes do seu pedido.
            </p>
          </div>

          {/* Botões de ação */}
          <div style={{
            display: "flex",
            gap: "clamp(12px, 3vw, 16px)",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <Link
              href="/"
              className="success-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)",
                minHeight: "44px",
                background: "#0a0a0a",
                color: "white",
                textDecoration: "none",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(14px, 3.5vw, 16px)",
                fontWeight: "700",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
                wordBreak: "break-word"
              }}
            >
              Voltar para a loja
            </Link>

            <Link
              href={`/pedido/${pedido.id}`}
              className="success-button"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "clamp(12px, 3vw, 16px) clamp(24px, 6vw, 40px)",
                minHeight: "44px",
                background: "white",
                color: "#0a0a0a",
                textDecoration: "none",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(14px, 3.5vw, 16px)",
                fontWeight: "700",
                transition: "all 0.3s",
                border: "2px solid #0a0a0a",
                cursor: "pointer",
                wordBreak: "break-word"
              }}
            >
              Ver meus pedidos
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(16px, 4vw, 20px)"
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ 
            fontSize: "clamp(32px, 8vw, 48px)", 
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>⏳</div>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 18px)", 
            fontWeight: "600",
            wordBreak: "break-word"
          }}>Carregando...</p>
        </div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
