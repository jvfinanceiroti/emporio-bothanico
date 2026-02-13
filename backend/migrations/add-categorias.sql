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

-- Inserir categorias padrão para perfumaria
INSERT INTO categorias (nome, slug, descricao) VALUES
  ('Perfumes Masculinos', 'perfumes-masculinos', 'Fragrâncias exclusivas para homens'),
  ('Perfumes Femininos', 'perfumes-femininos', 'Fragrâncias sofisticadas para mulheres'),
  ('Perfumes Unissex', 'perfumes-unissex', 'Fragrâncias para todos os estilos'),
  ('Colônias', 'colonias', 'Colônias refrescantes e leves'),
  ('Body Splash', 'body-splash', 'Perfumes corporais suaves'),
  ('Kits e Presentes', 'kits-presentes', 'Conjuntos especiais para presentear')
ON CONFLICT (slug) DO NOTHING;
