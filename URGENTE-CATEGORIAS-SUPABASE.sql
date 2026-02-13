-- ===== EXECUTE ESTE SQL NO SUPABASE URGENTE =====
-- SQL Editor: https://supabase.com/dashboard/project/cztqxdogiabesdgpyogv/sql

-- 1. Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Inserir categorias padrão
INSERT INTO categorias (nome, slug, descricao) VALUES
  ('Perfume', 'perfume', 'Perfumes e fragrâncias'),
  ('Aromas', 'aromas', 'Aromas e difusores'),
  ('Banho', 'banho', 'Produtos para banho')
ON CONFLICT (nome) DO NOTHING;

-- 3. Adicionar coluna categoria_id na tabela produtos (se não existir)
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id);

-- 4. Criar índice
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);

-- 5. Verificar
SELECT 'Categorias criadas com sucesso!' as status;
SELECT * FROM categorias;
