import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function PrivacidadePage() {
  return (
    <LayoutInstitucional titulo="Política de Privacidade">
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
            🔒 Sua privacidade e segurança são nossa prioridade. Veja como protegemos seus dados.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            📋 Informações que Coletamos
          </h2>
          <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
            Coletamos apenas as informações necessárias para processar seus pedidos e melhorar sua experiência:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <li><strong>Dados Cadastrais:</strong> Nome, e-mail, CPF, telefone</li>
            <li><strong>Endereço de Entrega:</strong> CEP, rua, número, complemento, bairro, cidade, estado</li>
            <li><strong>Dados de Pagamento:</strong> Processados de forma segura por nossos parceiros (não armazenamos dados de cartão)</li>
            <li><strong>Histórico de Compras:</strong> Pedidos realizados e preferências</li>
            <li><strong>Navegação:</strong> Cookies para melhorar a experiência no site</li>
          </ul>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            🎯 Como Usamos Suas Informações
          </h2>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar atualizações sobre status do pedido</li>
            <li>Prestar suporte e atendimento ao cliente</li>
            <li>Melhorar nossos produtos e serviços</li>
            <li>Enviar ofertas e novidades (com sua permissão)</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>
        </section>

        <section style={{
          background: "#dcfce7",
          padding: "clamp(16px, 4vw, 20px)",
          borderRadius: "clamp(10px, 2.5vw, 12px)",
          border: "2px solid #10b981"
        }}>
          <h2 style={{ 
            fontSize: "clamp(16px, 4vw, 20px)", 
            fontWeight: "700", 
            color: "#065f46",
            marginBottom: "12px" 
          }}>
            🔐 Segurança dos Dados
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#047857",
            lineHeight: 1.7
          }}>
            Utilizamos <strong>criptografia SSL</strong> para proteger suas informações durante a transmissão.
            Todos os dados são armazenados em servidores seguros com acesso restrito.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            🤝 Compartilhamento de Informações
          </h2>
          <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
            Seus dados pessoais <strong>não são vendidos</strong> para terceiros. Compartilhamos apenas quando necessário:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <li><strong>Correios:</strong> Para entrega dos produtos</li>
            <li><strong>Processadores de Pagamento:</strong> Para processar transações (dados criptografados)</li>
            <li><strong>Autoridades Legais:</strong> Quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            🍪 Cookies
          </h2>
          <p style={{ lineHeight: 1.7 }}>
            Utilizamos cookies para:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            marginTop: "12px",
            lineHeight: 1.7
          }}>
            <li>Manter você logado durante a navegação</li>
            <li>Lembrar itens no seu carrinho</li>
            <li>Entender como você usa o site (análise anônima)</li>
            <li>Melhorar sua experiência de navegação</li>
          </ul>
          <p style={{ 
            marginTop: "12px",
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280",
            lineHeight: 1.7
          }}>
            Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            ✋ Seus Direitos (LGPD)
          </h2>
          <p style={{ marginBottom: "12px", lineHeight: 1.7 }}>
            Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
          </p>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            lineHeight: 1.8,
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <li><strong>Acessar</strong> seus dados pessoais</li>
            <li><strong>Corrigir</strong> informações desatualizadas ou incorretas</li>
            <li><strong>Solicitar exclusão</strong> de seus dados (exceto quando necessário por lei)</li>
            <li><strong>Revogar consentimento</strong> para uso de dados (ex: newsletters)</li>
            <li><strong>Portabilidade</strong> de dados para outro fornecedor</li>
          </ul>
          <p style={{ 
            marginTop: "16px",
            padding: "clamp(12px, 3vw, 16px)",
            background: "#f9fafb",
            borderRadius: "clamp(8px, 2vw, 10px)",
            lineHeight: 1.7,
            fontSize: "clamp(13px, 3.2vw, 15px)"
          }}>
            Para exercer seus direitos, entre em contato através do e-mail: 
            <strong> contato@emporiobothanico.com.br</strong>
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            👶 Menores de Idade
          </h2>
          <p style={{ lineHeight: 1.7 }}>
            Nosso site e serviços são destinados a <strong>maiores de 18 anos</strong>. 
            Não coletamos intencionalmente dados de menores sem consentimento dos responsáveis legais.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            🔄 Alterações nesta Política
          </h2>
          <p style={{ lineHeight: 1.7 }}>
            Podemos atualizar esta Política de Privacidade periodicamente. Quando houver mudanças significativas, 
            notificaremos você por e-mail ou através de um aviso destacado no site.
          </p>
          <p style={{ 
            marginTop: "12px",
            fontSize: "clamp(13px, 3.2vw, 14px)",
            color: "#6b7280"
          }}>
            <strong>Última atualização:</strong> Fevereiro de 2026
          </p>
        </section>

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
            💬 Dúvidas sobre Privacidade?
          </h2>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#78350f",
            lineHeight: 1.7,
            marginBottom: "12px"
          }}>
            Se você tiver qualquer dúvida sobre como tratamos seus dados, entre em contato:
          </p>
          <p style={{ 
            fontSize: "clamp(14px, 3.5vw, 16px)",
            color: "#78350f",
            lineHeight: 1.7
          }}>
            📧 <strong>contato@emporiobothanico.com.br</strong><br />
            📞 <strong>31 - 3831-0866</strong>
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
