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

const CACHE_TTL_MS = 60_000;
const REQUEST_TIMEOUT_MS = 8_000;

let permissoesCache: Permissoes | null = null;
let permissoesCacheTs = 0;
let inFlightRequest: Promise<Permissoes | null> | null = null;

const getPermissoesCache = (): Permissoes | null => {
  const agora = Date.now();
  if (!permissoesCache) return null;
  if (agora - permissoesCacheTs > CACHE_TTL_MS) return null;
  return permissoesCache;
};

const setPermissoesCache = (permissoes: Permissoes | null) => {
  permissoesCache = permissoes;
  permissoesCacheTs = Date.now();
};

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
        setPermissoes(null);
        setCarregando(false);
        return;
      }

      const cacheValido = getPermissoesCache();
      if (cacheValido) {
        setPermissoes(cacheValido);
        setCarregando(false);
        return;
      }

      if (!inFlightRequest) {
        inFlightRequest = (async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

          try {
            const response = await fetch(`${API_URL}/auth/permissoes`, {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              signal: controller.signal
            });

            if (!response.ok) {
              console.warn('⚠️ Falha ao carregar permissões, status:', response.status);
              return null;
            }

            const data = await response.json();
            setPermissoesCache(data);
            return data;
          } finally {
            clearTimeout(timeoutId);
          }
        })();
      }

      const permissoesAtualizadas = await inFlightRequest;
      setPermissoes(permissoesAtualizadas);
      if (!permissoesAtualizadas) {
        setPermissoesCache(null);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      setPermissoes(null);
    } finally {
      inFlightRequest = null;
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
