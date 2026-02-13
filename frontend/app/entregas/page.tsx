import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function EntregasPage() {
  return (
    <LayoutInstitucional titulo="Política de Entrega">
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
            🚚 Entregamos para todo o Brasil com segurança e rapidez!
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            📍 Regiões Atendidas
          </h2>
          <p style={{ marginBottom: "16px", lineHeight: 1.7 }}>
            Realizamos entregas para <strong>todo o território nacional</strong> através dos Correios (PAC e SEDEX).
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            ⏱️ Prazos de Entrega
          </h2>
          <p style={{ marginBottom: "12px" }}>Os prazos variam de acordo com sua localização:</p>
          
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "12px"
          }}>
            <div style={{
              background: "#f3f4f6",
              padding: "clamp(12px, 3vw, 16px)",
              borderRadius: "clamp(8px, 2vw, 10px)",
              border: "1px solid #e5e7eb"
            }}>
              <strong style={{ color: "#667eea" }}>📦 Região Sudeste:</strong>
              <p style={{ marginTop: "6px", fontSize: "clamp(13px, 3.2vw, 15px)" }}>
                3 a 7 dias úteis após aprovação do pagamento
              </p>
            </div>

            <div style={{
              background: "#f3f4f6",
              padding: "clamp(12px, 3vw, 16px)",
              borderRadius: "clamp(8px, 2vw, 10px)",
              border: "1px solid #e5e7eb"
            }}>
              <strong style={{ color: "#764ba2" }}>📦 Região Sul:</strong>
              <p style={{ marginTop: "6px", fontSize: "clamp(13px, 3.2vw, 15px)" }}>
                5 a 10 dias úteis após aprovação do pagamento
              </p>
            </div>

            <div style={{
              background: "#f3f4f6",
              padding: "clamp(12px, 3vw, 16px)",
              borderRadius: "clamp(8px, 2vw, 10px)",
              border: "1px solid #e5e7eb"
            }}>
              <strong style={{ color: "#10b981" }}>📦 Demais Regiões:</strong>
              <p style={{ marginTop: "6px", fontSize: "clamp(13px, 3.2vw, 15px)" }}>
                7 a 15 dias úteis após aprovação do pagamento
              </p>
            </div>
          </div>

          <p style={{ 
            marginTop: "16px", 
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280",
            lineHeight: 1.7 
          }}>
            <strong>Importante:</strong> O prazo exato é calculado automaticamente no checkout de acordo com seu CEP.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            💵 Frete
          </h2>
          <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
            O valor do frete é calculado com base no <strong>peso</strong>, <strong>dimensões</strong> do produto e <strong>CEP de destino</strong>.
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.7
          }}>
            <li>Você visualiza o valor exato antes de finalizar a compra</li>
            <li>Trabalhamos com os melhores preços dos Correios</li>
            <li>Embalamos com cuidado para garantir que seu produto chegue perfeito</li>
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
            🎉 Frete Grátis
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#78350f",
            lineHeight: 1.7
          }}>
            Fique de olho! Frequentemente oferecemos <strong>frete grátis</strong> em compras acima de determinado valor. 
            Acompanhe nossas promoções na página inicial!
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            📦 Processamento do Pedido
          </h2>
          <ol style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            <li><strong>Confirmação do Pagamento:</strong> Até 2 dias úteis (PIX é instantâneo)</li>
            <li><strong>Separação e Embalagem:</strong> 1 a 2 dias úteis</li>
            <li><strong>Postagem:</strong> Após embalagem, o produto é enviado imediatamente</li>
            <li><strong>Código de Rastreamento:</strong> Você recebe por e-mail assim que postado</li>
          </ol>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            🔍 Rastreamento
          </h2>
          <p style={{ lineHeight: 1.7 }}>
            Assim que seu pedido for postado, você receberá por e-mail o <strong>código de rastreamento</strong>.
            Com ele, você pode acompanhar a entrega em tempo real através do site dos Correios:
          </p>
          <p style={{ 
            marginTop: "12px",
            fontSize: "clamp(13px, 3.2vw, 15px)"
          }}>
            🔗 <a href="https://rastreamento.correios.com.br" target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "underline", fontWeight: "600" }}>
              rastreamento.correios.com.br
            </a>
          </p>
          <p style={{ 
            marginTop: "12px",
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280",
            lineHeight: 1.7
          }}>
            Você também pode acompanhar seu pedido pela página <a href="/meus-pedidos" style={{ color: "#667eea", textDecoration: "underline", fontWeight: "600" }}>Meus Pedidos</a>.
          </p>
        </section>

        <section style={{
          background: "#fee2e2",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "2px solid #ef4444"
        }}>
          <h2 style={{ 
            fontSize: "clamp(16px, 4vw, 20px)", 
            fontWeight: "700", 
            color: "#991b1b",
            marginBottom: "12px" 
          }}>
            ⚠️ Problemas na Entrega?
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#7f1d1d",
            lineHeight: 1.7,
            marginBottom: "12px"
          }}>
            Se o prazo de entrega ultrapassou o previsto ou houve algum problema:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            fontSize: "clamp(13px, 3.2vw, 15px)",
            color: "#7f1d1d",
            lineHeight: 1.7
          }}>
            <li>Entre em contato conosco imediatamente</li>
            <li>Telefone: <strong>31 - 3831-0866</strong></li>
            <li>E-mail: <strong>contato@emporiobothanico.com.br</strong></li>
            <li>Vamos resolver o mais rápido possível!</li>
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
            💬 Dúvidas sobre Entrega?
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#047857",
            lineHeight: 1.7
          }}>
            Nossa equipe está pronta para ajudar! Entre em contato através da 
            <a href="/contato" style={{ color: "#667eea", textDecoration: "underline", fontWeight: "600" }}> página de contato</a>.
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
