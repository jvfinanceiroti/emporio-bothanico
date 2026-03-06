import Link from "next/link";
import { PaymentIcons } from "./PaymentIcons";

function FooterLink({ href, children, highlight = false }: { href: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <Link href={href} className={`block text-sm mb-3 transition-colors ${highlight ? "text-amber-300 font-semibold hover:text-amber-200" : "text-white/70 hover:text-white"}`}>
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1c1917] text-white py-14 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12 lg:mb-14">
          <div>
            <img src="/logo.png" alt="Logo" className="h-12 w-12 mb-4 invert opacity-90 mx-auto sm:mx-0" />
            <h3 className="text-xl font-semibold mb-3 text-center sm:text-left" style={{ fontFamily: "var(--font-logo)" }}>Empório Bothânico</h3>
            <p className="text-white/70 text-sm leading-relaxed text-center sm:text-left">
              Fragrâncias exclusivas e produtos de banho premium que transformam seu dia a dia. Qualidade, cuidado e aromas únicos.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
              <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
              </a>
              <a href="https://wa.me/5531995503794" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-colors" aria-label="WhatsApp">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
              </a>
              <a href="mailto:contato@emporiobothanico.com.br" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:border-white/40 transition-colors" aria-label="Email">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-2 10H5a2 2 0 01-2-2V8a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Navegação</h4>
            <FooterLink href="/">Início</FooterLink>
            <FooterLink href="/produtos">Produtos</FooterLink>
            <FooterLink href="/#mais-vendidos" highlight>Mais Vendidos</FooterLink>
            <FooterLink href="/promocoes">Promoções</FooterLink>
            <FooterLink href="/sobre">Sobre Nós</FooterLink>
            <FooterLink href="/contato">Contato</FooterLink>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Atendimento</h4>
            <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
            <FooterLink href="/trocas">Trocas e Devoluções</FooterLink>
            <FooterLink href="/entregas">Política de Entrega</FooterLink>
            <FooterLink href="/privacidade">Política de Privacidade</FooterLink>
            <FooterLink href="/privacidade">Termos de Uso</FooterLink>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Fale Conosco</h4>
            <p className="text-white/70 text-sm">📧 <a className="hover:text-white transition-colors" href="mailto:contato@emporiobothanico.com.br">contato@emporiobothanico.com.br</a></p>
            <p className="text-white/70 text-sm mt-2">📞 (31) 3831-0866</p>
            <p className="text-white/70 text-sm mt-2">🕒 Seg-Sex: 9h às 18h</p>
            <p className="text-white/70 text-sm mt-2">📍 Minas Gerais – Brasil</p>
            <a href="https://wa.me/5531995503794" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 mt-4 px-4 py-2.5 rounded-xl bg-[#2d5a4a] text-white font-semibold text-sm hover:bg-[#234a3d] transition-colors w-full sm:w-auto">
              Falar no WhatsApp
            </a>
          </div>
        </div>
        <div className="pt-8 pb-8 border-t border-white/20">
          <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-5 text-center">Formas de pagamento seguras</p>
          <PaymentIcons />
        </div>

        <div className="pt-8 pb-8 border-t border-white/20">
          <p className="text-xs font-bold uppercase tracking-wider text-white/80 mb-4 text-center">Compra segura</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
            <div className="rounded-xl border border-white/15 bg-white/5 py-3 px-4 text-sm text-white/85">🔒 Site Seguro (SSL)</div>
            <div className="rounded-xl border border-white/15 bg-white/5 py-3 px-4 text-sm text-white/85">💳 Pagamento Protegido</div>
            <div className="rounded-xl border border-white/15 bg-white/5 py-3 px-4 text-sm text-white/85">📦 Entrega Garantida</div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <p>© 2026 Empório Bothânico</p>
          <p className="mt-1">CNPJ: 04.280.033/0001-93</p>
          <p className="mt-1">Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
