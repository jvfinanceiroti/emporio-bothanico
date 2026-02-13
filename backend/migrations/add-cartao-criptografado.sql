-- =============================================
-- ⚠️  AVISO LEGAL - LEIA ANTES DE EXECUTAR
-- =============================================
-- Esta migration adiciona coluna para armazenar número
-- completo de cartão CRIPTOGRAFADO.
--
-- ⚠️  RESPONSABILIDADE:
-- - Você assume TOTAL responsabilidade legal
-- - Deve ter certificação PCI-DSS para uso comercial
-- - Violar LGPD pode resultar em multas de até R$ 50 milhões
-- - Use APENAS para dados próprios em ambiente de teste
--
-- 🔐 SEGURANÇA:
-- - Dados serão criptografados com AES-256-GCM
-- - Chave DEVE estar em variável de ambiente
-- - Nunca commite a chave no código
-- =============================================

-- Adicionar coluna para número do cartão CRIPTOGRAFADO
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS cartao_numero_criptografado TEXT;

-- Comentário da coluna (para lembrar que é criptografado)
COMMENT ON COLUMN pedidos.cartao_numero_criptografado IS 
  '⚠️ DADO SENSÍVEL - Número do cartão criptografado com AES-256-GCM. USO SOB RESPONSABILIDADE DO PROPRIETÁRIO.';

-- Índice para busca rápida (mesmo criptografado, pode precisar buscar)
CREATE INDEX IF NOT EXISTS idx_pedidos_cartao_cripto 
  ON pedidos(cartao_numero_criptografado) 
  WHERE cartao_numero_criptografado IS NOT NULL;

-- Log de execução
DO $$
BEGIN
  RAISE NOTICE '⚠️  MIGRATION EXECUTADA: cartao_numero_criptografado';
  RAISE NOTICE '🔐 Coluna criada para dados CRIPTOGRAFADOS';
  RAISE NOTICE '⚠️  LEMBRE-SE:';
  RAISE NOTICE '   1. Configurar ENCRYPTION_KEY no backend';
  RAISE NOTICE '   2. Nunca commitar a chave no código';
  RAISE NOTICE '   3. Você assume responsabilidade legal total';
END $$;

SELECT 
  '✅ Coluna cartao_numero_criptografado adicionada!' as status,
  '⚠️  Configure ENCRYPTION_KEY no Render!' as aviso_importante;
