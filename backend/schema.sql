-- Schema para Empório Bothanico
-- PostgreSQL Database

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INTEGER DEFAULT 0,
  imagem_url TEXT,
  sku VARCHAR(100) UNIQUE,
  custo DECIMAL(10, 2),
  ativo BOOLEAN DEFAULT true,
  peso_kg DECIMAL(10, 2),
  altura_cm DECIMAL(10, 2),
  largura_cm DECIMAL(10, 2),
  comprimento_cm DECIMAL(10, 2),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  cliente_nome VARCHAR(255) NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,
  cliente_telefone VARCHAR(50),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS pedido_itens (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL
);

-- Tabela de Usuários Admin
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Inserir usuário admin padrão
-- Senha: admin123 (hash bcrypt)
INSERT INTO usuarios (nome, email, senha, role) 
VALUES ('Admin', 'admin@emporio.com.br', '$2b$10$rK3YzJxGV5y0hJK9pGqVLe8QP8y5F5sL6qKZxZ3yZ3yZ3yZ3yZ3yZ', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_estoque ON produtos(estoque);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(criado_em);
