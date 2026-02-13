"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  imagem_url?: string;
  peso_kg?: number;
  altura_cm?: number;
  largura_cm?: number;
  comprimento_cm?: number;
  quantidade?: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
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
  const [mostrarPagamento, setMostrarPagamento] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [frete, setFrete] = useState<number | null>(null);
  const [carregandoCep, setCarregandoCep] = useState(false);
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho") || "[]");
    
    if (carrinhoSalvo.length === 0) {
      router.push("/carrinho");
      return;
    }

    // Agrupar itens duplicados do localStorage
    const carrinhoAgrupado = carrinhoSalvo.reduce((acc: ItemCarrinho[], item: any) => {
      const existente = acc.find((i) => i.id === item.id);
      if (existente) {
        existente.quantidade = (existente.quantidade || 1) + 1;
      } else {
        acc.push({ ...item, quantidade: 1 });
      }
      return acc;
    }, []);

    setCarrinho(carrinhoAgrupado);
  }, [router]);

  useEffect(() => {
    const buscarCepAutomatico = async () => {
      const cepLimpo = cep.replace(/\D/g, "");
      
      if (cepLimpo.length === 8) {
        setCarregandoCep(true);

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await response.json();

          if (data.erro) {
            setMensagemAlerta("CEP não encontrado. Verifique e tente novamente.");
            setMostrarAlerta(true);
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

          // Calcular frete automaticamente após buscar CEP
          if (numero) {
            calcularFrete(data.uf);
          }
        } catch (error) {
          setMensagemAlerta("Erro ao buscar CEP. Verifique sua conexão.");
          setMostrarAlerta(true);
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

    // Calcular peso total e dimensões máximas (carrinho já está agrupado)
    let pesoTotal = 0;
    let alturaMax = 0;
    let larguraMax = 0;
    let comprimentoMax = 0;

    carrinho.forEach(item => {
      const quantidade = item.quantidade || 1;
      pesoTotal += (item.peso_kg || 0.5) * quantidade;
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
    // Validar dados pessoais
    if (!nome || nome.trim().length < 3) {
      setMensagemAlerta("Por favor, preencha seu nome completo");
      setMostrarAlerta(true);
      return false;
    }

    if (!cpf || cpf.replace(/\D/g, "").length !== 11) {
      setMensagemAlerta("Por favor, informe um CPF válido");
      setMostrarAlerta(true);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setMensagemAlerta("Por favor, informe um email válido");
      setMostrarAlerta(true);
      return false;
    }

    if (!telefone || telefone.replace(/\D/g, "").length < 10) {
      setMensagemAlerta("Por favor, informe um telefone válido");
      setMostrarAlerta(true);
      return false;
    }

    // Validar endereço
    if (!cep || cep.replace(/\D/g, "").length !== 8) {
      setMensagemAlerta("Por favor, preencha um CEP válido (8 dígitos)");
      setMostrarAlerta(true);
      return false;
    }

    if (!endereco || endereco.trim().length < 5) {
      setMensagemAlerta("Por favor, preencha o endereço completo");
      setMostrarAlerta(true);
      return false;
    }

    if (!numero || numero.trim().length === 0) {
      setMensagemAlerta("Por favor, informe o número do endereço");
      setMostrarAlerta(true);
      return false;
    }

    if (!bairro || bairro.trim().length < 2) {
      setMensagemAlerta("Por favor, preencha o bairro");
      setMostrarAlerta(true);
      return false;
    }

    if (!cidade || cidade.trim().length < 2) {
      setMensagemAlerta("Por favor, preencha a cidade");
      setMostrarAlerta(true);
      return false;
    }

    if (!estado || estado.length !== 2) {
      setMensagemAlerta("Por favor, preencha o estado (sigla com 2 letras)");
      setMostrarAlerta(true);
      return false;
    }

    return true;
  };

  const abrirSelecaoPagamento = () => {
    if (!validarFormulario()) return;
    setMostrarPagamento(true);
  };

  const finalizarPedido = async () => {
    if (!formaPagamento) {
      setMensagemAlerta("Por favor, selecione uma forma de pagamento");
      setMostrarPagamento(false);
      setMostrarAlerta(true);
      return;
    }

    setCarregando(true);

    try {
      console.log("CARRINHO COM QUANTIDADES:", carrinho);

      const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itens: carrinho,
          cliente: {
            nome,
            cpf: cpf.replace(/\D/g, ""),
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
        // Ir direto para página de sucesso
        router.push(`/sucesso?pedido=${data.id}&token=${data.access_token}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Erro do servidor:", errorData);
        setMensagemAlerta(errorData.error || "Erro ao finalizar pedido. Tente novamente.");
        setMostrarPagamento(false);
        setMostrarAlerta(true);
      }
    } catch (error) {
      setMensagemAlerta("Erro de conexão. Verifique sua internet e tente novamente.");
      setMostrarPagamento(false);
      setMostrarAlerta(true);
    } finally {
      setCarregando(false);
    }
  };

  const formatarCPF = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return numeros.slice(0, 11);
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

  const subtotal = carrinho.reduce((acc, item) => acc + (Number(item.preco) * (item.quantidade || 1)), 0);
  const total = subtotal + (frete || 0);

  // carrinho já está agrupado, não precisa reagrupar
  const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);

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
          padding: "clamp(16px, 3vw, 20px) clamp(20px, 5vw, 48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px"
        }}>
          <Link 
            href="/carrinho"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#666",
              textDecoration: "none",
              fontSize: "clamp(13px, 2.5vw, 15px)",
              fontWeight: "600",
              transition: "color 0.2s",
              flexShrink: 0,
              whiteSpace: "nowrap"
            }}
            onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
            onMouseOut={(e) => e.currentTarget.style.color = "#666"}
          >
            <svg style={{ width: "20px", height: "20px", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span style={{ display: "inline" }}>Voltar ao Carrinho</span>
          </Link>

          <Link href="/" style={{ 
            textDecoration: "none", 
            display: "flex", 
            alignItems: "center", 
            gap: "clamp(8px, 2vw, 20px)",
            overflow: "hidden",
            flexShrink: 1,
            minWidth: 0
          }}>
            <img src="/logo.png" alt="Logo" style={{ 
              height: "clamp(40px, 8vw, 56px)", 
              objectFit: "contain",
              flexShrink: 0
            }} />
            <div style={{ overflow: "hidden" }}>
              <h1 style={{
                fontSize: "clamp(14px, 3vw, 20px)",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.5px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
                Empório Bothanico
              </h1>
            </div>
          </Link>

          <div style={{
            fontSize: "clamp(14px, 3vw, 20px)",
            fontWeight: "800",
            color: "#0a0a0a",
            letterSpacing: "-0.5px",
            flexShrink: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            Finalizar Pedido
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1440px", margin: "0 auto", padding: "clamp(24px, 5vw, 80px) clamp(16px, 4vw, 48px)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "clamp(24px, 5vw, 40px)",
          alignItems: "start"
        }}>
          {/* FORMULÁRIO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 4vw, 24px)" }}>
            {/* Dados Pessoais */}
            <div style={{
              background: "white",
              borderRadius: "clamp(12px, 3vw, 20px)",
              padding: "clamp(20px, 5vw, 40px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(12px, 3vw, 16px)",
                marginBottom: "clamp(20px, 5vw, 32px)",
                flexWrap: "wrap"
              }}>
                <div style={{
                  width: "clamp(40px, 10vw, 48px)",
                  height: "clamp(40px, 10vw, 48px)",
                  background: "#0a0a0a",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(16px, 4vw, 20px)",
                  fontWeight: "800",
                  flexShrink: 0
                }}>
                  1
                </div>
                <h2 style={{
                  fontSize: "clamp(18px, 4.5vw, 24px)",
                  fontWeight: "800",
                  color: "#0a0a0a",
                  margin: 0,
                  letterSpacing: "-0.5px",
                  wordBreak: "break-word"
                }}>
                  Dados Pessoais
                </h2>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                gap: "clamp(16px, 4vw, 20px)"
              }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                {/* CPF */}
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
                    letterSpacing: "0.3px"
                  }}>
                    CPF *
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatarCPF(e.target.value))}
                    maxLength={14}
                    style={{
                      width: "100%",
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
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
              borderRadius: "clamp(12px, 3vw, 20px)",
              padding: "clamp(20px, 5vw, 40px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(12px, 3vw, 16px)",
                marginBottom: "clamp(20px, 5vw, 32px)",
                flexWrap: "wrap"
              }}>
                <div style={{
                  width: "clamp(40px, 10vw, 48px)",
                  height: "clamp(40px, 10vw, 48px)",
                  background: "#0a0a0a",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "clamp(16px, 4vw, 20px)",
                  fontWeight: "800",
                  flexShrink: 0
                }}>
                  2
                </div>
                <h2 style={{
                  fontSize: "clamp(18px, 4.5vw, 24px)",
                  fontWeight: "800",
                  color: "#0a0a0a",
                  margin: 0,
                  letterSpacing: "-0.5px",
                  wordBreak: "break-word"
                }}>
                  Endereço de Entrega
                </h2>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                gap: "clamp(16px, 4vw, 20px)"
              }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
                    letterSpacing: "0.3px"
                  }}>
                    CEP * {carregandoCep && <span style={{ color: "#10b981", whiteSpace: "nowrap" }}>Buscando...</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="00000-000"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => setCep(formatarCep(e.target.value))}
                    style={{
                      width: "100%",
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{
                    display: "block",
                    fontSize: "clamp(12px, 2.8vw, 13px)",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "clamp(6px, 1.5vw, 8px)",
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
                      minWidth: "min(100%, 200px)",
                      padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                      border: "1px solid rgba(0,0,0,0.1)",
                      borderRadius: "clamp(8px, 2vw, 10px)",
                      fontSize: "clamp(14px, 3.5vw, 15px)",
                      fontWeight: "500",
                      color: "#0a0a0a",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      minHeight: "44px"
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = "#0a0a0a"}
                    onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RESUMO */}
          <div style={{ position: "sticky", top: "clamp(100px, 20vw, 120px)" }}>
            <div style={{
              background: "white",
              borderRadius: "clamp(12px, 3vw, 20px)",
              padding: "clamp(20px, 5vw, 32px)",
              border: "1px solid rgba(0,0,0,0.08)"
            }}>
              <h2 style={{
                fontSize: "clamp(18px, 4.5vw, 24px)",
                fontWeight: "800",
                color: "#0a0a0a",
                marginBottom: "clamp(20px, 5vw, 32px)",
                letterSpacing: "-0.5px",
                wordBreak: "break-word"
              }}>
                Resumo do Pedido
              </h2>

              <div style={{
                maxHeight: "240px",
                overflowY: "auto",
                marginBottom: "clamp(16px, 4vw, 24px)",
                paddingRight: "clamp(4px, 1.5vw, 8px)"
              }}>
                {carrinho.map((item: any) => (
                  <div key={item.id} style={{
                    display: "flex",
                    gap: "clamp(12px, 3vw, 16px)",
                    paddingBottom: "clamp(16px, 4vw, 20px)",
                    marginBottom: "clamp(16px, 4vw, 20px)",
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    flexWrap: "wrap"
                  }}>
                    {item.imagem_url ? (
                      <img
                        src={item.imagem_url}
                        alt={item.nome}
                        style={{
                          width: "clamp(56px, 14vw, 64px)",
                          height: "clamp(56px, 14vw, 64px)",
                          objectFit: "cover",
                          borderRadius: "clamp(8px, 2vw, 10px)",
                          background: "#fafafa",
                          flexShrink: 0
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/100x100/fafafa/ccc?text=Sem+Imagem';
                        }}
                      />
                    ) : (
                      <div style={{
                        width: "clamp(56px, 14vw, 64px)",
                        height: "clamp(56px, 14vw, 64px)",
                        background: "#fafafa",
                        borderRadius: "clamp(8px, 2vw, 10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "clamp(24px, 6vw, 28px)",
                        flexShrink: 0
                      }}>
                        🌸
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: "0" }}>
                      <h4 style={{
                        fontSize: "clamp(13px, 3vw, 14px)",
                        fontWeight: "600",
                        color: "#0a0a0a",
                        marginBottom: "4px",
                        wordBreak: "break-word"
                      }}>
                        {item.nome}
                      </h4>
                      <p style={{
                        fontSize: "clamp(12px, 2.8vw, 13px)",
                        color: "#666",
                        marginBottom: "6px",
                        wordBreak: "break-word"
                      }}>
                        Qtd: {item.quantidade}
                      </p>
                      <p style={{
                        fontSize: "clamp(15px, 3.5vw, 16px)",
                        fontWeight: "700",
                        color: "#0a0a0a"
                      }}>
                        R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "clamp(16px, 4vw, 24px)" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "clamp(10px, 2.5vw, 12px)",
                  fontSize: "clamp(14px, 3.5vw, 15px)",
                  color: "#666",
                  flexWrap: "wrap",
                  gap: "clamp(8px, 2vw, 12px)"
                }}>
                  <span style={{ wordBreak: "break-word" }}>Subtotal ({totalItens} {totalItens === 1 ? 'item' : 'itens'})</span>
                  <span style={{ fontWeight: "600", color: "#0a0a0a", whiteSpace: "nowrap" }}>
                    R$ {subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "clamp(14px, 3.5vw, 15px)",
                  color: "#666",
                  flexWrap: "wrap",
                  gap: "clamp(8px, 2vw, 12px)"
                }}>
                  <span style={{ wordBreak: "break-word" }}>
                    Frete {carregandoFrete && <span style={{ fontSize: "clamp(11px, 2.5vw, 12px)", whiteSpace: "nowrap" }}>(calculando...)</span>}
                  </span>
                  <span style={{ fontWeight: "600", color: "#0a0a0a", whiteSpace: "nowrap" }}>
                    {frete === null ? "Calcular" : frete === 0 ? "Grátis" : `R$ ${frete.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "clamp(16px, 4vw, 24px)",
                paddingBottom: "clamp(20px, 5vw, 32px)",
                borderTop: "2px solid rgba(0,0,0,0.08)",
                marginBottom: "clamp(16px, 4vw, 24px)",
                flexWrap: "wrap",
                gap: "clamp(12px, 3vw, 16px)"
              }}>
                <span style={{
                  fontSize: "clamp(16px, 4vw, 18px)",
                  fontWeight: "700",
                  color: "#0a0a0a",
                  wordBreak: "break-word"
                }}>
                  Total
                </span>
                <span style={{
                  fontSize: "clamp(28px, 7vw, 36px)",
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
                  padding: "clamp(16px, 4vw, 18px)",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "clamp(10px, 2.5vw, 12px)",
                  fontSize: "clamp(15px, 3.5vw, 16px)",
                  fontWeight: "700",
                  cursor: carregando ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: carregando ? 0.5 : 1,
                  minHeight: "50px",
                  whiteSpace: "normal",
                  wordBreak: "break-word"
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
                marginTop: "clamp(12px, 3vw, 16px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(6px, 1.5vw, 8px)",
                fontSize: "clamp(12px, 2.8vw, 13px)",
                color: "#999",
                flexWrap: "wrap"
              }}>
                <svg style={{ width: "clamp(14px, 3.5vw, 16px)", height: "clamp(14px, 3.5vw, 16px)", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span style={{ whiteSpace: "nowrap" }}>Compra 100% segura</span>
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
            padding: "clamp(16px, 4vw, 20px)"
          }}
          onClick={() => setMostrarPagamento(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "clamp(16px, 4vw, 20px)",
              maxWidth: "560px",
              width: "100%",
              padding: "clamp(24px, 6vw, 40px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "clamp(16px, 4vw, 24px)",
              gap: "clamp(12px, 3vw, 16px)",
              flexWrap: "wrap"
            }}>
              <h2 style={{
                fontSize: "clamp(20px, 5vw, 28px)",
                fontWeight: "800",
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.8px",
                wordBreak: "break-word",
                flex: 1
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
                  transition: "color 0.2s",
                  padding: "clamp(4px, 1vw, 8px)",
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
                onMouseOver={(e) => e.currentTarget.style.color = "#0a0a0a"}
                onMouseOut={(e) => e.currentTarget.style.color = "#999"}
              >
                <svg style={{ width: "clamp(20px, 5vw, 24px)", height: "clamp(20px, 5vw, 24px)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p style={{
              fontSize: "clamp(14px, 3.5vw, 15px)",
              color: "#666",
              marginBottom: "clamp(20px, 5vw, 32px)",
              wordBreak: "break-word"
            }}>
              Selecione como deseja pagar:
            </p>

            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(12px, 3vw, 16px)",
              marginBottom: "clamp(20px, 5vw, 32px)"
            }}>
              {/* PIX */}
              <button
                onClick={() => setFormaPagamento("pix")}
                style={{
                  width: "100%",
                  padding: "clamp(16px, 4vw, 24px)",
                  borderRadius: "clamp(12px, 3vw, 16px)",
                  border: `2px solid ${formaPagamento === "pix" ? "#10b981" : "rgba(0,0,0,0.1)"}`,
                  background: formaPagamento === "pix" ? "rgba(16, 185, 129, 0.05)" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  minHeight: "44px"
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
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 16px)", flexWrap: "wrap" }}>
                  <div style={{
                    width: "clamp(20px, 5vw, 24px)",
                    height: "clamp(20px, 5vw, 24px)",
                    borderRadius: "50%",
                    border: `2px solid ${formaPagamento === "pix" ? "#10b981" : "#ddd"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {formaPagamento === "pix" && (
                      <div style={{
                        width: "clamp(10px, 2.5vw, 12px)",
                        height: "clamp(10px, 2.5vw, 12px)",
                        borderRadius: "50%",
                        background: "#10b981"
                      }}></div>
                    )}
                  </div>
                  <svg style={{ width: "clamp(28px, 7vw, 32px)", height: "clamp(28px, 7vw, 32px)", flexShrink: 0 }} viewBox="0 0 48 48" fill="none">
                    <rect width="48" height="48" rx="8" fill="#32BCAD"/>
                    <path d="M24 12L30 18L24 24L18 18L24 12Z" fill="white"/>
                    <path d="M24 24L30 30L24 36L18 30L24 24Z" fill="white"/>
                    <path d="M12 18L18 24L12 30L6 24L12 18Z" fill="white"/>
                    <path d="M36 18L42 24L36 30L30 24L36 18Z" fill="white"/>
                  </svg>
                  <div style={{ flex: 1, minWidth: "0" }}>
                    <h3 style={{
                      fontSize: "clamp(16px, 4vw, 18px)",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      margin: 0,
                      marginBottom: "4px",
                      wordBreak: "break-word"
                    }}>
                      PIX
                    </h3>
                    <p style={{
                      fontSize: "clamp(13px, 3vw, 14px)",
                      color: "#666",
                      margin: 0,
                      wordBreak: "break-word"
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
                  padding: "clamp(16px, 4vw, 24px)",
                  borderRadius: "clamp(12px, 3vw, 16px)",
                  border: `2px solid ${formaPagamento === "cartao" ? "#3b82f6" : "rgba(0,0,0,0.1)"}`,
                  background: formaPagamento === "cartao" ? "rgba(59, 130, 246, 0.05)" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  minHeight: "44px"
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
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 16px)", flexWrap: "wrap" }}>
                  <div style={{
                    width: "clamp(20px, 5vw, 24px)",
                    height: "clamp(20px, 5vw, 24px)",
                    borderRadius: "50%",
                    border: `2px solid ${formaPagamento === "cartao" ? "#3b82f6" : "#ddd"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {formaPagamento === "cartao" && (
                      <div style={{
                        width: "clamp(10px, 2.5vw, 12px)",
                        height: "clamp(10px, 2.5vw, 12px)",
                        borderRadius: "50%",
                        background: "#3b82f6"
                      }}></div>
                    )}
                  </div>
                  <svg style={{ width: "clamp(28px, 7vw, 32px)", height: "clamp(28px, 7vw, 32px)", color: "#0a0a0a", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div style={{ flex: 1, minWidth: "0" }}>
                    <h3 style={{
                      fontSize: "clamp(16px, 4vw, 18px)",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      margin: 0,
                      marginBottom: "4px",
                      wordBreak: "break-word"
                    }}>
                      Cartão de Crédito
                    </h3>
                    <p style={{
                      fontSize: "clamp(13px, 3vw, 14px)",
                      color: "#666",
                      margin: 0,
                      wordBreak: "break-word"
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
                  padding: "clamp(16px, 4vw, 24px)",
                  borderRadius: "clamp(12px, 3vw, 16px)",
                  border: `2px solid ${formaPagamento === "boleto" ? "#f59e0b" : "rgba(0,0,0,0.1)"}`,
                  background: formaPagamento === "boleto" ? "rgba(245, 158, 11, 0.05)" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textAlign: "left",
                  minHeight: "44px"
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
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 16px)", flexWrap: "wrap" }}>
                  <div style={{
                    width: "clamp(20px, 5vw, 24px)",
                    height: "clamp(20px, 5vw, 24px)",
                    borderRadius: "50%",
                    border: `2px solid ${formaPagamento === "boleto" ? "#f59e0b" : "#ddd"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {formaPagamento === "boleto" && (
                      <div style={{
                        width: "clamp(10px, 2.5vw, 12px)",
                        height: "clamp(10px, 2.5vw, 12px)",
                        borderRadius: "50%",
                        background: "#f59e0b"
                      }}></div>
                    )}
                  </div>
                  <svg style={{ width: "clamp(28px, 7vw, 32px)", height: "clamp(28px, 7vw, 32px)", color: "#0a0a0a", flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div style={{ flex: 1, minWidth: "0" }}>
                    <h3 style={{
                      fontSize: "clamp(16px, 4vw, 18px)",
                      fontWeight: "700",
                      color: "#0a0a0a",
                      margin: 0,
                      marginBottom: "4px",
                      wordBreak: "break-word"
                    }}>
                      Boleto Bancário
                    </h3>
                    <p style={{
                      fontSize: "clamp(13px, 3vw, 14px)",
                      color: "#666",
                      margin: 0,
                      wordBreak: "break-word"
                    }}>
                      Vencimento em 3 dias úteis
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={finalizarPedido}
              disabled={carregando || !formaPagamento}
              style={{
                width: "100%",
                padding: "clamp(16px, 4vw, 18px)",
                background: !formaPagamento || carregando ? "#e5e5e5" : "#10b981",
                color: !formaPagamento || carregando ? "#999" : "white",
                border: "none",
                borderRadius: "clamp(10px, 2.5vw, 12px)",
                fontSize: "clamp(15px, 3.5vw, 16px)",
                fontWeight: "700",
                cursor: !formaPagamento || carregando ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                minHeight: "50px",
                whiteSpace: "normal",
                wordBreak: "break-word"
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
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap" }}>
                  <svg style={{ width: "clamp(18px, 4.5vw, 20px)", height: "clamp(18px, 4.5vw, 20px)", animation: "spin 1s linear infinite", flexShrink: 0 }} fill="none" viewBox="0 0 24 24">
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

      {/* MODAL DE ALERTA */}
      {mostrarAlerta && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.6)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(16px, 4vw, 20px)",
            animation: "fadeIn 0.2s ease"
          }}
          onClick={() => setMostrarAlerta(false)}
        >
          <div 
            style={{
              background: "white",
              borderRadius: "clamp(16px, 4vw, 20px)",
              maxWidth: "480px",
              width: "100%",
              padding: "clamp(32px, 8vw, 48px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
              textAlign: "center",
              animation: "slideUp 0.3s ease",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ícone de Alerta */}
            <div style={{
              width: "clamp(64px, 16vw, 80px)",
              height: "clamp(64px, 16vw, 80px)",
              background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto clamp(20px, 5vw, 24px)",
              animation: "bounce 0.6s ease",
              flexShrink: 0
            }}>
              <svg style={{ width: "clamp(32px, 8vw, 40px)", height: "clamp(32px, 8vw, 40px)", color: "#f59e0b" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 style={{
              fontSize: "clamp(22px, 5.5vw, 28px)",
              fontWeight: "800",
              color: "#0a0a0a",
              marginBottom: "clamp(12px, 3vw, 16px)",
              letterSpacing: "-0.8px",
              wordBreak: "break-word"
            }}>
              Atenção!
            </h2>

            <p style={{
              fontSize: "clamp(15px, 3.5vw, 16px)",
              color: "#666",
              lineHeight: "1.6",
              marginBottom: "clamp(24px, 6vw, 32px)",
              wordBreak: "break-word"
            }}>
              {mensagemAlerta}
            </p>

            <button
              onClick={() => setMostrarAlerta(false)}
              style={{
                width: "100%",
                padding: "clamp(14px, 3.5vw, 16px)",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "white",
                border: "none",
                borderRadius: "clamp(10px, 2.5vw, 12px)",
                fontSize: "clamp(15px, 3.5vw, 16px)",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.3s ease",
                minHeight: "50px",
                whiteSpace: "normal",
                wordBreak: "break-word"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(245, 158, 11, 0.4)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
