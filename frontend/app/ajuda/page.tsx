import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function AjudaPage() {
  return (
    <LayoutInstitucional titulo="Central de Ajuda">
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
            fontWeight: "500"
          }}>
            📚 Encontre respostas rápidas para as perguntas mais frequentes sobre nossos produtos e serviços.
          </p>
        </section>

        <details open style={{
          background: "#f9fafb",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "1px solid #e5e7eb"
        }}>
          <summary style={{ 
            fontSize: "clamp(15px, 3.8vw, 18px)", 
            fontWeight: "700", 
            color: "#667eea",
            cursor: "pointer",
            marginBottom: "12px"
          }}>
            🛒 Como faço um pedido?
          </summary>
          <ol style={{ 
            paddingLeft: "clamp(20px, 5vw, 24px)",
            lineHeight: 1.7,
            fontSize: "clamp(14px, 3.5vw, 16px)"
          }}>
            <li>Navegue pelos produtos e escolha o que deseja</li>
            <li>Clique em "Adicionar ao Carrinho"</li>
            <li>No carrinho, revise os itens e clique em "Finalizar Compra"</li>
            <li>Preencha seus dados de entrega</li>
            <li>Escolha a forma de pagamento</li>
            <li>Confirme o pedido!</li>
          </ol>
        </details>

        <details style={{
          background: "#f9fafb",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "1px solid #e5e7eb"
        }}>
          <summary style={{ 
            fontSize: "clamp(15px, 3.8vw, 18px)", 
            fontWeight: "700", 
            color: "#667eea",
            cursor: "pointer",
            marginBottom: "12px"
          }}>
            📦 Como acompanho meu pedido?
          </summary>
          <p style={{ lineHeight: 1.7, fontSize: "clamp(14px, 3.5vw, 16px)" }}>
            Acesse a página <a href="/meus-pedidos" style={{ color: "#667eea", textDecoration: "underline", fontWeight: "600" }}>Meus Pedidos</a> e digite seu e-mail ou CPF.
            Você verá todos os detalhes do seu pedido, incluindo status e código de rastreamento (quando disponível).
          </p>
        </details>

        <details style={{
          background: "#f9fafb",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "1px solid #e5e7eb"
        }}>
          <summary style={{ 
            fontSize: "clamp(15px, 3.8vw, 18px)", 
            fontWeight: "700", 
            color: "#667eea",
            cursor: "pointer",
            marginBottom: "12px"
          }}>
            💳 Quais formas de pagamento aceitas?
          </summary>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 24px)",
            lineHeight: 1.7,
            fontSize: "clamp(14px, 3.5vw, 16px)"
          }}>
            <li><strong>Cartão de Crédito:</strong> Visa, Mastercard, Elo, Amex</li>
            <li><strong>PIX:</strong> Pagamento instantâneo</li>
            <li><strong>Boleto Bancário:</strong> Vencimento em 3 dias úteis</li>
          </ul>
        </details>

        <details style={{
          background: "#f9fafb",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "1px solid #e5e7eb"
        }}>
          <summary style={{ 
            fontSize: "clamp(15px, 3.8vw, 18px)", 
            fontWeight: "700", 
            color: "#667eea",
            cursor: "pointer",
            marginBottom: "12px"
          }}>
            🚚 Qual o prazo de entrega?
          </summary>
          <p style={{ lineHeight: 1.7, fontSize: "clamp(14px, 3.5vw, 16px)" }}>
            O prazo varia de acordo com sua localização e é calculado automaticamente no checkout.
            Geralmente:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 24px)",
            marginTop: "12px",
            lineHeight: 1.7,
            fontSize: "clamp(14px, 3.5vw, 16px)"
          }}>
            <li><strong>Região Sudeste:</strong> 3 a 7 dias úteis</li>
            <li><strong>Demais regiões:</strong> 5 a 15 dias úteis</li>
          </ul>
        </details>

        <details style={{
          background: "#f9fafb",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "1px solid #e5e7eb"
        }}>
          <summary style={{ 
            fontSize: "clamp(15px, 3.8vw, 18px)", 
            fontWeight: "700", 
            color: "#667eea",
            cursor: "pointer",
            marginBottom: "12px"
          }}>
            📧 Não recebi o e-mail de confirmação
          </summary>
          <p style={{ lineHeight: 1.7, fontSize: "clamp(14px, 3.5vw, 16px)" }}>
            Verifique sua caixa de spam/lixo eletrônico. Se ainda não encontrar, entre em contato conosco pelo 
            telefone <strong>31 - 3831-0866</strong> ou e-mail <strong>contato@emporiobothanico.com.br</strong>
          </p>
        </details>

        <details style={{
          background: "#f9fafb",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "1px solid #e5e7eb"
        }}>
          <summary style={{ 
            fontSize: "clamp(15px, 3.8vw, 18px)", 
            fontWeight: "700", 
            color: "#667eea",
            cursor: "pointer",
            marginBottom: "12px"
          }}>
            🔒 Meus dados estão seguros?
          </summary>
          <p style={{ lineHeight: 1.7, fontSize: "clamp(14px, 3.5vw, 16px)" }}>
            Sim! Utilizamos criptografia SSL e todas as transações são processadas de forma segura.
            Seus dados pessoais e de pagamento são protegidos conforme nossa <a href="/privacidade" style={{ color: "#667eea", textDecoration: "underline", fontWeight: "600" }}>Política de Privacidade</a>.
          </p>
        </details>

        <section style={{
          background: "linear-gradient(135deg, #fef3c7, #fde68a)",
          padding: "clamp(20px, 5vw, 28px)",
          borderRadius: "clamp(12px, 3vw, 16px)",
          border: "2px solid #f59e0b",
          marginTop: "clamp(20px, 5vw, 32px)"
        }}>
          <h2 style={{ 
            fontSize: "clamp(16px, 4vw, 20px)", 
            fontWeight: "700", 
            color: "#92400e",
            marginBottom: "12px"
          }}>
            💬 Ainda tem dúvidas?
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#78350f",
            lineHeight: 1.7
          }}>
            Nossa equipe está pronta para ajudar! Entre em contato através da <a href="/contato" style={{ color: "#667eea", textDecoration: "underline", fontWeight: "600" }}>página de contato</a>.
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
