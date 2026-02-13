// Componente para proteger páginas admin com verificação de permissões
import { useEffect, useState } from 'react';
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
  const [mostrarModal, setMostrarModal] = useState(false);

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
      router.push('/admin/login');
      return;
    }

    // Verificar permissões
    if (modoOr) {
      // Modo OR: precisa de PELO MENOS UMA permissão
      const temAlgumaPermissao = permissoesRequeridas.some(p => temPermissao(p as any));
      if (!temAlgumaPermissao) {
        setMostrarModal(true);
      }
    } else {
      // Modo AND: precisa de TODAS as permissões
      const temTodasPermissoes = permissoesRequeridas.every(p => temPermissao(p as any));
      if (!temTodasPermissoes) {
        setMostrarModal(true);
      }
    }
  }, [carregando, permissoes, temPermissao, router, permissoesRequeridas, modoOr]);

  // Modal de acesso negado
  if (mostrarModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: 'clamp(32px, 8vw, 48px)',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          animation: 'modalSlideIn 0.3s ease-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: '40px'
          }}>
            🚫
          </div>

          <h2 style={{
            fontSize: 'clamp(22px, 5vw, 28px)',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '12px',
            lineHeight: 1.2
          }}>
            Acesso Negado
          </h2>

          <p style={{
            fontSize: 'clamp(14px, 3.5vw, 16px)',
            color: '#6b7280',
            marginBottom: '32px',
            lineHeight: 1.6
          }}>
            Você não tem permissão para acessar esta página. Entre em contato com o administrador para solicitar acesso.
          </p>

          <button
            onClick={() => router.push('/admin/dashboard')}
            style={{
              width: '100%',
              padding: 'clamp(14px, 3.5vw, 18px)',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: 'clamp(15px, 3.8vw, 17px)',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
          >
            Voltar ao Dashboard
          </button>
        </div>

        <style>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

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
