-- =============================================
-- MIGRATION: Adicionar informações do cartão (SEGURO)
-- Data: 2026-02-13
-- ⚠️ AVISO: Salvando apenas dados não sensíveis
-- =============================================

-- Adicionar últimos 4 dígitos do cartão (para referência)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_ultimos_digitos VARCHAR(4);

-- Adicionar nome no cartão (não é dado sensível)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_nome_titular VARCHAR(100);

-- Adicionar bandeira do cartão (Visa, Master, etc)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_bandeira VARCHAR(20);

-- ❌ NÃO CRIAMOS COLUNAS PARA:
-- - cartao_numero_completo (CRIME - nunca faça isso!)
-- - cartao_cvv (CRIME - nunca faça isso!)
-- - cartao_validade (pode ser usado para fraude)

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_pedidos_cartao_ultimos ON pedidos(cartao_ultimos_digitos);

-- Feedback
SELECT 
  'Colunas de cartão (seguras) foram adicionadas!' as resultado,
  '⚠️ Lembre-se: NUNCA salve número completo ou CVV' as aviso;
