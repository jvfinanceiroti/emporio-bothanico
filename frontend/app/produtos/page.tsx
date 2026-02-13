"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  estoque: number;
  categoria_nome?: string;
  categoria_slug?: string;
}

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  descricao?: string;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    carregarCategorias();
    carregarProdutos();
  }, [categoriaSelecionada]);

  const carregarCategorias = async () => {
    try {
      const response = await fetch(`${API_URL}/categorias`);
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const url = categoriaSelecionada 
        ? `${API_URL}/produtos?categoria=${categoriaSelecionada}`
        : `${API_URL}/produtos`;
      
      const response = await fetch(url);
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setCarregando(false);
    }
  };

  const adicionarAoCarrinho = (produto: Produto) => {
    const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
    const itemExistente = carrinho.find((item: any) => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem_url: produto.imagem_url,
        quantidade: 1
      });
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    // Notificação
    const notification = document.createElement("div");
    notification.innerHTML = `✓ ${produto.nome} adicionado ao carrinho!`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8f9fa"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
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
              alt="Empório Botânico" 
              style={{ height: "clamp(40px, 10vw, 50px)", objectFit: "contain" }}
            />
            <h1 style={{
              fontSize: "clamp(18px, 4.5vw, 24px)",
              fontWeight: "800",
              color: "#0a0a0a",
              margin: 0
            }}>
              Empório Botânico
            </h1>
          </Link>

          <nav style={{
            display: "flex",
            gap: "clamp(16px, 4vw, 24px)",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <Link href="/" style={{ textDecoration: "none", color: "#0a0a0a", fontSize: "clamp(13px, 3vw, 14px)", fontWeight: "600" }}>Início</Link>
            <Link href="/produtos" style={{ textDecoration: "none", color: "#0a0a0a", fontSize: "clamp(13px, 3vw, 14px)", fontWeight: "600" }}>Produtos</Link>
            <Link href="/meus-pedidos" style={{ textDecoration: "none", color: "#0a0a0a", fontSize: "clamp(13px, 3vw, 14px)", fontWeight: "600" }}>Meus Pedidos</Link>
          </nav>

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
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
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
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "clamp(24px, 6vw, 40px) clamp(20px, 5vw, 40px)"
      }}>
        {/* Título e Barra de Pesquisa */}
        <div style={{
          textAlign: "center",
          marginBottom: "clamp(32px, 8vw, 48px)"
        }}>
          <h1 style={{
            fontSize: "clamp(28px, 7vw, 42px)",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "clamp(12px, 3vw, 16px)",
            lineHeight: "1.2"
          }}>
            Nossos Produtos
          </h1>
          <p style={{
            fontSize: "clamp(14px, 3.5vw, 18px)",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto 24px"
          }}>
            Descubra fragrâncias exclusivas para todos os momentos
          </p>

          {/* Barra de Pesquisa Grande */}
          <div style={{
            maxWidth: "700px",
            margin: "0 auto",
            position: "relative"
          }}>
            <input
              type="text"
              placeholder="🔍 Pesquisar produtos..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{
                width: "100%",
                padding: "clamp(16px, 4vw, 20px) clamp(20px, 5vw, 24px)",
                fontSize: "clamp(15px, 3.8vw, 18px)",
                border: "2px solid #e5e7eb",
                borderRadius: "clamp(12px, 3vw, 16px)",
                outline: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                transition: "all 0.3s",
                fontWeight: "500",
                color: "#0a0a0a"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#0a0a0a";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
              }}
            />
            {termoBusca && (
              <button
                onClick={() => setTermoBusca("")}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#dc2626";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#ef4444";
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Menu de Categorias */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          border: "1px solid #e5e7eb"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "12px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🏷️
            </div>
            <h3 style={{
              fontSize: "clamp(18px, 4.5vw, 22px)",
              fontWeight: "800",
              color: "#0a0a0a",
              margin: 0
            }}>
              Navegue por Categoria
            </h3>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <button
              onClick={() => setCategoriaSelecionada(null)}
              style={{
                padding: "16px 24px",
                background: categoriaSelecionada === null 
                  ? "#0a0a0a" 
                  : "#f8f9fa",
                color: categoriaSelecionada === null ? "white" : "#495057",
                border: categoriaSelecionada === null ? "2px solid #0a0a0a" : "2px solid #e5e7eb",
                borderRadius: "16px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                minHeight: "60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: categoriaSelecionada === null 
                  ? "0 8px 24px rgba(0,0,0,0.2)" 
                  : "0 2px 8px rgba(0,0,0,0.04)",
                transform: categoriaSelecionada === null ? "translateY(-2px)" : "none"
              }}
              onMouseOver={(e) => {
                if (categoriaSelecionada !== null) {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                  e.currentTarget.style.borderColor = "#0a0a0a";
                }
              }}
              onMouseOut={(e) => {
                if (categoriaSelecionada !== null) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }
              }}
            >
              <span style={{ fontSize: "20px" }}>✨</span>
              Todos os Produtos
            </button>

            {categorias.map((categoria) => {
              const icones: { [key: string]: string } = {
                'perfume': '🌸',
                'aromas': '🕯️',
                'banho': '🛁'
              };
              
              return (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaSelecionada(categoria.slug)}
                  style={{
                    padding: "16px 24px",
                    background: categoriaSelecionada === categoria.slug
                      ? "#0a0a0a"
                      : "#f8f9fa",
                    color: categoriaSelecionada === categoria.slug ? "white" : "#495057",
                    border: categoriaSelecionada === categoria.slug ? "2px solid #0a0a0a" : "2px solid #e5e7eb",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: categoriaSelecionada === categoria.slug
                      ? "0 8px 24px rgba(0,0,0,0.2)"
                      : "0 2px 8px rgba(0,0,0,0.04)",
                    transform: categoriaSelecionada === categoria.slug ? "translateY(-2px)" : "none"
                  }}
                  onMouseOver={(e) => {
                    if (categoriaSelecionada !== categoria.slug) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
                      e.currentTarget.style.borderColor = "#0a0a0a";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (categoriaSelecionada !== categoria.slug) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                      e.currentTarget.style.borderColor = "#e5e7eb";
                    }
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{icones[categoria.slug] || '📦'}</span>
                  {categoria.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid de Produtos */}
        {carregando ? (
          <div style={{
            textAlign: "center",
            padding: "clamp(40px, 10vw, 60px)",
            color: "#666"
          }}>
            Carregando produtos...
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "clamp(40px, 10vw, 60px)",
            background: "white",
            borderRadius: "clamp(16px, 4vw, 20px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "clamp(48px, 12vw, 64px)", marginBottom: "16px" }}>📦</div>
            <h3 style={{
              fontSize: "clamp(18px, 4.5vw, 22px)",
              fontWeight: "700",
              color: "#0a0a0a",
              marginBottom: "8px"
            }}>
              Nenhum produto encontrado
            </h3>
            <p style={{ fontSize: "clamp(13px, 3vw, 14px)", color: "#666" }}>
              Tente selecionar outra categoria
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
            gap: "clamp(20px, 5vw, 32px)"
          }}>
            {produtosFiltrados.map((produto) => (
              <div
                key={produto.id}
                style={{
                  background: "white",
                  borderRadius: "clamp(16px, 4vw, 20px)",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "all 0.3s",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(102, 126, 234, 0.3)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                }}
              >
                <Link
                  href={`/produto/${produto.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1
                  }}
                >
                  {produto.imagem_url ? (
                    <img
                      src={produto.imagem_url}
                      alt={produto.nome}
                      style={{
                        width: "100%",
                        height: "clamp(250px, 60vw, 320px)",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "clamp(250px, 60vw, 320px)",
                      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "clamp(48px, 12vw, 64px)"
                    }}>
                      🌿
                    </div>
                  )}

                  <div style={{
                    padding: "clamp(16px, 4vw, 20px)",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                  }}>
                    {produto.categoria_nome && (
                      <span style={{
                        fontSize: "clamp(11px, 2.8vw, 12px)",
                        color: "#666",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "8px"
                      }}>
                        {produto.categoria_nome}
                      </span>
                    )}

                    <h3 style={{
                      fontSize: "clamp(16px, 4vw, 18px)",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "clamp(8px, 2vw, 12px)",
                      lineHeight: "1.3"
                    }}>
                      {produto.nome}
                    </h3>

                    <div style={{
                      fontSize: "clamp(22px, 5.5vw, 28px)",
                      fontWeight: "800",
                      color: "#0a0a0a",
                      marginTop: "auto"
                    }}>
                      R$ {Number(produto.preco).toFixed(2)}
                    </div>

                    {produto.estoque === 0 && (
                      <span style={{
                        marginTop: "8px",
                        fontSize: "clamp(11px, 2.8vw, 12px)",
                        color: "#ef4444",
                        fontWeight: "700"
                      }}>
                        Sem estoque
                      </span>
                    )}
                  </div>
                </Link>

                <div style={{ padding: "0 clamp(16px, 4vw, 20px) clamp(16px, 4vw, 20px)" }}>
                  <button
                    onClick={() => adicionarAoCarrinho(produto)}
                    disabled={produto.estoque === 0}
                    style={{
                      width: "100%",
                      padding: "clamp(12px, 3vw, 14px)",
                      background: produto.estoque === 0
                        ? "#e5e7eb"
                        : "#0a0a0a",
                      color: "white",
                      border: "none",
                      borderRadius: "clamp(10px, 2.5vw, 12px)",
                      fontSize: "clamp(13px, 3vw, 14px)",
                      fontWeight: "700",
                      cursor: produto.estoque === 0 ? "not-allowed" : "pointer",
                      transition: "all 0.3s",
                      minHeight: "44px"
                    }}
                    onMouseOver={(e) => {
                      if (produto.estoque !== 0) {
                        e.currentTarget.style.background = "#1a1a1a";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (produto.estoque !== 0) {
                        e.currentTarget.style.background = "#0a0a0a";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {produto.estoque === 0 ? "Indisponível" : "🛒 Adicionar ao Carrinho"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
