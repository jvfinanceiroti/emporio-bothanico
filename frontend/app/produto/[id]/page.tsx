"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProdutoPage() {
  const params = useParams();
  const [produto, setProduto] = useState<any>(null);
  const [mostrarToast, setMostrarToast] = useState(false);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`http://localhost:3001/produtos/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data));
  }, [params]);

  const adicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    carrinhoAtual.push(produto);

    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));

    setMostrarToast(true);

    setTimeout(() => {
      setMostrarToast(false);
    }, 2500);
  };

  if (!produto) {
    return <div style={{ padding: 40 }}>Carregando...</div>;
  }

  return (
    <>
      {/* TOAST */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          background: "#16a34a",
          color: "white",
          padding: "14px 22px",
          borderRadius: 12,
          fontWeight: 500,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          transform: mostrarToast
            ? "translateX(0)"
            : "translateX(120%)",
          opacity: mostrarToast ? 1 : 0,
          transition: "all 0.4s ease",
          zIndex: 9999,
        }}
      >
        Produto adicionado ao carrinho ✓
      </div>

      {/* CONTEÚDO PRODUTO */}
      <div style={{ padding: 40 }}>
        <h1>{produto.nome}</h1>
        <p>Preço: R$ {produto.preco}</p>
        <p>{produto.descricao}</p>

        <button
          onClick={adicionarAoCarrinho}
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
          Adicionar ao carrinho
        </button>
      </div>
    </>
  );
}
