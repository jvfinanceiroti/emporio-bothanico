-- ==========================================
-- ATUALIZAR CATÁLOGO DE PRODUTOS NO SUPABASE
-- Empório Bothânico - Execute no SQL Editor
-- ==========================================
-- INSTRUÇÕES:
-- 1. Acesse Supabase > SQL Editor > New Query
-- 2. Cole todo este script
-- 3. Clique em RUN
-- ==========================================

-- PASSO 1: Garantir que categorias existem
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categorias (nome, slug, descricao) VALUES
  ('Perfume', 'perfume', 'Perfumes e fragrâncias exclusivas'),
  ('Aromas', 'aromas', 'Aromatizadores e difusores'),
  ('Banho', 'banho', 'Produtos para banho e cuidados pessoais')
ON CONFLICT (slug) DO NOTHING;

-- PASSO 2: Garantir coluna categoria_id em produtos
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);

-- PASSO 3: Desativar produtos antigos de demonstração (mantém pedidos intactos)
-- Em vez de deletar, marcamos como inativo para não quebrar histórico de pedidos
UPDATE produtos SET ativo = false 
WHERE nome IN (
  'Essência Cereja e Avelã 10ml',
  'Refil Sabonete Líquido 500ml',
  'Difusor de Ambiente 250ml',
  'Sabonete Artesanal Lavanda 100g',
  'Vela Aromática Baunilha 180g',
  'Home Spray Eucalipto 250ml'
);

-- PASSO 4: Inserir o catálogo de produtos com categorias (usa slug para buscar ID correto)
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, peso_kg, altura_cm, largura_cm, comprimento_cm, imagem_url, categoria_id)
VALUES
  ('Essência Cereja e Avelã 10ml', 'Essência aromática premium de cereja com avelã caramelizada. Perfeita para aromatizar ambientes e produtos artesanais. Fragrância duradoura e sofisticada.', 199.90, 50, true, 0.3, 8, 3, 3, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80', (SELECT id FROM categorias WHERE slug = 'perfume' LIMIT 1)),
  ('Refil Sabonete Líquido 500ml', 'Refil econômico de sabonete líquido aromático com fragrâncias naturais. Hidratante e suave para as mãos. Embalagem sustentável.', 45.00, 100, true, 0.55, 18, 8, 5, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80', (SELECT id FROM categorias WHERE slug = 'banho' LIMIT 1)),
  ('Difusor de Ambiente 250ml', 'Difusor premium com varetas de rattan. Fragrância de longa duração (até 60 dias). Ideal para sala e quarto. Design elegante.', 89.90, 30, true, 0.4, 22, 8, 8, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1)),
  ('Sabonete Artesanal Lavanda 100g', 'Sabonete vegetal artesanal com óleo essencial de lavanda. Relaxante e hidratante. Sem parabenos. Feito à mão.', 24.90, 75, true, 0.12, 3, 7, 7, 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&q=80', (SELECT id FROM categorias WHERE slug = 'banho' LIMIT 1)),
  ('Vela Aromática Baunilha 180g', 'Vela de soja 100% natural com fragrância de baunilha Madagascar. Queima limpa por até 40 horas. Pavio de algodão.', 54.90, 40, true, 0.25, 9, 7, 7, 'https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=400&q=80', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1)),
  ('Home Spray Eucalipto 250ml', 'Aromatizador de ambiente instantâneo. Fragrância refrescante de eucalipto. Neutraliza odores. Sem álcool.', 39.90, 60, true, 0.28, 16, 5, 5, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1));

-- PASSO 5: Verificar resultado
SELECT COUNT(*) as produtos_ativos FROM produtos WHERE ativo = true;
SELECT id, nome, preco, categoria_id FROM produtos WHERE ativo = true ORDER BY id DESC;

-- ==========================================
-- ATENÇÃO: Execute este script UMA VEZ no Supabase.
-- Se rodar várias vezes, serão criados produtos duplicados.
-- Para resetar tudo (apaga produtos e itens de pedido):
--   DELETE FROM pedido_itens;
--   DELETE FROM produtos;
--   Depois execute este script novamente.
-- ==========================================
