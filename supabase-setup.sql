-- ==========================================
-- SCRIPT SQL COMPLETO PARA SUPABASE
-- Empório Bothânico - Banco de Dados
-- ==========================================

-- 1. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10,2) NOT NULL,
  estoque INTEGER DEFAULT 0,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  peso_kg NUMERIC(5,2) DEFAULT 0.5,
  altura_cm NUMERIC(5,2) DEFAULT 10,
  largura_cm NUMERIC(5,2) DEFAULT 10,
  comprimento_cm NUMERIC(5,2) DEFAULT 15,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  nome TEXT,
  role TEXT DEFAULT 'cliente',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- 3. TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER,
  status TEXT DEFAULT 'aguardando_pagamento',
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  cliente_nome TEXT,
  cliente_email TEXT,
  cliente_telefone TEXT,
  endereco_cep VARCHAR(10),
  endereco_rua TEXT,
  endereco_numero VARCHAR(10),
  endereco_complemento TEXT,
  endereco_bairro VARCHAR(100),
  endereco_cidade VARCHAR(100),
  endereco_estado VARCHAR(2),
  frete NUMERIC(10,2) DEFAULT 0,
  forma_pagamento VARCHAR(20)
);

-- 4. TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_unitario NUMERIC(10,2) NOT NULL
);

-- 5. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_created_at ON produtos(created_at);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido_id ON pedido_itens(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pedido_itens_produto_id ON pedido_itens(produto_id);

-- 6. INSERIR USUÁRIO ADMIN
-- Email: admin@emporio.com.br
-- Senha: admin123
INSERT INTO usuarios (email, senha, nome, role)
VALUES ('admin@emporio.com.br', '$2b$10$Q8pr/GWXx0ytcrThCR2gXuZhZiVgm/.AV/mZH9m0rLo7cbOlObZUm', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 7. PRODUTOS DE EXEMPLO (OPCIONAL - comente se não quiser)
INSERT INTO produtos (nome, descricao, preco, estoque, ativo, peso_kg, altura_cm, largura_cm, comprimento_cm, imagem_url) VALUES
('Essência Cereja e Avelã 10ml', 'Essência aromática premium de cereja com avelã caramelizada. Perfeita para aromatizar ambientes e produtos artesanais. Fragrância duradoura e sofisticada.', 199.90, 50, true, 0.3, 8, 3, 3, '/placeholder-produto.jpg'),
('Refil Sabonete Líquido 500ml', 'Refil econômico de sabonete líquido aromático com fragrâncias naturais. Hidratante e suave para as mãos. Embalagem sustentável.', 45.00, 100, true, 0.55, 18, 8, 5, '/placeholder-produto.jpg'),
('Difusor de Ambiente 250ml', 'Difusor premium com varetas de rattan. Fragrância de longa duração (até 60 dias). Ideal para sala e quarto. Design elegante.', 89.90, 30, true, 0.4, 22, 8, 8, '/placeholder-produto.jpg'),
('Sabonete Artesanal Lavanda 100g', 'Sabonete vegetal artesanal com óleo essencial de lavanda. Relaxante e hidratante. Sem parabenos. Feito à mão.', 24.90, 75, true, 0.12, 3, 7, 7, '/placeholder-produto.jpg'),
('Vela Aromática Baunilha 180g', 'Vela de soja 100% natural com fragrância de baunilha Madagascar. Queima limpa por até 40 horas. Pavio de algodão.', 54.90, 40, true, 0.25, 9, 7, 7, '/placeholder-produto.jpg'),
('Home Spray Eucalipto 250ml', 'Aromatizador de ambiente instantâneo. Fragrância refrescante de eucalipto. Neutraliza odores. Sem álcool.', 39.90, 60, true, 0.28, 16, 5, 5, '/placeholder-produto.jpg')
ON CONFLICT DO NOTHING;

-- ==========================================
-- SCRIPT FINALIZADO
-- ==========================================
-- 
-- INSTRUÇÕES:
-- 1. Copie todo este código
-- 2. No Supabase, vá em: SQL Editor (no menu lateral)
-- 3. Clique em "New Query"
-- 4. Cole este código completo
-- 5. Clique em "RUN" (botão verde no canto inferior direito)
-- 6. Aguarde a execução (alguns segundos)
-- 7. Verifique se apareceu "Success" sem erros
--
-- CREDENCIAIS DO ADMIN:
-- Email: admin@emporio.com.br
-- Senha: admin123
--
-- PRÓXIMO PASSO:
-- Após executar este script, copie a "Connection String" do Supabase
-- e configure no arquivo .env do backend
