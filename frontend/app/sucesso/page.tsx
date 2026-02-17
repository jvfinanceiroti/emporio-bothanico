"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { StoreHeader } from "@/components/StoreHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const dynamic = "force-dynamic";

interface Pedido {
  id: number;
  status: string;
  total: number;
  cliente_nome: string;
  cliente_email: string;
  forma_pagamento?: string;
  criado_em: string;
}

function SucessoContent() {
  const params = useSearchParams();
  const pedidoId = params.get("pedido");
  const token = params.get("token");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);

  const buscarPedido = async () => {
    if (!pedidoId || !token) {
      setCarregando(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/pedidos/${pedidoId}?token=${token}`);
      if (!res.ok) {
        setCarregando(false);
        return;
      }
      const data = await res.json();
      setPedido(data);
    } catch {
      /* ignore */
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarPedido();
  }, [pedidoId]);

  useEffect(() => {
    if (!pedido || pedido.status !== "aguardando_pagamento") return;
    const interval = setInterval(buscarPedido, 5000);
    return () => clearInterval(interval);
  }, [pedido?.status, pedidoId]);

  const getFormaPagamentoLabel = (forma?: string) => {
    switch (forma) {
      case "pix": return "PIX";
      case "cartao": return "Cartão de Crédito";
      case "boleto": return "Boleto Bancário";
      default: return "Não informado";
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aguardando_pagamento":
        return { label: "⏳ Aguardando Pagamento", color: "var(--warning)", bg: "var(--warning-bg)" };
      case "pago":
      case "aprovado":
        return { label: "✓ Pago", color: "var(--success)", bg: "var(--success-bg)" };
      case "enviado":
        return { label: "📦 Enviado", color: "var(--accent)", bg: "var(--accent-light)" };
      case "entregue":
        return { label: "✓ Entregue", color: "var(--success)", bg: "var(--success-bg)" };
      case "cancelado":
        return { label: "✗ Cancelado", color: "var(--error)", bg: "var(--error-bg)" };
      default:
        return { label: status, color: "var(--muted)", bg: "var(--warm-200)" };
    }
  };

  const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium">Pedido Confirmado</span>
        </nav>
        {children}
      </main>
      <SiteFooter />
    </div>
  );

  if (carregando) {
    return (
      <LayoutWrapper>
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] p-12 sm:p-16 text-center">
          <div className="w-16 h-16 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[var(--muted)] font-semibold">Carregando informações do pedido...</p>
        </div>
      </LayoutWrapper>
    );
  }

  if (!pedido) {
    return (
      <LayoutWrapper>
        <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] p-12 sm:p-16 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4" style={{ fontFamily: "var(--font-logo)" }}>
            Pedido não encontrado
          </h2>
          <p className="text-[var(--muted)] mb-8">
            Não foi possível localizar este pedido. Verifique o link ou tente novamente.
          </p>
          <Link href="/" className="btn-primary">
            Voltar para a loja
          </Link>
        </div>
      </LayoutWrapper>
    );
  }

  const statusInfo = getStatusInfo(pedido.status);

  return (
    <LayoutWrapper>
      <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] overflow-hidden">
        <div className="px-6 sm:px-10 py-8 sm:py-12 text-center">
          {/* Ícone de sucesso */}
          <div
            className="w-20 sm:w-24 h-20 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 checkmark-anim"
            style={{
              background: "linear-gradient(135deg, var(--success) 0%, var(--accent) 100%)",
              boxShadow: "0 12px 32px rgba(5, 150, 105, 0.35)",
            }}
          >
            <span className="text-4xl sm:text-5xl text-white font-bold">✓</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)] mb-3" style={{ fontFamily: "var(--font-logo)" }}>
            Pedido Confirmado!
          </h1>
          <p className="text-[var(--muted)] text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Obrigado pela sua compra! Seu pedido foi registrado com sucesso e está sendo processado.
          </p>

          {/* Detalhes do pedido */}
          <div className="rounded-2xl p-6 sm:p-8 mb-8 bg-[var(--warm-100)] border border-[var(--border)] text-left">
            <div className="pb-6 mb-6 border-b-2 border-[var(--border)]">
              <span className="text-xs text-[var(--muted)] font-semibold uppercase tracking-wide">Número do Pedido</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--foreground)] mt-1">#{pedido.id}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="text-xs text-[var(--muted)] font-semibold block mb-1">Cliente</span>
                <div className="font-bold text-[var(--foreground)]">{pedido.cliente_nome}</div>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)] font-semibold block mb-1">Forma de Pagamento</span>
                <div className="font-bold text-[var(--foreground)]">{getFormaPagamentoLabel(pedido.forma_pagamento)}</div>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)] font-semibold block mb-1">Status</span>
                <span
                  className="inline-block px-4 py-2 rounded-lg text-sm font-bold"
                  style={{ background: statusInfo.bg, color: statusInfo.color }}
                >
                  {statusInfo.label}
                </span>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)] font-semibold block mb-1">Valor Total</span>
                <div className="text-xl sm:text-2xl font-extrabold text-[var(--success)]">
                  R$ {Number(pedido.total).toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          </div>

          {/* Aviso de e-mail */}
          <div className="rounded-xl p-5 mb-8 bg-[var(--accent-light)] border border-[var(--border)] text-left">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">📧</span>
              <p className="text-sm sm:text-base text-[var(--foreground)] leading-relaxed">
                Um e-mail de confirmação foi enviado para <strong>{pedido.cliente_email}</strong> com todos os detalhes do seu pedido.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Voltar para a loja
            </Link>
            <Link
              href="/meus-pedidos"
              className="btn-secondary"
            >
              Ver meus pedidos
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes checkmark {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .checkmark-anim {
          animation: checkmark 0.6s ease-out;
        }
      `}</style>
    </LayoutWrapper>
  );
}

export default function SucessoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
          <header className="sticky top-0 z-50">
            <StoreHeader />
          </header>
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="bg-white rounded-3xl border border-[var(--border)] p-16 text-center">
              <div className="w-14 h-14 border-4 border-[var(--accent-light)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-6" />
              <p className="text-[var(--muted)] font-semibold">Carregando...</p>
            </div>
          </main>
          <SiteFooter />
        </div>
      }
    >
      <SucessoContent />
    </Suspense>
  );
}
