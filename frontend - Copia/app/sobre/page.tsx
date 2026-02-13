"use client";

import Link from "next/link";

export default function SobrePage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {/* Header simples */}
      <header style={{
        background: "white",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        padding: "24px 48px"
      }}>
        <div style={{
          maxWidth: "1440px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Link href="/" style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none"
          }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ height: "48px" }}
            />
          </Link>
          <Link href="/" style={{
            color: "#0a0a0a",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "600"
          }}>
            ← Voltar para loja
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <div style={{
        maxWidth: "900px",
        margin: "80px auto",
        padding: "0 48px"
      }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "900",
          color: "#0a0a0a",
          marginBottom: "24px",
          letterSpacing: "-1.5px"
        }}>
          Sobre Nós
        </h1>

        <p style={{
          fontSize: "20px",
          color: "#666",
          lineHeight: "1.8",
          marginBottom: "48px"
        }}>
          Bem-vindo ao <strong style={{ color: "#0a0a0a" }}>Empório Bothanico</strong>, onde a natureza e a sofisticação se encontram.
        </p>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "20px",
            letterSpacing: "-0.8px"
          }}>
            Nossa História
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#666",
            lineHeight: "1.8",
            marginBottom: "20px"
          }}>
            Fundado com a paixão por fragrâncias únicas e produtos naturais, o Empório Bothanico nasceu do desejo de proporcionar experiências sensoriais inesquecíveis. Cada produto é cuidadosamente selecionado para trazer o melhor da natureza até você.
          </p>
          <p style={{
            fontSize: "16px",
            color: "#666",
            lineHeight: "1.8"
          }}>
            Combinamos tradição artesanal com inovação moderna, criando uma linha de produtos que respeitam o meio ambiente e valorizam a qualidade acima de tudo.
          </p>
        </div>

        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          marginBottom: "32px",
          border: "1px solid rgba(0,0,0,0.06)"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#0a0a0a",
            marginBottom: "20px",
            letterSpacing: "-0.8px"
          }}>
            Nossos Valores
          </h2>
          <div style={{
            display: "grid",
            gap: "24px"
          }}>
            {[
              { icon: "🌿", title: "Sustentabilidade", desc: "Produtos naturais que respeitam o meio ambiente" },
              { icon: "✨", title: "Qualidade Premium", desc: "Seleção rigorosa dos melhores ingredientes" },
              { icon: "❤️", title: "Feito com Amor", desc: "Cada produto é preparado com cuidado e atenção" },
              { icon: "🚚", title: "Entrega Rápida", desc: "Seu pedido chega com segurança e rapidez" }
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex",
                gap: "20px",
                padding: "24px",
                background: "#fafafa",
                borderRadius: "16px"
              }}>
                <div style={{ fontSize: "32px" }}>{item.icon}</div>
                <div>
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0a0a0a",
                    marginBottom: "8px"
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: "15px",
                    color: "#666",
                    lineHeight: "1.6"
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
          borderRadius: "24px",
          padding: "48px",
          color: "white",
          textAlign: "center"
        }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: "800",
            marginBottom: "16px",
            letterSpacing: "-0.8px"
          }}>
            Entre em Contato
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#ccc",
            marginBottom: "32px",
            lineHeight: "1.6"
          }}>
            Tem alguma dúvida ou sugestão? Adoraríamos ouvir você!
          </p>
          <Link
            href="/contato"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              background: "white",
              color: "#0a0a0a",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none",
              transition: "all 0.3s"
            }}
          >
            Fale Conosco
          </Link>
        </div>
      </div>
    </div>
  );
}
