-- Adicionar coluna codigo_rastreio na tabela pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS codigo_rastreio VARCHAR(100);

-- Adicionar coluna updated_at caso não exista
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();
