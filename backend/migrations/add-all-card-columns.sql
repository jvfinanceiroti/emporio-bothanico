-- =============================================
-- MIGRATION COMPLETA: Adicionar TODAS as colunas de cartão
-- Data: 2026-02-13
-- ⚠️ AVISO: Inclui dados sensíveis CRIPTOGRAFADOS
-- =============================================

-- 1️⃣ Últimos 4 dígitos (não sensível, pode ser visível)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_ultimos_digitos VARCHAR(4);

-- 2️⃣ Nome no cartão (não sensível)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_nome_titular VARCHAR(100);

-- 3️⃣ Bandeira do cartão (Visa, Mastercard, Elo, etc)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_bandeira VARCHAR(20);

-- 4️⃣ Número completo CRIPTOGRAFADO
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_numero_criptografado TEXT;

-- 5️⃣ Validade CRIPTOGRAFADA (MM/AA)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_validade_criptografada TEXT;

-- 6️⃣ CVV CRIPTOGRAFADO (3 dígitos)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_cvv_criptografado TEXT;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_pedidos_cartao_ultimos 
  ON pedidos(cartao_ultimos_digitos);

CREATE INDEX IF NOT EXISTS idx_pedidos_cartao_bandeira 
  ON pedidos(cartao_bandeira);

-- Comentários de segurança nas colunas
COMMENT ON COLUMN pedidos.cartao_numero_criptografado IS 
  '⚠️ CRIPTOGRAFADO - Número completo do cartão com AES-256-GCM';

COMMENT ON COLUMN pedidos.cartao_validade_criptografada IS 
  '⚠️ CRIPTOGRAFADO - Validade (MM/AA) com AES-256-GCM';

COMMENT ON COLUMN pedidos.cartao_cvv_criptografado IS 
  '⚠️ CRIPTOGRAFADO - CVV (3 dígitos) com AES-256-GCM';

-- Feedback de sucesso
DO $$
BEGIN
  RAISE NOTICE '✅ MIGRATION EXECUTADA COM SUCESSO!';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Colunas criadas:';
  RAISE NOTICE '   ✓ cartao_ultimos_digitos (VARCHAR)';
  RAISE NOTICE '   ✓ cartao_nome_titular (VARCHAR)';
  RAISE NOTICE '   ✓ cartao_bandeira (VARCHAR)';
  RAISE NOTICE '   ✓ cartao_numero_criptografado (TEXT)';
  RAISE NOTICE '   ✓ cartao_validade_criptografada (TEXT)';
  RAISE NOTICE '   ✓ cartao_cvv_criptografado (TEXT)';
  RAISE NOTICE '';
  RAISE NOTICE '🔐 LEMBRE-SE:';
  RAISE NOTICE '   • Configure ENCRYPTION_KEY no Render';
  RAISE NOTICE '   • Validade e CVV serão criptografados';
  RAISE NOTICE '   • Você assume responsabilidade legal total';
END $$;

-- Query de teste
SELECT 
  '✅ Tabela pedidos atualizada!' as status,
  COUNT(*) as total_pedidos
FROM pedidos;
