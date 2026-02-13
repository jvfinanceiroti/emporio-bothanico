// Hook para gerenciar permissões do usuário logado
import { useState, useEffect } from 'react';
import { API_URL } from './api';

export interface Permissoes {
  role: 'admin' | 'funcionario';
  pode_criar_produtos: boolean;
  pode_editar_produtos: boolean;
  pode_deletar_produtos: boolean;
  pode_gerenciar_estoque: boolean;
  pode_upload_imagens: boolean;
  pode_visualizar_pedidos: boolean;
  pode_alterar_status_pedidos: boolean;
  pode_cancelar_pedidos: boolean;
  pode_adicionar_rastreio: boolean;
  pode_visualizar_usuarios: boolean;
  pode_gerenciar_funcionarios: boolean;
  pode_gerenciar_categorias: boolean;
  pode_acessar_dashboard: boolean;
}

export function usePermissoes() {
  const [permissoes, setPermissoes] = useState<Permissoes | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPermissoes();
  }, []);

  const carregarPermissoes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('⚠️ usePermissoes: Sem token, pulando busca de permissões');
        setCarregando(false);
        return;
      }

      const response = await fetch(`${API_URL}/auth/permissoes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPermissoes(data);
      } else {
        console.warn('⚠️ Falha ao carregar permissões, mas não é crítico');
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
    } finally {
      setCarregando(false);
    }
  };

  const temPermissao = (permissao: keyof Permissoes): boolean => {
    if (!permissoes) return false;
    if (permissoes.role === 'admin') return true;
    return permissoes[permissao] === true;
  };

  const isAdmin = (): boolean => {
    return permissoes?.role === 'admin';
  };

  return {
    permissoes,
    carregando,
    temPermissao,
    isAdmin,
    recarregar: carregarPermissoes
  };
}
