-- =============================================
-- MIGRATION COMPLETA: Adicionar todas as colunas faltantes na tabela pedidos
-- Data: 2026-02-13
-- =============================================

-- 1. Adicionar coluna cliente_cpf
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cliente_cpf VARCHAR(14);

-- 2. Adicionar coluna access_token (token único para acesso sem login)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS access_token VARCHAR(100) UNIQUE;

-- 3. Adicionar coluna codigo_rastreio
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS codigo_rastreio VARCHAR(50);

-- 4. Adicionar coluna updated_at
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- 5. Adicionar colunas PIX
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS pix_codigo TEXT;

ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS pix_expira_em TIMESTAMP;

-- 6. Adicionar coluna para ID do Mercado Pago
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS mercadopago_payment_id VARCHAR(100);

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_pedidos_cpf ON pedidos(cliente_cpf);
CREATE INDEX IF NOT EXISTS idx_pedidos_access_token ON pedidos(access_token);
CREATE INDEX IF NOT EXISTS idx_pedidos_rastreio ON pedidos(codigo_rastreio);
CREATE INDEX IF NOT EXISTS idx_pedidos_pix_expira ON pedidos(pix_expira_em);
CREATE INDEX IF NOT EXISTS idx_pedidos_mp_payment ON pedidos(mercadopago_payment_id);

-- Feedback
SELECT 
  'Todas as colunas foram adicionadas com sucesso!' as resultado,
  COUNT(*) as total_pedidos
FROM pedidos;
