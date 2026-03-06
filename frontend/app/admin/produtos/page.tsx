"use client";

import { API_URL } from "@/lib/api";
import { getAdminLoginPath } from "@/lib/admin-paths";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import { usePermissoes } from "@/lib/usePermissoes";
import { ProtegerRota, usePodeExecutar } from "@/lib/ProtegerRota";

export default function AdminProdutos() {
  return <ProdutosConteudo />;
}

function ProdutosConteudo() {
  const router = useRouter();
  const podeCriar = usePodeExecutar('pode_criar_produtos');
  const podeEditar = usePodeExecutar('pode_editar_produtos');
  const podeDeletar = usePodeExecutar('pode_deletar_produtos');
  const podeGerenciarEstoque = usePodeExecutar('pode_gerenciar_estoque');
  const podeUploadImagens = usePodeExecutar('pode_upload_imagens');
  
  const [autenticado, setAutenticado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtosPorPagina = 30;

  const [novoNome, setNovoNome] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoEstoque, setNovoEstoque] = useState("");
  const [novaImagem, setNovaImagem] = useState("");
  const [novaImagemArquivo, setNovaImagemArquivo] = useState<File | null>(null);
  const [novoPeso, setNovoPeso] = useState("");
  const [novaAltura, setNovaAltura] = useState("");
  const [novaLargura, setNovaLargura] = useState("");
  const [novoComprimento, setNovoComprimento] = useState("");

  const [categorias, setCategorias] = useState<any[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editDescricao, setEditDescricao] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editEstoque, setEditEstoque] = useState("");
  const [editImagem, setEditImagem] = useState("");
  const [editImagemArquivo, setEditImagemArquivo] = useState<File | null>(null);
  const [editPeso, setEditPeso] = useState("");
  const [editAltura, setEditAltura] = useState("");
  const [editLargura, setEditLargura] = useState("");
  const [editComprimento, setEditComprimento] = useState("");
  const [editandoCategoria, setEditandoCategoria] = useState("");

  const formatarPreco = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    const numero = Number(numeros) / 100;
    return numero.toFixed(2);
  };

  const formatarPrecoExibicao = (valor: string) => {
    const numeros = valor.replace(/\D/g, '');
    const numero = Number(numeros) / 100;
    return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const converterParaBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const mostrarToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const carregarProdutos = () => {
    const token = localStorage.getItem("token");
    
    fetch(`${API_URL}/admin/produtos`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          router.push(getAdminLoginPath());
          return [];
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setProdutos(data);
          setProdutosFiltrados(data);
        }
      });
  };

  const carregarCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/categorias`);
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    let resultado = produtos;

    if (busca) {
      resultado = resultado.filter(p => 
        p.nome.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (filtroStatus === "ativos") {
      resultado = resultado.filter(p => p.ativo === true && p.estoque > 0);
    } else if (filtroStatus === "inativos") {
      resultado = resultado.filter(p => p.ativo === false || p.estoque === 0);
    }

    setProdutosFiltrados(resultado);
    setPaginaAtual(1); // Reset para primeira página quando filtrar
  }, [busca, filtroStatus, produtos]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push(getAdminLoginPath());
      return;
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      const userData = JSON.parse(usuario);
      setNomeUsuario(userData.nome || userData.email);
    }
    
    setAutenticado(true);
    carregarProdutos();
    carregarCategorias();
  }, [router]);

  const criarProduto = async () => {
    if (!novoNome || !novoPreco || !novoEstoque) {
      mostrarToast("Preencha os campos obrigatórios: Nome, Preço e Estoque", "error");
      return;
    }

    try {
      let imagemUrl = novaImagem;
      const token = localStorage.getItem("token");

      if (novaImagemArquivo) {
        const base64 = await converterParaBase64(novaImagemArquivo);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ imagem: base64 })
        });

        if (!uploadRes.ok) {
          mostrarToast("Erro ao fazer upload da imagem", "error");
          return;
        }

        const uploadData = await uploadRes.json();
        imagemUrl = uploadData.url;
      }

      const response = await fetch(`${API_URL}/admin/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: novoNome,
          descricao: null,
          preco: Number(formatarPreco(novoPreco)),
          estoque: Number(novoEstoque),
          imagem_url: imagemUrl || null,
          peso_kg: novoPeso ? Number(novoPeso) : null,
          altura_cm: novaAltura ? Number(novaAltura) : null,
          largura_cm: novaLargura ? Number(novaLargura) : null,
          comprimento_cm: novoComprimento ? Number(novoComprimento) : null,
          categoria_id: novaCategoria || null
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao criar produto");
      }

      setNovoNome("");
      setNovaDescricao("");
      setNovoPreco("");
      setNovoEstoque("");
      setNovaImagem("");
      setNovaImagemArquivo(null);
      setNovoPeso("");
      setNovaAltura("");
      setNovaLargura("");
      setNovoComprimento("");
      setNovaCategoria("");

      carregarProdutos();
      mostrarToast("✓ Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      mostrarToast("Erro ao criar produto", "error");
    }
  };

  const iniciarEdicao = (produto: any) => {
    setEditandoId(produto.id);
    setEditNome(produto.nome);
    setEditDescricao(produto.descricao || "");
    setEditPreco((Number(produto.preco) * 100).toFixed(0));
    setEditEstoque(produto.estoque);
    setEditImagem(produto.imagem_url || "");
    setEditImagemArquivo(null);
    setEditPeso(produto.peso_kg || "");
    setEditAltura(produto.altura_cm || "");
    setEditLargura(produto.largura_cm || "");
    setEditComprimento(produto.comprimento_cm || "");
    setEditandoCategoria(produto.categoria_id || "");
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditNome("");
    setEditPreco("");
    setEditEstoque("");
    setEditImagem("");
    setEditImagemArquivo(null);
    setEditPeso("");
    setEditAltura("");
    setEditLargura("");
    setEditComprimento("");
  };

  const salvarEdicao = async (id: number) => {
    try {
      let imagemUrl = editImagem;
      const token = localStorage.getItem("token");

      if (editImagemArquivo) {
        const base64 = await converterParaBase64(editImagemArquivo);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ imagem: base64 })
        });

        if (!uploadRes.ok) {
          mostrarToast("Erro ao fazer upload da imagem", "error");
          return;
        }

        const uploadData = await uploadRes.json();
        imagemUrl = uploadData.url;
      }

      const response = await fetch(`${API_URL}/admin/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: editNome,
          descricao: editDescricao || null,
          preco: Number(formatarPreco(editPreco)),
          estoque: Number(editEstoque),
          imagem_url: imagemUrl || null,
          peso_kg: editPeso ? Number(editPeso) : null,
          altura_cm: editAltura ? Number(editAltura) : null,
          largura_cm: editLargura ? Number(editLargura) : null,
          comprimento_cm: editComprimento ? Number(editComprimento) : null,
          categoria_id: editandoCategoria || null
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao editar produto");
      }

      cancelarEdicao();
      carregarProdutos();
      mostrarToast("✓ Produto atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      mostrarToast("Erro ao editar produto", "error");
    }
  };

  const deletarProduto = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este produto?")) {
      return;
    }

    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/admin/produtos/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    carregarProdutos();
  };

  const alternarStatus = async (id: number, ativoAtual: boolean) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/admin/produtos/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ativo: !ativoAtual })
      });

      if (response.ok) {
        mostrarToast(
          !ativoAtual ? "✓ Produto ativado!" : "✓ Produto inativado!",
          "success"
        );
        carregarProdutos();
      }
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      mostrarToast("Erro ao alterar status do produto", "error");
    }
  };

  // Cálculos de paginação
  const totalPaginas = Math.ceil(produtosFiltrados.length / produtosPorPagina);
  const indexUltimoProduto = paginaAtual * produtosPorPagina;
  const indexPrimeiroProduto = indexUltimoProduto - produtosPorPagina;
  const produtosPaginaAtual = produtosFiltrados.slice(indexPrimeiroProduto, indexUltimoProduto);

  if (!autenticado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }}>
      <AdminHeader />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px)" }}>
      {/* TOAST NOTIFICATION */}
      <div
        className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ${
          toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className={`${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}
        style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}>
          {toast.type === 'success' ? (
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      </div>

        {podeCriar && (
          <div className="bg-white shadow-md mb-8" style={{ padding: "clamp(16px, 4vw, 24px)", borderRadius: "clamp(12px, 2vw, 16px)" }}>
            <h2 style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>Novo Produto</h2>

            <div className="space-y-4 sm:space-y-5">
              {/* Seção 1 - Informações */}
              <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", marginBottom: "12px" }}>📦 Informações do Produto</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Nome *</label>
                    <input
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                      placeholder="Nome do produto"
                      value={novoNome}
                      onChange={e => setNovoNome(e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Preço (R$) *</label>
                      <input
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                        placeholder="0,00"
                        type="text"
                        value={formatarPrecoExibicao(novoPreco)}
                        onChange={e => {
                          const numeros = e.target.value.replace(/\D/g, '');
                          setNovoPreco(numeros);
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Estoque *</label>
                      <input
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                        placeholder="0"
                        type="number"
                        value={novoEstoque}
                        onChange={e => setNovoEstoque(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Categoria</label>
                    <select
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: "#0a0a0a" }}
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção 2 - Imagem */}
              <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", marginBottom: "12px" }}>🖼 Imagem do Produto</h3>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    minHeight: "118px",
                    padding: "14px",
                    border: "2px dashed #d1d5db",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#6b7280",
                    textAlign: "center",
                    background: "#fafafa"
                  }}
                >
                  <span style={{ fontWeight: 600, marginBottom: "4px" }}>Arraste uma imagem aqui ou clique para selecionar</span>
                  <span style={{ fontSize: "12px" }}>{novaImagemArquivo ? `Selecionado: ${novaImagemArquivo.name}` : "PNG, JPG ou WEBP"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        setNovaImagemArquivo(e.target.files[0]);
                        setNovaImagem("");
                      }
                    }}
                  />
                </label>

                {novaImagemArquivo && (
                  <div style={{ marginTop: "12px" }}>
                    <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>Preview:</p>
                    <img
                      src={URL.createObjectURL(novaImagemArquivo)}
                      alt="Preview"
                      style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #d1d5db" }}
                    />
                  </div>
                )}
              </div>

              {/* Seção 3 - Dimensões */}
              <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "16px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>📏 Dimensões para Frete</h3>
                <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "12px" }}>
                  Campos opcionais - podem ser preenchidos depois
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Peso (kg)</label>
                    <input
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                      placeholder="0.0"
                      type="number"
                      step="0.001"
                      value={novoPeso}
                      onChange={e => setNovoPeso(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Altura (cm)</label>
                    <input
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                      placeholder="0"
                      type="number"
                      value={novaAltura}
                      onChange={e => setNovaAltura(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Largura (cm)</label>
                    <input
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                      placeholder="0"
                      type="number"
                      value={novaLargura}
                      onChange={e => setNovaLargura(e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Comprimento (cm)</label>
                    <input
                      style={{ width: "100%", padding: "10px 12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", color: "#0a0a0a" }}
                      placeholder="0"
                      type="number"
                      value={novoComprimento}
                      onChange={e => setNovoComprimento(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={criarProduto}
              style={{ width: "100%", marginTop: "16px", background: "#2563eb", color: "white", padding: "14px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}
            >
              ✓ Criar Produto
            </button>
          </div>
        )}

        <div className="bg-white shadow-md mb-8" style={{ padding: "clamp(16px, 4vw, 24px)", borderRadius: "clamp(12px, 2vw, 16px)" }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>🔍 Filtros</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))", gap: "clamp(12px, 3vw, 16px)" }}>
            <div>
              <label style={{ display: "block", fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>Buscar por nome</label>
              <input
                type="text"
                placeholder="Digite o nome do produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(12px, 2.5vw, 14px)", color: "#0a0a0a" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(12px, 2.5vw, 14px)", color: "#0a0a0a", cursor: "pointer" }}
              >
                <option value="todos">📦 Todos os produtos</option>
                <option value="ativos">✅ Apenas ativos</option>
                <option value="inativos">❌ Apenas inativos</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "16px", fontSize: "clamp(11px, 2.2vw, 13px)", color: "#6b7280" }}>
            Exibindo <strong>{produtosFiltrados.length}</strong> de <strong>{produtos.length}</strong> produtos
          </div>
        </div>

        <div className="bg-white shadow-md" style={{ padding: "clamp(16px, 4vw, 24px)", borderRadius: "clamp(12px, 2vw, 16px)" }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 24px)", fontWeight: "600", color: "#374151", marginBottom: "16px" }}>Lista de Produtos</h2>

          {produtosFiltrados.length === 0 ? (
            <p style={{ color: "#9ca3af", textAlign: "center", padding: "32px 0", fontSize: "clamp(12px, 2.5vw, 14px)" }}>
              {produtos.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado com esses filtros"}
            </p>
          ) : (
            <div style={{ overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
              <table style={{ width: "100%", minWidth: "880px", borderCollapse: "separate", borderSpacing: 0 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>Imagem</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>Produto</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>Preço</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>Estoque</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>Status</th>
                    <th style={{ textAlign: "left", padding: "12px 10px", fontSize: "12px", color: "#64748b", fontWeight: 700 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosPaginaAtual.map((p) => {
                    const estoqueNum = Number(p.estoque || 0);
                    const corEstoque = estoqueNum <= 0 ? "#dc2626" : estoqueNum <= 10 ? "#ea580c" : "#16a34a";
                    const textoEstoque = estoqueNum <= 0 ? "Sem estoque" : estoqueNum <= 10 ? `${estoqueNum} (baixo)` : `${estoqueNum} unidades`;

                    return (
                      <Fragment key={p.id}>
                        <tr
                          style={{
                            borderTop: "1px solid #e5e7eb",
                            transition: "background-color 0.2s ease",
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                        >
                          <td style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb" }}>
                            {p.imagem_url ? (
                              <img
                                src={p.imagem_url}
                                alt={p.nome}
                                style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }}
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                            ) : (
                              <div style={{ width: "44px", height: "44px", borderRadius: "8px", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🌸</div>
                            )}
                          </td>

                          <td style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb" }}>
                            <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "#1f2937", lineHeight: 1.3 }}>{p.nome}</p>
                            {p.categoria_nome && <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>{p.categoria_nome}</p>}
                          </td>

                          <td style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb", fontSize: "13px", fontWeight: 700, color: "#166534" }}>
                            R$ {Number(p.preco).toFixed(2)}
                          </td>

                          <td style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb" }}>
                            <span style={{ fontSize: "12px", fontWeight: 700, color: corEstoque }}>{textoEstoque}</span>
                          </td>

                          <td style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb" }}>
                            {p.ativo ? (
                              <span style={{ display: "inline-block", padding: "4px 9px", borderRadius: "999px", background: "#dcfce7", color: "#166534", fontSize: "11px", fontWeight: 700 }}>
                                🟢 Ativo
                              </span>
                            ) : (
                              <span style={{ display: "inline-block", padding: "4px 9px", borderRadius: "999px", background: "#fee2e2", color: "#991b1b", fontSize: "11px", fontWeight: 700 }}>
                                🔴 Inativo
                              </span>
                            )}
                          </td>

                          <td style={{ padding: "8px 10px", borderTop: "1px solid #e5e7eb" }}>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", opacity: 0.92 }}>
                              {podeEditar && (
                                <button
                                  onClick={() => iniciarEdicao(p)}
                                  style={{ background: "#f59e0b", color: "white", padding: "6px 8px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}
                                >
                                  ✏ Editar
                                </button>
                              )}
                              {podeGerenciarEstoque && (
                                <button
                                  onClick={() => alternarStatus(p.id, p.ativo)}
                                  style={{ background: p.ativo ? "#f97316" : "#16a34a", color: "white", padding: "6px 8px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}
                                >
                                  {p.ativo ? "⏸ Inativar" : "▶ Ativar"}
                                </button>
                              )}
                              {podeDeletar && (
                                <button
                                  onClick={() => deletarProduto(p.id)}
                                  style={{ background: "#dc2626", color: "white", padding: "6px 8px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700 }}
                                >
                                  🗑 Deletar
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {editandoId === p.id && (
                          <tr>
                            <td colSpan={6} style={{ padding: "14px", background: "#fafafa", borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 3vw, 16px)" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "clamp(8px, 2vw, 12px)" }}>
                                  <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "block", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Nome</label>
                                    <input
                                      style={{ width: "100%", padding: "clamp(6px, 1.5vw, 10px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(11px, 2.2vw, 13px)", color: "#0a0a0a" }}
                                      value={editNome}
                                      onChange={e => setEditNome(e.target.value)}
                                    />
                                  </div>

                                  <div style={{ gridColumn: "1 / -1" }}>
                                    <label style={{ display: "block", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Descrição</label>
                                    <textarea
                                      style={{ width: "100%", padding: "clamp(6px, 1.5vw, 10px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(11px, 2.2vw, 13px)", color: "#0a0a0a" }}
                                      placeholder="Descrição do produto"
                                      rows={3}
                                      value={editDescricao}
                                      onChange={e => setEditDescricao(e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: "block", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Preço (R$)</label>
                                    <input
                                      style={{ width: "100%", padding: "clamp(6px, 1.5vw, 10px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(11px, 2.2vw, 13px)", color: "#0a0a0a" }}
                                      type="text"
                                      placeholder="0,00"
                                      value={formatarPrecoExibicao(editPreco)}
                                      onChange={e => {
                                        const numeros = e.target.value.replace(/\D/g, '');
                                        setEditPreco(numeros);
                                      }}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: "block", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Estoque</label>
                                    <input
                                      style={{ width: "100%", padding: "clamp(6px, 1.5vw, 10px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(11px, 2.2vw, 13px)", color: "#0a0a0a" }}
                                      type="number"
                                      value={editEstoque}
                                      onChange={e => setEditEstoque(e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <label style={{ display: "block", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Categoria</label>
                                    <select
                                      value={editandoCategoria}
                                      onChange={(e) => setEditandoCategoria(e.target.value)}
                                      style={{
                                        width: "100%",
                                        padding: "10px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#0a0a0a"
                                      }}
                                    >
                                      <option value="">Sem categoria</option>
                                      {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label style={{ display: "block", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>Imagem</label>
                                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "clamp(8px, 2vw, 10px)", border: "2px dashed #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", cursor: "pointer", fontSize: "clamp(11px, 2.2vw, 13px)", color: "#6b7280" }}>
                                    <span>
                                      {editImagemArquivo ? `📷 ${editImagemArquivo.name}` : "📷 Alterar Imagem"}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      style={{ display: "none" }}
                                      onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                          setEditImagemArquivo(e.target.files[0]);
                                        }
                                      }}
                                    />
                                  </label>
                                </div>

                                {(editImagemArquivo || editImagem) && (
                                  <div>
                                    <p style={{ fontSize: "clamp(11px, 2.2vw, 13px)", color: "#6b7280", marginBottom: "8px" }}>Preview da Imagem:</p>
                                    <img 
                                      src={editImagemArquivo ? URL.createObjectURL(editImagemArquivo) : editImagem} 
                                      alt="Preview" 
                                      style={{ width: "clamp(80px, 20vw, 128px)", height: "clamp(80px, 20vw, 128px)", objectFit: "cover", borderRadius: "clamp(6px, 1.5vw, 8px)", border: "1px solid #d1d5db" }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}

                                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
                                  <h4 style={{ fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>📦 Dimensões</h4>
                                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 100px), 1fr))", gap: "clamp(8px, 2vw, 12px)" }}>
                                    <div>
                                      <label style={{ display: "block", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Peso (kg)</label>
                                      <input
                                        style={{ width: "100%", padding: "clamp(6px, 1.5vw, 8px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(10px, 2vw, 12px)", color: "#0a0a0a" }}
                                        placeholder="0.0"
                                        type="number"
                                        step="0.001"
                                        value={editPeso}
                                        onChange={e => setEditPeso(e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <label style={{ display: "block", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Altura (cm)</label>
                                      <input
                                        style={{ width: "100%", padding: "clamp(6px, 1.5vw, 8px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(10px, 2vw, 12px)", color: "#0a0a0a" }}
                                        placeholder="0"
                                        type="number"
                                        value={editAltura}
                                        onChange={e => setEditAltura(e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <label style={{ display: "block", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Largura (cm)</label>
                                      <input
                                        style={{ width: "100%", padding: "clamp(6px, 1.5vw, 8px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(10px, 2vw, 12px)", color: "#0a0a0a" }}
                                        placeholder="0"
                                        type="number"
                                        value={editLargura}
                                        onChange={e => setEditLargura(e.target.value)}
                                      />
                                    </div>

                                    <div>
                                      <label style={{ display: "block", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>Comprimento (cm)</label>
                                      <input
                                        style={{ width: "100%", padding: "clamp(6px, 1.5vw, 8px)", border: "1px solid #d1d5db", borderRadius: "clamp(6px, 1.5vw, 8px)", fontSize: "clamp(10px, 2vw, 12px)", color: "#0a0a0a" }}
                                        placeholder="0"
                                        type="number"
                                        value={editComprimento}
                                        onChange={e => setEditComprimento(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px, 2vw, 12px)" }}>
                                  <button
                                    onClick={() => salvarEdicao(p.id)}
                                    style={{ flex: "1 1 auto", background: "#16a34a", color: "white", padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)", borderRadius: "clamp(6px, 1.5vw, 8px)", border: "none", cursor: "pointer", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500" }}
                                  >
                                    ✓ Salvar
                                  </button>
                                  <button
                                    onClick={cancelarEdicao}
                                    style={{ flex: "1 1 auto", background: "#6b7280", color: "white", padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)", borderRadius: "clamp(6px, 1.5vw, 8px)", border: "none", cursor: "pointer", fontSize: "clamp(11px, 2.2vw, 13px)", fontWeight: "500" }}
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINAÇÃO */}
          {totalPaginas > 1 && (
            <div style={{
              marginTop: "clamp(24px, 5vw, 32px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "clamp(8px, 2vw, 12px)",
              flexWrap: "wrap"
            }}>
              <button
                onClick={() => setPaginaAtual(prev => Math.max(1, prev - 1))}
                disabled={paginaAtual === 1}
                style={{
                  padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)",
                  background: paginaAtual === 1 ? "#e5e7eb" : "#3b82f6",
                  color: paginaAtual === 1 ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "clamp(6px, 1.5vw, 8px)",
                  fontSize: "clamp(12px, 2.5vw, 14px)",
                  fontWeight: "600",
                  cursor: paginaAtual === 1 ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                ← Anterior
              </button>

              <div style={{
                display: "flex",
                gap: "clamp(4px, 1vw, 6px)",
                alignItems: "center"
              }}>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(pagina => (
                  <button
                    key={pagina}
                    onClick={() => setPaginaAtual(pagina)}
                    style={{
                      padding: "clamp(8px, 2vw, 10px)",
                      minWidth: "clamp(32px, 8vw, 40px)",
                      background: paginaAtual === pagina ? "#3b82f6" : "white",
                      color: paginaAtual === pagina ? "white" : "#374151",
                      border: `1px solid ${paginaAtual === pagina ? "#3b82f6" : "#d1d5db"}`,
                      borderRadius: "clamp(6px, 1.5vw, 8px)",
                      fontSize: "clamp(12px, 2.5vw, 14px)",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      if (paginaAtual !== pagina) {
                        e.currentTarget.style.background = "#f3f4f6";
                      }
                    }}
                    onMouseOut={(e) => {
                      if (paginaAtual !== pagina) {
                        e.currentTarget.style.background = "white";
                      }
                    }}
                  >
                    {pagina}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1))}
                disabled={paginaAtual === totalPaginas}
                style={{
                  padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)",
                  background: paginaAtual === totalPaginas ? "#e5e7eb" : "#3b82f6",
                  color: paginaAtual === totalPaginas ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "clamp(6px, 1.5vw, 8px)",
                  fontSize: "clamp(12px, 2.5vw, 14px)",
                  fontWeight: "600",
                  cursor: paginaAtual === totalPaginas ? "not-allowed" : "pointer",
                  transition: "all 0.2s"
                }}
              >
                Próxima →
              </button>
            </div>
          )}

          <p style={{
            textAlign: "center",
            marginTop: "clamp(12px, 3vw, 16px)",
            fontSize: "clamp(11px, 2.2vw, 13px)",
            color: "#6b7280"
          }}>
            Mostrando {indexPrimeiroProduto + 1} a {Math.min(indexUltimoProduto, produtosFiltrados.length)} de {produtosFiltrados.length} produtos
          </p>
        </div>
      </div>
    </div>
  );
}
