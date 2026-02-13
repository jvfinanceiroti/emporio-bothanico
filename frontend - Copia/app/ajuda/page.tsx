"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    categoria: "Pedidos",
    perguntas: [
      {
        q: "Como faço um pedido?",
        a: "Navegue pelo site, adicione produtos ao carrinho e clique em 'Finalizar Pedido'. Preencha seus dados e escolha a forma de pagamento."
      },
      {
        q: "Posso cancelar meu pedido?",
        a: "Sim! Pedidos podem ser cancelados antes do envio. Entre em contato conosco imediatamente."
      },
      {
        q: "Como acompanho meu pedido?",
        a: "Após a compra, você receberá um e-mail com o código de rastreamento. Use-o no site dos Correios."
      }
    ]
  },
  {
    categoria: "Pagamento",
    perguntas: [
      {
        q: "Quais formas de pagamento são aceitas?",
        a: "Aceitamos PIX, Cartão de Crédito e Boleto Bancário."
      },
      {
        q: "O pagamento é seguro?",
        a: "Sim! Utilizamos criptografia SSL e parceiros de pagamento confiáveis."
      },
      {
        q: "Quando meu pagamento será processado?",
        a: "PIX: instantâneo | Cartão: até 2 dias úteis | Boleto: até 3 dias úteis após compensação."
      }
    ]
  },
  {
    categoria: "Entrega",
    perguntas: [
      {
        q: "Qual o prazo de entrega?",
        a: "Varia de acordo com sua região: Sul/Sudeste 5-7 dias | Outras regiões 7-12 dias úteis."
      },
      {
        q: "Quanto custa o frete?",
        a: "Calculado automaticamente no checkout baseado no CEP e peso dos produtos."
      },
      {
        q: "Fazem entrega em todo o Brasil?",
        a: "Sim! Entregamos para todo o território nacional via Correios."
      }
    ]
  },
  {
    categoria: "Trocas e Devoluções",
    perguntas: [
      {
        q: "Posso trocar um produto?",
        a: "Sim! Você tem até 7 dias após o recebimento para solicitar troca ou devolução."
      },
      {
        q: "Como solicito uma troca?",
        a: "Entre em contato conosco pelo e-mail ou WhatsApp informando o número do pedido."
      },
      {
        q: "Quem paga o frete da troca?",
        a: "Se o produto tiver defeito, nós arcamos com o frete. Caso contrário, o custo é do cliente."
      }
    ]
  }
];

export default function AjudaPage() {
  const [aberto, setAberto] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      {/* Header */}
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
          letterSpacing: "-1.5px",
          textAlign: "center"
        }}>
          Central de Ajuda
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#666",
          textAlign: "center",
          marginBottom: "64px",
          lineHeight: "1.8"
        }}>
          Encontre respostas rápidas para as perguntas mais frequentes
        </p>

        {faqs.map((secao, idx) => (
          <div key={idx} style={{
            background: "white",
            borderRadius: "24px",
            padding: "40px",
            marginBottom: "32px",
            border: "1px solid rgba(0,0,0,0.06)"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0a0a0a",
              marginBottom: "24px",
              letterSpacing: "-0.5px"
            }}>
              {secao.categoria}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {secao.perguntas.map((faq, i) => {
                const id = `${idx}-${i}`;
                const estaAberto = aberto === id;

                return (
                  <div key={i} style={{
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "all 0.3s"
                  }}>
                    <button
                      onClick={() => setAberto(estaAberto ? null : id)}
                      style={{
                        width: "100%",
                        padding: "20px 24px",
                        background: estaAberto ? "#fafafa" : "white",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                    >
                      <span style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#0a0a0a",
                        textAlign: "left"
                      }}>
                        {faq.q}
                      </span>
                      <span style={{
                        fontSize: "20px",
                        color: "#666",
                        transition: "transform 0.3s",
                        transform: estaAberto ? "rotate(180deg)" : "rotate(0)"
                      }}>
                        ▼
                      </span>
                    </button>

                    {estaAberto && (
                      <div style={{
                        padding: "0 24px 24px",
                        background: "#fafafa",
                        animation: "fadeIn 0.3s"
                      }}>
                        <p style={{
                          fontSize: "15px",
                          color: "#666",
                          lineHeight: "1.7"
                        }}>
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Contato */}
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
            Não encontrou o que procurava?
          </h2>
          <p style={{
            fontSize: "16px",
            color: "#ccc",
            marginBottom: "32px",
            lineHeight: "1.6"
          }}>
            Nossa equipe está pronta para ajudar você!
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
              marginRight: "16px"
            }}
          >
            Fale Conosco
          </Link>
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              background: "#25D366",
              color: "white",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none"
            }}
          >
            💬 WhatsApp
          </a>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
