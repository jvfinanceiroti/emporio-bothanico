"use client";

import { API_URL } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

function PagamentoContent() {
  const params = useSearchParams();
  const router = useRouter();

  const pedidoId = params.get("pedido");

  const pagar = async (aprovado: boolean) => {
    await fetch(`${API_URL}/pagamento-fake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pedido_id: pedidoId,
        aprovado,
      }),
    });

    router.push(`/sucesso?pedido=${pedidoId}`);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Pagamento</h1>

      <button onClick={() => pagar(true)}>
        Simular Pagamento Aprovado
      </button>

      <button
        onClick={() => pagar(false)}
        style={{ marginLeft: 20 }}
      >
        Simular Pagamento Recusado
      </button>
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40 }}>Carregando...</div>}>
      <PagamentoContent />
    </Suspense>
  );
}
