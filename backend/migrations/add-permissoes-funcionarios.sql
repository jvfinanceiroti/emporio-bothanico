-- Criar tabela de permissões
CREATE TABLE IF NOT EXISTS permissoes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  
  -- Permissões de Produtos
  pode_criar_produtos BOOLEAN DEFAULT false,
  pode_editar_produtos BOOLEAN DEFAULT false,
  pode_deletar_produtos BOOLEAN DEFAULT false,
  pode_gerenciar_estoque BOOLEAN DEFAULT false,
  pode_upload_imagens BOOLEAN DEFAULT false,
  
  -- Permissões de Pedidos
  pode_visualizar_pedidos BOOLEAN DEFAULT true,
  pode_alterar_status_pedidos BOOLEAN DEFAULT false,
  pode_cancelar_pedidos BOOLEAN DEFAULT false,
  pode_adicionar_rastreio BOOLEAN DEFAULT false,
  
  -- Permissões de Usuários/Clientes
  pode_visualizar_usuarios BOOLEAN DEFAULT false,
  pode_gerenciar_funcionarios BOOLEAN DEFAULT false,
  
  -- Permissões de Categorias
  pode_gerenciar_categorias BOOLEAN DEFAULT false,
  
  -- Dashboard
  pode_acessar_dashboard BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario ON permissoes(usuario_id);

-- Adicionar coluna role na tabela usuarios se não existir
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'funcionario';

-- Atualizar usuário admin existente
UPDATE usuarios 
SET role = 'admin' 
WHERE email = 'admin@emporio.com.br';

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_permissoes_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_permissoes_timestamp
BEFORE UPDATE ON permissoes
FOR EACH ROW
EXECUTE FUNCTION update_permissoes_timestamp();
