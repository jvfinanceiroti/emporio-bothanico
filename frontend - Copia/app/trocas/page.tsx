"use client";

import Link from "next/link";

export default function TrocasPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <header style={{
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "24px 48px"
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href="/"><img src="/logo.png" alt="Logo" style={{ height: "48px" }} /></Link>
          <Link href="/" style={{ color: "#0a0a0a", textDecoration: "none", fontSize: "15px", fontWeight: "600" }}>
            ← Voltar para loja
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "900px", margin: "80px auto", padding: "0 48px" }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "900",
          color: "#0a0a0a",
          marginBottom: "24px",
          letterSpacing: "-1.5px"
        }}>
          Trocas e Devoluções
        </h1>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            Direito de Arrependimento
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "16px" }}>
            De acordo com o Código de Defesa do Consumidor (Lei nº 8.078/90), você tem até <strong>7 dias corridos</strong> após o recebimento do produto para solicitar troca ou devolução, sem necessidade de justificativa.
          </p>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginTop: "32px", marginBottom: "16px" }}>
            Como Solicitar
          </h3>
          <ol style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "12px" }}>Entre em contato conosco através do e-mail <strong>contato@emporiobothanico.com.br</strong> ou WhatsApp</li>
            <li style={{ marginBottom: "12px" }}>Informe o número do pedido e o motivo da troca/devolução</li>
            <li style={{ marginBottom: "12px" }}>Aguarde nossas instruções para envio</li>
            <li style={{ marginBottom: "12px" }}>Embale o produto adequadamente com nota fiscal</li>
            <li style={{ marginBottom: "12px" }}>Envie para o endereço indicado</li>
          </ol>

          <div style={{
            background: "#fff9e6",
            border: "1px solid #ffd966",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "32px"
          }}>
            <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#0a0a0a" }}>
              ⚠️ Condições Importantes
            </h4>
            <ul style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", paddingLeft: "20px" }}>
              <li>O produto deve estar em perfeitas condições, sem sinais de uso</li>
              <li>Mantenha embalagem original, etiquetas e acessórios</li>
              <li>Produtos violados, danificados ou personalizados não podem ser trocados</li>
              <li>O frete de devolução é por conta do cliente, exceto em caso de defeito</li>
            </ul>
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginTop: "40px", marginBottom: "16px" }}>
            Prazos
          </h3>
          <ul style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "12px" }}><strong>Análise:</strong> até 5 dias úteis após recebermos o produto</li>
            <li style={{ marginBottom: "12px" }}><strong>Reembolso:</strong> até 10 dias úteis após aprovação</li>
            <li style={{ marginBottom: "12px" }}><strong>Troca:</strong> até 15 dias úteis para novo envio</li>
          </ul>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          borderRadius: "24px",
          padding: "48px",
          color: "white",
          textAlign: "center"
        }}>
          <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "16px" }}>
            Precisa de Ajuda?
          </h2>
          <p style={{ fontSize: "16px", color: "#ccc", marginBottom: "32px" }}>
            Nossa equipe está pronta para ajudar você com trocas e devoluções.
          </p>
          <Link
            href="/contato"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              background: "white",
              color: "#0a0a0a",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
