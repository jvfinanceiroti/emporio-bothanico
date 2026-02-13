"use client";

import Link from "next/link";

export default function EntregasPage() {
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
          Política de Entrega
        </h1>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            Prazos de Entrega
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "24px" }}>
            Os prazos começam a contar após a confirmação do pagamento e variam conforme a região:
          </p>

          <div style={{
            display: "grid",
            gap: "16px",
            marginBottom: "32px"
          }}>
            {[
              { regiao: "Sul e Sudeste", prazo: "5 a 7 dias úteis" },
              { regiao: "Centro-Oeste", prazo: "7 a 10 dias úteis" },
              { regiao: "Nordeste", prazo: "8 a 12 dias úteis" },
              { regiao: "Norte", prazo: "10 a 15 dias úteis" }
            ].map((item, i) => (
              <div key={i} style={{
                padding: "20px",
                background: "#fafafa",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#0a0a0a" }}>
                  {item.regiao}
                </span>
                <span style={{ fontSize: "16px", color: "#666", fontWeight: "600" }}>
                  {item.prazo}
                </span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginTop: "32px", marginBottom: "16px" }}>
            Cálculo do Frete
          </h3>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "16px" }}>
            O valor do frete é calculado automaticamente no checkout com base em:
          </p>
          <ul style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px", marginBottom: "32px" }}>
            <li style={{ marginBottom: "8px" }}>CEP de destino</li>
            <li style={{ marginBottom: "8px" }}>Peso total dos produtos</li>
            <li style={{ marginBottom: "8px" }}>Dimensões da embalagem</li>
          </ul>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginTop: "32px", marginBottom: "16px" }}>
            Rastreamento
          </h3>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8" }}>
            Após o envio, você receberá por e-mail o código de rastreamento dos Correios. 
            Acompanhe sua entrega em: <a href="https://rastreamento.correios.com.br" target="_blank" style={{ color: "#0a0a0a", fontWeight: "700" }}>rastreamento.correios.com.br</a>
          </p>

          <div style={{
            background: "#e6f7ff",
            border: "1px solid #91d5ff",
            borderRadius: "16px",
            padding: "24px",
            marginTop: "32px"
          }}>
            <h4 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#0a0a0a" }}>
              📦 Importante
            </h4>
            <ul style={{ fontSize: "14px", color: "#666", lineHeight: "1.7", paddingLeft: "20px" }}>
              <li>Confira os dados de entrega antes de finalizar o pedido</li>
              <li>Mantenha alguém disponível no endereço para receber</li>
              <li>Em caso de ausência, os Correios deixarão aviso para retirada</li>
              <li>Inspecione a embalagem antes de assinar o recebimento</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
