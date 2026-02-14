"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtegerRota, usePodeExecutar } from "@/lib/ProtegerRota";

import { API_URL } from "@/lib/api";

interface Permissoes {
  pode_criar_produtos: boolean;
  pode_editar_produtos: boolean;
  pode_deletar_produtos: boolean;
  pode_gerenciar_estoque: boolean;
  pode_upload_imagens: boolean;
  pode_visualizar_pedidos: boolean;
  pode_alterar_status_pedidos: boolean;
  pode_cancelar_pedidos: boolean;
  pode_adicionar_rastreio: boolean;
  pode_visualizar_usuarios: boolean;
  pode_gerenciar_funcionarios: boolean;
  pode_gerenciar_categorias: boolean;
  pode_acessar_dashboard: boolean;
}

interface Funcionario {
  id: number;
  nome: string;
  email: string;
  role: string;
  usuario_id?: number;
  pode_criar_produtos?: boolean;
  pode_editar_produtos?: boolean;
  pode_deletar_produtos?: boolean;
  pode_gerenciar_estoque?: boolean;
  pode_upload_imagens?: boolean;
  pode_visualizar_pedidos?: boolean;
  pode_alterar_status_pedidos?: boolean;
  pode_cancelar_pedidos?: boolean;
  pode_adicionar_rastreio?: boolean;
  pode_visualizar_usuarios?: boolean;
  pode_gerenciar_funcionarios?: boolean;
  pode_gerenciar_categorias?: boolean;
  pode_acessar_dashboard?: boolean;
}

export default function FuncionariosPage() {
  return (
    <ProtegerRota permissoesRequeridas={['pode_gerenciar_funcionarios']}>
      <FuncionariosConteudo />
    </ProtegerRota>
  );
}

function FuncionariosConteudo() {
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const [permissoes, setPermissoes] = useState<Permissoes>({
    pode_criar_produtos: false,
    pode_editar_produtos: false,
    pode_deletar_produtos: false,
    pode_gerenciar_estoque: false,
    pode_upload_imagens: false,
    pode_visualizar_pedidos: true,
    pode_alterar_status_pedidos: false,
    pode_cancelar_pedidos: false,
    pode_adicionar_rastreio: false,
    pode_visualizar_usuarios: false,
    pode_gerenciar_funcionarios: false,
    pode_gerenciar_categorias: false,
    pode_acessar_dashboard: true,
  });

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/admin/funcionarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao carregar funcionários");

      const data = await response.json();
      setFuncionarios(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar funcionários");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNovo = () => {
    setEditMode(false);
    setFuncionarioSelecionado(null);
    setFormData({ nome: "", email: "", senha: "" });
    setPermissoes({
      pode_criar_produtos: false,
      pode_editar_produtos: false,
      pode_deletar_produtos: false,
      pode_gerenciar_estoque: false,
      pode_upload_imagens: false,
      pode_visualizar_pedidos: true,
      pode_alterar_status_pedidos: false,
      pode_cancelar_pedidos: false,
      pode_adicionar_rastreio: false,
      pode_visualizar_usuarios: false,
      pode_gerenciar_funcionarios: false,
      pode_gerenciar_categorias: false,
      pode_acessar_dashboard: true,
    });
    setShowModal(true);
  };

  const abrirModalEditar = (funcionario: Funcionario) => {
    setEditMode(true);
    setFuncionarioSelecionado(funcionario);
    setFormData({
      nome: funcionario.nome,
      email: funcionario.email,
      senha: "",
    });
    setPermissoes({
      pode_criar_produtos: funcionario.pode_criar_produtos || false,
      pode_editar_produtos: funcionario.pode_editar_produtos || false,
      pode_deletar_produtos: funcionario.pode_deletar_produtos || false,
      pode_gerenciar_estoque: funcionario.pode_gerenciar_estoque || false,
      pode_upload_imagens: funcionario.pode_upload_imagens || false,
      pode_visualizar_pedidos: funcionario.pode_visualizar_pedidos !== false,
      pode_alterar_status_pedidos: funcionario.pode_alterar_status_pedidos || false,
      pode_cancelar_pedidos: funcionario.pode_cancelar_pedidos || false,
      pode_adicionar_rastreio: funcionario.pode_adicionar_rastreio || false,
      pode_visualizar_usuarios: funcionario.pode_visualizar_usuarios || false,
      pode_gerenciar_funcionarios: funcionario.pode_gerenciar_funcionarios || false,
      pode_gerenciar_categorias: funcionario.pode_gerenciar_categorias || false,
      pode_acessar_dashboard: funcionario.pode_acessar_dashboard !== false,
    });
    setShowModal(true);
  };

  const salvarFuncionario = async () => {
    try {
      const token = localStorage.getItem("token");

      if (editMode && funcionarioSelecionado) {
        const response = await fetch(
          `${API_URL}/admin/funcionarios/${funcionarioSelecionado.id}/permissoes`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(permissoes),
          }
        );

        if (!response.ok) throw new Error("Erro ao atualizar permissões");
        
        mostrarToast("Permissões atualizadas com sucesso!");
      } else {
        if (!formData.nome || !formData.email || !formData.senha) {
          alert("Preencha todos os campos obrigatórios");
          return;
        }

        const response = await fetch(`${API_URL}/admin/funcionarios`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            permissoes,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Erro ao criar funcionário");
        }

        mostrarToast("Funcionário criado com sucesso!");
      }

      setShowModal(false);
      carregarFuncionarios();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erro ao salvar funcionário");
    }
  };

  const deletarFuncionario = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este funcionário?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/funcionarios/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao deletar funcionário");

      mostrarToast("Funcionário deletado com sucesso!");
      carregarFuncionarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar funcionário");
    }
  };

  const mostrarToast = (msg: string) => {
    const toast = document.createElement("div");
    toast.textContent = msg;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      font-weight: 500;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "10px" }}>
          <h1 style={{ color: "white", fontSize: "clamp(24px, 5vw, 32px)", margin: 0 }}>👥 Gerenciar Funcionários</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/admin/dashboard")}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              ← Voltar ao Dashboard
            </button>
            <button
              onClick={abrirModalNovo}
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              + Adicionar Funcionário
            </button>
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", overflowX: "auto" }}>
          {funcionarios.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>
              Nenhum funcionário cadastrado
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#374151", fontWeight: "600" }}>Nome</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#374151", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#374151", fontWeight: "600" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((func) => (
                  <tr key={func.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "12px", color: "#0a0a0a" }}>{func.nome}</td>
                    <td style={{ padding: "12px", color: "#0a0a0a" }}>{func.email}</td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => abrirModalEditar(func)}
                        style={{
                          background: "#3b82f6",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginRight: "8px",
                          fontSize: "13px",
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => deletarFuncionario(func.id)}
                        style={{
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "13px",
                        }}
                      >
                        🗑️ Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, color: "#0a0a0a", fontSize: "clamp(20px, 4vw, 24px)" }}>
              {editMode ? "✏️ Editar Permissões" : "➕ Novo Funcionário"}
            </h2>

            {!editMode && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0a0a0a" }}>
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#0a0a0a",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0a0a0a" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#0a0a0a",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#0a0a0a" }}>
                    Senha *
                  </label>
                  <input
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "#0a0a0a",
                    }}
                  />
                </div>
              </>
            )}

            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
              <h3 style={{ color: "#0a0a0a", fontSize: "18px", margin: 0 }}>
                🔐 Permissões
              </h3>
              
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    const todasMarcadas: any = {};
                    Object.keys(permissoes).forEach(key => {
                      todasMarcadas[key] = true;
                    });
                    setPermissoes(todasMarcadas);
                  }}
                  style={{
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500"
                  }}
                >
                  ✓ Marcar Todas
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    const todasDesmarcadas: any = {};
                    Object.keys(permissoes).forEach(key => {
                      todasDesmarcadas[key] = false;
                    });
                    setPermissoes(todasDesmarcadas);
                  }}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "500"
                  }}
                >
                  ✗ Desmarcar Todas
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
              {[
                { key: "pode_criar_produtos", label: "Criar produtos" },
                { key: "pode_editar_produtos", label: "Editar produtos" },
                { key: "pode_deletar_produtos", label: "Deletar produtos" },
                { key: "pode_gerenciar_estoque", label: "Gerenciar estoque" },
                { key: "pode_upload_imagens", label: "Upload de imagens" },
                { key: "pode_visualizar_pedidos", label: "Visualizar pedidos" },
                { key: "pode_alterar_status_pedidos", label: "Alterar status de pedidos" },
                { key: "pode_cancelar_pedidos", label: "Cancelar pedidos" },
                { key: "pode_adicionar_rastreio", label: "Adicionar código de rastreio" },
                { key: "pode_visualizar_usuarios", label: "Visualizar usuários" },
                { key: "pode_gerenciar_funcionarios", label: "Gerenciar funcionários" },
                { key: "pode_gerenciar_categorias", label: "Gerenciar categorias" },
                { key: "pode_acessar_dashboard", label: "Acessar dashboard" },
              ].map((perm) => (
                <label
                  key={perm.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "8px",
                    background: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={permissoes[perm.key as keyof Permissoes]}
                    onChange={(e) =>
                      setPermissoes({ ...permissoes, [perm.key]: e.target.checked })
                    }
                    style={{ marginRight: "8px", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "14px", color: "#0a0a0a" }}>{perm.label}</span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarFuncionario}
                style={{
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                {editMode ? "Salvar Permissões" : "Criar Funcionário"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
