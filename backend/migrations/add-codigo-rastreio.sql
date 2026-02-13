-- Adicionar coluna codigo_rastreio e updated_at na tabela pedidos

-- Adicionar codigo_rastreio (pode ser NULL)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS codigo_rastreio VARCHAR(100);

-- Adicionar updated_at com valor padrão NOW()
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Criar índice para busca por código de rastreio
CREATE INDEX IF NOT EXISTS idx_pedidos_codigo_rastreio ON pedidos(codigo_rastreio);

-- Atualizar updated_at existentes como created_at
UPDATE pedidos 
SET updated_at = created_at 
WHERE updated_at IS NULL;
