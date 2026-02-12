const pool = require('./db');

async function testCreate() {
  try {
    console.log('Testando criação de produto...\n');
    
    const result = await pool.query(
      `INSERT INTO produtos 
       (nome, descricao, preco, custo, sku, peso_kg, altura_cm, largura_cm, comprimento_cm, estoque, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        'Produto Teste ' + Date.now(),
        null,
        10.50,
        null,
        null,
        null,
        null,
        null,
        null,
        10,
        null
      ]
    );
    
    console.log('✓ Produto criado com sucesso!');
    console.log('Dados do produto:', result.rows[0]);
    
  } catch (error) {
    console.error('✗ Erro ao criar produto:');
    console.error('Mensagem:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await pool.end();
  }
}

testCreate();
