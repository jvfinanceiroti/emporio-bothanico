const { Pool } = require("pg");
require("dotenv").config();

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 15_000,
      keepAlive: true,
    }
  : {
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "loja",
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 15_000,
      keepAlive: true,
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Erro inesperado no pool PostgreSQL:", err.message);
});

let warmupPromise = null;

async function warmupPool() {
  if (!warmupPromise) {
    warmupPromise = pool
      .query("SELECT 1")
      .then(() => true)
      .catch((err) => {
        warmupPromise = null;
        console.warn("warmupPool falhou:", err.message);
        return false;
      });
  }
  return warmupPromise;
}

module.exports = pool;
module.exports.warmupPool = warmupPool;
