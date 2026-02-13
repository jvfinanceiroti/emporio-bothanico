// Componente para proteger páginas admin com verificação de permissões
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissoes } from './usePermissoes';

interface ProtegerRotaProps {
  permissoesRequeridas: string[];
  children: React.ReactNode;
  modoOr?: boolean; // Se true, precisa de PELO MENOS UMA permissão. Se false, precisa de TODAS
}

export function ProtegerRota({ permissoesRequeridas, children, modoOr = false }: ProtegerRotaProps) {
  const router = useRouter();
  const { permissoes, temPermissao, carregando } = usePermissoes();

  useEffect(() => {
    // Verificar token primeiro
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Aguardar carregar permissões
    if (carregando) return;

    // Se não tem permissões (não é admin nem funcionário), redirecionar
    if (!permissoes) {
      alert('Você não tem permissão para acessar esta página');
      router.push('/admin/login');
      return;
    }

    // Verificar permissões
    if (modoOr) {
      // Modo OR: precisa de PELO MENOS UMA permissão
      const temAlgumaPermissao = permissoesRequeridas.some(p => temPermissao(p as any));
      if (!temAlgumaPermissao) {
        alert('Você não tem permissão para acessar esta página');
        router.push('/admin/dashboard');
      }
    } else {
      // Modo AND: precisa de TODAS as permissões
      const temTodasPermissoes = permissoesRequeridas.every(p => temPermissao(p as any));
      if (!temTodasPermissoes) {
        alert('Você não tem permissão para acessar esta página');
        router.push('/admin/dashboard');
      }
    }
  }, [carregando, permissoes, temPermissao, router, permissoesRequeridas, modoOr]);

  // Mostrar loading enquanto verifica
  if (carregando || !permissoes) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #0a0a0a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Verificando permissões...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook simplificado para ocultar botões
export function usePodeExecutar(permissao: string): boolean {
  const { temPermissao } = usePermissoes();
  return temPermissao(permissao as any);
}
