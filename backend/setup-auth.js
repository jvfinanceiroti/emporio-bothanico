const pool = require('./db');
const bcrypt = require('bcrypt');

async function setupAuth() {
  try {
    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        tipo VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✓ Tabela usuarios criada');

    // Criar usuário admin padrão
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    await pool.query(`
      INSERT INTO usuarios (email, senha, nome, tipo)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['admin@emporio.com', senhaHash, 'Administrador', 'admin']);
    
    console.log('✓ Usuário admin criado');
    console.log('\nCredenciais de acesso:');
    console.log('Email: admin@emporio.com');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
  }
}

setupAuth();
