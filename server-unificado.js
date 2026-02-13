// Servidor Unificado - Frontend + Backend
const express = require("express");
const cors = require("cors");
const next = require("next");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

// Configurar Next.js
const nextApp = next({ dev, dir: "./frontend" });
const handle = nextApp.getRequestHandler();

const app = express();

// Banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// Middleware de autenticação
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Token não fornecido");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).send("Token inválido");
  }
}

// ==========================================
// ROTAS DA API (prefixo /api)
// ==========================================

// Produtos
app.get("/api/produtos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM produtos WHERE ativo = true AND estoque > 0 ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

app.get("/api/produtos/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

// Upload de imagem
app.post("/api/upload", upload.single("imagem"), (req, res) => {
  if (!req.file) return res.status(400).send("Nenhuma imagem enviada");
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Autenticação
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(401).send("Credenciais inválidas");

    const usuario = result.rows[0];
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).send("Credenciais inválidas");

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET);
    res.json({ token, usuario: { nome: usuario.nome, email: usuario.email } });
  } catch (error) {
    res.status(500).send("Erro no login");
  }
});

// Criar pedido
app.post("/api/pedidos", async (req, res) => {
  try {
    const { itens, cliente, endereco, frete, formaPagamento } = req.body;
    if (!cliente) return res.status(400).send("Cliente não enviado");

    const total = itens.reduce((acc, item) => acc + (Number(item.preco) * (item.quantidade || 1)), 0) + (frete || 0);

    const pedidoResult = await pool.query(
      `INSERT INTO pedidos (status, total, cliente_nome, cliente_email, cliente_telefone,
       endereco_cep, endereco_rua, endereco_numero, endereco_complemento,
       endereco_bairro, endereco_cidade, endereco_estado, frete, forma_pagamento)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      ["aguardando_pagamento", total, cliente.nome, cliente.email, cliente.telefone,
       endereco?.cep, endereco?.endereco, endereco?.numero, endereco?.complemento,
       endereco?.bairro, endereco?.cidade, endereco?.estado, frete || 0, formaPagamento]
    );

    const pedido = pedidoResult.rows[0];

    for (const item of itens) {
      const quantidade = item.quantidade || 1;
      await pool.query(
        "INSERT INTO pedido_itens (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1,$2,$3,$4)",
        [pedido.id, item.id, quantidade, item.preco]
      );
      await pool.query("UPDATE produtos SET estoque = estoque - $1 WHERE id = $2", [quantidade, item.id]);
    }

    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar pedido");
  }
});

// Admin - Produtos
app.get("/api/admin/produtos", verificarToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

// Admin - Pedidos
app.get("/api/admin/pedidos", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, cliente_nome, cliente_email, cliente_telefone, total, status, created_at as criado_em,
             endereco_cep, endereco_rua, endereco_numero, endereco_complemento,
             endereco_bairro, endereco_cidade, endereco_estado, frete, forma_pagamento
      FROM pedidos ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

nextApp.prepare().then(() => {
  // Todas as outras rotas vão para o Next.js
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`   Frontend: Next.js`);
    console.log(`   Backend API: /api/*`);
  });
});
