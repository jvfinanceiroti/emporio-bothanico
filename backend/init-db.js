const { Pool } = require("pg");
require("dotenv").config();

async function initDatabase() {
  const pool = new Pool(
    process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        }
      : {
          user: process.env.DB_USER || "postgres",
          host: process.env.DB_HOST || "localhost",
          database: process.env.DB_NAME || "loja",
          password: process.env.DB_PASSWORD || "Rollex99!",
          port: process.env.DB_PORT || 5432,
        }
  );

  try {
    console.log("🔄 Verificando estrutura do banco de dados...");

    // Criar tabela de produtos
    await pool.query(`
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
    `);

    // Criar tabela de pedidos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        cliente_nome VARCHAR(255) NOT NULL,
        cliente_email VARCHAR(255) NOT NULL,
        cliente_telefone VARCHAR(50),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pendente',
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Criar tabela de itens do pedido
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedido_itens (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
        produto_id INTEGER REFERENCES produtos(id),
        quantidade INTEGER NOT NULL,
        preco_unitario DECIMAL(10, 2) NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL
      );
    `);

    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      );
    `);

    // Adicionar coluna role se não existir
    try {
      await pool.query(`
        ALTER TABLE usuarios 
        ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'admin';
      `);
    } catch (err) {
      console.log("⚠️  Coluna role já existe ou não pôde ser adicionada");
    }

    // Inserir usuário admin padrão (senha: admin123)
    try {
      await pool.query(`
        INSERT INTO usuarios (nome, email, senha, role) 
        VALUES ('Admin', 'admin@emporio.com.br', '$2b$10$rK3YzJxGV5y0hJK9pGqVLe8QP8y5F5sL6qKZxZ3yZ3yZ3yZ3yZ3yZ', 'admin')
        ON CONFLICT (email) DO NOTHING;
      `);
    } catch (err) {
      // Tentar sem role se der erro
      try {
        await pool.query(`
          INSERT INTO usuarios (nome, email, senha) 
          VALUES ('Admin', 'admin@emporio.com.br', '$2b$10$rK3YzJxGV5y0hJK9pGqVLe8QP8y5F5sL6qKZxZ3yZ3yZ3yZ3yZ3yZ')
          ON CONFLICT (email) DO NOTHING;
        `);
      } catch (err2) {
        console.log("⚠️  Usuário admin já existe ou erro ao criar");
      }
    }

    // Criar tabela categorias (para filtro de produtos)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS categorias (
          id SERIAL PRIMARY KEY,
          nome VARCHAR(100) NOT NULL UNIQUE,
          slug VARCHAR(100) NOT NULL UNIQUE,
          descricao TEXT,
          ativo BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      await pool.query(`
        ALTER TABLE produtos ADD COLUMN IF NOT EXISTS categoria_id INTEGER REFERENCES categorias(id);
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id);
      `);
      await pool.query(`
        INSERT INTO categorias (nome, slug, descricao) VALUES
          ('Perfume', 'perfume', 'Perfumes e fragrâncias'),
          ('Aromas', 'aromas', 'Aromatizadores e difusores'),
          ('Banho', 'banho', 'Produtos para banho')
        ON CONFLICT (slug) DO NOTHING;
      `);
    } catch (err) {
      console.log("⚠️ Categorias: já existem ou erro:", err.message);
    }

    // Criar índices (se as colunas existirem)
    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
      `);
    } catch (err) {
      console.log("⚠️  Índice idx_produtos_ativo não criado");
    }

    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_produtos_estoque ON produtos(estoque);
      `);
    } catch (err) {
      console.log("⚠️  Índice idx_produtos_estoque não criado");
    }

    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
      `);
    } catch (err) {
      console.log("⚠️  Índice idx_pedidos_status não criado");
    }

    try {
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(created_at);
      `);
    } catch (err) {
      console.log("⚠️  Índice idx_pedidos_data não criado");
    }

    // Criar tabela de visitas da promoção (QR code)
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS visitas_promo (
          id SERIAL PRIMARY KEY,
          tipo VARCHAR(20) DEFAULT 'acesso',
          ip VARCHAR(100),
          user_agent TEXT,
          referrer TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_visitas_promo_data ON visitas_promo(created_at);
      `);
      await pool.query(`
        ALTER TABLE visitas_promo ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'acesso';
      `);
    } catch (err) {
      console.log("⚠️ visitas_promo: já existe ou erro:", err.message);
    }

    console.log("✅ Banco de dados verificado e pronto!");
    await pool.end();
  } catch (error) {
    console.error("❌ Erro ao inicializar banco:", error);
    process.exit(1);
  }
}

initDatabase();
