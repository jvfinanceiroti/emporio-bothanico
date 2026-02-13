"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

export default function AdminDashboard() {
  const router = useRouter();
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch(`${API_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setDados(data))
      .catch(err => console.error(err));
  }, []);

  if (!dados) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      }}>
        <div style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
        }}>
          Carregando...
        </div>
      </div>
    );
  }

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
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}>
          <StatCard
            icon="💰"
            title="Total em Vendas"
            value={`R$ ${Number(dados.totalVendas).toFixed(2)}`}
            color="#10b981"
            bgColor="rgba(16, 185, 129, 0.1)"
          />
          
          <StatCard
            icon="📦"
            title="Total de Pedidos"
            value={dados.totalPedidos}
            color="#3b82f6"
            bgColor="rgba(59, 130, 246, 0.1)"
          />

          <StatCard
            icon="🔥"
            title="Pedidos Hoje"
            value={dados.pedidosHoje}
            color="#f59e0b"
            bgColor="rgba(245, 158, 11, 0.1)"
          />

          <StatCard
            icon="💳"
            title="Ticket Médio"
            value={`R$ ${Number(dados.ticketMedio).toFixed(2)}`}
            color="#8b5cf6"
            bgColor="rgba(139, 92, 246, 0.1)"
          />
        </div>

        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "24px"
          }}>
            Ações Rápidas
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px"
          }}>
            <ActionButton
              href="/admin/produtos"
              icon="➕"
              title="Adicionar Produto"
              description="Cadastre novos produtos"
              color="#10b981"
            />

            <ActionButton
              href="/admin/produtos"
              icon="📝"
              title="Gerenciar Produtos"
              description="Edite e organize produtos"
              color="#3b82f6"
            />

            <ActionButton
              href="/admin/pedidos"
              icon="🛒"
              title="Ver Pedidos"
              description="Gerencie pedidos realizados"
              color="#f59e0b"
            />

            <ActionButton
              href="/admin/usuarios"
              icon="👥"
              title="Ver Usuários"
              description="Administre usuários do sistema"
              color="#8b5cf6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color, bgColor }: any) {
  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "28px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      border: `2px solid ${bgColor}`,
      transition: "all 0.3s"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
    }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px"
      }}>
        <div style={{
          fontSize: "40px",
          background: bgColor,
          width: "70px",
          height: "70px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {icon}
        </div>
        
        <div>
          <h3 style={{
            color: "#6b7280",
            fontSize: "14px",
            fontWeight: "600",
            margin: 0,
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            {title}
          </h3>
          <p style={{
            color: color,
            fontSize: "32px",
            fontWeight: "800",
            margin: 0
          }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ href, icon, title, description, color }: any) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        background: "linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)",
        border: "2px solid #e5e7eb",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "all 0.3s",
        cursor: "pointer"
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 10px 25px ${color}30`;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "#e5e7eb";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{
        fontSize: "36px",
        background: `${color}15`,
        width: "60px",
        height: "60px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {icon}
      </div>
      
      <div>
        <h4 style={{
          color: "#1f2937",
          fontSize: "16px",
          fontWeight: "700",
          margin: 0,
          marginBottom: "4px"
        }}>
          {title}
        </h4>
        <p style={{
          color: "#6b7280",
          fontSize: "13px",
          margin: 0
        }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
