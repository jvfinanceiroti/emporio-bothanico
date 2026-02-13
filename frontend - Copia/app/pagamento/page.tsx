"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PagamentoPage() {
  const params = useSearchParams();
  const router = useRouter();

  const pedidoId = params.get("pedido");

  const pagar = async (aprovado: boolean) => {
    await fetch("http://localhost:3001/pagamento-fake", {
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
