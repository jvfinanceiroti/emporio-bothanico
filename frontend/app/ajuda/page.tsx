import LayoutInstitucional from "@/components/LayoutInstitucional";
import Link from "next/link";

export default function AjudaPage() {
  return (
    <LayoutInstitucional titulo="Central de Ajuda" breadcrumbLabel="Central de Ajuda">
      <div className="space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--accent-light)]/50 border border-[var(--accent)]/20">
          <p className="text-[var(--accent)] font-medium text-sm sm:text-base leading-relaxed">
            📚 Encontre respostas rápidas para as perguntas mais frequentes sobre nossos produtos e serviços.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "🛒 Como faço um pedido?",
              a: (
                <ol className="list-decimal pl-6 space-y-2 text-[var(--muted)]">
                  <li>Navegue pelos produtos e escolha o que deseja</li>
                  <li>Clique em &quot;Adicionar ao Carrinho&quot;</li>
                  <li>No carrinho, revise os itens e clique em &quot;Finalizar Compra&quot;</li>
                  <li>Preencha seus dados de entrega</li>
                  <li>Escolha a forma de pagamento</li>
                  <li>Confirme o pedido!</li>
                </ol>
              ),
              open: true,
            },
            {
              q: "📦 Como acompanho meu pedido?",
              a: (
                <p className="text-[var(--muted)]">
                  Acesse a página <Link href="/meus-pedidos" className="text-[var(--accent)] font-semibold hover:underline">Meus Pedidos</Link> e digite seu e-mail ou CPF.
                  Você verá todos os detalhes do seu pedido, incluindo status e código de rastreamento (quando disponível).
                </p>
              ),
            },
            {
              q: "💳 Quais formas de pagamento aceitas?",
              a: (
                <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
                  <li><strong className="text-[var(--foreground)]">Cartão de Crédito:</strong> Visa, Mastercard, Elo, Hipercard</li>
                  <li><strong className="text-[var(--foreground)]">PIX:</strong> Pagamento instantâneo</li>
                  <li><strong className="text-[var(--foreground)]">Boleto Bancário:</strong> Vencimento em 3 dias úteis</li>
                </ul>
              ),
            },
            {
              q: "🚚 Qual o prazo de entrega?",
              a: (
                <div className="text-[var(--muted)] space-y-2">
                  <p>O prazo varia de acordo com sua localização e é calculado automaticamente no checkout. Geralmente:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong className="text-[var(--foreground)]">Região Sudeste:</strong> 3 a 7 dias úteis</li>
                    <li><strong className="text-[var(--foreground)]">Demais regiões:</strong> 5 a 15 dias úteis</li>
                  </ul>
                </div>
              ),
            },
            {
              q: "📧 Não recebi o e-mail de confirmação",
              a: (
                <p className="text-[var(--muted)]">
                  Verifique sua caixa de spam/lixo eletrônico. Se ainda não encontrar, entre em contato conosco pelo
                  telefone <strong className="text-[var(--foreground)]">(31) 3831-0866</strong> ou e-mail <strong className="text-[var(--foreground)]">contato@emporiobothanico.com.br</strong>
                </p>
              ),
            },
            {
              q: "🔒 Meus dados estão seguros?",
              a: (
                <p className="text-[var(--muted)]">
                  Sim! Utilizamos criptografia SSL e todas as transações são processadas de forma segura.
                  Seus dados pessoais e de pagamento são protegidos conforme nossa <Link href="/privacidade" className="text-[var(--accent)] font-semibold hover:underline">Política de Privacidade</Link>.
                </p>
              ),
            },
          ].map((item, i) => (
            <details
              key={i}
              open={item.open}
              className="group p-5 sm:p-6 rounded-2xl border border-[var(--border)] bg-[var(--warm-50)] hover:border-[var(--border-strong)] transition-colors"
            >
              <summary className="font-bold text-[var(--accent)] cursor-pointer list-none flex items-center gap-2 text-base sm:text-lg [&::-webkit-details-marker]:hidden">
                <span className="text-[var(--accent)] transition-transform group-open:rotate-90">›</span>
                {item.q}
              </summary>
              <div className="mt-4 pl-6">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--warning-bg)] border border-[var(--warning)]/50 mt-8">
          <h2 className="font-bold text-[var(--warning)] mb-3 text-lg">
            💬 Ainda tem dúvidas?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Nossa equipe está pronta para ajudar! Entre em contato através da <Link href="/contato" className="text-[var(--accent)] font-semibold hover:underline">página de contato</Link>.
          </p>
        </div>
      </div>
    </LayoutInstitucional>
  );
}
