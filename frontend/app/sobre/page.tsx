import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function SobrePage() {
  return (
    <LayoutInstitucional titulo="Sobre Nós">
      <div className="flex flex-col gap-6 md:gap-8">
        <section>
          <h2 className="text-lg md:text-2xl font-bold text-[var(--foreground)] mb-4">
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
          <h2 className="text-lg md:text-2xl font-bold text-[var(--foreground)] mb-4">
            Nossa Missão
          </h2>
          <p>
            Proporcionar bem-estar e qualidade de vida através de produtos naturais, fragrâncias exclusivas e um atendimento personalizado que supera expectativas.
          </p>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-bold text-[var(--foreground)] mb-4">
            Nossos Valores
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Qualidade:</strong> Produtos cuidadosamente selecionados</li>
            <li><strong>Transparência:</strong> Informações claras sobre cada produto</li>
            <li><strong>Sustentabilidade:</strong> Compromisso com o meio ambiente</li>
            <li><strong>Atendimento:</strong> Experiência personalizada para cada cliente</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg md:text-2xl font-bold text-[var(--foreground)] mb-4">
            Por Que Escolher o Empório Botânico?
          </h2>
          <ul className="list-disc pl-6 space-y-2">
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
