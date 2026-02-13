const { Pool } = require("pg");
require("dotenv").config();

async function resetarSenha() {
  const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "loja",
    password: process.env.DB_PASSWORD || "Rollex99!",
    port: process.env.DB_PORT || 5432,
  });

  try {
    const novaSenha = "$2b$10$Dm1ws/unTRcC7H47QzLf8OZQxCqMzXLSufLk7/IejjL7E17q/QuD.";
    await pool.query("UPDATE usuarios SET senha = $1 WHERE email = $2", [novaSenha, "admin@emporio.com.br"]);
    console.log("✅ Senha resetada com sucesso! Use: admin123");
    await pool.end();
  } catch (error) {
    console.error("Erro:", error.message);
    process.exit(1);
  }
}

resetarSenha();
