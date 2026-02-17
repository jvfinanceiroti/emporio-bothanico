import LayoutInstitucional from "@/components/LayoutInstitucional";
import Link from "next/link";

export default function EntregasPage() {
  return (
    <LayoutInstitucional titulo="Política de Entrega" breadcrumbLabel="Política de Entrega">
      <div className="space-y-8">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--accent-light)]/50 border border-[var(--accent)]/20">
          <p className="text-[var(--accent)] font-medium text-sm sm:text-base leading-relaxed">
            🚚 Entregamos para todo o Brasil com segurança e rapidez!
          </p>
        </div>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            📍 Regiões Atendidas
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Realizamos entregas para <strong className="text-[var(--foreground)]">todo o território nacional</strong> através dos Correios (PAC e SEDEX).
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            ⏱️ Prazos de Entrega
          </h2>
          <p className="text-[var(--muted)] mb-4">Os prazos variam de acordo com sua localização:</p>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-[var(--warm-100)] border border-[var(--border)]">
              <strong className="text-[var(--accent)]">📦 Região Sudeste:</strong>
              <p className="mt-1 text-[var(--muted)] text-sm sm:text-base">
                3 a 7 dias úteis após aprovação do pagamento
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--warm-100)] border border-[var(--border)]">
              <strong className="text-[var(--accent)]">📦 Região Sul:</strong>
              <p className="mt-1 text-[var(--muted)] text-sm sm:text-base">
                5 a 10 dias úteis após aprovação do pagamento
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[var(--warm-100)] border border-[var(--border)]">
              <strong className="text-[var(--accent)]">📦 Demais Regiões:</strong>
              <p className="mt-1 text-[var(--muted)] text-sm sm:text-base">
                7 a 15 dias úteis após aprovação do pagamento
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--foreground)]">Importante:</strong> O prazo exato é calculado automaticamente no checkout de acordo com seu CEP.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            💵 Frete
          </h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            O valor do frete é calculado com base no <strong className="text-[var(--foreground)]">peso</strong>, <strong className="text-[var(--foreground)]">dimensões</strong> do produto e <strong className="text-[var(--foreground)]">CEP de destino</strong>.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li>Você visualiza o valor exato antes de finalizar a compra</li>
            <li>Trabalhamos com os melhores preços dos Correios</li>
            <li>Embalamos com cuidado para garantir que seu produto chegue perfeito</li>
          </ul>
        </section>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--warning-bg)] border border-[var(--warning)]/50">
          <h2 className="text-lg font-bold text-[var(--warning)] mb-3">
            🎉 Frete Grátis
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Fique de olho! Oferecemos <strong className="text-[var(--foreground)]">frete grátis</strong> em compras acima de <strong className="text-[var(--foreground)]">R$ 299</strong>.
            Acompanhe nossas promoções na página inicial!
          </p>
        </div>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            📦 Processamento do Pedido
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-[var(--muted)]">
            <li><strong className="text-[var(--foreground)]">Confirmação do Pagamento:</strong> Até 2 dias úteis (PIX é instantâneo)</li>
            <li><strong className="text-[var(--foreground)]">Separação e Embalagem:</strong> 1 a 2 dias úteis</li>
            <li><strong className="text-[var(--foreground)]">Postagem:</strong> Após embalagem, o produto é enviado imediatamente</li>
            <li><strong className="text-[var(--foreground)]">Código de Rastreamento:</strong> Você recebe por e-mail assim que postado</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            🔍 Rastreamento
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Assim que seu pedido for postado, você receberá por e-mail o <strong className="text-[var(--foreground)]">código de rastreamento</strong>.
            Com ele, você pode acompanhar a entrega em tempo real através do site dos Correios:
          </p>
          <p className="mb-4">
            <a href="https://rastreamento.correios.com.br" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] font-semibold hover:underline">
              🔗 rastreamento.correios.com.br
            </a>
          </p>
          <p className="text-sm text-[var(--muted)]">
            Você também pode acompanhar seu pedido pela página <Link href="/meus-pedidos" className="text-[var(--accent)] font-semibold hover:underline">Meus Pedidos</Link>.
          </p>
        </section>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--error-bg)] border border-[var(--error)]/30">
          <h2 className="text-lg font-bold text-[var(--error)] mb-3">
            ⚠️ Problemas na Entrega?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Se o prazo de entrega ultrapassou o previsto ou houve algum problema:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
            <li>Entre em contato conosco imediatamente</li>
            <li>Telefone: <strong className="text-[var(--foreground)]">(31) 3831-0866</strong></li>
            <li>E-mail: <strong className="text-[var(--foreground)]">contato@emporiobothanico.com.br</strong></li>
          </ul>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--success-bg)] border border-[var(--success)]/40">
          <h2 className="font-bold text-[var(--success)] mb-3 text-lg">
            💬 Dúvidas sobre Entrega?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Nossa equipe está pronta para ajudar! Entre em contato através da{" "}
            <Link href="/contato" className="text-[var(--accent)] font-semibold hover:underline">página de contato</Link>.
          </p>
        </div>
      </div>
    </LayoutInstitucional>
  );
}
