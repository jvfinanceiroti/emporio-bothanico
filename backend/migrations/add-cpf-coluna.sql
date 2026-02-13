-- =============================================
-- MIGRATION: Adicionar coluna cliente_cpf na tabela pedidos
-- Data: 2026-02-13
-- =============================================

-- Adicionar coluna cliente_cpf (pode ser NULL para pedidos antigos)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cliente_cpf VARCHAR(14);

-- Criar índice para melhorar performance nas buscas por CPF
CREATE INDEX IF NOT EXISTS idx_pedidos_cpf ON pedidos(cliente_cpf);

-- Feedback
SELECT 'Coluna cliente_cpf adicionada com sucesso!' as resultado;
