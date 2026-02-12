"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  peso_kg?: number;
  altura_cm?: number;
  largura_cm?: number;
  comprimento_cm?: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [carregandoFrete, setCarregandoFrete] = useState(false);

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho") || "[]");
    
    if (carrinhoSalvo.length === 0) {
      router.push("/carrinho");
      return;
    }

    setCarrinho(carrinhoSalvo);
  }, [router]);

  useEffect(() => {
    const buscarCepAutomatico = async () => {
      const cepLimpo = cep.replace(/\D/g, "");
      
      if (cepLimpo.length === 8) {
        setCarregandoCep(true);
        setErro("");

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await response.json();

          if (data.erro) {
            setErro("CEP não encontrado");
            setEndereco("");
            setBairro("");
            setCidade("");
            setEstado("");
            setFrete(null);
            return;
          }

          setEndereco(data.logradouro || "");
          setBairro(data.bairro || "");
          setCidade(data.localidade || "");
          setEstado(data.uf || "");
          setErro("");

          // Calcular frete automaticamente após buscar CEP
          if (numero) {
            calcularFrete(data.uf);
          }
        } catch (error) {
          setErro("Erro ao buscar CEP");
        } finally {
          setCarregandoCep(false);
        }
      }
    };

    const timer = setTimeout(() => {
      buscarCepAutomatico();
    }, 500);

    return () => clearTimeout(timer);
  }, [cep]);

  useEffect(() => {
    if (cep.replace(/\D/g, "").length === 8 && numero && estado) {
      calcularFrete(estado);
    }
  }, [numero, estado, cep]);

  const calcularFrete = async (uf: string) => {
    setCarregandoFrete(true);

    // Calcular peso total e dimensões máximas
    const carrinhoAgrupado = carrinho.reduce((acc: any[], item) => {
      const existente = acc.find((i) => i.id === item.id);
      if (existente) {
        existente.quantidade += 1;
      } else {
        acc.push({ ...item, quantidade: 1 });
      }
      return acc;
    }, []);

    let pesoTotal = 0;
    let alturaMax = 0;
    let larguraMax = 0;
    let comprimentoMax = 0;

    carrinhoAgrupado.forEach(item => {
      pesoTotal += (item.peso_kg || 0.5) * item.quantidade;
      alturaMax = Math.max(alturaMax, item.altura_cm || 10);
      larguraMax = Math.max(larguraMax, item.largura_cm || 10);
      comprimentoMax = Math.max(comprimentoMax, item.comprimento_cm || 15);
    });

    // Simular cálculo de frete baseado no estado e peso
    await new Promise(resolve => setTimeout(resolve, 800));

    let valorFrete = 0;

    // Frete base por região
    const fretesBase: Record<string, number> = {
      'SP': 15.00,
      'RJ': 18.00,
      'MG': 20.00,
      'ES': 22.00,
      'PR': 25.00,
      'SC': 27.00,
      'RS': 30.00,
      'GO': 28.00,
      'DF': 25.00,
      'MT': 35.00,
      'MS': 32.00,
      'BA': 30.00,
      'SE': 32.00,
      'AL': 33.00,
      'PE': 35.00,
      'PB': 36.00,
      'RN': 37.00,
      'CE': 38.00,
      'PI': 40.00,
      'MA': 42.00,
      'PA': 45.00,
      'AP': 50.00,
      'AM': 52.00,
      'RR': 55.00,
      'AC': 57.00,
      'RO': 48.00,
      'TO': 40.00
    };

    valorFrete = fretesBase[uf] || 35.00;

    // Adicionar valor por peso extra (acima de 1kg)
    if (pesoTotal > 1) {
      valorFrete += (pesoTotal - 1) * 5.00;
    }

    setFrete(valorFrete);
    setCarregandoFrete(false);
  };

  const validarFormulario = () => {
    if (!nome || !email || !telefone) {
      setErro("Preencha seus dados pessoais");
      return false;
    }

    if (!cep || !endereco || !numero || !bairro || !cidade || !estado) {
      setErro("Preencha o endereço completo");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("Email inválido");
      return false;
    }

    return true;
  };

  const abrirSelecaoPagamento = () => {
    if (!validarFormulario()) return;
    setMostrarPagamento(true);
    setErro("");
  };

  const finalizarPedido = async () => {
    if (!formaPagamento) {
      setErro("Selecione uma forma de pagamento");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const response = await fetch("http://localhost:3001/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itens: carrinho,
          cliente: {
            nome,
            email,
            telefone,
          },
          endereco: {
            cep,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado
          },
          frete: frete || 0,
          formaPagamento: formaPagamento,
        }),
      });

      if (response.ok) {
        localStorage.removeItem("carrinho");
        const data = await response.json();
        router.push(`/pagamento?pedido=${data.id}`);
      } else {
        setErro("Erro ao finalizar pedido. Tente novamente.");
      }
    } catch (error) {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numeros.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };

  const formatarCep = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  };

  const subtotal = carrinho.reduce((acc, item) => acc + Number(item.preco), 0);
  const total = subtotal + (frete || 0);

  const carrinhoAgrupado = carrinho.reduce((acc: any[], item) => {
    const existente = acc.find((i) => i.id === item.id);
    if (existente) {
      existente.quantidade += 1;
    } else {
      acc.push({ ...item, quantidade: 1 });
    }
    return acc;
  }, []);

  const totalItens = carrinhoAgrupado.reduce((acc, item) => acc + item.quantidade, 0);

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
          padding: "20px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <Link 
            href="/carrinho"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#666",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "600",
              transition: "color 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
            onMouseOut={(e) => e.currentTarget.style.color = "#666"}
          >
            <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Carrinho
          </Link>

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

          <div style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "#0a0a0a",
            letterSpacing: "-0.5px"
          }}>
            Finalizar Pedido
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "80px 48px" }}>
        {erro && (
          <div style={{
            marginBottom: "32px",
            background: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "16px 20px",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "14px",
            fontWeight: "500"
          }}>
            <svg style={{ width: "20px", height: "20px", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {erro}
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 420px",
          gap: "40px",
          alignItems: "start"
        }}>
          {/* FORMULÁRIO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Dados Pessoais */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "#0a0a0a",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "800"
                }}>
                  1
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#0a0a0a",
                  margin: 0,
                  letterSpacing: "-0.5px"
                }}>
                  Dados Pessoais
                </h2>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    placeholder="João Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="joao@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    value={telefone}
                    onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "32px"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  background: "#0a0a0a",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: "800"
                }}>
                  2
                </div>
                <h2 style={{
                  fontSize: "24px",
                  fontWeight: "800",
                  color: "#0a0a0a",
                  margin: 0,
                  letterSpacing: "-0.5px"
                }}>
                  Endereço de Entrega
                </h2>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    CEP * {carregandoCep && <span style={{ color: "#10b981" }}>Buscando...</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => setCep(formatarCep(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Número *
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Endereço *
                  </label>
                  <input
                    type="text"
                    placeholder="Rua, Avenida..."
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Complemento
                  </label>
                  <input
                    type="text"
                    placeholder="Apt, Bloco, Casa..."
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Bairro *
                  </label>
                  <input
                    type="text"
                    placeholder="Centro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Cidade *
                  </label>
                  <input
                    type="text"
                    placeholder="São Paulo"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "8px",
                    letterSpacing: "0.3px"
                  }}>
                    Estado *
                  </label>
                  <input
                    type="text"
                    placeholder="SP"
                    maxLength={2}
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase())}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "10px",
                      fontSize: "15px",
                      fontWeight: "500",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESUMO */}
          <div style={{ position: "sticky", top: "120px" }}>
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

              <div style={{
                maxHeight: "240px",
                overflowY: "auto",
                marginBottom: "24px",
                paddingRight: "8px"
              }}>
                {carrinhoAgrupado.map((item: any) => (
                  <div key={item.id} style={{
                    display: "flex",
                    gap: "16px",
                    paddingBottom: "20px",
                    marginBottom: "20px",
                    borderBottom: "1px solid rgba(0,0,0,0.06)"
                  }}>
                    {item.imagem_url ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        style={{
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          background: "#fafafa"
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100x100/fafafa/ccc?text=Sem+Imagem';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "64px",
                        height: "64px",
                        background: "#fafafa",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px"
                      }}>
                        🌸
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#0a0a0a",
                        marginBottom: "4px"
                      }}>
                        {item.nome}
                      </h4>
                      <p style={{
                        fontSize: "13px",
                        color: "#666",
                        marginBottom: "6px"
                      }}>
                        Qtd: {item.quantidade}
                      </p>
                      <p style={{
                        fontSize: "16px",
                        fontWeight: "700",
                        color: "#0a0a0a"
                      }}>
                        R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  fontSize: "15px",
                  color: "#666"
                }}>
                  <span>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
                  <span style={{ fontWeight: "600", color: "#0a0a0a" }}>
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "15px",
                  color: "#666"
                }}>
                  <span>
                    Frete {carregandoFrete && <span style={{ fontSize: "12px" }}>(calculando...)</span>}
                  </span>
                  <span style={{ fontWeight: "600", color: "#0a0a0a" }}>
                    {frete === null ? "Calcular" : frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2)}`}
                  </span>
                </div>
              </div>

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

              <button
                onClick={abrirSelecaoPagamento}
                disabled={carregando}
                style={{
                  width: "100%",
                  padding: "18px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: carregando ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: carregando ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (!carregando) {
                    e.currentTarget.style.background = "#059669";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(16, 185, 129, 0.3)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!carregando) {
                    e.currentTarget.style.background = "#10b981";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                💳 Finalizar Pagamento
              </button>

              <div style={{
                marginTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "13px",
                color: "#999"
              }}>
                <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Compra 100% segura
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE PAGAMENTO */}
      {mostrarPagamento && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setMostrarPagamento(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "20px",
              maxWidth: "560px",
              width: "100%",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "24px"
            }}>
              <h2 style={{
                fontSize: "28px",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.8px"
              }}>
                Forma de Pagamento
              </h2>
              <button
                onClick={() => setMostrarPagamento(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#999",
                  cursor: "pointer",
                  transition: "color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
                onMouseOut={(e) => e.currentTarget.style.color = "#999"}
              >
                <svg style={{ width: "24px", height: "24px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p style={{
              fontSize: "15px",
              color: "#666",
              marginBottom: "32px"
            }}>
              Selecione como deseja pagar:
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: "32px"
            }}>
              {/* PIX */}
              <button
                onClick={() => setFormaPagamento("pix")}
                style={{
                  width: "100%",
                  padding: "24px",
                  borderRadius: "16px",
                  border: `2px solid ${formaPagamento === "pix" ? "#10b981" : "rgba(0,0,0,0.1)"}`,
                  background: formaPagamento === "pix" ? "rgba(16, 185, 129, 0.05)" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left"
                }}
                onMouseOver={(e) => {
                  if (formaPagamento !== "pix") {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  if (formaPagamento !== "pix") {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: `2px solid ${formaPagamento === "pix" ? "#10b981" : "#ddd"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {formaPagamento === "pix" && (
                      <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#10b981"
                      }}></div>
                    )}
                  </div>
                  <svg style={{ width: "32px", height: "32px" }} viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#32BCAD"/>
                    <path d="M24 12L30 18L24 24L18 18L24 12Z" fill="white"/>
                    <path d="M24 24L30 30L24 36L18 30L24 24Z" fill="white"/>
                    <path d="M12 18L18 24L12 30L6 24L12 18Z" fill="white"/>
                    <path d="M36 18L42 24L36 30L30 24L36 18Z" fill="white"/>
                  </svg>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      margin: 0,
                      marginBottom: "4px"
                    }}>
                      PIX
                    </h3>
                    <p style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: 0
                    }}>
                      Pagamento instantâneo
                    </p>
                  </div>
                </div>
              </button>

              {/* Cartão */}
              <button
                onClick={() => setFormaPagamento("cartao")}
                style={{
                  width: "100%",
                  padding: "24px",
                  borderRadius: "16px",
                  border: `2px solid ${formaPagamento === "cartao" ? "#3b82f6" : "rgba(0,0,0,0.1)"}`,
                  background: formaPagamento === "cartao" ? "rgba(59, 130, 246, 0.05)" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left"
                }}
                onMouseOver={(e) => {
                  if (formaPagamento !== "cartao") {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  if (formaPagamento !== "cartao") {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: `2px solid ${formaPagamento === "cartao" ? "#3b82f6" : "#ddd"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {formaPagamento === "cartao" && (
                      <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#3b82f6"
                      }}></div>
                    )}
                  </div>
                  <svg style={{ width: "32px", height: "32px", color: "#0a0a0a" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      margin: 0,
                      marginBottom: "4px"
                    }}>
                      Cartão de Crédito
                    </h3>
                    <p style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: 0
                    }}>
                      Parcelamento disponível
                    </p>
                  </div>
                </div>
              </button>

              {/* Boleto */}
              <button
                onClick={() => setFormaPagamento("boleto")}
                style={{
                  width: "100%",
                  padding: "24px",
                  borderRadius: "16px",
                  border: `2px solid ${formaPagamento === "boleto" ? "#f59e0b" : "rgba(0,0,0,0.1)"}`,
                  background: formaPagamento === "boleto" ? "rgba(245, 158, 11, 0.05)" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left"
                }}
                onMouseOver={(e) => {
                  if (formaPagamento !== "boleto") {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.2)";
                  }
                }}
                onMouseOut={(e) => {
                  if (formaPagamento !== "boleto") {
                    e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: `2px solid ${formaPagamento === "boleto" ? "#f59e0b" : "#ddd"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {formaPagamento === "boleto" && (
                      <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "#f59e0b"
                      }}></div>
                    )}
                  </div>
                  <svg style={{ width: "32px", height: "32px", color: "#0a0a0a" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      margin: 0,
                      marginBottom: "4px"
                    }}>
                      Boleto Bancário
                    </h3>
                    <p style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: 0
                    }}>
                      Vencimento em 3 dias úteis
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {erro && (
              <div style={{
                marginBottom: "20px",
                background: "#fee",
                border: "1px solid #fcc",
                color: "#c33",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "14px"
              }}>
                {erro}
              </div>
            )}

            <button
              onClick={finalizarPedido}
              disabled={carregando || !formaPagamento}
              style={{
                width: "100%",
                padding: "18px",
                background: !formaPagamento || carregando ? "#e5e5e5" : "#10b981",
                color: !formaPagamento || carregando ? "#999" : "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: !formaPagamento || carregando ? "not-allowed" : "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                if (formaPagamento && !carregando) {
                  e.currentTarget.style.background = "#059669";
                }
              }}
              onMouseOut={(e) => {
                if (formaPagamento && !carregando) {
                  e.currentTarget.style.background = "#10b981";
                }
              }}
            >
              {carregando ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
                  <svg style={{ width: "20px", height: "20px", animation: "spin 1s linear infinite" }} fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
              ) : (
                "✓ Confirmar Pedido"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
