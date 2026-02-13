"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

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
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "15px"
        }}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={{ height: "50px", objectFit: "contain" }}
          />
          <h1 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1f2937",
            margin: 0
          }}>
            Painel Admin
          </h1>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#dc2626"}
          onMouseOut={(e) => e.currentTarget.style.background = "#ef4444"}
        >
          Sair
        </button>
      </div>

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 40px 20px"
      }}>
        <nav style={{
          display: "flex",
          gap: "10px",
          borderBottom: "2px solid #e5e7eb"
        }}>
          <MenuLink
            href="/admin/dashboard"
            label="📊 Dashboard"
            ativo={menuAtivo === "dashboard"}
          />

          <MenuLink
            href="/admin/produtos"
            label="📦 Produtos"
            ativo={menuAtivo === "produtos"}
          />

          <MenuLink
            href="/admin/pedidos"
            label="🛒 Pedidos"
            ativo={menuAtivo === "pedidos"}
          />

          <MenuLink
            href="/admin/usuarios"
            label="👥 Usuários"
            ativo={menuAtivo === "usuarios"}
          />
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
        padding: "12px 24px",
        color: ativo ? "#667eea" : "#6b7280",
        fontWeight: "600",
        borderBottom: ativo ? "3px solid #667eea" : "3px solid transparent",
        transition: "all 0.2s",
        background: ativo ? "rgba(102, 126, 234, 0.1)" : "transparent",
        borderRadius: "8px 8px 0 0"
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
