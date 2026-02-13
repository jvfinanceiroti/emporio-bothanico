"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface LayoutInstitucionalProps {
  titulo: string;
  children: ReactNode;
}

export default function LayoutInstitucional({ titulo, children }: LayoutInstitucionalProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "clamp(16px, 4vw, 24px)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "clamp(12px, 3vw, 20px)",
        padding: "clamp(16px, 4vw, 24px)",
        marginBottom: "clamp(16px, 4vw, 24px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "clamp(12px, 3vw, 16px)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <Link href="/" style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 2vw, 12px)"
          }}>
            <span style={{
              fontSize: "clamp(24px, 6vw, 32px)",
              fontWeight: "800",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Empório Botânico
            </span>
          </Link>

          <Link href="/" style={{
            textDecoration: "none",
            padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px)",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            borderRadius: "clamp(8px, 2vw, 12px)",
            fontSize: "clamp(13px, 3.2vw, 15px)",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            whiteSpace: "nowrap"
          }}>
            ← Voltar à Loja
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main style={{
        background: "rgba(255, 255, 255, 0.98)",
        borderRadius: "clamp(12px, 3vw, 20px)",
        padding: "clamp(20px, 5vw, 40px)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h1 style={{
          fontSize: "clamp(24px, 6vw, 36px)",
          fontWeight: "800",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "clamp(20px, 5vw, 32px)",
          lineHeight: 1.2,
          wordBreak: "break-word"
        }}>
          {titulo}
        </h1>

        <div style={{
          fontSize: "clamp(14px, 3.5vw, 16px)",
          lineHeight: 1.7,
          color: "#374151"
        }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: "clamp(24px, 6vw, 40px)",
        padding: "clamp(20px, 5vw, 32px)",
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "clamp(12px, 3vw, 20px)",
        textAlign: "center",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "clamp(12px, 3vw, 24px)",
          marginBottom: "clamp(16px, 4vw, 24px)",
          fontSize: "clamp(12px, 3vw, 14px)"
        }}>
          <Link href="/produtos" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Produtos
          </Link>
          <Link href="/sobre" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Sobre Nós
          </Link>
          <Link href="/contato" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Contato
          </Link>
          <Link href="/ajuda" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Ajuda
          </Link>
          <Link href="/trocas" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Trocas
          </Link>
          <Link href="/entregas" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Entregas
          </Link>
          <Link href="/privacidade" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
            Privacidade
          </Link>
        </div>

        <div style={{
          fontSize: "clamp(11px, 2.8vw, 13px)",
          color: "#6b7280",
          lineHeight: 1.6
        }}>
          <p style={{ margin: "8px 0" }}>
            CNPJ 04.280.033/0001-93 | LAMBARI PERFUMARIA LTDA - ME
          </p>
          <p style={{ margin: "8px 0" }}>
            Tel: 31 - 3831-0866
          </p>
          <p style={{ margin: "8px 0" }}>
            © 2026 Empório Botânico. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
