import LayoutInstitucional from "@/components/LayoutInstitucional";

export default function PrivacidadePage() {
  return (
    <LayoutInstitucional titulo="Política de Privacidade" breadcrumbLabel="Privacidade">
      <div className="space-y-8">
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--accent-light)]/50 border border-[var(--accent)]/20">
          <p className="text-[var(--accent)] font-medium text-sm sm:text-base leading-relaxed">
            🔒 Sua privacidade e segurança são nossa prioridade. Veja como protegemos seus dados.
          </p>
        </div>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            📋 Informações que Coletamos
          </h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Coletamos apenas as informações necessárias para processar seus pedidos e melhorar sua experiência:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li><strong className="text-[var(--foreground)]">Dados Cadastrais:</strong> Nome, e-mail, CPF, telefone</li>
            <li><strong className="text-[var(--foreground)]">Endereço de Entrega:</strong> CEP, rua, número, complemento, bairro, cidade, estado</li>
            <li><strong className="text-[var(--foreground)]">Dados de Pagamento:</strong> Processados de forma segura por nossos parceiros (não armazenamos dados de cartão)</li>
            <li><strong className="text-[var(--foreground)]">Histórico de Compras:</strong> Pedidos realizados e preferências</li>
            <li><strong className="text-[var(--foreground)]">Navegação:</strong> Cookies para melhorar a experiência no site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            🎯 Como Usamos Suas Informações
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar atualizações sobre status do pedido</li>
            <li>Prestar suporte e atendimento ao cliente</li>
            <li>Melhorar nossos produtos e serviços</li>
            <li>Enviar ofertas e novidades (com sua permissão)</li>
            <li>Cumprir obrigações legais e regulatórias</li>
          </ul>
        </section>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--success-bg)] border border-[var(--success)]/40">
          <h2 className="text-lg font-bold text-[var(--success)] mb-3">
            🔐 Segurança dos Dados
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Utilizamos <strong className="text-[var(--foreground)]">criptografia SSL</strong> para proteger suas informações durante a transmissão.
            Todos os dados são armazenados em servidores seguros com acesso restrito.
          </p>
        </div>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            🤝 Compartilhamento de Informações
          </h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Seus dados pessoais <strong className="text-[var(--foreground)]">não são vendidos</strong> para terceiros. Compartilhamos apenas quando necessário:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li><strong className="text-[var(--foreground)]">Correios:</strong> Para entrega dos produtos</li>
            <li><strong className="text-[var(--foreground)]">Processadores de Pagamento:</strong> Para processar transações (dados criptografados)</li>
            <li><strong className="text-[var(--foreground)]">Autoridades Legais:</strong> Quando exigido por lei</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            🍪 Cookies
          </h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Utilizamos cookies para:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-[var(--muted)]">
            <li>Manter você logado durante a navegação</li>
            <li>Lembrar itens no seu carrinho</li>
            <li>Entender como você usa o site (análise anônima)</li>
            <li>Melhorar sua experiência de navegação</li>
          </ul>
          <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
            Você pode desabilitar cookies nas configurações do seu navegador, mas isso pode afetar a funcionalidade do site.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            ✋ Seus Direitos (LGPD)
          </h2>
          <p className="text-[var(--muted)] mb-4 leading-relaxed">
            Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[var(--muted)]">
            <li><strong className="text-[var(--foreground)]">Acessar</strong> seus dados pessoais</li>
            <li><strong className="text-[var(--foreground)]">Corrigir</strong> informações desatualizadas ou incorretas</li>
            <li><strong className="text-[var(--foreground)]">Solicitar exclusão</strong> de seus dados (exceto quando necessário por lei)</li>
            <li><strong className="text-[var(--foreground)]">Revogar consentimento</strong> para uso de dados (ex: newsletters)</li>
            <li><strong className="text-[var(--foreground)]">Portabilidade</strong> de dados para outro fornecedor</li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-[var(--warm-100)] border border-[var(--border)]">
            <p className="text-[var(--muted)] leading-relaxed">
              Para exercer seus direitos, entre em contato através do e-mail:{" "}
              <strong className="text-[var(--foreground)]">contato@emporiobothanico.com.br</strong>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            👶 Menores de Idade
          </h2>
          <p className="text-[var(--muted)] leading-relaxed">
            Nosso site e serviços são destinados a <strong className="text-[var(--foreground)]">maiores de 18 anos</strong>.
            Não coletamos intencionalmente dados de menores sem consentimento dos responsáveis legais.
          </p>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            🔄 Alterações nesta Política
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Podemos atualizar esta Política de Privacidade periodicamente. Quando houver mudanças significativas,
            notificaremos você por e-mail ou através de um aviso destacado no site.
          </p>
          <p className="text-sm text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">Última atualização:</strong> Fevereiro de 2026
          </p>
        </section>

        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--warning-bg)] border border-[var(--warning)]/50">
          <h2 className="text-lg font-bold text-[var(--warning)] mb-3">
            💬 Dúvidas sobre Privacidade?
          </h2>
          <p className="text-[var(--muted)] leading-relaxed mb-4">
            Se você tiver qualquer dúvida sobre como tratamos seus dados, entre em contato:
          </p>
          <p className="text-[var(--muted)] leading-relaxed">
            📧 <strong className="text-[var(--foreground)]">contato@emporiobothanico.com.br</strong><br />
            📞 <strong className="text-[var(--foreground)]">(31) 3831-0866</strong>
          </p>
        </div>
      </div>
    </LayoutInstitucional>
  );
}
