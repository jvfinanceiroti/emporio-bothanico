"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  
 const router = useRouter();

useEffect(() => {

  const buscarPedidos = () => {
    fetch("http://localhost:3001/admin/pedidos")
      .then(res => res.json())
      .then(data => setPedidos(data));
  };

  buscarPedidos(); // carrega quando abre

  const interval = setInterval(buscarPedidos, 5000); // atualiza a cada 5s

  return () => clearInterval(interval);

}, []);

  const pedidosFiltrados =
    filtroStatus === "todos"
      ? pedidos
      : pedidos.filter(p => p.status === filtroStatus);

  return (
    <div style={{ padding: 40 }}>
      <h1>Painel Admin — Pedidos</h1>

      {/* FILTRO */}
      <div style={{ marginTop: 20 }}>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{ padding: 10 }}
        >
          <option value="todos">Todos</option>
          <option value="aguardando_pagamento">
            Aguardando Pagamento
          </option>
          <option value="pago">Pago</option>
          <option value="recusado">Recusado</option>
          <option value="enviado">Enviado</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>

      <table
        style={{
          width: "100%",
          marginTop: 30,
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>

        <tbody>
          {pedidosFiltrados.map(p => (
          <tr
  key={p.id}
  onClick={() => router.push(`/admin/pedidos/${p.id}`)}
  style={{ cursor: "pointer" }}
>

              <td>#{p.id}</td>
              <td>{p.cliente_nome}</td>
              <td>R$ {Number(p.total).toFixed(2)}</td>
              <td>{p.status}</td>
              <td>
                {new Date(p.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
  
}

