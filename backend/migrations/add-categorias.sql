-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Adicionar coluna categoria_id na tabela produtos
ALTER TABLE produtos 
ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id);

-- Criar índice para busca por categoria
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);

-- Inserir categorias padrão
INSERT INTO categorias (nome, slug, descricao) VALUES
  ('Perfume', 'perfume', 'Perfumes e fragrâncias exclusivas'),
  ('Aromas', 'aromas', 'Aromatizadores e difusores'),
  ('Banho', 'banho', 'Produtos para banho e cuidados pessoais')
ON CONFLICT (slug) DO NOTHING;
