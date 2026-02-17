import LayoutInstitucional from "@/components/LayoutInstitucional";
import Link from "next/link";

export default function ContatoPage() {
  return (
    <LayoutInstitucional titulo="Contato">
      <div className="flex flex-col gap-6 md:gap-8">
        <p className="text-[var(--muted)] text-base md:text-lg mb-2">
          Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="store-card p-5 md:p-6">
            <h2 className="font-bold text-[var(--accent)] mb-4 flex items-center gap-2 text-lg">
              📞 Telefone
            </h2>
            <p className="text-lg font-semibold text-[var(--foreground)]">31 - 3831-0866</p>
            <p className="text-sm text-[var(--muted)] mt-2">Segunda a Sexta, 9h às 19h</p>
          </section>

          <section className="store-card p-5 md:p-6">
            <h2 className="font-bold text-[var(--accent)] mb-4 flex items-center gap-2 text-lg">
              📧 E-mail
            </h2>
            <a href="mailto:naibari@yahoo.com.br" className="text-lg font-semibold break-all text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">naibari@yahoo.com.br</a>
            <p className="text-sm text-[var(--muted)] mt-2">Respondemos em até 24 horas úteis</p>
          </section>

          <section className="store-card p-5 md:p-6">
            <h2 className="font-bold text-[var(--accent)] mb-4 flex items-center gap-2 text-lg">
              💬 WhatsApp
            </h2>
            <a href="https://wa.me/5531995503794" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">(31) 99550-3794</a>
            <p className="text-sm text-[var(--muted)] mt-2">Atendimento rápido</p>
          </section>

          <section className="store-card p-5 md:p-6 md:col-span-2">
            <h2 className="font-bold text-[var(--foreground)] mb-4 flex items-center gap-2 text-lg">
              🏢 Endereço
            </h2>
            <p className="leading-relaxed text-[var(--foreground)]">
              <strong>LAMBARI PERFUMARIA LTDA - ME</strong><br />
              R. Irmãos D&apos;Caux, 47 - LJ 09 - Centro, Itabira - MG, 35900-026<br />
              <span className="text-sm text-[var(--muted)]">CNPJ: 04.280.033/0001-93</span>
            </p>
          </section>
        </div>

        <section className="p-4 md:p-5 rounded-xl border-2" style={{ background: "var(--warning-bg)", borderColor: "var(--warning)" }}>
          <p className="text-sm md:text-base text-[var(--warning)] font-medium">
            💡 <strong>Dica:</strong> Para acompanhar seu pedido, acesse a página <Link href="/meus-pedidos" className="store-link">Meus Pedidos</Link>
          </p>
        </section>
      </div>
    </LayoutInstitucional>
  );
}
