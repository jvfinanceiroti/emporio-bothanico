"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";

export default function AdminUsuarios() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    }
  }, []);

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
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>👥</div>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "16px"
          }}>
            Gerenciamento de Usuários
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            marginBottom: "32px"
          }}>
            Esta funcionalidade será implementada em breve.
          </p>
          <p style={{
            fontSize: "14px",
            color: "#9ca3af"
          }}>
            Aqui você poderá gerenciar usuários administradores e clientes do sistema.
          </p>
        </div>
      </div>
    </div>
  );
}
