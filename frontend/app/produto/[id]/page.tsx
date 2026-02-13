"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Forçar renderização dinâmica
export const dynamic = 'force-dynamic';

function ProdutoContent() {
  const params = useParams();
  const router = useRouter();
  const [produto, setProduto] = useState<any>(null);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (!params?.id) return;

    fetch(`${API_URL}/produtos/${params.id}`)
      .then((res) => res.json())
      .then((data) => setProduto(data));
  }, [params]);

  const adicionarAoCarrinho = () => {
    const carrinhoAtual = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    for (let i = 0; i < quantidade; i++) {
      carrinhoAtual.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinhoAtual));

    setMostrarToast(true);

    setTimeout(() => {
      setMostrarToast(false);
    }, 2500);
  };

  if (!produto) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #0a0a0a",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }}></div>
          <p style={{ color: "#666", fontSize: "15px" }}>Carregando produto...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff" }}>
      {/* TOAST */}
      <div
        style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          background: "#10b981",
          color: "white",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          zIndex: 1000,
          transform: mostrarToast ? "translateX(0)" : "translateX(400px)",
          opacity: mostrarToast ? 1 : 0,
          transition: "all 0.4s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg style={{ width: "24px", height: "24px" }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span style={{ fontWeight: "600", fontSize: "15px" }}>Produto adicionado ao carrinho!</span>
        </div>
      </div>

      {/* HEADER */}
      <header style={{
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <button
            onClick={() => router.back()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#666",
              background: "none",
              border: "none",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
            onMouseOut={(e) => e.currentTarget.style.color = "#666"}
          >
            <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "20px" }}>
            <img src="/logo.png" alt="Logo" style={{ height: "56px", objectFit: "contain" }} />
            <div>
              <h1 style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.5px"
              }}>
                Empório Bothanico
              </h1>
            </div>
          </Link>

          <Link 
            href="/carrinho"
            style={{
              padding: "14px 32px",
              background: "#0a0a0a",
              color: "white",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "15px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "2px solid #0a0a0a"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "#0a0a0a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#0a0a0a";
              e.currentTarget.style.color = "white";
            }}
          >
            <svg style={{ width: "20px", height: "20px" }} fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
            </svg>
            Carrinho
          </Link>
        </div>
      </header>

      {/* CONTEÚDO PRODUTO */}
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "80px 48px" }}>
        <div style={{
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0"
          }}>
            {/* IMAGEM */}
            <div style={{
              position: "relative",
              background: "#fafafa",
              minHeight: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {produto.imagem_url ? (
                <img 
                  src={produto.imagem_url} 
                  alt={produto.nome}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x600/fafafa/ccc?text=Sem+Imagem';
                  }}
                />
              ) : (
                <div style={{ fontSize: "120px" }}>🌸</div>
              )}
              
              {produto.estoque <= 5 && produto.estoque > 0 && (
                <div style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  background: "#0a0a0a",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Últimas {produto.estoque} Unidades
                </div>
              )}

              {produto.estoque === 0 && (
                <div style={{
                  position: "absolute",
                  top: "24px",
                  left: "24px",
                  background: "#ef4444",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Esgotado
                </div>
              )}
            </div>

            {/* DETALHES */}
            <div style={{
              padding: "64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#999",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "16px"
                }}>
                  Empório Botânico
                </div>

                <h1 style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  color: "#0a0a0a",
                  marginBottom: "24px",
                  letterSpacing: "-1.5px",
                  lineHeight: "1.1"
                }}>
                  {produto.nome}
                </h1>

                {produto.descricao && (
                  <p style={{
                    fontSize: "16px",
                    color: "#666",
                    lineHeight: "1.7",
                    marginBottom: "32px"
                  }}>
                    {produto.descricao}
                  </p>
                )}

                {produto.sku && (
                  <p style={{
                    fontSize: "13px",
                    color: "#999",
                    marginBottom: "32px"
                  }}>
                    <span style={{ fontWeight: "600" }}>SKU:</span> {produto.sku}
                  </p>
                )}

                <div style={{
                  background: "#fafafa",
                  borderRadius: "16px",
                  padding: "32px",
                  marginBottom: "32px"
                }}>
                  <div style={{
                    fontSize: "48px",
                    fontWeight: "900",
                    color: "#0a0a0a",
                    marginBottom: "16px",
                    letterSpacing: "-2px"
                  }}>
                    R$ {Number(produto.preco).toFixed(2)}
                  </div>
                  
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "14px",
                    color: produto.estoque > 5 ? "#10b981" : produto.estoque > 0 ? "#f59e0b" : "#ef4444",
                    fontWeight: "600"
                  }}>
                    <span style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: produto.estoque > 5 ? "#10b981" : produto.estoque > 0 ? "#f59e0b" : "#ef4444"
                    }}></span>
                    {produto.estoque > 0 
                      ? `${produto.estoque} em estoque` 
                      : 'Produto indisponível'}
                  </div>
                </div>

                {produto.estoque > 0 && (
                  <div style={{ marginBottom: "32px" }}>
                    <label style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#666",
                      marginBottom: "12px",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    }}>
                      Quantidade
                    </label>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      background: "#fafafa",
                      borderRadius: "12px",
                      padding: "8px",
                      width: "fit-content"
                    }}>
                      <button
                        onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "white",
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: "8px",
                          fontSize: "20px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#f0f0f0"}
                        onMouseOut={(e) => e.currentTarget.style.background = "white"}
                      >
                        −
                      </button>
                      <span style={{
                        width: "60px",
                        textAlign: "center",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#0a0a0a"
                      }}>
                        {quantidade}
                      </span>
                      <button
                        onClick={() => setQuantidade(Math.min(produto.estoque, quantidade + 1))}
                        style={{
                          width: "40px",
                          height: "40px",
                          background: "white",
                          border: "1px solid rgba(0,0,0,0.1)",
                          borderRadius: "8px",
                          fontSize: "20px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "#f0f0f0"}
                        onMouseOut={(e) => e.currentTarget.style.background = "white"}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={adicionarAoCarrinho}
                  disabled={produto.estoque <= 0}
                  style={{
                    width: "100%",
                    padding: "20px",
                    background: produto.estoque > 0 ? "#0a0a0a" : "#e5e5e5",
                    color: produto.estoque > 0 ? "white" : "#999",
                    border: `2px solid ${produto.estoque > 0 ? "#0a0a0a" : "#e5e5e5"}`,
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: produto.estoque > 0 ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    marginBottom: "16px"
                  }}
                  onMouseOver={(e) => {
                    if (produto.estoque > 0) {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "#0a0a0a";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (produto.estoque > 0) {
                      e.currentTarget.style.background = "#0a0a0a";
                      e.currentTarget.style.color = "white";
                    }
                  }}
                >
                  {produto.estoque > 0 ? (
                    <>
                      <svg style={{ width: "22px", height: "22px" }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                      </svg>
                      Adicionar ao Carrinho
                    </>
                  ) : (
                    'Produto Indisponível'
                  )}
                </button>

                <Link
                  href="/"
                  style={{
                    display: "block",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "15px",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "color 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
                  onMouseOut={(e) => e.currentTarget.style.color = "#666"}
                >
                  ← Continuar Comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProdutoPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ fontSize: "18px", fontWeight: "600", color: "#666" }}>Carregando produto...</p>
        </div>
      </div>
    }>
      <ProdutoContent />
    </Suspense>
  );
}
