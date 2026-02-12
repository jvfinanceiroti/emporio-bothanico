const pool = require('./db');

async function checkTable() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'produtos'
      ORDER BY ordinal_position
    `);
    
    console.log('\nEstrutura da tabela produtos:');
    console.log('=============================');
    result.rows.forEach(row => {
      console.log(`${row.column_name.padEnd(20)} | ${row.data_type.padEnd(30)} | Nullable: ${row.is_nullable} | Default: ${row.column_default || 'NULL'}`);
    });
    
    await pool.end();
  } catch (error) {
    console.error('Erro:', error);
    await pool.end();
  }
}

checkTable();
