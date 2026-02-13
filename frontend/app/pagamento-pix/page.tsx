"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function PagamentoPixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoId = searchParams?.get("pedido");
  const token = searchParams?.get("token");

  const [qrCode, setQrCode] = useState("");
  const [copiaCola, setCopiaCola] = useState("");
  const [valor, setValor] = useState(0);
  const [expiraEm, setExpiraEm] = useState<Date | null>(null);
  const [tempoRestante, setTempoRestante] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);

  // Gerar QR Code PIX
  useEffect(() => {
    if (!pedidoId || !token) return;

    const gerarPix = async () => {
      try {
        const response = await fetch(`${API_URL}/pagamento/pix/gerar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pedido_id: pedidoId, token }),
        });

        if (!response.ok) {
          throw new Error("Erro ao gerar PIX");
        }

        const data = await response.json();
        setQrCode(data.qrCode);
        setCopiaCola(data.copiaCola);
        setValor(data.valor);
        setExpiraEm(new Date(data.expiraEm));
        setCarregando(false);
      } catch (error: any) {
        setErro(error.message);
        setCarregando(false);
      }
    };

    gerarPix();
  }, [pedidoId, token]);

  // Atualizar tempo restante
  useEffect(() => {
    if (!expiraEm) return;

    const interval = setInterval(() => {
      const agora = new Date();
      const diff = expiraEm.getTime() - agora.getTime();

      if (diff <= 0) {
        setTempoRestante("Expirado");
        clearInterval(interval);
        return;
      }

      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      setTempoRestante(`${minutos}:${segundos.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiraEm]);

  // Verificar status do pagamento a cada 3 segundos
  useEffect(() => {
    if (!pedidoId || !token || carregando) return;

    setVerificandoPagamento(true);

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_URL}/pagamento/pix/status/${pedidoId}?token=${token}`
        );
        const data = await response.json();

        if (data.pago) {
          clearInterval(interval);
          router.push(`/sucesso?pedido=${pedidoId}&token=${token}`);
        } else if (data.expirado) {
          clearInterval(interval);
          setErro("Pagamento expirado. Por favor, faça um novo pedido.");
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pedidoId, token, carregando, router]);

  const copiarCodigoPix = () => {
    navigator.clipboard.writeText(copiaCola);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  if (carregando) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#0a0a0a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ color: "#666", fontSize: "14px" }}>Gerando QR Code PIX...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa"
      }}>
        <div style={{
          background: "white",
          padding: "32px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          textAlign: "center",
          maxWidth: "400px"
        }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px"
          }}>⚠️</div>
          <h2 style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0a0a0a",
            marginBottom: "12px"
          }}>Erro ao gerar PIX</h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>{erro}</p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "#0a0a0a",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600"
            }}
          >
            Voltar para loja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* Header */}
      <header style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 24px"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href="/" style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#0a0a0a",
            textDecoration: "none"
          }}>
            Empório Botânico
          </Link>
          <div style={{
            fontSize: "14px",
            color: "#666"
          }}>
            Pedido #{pedidoId}
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <div style={{
        maxWidth: "600px",
        margin: "48px auto",
        padding: "0 24px"
      }}>
        {/* Card PIX */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          {/* Título */}
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "8px"
          }}>
            Pagamento via PIX
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "32px"
          }}>
            Escaneie o QR Code ou copie o código PIX
          </p>

          {/* Valor */}
          <div style={{
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "32px"
          }}>
            <div style={{
              fontSize: "14px",
              color: "#666",
              marginBottom: "4px"
            }}>
              Valor a pagar
            </div>
            <div style={{
              fontSize: "36px",
              fontWeight: "800",
              color: "#0a0a0a"
            }}>
              R$ {valor.toFixed(2)}
            </div>
          </div>

          {/* QR Code */}
          {qrCode && (
            <div style={{
              background: "#f8f9fa",
              padding: "24px",
              borderRadius: "16px",
              marginBottom: "24px"
            }}>
              <img
                src={qrCode}
                alt="QR Code PIX"
                style={{
                  width: "100%",
                  maxWidth: "280px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto"
                }}
              />
            </div>
          )}

          {/* Código Copia e Cola */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#0a0a0a",
              marginBottom: "8px",
              textAlign: "left"
            }}>
              Código PIX Copia e Cola
            </div>
            <div style={{
              display: "flex",
              gap: "8px"
            }}>
              <input
                type="text"
                value={copiaCola}
                readOnly
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontFamily: "monospace",
                  background: "#f8f9fa",
                  color: "#0a0a0a"
                }}
              />
              <button
                onClick={copiarCodigoPix}
                style={{
                  padding: "12px 24px",
                  background: copiado ? "#10b981" : "#0a0a0a",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  whiteSpace: "nowrap"
                }}
              >
                {copiado ? "✓ Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          {/* Tempo Restante */}
          <div style={{
            background: tempoRestante === "Expirado" ? "#fee2e2" : "#fef3c7",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "24px"
          }}>
            <div style={{
              fontSize: "13px",
              fontWeight: "600",
              color: tempoRestante === "Expirado" ? "#dc2626" : "#d97706"
            }}>
              {tempoRestante === "Expirado" ? "⚠️ PIX Expirado" : `⏱️ Tempo restante: ${tempoRestante}`}
            </div>
          </div>

          {/* Indicador de Verificação */}
          {verificandoPagamento && tempoRestante !== "Expirado" && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "16px",
              background: "#eff6ff",
              borderRadius: "12px",
              marginBottom: "24px"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                border: "2px solid #3b82f6",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }} />
              <div style={{
                fontSize: "14px",
                color: "#3b82f6",
                fontWeight: "600"
              }}>
                Aguardando pagamento...
              </div>
            </div>
          )}

          {/* Instruções */}
          <div style={{
            textAlign: "left",
            fontSize: "14px",
            color: "#666",
            lineHeight: "1.8"
          }}>
            <p style={{ fontWeight: "600", color: "#0a0a0a", marginBottom: "8px" }}>
              Como pagar:
            </p>
            <ol style={{ paddingLeft: "20px", margin: 0 }}>
              <li>Abra o app do seu banco</li>
              <li>Entre na área PIX</li>
              <li>Escaneie o QR Code ou cole o código</li>
              <li>Confirme o pagamento</li>
              <li>Aguarde a confirmação automática</li>
            </ol>
          </div>
        </div>

        {/* Botão Simular Pagamento (apenas para testes) */}
        {process.env.NODE_ENV === "development" && (
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <button
              onClick={async () => {
                try {
                  await fetch(`${API_URL}/pagamento/pix/confirmar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pedido_id: pedidoId, token }),
                  });
                  alert("Pagamento simulado com sucesso!");
                } catch (error) {
                  alert("Erro ao simular pagamento");
                }
              }}
              style={{
                padding: "12px 24px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              🧪 Simular Pagamento (DEV)
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function PagamentoPix() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f9fa"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #e5e7eb",
            borderTopColor: "#0a0a0a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ color: "#666", fontSize: "14px" }}>Carregando...</p>
        </div>
      </div>
    }>
      <PagamentoPixContent />
    </Suspense>
  );
}
