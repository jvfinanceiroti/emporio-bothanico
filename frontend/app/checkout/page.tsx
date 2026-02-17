"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { StoreHeader } from "@/components/StoreHeader";
import { validarNumeroCartao, detectarBandeira, validarValidade, formatarNumeroCartao, formatarValidade } from "@/utils/cartao-validacao";

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
  const [fretePac, setFretePac] = useState<number | null>(null);
  const [freteSedex, setFreteSedex] = useState<number | null>(null);
  const [tipoEnvio, setTipoEnvio] = useState<"pac" | "sedex">("pac");
  const [carregandoCep, setCarregandoCep] = useState(false);
  const FRETE_GRATIS_PAC = 299;
  const FRETE_GRATIS_SEDEX = 800;
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState("");
  
  // Estados PIX
  const [pixQrCode, setPixQrCode] = useState("");
  const [pixCopiaCola, setPixCopiaCola] = useState("");
  const [pixCopiado, setPixCopiado] = useState(false);
  const [pixExpiraEm, setPixExpiraEm] = useState<Date | null>(null);
  const [pixTempoRestante, setPixTempoRestante] = useState("");
  const [pedidoId, setPedidoId] = useState<number | null>(null);
  const [pedidoToken, setPedidoToken] = useState<string>("");
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);
  
  // Estados para Cartão de Crédito
  const [cartaoNumero, setCartaoNumero] = useState("");
  const [cartaoNome, setCartaoNome] = useState("");
  const [cartaoValidade, setCartaoValidade] = useState("");
  const [cartaoCvv, setCartaoCvv] = useState("");
  const [cartaoDocumento, setCartaoDocumento] = useState("");
  const [cartaoParcelas, setCartaoParcelas] = useState(1);
  const [processandoCartao, setProcessandoCartao] = useState(false);
  const [mercadoPagoReady, setMercadoPagoReady] = useState(false);
  const [cartaoBandeira, setCartaoBandeira] = useState<string | null>(null);
  const [numeroValido, setNumeroValido] = useState<boolean | null>(null);
  const [validadeValida, setValidadeValida] = useState<boolean | null>(null);

  // Carregar SDK do Mercado Pago
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      console.log("✅ Mercado Pago SDK carregado");
      setMercadoPagoReady(true);
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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
            setFretePac(null);
            setFreteSedex(null);
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

    const valorPac = fretesBase[uf] || 35.00;
    let valorPacFinal = valorPac;
    if (pesoTotal > 1) {
      valorPacFinal += (pesoTotal - 1) * 5.00;
    }
    // SEDEX é mais caro (~1.6x PAC)
    const valorSedexFinal = Math.round(valorPacFinal * 1.6 * 100) / 100;

    setFretePac(valorPacFinal);
    setFreteSedex(valorSedexFinal);
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

    if (fretePac === null && freteSedex === null && cep.replace(/\D/g, "").length === 8) {
      setMensagemAlerta("Aguarde o cálculo do frete ou verifique o CEP e número.");
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
          frete: frete,
          formaPagamento: formaPagamento,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Se forma de pagamento for PIX, gerar QR Code
        if (formaPagamento === "pix") {
          localStorage.removeItem("carrinho");
          setPedidoId(data.id);
          setPedidoToken(data.access_token);
          
          // Gerar PIX
          try {
            const pixResponse = await fetch(`${API_URL}/pagamento/pix/gerar`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                pedido_id: data.id, 
                token: data.access_token 
              }),
            });

            if (pixResponse.ok) {
              const pixData = await pixResponse.json();
              setPixQrCode(pixData.qrCode);
              setPixCopiaCola(pixData.copiaCola);
              setPixExpiraEm(new Date(pixData.expiraEm));
              
              // Manter modal de pagamento aberto com PIX
              setVerificandoPagamento(true);
            } else {
              setMensagemAlerta("Erro ao gerar PIX. Tente novamente.");
              setMostrarPagamento(false);
              setMostrarAlerta(true);
            }
          } catch (error) {
            setMensagemAlerta("Erro ao gerar PIX. Tente novamente.");
            setMostrarPagamento(false);
            setMostrarAlerta(true);
          }
        } else if (formaPagamento === "cartao") {
          // Cartão: salvar pedidoId e token, mas FICAR NO MODAL para preencher cartão
          setPedidoId(data.id);
          setPedidoToken(data.access_token);
          // Modal continua aberto, formulário de cartão vai aparecer
        } else {
          // Outras formas: ir direto para sucesso
          router.push(`/sucesso?pedido=${data.id}&token=${data.access_token}`);
        }
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
  const valorFretePac = subtotal >= FRETE_GRATIS_PAC ? 0 : (fretePac ?? 0);
  const valorFreteSedex = subtotal >= FRETE_GRATIS_SEDEX ? 0 : (freteSedex ?? 0);
  const frete = tipoEnvio === "pac" ? valorFretePac : valorFreteSedex;
  const total = subtotal + frete;

  // carrinho já está agrupado, não precisa reagrupar
  const totalItens = carrinho.reduce((acc, item) => acc + (item.quantidade || 1), 0);

  // Atualizar tempo restante do PIX
  useEffect(() => {
    if (!pixExpiraEm) return;

    const interval = setInterval(() => {
      const agora = new Date();
      const diff = pixExpiraEm.getTime() - agora.getTime();

      if (diff <= 0) {
        setPixTempoRestante("Expirado");
        clearInterval(interval);
        return;
      }

      const minutos = Math.floor(diff / 60000);
      const segundos = Math.floor((diff % 60000) / 1000);
      setPixTempoRestante(`${minutos}:${segundos.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [pixExpiraEm]);

  // Verificar status do pagamento PIX
  useEffect(() => {
    if (!verificandoPagamento || !pedidoId || !pedidoToken) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${API_URL}/pagamento/pix/status/${pedidoId}?token=${pedidoToken}`
        );
        const data = await response.json();

        if (data.pago) {
          clearInterval(interval);
          router.push(`/sucesso?pedido=${pedidoId}&token=${pedidoToken}`);
        } else if (data.expirado) {
          clearInterval(interval);
          setMensagemAlerta("Pagamento PIX expirado. Por favor, faça um novo pedido.");
          setMostrarPagamento(false);
          setMostrarAlerta(true);
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [verificandoPagamento, pedidoId, pedidoToken, router]);

  const copiarCodigoPix = () => {
    navigator.clipboard.writeText(pixCopiaCola);
    setPixCopiado(true);
    setTimeout(() => setPixCopiado(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--warm-50)] text-[var(--foreground)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 outline-none transition-all";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f5f4] via-[#fafaf9] to-white">
      <header className="sticky top-0 z-50">
        <StoreHeader />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="text-sm text-[var(--muted)] mb-8">
          <Link href="/" className="hover:text-[var(--accent)]">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/produtos" className="hover:text-[var(--accent)]">Produtos</Link>
          <span className="mx-2">›</span>
          <Link href="/carrinho" className="hover:text-[var(--accent)]">Carrinho</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--foreground)] font-medium">Checkout</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
          {/* FORMULÁRIO */}
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-logo)" }}>
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
                    name="name"
                    autoComplete="name"
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
                    name="cpf"
                    autoComplete="off"
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
                    name="email"
                    autoComplete="email"
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
                    name="tel"
                    autoComplete="tel"
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
            <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.06)] border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[var(--foreground)]" style={{ fontFamily: "var(--font-logo)" }}>
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
                    name="postal-code"
                    autoComplete="postal-code"
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
          <div className="lg:sticky lg:top-36">
            <div className="bg-white rounded-3xl shadow-[0_4px_40px_rgba(44,90,74,0.08)] border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-6" style={{ fontFamily: "var(--font-logo)" }}>
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
                {/* Opções de envio: PAC ou SEDEX */}
                {carregandoFrete ? (
                  <div style={{ fontSize: "clamp(14px, 3.5vw, 15px)", color: "#666", marginBottom: "clamp(12px, 3vw, 16px)" }}>
                    Frete (calculando...)
                  </div>
                ) : (fretePac !== null || freteSedex !== null) ? (
                  <div style={{ marginBottom: "clamp(12px, 3vw, 16px)" }}>
                    <div style={{ fontSize: "clamp(12px, 2.8vw, 13px)", fontWeight: "600", color: "#666", marginBottom: "clamp(8px, 2vw, 10px)" }}>
                      Escolha o envio:
                    </div>
                    <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setTipoEnvio("pac")}
                        style={{
                          flex: 1,
                          minWidth: "120px",
                          padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                          borderRadius: "12px",
                          border: `2px solid ${tipoEnvio === "pac" ? "var(--accent)" : "rgba(0,0,0,0.1)"}`,
                          background: tipoEnvio === "pac" ? "rgba(45, 90, 74, 0.06)" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ fontWeight: "700", color: "#0a0a0a", fontSize: "clamp(14px, 3.5vw, 15px)", marginBottom: "2px" }}>PAC</div>
                        <div style={{ fontSize: "clamp(12px, 2.8vw, 13px)", color: "#666" }}>
                          {subtotal >= FRETE_GRATIS_PAC ? "Grátis" : `R$ ${(fretePac ?? 0).toFixed(2).replace(".", ",")}`}
                          {subtotal >= FRETE_GRATIS_PAC && <span style={{ display: "block", fontSize: "11px", color: "var(--success)" }}>Compra acima de R$ 299</span>}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipoEnvio("sedex")}
                        style={{
                          flex: 1,
                          minWidth: "120px",
                          padding: "clamp(12px, 3vw, 14px) clamp(14px, 3.5vw, 16px)",
                          borderRadius: "12px",
                          border: `2px solid ${tipoEnvio === "sedex" ? "var(--accent)" : "rgba(0,0,0,0.1)"}`,
                          background: tipoEnvio === "sedex" ? "rgba(45, 90, 74, 0.06)" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ fontWeight: "700", color: "#0a0a0a", fontSize: "clamp(14px, 3.5vw, 15px)", marginBottom: "2px" }}>SEDEX</div>
                        <div style={{ fontSize: "clamp(12px, 2.8vw, 13px)", color: "#666" }}>
                          {subtotal >= FRETE_GRATIS_SEDEX ? "Grátis" : `R$ ${(freteSedex ?? 0).toFixed(2).replace(".", ",")}`}
                          {subtotal >= FRETE_GRATIS_SEDEX && <span style={{ display: "block", fontSize: "11px", color: "var(--success)" }}>Compra acima de R$ 800</span>}
                        </div>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "clamp(14px, 3.5vw, 15px)", color: "#666", marginBottom: "clamp(12px, 3vw, 16px)" }}>
                    Informe CEP e número para calcular o frete
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center py-4 border-t-2 border-[var(--border)] mb-6">
                <span className="text-lg font-bold text-[var(--foreground)]">Total</span>
                <span className="text-2xl sm:text-3xl font-black text-[var(--accent)]" style={{ fontFamily: "var(--font-logo)" }}>
                  R$ {total.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <button
                onClick={abrirSelecaoPagamento}
                disabled={carregando || (carregandoFrete && cep.replace(/\D/g, "").length === 8)}
                className="w-full py-5 rounded-2xl bg-[var(--accent)] text-white font-bold text-lg hover:bg-[var(--accent-hover)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Finalizar Pagamento
                </span>
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
                {pixQrCode ? "Pagamento PIX" : formaPagamento === "cartao" ? "Pagamento com Cartão" : "Forma de Pagamento"}
              </h2>
              <button
                onClick={() => {
                  setMostrarPagamento(false);
                  setPixQrCode("");
                  setVerificandoPagamento(false);
                  setCartaoNumero("");
                  setCartaoNome("");
                  setCartaoValidade("");
                  setCartaoCvv("");
                  setCartaoDocumento("");
                  setCartaoParcelas(1);
                }}
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

            {/* Conteúdo PIX */}
            {pixQrCode ? (
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontSize: "clamp(14px, 3.5vw, 15px)",
                  color: "#666",
                  marginBottom: "clamp(20px, 5vw, 24px)"
                }}>
                  Escaneie o QR Code ou copie o código PIX
                </p>

                {/* Valor */}
                <div style={{
                  background: "#f8f9fa",
                  padding: "clamp(16px, 4vw, 20px)",
                  borderRadius: "12px",
                  marginBottom: "clamp(20px, 5vw, 24px)"
                }}>
                  <div style={{
                    fontSize: "13px",
                    color: "#666",
                    marginBottom: "4px"
                  }}>
                    Valor a pagar
                  </div>
                  <div style={{
                    fontSize: "clamp(28px, 7vw, 36px)",
                    fontWeight: "800",
                    color: "#0a0a0a"
                  }}>
                    R$ {total.toFixed(2)}
                  </div>
                </div>

                {/* QR Code */}
                <div style={{
                  background: "#f8f9fa",
                  padding: "clamp(16px, 4vw, 24px)",
                  borderRadius: "16px",
                  marginBottom: "clamp(16px, 4vw, 20px)"
                }}>
                  <img
                    src={pixQrCode}
                    alt="QR Code PIX"
                    style={{
                      width: "100%",
                      maxWidth: "240px",
                      height: "auto",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                </div>

                {/* Código Copia e Cola */}
                <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0a0a0a",
                    marginBottom: "8px",
                    textAlign: "left"
                  }}>
                    Código PIX Copia e Cola
                  </div>
                  <div style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "nowrap"
                  }}>
                    <input
                      type="text"
                      value={pixCopiaCola}
                      readOnly
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontFamily: "monospace",
                        background: "#f8f9fa",
                        color: "#0a0a0a",
                        minWidth: 0
                      }}
                    />
                    <button
                      onClick={copiarCodigoPix}
                      style={{
                        padding: "12px 20px",
                        background: pixCopiado ? "#10b981" : "#0a0a0a",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        whiteSpace: "nowrap",
                        flexShrink: 0
                      }}
                    >
                      {pixCopiado ? "✓" : "Copiar"}
                    </button>
                  </div>
                </div>

                {/* Tempo Restante */}
                <div style={{
                  background: pixTempoRestante === "Expirado" ? "#fee2e2" : "#fef3c7",
                  padding: "clamp(12px, 3vw, 16px)",
                  borderRadius: "12px",
                  marginBottom: "clamp(16px, 4vw, 20px)"
                }}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: pixTempoRestante === "Expirado" ? "#dc2626" : "#d97706"
                  }}>
                    {pixTempoRestante === "Expirado" 
                      ? "⚠️ PIX Expirado" 
                      : `⏱️ Tempo restante: ${pixTempoRestante}`}
                  </div>
                </div>

                {/* Verificando Pagamento */}
                {verificandoPagamento && pixTempoRestante !== "Expirado" && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    padding: "clamp(12px, 3vw, 16px)",
                    background: "#eff6ff",
                    borderRadius: "12px",
                    marginBottom: "clamp(16px, 4vw, 20px)"
                  }}>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #3b82f6",
                      borderTopColor: "transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }} />
                    <div style={{
                      fontSize: "14px",
                      color: "#3b82f6",
                      fontWeight: "600"
                    }}>
                      Aguardando pagamento...
                    </div>
                  </div>
                )}

                {/* Instruções */}
                <div style={{
                  textAlign: "left",
                  fontSize: "13px",
                  color: "#666",
                  lineHeight: "1.8"
                }}>
                  <p style={{ fontWeight: "600", color: "#0a0a0a", marginBottom: "8px", margin: 0 }}>
                    Como pagar:
                  </p>
                  <ol style={{ paddingLeft: "20px", margin: "8px 0 0 0" }}>
                    <li>Abra o app do seu banco</li>
                    <li>Entre na área PIX</li>
                    <li>Escaneie o QR Code ou cole o código</li>
                    <li>Confirme o pagamento</li>
                    <li>Aguarde a confirmação automática</li>
                  </ol>
                </div>

                {/* Botão Simular (DEV) */}
                {process.env.NODE_ENV === "development" && pedidoId && pedidoToken && (
                  <div style={{ marginTop: "20px" }}>
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`${API_URL}/pagamento/pix/confirmar`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pedido_id: pedidoId, token: pedidoToken }),
                          });
                          alert("Pagamento simulado com sucesso!");
                        } catch (error) {
                          alert("Erro ao simular pagamento");
                        }
                      }}
                      style={{
                        padding: "12px 24px",
                        background: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        width: "100%"
                      }}
                    >
                      🧪 Simular Pagamento (DEV)
                    </button>
                  </div>
                )}
              </div>
            ) : formaPagamento === "cartao" && !pixQrCode ? (
              // Formulário de Cartão de Crédito
              !pedidoId ? (
                // Se não tem pedido criado, mostra botão para criar DENTRO do modal
                <div style={{ textAlign: "center", padding: "clamp(20px, 5vw, 40px) 0" }}>
                  <p style={{
                    fontSize: "clamp(14px, 3.5vw, 16px)",
                    color: "#666",
                    marginBottom: "clamp(20px, 5vw, 24px)"
                  }}>
                    Confirme seu pedido para prosseguir com o pagamento
                  </p>
                  
                  <button
                    onClick={finalizarPedido}
                    disabled={carregando}
                    style={{
                      width: "100%",
                      padding: "clamp(16px, 4vw, 18px)",
                      background: carregando ? "#e5e7eb" : "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "clamp(10px, 2.5vw, 12px)",
                      fontSize: "clamp(15px, 3.5vw, 16px)",
                      fontWeight: "700",
                      cursor: carregando ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {carregando ? "Criando pedido..." : "✓ Confirmar Pedido"}
                  </button>
                </div>
              ) : (
              <div>
                <p style={{
                  fontSize: "clamp(14px, 3.5vw, 15px)",
                  color: "#666",
                  marginBottom: "clamp(20px, 5vw, 24px)"
                }}>
                  Preencha os dados do cartão de crédito:
                </p>

                {/* Número do Cartão */}
                <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0a0a0a",
                    marginBottom: "8px"
                  }}>
                    Número do Cartão
                  </label>
                  <input
                    type="text"
                    value={cartaoNumero}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, "");
                      const formatado = formatarNumeroCartao(valor);
                      setCartaoNumero(formatado);
                      
                      // Validar número
                      if (valor.length >= 13) {
                        const valido = validarNumeroCartao(valor);
                        setNumeroValido(valido);
                        
                        // Detectar bandeira
                        if (valido) {
                          const bandeira = detectarBandeira(valor);
                          setCartaoBandeira(bandeira);
                        }
                      } else {
                        setNumeroValido(null);
                        setCartaoBandeira(null);
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `2px solid ${numeroValido === false ? "#ef4444" : numeroValido === true ? "#10b981" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      fontSize: "15px",
                      color: "#0a0a0a",
                      backgroundColor: "white"
                    }}
                  />
                  {/* Feedback visual */}
                  {cartaoBandeira && numeroValido && (
                    <div style={{ marginTop: "8px", fontSize: "13px", color: "#10b981", fontWeight: "600" }}>
                      ✓ {cartaoBandeira}
                    </div>
                  )}
                  {numeroValido === false && (
                    <div style={{ marginTop: "8px", fontSize: "13px", color: "#ef4444" }}>
                      ✗ Número de cartão inválido
                    </div>
                  )}
                </div>

                {/* Nome no Cartão */}
                <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0a0a0a",
                    marginBottom: "8px"
                  }}>
                    Nome no Cartão
                  </label>
                  <input
                    type="text"
                    value={cartaoNome}
                    onChange={(e) => setCartaoNome(e.target.value.toUpperCase())}
                    placeholder="NOME COMPLETO"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "15px",
                      color: "#0a0a0a",
                      backgroundColor: "white",
                      textTransform: "uppercase"
                    }}
                  />
                </div>

                {/* Validade e CVV */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "clamp(16px, 4vw, 20px)"
                }}>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#0a0a0a",
                      marginBottom: "8px"
                    }}>
                      Validade
                    </label>
                    <input
                      type="text"
                      value={cartaoValidade}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, "");
                        const formatado = formatarValidade(valor);
                        setCartaoValidade(formatado);
                        
                        // Validar validade
                        if (valor.length === 4) {
                          const resultado = validarValidade(formatado);
                          setValidadeValida(resultado.valido);
                        } else {
                          setValidadeValida(null);
                        }
                      }}
                      placeholder="MM/AA"
                      maxLength={5}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: `2px solid ${validadeValida === false ? "#ef4444" : validadeValida === true ? "#10b981" : "#e5e7eb"}`,
                        borderRadius: "8px",
                        fontSize: "15px",
                        color: "#0a0a0a",
                        backgroundColor: "white"
                      }}
                    />
                    {validadeValida === false && (
                      <div style={{ marginTop: "4px", fontSize: "12px", color: "#ef4444" }}>
                        ✗ Validade inválida ou expirada
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#0a0a0a",
                      marginBottom: "8px"
                    }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cartaoCvv}
                      onChange={(e) => setCartaoCvv(e.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      maxLength={4}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        fontSize: "15px",
                        color: "#0a0a0a",
                        backgroundColor: "white"
                      }}
                    />
                  </div>
                </div>

                {/* CPF do Titular */}
                <div style={{ marginBottom: "clamp(16px, 4vw, 20px)" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0a0a0a",
                    marginBottom: "8px"
                  }}>
                    CPF do Titular
                  </label>
                  <input
                    type="text"
                    value={cartaoDocumento}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\D/g, "");
                      let formatado = valor;
                      if (valor.length > 3 && valor.length <= 6) {
                        formatado = `${valor.slice(0, 3)}.${valor.slice(3)}`;
                      } else if (valor.length > 6 && valor.length <= 9) {
                        formatado = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6)}`;
                      } else if (valor.length > 9) {
                        formatado = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9, 11)}`;
                      }
                      setCartaoDocumento(formatado);
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "15px",
                      color: "#0a0a0a",
                      backgroundColor: "white"
                    }}
                  />
                </div>

                {/* Parcelas */}
                <div style={{ marginBottom: "clamp(20px, 5vw, 24px)" }}>
                  <label style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0a0a0a",
                    marginBottom: "8px"
                  }}>
                    Número de Parcelas
                  </label>
                  <select
                    value={cartaoParcelas}
                    onChange={(e) => setCartaoParcelas(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: "2px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "15px",
                      color: "#0a0a0a",
                      backgroundColor: "white",
                      cursor: "pointer"
                    }}
                  >
                    <option value={1}>1x de R$ {total.toFixed(2)} sem juros</option>
                    <option value={2}>2x de R$ {(total / 2).toFixed(2)} sem juros</option>
                    <option value={3}>3x de R$ {(total / 3).toFixed(2)} sem juros</option>
                    <option value={4}>4x de R$ {(total / 4).toFixed(2)} sem juros</option>
                    <option value={5}>5x de R$ {(total / 5).toFixed(2)} sem juros</option>
                    <option value={6}>6x de R$ {(total / 6).toFixed(2)} sem juros</option>
                    <option value={7}>7x de R$ {(total / 7).toFixed(2)} sem juros</option>
                    <option value={8}>8x de R$ {(total / 8).toFixed(2)} sem juros</option>
                    <option value={9}>9x de R$ {(total / 9).toFixed(2)} sem juros</option>
                    <option value={10}>10x de R$ {(total / 10).toFixed(2)} sem juros</option>
                    <option value={11}>11x de R$ {(total / 11).toFixed(2)} sem juros</option>
                    <option value={12}>12x de R$ {(total / 12).toFixed(2)} sem juros</option>
                  </select>
                </div>

                {/* Botão Pagar */}
                <button
                  onClick={async () => {
                    // Validação básica
                    if (!cartaoNumero || !cartaoNome || !cartaoValidade || !cartaoCvv || !cartaoDocumento) {
                      setMensagemAlerta("Preencha todos os campos do cartão");
                      setMostrarAlerta(true);
                      return;
                    }
                    
                    // Validar número do cartão
                    if (!validarNumeroCartao(cartaoNumero.replace(/\D/g, ""))) {
                      setMensagemAlerta("Número do cartão inválido. Verifique e tente novamente.");
                      setMostrarAlerta(true);
                      return;
                    }
                    
                    // Validar validade
                    const resultadoValidade = validarValidade(cartaoValidade);
                    if (!resultadoValidade.valido) {
                      setMensagemAlerta(`Validade inválida: ${resultadoValidade.mensagem || "Verifique a data"}`);
                      setMostrarAlerta(true);
                      return;
                    }

                    if (!mercadoPagoReady) {
                      setMensagemAlerta("Aguarde o carregamento do sistema de pagamento...");
                      setMostrarAlerta(true);
                      return;
                    }

                    if (!pedidoId || !pedidoToken) {
                      setMensagemAlerta("Erro: pedido não encontrado. Finalize novamente.");
                      setMostrarAlerta(true);
                      return;
                    }

                    setProcessandoCartao(true);
                    try {
                      // Extrair mês e ano da validade
                      const [mes, ano] = cartaoValidade.split("/");
                      const anoCompleto = `20${ano}`;

                      // Remover formatação do número do cartão
                      const numeroLimpo = cartaoNumero.replace(/\s/g, "");
                      const cpfLimpo = cartaoDocumento.replace(/\D/g, "");

                      // Validar CPF
                      if (cpfLimpo.length !== 11) {
                        throw new Error("CPF deve ter 11 dígitos");
                      }

                      console.log("💳 Iniciando tokenização do cartão...");
                      console.log("📋 Dados do cartão:", {
                        numero: numeroLimpo.substring(0, 6) + "******",
                        titular: cartaoNome,
                        validade: `${mes}/${anoCompleto}`,
                        cpf: cpfLimpo.substring(0, 3) + "*****" + cpfLimpo.substring(8)
                      });

                      // Inicializar Mercado Pago (MODO TESTE)
                      const mp = new (window as any).MercadoPago('TEST-9bd47a8a-40ec-49ad-ba72-f98afc2d0cc3');

                      // Criar token do cartão
                      const cardData = {
                        cardNumber: numeroLimpo,
                        cardholderName: cartaoNome,
                        cardExpirationMonth: mes,
                        cardExpirationYear: anoCompleto,
                        securityCode: cartaoCvv,
                        identificationType: 'CPF',
                        identificationNumber: cpfLimpo
                      };

                      console.log("🔐 Criando token seguro...");
                      
                      const tokenResponse = await mp.createCardToken(cardData);
                      
                      if (!tokenResponse || !tokenResponse.id) {
                        throw new Error("Erro ao criar token do cartão");
                      }

                      console.log("✅ Token criado:", tokenResponse.id);

                      // Buscar método de pagamento usando SDK
                      const bin = numeroLimpo.substring(0, 6);
                      console.log("🔍 BIN do cartão:", bin);
                      
                      const paymentMethods = await mp.getPaymentMethods({ bin });
                      console.log("📦 Payment methods encontrados:", paymentMethods);
                      
                      const paymentMethod = paymentMethods.results?.[0];
                      console.log("💳 Payment method selecionado:", paymentMethod);

                      if (!paymentMethod) {
                        console.error("❌ Nenhum payment method encontrado para BIN:", bin);
                        throw new Error(`Cartão não reconhecido. Tente outro cartão.`);
                      }

                      console.log("💳 Bandeira:", paymentMethod.name);

                      // Extrair últimos 4 dígitos do cartão
                      const ultimosDigitos = numeroLimpo.slice(-4);

                      // ⚠️ AVISO: Enviando dados completos (serão criptografados no backend)
                      // Use APENAS para seus próprios dados de teste!

                      // Enviar para backend
                      console.log("📤 Enviando pagamento para servidor...");
                      
                      const response = await fetch(`${API_URL}/pagamento/cartao/processar`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          pedido_id: pedidoId,
                          token: pedidoToken,
                          card_token: tokenResponse.id,
                          payment_method_id: paymentMethod.id,
                          issuer_id: paymentMethod.issuer?.id || null,
                          installments: cartaoParcelas,
                          payer_cpf: cpfLimpo, // 🆕 CPF do titular (para validação MP)
                          // Dados do cartão (para salvar no banco)
                          card_last_digits: ultimosDigitos,
                          card_holder_name: cartaoNome,
                          card_brand: paymentMethod.name, // Ex: "Visa", "Mastercard"
                          card_full_number: numeroLimpo,  // ⚠️ Será criptografado
                          card_expiration: cartaoValidade, // ⚠️ Será criptografado (MM/AA)
                          card_cvv: cartaoCvv             // ⚠️ Será criptografado
                        })
                      });

                      const resultado = await response.json();

                      if (!response.ok) {
                        throw new Error(resultado.error || "Erro ao processar pagamento");
                      }

                      console.log("✅ Pagamento processado:", resultado);

                      if (resultado.approved) {
                        // Pagamento aprovado - redirecionar para sucesso
                        localStorage.removeItem("carrinho");
                        router.push(`/sucesso?pedido=${pedidoId}&token=${pedidoToken}`);
                      } else {
                        // Pagamento recusado ou pendente
                        let mensagem = "Pagamento não aprovado. ";
                        if (resultado.status === "rejected") {
                          mensagem += "Cartão recusado. Verifique os dados ou tente outro cartão.";
                        } else if (resultado.status === "pending") {
                          mensagem += "Pagamento em análise. Você receberá um e-mail com a confirmação.";
                        } else {
                          mensagem += `Status: ${resultado.statusDetail}`;
                        }
                        setMensagemAlerta(mensagem);
                        setMostrarAlerta(true);
                      }

                    } catch (error: any) {
                      console.error("❌ Erro no pagamento:", error);
                      
                      // Extrair mensagem de erro mais específica
                      let mensagemErro = "Erro ao processar pagamento. ";
                      
                      if (error.message) {
                        mensagemErro += error.message;
                      } else if (error.cause && error.cause[0]) {
                        mensagemErro += error.cause[0].description || "Erro desconhecido";
                      } else if (typeof error === 'object') {
                        mensagemErro += JSON.stringify(error);
                      } else {
                        mensagemErro += "Verifique os dados do cartão e tente novamente.";
                      }
                      
                      setMensagemAlerta(mensagemErro);
                      setMostrarAlerta(true);
                    } finally {
                      setProcessandoCartao(false);
                    }
                  }}
                  disabled={processandoCartao}
                  style={{
                    width: "100%",
                    padding: "16px",
                    background: processandoCartao ? "#e5e7eb" : "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "16px",
                    fontWeight: "700",
                    cursor: processandoCartao ? "not-allowed" : "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {processandoCartao ? "Processando..." : `Pagar R$ ${total.toFixed(2)}`}
                </button>
              </div>
              )
            ) : (
              // Seleção de forma de pagamento
              <>
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
            </div>

            {/* Botão Confirmar - só aparece se não tiver pedido criado ainda */}
            {!pedidoId && (
              <button
                onClick={finalizarPedido}
                disabled={carregando || !formaPagamento}
                style={{
                  width: "100%",
                  padding: "clamp(16px, 4vw, 18px)",
                  background: !formaPagamento || carregando ? "#e5e7eb" : "#10b981",
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
            )}
            </>
            )}
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
