const { Pool } = require("pg");
require("dotenv").config();

async function addEnderecoCampos() {
  const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "loja",
    password: "Rollex99!",
    port: 5432,
  });

  try {
    console.log("Adicionando campos de endereço na tabela pedidos...");

    await pool.query(`
      ALTER TABLE pedidos
      ADD COLUMN IF NOT EXISTS endereco_cep VARCHAR(9),
      ADD COLUMN IF NOT EXISTS endereco_rua TEXT,
      ADD COLUMN IF NOT EXISTS endereco_numero VARCHAR(20),
      ADD COLUMN IF NOT EXISTS endereco_complemento TEXT,
      ADD COLUMN IF NOT EXISTS endereco_bairro VARCHAR(255),
      ADD COLUMN IF NOT EXISTS endereco_cidade VARCHAR(255),
      ADD COLUMN IF NOT EXISTS endereco_estado VARCHAR(2),
      ADD COLUMN IF NOT EXISTS frete DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS forma_pagamento VARCHAR(50);
    `);

    console.log("✅ Campos adicionados com sucesso!");
    await pool.end();
  } catch (error) {
    console.error("❌ Erro ao adicionar campos:", error);
    process.exit(1);
  }
}

addEnderecoCampos();
