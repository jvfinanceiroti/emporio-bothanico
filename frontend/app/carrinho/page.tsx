"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  quantidade: number;
}

export default function CarrinhoPage() {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [cep, setCep] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [erroFrete, setErroFrete] = useState("");

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho") || "[]");
    
    const carrinhoAgrupado = carrinhoSalvo.reduce((acc: ItemCarrinho[], item: any) => {
      const existente = acc.find((i) => i.id === item.id);
      if (existente) {
        existente.quantidade += 1;
      } else {
        acc.push({ ...item, quantidade: 1 });
      }
      return acc;
    }, []);

    setCarrinho(carrinhoAgrupado);
  }, []);

  const atualizarLocalStorage = (novoCarrinho: ItemCarrinho[]) => {
    const carrinhoParaSalvar = novoCarrinho.flatMap((item) =>
      Array(item.quantidade).fill({ ...item, quantidade: undefined })
    );
    localStorage.setItem("carrinho", JSON.stringify(carrinhoParaSalvar));
  };

  const alterarQuantidade = (id: number, delta: number) => {
    const novoCarrinho = carrinho.map((item) => {
      if (item.id === id) {
        const novaQuantidade = Math.max(1, item.quantidade + delta);
        return { ...item, quantidade: novaQuantidade };
      }
      return item;
    });

    setCarrinho(novoCarrinho);
    atualizarLocalStorage(novoCarrinho);
  };

  const removerProduto = (id: number) => {
    const novoCarrinho = carrinho.filter((item) => item.id !== id);
    setCarrinho(novoCarrinho);
    atualizarLocalStorage(novoCarrinho);
  };

  const calcularFrete = async () => {
    if (cep.length !== 8 && cep.replace(/\D/g, '').length !== 8) {
      setErroFrete("CEP inválido. Digite 8 dígitos.");
      return;
    }

    setCarregandoFrete(true);
    setErroFrete("");

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const cepNumerico = parseInt(cep.replace(/\D/g, ''));
    
    if (cepNumerico >= 1000000 && cepNumerico <= 5999999) {
      setFrete(0);
    } else if (cepNumerico >= 6000000 && cepNumerico <= 19999999) {
      setFrete(15.00);
    } else if (cepNumerico >= 20000000 && cepNumerico <= 28999999) {
      setFrete(12.00);
    } else if (cepNumerico >= 29000000 && cepNumerico <= 39999999) {
      setFrete(18.00);
    } else {
      setFrete(25.00);
    }

    setCarregandoFrete(false);
  };

  const subtotal = carrinho.reduce(
    (acc, item) => acc + Number(item.preco) * item.quantidade,
    0
  );

  const total = subtotal + (frete || 0);

  const formatarCep = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  };

  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
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
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}>
          <Link 
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "#666",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              transition: "color 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
            onMouseOut={(e) => e.currentTarget.style.color = "#666"}
          >
            <svg style={{ width: "18px", height: "18px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span style={{ display: "none" }}>Continuar Comprando</span>
          </Link>

          <Link href="/" style={{ 
            textDecoration: "none", 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            flex: 1,
            minWidth: 0,
            justifyContent: "center"
          }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: "40px", 
                width: "40px",
                objectFit: "contain",
                flexShrink: 0
              }} 
            />
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <h1 style={{
                fontSize: "clamp(14px, 3.5vw, 20px)",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.5px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                Empório Bothanico
              </h1>
            </div>
          </Link>

          <div style={{
            fontSize: "clamp(14px, 3.5vw, 20px)",
            fontWeight: "800",
            color: "#0a0a0a",
            letterSpacing: "-0.5px",
            flexShrink: 0,
            whiteSpace: "nowrap"
          }}>
            Meu Carrinho
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "40px 20px" }}>
        {carrinho.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "120px 48px",
            background: "white",
            borderRadius: "24px",
            border: "1px solid rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: "96px", marginBottom: "32px" }}>🛒</div>
            <h2 style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#0a0a0a",
              marginBottom: "16px",
              letterSpacing: "-1px"
            }}>
              Seu carrinho está vazio
            </h2>
            <p style={{
              fontSize: "16px",
              color: "#666",
              marginBottom: "40px"
            }}>
              Adicione produtos para continuar comprando
            </p>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "16px 40px",
                background: "#0a0a0a",
                color: "white",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "15px",
                border: "2px solid #0a0a0a",
                transition: "all 0.3s ease"
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
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: "40px",
            alignItems: "start"
          }}>
            {/* LISTA DE PRODUTOS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h2 style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#0a0a0a",
                marginBottom: "8px",
                letterSpacing: "-0.8px"
              }}>
                Itens no Carrinho ({totalItens})
              </h2>

              {carrinho.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "1px solid rgba(0,0,0,0.08)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = "none"}
                >
                  <div style={{ display: "flex", gap: "24px" }}>
                    {/* Imagem */}
                    <div style={{ flexShrink: 0 }}>
                      {item.imagem_url ? (
                        <img
                          src={item.imagem_url}
                          alt={item.nome}
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            background: "#fafafa"
                          }}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/200x200/fafafa/ccc?text=Sem+Imagem';
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "120px",
                          height: "120px",
                          background: "#fafafa",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "48px"
                        }}>
                          🌸
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <h3 style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#0a0a0a",
                          marginBottom: "8px",
                          letterSpacing: "-0.3px"
                        }}>
                          {item.nome}
                        </h3>
                        <p style={{
                          fontSize: "28px",
                          fontWeight: "900",
                          color: "#0a0a0a",
                          letterSpacing: "-1px"
                        }}>
                          R$ {Number(item.preco).toFixed(2)}
                        </p>
                      </div>

                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: "16px"
                      }}>
                        {/* Quantidade */}
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          background: "#fafafa",
                          borderRadius: "12px",
                          padding: "6px"
                        }}>
                          <button
                            onClick={() => alterarQuantidade(item.id, -1)}
                            style={{
                              width: "36px",
                              height: "36px",
                              background: "white",
                              border: "1px solid rgba(0,0,0,0.1)",
                              borderRadius: "8px",
                              fontSize: "18px",
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
                            width: "50px",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#0a0a0a"
                          }}>
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() => alterarQuantidade(item.id, 1)}
                            style={{
                              width: "36px",
                              height: "36px",
                              background: "white",
                              border: "1px solid rgba(0,0,0,0.1)",
                              borderRadius: "8px",
                              fontSize: "18px",
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

                        {/* Remover */}
                        <button
                          onClick={() => removerProduto(item.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#ef4444",
                            background: "none",
                            border: "none",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "opacity 0.2s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.opacity = "0.7"}
                          onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                        >
                          <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RESUMO */}
            <div style={{
              position: "sticky",
              top: "120px"
            }}>
              <div style={{
                background: "white",
                borderRadius: "20px",
                padding: "32px",
                border: "1px solid rgba(0,0,0,0.08)"
              }}>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#0a0a0a",
                  marginBottom: "32px",
                  letterSpacing: "-0.5px"
                }}>
                  Resumo do Pedido
                </h2>

                {/* Frete */}
                <div style={{
                  marginBottom: "32px",
                  paddingBottom: "32px",
                  borderBottom: "1px solid rgba(0,0,0,0.08)"
                }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "12px",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase"
                  }}>
                    Calcular Frete
                  </label>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(formatarCep(e.target.value))}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "500",
                        outline: "none",
                        transition: "border-color 0.2s"
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                      onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                    />
                    <button
                      onClick={calcularFrete}
                      disabled={carregandoFrete}
                      style={{
                        padding: "14px 24px",
                        background: "#0a0a0a",
                        color: "white",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: carregandoFrete ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        opacity: carregandoFrete ? 0.5 : 1
                      }}
                      onMouseOver={(e) => {
                        if (!carregandoFrete) e.currentTarget.style.background = "#2a2a2a";
                      }}
                      onMouseOut={(e) => {
                        if (!carregandoFrete) e.currentTarget.style.background = "#0a0a0a";
                      }}
                    >
                      {carregandoFrete ? "..." : "OK"}
                    </button>
                  </div>
                  {erroFrete && (
                    <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px", fontWeight: "500" }}>
                      {erroFrete}
                    </p>
                  )}
                  {frete !== null && (
                    <p style={{
                      color: "#10b981",
                      fontSize: "14px",
                      marginTop: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <svg style={{ width: "18px", height: "18px" }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      {frete === 0 ? "Frete Grátis!" : `Frete: R$ ${frete.toFixed(2)}`}
                    </p>
                  )}
                </div>

                {/* Valores */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    fontSize: "15px",
                    color: "#666"
                  }}>
                    <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
                    <span style={{ fontWeight: "600", color: "#0a0a0a" }}>
                      R$ {subtotal.toFixed(2)}
                    </span>
                  </div>
                  {frete !== null && (
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "15px",
                      color: "#666"
                    }}>
                      <span>Frete</span>
                      <span style={{ fontWeight: "600", color: "#0a0a0a" }}>
                        {frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "24px",
                  paddingBottom: "32px",
                  borderTop: "2px solid rgba(0,0,0,0.08)",
                  marginBottom: "24px"
                }}>
                  <span style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0a0a0a"
                  }}>
                    Total
                  </span>
                  <span style={{
                    fontSize: "36px",
                    fontWeight: "900",
                    color: "#0a0a0a",
                    letterSpacing: "-1.5px"
                  }}>
                    R$ {total.toFixed(2)}
                  </span>
                </div>

                {/* Botão */}
                <button
                  onClick={() => router.push("/checkout")}
                  style={{
                    width: "100%",
                    padding: "18px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    marginBottom: "16px"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#059669";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#10b981";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Finalizar Compra
                </button>

                <Link
                  href="/"
                  style={{
                    display: "block",
                    textAlign: "center",
                    color: "#666",
                    fontSize: "14px",
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
        )}
      </main>
    </div>
  );
}
