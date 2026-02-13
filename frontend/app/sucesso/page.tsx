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

  useEffect(() => {
    if (!pedidoId) return;

    fetch(`${API_URL}/pedidos/${pedidoId}`)
      .then(res => res.json())
      .then(data => {
        setPedido(data);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [pedidoId]);

  const getFormaPagamentoLabel = (forma?: string) => {
    switch (forma) {
      case "pix": return "PIX";
      case "cartao": return "Cartão de Crédito";
      case "boleto": return "Boleto Bancário";
      default: return "Não informado";
    }
  };

  if (carregando) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          textAlign: "center",
          color: "white"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
            animation: "spin 1s linear infinite"
          }}>
            ⏳
          </div>
          <p style={{ fontSize: "18px", fontWeight: "600" }}>Carregando informações...</p>
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
        padding: "20px"
      }}>
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "60px 40px",
          textAlign: "center",
          maxWidth: "500px"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>❌</div>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "16px"
          }}>
            Pedido não encontrado
          </h2>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "24px",
              padding: "14px 32px",
              background: "#0a0a0a",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "16px",
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
        padding: "20px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decoração de fundo */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
        
        <div style={{
          position: "absolute",
          bottom: "-30%",
          left: "-10%",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />

        {/* Card principal */}
        <div
          className="fade-in-up"
          style={{
            background: "white",
            borderRadius: "32px",
            padding: "60px 48px",
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
              width: "120px",
              height: "120px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 32px",
              boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)"
            }}
          >
            <div style={{ fontSize: "64px", color: "white" }}>✓</div>
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: "36px",
            fontWeight: "900",
            color: "#0a0a0a",
            marginBottom: "16px",
            letterSpacing: "-1px"
          }}>
            Pedido Confirmado!
          </h1>

          <p style={{
            fontSize: "18px",
            color: "#666",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>
            Obrigado pela sua compra! Seu pedido foi registrado com sucesso e está sendo processado.
          </p>

          {/* Detalhes do pedido */}
          <div style={{
            background: "#fafafa",
            borderRadius: "20px",
            padding: "32px",
            marginBottom: "40px",
            border: "1px solid rgba(0,0,0,0.06)"
          }}>
            {/* Número do pedido */}
            <div style={{
              marginBottom: "24px",
              paddingBottom: "24px",
              borderBottom: "2px solid rgba(0,0,0,0.06)"
            }}>
              <div style={{
                fontSize: "13px",
                color: "#666",
                marginBottom: "8px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                Número do Pedido
              </div>
              <div style={{
                fontSize: "32px",
                fontWeight: "900",
                color: "#0a0a0a",
                letterSpacing: "-1px"
              }}>
                #{pedido.id}
              </div>
            </div>

            {/* Grid de informações */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              textAlign: "left"
            }}>
              <div>
                <div style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}>
                  Cliente
                </div>
                <div style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0a0a0a"
                }}>
                  {pedido.cliente_nome}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}>
                  Forma de Pagamento
                </div>
                <div style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0a0a0a"
                }}>
                  {getFormaPagamentoLabel(pedido.forma_pagamento)}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}>
                  Status
                </div>
                <div>
                  <span style={{
                    padding: "8px 16px",
                    background: "rgba(245, 158, 11, 0.1)",
                    color: "#f59e0b",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "700",
                    display: "inline-block"
                  }}>
                    ⏳ Aguardando Pagamento
                  </span>
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: "13px",
                  color: "#666",
                  marginBottom: "8px",
                  fontWeight: "600"
                }}>
                  Valor Total
                </div>
                <div style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#10b981",
                  letterSpacing: "-0.5px"
                }}>
                  R$ {Number(pedido.total).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Mensagem adicional */}
          <div style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "32px",
            border: "1px solid rgba(139, 92, 246, 0.2)"
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📧</div>
            <p style={{
              fontSize: "15px",
              color: "#666",
              lineHeight: "1.6",
              margin: 0
            }}>
              Um e-mail de confirmação foi enviado para <strong style={{ color: "#0a0a0a" }}>{pedido.cliente_email}</strong> com todos os detalhes do seu pedido.
            </p>
          </div>

          {/* Botões de ação */}
          <div style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <Link
              href="/"
              className="success-button"
              style={{
                display: "inline-block",
                padding: "16px 40px",
                background: "#0a0a0a",
                color: "white",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer"
              }}
            >
              Voltar para a loja
            </Link>

            <Link
              href={`/pedido/${pedido.id}`}
              className="success-button"
              style={{
                display: "inline-block",
                padding: "16px 40px",
                background: "white",
                color: "#0a0a0a",
                textDecoration: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                transition: "all 0.3s",
                border: "2px solid #0a0a0a",
                cursor: "pointer"
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
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ fontSize: "18px", fontWeight: "600" }}>Carregando...</p>
        </div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
