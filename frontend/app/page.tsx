"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function Home() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [carrinho, setCarrinho] = useState<any[]>([]);

  const carregarProdutos = () => {
    fetch(`${API_URL}/produtos`)
      .then(res => res.json())
      .then(data => {
        const produtosAtivos = data.filter((p: any) => p.ativo === true && p.estoque > 0);
        setProdutos(produtosAtivos);
      });
  };

  useEffect(() => {
    carregarProdutos();
    
    const interval = setInterval(() => {
      carregarProdutos();
    }, 3000);

    const carrinhoLocal = localStorage.getItem("carrinho");
    if (carrinhoLocal) {
      setCarrinho(JSON.parse(carrinhoLocal));
    }

    return () => clearInterval(interval);
  }, []);

  const adicionarAoCarrinho = (produto: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const novoCarrinho = [...carrinho];
    const itemExistente = novoCarrinho.find(item => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      novoCarrinho.push({ ...produto, quantidade: 1 });
    }

    setCarrinho(novoCarrinho);
    localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));

    const btn = e.currentTarget as HTMLButtonElement;
    btn.textContent = "✓ Adicionado!";
    btn.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
    setTimeout(() => {
      btn.innerHTML = '<svg style="width:20px;height:20px;display:inline" fill="currentColor" viewBox="0 0 20 20"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path></svg> Adicionar ao Carrinho';
      btn.style.background = "";
    }, 1500);
  };

  const totalItensCarrinho = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff"
    }}>
      {/* HEADER MODERNO */}
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
          <Link href="/" style={{ 
            textDecoration: "none", 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            flex: "1",
            minWidth: 0
          }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: "48px", 
                width: "48px",
                objectFit: "contain",
                flexShrink: 0
              }} 
            />
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <h1 style={{
                fontSize: "clamp(16px, 4vw, 28px)",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.5px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                Empório Bothanico
              </h1>
              <p style={{ 
                fontSize: "9px", 
                color: "#888", 
                margin: 0, 
                fontWeight: 500,
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>
                Delicadezas & Banho
              </p>
            </div>
          </Link>

          <nav style={{ display: "flex", gap: "12px", alignItems: "center", flexShrink: 0 }}>
            <Link 
              href="/carrinho"
              style={{
                position: "relative",
                padding: "10px 16px",
                background: "#0a0a0a",
                color: "white",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "13px",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                border: "2px solid #0a0a0a",
                whiteSpace: "nowrap"
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
              <svg style={{ width: "16px", height: "16px" }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
              </svg>
              Carrinho
              {totalItensCarrinho > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "#ef4444",
                  color: "white",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  border: "2px solid white"
                }}>
                  {totalItensCarrinho}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={{
        position: "relative",
        padding: "60px 24px",
        overflow: "hidden",
        minHeight: "600px"
      }}>
        {/* Vídeo de fundo */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=1200&q=80"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            objectFit: "cover",
            opacity: 0.6
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-green-leaves-of-a-plant-moving-in-the-wind-1188-large.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/5702761/5702761-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>

        {/* Overlay branco */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(245,245,245,0.65) 100%)",
          zIndex: 1
        }}></div>

        <div style={{ 
          maxWidth: "900px", 
          margin: "0 auto", 
          textAlign: "center",
          position: "relative",
          zIndex: 2,
          padding: "0 20px"
        }}>

          
          <h2 style={{
            fontSize: "clamp(32px, 8vw, 64px)",
            fontWeight: "900",
            color: "#0a0a0a",
            marginBottom: "24px",
            letterSpacing: "-2px",
            lineHeight: "1.1",
            fontFamily: "system-ui, -apple-system, sans-serif"
          }}>
            Fragrâncias que<br/>Contam Histórias
          </h2>
          
          <p style={{
            fontSize: "clamp(16px, 3vw, 20px)",
            color: "#666",
            lineHeight: "1.7",
            maxWidth: "700px",
            margin: "0 auto 40px",
            fontWeight: 400
          }}>
            Cada essência é cuidadosamente selecionada para proporcionar uma experiência única e memorável
          </p>

          <div style={{
            display: "flex",
            gap: "48px",
            justifyContent: "center",
            marginTop: "48px"
          }}>
            <StatBadge number="1000+" label="Produtos Vendidos" />
            <StatBadge number="5★" label="Avaliação Clientes" />
            <StatBadge number="24h" label="Envio Rápido" />
          </div>
        </div>
      </section>

      {/* PRODUTOS GRID */}
      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "80px 48px" }}>
        <div style={{ marginBottom: "48px" }}>
          <h3 style={{
            fontSize: "14px",
            fontWeight: "600",
            color: "#888",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px"
          }}>
            Nossa Seleção
          </h3>
          <h2 style={{
            fontSize: "42px",
            fontWeight: "800",
            color: "#0a0a0a",
            letterSpacing: "-1px"
          }}>
            Produtos em Destaque
          </h2>
        </div>

        {produtos.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "120px 48px",
            background: "#fafafa",
            borderRadius: "24px"
          }}>
            <div style={{ fontSize: "72px", marginBottom: "24px" }}>🌿</div>
            <p style={{ fontSize: "18px", color: "#999", fontWeight: 500 }}>
              Novos produtos chegando em breve...
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "32px"
          }}>
            {produtos.map((produto) => (
              <Link 
                key={produto.id} 
                href={`/produto/${produto.id}`}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.08)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.12)";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.08)";
                }}
                >
                  {/* IMAGEM */}
                  <div style={{
                    position: "relative",
                    height: "360px",
                    background: "#fafafa",
                    overflow: "hidden"
                  }}>
                    {produto.imagem_url ? (
                      <img 
                        src={produto.imagem_url} 
                        alt={produto.nome}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.6s ease"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x400/fafafa/ccc?text=Sem+Imagem';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "64px"
                      }}>
                        🌸
                      </div>
                    )}
                    
                    {/* BADGE ESTOQUE */}
                    {produto.estoque <= 5 && produto.estoque > 0 && (
                      <div style={{
                        position: "absolute",
                        top: "16px",
                        left: "16px",
                        background: "#0a0a0a",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px"
                      }}>
                        Últimas Unidades
                      </div>
                    )}
                  </div>

                  {/* CONTEÚDO */}
                  <div style={{ padding: "32px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#999",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "12px"
                    }}>
                      Empório Botânico
                    </div>

                    <h3 style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "12px",
                      lineHeight: "1.3",
                      letterSpacing: "-0.5px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}>
                      {produto.nome}
                    </h3>

                    {produto.descricao && (
                      <p style={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: "1.6",
                        marginBottom: "24px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical"
                      }}>
                        {produto.descricao}
                      </p>
                    )}

                    <div style={{ marginTop: "auto" }}>
                      <div style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginBottom: "8px"
                      }}>
                        <span style={{
                          fontSize: "36px",
                          fontWeight: "900",
                          color: "#0a0a0a",
                          letterSpacing: "-1px"
                        }}>
                          R$ {Number(produto.preco).toFixed(2)}
                        </span>
                      </div>

                      <p style={{
                        fontSize: "12px",
                        color: produto.estoque > 5 ? "#10b981" : "#f59e0b",
                        fontWeight: "600",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <span style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: produto.estoque > 5 ? "#10b981" : "#f59e0b"
                        }}></span>
                        {produto.estoque} em estoque
                      </p>

                      <button
                        onClick={(e) => adicionarAoCarrinho(produto, e)}
                        style={{
                          width: "100%",
                          padding: "16px",
                          background: "#0a0a0a",
                          color: "white",
                          border: "2px solid #0a0a0a",
                          borderRadius: "12px",
                          fontSize: "15px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px"
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
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* SEÇÃO DE BENEFÍCIOS */}
      <section style={{
        background: "#fafafa",
        padding: "80px 48px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "48px"
        }}>
          <FeatureCard
            icon={
              <svg style={{ width: "32px", height: "32px" }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"></path>
              </svg>
            }
            title="Entrega Nacional"
            description="Enviamos para todo Brasil com rastreamento em tempo real"
          />
          <FeatureCard
            icon={
              <svg style={{ width: "32px", height: "32px" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            }
            title="Qualidade Garantida"
            description="Produtos 100% originais com garantia de autenticidade"
          />
          <FeatureCard
            icon={
              <svg style={{ width: "32px", height: "32px" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
            }
            title="Pagamento Seguro"
            description="Ambiente 100% seguro e criptografado para suas compras"
          />
          <FeatureCard
            icon={
              <svg style={{ width: "32px", height: "32px" }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
              </svg>
            }
            title="Embalagem Premium"
            description="Cada pedido é cuidadosamente embalado para presentear"
          />
        </div>
      </section>

      {/* FOOTER PREMIUM */}
      <footer style={{
        background: "#0a0a0a",
        color: "white",
        padding: "clamp(40px, 10vw, 80px) clamp(20px, 5vw, 48px) 40px"
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto"
        }}>
          {/* Footer Content */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "clamp(32px, 8vw, 64px)",
            marginBottom: "clamp(32px, 8vw, 64px)"
          }}>
            {/* Coluna 1 - Logo e Descrição */}
            <div>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ 
                  height: "clamp(48px, 10vw, 64px)", 
                  marginBottom: "20px",
                  filter: "brightness(0) invert(1)"
                }} 
              />
              <h3 style={{
                fontSize: "clamp(18px, 4vw, 24px)",
                fontWeight: "800",
                marginBottom: "12px",
                letterSpacing: "-0.5px"
              }}>
                Empório Bothanico
              </h3>
              <p style={{
                fontSize: "clamp(13px, 2.5vw, 14px)",
                color: "#999",
                lineHeight: "1.7",
                marginBottom: "20px"
              }}>
                Oferecemos uma experiência única em fragrâncias e produtos de banho, cuidadosamente selecionados para você.
              </p>
            </div>

            {/* Coluna 2 - Links */}
            <div>
              <h4 style={{
                fontSize: "clamp(11px, 2.2vw, 13px)",
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "16px",
                color: "#fff"
              }}>
                Navegação
              </h4>
              <FooterLink href="/">Início</FooterLink>
              <FooterLink href="/produtos">Produtos</FooterLink>
              <FooterLink href="/sobre">Sobre Nós</FooterLink>
              <FooterLink href="/contato">Contato</FooterLink>
            </div>

            {/* Coluna 3 - Atendimento */}
            <div>
              <h4 style={{
                fontSize: "clamp(11px, 2.2vw, 13px)",
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "16px",
                color: "#fff"
              }}>
                Atendimento
              </h4>
              <FooterLink href="/ajuda">Central de Ajuda</FooterLink>
              <FooterLink href="/trocas">Trocas e Devoluções</FooterLink>
              <FooterLink href="/entregas">Política de Entrega</FooterLink>
              <FooterLink href="/privacidade">Privacidade</FooterLink>
            </div>

            {/* Coluna 4 - Contato */}
            <div>
              <h4 style={{
                fontSize: "clamp(11px, 2.2vw, 13px)",
                fontWeight: "700",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "16px",
                color: "#fff"
              }}>
                Fale Conosco
              </h4>
              <p style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#999", marginBottom: "12px", wordBreak: "break-word" }}>
                📧 contato@emporiobothanico.com.br
              </p>
              <p style={{ fontSize: "clamp(12px, 2.5vw, 14px)", color: "#999", marginBottom: "12px", wordBreak: "break-word" }}>
                📱 (11) 99999-9999
              </p>
              <p style={{ fontSize: "14px", color: "#999" }}>
                🕐 Seg-Sex: 9h às 18h
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{
            paddingTop: "40px",
            paddingBottom: "40px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)"
          }}>
            <h4 style={{
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "24px",
              color: "#fff",
              textAlign: "center"
            }}>
              Formas de Pagamento
            </h4>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap"
            }}>
              {/* Cartões de Crédito */}
              <PaymentIcon>
                <svg style={{ width: "48px", height: "32px" }} viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="white"/>
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#1434CB" fontSize="10" fontWeight="bold">VISA</text>
                </svg>
              </PaymentIcon>

              <PaymentIcon>
                <svg style={{ width: "48px", height: "32px" }} viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="white"/>
                  <circle cx="18" cy="16" r="8" fill="#EB001B"/>
                  <circle cx="30" cy="16" r="8" fill="#F79E1B"/>
                </svg>
              </PaymentIcon>

              <PaymentIcon>
                <svg style={{ width: "48px", height: "32px" }} viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="white"/>
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#016FD0" fontSize="9" fontWeight="bold">ELO</text>
                </svg>
              </PaymentIcon>

              <PaymentIcon>
                <svg style={{ width: "48px", height: "32px" }} viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="white"/>
                  <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#0066B2" fontSize="7" fontWeight="bold">AMEX</text>
                </svg>
              </PaymentIcon>

              {/* PIX */}
              <PaymentIcon>
                <svg style={{ width: "48px", height: "32px" }} viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="#32BCAD"/>
                  <path d="M24 8L28 12L24 16L20 12L24 8Z" fill="white"/>
                  <path d="M24 16L28 20L24 24L20 20L24 16Z" fill="white"/>
                  <path d="M16 12L20 16L16 20L12 16L16 12Z" fill="white"/>
                  <path d="M32 12L36 16L32 20L28 16L32 12Z" fill="white"/>
                </svg>
              </PaymentIcon>

              {/* Boleto */}
              <PaymentIcon>
                <svg style={{ width: "48px", height: "32px" }} viewBox="0 0 48 32" fill="none">
                  <rect width="48" height="32" rx="4" fill="white"/>
                  <rect x="8" y="8" width="2" height="16" fill="#FF6B00"/>
                  <rect x="12" y="8" width="1" height="16" fill="#FF6B00"/>
                  <rect x="15" y="8" width="2" height="16" fill="#FF6B00"/>
                  <rect x="19" y="8" width="1" height="16" fill="#FF6B00"/>
                  <rect x="22" y="8" width="2" height="16" fill="#FF6B00"/>
                  <rect x="26" y="8" width="3" height="16" fill="#FF6B00"/>
                  <rect x="31" y="8" width="1" height="16" fill="#FF6B00"/>
                  <rect x="34" y="8" width="2" height="16" fill="#FF6B00"/>
                  <rect x="38" y="8" width="2" height="16" fill="#FF6B00"/>
                </svg>
              </PaymentIcon>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            paddingTop: "32px",
            textAlign: "center"
          }}>
            <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
              © 2026 Empório Bothanico - Delicadezas e Banho. Todos os direitos reservados.
            </p>
            <p style={{ fontSize: "12px", color: "#555", marginTop: "8px" }}>
              CNPJ: 00.000.000/0001-00 | Razão Social: Empório Bothanico LTDA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatBadge({ number, label }: any) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontSize: "36px",
        fontWeight: "900",
        color: "#0a0a0a",
        marginBottom: "8px",
        letterSpacing: "-1px"
      }}>
        {number}
      </div>
      <div style={{
        fontSize: "13px",
        color: "#666",
        fontWeight: "600",
        letterSpacing: "0.5px"
      }}>
        {label}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: "64px",
        height: "64px",
        background: "white",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        color: "#0a0a0a"
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: "18px",
        fontWeight: "700",
        color: "#0a0a0a",
        marginBottom: "12px",
        letterSpacing: "-0.3px"
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: "14px",
        color: "#666",
        lineHeight: "1.6"
      }}>
        {description}
      </p>
    </div>
  );
}

function FooterLink({ href, children }: any) {
  return (
    <a 
      href={href}
      style={{
        display: "block",
        fontSize: "14px",
        color: "#999",
        textDecoration: "none",
        marginBottom: "12px",
        transition: "color 0.2s"
      }}
      onMouseOver={(e) => e.currentTarget.style.color = "#fff"}
      onMouseOut={(e) => e.currentTarget.style.color = "#999"}
    >
      {children}
    </a>
  );
}

function PaymentIcon({ children }: any) {
  return (
    <div style={{
      padding: "8px",
      background: "rgba(255,255,255,0.05)",
      borderRadius: "8px",
      border: "1px solid rgba(255,255,255,0.1)",
      transition: "all 0.3s"
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
      e.currentTarget.style.transform = "translateY(0)";
    }}
    >
      {children}
    </div>
  );
}
