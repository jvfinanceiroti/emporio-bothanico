"use client";

import { useEffect, useState } from "react";
import Link from "next/link";


export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/produtos")
      .then(res => res.json())
      .then(data => setProdutos(data));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Minha Loja 🚀</h1>

      {produtos.map((produto) => (
  <Link key={produto.id} href={`/produto/${produto.id}`}>
    <div
      style={{
        border: "1px solid #ccc",
        padding: 20,
        marginTop: 20,
        cursor: "pointer"
      }}
    >
      <h2>{produto.nome}</h2>
      <p>Preço: R$ {produto.preco}</p>
    </div>
  </Link>
))}

    </div>
  );
}
