import LayoutInstitucional from "@/components/LayoutInstitucional";
import Link from "next/link";

export default function TrocasPage() {
  return (
    <LayoutInstitucional titulo="Trocas e Devoluções">
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(20px, 5vw, 32px)" }}>
        <section style={{
          background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
          padding: "clamp(16px, 4vw, 24px)",
          borderRadius: "clamp(12px, 3vw, 16px)",
          border: "2px solid #3b82f6"
        }}>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#1e40af",
            fontWeight: "500",
            lineHeight: 1.7
          }}>
            ♻️ Sua satisfação é nossa prioridade! Confira nossa política de trocas e devoluções.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            📅 Prazo para Troca ou Devolução
          </h2>
          <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>
            Você tem até <strong>7 dias corridos</strong> após o recebimento do produto para solicitar troca ou devolução, 
            conforme o Código de Defesa do Consumidor (Art. 49).
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            ✅ Condições para Troca/Devolução
          </h2>
          <p style={{ marginBottom: "12px" }}>Para realizar troca ou devolução, o produto deve:</p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <li>Estar <strong>sem uso</strong> e na embalagem original</li>
            <li>Conter todas as <strong>etiquetas e lacres</strong> intactos</li>
            <li>Incluir a <strong>nota fiscal</strong> original</li>
            <li>Não apresentar sinais de <strong>violação ou uso inadequado</strong></li>
          </ul>
        </section>

        <section style={{
          background: "#fef3c7",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "2px solid #fbbf24"
        }}>
          <h2 style={{ 
            fontSize: "clamp(16px, 4vw, 20px)", 
            fontWeight: "700", 
            color: "#92400e",
            marginBottom: "12px" 
          }}>
            ⚠️ Importante
          </h2>
          <p style={{ 
            fontSize: "clamp(13px, 3.2vw, 15px)",
            color: "#78350f",
            lineHeight: 1.7
          }}>
            Por questões de higiene e segurança, <strong>não aceitamos trocas ou devoluções</strong> de produtos que apresentem 
            sinais de uso, embalagem violada ou sem lacre original. Perfumes abertos também não podem ser trocados.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            📝 Como Solicitar Troca ou Devolução
          </h2>
          <ol style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <li>
              <strong>Entre em contato conosco:</strong>
              <ul style={{ paddingLeft: "20px", marginTop: "8px" }}>
                <li>Telefone: <strong>31 - 3831-0866</strong></li>
                <li>E-mail: <strong>contato@emporiobothanico.com.br</strong></li>
                <li>WhatsApp: <strong>(31) 98765-4321</strong></li>
              </ul>
            </li>
            <li><strong>Informe:</strong> Número do pedido, motivo da troca/devolução e fotos do produto (se aplicável)</li>
            <li><strong>Aguarde:</strong> Nossa equipe analisará sua solicitação em até 24h úteis</li>
            <li><strong>Envio:</strong> Após aprovação, você receberá instruções de envio (postagem via Correios)</li>
            <li><strong>Processamento:</strong> Após recebermos o produto, faremos a análise em até 5 dias úteis</li>
          </ol>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            💰 Reembolso
          </h2>
          <p style={{ lineHeight: 1.7 }}>
            Em caso de devolução aprovada, o reembolso será realizado em até <strong>10 dias úteis</strong> após a análise do produto, 
            utilizando a mesma forma de pagamento original.
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            marginTop: "12px",
            lineHeight: 1.7
          }}>
            <li><strong>Cartão de Crédito:</strong> Estorno na próxima fatura</li>
            <li><strong>PIX/Boleto:</strong> Depósito em conta bancária informada</li>
          </ul>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            📦 Produto com Defeito ou Avariado
          </h2>
          <p style={{ lineHeight: 1.7 }}>
            Se você recebeu um produto com defeito, avaria no transporte ou divergente do pedido, entre em contato imediatamente:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            marginTop: "12px",
            lineHeight: 1.7
          }}>
            <li>Tire fotos do produto e da embalagem</li>
            <li>Entre em contato em até <strong>48 horas</strong> após o recebimento</li>
            <li>Nestes casos, <strong>o frete de devolução é por nossa conta</strong></li>
          </ul>
        </section>

        <section style={{
          background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
          padding: "clamp(20px, 5vw, 28px)",
          borderRadius: "clamp(12px, 3vw, 16px)",
          border: "2px solid #10b981",
          marginTop: "clamp(20px, 5vw, 32px)"
        }}>
          <h2 style={{ 
            fontSize: "clamp(16px, 4vw, 20px)", 
            fontWeight: "700", 
            color: "#065f46",
            marginBottom: "12px"
          }}>
            💬 Dúvidas?
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#047857",
            lineHeight: 1.7
          }}>
            Nossa equipe está à disposição para esclarecer qualquer dúvida sobre trocas e devoluções. 
            Entre em contato através da <Link href="/contato" className="store-link">página de contato</Link>.
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
