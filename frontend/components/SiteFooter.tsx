import Link from "next/link";
import { PaymentIcons } from "./PaymentIcons";

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block text-white/70 text-sm mb-3 hover:text-white transition-colors">
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#1c1917] text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <img src="/logo.png" alt="Logo" className="h-12 w-12 mb-4 invert opacity-90" />
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-logo)" }}>Empório Bothânico</h3>
            <p className="text-white/70 text-sm leading-relaxed">Fragrâncias e produtos de banho selecionados para você.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Navegação</h4>
            <FooterLink href="/">Início</FooterLink>
            <FooterLink href="/produtos">Produtos</FooterLink>
            <FooterLink href="/promocoes">Promoções</FooterLink>
            <FooterLink href="/sobre">Sobre Nós</FooterLink>
            <FooterLink href="/contato">Contato</FooterLink>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Atendimento</h4>
            <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
            <FooterLink href="/trocas">Trocas e Devoluções</FooterLink>
            <FooterLink href="/entregas">Política de Entrega</FooterLink>
            <FooterLink href="/privacidade">Privacidade</FooterLink>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-4">Fale Conosco</h4>
            <p className="text-white/70 text-sm">📧 contato@emporiobothanico.com.br</p>
            <p className="text-white/70 text-sm mt-2">📱 (31) 3831-0866</p>
            <p className="text-white/70 text-sm mt-2">Seg-Sex: 9h às 18h</p>
            <a href="https://www.instagram.com/emporiobothanicoita/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-white/70 hover:text-white transition-colors text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.14 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.14-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              @emporiobothanicoita
            </a>
          </div>
        </div>
        <div className="pt-8 pb-8 border-t border-white/20">
          <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-4 text-center">Formas de pagamento</p>
          <PaymentIcons />
        </div>
        <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <p>© 2026 Empório Bothânico. CNPJ: 04.280.033/0001-93</p>
        </div>
      </div>
    </footer>
  );
}
