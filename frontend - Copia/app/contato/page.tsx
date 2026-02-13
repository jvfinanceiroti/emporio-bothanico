"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContatoPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);

  const enviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode integrar com um serviço de email
    console.log({ nome, email, mensagem });
    setEnviado(true);
    setTimeout(() => {
      setNome("");
      setEmail("");
      setMensagem("");
      setEnviado(false);
    }, 3000);
  };

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
        maxWidth: "1200px",
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
          Entre em Contato
        </h1>

        <p style={{
          fontSize: "18px",
          color: "#666",
          textAlign: "center",
          marginBottom: "64px",
          lineHeight: "1.8"
        }}>
          Estamos aqui para ajudar! Envie sua mensagem e responderemos em breve.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "48px"
        }}>
          {/* Formulário */}
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "48px",
            border: "1px solid rgba(0,0,0,0.06)"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#0a0a0a",
              marginBottom: "32px",
              letterSpacing: "-0.5px"
            }}>
              Envie sua Mensagem
            </h2>

            <form onSubmit={enviarMensagem}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0a0a0a",
                  marginBottom: "8px"
                }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0a0a0a",
                  marginBottom: "8px"
                }}>
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0a0a0a",
                  marginBottom: "8px"
                }}>
                  Mensagem
                </label>
                <textarea
                  required
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  rows={6}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    resize: "vertical",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "#0a0a0a",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseOver={(e) => e.currentTarget.style.background = "#1a1a1a"}
                onMouseOut={(e) => e.currentTarget.style.background = "#0a0a0a"}
              >
                {enviado ? "✓ Mensagem Enviada!" : "Enviar Mensagem"}
              </button>
            </form>
          </div>

          {/* Informações de Contato */}
          <div>
            <div style={{
              background: "white",
              borderRadius: "24px",
              padding: "48px",
              marginBottom: "24px",
              border: "1px solid rgba(0,0,0,0.06)"
            }}>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#0a0a0a",
                marginBottom: "32px",
                letterSpacing: "-0.5px"
              }}>
                Informações de Contato
              </h3>

              <div style={{ marginBottom: "32px" }}>
                <div style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "16px",
                  marginBottom: "24px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    minWidth: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                    borderRadius: "10px"
                  }}>
                    📧
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "4px"
                    }}>
                      E-mail
                    </h4>
                    <p style={{
                      fontSize: "15px",
                      color: "#666"
                    }}>
                      contato@emporiobothanico.com.br
                    </p>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "16px",
                  marginBottom: "24px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    minWidth: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                    borderRadius: "10px"
                  }}>
                    📱
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "4px"
                    }}>
                      Telefone / WhatsApp
                    </h4>
                    <p style={{
                      fontSize: "15px",
                      color: "#666"
                    }}>
                      (11) 99999-9999
                    </p>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "16px"
                }}>
                  <div style={{
                    fontSize: "24px",
                    minWidth: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fafafa",
                    borderRadius: "10px"
                  }}>
                    🕐
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      marginBottom: "4px"
                    }}>
                      Horário de Atendimento
                    </h4>
                    <p style={{
                      fontSize: "15px",
                      color: "#666"
                    }}>
                      Segunda à Sexta: 9h às 18h
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
              borderRadius: "24px",
              padding: "32px",
              color: "white",
              textAlign: "center"
            }}>
              <h4 style={{
                fontSize: "18px",
                fontWeight: "800",
                marginBottom: "12px"
              }}>
                Precisa de ajuda rápida?
              </h4>
              <p style={{
                fontSize: "14px",
                color: "#ccc",
                marginBottom: "20px"
              }}>
                Consulte nossa central de ajuda
              </p>
              <Link
                href="/ajuda"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "white",
                  color: "#0a0a0a",
                  borderRadius: "10px",
                  fontSize: "14px",
                  fontWeight: "700",
                  textDecoration: "none"
                }}
              >
                Central de Ajuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
