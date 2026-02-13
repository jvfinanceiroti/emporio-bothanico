import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function SobrePage() {
  return (
    <LayoutInstitucional titulo="Sobre Nós">
      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 24px)" }}>
        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            Quem Somos
          </h2>
          <p style={{ marginBottom: "16px" }}>
            O <strong>Empório Botânico</strong> é sua loja online especializada em perfumes, aromas e produtos para banho de alta qualidade.
          </p>
          <p>
            Acreditamos que o bem-estar começa com pequenos momentos de autocuidado. Por isso, selecionamos cuidadosamente cada produto do nosso catálogo, 
            oferecendo fragrâncias únicas e produtos naturais que transformam sua rotina em uma experiência sensorial especial.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            Nossa Missão
          </h2>
          <p>
            Proporcionar bem-estar e qualidade de vida através de produtos naturais, fragrâncias exclusivas e um atendimento personalizado que supera expectativas.
          </p>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            Nossos Valores
          </h2>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <li><strong>Qualidade:</strong> Produtos cuidadosamente selecionados</li>
            <li><strong>Transparência:</strong> Informações claras sobre cada produto</li>
            <li><strong>Sustentabilidade:</strong> Compromisso com o meio ambiente</li>
            <li><strong>Atendimento:</strong> Experiência personalizada para cada cliente</li>
          </ul>
        </section>

        <section>
          <h2 style={{ 
            fontSize: "clamp(18px, 4.5vw, 24px)", 
            fontWeight: "700", 
            color: "#1f2937",
            marginBottom: "clamp(12px, 3vw, 16px)" 
          }}>
            Por Que Escolher o Empório Botânico?
          </h2>
          <ul style={{ 
            paddingLeft: "clamp(20px, 5vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <li>✨ <strong>Produtos Premium:</strong> Seleção exclusiva de perfumes e aromas</li>
            <li>🌿 <strong>Ingredientes Naturais:</strong> Fórmulas com componentes de origem vegetal</li>
            <li>🚚 <strong>Entrega Rápida:</strong> Envio para todo o Brasil</li>
            <li>🔒 <strong>Compra Segura:</strong> Pagamento protegido e dados criptografados</li>
            <li>💬 <strong>Suporte Dedicado:</strong> Atendimento humanizado em todos os canais</li>
          </ul>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
