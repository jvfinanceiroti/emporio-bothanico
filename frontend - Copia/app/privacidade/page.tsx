"use client";

import Link from "next/link";

export default function PrivacidadePage() {
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

      <div style={{ maxWidth: "900px", margin: "80px auto", padding: "0 48px 80px" }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "900",
          color: "#0a0a0a",
          marginBottom: "24px",
          letterSpacing: "-1.5px"
        }}>
          Política de Privacidade
        </h1>

        <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "48px" }}>
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            1. Informações que Coletamos
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "16px" }}>
            Coletamos informações que você nos fornece diretamente ao:
          </p>
          <ul style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px", marginBottom: "32px" }}>
            <li style={{ marginBottom: "8px" }}>Criar uma conta ou fazer um pedido</li>
            <li style={{ marginBottom: "8px" }}>Entrar em contato com nosso suporte</li>
            <li style={{ marginBottom: "8px" }}>Se inscrever na nossa newsletter</li>
            <li style={{ marginBottom: "8px" }}>Participar de promoções ou pesquisas</li>
          </ul>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
            Dados Pessoais
          </h3>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8" }}>
            Nome, e-mail, telefone, endereço de entrega, CPF e informações de pagamento.
          </p>
        </div>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            2. Como Usamos suas Informações
          </h2>
          <ul style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "12px" }}>Processar e entregar seus pedidos</li>
            <li style={{ marginBottom: "12px" }}>Enviar confirmações e atualizações de pedidos</li>
            <li style={{ marginBottom: "12px" }}>Responder suas dúvidas e solicitações</li>
            <li style={{ marginBottom: "12px" }}>Melhorar nossos produtos e serviços</li>
            <li style={{ marginBottom: "12px" }}>Enviar ofertas e novidades (com seu consentimento)</li>
            <li style={{ marginBottom: "12px" }}>Prevenir fraudes e proteger a segurança</li>
          </ul>
        </div>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            3. Compartilhamento de Dados
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "16px" }}>
            Não vendemos suas informações pessoais. Compartilhamos apenas quando necessário:
          </p>
          <ul style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "12px" }}><strong>Transportadoras:</strong> para entrega dos pedidos</li>
            <li style={{ marginBottom: "12px" }}><strong>Processadores de pagamento:</strong> para transações seguras</li>
            <li style={{ marginBottom: "12px" }}><strong>Serviços de marketing:</strong> com seu consentimento</li>
            <li style={{ marginBottom: "12px" }}><strong>Autoridades legais:</strong> quando exigido por lei</li>
          </ul>
        </div>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            4. Seus Direitos (LGPD)
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "16px" }}>
            De acordo com a Lei Geral de Proteção de Dados, você tem direito a:
          </p>
          <ul style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", paddingLeft: "24px" }}>
            <li style={{ marginBottom: "12px" }}>Confirmar a existência de tratamento de dados</li>
            <li style={{ marginBottom: "12px" }}>Acessar seus dados pessoais</li>
            <li style={{ marginBottom: "12px" }}>Corrigir dados incompletos ou desatualizados</li>
            <li style={{ marginBottom: "12px" }}>Solicitar a exclusão de seus dados</li>
            <li style={{ marginBottom: "12px" }}>Revogar o consentimento</li>
            <li style={{ marginBottom: "12px" }}>Portabilidade dos dados</li>
          </ul>
        </div>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            5. Segurança
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8" }}>
            Utilizamos medidas de segurança técnicas e organizacionais para proteger seus dados, incluindo:
            criptografia SSL, servidores seguros, controle de acesso e monitoramento constante.
          </p>
        </div>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>
            6. Contato
          </h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8", marginBottom: "16px" }}>
            Para exercer seus direitos ou tirar dúvidas sobre esta política:
          </p>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.8" }}>
            📧 E-mail: <strong>contato@emporiobothanico.com.br</strong><br/>
            📱 WhatsApp: <strong>(11) 99999-9999</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
