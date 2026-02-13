"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { usePermissoes } from "@/lib/usePermissoes";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { permissoes, temPermissao, isAdmin } = usePermissoes();
  const [nomeUsuario, setNomeUsuario] = useState("");

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      try {
        const usuario = JSON.parse(usuarioStr);
        // Se conseguiu parsear, verifica se tem a estrutura correta
        if (typeof usuario === 'object' && usuario !== null) {
          setNomeUsuario(usuario.nome || usuario.email || "Usuário");
        } else {
          // Formato antigo (string pura), força logout
          console.warn("Formato de usuário desatualizado, fazendo logout...");
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          router.push("/admin/login");
        }
      } catch (error) {
        // Falha no parse = formato antigo, força logout
        console.warn("Formato de usuário inválido, fazendo logout...");
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        router.push("/admin/login");
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/admin/login");
  };

  const getMenuAtivo = () => {
    if (pathname?.includes("/dashboard")) return "dashboard";
    if (pathname?.includes("/produtos")) return "produtos";
    if (pathname?.includes("/pedidos")) return "pedidos";
    if (pathname?.includes("/usuarios")) return "usuarios";
    if (pathname?.includes("/funcionarios")) return "funcionarios";
    return "";
  };

  const menuAtivo = getMenuAtivo();

  return (
    <div style={{
      background: "rgba(255,255,255,0.98)",
      borderBottom: "1px solid #e5e7eb",
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(12px, 3vw, 20px) clamp(16px, 4vw, 40px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "clamp(12px, 3vw, 16px)",
        flexWrap: "wrap"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 2vw, 15px)",
          flexShrink: 0,
          minWidth: "min(200px, 100%)"
        }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ 
              height: "clamp(40px, 10vw, 50px)", 
              objectFit: "contain",
              flexShrink: 0
            }}
          />
          <div>
            <h1 style={{
              fontSize: "clamp(16px, 4vw, 24px)",
              fontWeight: "700",
              color: "#1f2937",
              margin: 0,
              whiteSpace: "nowrap"
            }}>
              Painel Admin
            </h1>
            <p style={{
              fontSize: "clamp(11px, 2.8vw, 13px)",
              color: "#667eea",
              margin: 0,
              marginTop: "4px",
              fontWeight: "600"
            }}>
              {nomeUsuario ? (
                <>
                  {isAdmin() ? "👑" : "👤"} Olá, <strong>{nomeUsuario}</strong>
                </>
              ) : (
                "Carregando..."
              )}
            </p>
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(12px, 3vw, 16px)",
          flexWrap: "wrap"
        }}>
          <button
            onClick={handleLogout}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 24px)",
              borderRadius: "clamp(6px, 1.5vw, 8px)",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "clamp(12px, 3vw, 14px)",
              transition: "all 0.2s",
              minHeight: "44px",
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
            onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
          >
            Sair
          </button>
        </div>
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 clamp(16px, 4vw, 40px) clamp(12px, 3vw, 20px)"
      }}>
        <nav style={{
          display: "flex",
          gap: "clamp(4px, 1vw, 10px)",
          borderBottom: "2px solid #e5e7eb",
          overflowX: "auto",
          overflowY: "hidden",
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch"
        }}>
          {temPermissao('pode_acessar_dashboard') && (
            <MenuLink
              href="/admin/dashboard"
              label="📊 Dashboard"
              ativo={menuAtivo === "dashboard"}
            />
          )}

          {(temPermissao('pode_editar_produtos') || temPermissao('pode_criar_produtos')) && (
            <MenuLink
              href="/admin/produtos"
              label="📦 Produtos"
              ativo={menuAtivo === "produtos"}
            />
          )}

          {temPermissao('pode_visualizar_pedidos') && (
            <MenuLink
              href="/admin/pedidos"
              label="🛒 Pedidos"
              ativo={menuAtivo === "pedidos"}
            />
          )}

          {temPermissao('pode_visualizar_usuarios') && (
            <MenuLink
              href="/admin/usuarios"
              label="👥 Usuários"
              ativo={menuAtivo === "usuarios"}
            />
          )}

          {temPermissao('pode_gerenciar_funcionarios') && (
            <MenuLink
              href="/admin/funcionarios"
              label="👔 Funcionários"
              ativo={menuAtivo === "funcionarios"}
            />
          )}
        </nav>
      </div>
    </div>
  );
}

function MenuLink({ href, label, ativo }: { href: string; label: string; ativo: boolean }) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        padding: "clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 24px)",
        color: ativo ? "#667eea" : "#6b7280",
        fontWeight: "600",
        fontSize: "clamp(12px, 3vw, 14px)",
        borderBottom: ativo ? "3px solid #667eea" : "3px solid transparent",
        transition: "all 0.2s",
        background: ativo ? "rgba(102, 126, 234, 0.1)" : "transparent",
        borderRadius: "clamp(6px, 1.5vw, 8px) clamp(6px, 1.5vw, 8px) 0 0",
        whiteSpace: "nowrap",
        flexShrink: 0,
        minHeight: "44px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onMouseOver={(e) => {
        if (!ativo) {
          e.currentTarget.style.color = "#667eea";
          e.currentTarget.style.background = "rgba(102, 126, 234, 0.1)";
        }
      }}
      onMouseOut={(e) => {
        if (!ativo) {
          e.currentTarget.style.color = "#6b7280";
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {label}
    </Link>
  );
}
