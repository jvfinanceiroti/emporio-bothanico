"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import { ProtegerRota } from "@/lib/ProtegerRota";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
  criado_em: string;
}

export default function AdminUsuarios() {
  return (
    <ProtegerRota permissoesRequeridas={['pode_visualizar_usuarios']}>
      <UsuariosConteudo />
    </ProtegerRota>
  );
}

function UsuariosConteudo() {
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
        padding: "clamp(16px, 4vw, 40px)"
      }}>
        {/* Título e Busca */}
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
            Usuários Cadastrados
          </h2>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 3vw, 16px)",
            flexWrap: "wrap"
          }}>
            {/* Busca */}
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{
                flex: "1",
                minWidth: "200px",
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

            <div style={{
              padding: "clamp(10px, 2.5vw, 14px) clamp(16px, 4vw, 24px)",
              background: "rgba(102, 126, 234, 0.1)",
              borderRadius: "clamp(8px, 2vw, 12px)",
              fontSize: "clamp(11px, 2.2vw, 14px)",
              fontWeight: "600",
              color: "#667eea"
            }}>
              {usuariosFiltrados.length} usuário(s)
            </div>
          </div>

          <p style={{
            marginTop: "clamp(12px, 3vw, 16px)",
            fontSize: "clamp(10px, 2vw, 13px)",
            color: "#999"
          }}>
            ℹ️ Administradores não são exibidos nesta listagem
          </p>
        </div>

        {/* Lista de Usuários - Cards Mobile-First */}
        {carregando ? (
          <div style={{
            background: "white",
            borderRadius: "clamp(12px, 3vw, 20px)",
            padding: "clamp(40px, 10vw, 80px)",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "clamp(32px, 8vw, 48px)", marginBottom: "16px" }}>⏳</div>
            <p style={{ color: "#666", fontSize: "clamp(12px, 2.5vw, 16px)" }}>Carregando usuários...</p>
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "clamp(12px, 3vw, 20px)",
            padding: "clamp(40px, 10vw, 80px)",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "clamp(48px, 12vw, 64px)", marginBottom: "16px" }}>👥</div>
            <h3 style={{
              fontSize: "clamp(16px, 4vw, 20px)",
              fontWeight: "700",
              color: "#0a0a0a",
              marginBottom: "8px"
            }}>
              Nenhum usuário encontrado
            </h3>
            <p style={{ color: "#666", fontSize: "clamp(12px, 2.5vw, 15px)" }}>
              {filtro 
                ? "Tente ajustar o termo de busca" 
                : "Ainda não há usuários cadastrados"}
            </p>
          </div>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(12px, 3vw, 16px)"
          }}>
            {usuariosFiltrados.map((usuario) => {
              const roleInfo = getRoleInfo(usuario.role);
              return (
                <div
                  key={usuario.id}
                  style={{
                    background: "white",
                    borderRadius: "clamp(8px, 2vw, 12px)",
                    padding: "clamp(12px, 3vw, 16px)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#fafafa"}
                  onMouseOut={(e) => e.currentTarget.style.background = "white"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 16px)", flexWrap: "wrap" }}>
                    <div style={{
                      width: "clamp(36px, 9vw, 48px)",
                      height: "clamp(36px, 9vw, 48px)",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "clamp(14px, 3.5vw, 18px)",
                      fontWeight: "700",
                      flexShrink: 0
                    }}>
                      {usuario.nome.charAt(0).toUpperCase()}
                    </div>
                    
                    <div style={{ flex: "1", minWidth: "150px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "4px" }}>
                        <div style={{
                          fontSize: "clamp(13px, 2.8vw, 15px)",
                          fontWeight: "600",
                          color: "#0a0a0a"
                        }}>
                          {usuario.nome}
                        </div>
                        <span style={{
                          padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
                          background: roleInfo.bg,
                          color: roleInfo.color,
                          borderRadius: "clamp(6px, 1.5vw, 8px)",
                          fontSize: "clamp(10px, 2vw, 11px)",
                          fontWeight: "700",
                          whiteSpace: "nowrap"
                        }}>
                          {roleInfo.label}
                        </span>
                      </div>
                      <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginBottom: "2px" }}>
                        {usuario.email}
                      </div>
                      <div style={{ fontSize: "clamp(10px, 2vw, 12px)", color: "#999" }}>
                        Cadastrado em {formatarData(usuario.criado_em)}
                      </div>
                    </div>

                    <div style={{
                      fontSize: "clamp(11px, 2.2vw, 13px)",
                      fontWeight: "700",
                      color: "#666",
                      whiteSpace: "nowrap"
                    }}>
                      ID #{usuario.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cards de Resumo */}
        {usuariosFiltrados.length > 0 && (
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
                Total de Usuários
              </div>
              <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "900", color: "#0a0a0a", letterSpacing: "-1px" }}>
                {usuariosFiltrados.length}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "clamp(12px, 3vw, 16px)",
              padding: "clamp(16px, 4vw, 24px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Clientes
              </div>
              <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "900", color: "#3b82f6", letterSpacing: "-1px" }}>
                {usuariosFiltrados.filter(u => u.role === "cliente").length}
              </div>
            </div>

            <div style={{
              background: "white",
              borderRadius: "clamp(12px, 3vw, 16px)",
              padding: "clamp(16px, 4vw, 24px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#666", marginBottom: "8px", fontWeight: "600" }}>
                Vendedores
              </div>
              <div style={{ fontSize: "clamp(24px, 6vw, 32px)", fontWeight: "900", color: "#8b5cf6", letterSpacing: "-1px" }}>
                {usuariosFiltrados.filter(u => u.role === "vendedor").length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
