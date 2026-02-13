"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  criado_em: string;
}

export default function AdminUsuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setCarregando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchNome = usuario.nome?.toLowerCase().includes(filtro.toLowerCase()) || false;
    const matchEmail = usuario.email?.toLowerCase().includes(filtro.toLowerCase()) || false;
    
    return matchNome || matchEmail;
  });

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "cliente":
        return { bg: "rgba(59, 130, 246, 0.1)", color: "#3b82f6", label: "👤 Cliente" };
      case "vendedor":
        return { bg: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6", label: "💼 Vendedor" };
      default:
        return { bg: "rgba(156, 163, 175, 0.1)", color: "#9ca3af", label: role };
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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
        {/* Título e Busca */}
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
            Usuários Cadastrados
          </h2>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}>
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                flex: 1,
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

            <div style={{
              padding: "14px 24px",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#667eea"
            }}>
              {usuariosFiltrados.length} usuário(s)
            </div>
          </div>

          <p style={{
            marginTop: "16px",
            fontSize: "13px",
            color: "#999"
          }}>
            ℹ️ Administradores não são exibidos nesta listagem
          </p>
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
            <p style={{ color: "#666", fontSize: "16px" }}>Carregando usuários...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "80px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>👥</div>
            <h3 style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#0a0a0a",
              marginBottom: "8px"
            }}>
              Nenhum usuário encontrado
            </h3>
            <p style={{ color: "#666", fontSize: "15px" }}>
              {filtro 
                ? "Tente ajustar o termo de busca" 
                : "Ainda não há usuários cadastrados"}
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
                      Nome
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
                      Email
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
                      Tipo
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
                      Cadastrado em
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario, index) => {
                    const roleInfo = getRoleInfo(usuario.role);
                    return (
                      <tr
                        key={usuario.id}
                        style={{
                          borderBottom: index < usuariosFiltrados.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#fafafa"}
                        onMouseOut={(e) => e.currentTarget.style.background = "white"}
                      >
                        <td style={{
                          padding: "24px",
                          fontSize: "15px",
                          fontWeight: "700",
                          color: "#0a0a0a"
                        }}>
                          #{usuario.id}
                        </td>
                        <td style={{
                          padding: "24px"
                        }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                          }}>
                            <div style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "16px",
                              fontWeight: "700"
                            }}>
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div style={{
                              fontSize: "15px",
                              fontWeight: "600",
                              color: "#0a0a0a"
                            }}>
                              {usuario.nome}
                            </div>
                          </div>
                        </td>
                        <td style={{
                          padding: "24px",
                          fontSize: "14px",
                          color: "#666"
                        }}>
                          {usuario.email}
                        </td>
                        <td style={{ padding: "24px" }}>
                          <span style={{
                            padding: "8px 16px",
                            background: roleInfo.bg,
                            color: roleInfo.color,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            display: "inline-block"
                          }}>
                            {roleInfo.label}
                          </span>
                        </td>
                        <td style={{
                          padding: "24px",
                          fontSize: "14px",
                          color: "#666",
                          whiteSpace: "nowrap"
                        }}>
                          {formatarData(usuario.criado_em)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cards de Resumo */}
        {usuariosFiltrados.length > 0 && (
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
                Total de Usuários
              </div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#0a0a0a", letterSpacing: "-1px" }}>
                {usuariosFiltrados.length}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Clientes
              </div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#3b82f6", letterSpacing: "-1px" }}>
                {usuariosFiltrados.filter(u => u.role === "cliente").length}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "24px",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Vendedores
              </div>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "#8b5cf6", letterSpacing: "-1px" }}>
                {usuariosFiltrados.filter(u => u.role === "vendedor").length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
