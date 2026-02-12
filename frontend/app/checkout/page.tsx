"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function CheckoutPage() {
    const router = useRouter();

  const [carrinho, setCarrinho] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );
    setCarrinho(carrinhoSalvo);
  }, []);

  const finalizarPedido = async () => {

    const response = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itens: carrinho,
        cliente: {
          nome,
          email,
          telefone,
        },
      }),
    });

    if (response.ok) {
      localStorage.removeItem("carrinho");
      const data = await response.json();
    router.push(`/pagamento?pedido=${data.id}`);
    }
  };

  const total = carrinho.reduce(
    (acc, item) => acc + Number(item.preco),
    0
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>Checkout</h1>

      <h2 style={{ marginTop: 30 }}>Seus dados</h2>

      <input
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        style={{ display: "block", marginTop: 10, padding: 10 }}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginTop: 10, padding: 10 }}
      />

      <input
        placeholder="Telefone"
        value={telefone}
        onChange={(e) => setTelefone(e.target.value)}
        style={{ display: "block", marginTop: 10, padding: 10 }}
      />

      <h2 style={{ marginTop: 30 }}>
        Total: R$ {total.toFixed(2)}
      </h2>

      <button
        onClick={finalizarPedido}
        style={{
          marginTop: 20,
          padding: 14,
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
          borderRadius: 8,
        }}
      >
        Finalizar Pedido
      </button>
    </div>
  );
}
