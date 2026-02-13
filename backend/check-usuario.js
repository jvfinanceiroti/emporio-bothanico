const { Pool } = require("pg");
require("dotenv").config();

async function verificarUsuario() {
  const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "loja",
    password: process.env.DB_PASSWORD || "Rollex99!",
    port: process.env.DB_PORT || 5432,
  });

  try {
    const result = await pool.query("SELECT * FROM usuarios");
    console.log("Usuários cadastrados:", result.rows);
    await pool.end();
  } catch (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }
}

verificarUsuario();
