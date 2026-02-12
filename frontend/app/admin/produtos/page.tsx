"use client";

import { useEffect, useState } from "react";

export default function AdminProdutos() {

  const [produtos, setProdutos] = useState<any[]>([]);

  const [novoNome, setNovoNome] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoEstoque, setNovoEstoque] = useState("");

  const carregarProdutos = () => {
    fetch("http://localhost:3001/admin/produtos")
      .then(res => res.json())
      .then(data => setProdutos(data));
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const criarProduto = async () => {
    await fetch("http://localhost:3001/admin/produtos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome: novoNome,
        preco: Number(novoPreco),
        estoque: Number(novoEstoque)
      })
    });

    setNovoNome("");
    setNovoPreco("");
    setNovoEstoque("");

    carregarProdutos();
  };

  const deletarProduto = async (id: number) => {
    await fetch(`http://localhost:3001/admin/produtos/${id}`, {
      method: "DELETE"
    });

    carregarProdutos();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin Produtos</h1>

      <h2 style={{ marginTop: 30 }}>Novo Produto</h2>

      <input
        placeholder="Nome"
        value={novoNome}
        onChange={e => setNovoNome(e.target.value)}
      />

      <input
        placeholder="Preço"
        value={novoPreco}
        onChange={e => setNovoPreco(e.target.value)}
      />

      <input
        placeholder="Estoque"
        value={novoEstoque}
        onChange={e => setNovoEstoque(e.target.value)}
      />

      <button onClick={criarProduto}>
        Criar Produto
      </button>

      <h2 style={{ marginTop: 40 }}>Lista Produtos</h2>

      {produtos.map(p => (
        <div key={p.id} style={{
          border: "1px solid #ddd",
          padding: 20,
          marginTop: 10,
          borderRadius: 8
        }}>
          <strong>{p.nome}</strong>
          <p>Preço: R$ {p.preco}</p>
          <p>Estoque: {p.estoque}</p>

          <button onClick={() => deletarProduto(p.id)}>
            Deletar
          </button>
        </div>
      ))}

    </div>
  );
}
