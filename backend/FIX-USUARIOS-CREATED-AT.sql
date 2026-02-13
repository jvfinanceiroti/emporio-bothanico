-- SQL para adicionar coluna created_at na tabela usuarios
-- Execute isso no Supabase SQL Editor

-- Adicionar coluna created_at se não existir
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Atualizar registros existentes que não têm created_at
UPDATE usuarios SET created_at = NOW() WHERE created_at IS NULL;

-- Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
