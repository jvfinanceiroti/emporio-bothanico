const { Pool } = require("pg");
require("dotenv").config();

// Usar DATABASE_URL do Render ou configuração local
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        user: process.env.DB_USER || "postgres",
        host: process.env.DB_HOST || "localhost",
        database: process.env.DB_NAME || "loja",
        password: process.env.DB_PASSWORD || "Rollex99!",
        port: process.env.DB_PORT || 5432,
      }
);

module.exports = pool;
