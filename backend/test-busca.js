const { Pool } = require("pg");
require("dotenv").config();

async function testarBusca() {
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
    console.log("📊 Testando busca de pedidos...\n");

    // Buscar todos os pedidos
    const result = await pool.query(`
      SELECT id, cliente_nome, cliente_email, total, status, created_at
      FROM pedidos 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    if (result.rows.length === 0) {
      console.log("❌ Nenhum pedido encontrado no banco de dados");
    } else {
      console.log(`✅ Encontrados ${result.rows.length} pedidos:\n`);
      result.rows.forEach(p => {
        console.log(`ID: ${p.id} | Cliente: ${p.cliente_nome} | Email: ${p.cliente_email} | Total: R$ ${p.total}`);
      });
    }

    await pool.end();
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

testarBusca();
