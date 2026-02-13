-- SQL para corrigir estrutura da tabela pedidos
-- Execute isso no Supabase SQL Editor

-- Adicionar coluna codigo_rastreio se não existir
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS codigo_rastreio VARCHAR(100);

-- Adicionar coluna cliente_cpf se não existir
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS cliente_cpf VARCHAR(14);

-- Verificar estrutura da tabela
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'pedidos'
ORDER BY ordinal_position;

-- Listar todos os pedidos para debug
SELECT 
  id, 
  cliente_nome, 
  cliente_email, 
  cliente_cpf,
  total, 
  status, 
  codigo_rastreio,
  created_at
FROM pedidos
ORDER BY created_at DESC
LIMIT 10;
