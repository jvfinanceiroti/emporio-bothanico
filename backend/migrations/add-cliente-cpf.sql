-- Adicionar coluna cliente_cpf na tabela pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cliente_cpf VARCHAR(14);

-- Criar índice para busca por CPF
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_cpf ON pedidos(cliente_cpf);
