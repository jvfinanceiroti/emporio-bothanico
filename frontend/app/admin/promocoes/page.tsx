"use client";

import { useEffect, useState, useRef } from "react";
import { API_URL } from "@/lib/api";
import { getAdminLoginPath } from "@/lib/admin-paths";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import { ProtegerRota } from "@/lib/ProtegerRota";

export default function AdminPromocoes() {
  return (
    <ProtegerRota permissoesRequeridas={["pode_acessar_dashboard"]}>
      <PromocoesConteudo />
    </ProtegerRota>
  );
}

interface VisitaData {
  total: number;
  hoje: number;
  semana: number;
  mes: number;
  porDia: { dia: string; total: string }[];
  porHora: { hora: string; total: string }[];
  recentes: {
    id: number;
    ip: string;
    user_agent: string;
    referrer: string;
    created_at: string;
  }[];
}

function PromocoesConteudo() {
  const router = useRouter();
  const [dados, setDados] = useState<VisitaData | null>(null);
  const [qrcode, setQrcode] = useState<string>("");
  const [promoUrl, setPromoUrl] = useState<string>("");
  const [erro, setErro] = useState("");
  const [abaAtiva, setAbaAtiva] = useState<"resumo" | "historico">("resumo");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(getAdminLoginPath());
      return;
    }

    fetch(`${API_URL}/admin/promo/visitas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setDados)
      .catch(() => setErro("Erro ao carregar dados"));

    fetch(`${API_URL}/admin/promo/qrcode`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setQrcode(data.qrcode);
        setPromoUrl(data.url);
      })
      .catch(() => {});
  }, [router]);

  const downloadQrCode = () => {
    if (!qrcode) return;
    const link = document.createElement("a");
    link.download = "qrcode-promocao-emporio.png";
    link.href = qrcode;
    link.click();
  };

  const formatarData = (d: string) => {
    return new Date(d).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarDia = (d: string) => {
    return new Date(d).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      weekday: "short",
    });
  };

  const detectarDispositivo = (ua: string) => {
    if (!ua) return "Desconhecido";
    if (/iPhone/i.test(ua)) return "iPhone";
    if (/iPad/i.test(ua)) return "iPad";
    if (/Android/i.test(ua)) return "Android";
    if (/Windows/i.test(ua)) return "Windows";
    if (/Mac/i.test(ua)) return "Mac";
    if (/Linux/i.test(ua)) return "Linux";
    return "Outro";
  };

  if (erro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#ef4444", fontWeight: "bold" }}>{erro}</p>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "16px",
          }}
        >
          Carregando...
        </div>
      </div>
    );
  }

  const maxVisitasDia = Math.max(
    ...dados.porDia.map((d) => parseInt(d.total)),
    1
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <AdminHeader />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 40px)",
        }}
      >
        <h2
          style={{
            color: "white",
            fontSize: "clamp(20px, 5vw, 28px)",
            fontWeight: "700",
            marginBottom: "clamp(16px, 4vw, 24px)",
          }}
        >
          📊 Promoções — QR Code & Visitas
        </h2>

        {/* Cards de estatísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "clamp(12px, 3vw, 20px)",
            marginBottom: "clamp(20px, 5vw, 32px)",
          }}
        >
          <StatCard
            icon="👁️"
            title="Total de Visitas"
            value={dados.total}
            color="#3b82f6"
            bgColor="rgba(59, 130, 246, 0.1)"
          />
          <StatCard
            icon="🔥"
            title="Visitas Hoje"
            value={dados.hoje}
            color="#f59e0b"
            bgColor="rgba(245, 158, 11, 0.1)"
          />
          <StatCard
            icon="📅"
            title="Últimos 7 dias"
            value={dados.semana}
            color="#10b981"
            bgColor="rgba(16, 185, 129, 0.1)"
          />
          <StatCard
            icon="📆"
            title="Últimos 30 dias"
            value={dados.mes}
            color="#8b5cf6"
            bgColor="rgba(139, 92, 246, 0.1)"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 350px), 1fr))",
            gap: "clamp(16px, 4vw, 24px)",
            marginBottom: "clamp(20px, 5vw, 32px)",
          }}
        >
          {/* QR Code */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "clamp(20px, 5vw, 32px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "16px",
              }}
            >
              QR Code da Promoção
            </h3>

            {qrcode ? (
              <>
                <div
                  style={{
                    background: "#f9fafb",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "inline-block",
                    marginBottom: "16px",
                  }}
                >
                  <img
                    src={qrcode}
                    alt="QR Code Promoção"
                    style={{ width: "220px", height: "220px" }}
                  />
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "16px",
                    wordBreak: "break-all",
                  }}
                >
                  Aponta para:{" "}
                  <a
                    href={promoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#667eea", fontWeight: "600" }}
                  >
                    {promoUrl}
                  </a>
                </p>
                <button
                  onClick={downloadQrCode}
                  style={{
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    border: "none",
                    padding: "12px 28px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  ⬇️ Baixar QR Code (PNG)
                </button>
              </>
            ) : (
              <p style={{ color: "#9ca3af" }}>Gerando QR Code...</p>
            )}
          </div>

          {/* Visitas por hora */}
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "clamp(20px, 5vw, 32px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "16px",
              }}
            >
              Horários mais acessados (30 dias)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {Array.from({ length: 24 }, (_, i) => {
                const item = dados.porHora.find(
                  (h) => parseInt(h.hora) === i
                );
                const total = item ? parseInt(item.total) : 0;
                const maxHora = Math.max(
                  ...dados.porHora.map((h) => parseInt(h.total)),
                  1
                );
                const pct = (total / maxHora) * 100;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                    }}
                  >
                    <span
                      style={{
                        width: "36px",
                        textAlign: "right",
                        color: "#6b7280",
                        fontWeight: "600",
                        flexShrink: 0,
                      }}
                    >
                      {String(i).padStart(2, "0")}h
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "16px",
                        background: "#f3f4f6",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background:
                            total > 0
                              ? "linear-gradient(90deg, #667eea, #764ba2)"
                              : "transparent",
                          borderRadius: "4px",
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: "28px",
                        textAlign: "right",
                        color: "#374151",
                        fontWeight: "700",
                        flexShrink: 0,
                      }}
                    >
                      {total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Abas: Resumo por dia / Histórico */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              borderBottom: "2px solid #e5e7eb",
            }}
          >
            <button
              onClick={() => setAbaAtiva("resumo")}
              style={{
                flex: 1,
                padding: "14px",
                background:
                  abaAtiva === "resumo"
                    ? "rgba(102,126,234,0.1)"
                    : "transparent",
                border: "none",
                borderBottom:
                  abaAtiva === "resumo"
                    ? "3px solid #667eea"
                    : "3px solid transparent",
                fontWeight: "700",
                fontSize: "14px",
                color: abaAtiva === "resumo" ? "#667eea" : "#6b7280",
                cursor: "pointer",
              }}
            >
              📊 Visitas por Dia
            </button>
            <button
              onClick={() => setAbaAtiva("historico")}
              style={{
                flex: 1,
                padding: "14px",
                background:
                  abaAtiva === "historico"
                    ? "rgba(102,126,234,0.1)"
                    : "transparent",
                border: "none",
                borderBottom:
                  abaAtiva === "historico"
                    ? "3px solid #667eea"
                    : "3px solid transparent",
                fontWeight: "700",
                fontSize: "14px",
                color: abaAtiva === "historico" ? "#667eea" : "#6b7280",
                cursor: "pointer",
              }}
            >
              🕐 Histórico Recente
            </button>
          </div>

          <div style={{ padding: "clamp(16px, 4vw, 24px)" }}>
            {abaAtiva === "resumo" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {dados.porDia.length === 0 && (
                  <p style={{ color: "#9ca3af", textAlign: "center", padding: "20px" }}>
                    Nenhuma visita registrada ainda
                  </p>
                )}
                {dados.porDia.map((d) => (
                  <div
                    key={d.dia}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "8px 0",
                    }}
                  >
                    <span
                      style={{
                        width: "90px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                        flexShrink: 0,
                      }}
                    >
                      {formatarDia(d.dia)}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "24px",
                        background: "#f3f4f6",
                        borderRadius: "6px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(parseInt(d.total) / maxVisitasDia) * 100}%`,
                          height: "100%",
                          background:
                            "linear-gradient(90deg, #667eea, #764ba2)",
                          borderRadius: "6px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          paddingRight: "8px",
                          minWidth: "40px",
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "700",
                          }}
                        >
                          {d.total}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {abaAtiva === "historico" && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f9fafb",
                        textAlign: "left",
                      }}
                    >
                      <th style={{ padding: "10px 12px", fontWeight: "700", color: "#374151" }}>
                        Data/Hora
                      </th>
                      <th style={{ padding: "10px 12px", fontWeight: "700", color: "#374151" }}>
                        IP
                      </th>
                      <th style={{ padding: "10px 12px", fontWeight: "700", color: "#374151" }}>
                        Dispositivo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.recentes.length === 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            padding: "20px",
                            textAlign: "center",
                            color: "#9ca3af",
                          }}
                        >
                          Nenhuma visita registrada ainda
                        </td>
                      </tr>
                    )}
                    {dados.recentes.map((v) => (
                      <tr
                        key={v.id}
                        style={{ borderBottom: "1px solid #f3f4f6" }}
                      >
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#374151",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatarData(v.created_at)}
                        </td>
                        <td
                          style={{
                            padding: "10px 12px",
                            color: "#6b7280",
                            fontFamily: "monospace",
                            fontSize: "12px",
                          }}
                        >
                          {v.ip}
                        </td>
                        <td style={{ padding: "10px 12px", color: "#6b7280" }}>
                          {detectarDispositivo(v.user_agent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  color,
  bgColor,
}: {
  icon: string;
  title: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "clamp(16px, 4vw, 24px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        border: `2px solid ${bgColor}`,
        transition: "all 0.3s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            background: bgColor,
            width: "56px",
            height: "56px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <h3
            style={{
              color: "#6b7280",
              fontSize: "12px",
              fontWeight: "600",
              margin: 0,
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              color,
              fontSize: "28px",
              fontWeight: "800",
              margin: 0,
            }}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
