-- Adicionar token de acesso único para cada pedido
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS access_token VARCHAR(64) UNIQUE;

-- Criar índice para busca rápida por token
CREATE INDEX IF NOT EXISTS idx_pedidos_access_token ON pedidos(access_token);

-- Gerar tokens para pedidos existentes (se houver)
UPDATE pedidos 
SET access_token = encode(gen_random_bytes(32), 'hex')
WHERE access_token IS NULL;
