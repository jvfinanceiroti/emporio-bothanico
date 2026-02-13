require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function adicionarColunas() {
  try {
    console.log('Adicionando colunas na tabela pedidos...');
    
    await pool.query('ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS codigo_rastreio VARCHAR(100)');
    console.log('✓ Coluna codigo_rastreio adicionada');
    
    await pool.query('ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()');
    console.log('✓ Coluna updated_at adicionada');
    
    console.log('\n✓ Todas as colunas foram adicionadas com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

adicionarColunas();
