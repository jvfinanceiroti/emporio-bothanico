-- =============================================
-- MIGRATION: Adicionar coluna access_token na tabela pedidos
-- Data: 2026-02-13
-- =============================================

-- Adicionar coluna access_token (token único para acesso ao pedido sem login)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS access_token VARCHAR(100) UNIQUE;

-- Criar índice para melhorar performance nas buscas por token
CREATE INDEX IF NOT EXISTS idx_pedidos_access_token ON pedidos(access_token);

-- Feedback
SELECT 'Coluna access_token adicionada com sucesso!' as resultado;
