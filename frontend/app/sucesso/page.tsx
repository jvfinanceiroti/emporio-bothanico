"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SucessoPage() {
  const params = useSearchParams();
  const pedidoId = params.get("pedido");

  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    if (!pedidoId) return;

    fetch(`http://localhost:3001/pedidos/${pedidoId}`)
      .then(res => res.json())
      .then(data => setPedido(data));
  }, [pedidoId]);

  if (!pedido) return <div style={{ padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>✅ Pedido realizado!</h1>

      <h2 style={{ marginTop: 20 }}>
        Pedido #{pedido.id}
      </h2>

      <p>Status: {pedido.status}</p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: 30,
          padding: 12,
          background: "black",
          color: "white",
          textDecoration: "none",
          borderRadius: 8,
        }}
      >
        Voltar para loja
      </a>
    </div>
  );
}
