require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'loja',
  password: 'Rollex99!',
  port: 5432,
});

async function checkTable() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'pedidos'
      ORDER BY ordinal_position
    `);
    
    console.log('Colunas da tabela pedidos:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    // Testar query do endpoint
    console.log('\nTestando query do endpoint...');
    const testResult = await pool.query(`
      SELECT
        id,
        cliente_nome,
        cliente_email,
        cliente_telefone,
        total,
        status,
        criado_em,
        endereco_cep,
        endereco_rua,
        endereco_numero,
        endereco_complemento,
        endereco_bairro,
        endereco_cidade,
        endereco_estado,
        frete,
        forma_pagamento
      FROM pedidos
      ORDER BY criado_em DESC
      LIMIT 1
    `);
    
    console.log('Query executada com sucesso!');
    console.log('Primeiro pedido:', testResult.rows[0]);
    
  } catch (error) {
    console.error('ERRO:', error.message);
    console.error('Detalhe:', error.detail);
  } finally {
    await pool.end();
  }
}

checkTable();
