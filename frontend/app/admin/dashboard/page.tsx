"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip
);



export default function AdminDashboard() {

const [dados, setDados] = useState<any>(null);
const [grafico30, setGrafico30] = useState<any[]>([]);


useEffect(() => {

  // DASHBOARD MÉTRICAS
  fetch("http://localhost:3001/admin/dashboard")
    .then(res => res.json())
    .then(data => setDados(data));

  // GRÁFICO
  fetch("http://localhost:3001/admin/dashboard/vendas-30dias")
    .then(res => res.json())
    .then(data => setGrafico30(data));

}, []);
const dataGrafico = {
  labels: grafico30.map(d =>
    new Date(d.dia).toLocaleDateString("pt-BR")
  ),
  datasets: [
    {
      label: "Vendas (R$)",
      data: grafico30.map(d => Number(d.total)),

      borderWidth: 3,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7,

      fill: true,

      borderColor: "#16a34a",
      backgroundColor: "rgba(22,163,74,0.15)"
    }
  ]
};
const optionsGrafico = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: "#111",
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        color: "rgba(0,0,0,0.05)"
      }
    }
  }
};



  if (!dados) return <div style={{ padding: 40 }}>Carregando...</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard Admin</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 30 }}>

        <Card title="Total Vendas" value={`R$ ${Number(dados.totalVendas).toFixed(2)}`} />

        <Card title="Total Pedidos" value={dados.totalPedidos} />

        <Card title="Pedidos Hoje" value={dados.pedidosHoje} />

        <Card title="Ticket Médio" value={`R$ ${Number(dados.ticketMedio).toFixed(2)}`} />
<div
  style={{
    background: "white",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    marginTop: 40
  }}
>
  <h2 style={{ marginBottom: 20 }}>
    Vendas últimos 30 dias
  </h2>

  {grafico30.length > 0 && (
    <Bar data={dataGrafico} options={optionsGrafico} />
  )}
</div>


      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div
      style={{
        background: "white",
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
        minWidth: 200
      }}
    >
      <h3 style={{ color: "#666" }}>{title}</h3>
      <h2 style={{ marginTop: 10 }}>{value}</h2>
    </div>
  );
}
