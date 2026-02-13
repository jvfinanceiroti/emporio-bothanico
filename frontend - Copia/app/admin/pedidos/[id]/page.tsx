"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AdminPedidoDetalhe() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [novoStatus, setNovoStatus] = useState("");
const [mostrarToast, setMostrarToast] = useState(false);
 const router = useRouter();



useEffect(() => {
  fetch(`http://localhost:3001/admin/pedidos/${params.id}`)
    .then(res => res.json())
    .then(data => {
      setData(data);
      setNovoStatus(data.pedido.status);
    });
}, [params]);


  if (!data) return <div style={{ padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Pedido #{data.pedido.id}</h1>

      <p>Cliente: {data.pedido.cliente_nome}</p>
      <p>Status: {data.pedido.status}</p>
      <p>Total: R$ {Number(data.pedido.total).toFixed(2)}</p>
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
      transform: mostrarToast ? "translateX(0)" : "translateX(120%)",
      opacity: mostrarToast ? 1 : 0,
      transition: "all 0.4s ease",
      zIndex: 9999,
    }}
  >
    Status atualizado ✓
  </div>

  {/* ALTERAR STATUS */}
  <h3 style={{ marginTop: 30 }}>Alterar Status</h3>

  <select
    value={novoStatus}
    onChange={(e) => setNovoStatus(e.target.value)}
    style={{
      padding: 10,
      marginTop: 10,
      borderRadius: 8,
      border: "1px solid #ccc",
    }}
  >
    <option value="aguardando_pagamento">Aguardando Pagamento</option>
    <option value="pago">Pago</option>
    <option value="recusado">Recusado</option>
    <option value="enviado">Enviado</option>
    <option value="finalizado">Finalizado</option>
  </select>

  {/* BOTÃO SALVAR */}
<button
  onClick={async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/admin/pedidos/${data.pedido.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: novoStatus }),
        }
      );

      if (!response.ok) {
        console.log("Erro ao atualizar status");
        return;
      }

      setMostrarToast(true);

      setTimeout(() => {
        setMostrarToast(false);
      }, 2500);

    } catch (error) {
      console.log("Erro fetch:", error);
    }
  }}
  style={{
    marginLeft: 10,
    padding: "10px 18px",
    background: "black",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  }}
>
  Salvar Status
</button>


</>

      <h2 style={{ marginTop: 30 }}>Itens</h2>

      {data.itens.map((item: any) => (
        <div key={item.id} style={{ marginTop: 10 }}>
          {item.nome} — R$ {item.preco_unitario}
        </div>
      ))}
      <br></br>
      <button
  onClick={() => router.push("/admin/pedidos")}
  style={{
    marginBottom: 20,
    padding: "8px 16px",
    background: "#eee",
    border: "none",
    borderRadius: 8,
    cursor: "pointer"
  }}
>
  ← Voltar
</button>
    </div>
    
  );
}
