"use client";

import { API_URL } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";

export default function AdminProdutos() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [produtos, setProdutos] = useState<any[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<any[]>([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const [novoNome, setNovoNome] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoEstoque, setNovoEstoque] = useState("");
  const [novaImagem, setNovaImagem] = useState("");
  const [novaImagemArquivo, setNovaImagemArquivo] = useState<File | null>(null);
  const [novoPeso, setNovoPeso] = useState("");
  const [novaAltura, setNovaAltura] = useState("");
  const [novaLargura, setNovaLargura] = useState("");
  const [novoComprimento, setNovoComprimento] = useState("");

  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editPreco, setEditPreco] = useState("");
  const [editEstoque, setEditEstoque] = useState("");
  const [editImagem, setEditImagem] = useState("");
  const [editImagemArquivo, setEditImagemArquivo] = useState<File | null>(null);
  const [editPeso, setEditPeso] = useState("");
  const [editAltura, setEditAltura] = useState("");
  const [editLargura, setEditLargura] = useState("");
  const [editComprimento, setEditComprimento] = useState("");

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
          router.push("/admin/login");
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
  }, [busca, filtroStatus, produtos]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const usuario = localStorage.getItem("usuario");
    if (usuario) {
      const userData = JSON.parse(usuario);
      setNomeUsuario(userData.nome || userData.email);
    }
    
    setAutenticado(true);
    carregarProdutos();
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
          preco: Number(formatarPreco(novoPreco)),
          estoque: Number(novoEstoque),
          imagem_url: imagemUrl || null,
          peso_kg: novoPeso ? Number(novoPeso) : null,
          altura_cm: novaAltura ? Number(novaAltura) : null,
          largura_cm: novaLargura ? Number(novaLargura) : null,
          comprimento_cm: novoComprimento ? Number(novoComprimento) : null
        })
      });

      if (!response.ok) {
        throw new Error("Erro ao criar produto");
      }

      setNovoNome("");
      setNovoPreco("");
      setNovoEstoque("");
      setNovaImagem("");
      setNovaImagemArquivo(null);
      setNovoPeso("");
      setNovaAltura("");
      setNovaLargura("");
      setNovoComprimento("");

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
    setEditPreco((Number(produto.preco) * 100).toFixed(0));
    setEditEstoque(produto.estoque);
    setEditImagem(produto.imagem_url || "");
    setEditImagemArquivo(null);
    setEditPeso(produto.peso_kg || "");
    setEditAltura(produto.altura_cm || "");
    setEditLargura(produto.largura_cm || "");
    setEditComprimento(produto.comprimento_cm || "");
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
          preco: Number(formatarPreco(editPreco)),
          estoque: Number(editEstoque),
          imagem_url: imagemUrl || null,
          peso_kg: editPeso ? Number(editPeso) : null,
          altura_cm: editAltura ? Number(editAltura) : null,
          largura_cm: editLargura ? Number(editLargura) : null,
          comprimento_cm: editComprimento ? Number(editComprimento) : null
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

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px" }}>
      {/* TOAST NOTIFICATION */}
      <div
        className={`fixed top-6 right-6 z-50 transform transition-all duration-300 ${
          toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className={`${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]`}>
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

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Novo Produto</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do produto"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                type="number"
                value={novoEstoque}
                onChange={e => setNovoEstoque(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
              <span className="text-gray-600">
                {novaImagemArquivo ? `📷 ${novaImagemArquivo.name}` : "📷 Escolher Imagem"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setNovaImagemArquivo(e.target.files[0]);
                    setNovaImagem("");
                  }
                }}
              />
            </label>
          </div>

          {novaImagemArquivo && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img 
                src={URL.createObjectURL(novaImagemArquivo)} 
                alt="Preview" 
                className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              />
            </div>
          )}

          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">📦 Dimensões para Cálculo de Frete</h3>
            <p className="text-xs text-gray-500 mb-3">
              Campos opcionais - podem ser preenchidos depois
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                  type="number"
                  step="0.001"
                  value={novoPeso}
                  onChange={e => setNovoPeso(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  type="number"
                  value={novaAltura}
                  onChange={e => setNovaAltura(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  type="number"
                  value={novaLargura}
                  onChange={e => setNovaLargura(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento (cm)</label>
                <input
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  type="number"
                  value={novoComprimento}
                  onChange={e => setNovoComprimento(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={criarProduto}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            ✓ Criar Produto
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">🔍 Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por nome</label>
              <input
                type="text"
                placeholder="Digite o nome do produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">📦 Todos os produtos</option>
                <option value="ativos">✅ Apenas ativos</option>
                <option value="inativos">❌ Apenas inativos</option>
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Exibindo <strong>{produtosFiltrados.length}</strong> de <strong>{produtos.length}</strong> produtos
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Produtos</h2>

          {produtosFiltrados.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {produtos.length === 0 ? "Nenhum produto cadastrado" : "Nenhum produto encontrado com esses filtros"}
            </p>
          ) : (
            <div className="space-y-4">
              {produtosFiltrados.map(p => (
                <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  {editandoId === p.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={editNome}
                            onChange={e => setEditNome(e.target.value)}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          <label className="block text-sm font-medium text-gray-700 mb-1">Estoque</label>
                          <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="number"
                            value={editEstoque}
                            onChange={e => setEditEstoque(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imagem</label>
                        <label className="flex items-center justify-center w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition text-sm">
                          <span className="text-gray-600">
                            {editImagemArquivo ? `📷 ${editImagemArquivo.name}` : "📷 Alterar Imagem"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
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
                          <p className="text-sm text-gray-600 mb-2">Preview da Imagem:</p>
                          <img 
                            src={editImagemArquivo ? URL.createObjectURL(editImagemArquivo) : editImagem} 
                            alt="Preview" 
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">📦 Dimensões</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0.0"
                              type="number"
                              step="0.001"
                              value={editPeso}
                              onChange={e => setEditPeso(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Altura (cm)</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              type="number"
                              value={editAltura}
                              onChange={e => setEditAltura(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Largura (cm)</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              type="number"
                              value={editLargura}
                              onChange={e => setEditLargura(e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comprimento (cm)</label>
                            <input
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0"
                              type="number"
                              value={editComprimento}
                              onChange={e => setEditComprimento(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => salvarEdicao(p.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          ✓ Salvar
                        </button>
                        <button
                          onClick={cancelarEdicao}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      {p.imagem_url && (
                        <img 
                          src={p.imagem_url} 
                          alt={p.nome}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-800">{p.nome}</h3>
                          {p.estoque === 0 ? (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                              SEM ESTOQUE
                            </span>
                          ) : p.ativo ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              ✓ ATIVO
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              ✕ INATIVO
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          Preço: <span className="font-medium text-green-600">R$ {Number(p.preco).toFixed(2)}</span>
                        </p>
                        <p className="text-gray-600">
                          Estoque: <span className="font-medium">{p.estoque} unidades</span>
                        </p>
                        {(p.peso_kg > 0 || p.altura_cm > 0 || p.largura_cm > 0 || p.comprimento_cm > 0) && (
                          <div className="mt-2 text-sm text-gray-500">
                            📦 Dimensões: 
                            {p.peso_kg > 0 && ` ${p.peso_kg}kg`}
                            {p.altura_cm > 0 && ` | ${p.altura_cm}cm (A)`}
                            {p.largura_cm > 0 && ` x ${p.largura_cm}cm (L)`}
                            {p.comprimento_cm > 0 && ` x ${p.comprimento_cm}cm (C)`}
                          </div>
                        )}
                        {p.imagem_url && (
                          <p className="text-xs text-gray-400 mt-1 truncate max-w-md">
                            Imagem: {p.imagem_url}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => iniciarEdicao(p)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => alternarStatus(p.id, p.ativo)}
                          className={`${
                            p.ativo ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'
                          } text-white px-4 py-2 rounded-lg transition font-medium`}
                        >
                          {p.ativo ? '✕ Inativar' : '✓ Ativar'}
                        </button>
                        <button
                          onClick={() => deletarProduto(p.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                        >
                          Deletar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
