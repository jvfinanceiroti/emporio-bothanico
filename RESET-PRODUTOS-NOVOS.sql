-- ==========================================
-- RESETAR E INSERIR NOVOS PRODUTOS
-- Empório Bothânico - Execute no Supabase SQL Editor
-- ==========================================
-- Este script EXCLUI todos os produtos e insere um catálogo novo com imagens atualizadas.
-- Se você tem pedidos, os itens dos pedidos perderão a referência ao produto (mas o histórico de valor permanece).
-- ==========================================

-- PASSO 1: Garantir categorias
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

-- PASSO 3: Permitir que produto_id seja nulo (se necessário) e desvincular
DO $$ BEGIN
  ALTER TABLE pedido_itens ALTER COLUMN produto_id DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
UPDATE pedido_itens SET produto_id = NULL;

-- PASSO 4: EXCLUIR TODOS OS PRODUTOS
DELETE FROM produtos;

-- PASSO 5: Resetar sequência do ID
ALTER SEQUENCE IF EXISTS produtos_id_seq RESTART WITH 1;

-- PASSO 6: INSERIR NOVOS PRODUTOS COM IMAGENS NOVAS
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, peso_kg, altura_cm, largura_cm, comprimento_cm, imagem_url, categoria_id)
VALUES
  -- PERFUMES
  ('Perfume Essência Flor de Lótus 15ml', 'Essência exclusiva flor de lótus com notas orientais. Feminino, sofisticado e de longa duração. Ideal para ocasiões especiais.', 149.90, 45, true, 0.25, 9, 4, 4, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'perfume' LIMIT 1)),
  ('Perfume Masculino Madeira Nobre 50ml', 'Fragrância amadeirada com notas de cedro e âmbar. Elegante e marcante. Perfeito para o dia a dia.', 189.90, 30, true, 0.45, 12, 5, 5, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'perfume' LIMIT 1)),
  ('Eau de Toilette Lavanda Francesa 30ml', 'Lavanda provençal autêntica. Frescor e delicadeza em uma fragrância unissex. Duração média de 6 horas.', 119.90, 55, true, 0.35, 10, 4, 4, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'perfume' LIMIT 1)),
  
  -- AROMAS
  ('Difusor Rattan Jasmim Branco 200ml', 'Difusor de varetas com jasmim branco. Aroma floral suave que perfuma até 90 dias. Design minimalista.', 79.90, 40, true, 0.38, 24, 7, 7, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1)),
  ('Vela Aromática Cedro e Bergamota 200g', 'Vela de soja artesanal. Combinação de cedro aromático com bergamota cítrica. Queima limpa por 50 horas.', 64.90, 35, true, 0.28, 10, 8, 8, 'https://images.unsplash.com/photo-1602874801006-4e41187f7f36?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1)),
  ('Spray Aromatizante Floral Bouquet 250ml', 'Aromatizador instantâneo com bouquet floral. Notas de rosa, peônia e gardênia. Sem álcool.', 44.90, 70, true, 0.30, 18, 6, 6, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1)),
  ('Difusor Elétrico USB Branco', 'Difusor ultrassônico com LED. Ideal para escritório e quarto. Timer de 4h. Inclui essência lavanda 10ml.', 129.90, 25, true, 0.22, 8, 8, 8, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'aromas' LIMIT 1)),
  
  -- BANHO
  ('Sabonete Artesanal Rosa Mosqueta 120g', 'Sabonete vegetal com óleo de rosa mosqueta. Regenerador e hidratante. Sem parabenos. Embalagem ecológica.', 29.90, 60, true, 0.14, 3, 8, 8, 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'banho' LIMIT 1)),
  ('Sabonete Líquido Alecrim e Menta 300ml', 'Sabonete líquido revigorante. Combinação de alecrim e menta. Espuma cremosa. Para corpo e mãos.', 39.90, 80, true, 0.35, 18, 6, 6, 'https://images.unsplash.com/photo-1556228720-195a672e0a03?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'banho' LIMIT 1)),
  ('Condicionador Sólido Amora e Mel 90g', 'Condicionador sólido zero desperdício. Amora e mel para fios sedosos. Equivalente a 3 frascos de 200ml.', 54.90, 40, true, 0.10, 3, 6, 6, 'https://images.unsplash.com/photo-1556228720-195a672e0a03?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'banho' LIMIT 1)),
  ('Kit Banho Relaxante Lavanda', 'Kit com sabonete 100g, sais de banho 200g e óleo corporal 50ml. Aroma lavanda. Presente perfeito.', 89.90, 20, true, 0.42, 12, 12, 15, 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&q=90', (SELECT id FROM categorias WHERE slug = 'banho' LIMIT 1))
;

-- PASSO 8: Verificar resultado
SELECT COUNT(*) as total_produtos_ativos FROM produtos WHERE ativo = true;
SELECT id, nome, preco, estoque, imagem_url FROM produtos WHERE ativo = true ORDER BY categoria_id, id;

-- ==========================================
-- PRONTO! Os novos produtos devem aparecer na home e na página de produtos.
-- Se não aparecerem: verifique se o backend está conectado ao Supabase correto
-- e se NEXT_PUBLIC_API_URL aponta para o backend certo.
-- ==========================================
