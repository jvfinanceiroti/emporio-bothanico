import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function ContatoPage() {
  return (
    <LayoutInstitucional titulo="Contato">
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 5vw, 32px)" }}>
        <section>
          <p style={{ 
            fontSize: "clamp(15px, 3.8vw, 17px)", 
            marginBottom: "clamp(16px, 4vw, 24px)",
            color: "#4b5563" 
          }}>
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo:
          </p>
        </section>

        <section style={{
          background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
          padding: "clamp(20px, 5vw, 32px)",
          borderRadius: "clamp(12px, 3vw, 16px)",
          border: "2px solid #667eea20"
        }}>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 22px)", 
            fontWeight: "700", 
            color: "#667eea",
            marginBottom: "clamp(16px, 4vw, 20px)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📞 Telefone
          </h2>
          <p style={{ 
            fontSize: "clamp(16px, 4vw, 20px)",
            fontWeight: "600",
            color: "#1f2937"
          }}>
            31 - 3831-0866
          </p>
          <p style={{ 
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280",
            marginTop: "8px"
          }}>
            Horário de atendimento: Segunda a Sexta, 9h às 18h
          </p>
        </section>

        <section style={{
          background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
          padding: "clamp(20px, 5vw, 32px)",
          borderRadius: "clamp(12px, 3vw, 16px)",
          border: "2px solid #764ba220"
        }}>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 22px)", 
            fontWeight: "700", 
            color: "#764ba2",
            marginBottom: "clamp(16px, 4vw, 20px)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📧 E-mail
          </h2>
          <p style={{ 
            fontSize: "clamp(16px, 4vw, 20px)",
            fontWeight: "600",
            color: "#1f2937",
            wordBreak: "break-word"
          }}>
            contato@emporiobothanico.com.br
          </p>
          <p style={{ 
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280",
            marginTop: "8px"
          }}>
            Respondemos em até 24 horas úteis
          </p>
        </section>

        <section style={{
          background: "linear-gradient(135deg, #f3f4f6, #e5e7eb)",
          padding: "clamp(20px, 5vw, 32px)",
          borderRadius: "clamp(12px, 3vw, 16px)",
          border: "2px solid #10b98120"
        }}>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 22px)", 
            fontWeight: "700", 
            color: "#10b981",
            marginBottom: "clamp(16px, 4vw, 20px)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            💬 WhatsApp
          </h2>
          <p style={{ 
            fontSize: "clamp(16px, 4vw, 20px)",
            fontWeight: "600",
            color: "#1f2937"
          }}>
            (31) 98765-4321
          </p>
          <p style={{ 
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280",
            marginTop: "8px"
          }}>
            Atendimento rápido via WhatsApp
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            🏢 Endereço
          </h2>
          <p style={{ lineHeight: 1.8 }}>
            <strong>LAMBARI PERFUMARIA LTDA - ME</strong><br />
            CNPJ: 04.280.033/0001-93
          </p>
        </section>

        <section style={{
          background: "#fef3c7",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(8px, 2vw, 12px)",
          border: "2px solid #fbbf24"
        }}>
          <p style={{ 
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#92400e",
            fontWeight: "500"
          }}>
            💡 <strong>Dica:</strong> Para acompanhar seu pedido, acesse a página <a href="/meus-pedidos" style={{ color: "#667eea", textDecoration: "underline" }}>Meus Pedidos</a>
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
