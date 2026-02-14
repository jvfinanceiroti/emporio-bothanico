"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Pedido {
  id: number;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  total: number;
  status: string;
  criado_em: string;
  endereco_cep?: string;
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_complemento?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_estado?: string;
  frete?: number;
  forma_pagamento?: string;
  codigo_rastreio?: string;
}

interface ItemPedido {
  id: number;
  produto_id: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
}

interface DetalhesPedido {
  pedido: Pedido;
  itens: ItemPedido[];
}

export default function MeusPedidos() {
  const [busca, setBusca] = useState("");
  const [tipoBusca, setTipoBusca] = useState<"email" | "cpf">("email");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<DetalhesPedido | null>(null);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

  const formatarCPF = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return numeros.slice(0, 11);
  };

  const buscarPedidos = async () => {
    if (!busca.trim()) {
      alert("Por favor, digite seu email ou CPF");
      return;
    }

    if (!API_URL) {
      alert("Aguarde, carregando configurações...");
      return;
    }

    setCarregando(true);
    setBuscaRealizada(false);
    setPedidos([]);

    try {
      const valor = tipoBusca === "cpf" ? busca.replace(/\D/g, "") : busca;
      
      // NOVO ENDPOINT SIMPLES!
      const parametro = tipoBusca === "cpf" ? "cpf" : "email";
      const url = `${API_URL}/api/buscar-pedido-simples?${parametro}=${encodeURIComponent(valor)}`;
      
      console.log("🔥 Chamando endpoint SIMPLES:", url);
      
      const response = await fetch(url);
      
      console.log("📡 Status da resposta:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ao buscar pedidos (${response.status})`);
      }

      const data = await response.json();
      console.log("✅ Pedidos recebidos:", data);
      
      setPedidos(data || []);
      setBuscaRealizada(true);
    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      alert(`Erro ao buscar pedidos: ${error.message}`);
      setPedidos([]);
      setBuscaRealizada(true);
    } finally {
      setCarregando(false);
    }
  };

  const carregarDetalhesPedido = async (id: number) => {
    console.log("🔍 Carregando detalhes do pedido ID:", id);
    console.log("🌐 API URL:", API_URL);
    
    if (!API_URL) {
      console.error("❌ API URL não está definida!");
      alert("Erro: API URL não configurada. Aguarde um momento e tente novamente.");
      return;
    }
    
    setCarregandoDetalhes(true);
    try {
      const url = `${API_URL}/pedidos/${id}/detalhes`;
      console.log("📡 Fazendo requisição para:", url);
      
      const response = await fetch(url);
      console.log("📊 Status da resposta:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erro na resposta:", errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("✅ Dados recebidos:", data);
      console.log("📅 Data do pedido (criado_em):", data.pedido?.criado_em);
      console.log("📊 Tipo da data:", typeof data.pedido?.criado_em);
      
      setPedidoSelecionado(data);
      console.log("✅ Modal deve abrir agora!");
    } catch (error: any) {
      console.error("❌ Erro completo:", error);
      alert("Erro ao carregar detalhes do pedido: " + error.message);
    } finally {
      setCarregandoDetalhes(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "aguardando_pagamento":
        return { label: "⏳ Aguardando Pagamento", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
      case "pago":
      case "aprovado":
        return { label: "✓ Pago", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
      case "enviado":
        return { label: "📦 Enviado", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" };
      case "entregue":
        return { label: "✓ Entregue", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" };
      case "cancelado":
        return { label: "✗ Cancelado", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
      default:
        return { label: status, color: "#9ca3af", bg: "rgba(156, 163, 175, 0.1)" };
    }
  };

  const formatarData = (data: string | null | undefined) => {
    console.log("📅 Formatando data:", data, "Tipo:", typeof data);
    
    if (!data) {
      console.warn("⚠️ Data não fornecida");
      return "Data não disponível";
    }
    
    try {
      const dataObj = new Date(data);
      console.log("📅 Data convertida:", dataObj);
      
      if (isNaN(dataObj.getTime())) {
        console.error("❌ Data inválida:", data);
        return "Data inválida";
      }
      
      const formatada = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      console.log("✅ Data formatada:", formatada);
      return formatada;
    } catch (error) {
      console.error("❌ Erro ao formatar data:", error);
      return "Data inválida";
    }
  };

  const getFormaPagamentoLabel = (forma?: string) => {
    switch (forma) {
      case "pix": return "💳 PIX";
      case "cartao": return "💳 Cartão de Crédito";
      case "boleto": return "📄 Boleto";
      default: return "💳 Não informado";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      {/* HEADER PADRÃO */}
      <header style={{
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "clamp(16px, 4vw, 20px) clamp(20px, 5vw, 40px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "clamp(16px, 4vw, 20px)",
          flexWrap: "wrap"
        }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <img 
              src="/logo.png" 
              alt="Empório Bothânico" 
              style={{ height: "clamp(40px, 10vw, 50px)", objectFit: "contain" }}
            />
            <div>
              <h1 style={{
                fontSize: "clamp(18px, 4.5vw, 24px)",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                lineHeight: 1
              }}>
                Empório Bothânico
              </h1>
              <p style={{ fontSize: "clamp(10px, 2.5vw, 12px)", color: "#666", margin: "4px 0 0 0", letterSpacing: "1px" }}>
                DELICADEZAS & BANHO
              </p>
            </div>
          </Link>

          <div style={{ display: "flex", gap: "clamp(12px, 3vw, 16px)", alignItems: "center" }}>
            <Link
              href="/carrinho"
              style={{
                textDecoration: "none",
                padding: "clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)",
                background: "#0a0a0a",
                color: "white",
                borderRadius: "clamp(8px, 2vw, 12px)",
                fontSize: "clamp(13px, 3vw, 14px)",
                fontWeight: "700",
                transition: "all 0.3s",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              🛒 Carrinho
            </Link>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(32px, 8vw, 64px) clamp(20px, 5vw, 40px)"
      }}>
        {/* Botão Voltar */}
        <Link 
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "white",
            color: "#0a0a0a",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "600",
            textDecoration: "none",
            border: "2px solid #e5e7eb",
            transition: "all 0.3s",
            marginBottom: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f9fafb";
            e.currentTarget.style.borderColor = "#0a0a0a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "white";
            e.currentTarget.style.borderColor = "#e5e7eb";
          }}
        >
          ← Voltar para a loja
        </Link>

        {/* Título */}
        <h1 style={{
          fontSize: "clamp(28px, 7vw, 42px)",
          fontWeight: "800",
          color: "#0a0a0a",
          marginBottom: "clamp(12px, 3vw, 16px)",
          textAlign: "center",
          lineHeight: "1.2"
        }}>
          📦 Meus Pedidos
        </h1>
        <p style={{
          fontSize: "clamp(14px, 3.5vw, 18px)",
          color: "#666",
          textAlign: "center",
          marginBottom: "clamp(32px, 8vw, 48px)"
        }}>
          Acompanhe o status dos seus pedidos
        </p>

        {/* Barra de Pesquisa Grande */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "clamp(32px, 8vw, 48px)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          marginBottom: "clamp(32px, 8vw, 48px)",
          border: "1px solid rgba(0,0,0,0.05)"
        }}>
          <div style={{
            display: "flex",
            gap: "16px",
            marginBottom: "24px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => {
                setTipoBusca("email");
                setBusca("");
              }}
              style={{
                padding: "14px 32px",
                background: tipoBusca === "email" ? "#0a0a0a" : "white",
                color: tipoBusca === "email" ? "white" : "#0a0a0a",
                border: `2px solid #0a0a0a`,
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                minHeight: "48px"
              }}
            >
              📧 Buscar por Email
            </button>
            <button
              onClick={() => {
                setTipoBusca("cpf");
                setBusca("");
              }}
              style={{
                padding: "14px 32px",
                background: tipoBusca === "cpf" ? "#0a0a0a" : "white",
                color: tipoBusca === "cpf" ? "white" : "#0a0a0a",
                border: `2px solid #0a0a0a`,
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s",
                minHeight: "48px"
              }}
            >
              🆔 Buscar por CPF
            </button>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type={tipoBusca === "email" ? "email" : "text"}
              value={busca}
              onChange={(e) => {
                const valor = e.target.value;
                setBusca(tipoBusca === "cpf" ? formatarCPF(valor) : valor);
              }}
              placeholder={tipoBusca === "email" ? "Digite seu email" : "Digite seu CPF"}
              style={{
                flex: 1,
                minWidth: "280px",
                padding: "18px 24px",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "500",
                color: "#0a0a0a",
                transition: "all 0.3s"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
              onBlur={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
            />
            <button
              onClick={buscarPedidos}
              disabled={carregando}
              style={{
                padding: "18px 40px",
                background: carregando ? "#9ca3af" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: carregando ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                minHeight: "56px",
                whiteSpace: "nowrap"
              }}
            >
              {carregando ? "Buscando..." : "🔍 Buscar Pedidos"}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {buscaRealizada && (
          <div>
            {pedidos.length === 0 ? (
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "60px 24px",
                textAlign: "center",
                boxShadow: "0 10px 40px rgba(0,0,0,0.06)"
              }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
                <h3 style={{ fontSize: "22px", fontWeight: "700", color: "#0a0a0a", marginBottom: "8px" }}>
                  Nenhum pedido encontrado
                </h3>
                <p style={{ fontSize: "14px", color: "#666" }}>
                  Verifique se o {tipoBusca === "email" ? "email" : "CPF"} está correto
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {pedidos.map((pedido) => {
                  const statusInfo = getStatusInfo(pedido.status);
                  return (
                    <div
                      key={pedido.id}
                      style={{
                        background: "white",
                        borderRadius: "16px",
                        padding: "24px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        border: "2px solid transparent"
                      }}
                      onClick={() => carregarDetalhesPedido(pedido.id)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.12)";
                        e.currentTarget.style.borderColor = "#0a0a0a";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                    >
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "16px",
                        flexWrap: "wrap"
                      }}>
                        <div style={{ flex: 1, minWidth: "200px" }}>
                          <div style={{ marginBottom: "12px" }}>
                            <span style={{ fontSize: "12px", color: "#666", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Pedido #{pedido.id}
                            </span>
                          </div>
                          <h3 style={{
                            fontSize: "18px",
                            fontWeight: "700",
                            color: "#0a0a0a",
                            marginBottom: "8px"
                          }}>
                            {pedido.cliente_nome}
                          </h3>
                          <p style={{ fontSize: "14px", color: "#666", marginBottom: "4px" }}>
                            📅 {formatarData(pedido.criado_em)}
                          </p>
                          <p style={{ fontSize: "14px", color: "#666" }}>
                            {getFormaPagamentoLabel(pedido.forma_pagamento)}
                          </p>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            display: "inline-block",
                            padding: "8px 16px",
                            background: statusInfo.bg,
                            color: statusInfo.color,
                            borderRadius: "8px",
                            fontSize: "13px",
                            fontWeight: "700",
                            marginBottom: "12px"
                          }}>
                            {statusInfo.label}
                          </div>
                          <div style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            color: "#0a0a0a"
                          }}>
                            R$ {Number(pedido.total).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal de Detalhes */}
        {pedidoSelecionado && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              backdropFilter: "blur(4px)"
            }}
            onClick={() => setPedidoSelecionado(null)}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                maxWidth: "700px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0a0a0a", margin: 0 }}>
                  Detalhes do Pedido #{pedidoSelecionado.pedido.id}
                </h2>
                <button
                  onClick={() => setPedidoSelecionado(null)}
                  style={{
                    background: "#f3f4f6",
                    border: "none",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Status e Data */}
              <div style={{
                background: "#f8f9fa",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#666", fontWeight: "600" }}>STATUS</span>
                  <span style={{
                    padding: "6px 12px",
                    background: getStatusInfo(pedidoSelecionado.pedido.status).bg,
                    color: getStatusInfo(pedidoSelecionado.pedido.status).color,
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "700"
                  }}>
                    {getStatusInfo(pedidoSelecionado.pedido.status).label}
                  </span>
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>
                  📅 Pedido realizado em {formatarData(pedidoSelecionado.pedido.criado_em)}
                </div>
                {pedidoSelecionado.pedido.codigo_rastreio && (
                  <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                    📦 Código de rastreio: <strong>{pedidoSelecionado.pedido.codigo_rastreio}</strong>
                  </div>
                )}
              </div>

              {/* Informações do Cliente */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0a0a0a", marginBottom: "12px" }}>
                  👤 Informações do Cliente
                </h3>
                <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
                  <p><strong>Nome:</strong> {pedidoSelecionado.pedido.cliente_nome}</p>
                  <p><strong>Email:</strong> {pedidoSelecionado.pedido.cliente_email}</p>
                  <p><strong>Telefone:</strong> {pedidoSelecionado.pedido.cliente_telefone}</p>
                </div>
              </div>

              {/* Endereço de Entrega */}
              {pedidoSelecionado.pedido.endereco_rua && (
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0a0a0a", marginBottom: "12px" }}>
                    📍 Endereço de Entrega
                  </h3>
                  <div style={{ fontSize: "14px", color: "#666", lineHeight: "1.8" }}>
                    <p>{pedidoSelecionado.pedido.endereco_rua}, {pedidoSelecionado.pedido.endereco_numero}</p>
                    {pedidoSelecionado.pedido.endereco_complemento && <p>{pedidoSelecionado.pedido.endereco_complemento}</p>}
                    <p>{pedidoSelecionado.pedido.endereco_bairro}</p>
                    <p>{pedidoSelecionado.pedido.endereco_cidade} - {pedidoSelecionado.pedido.endereco_estado}</p>
                    <p>CEP: {pedidoSelecionado.pedido.endereco_cep}</p>
                  </div>
                </div>
              )}

              {/* Itens do Pedido */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0a0a0a", marginBottom: "16px" }}>
                  🛒 Itens do Pedido
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pedidoSelecionado.itens.map((item) => (
                    <div key={item.id} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px",
                      background: "#f8f9fa",
                      borderRadius: "8px"
                    }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#0a0a0a", marginBottom: "4px" }}>
                          {item.nome}
                        </div>
                        <div style={{ fontSize: "13px", color: "#666" }}>
                          Quantidade: {item.quantidade} × R$ {Number(item.preco_unitario).toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: "#0a0a0a" }}>
                        R$ {(item.quantidade * Number(item.preco_unitario)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo do Pedido */}
              <div style={{
                borderTop: "2px solid #e5e7eb",
                paddingTop: "20px"
              }}>
                {pedidoSelecionado.pedido.frete && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "14px", color: "#666" }}>Frete:</span>
                    <span style={{ fontSize: "14px", fontWeight: "600", color: "#0a0a0a" }}>
                      R$ {Number(pedidoSelecionado.pedido.frete).toFixed(2)}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: "700", color: "#0a0a0a" }}>Total:</span>
                  <span style={{ fontSize: "28px", fontWeight: "800", color: "#0a0a0a" }}>
                    R$ {Number(pedidoSelecionado.pedido.total).toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
                  {getFormaPagamentoLabel(pedidoSelecionado.pedido.forma_pagamento)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
