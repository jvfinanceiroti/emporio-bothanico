"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function CarrinhoPage() {
    const router = useRouter();
     const [carrinho, setCarrinho] = useState<any[]>([]);

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );
    setCarrinho(carrinhoSalvo);
  }, []);

  const removerProduto = (index: number) => {
    const novoCarrinho = [...carrinho];
    novoCarrinho.splice(index, 1);

    setCarrinho(novoCarrinho);

    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
  };

  const total = carrinho.reduce(
    (acc, item) => acc + Number(item.preco),
    0
  );

  return (
    <div style={{ padding: 40 }}>
      <h1>Meu Carrinho 🛒</h1>

      {carrinho.length === 0 && <p>Carrinho vazio</p>}

      {carrinho.map((produto, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: 20,
            marginTop: 20,
            borderRadius: 8,
          }}
        >
          <h3>{produto.nome}</h3>
          <p>Preço: R$ {produto.preco}</p>

          <button
            onClick={() => removerProduto(index)}
            style={{
              marginTop: 10,
              padding: 8,
              background: "#dc2626",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: 6,
            }}
          >
            Remover
          </button>
        </div>
      ))}

      {carrinho.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>Total: R$ {total.toFixed(2)}</h2>
          <button
  onClick={() => router.push("/checkout")}
  style={{
    marginTop: 20,
    padding: 12,
    background: "black",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: 8,
  }}
>
  Finalizar Compra
</button>


        </div>
      )}
    </div>
  );
}
