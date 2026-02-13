const pool = require('./db');

async function testarBusca() {
  try {
    console.log('🔍 Testando busca por email: kleb@gmail.com');
    
    const result = await pool.query(`
      SELECT 
        id, cliente_nome, cliente_email, cliente_telefone,
        total, status, created_at, forma_pagamento
      FROM pedidos 
      WHERE LOWER(cliente_email) = LOWER($1)
      ORDER BY created_at DESC
    `, ['kleb@gmail.com']);
    
    console.log(`✅ Encontrados ${result.rows.length} pedidos:`);
    console.log(JSON.stringify(result.rows, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao buscar:', error.message);
  } finally {
    process.exit();
  }
}

testarBusca();
