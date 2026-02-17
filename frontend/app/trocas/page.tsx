import LayoutInstitucional from "@/components/LayoutInstitucional";
import Link from "next/link";

export default function TrocasPage() {
  return (
    <LayoutInstitucional titulo="Trocas e Devoluções" breadcrumbLabel="Trocas e Devoluções">
      <div className="space-y-8">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--accent-light)]/50 border border-[var(--accent)]/20">
          <p className="text-[var(--accent)] font-medium text-sm sm:text-base leading-relaxed">
            ♻️ Sua satisfação é nossa prioridade! Confira nossa política de trocas e devoluções.
          </p>
        </div>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            📅 Prazo para Troca ou Devolução
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Você tem até <strong className="text-[var(--foreground)]">7 dias corridos</strong> após o recebimento do produto para solicitar troca ou devolução,
            conforme o Código de Defesa do Consumidor (Art. 49).
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            ✅ Condições para Troca/Devolução
          </h2>
          <p className="text-[var(--muted)] mb-4">Para realizar troca ou devolução, o produto deve:</p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li>Estar <strong className="text-[var(--foreground)]">sem uso</strong> e na embalagem original</li>
            <li>Conter todas as <strong className="text-[var(--foreground)]">etiquetas e lacres</strong> intactos</li>
            <li>Incluir a <strong className="text-[var(--foreground)]">nota fiscal</strong> original</li>
            <li>Não apresentar sinais de <strong className="text-[var(--foreground)]">violação ou uso inadequado</strong></li>
          </ul>
        </section>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--warning-bg)] border border-[var(--warning)]/50">
          <h2 className="text-lg font-bold text-[var(--warning)] mb-3">
            ⚠️ Importante
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Por questões de higiene e segurança, <strong className="text-[var(--foreground)]">não aceitamos trocas ou devoluções</strong> de produtos que apresentem
            sinais de uso, embalagem violada ou sem lacre original. Perfumes abertos também não podem ser trocados.
          </p>
        </div>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            📝 Como Solicitar Troca ou Devolução
          </h2>
          <ol className="list-decimal pl-6 space-y-3 text-[var(--muted)]">
            <li>
              <strong className="text-[var(--foreground)]">Entre em contato conosco:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Telefone: <strong className="text-[var(--foreground)]">(31) 3831-0866</strong></li>
                <li>E-mail: <strong className="text-[var(--foreground)]">contato@emporiobothanico.com.br</strong></li>
                <li>WhatsApp: <strong className="text-[var(--foreground)]">(31) 99503-7940</strong></li>
              </ul>
            </li>
            <li><strong className="text-[var(--foreground)]">Informe:</strong> Número do pedido, motivo da troca/devolução e fotos do produto (se aplicável)</li>
            <li><strong className="text-[var(--foreground)]">Aguarde:</strong> Nossa equipe analisará sua solicitação em até 24h úteis</li>
            <li><strong className="text-[var(--foreground)]">Envio:</strong> Após aprovação, você receberá instruções de envio (postagem via Correios)</li>
            <li><strong className="text-[var(--foreground)]">Processamento:</strong> Após recebermos o produto, faremos a análise em até 5 dias úteis</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            💰 Reembolso
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Em caso de devolução aprovada, o reembolso será realizado em até <strong className="text-[var(--foreground)]">10 dias úteis</strong> após a análise do produto,
            utilizando a mesma forma de pagamento original.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
            <li><strong className="text-[var(--foreground)]">Cartão de Crédito:</strong> Estorno na próxima fatura</li>
            <li><strong className="text-[var(--foreground)]">PIX/Boleto:</strong> Depósito em conta bancária informada</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            📦 Produto com Defeito ou Avariado
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Se você recebeu um produto com defeito, avaria no transporte ou divergente do pedido, entre em contato imediatamente:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li>Tire fotos do produto e da embalagem</li>
            <li>Entre em contato em até <strong className="text-[var(--foreground)]">48 horas</strong> após o recebimento</li>
            <li>Nestes casos, <strong className="text-[var(--foreground)]">o frete de devolução é por nossa conta</strong></li>
          </ul>
        </section>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--success-bg)] border border-[var(--success)]/40">
          <h2 className="font-bold text-[var(--success)] mb-3 text-lg">
            💬 Dúvidas?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Nossa equipe está à disposição para esclarecer qualquer dúvida sobre trocas e devoluções.
            Entre em contato através da <Link href="/contato" className="text-[var(--accent)] font-semibold hover:underline">página de contato</Link>.
          </p>
        </div>
      </div>
    </LayoutInstitucional>
  );
}
