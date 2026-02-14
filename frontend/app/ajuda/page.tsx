import LayoutInstitucional from "@/components/LayoutInstitucional";
import Link from "next/link";

export default function AjudaPage() {
  return (
    <LayoutInstitucional titulo="Central de Ajuda">
      <div className="flex flex-col gap-6 md:gap-8">
        <section className="p-5 md:p-6 rounded-xl border-2" style={{ background: "var(--accent-light)", borderColor: "var(--accent)" }}>
          <p className="text-[var(--accent)] font-medium text-sm md:text-base">
            📚 Encontre respostas rápidas para as perguntas mais frequentes sobre nossos produtos e serviços.
          </p>
        </section>

        <div className="space-y-4">
          {[
            {
              q: "🛒 Como faço um pedido?",
              a: (
                <ol className="list-decimal pl-6 space-y-2">
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
                <p>
                  Acesse a página <Link href="/meus-pedidos" className="store-link">Meus Pedidos</Link> e digite seu e-mail ou CPF.
                  Você verá todos os detalhes do seu pedido, incluindo status e código de rastreamento (quando disponível).
                </p>
              ),
            },
            {
              q: "💳 Quais formas de pagamento aceitas?",
              a: (
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Cartão de Crédito:</strong> Visa, Mastercard, Elo, Amex</li>
                  <li><strong>PIX:</strong> Pagamento instantâneo</li>
                  <li><strong>Boleto Bancário:</strong> Vencimento em 3 dias úteis</li>
                </ul>
              ),
            },
            {
              q: "🚚 Qual o prazo de entrega?",
              a: (
                <>
                  <p className="mb-3">O prazo varia de acordo com sua localização e é calculado automaticamente no checkout. Geralmente:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Região Sudeste:</strong> 3 a 7 dias úteis</li>
                    <li><strong>Demais regiões:</strong> 5 a 15 dias úteis</li>
                  </ul>
                </>
              ),
            },
            {
              q: "📧 Não recebi o e-mail de confirmação",
              a: (
                <p>
                  Verifique sua caixa de spam/lixo eletrônico. Se ainda não encontrar, entre em contato conosco pelo
                  telefone <strong>31 - 3831-0866</strong> ou e-mail <strong>contato@emporiobothanico.com.br</strong>
                </p>
              ),
            },
            {
              q: "🔒 Meus dados estão seguros?",
              a: (
                <p>
                  Sim! Utilizamos criptografia SSL e todas as transações são processadas de forma segura.
                  Seus dados pessoais e de pagamento são protegidos conforme nossa <Link href="/privacidade" className="store-link">Política de Privacidade</Link>.
                </p>
              ),
            },
          ].map((item, i) => (
            <details
              key={i}
              open={item.open}
              className="store-card p-4 md:p-5 group"
            >
              <summary className="font-bold text-[var(--accent)] cursor-pointer list-none flex items-center gap-2 text-[15px] md:text-[17px] [&::-webkit-details-marker]:hidden">
                <span className="group-open:rotate-90 transition-transform">{">"}</span>
                {item.q}
              </summary>
              <div className="mt-4 pl-6 text-[var(--muted)] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>

        <section className="p-5 md:p-6 rounded-xl border-2 mt-8" style={{ background: "var(--warning-bg)", borderColor: "var(--warning)" }}>
          <h2 className="font-bold text-[var(--warning)] mb-3 text-base md:text-lg">
            💬 Ainda tem dúvidas?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Nossa equipe está pronta para ajudar! Entre em contato através da <Link href="/contato" className="store-link">página de contato</Link>.
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
