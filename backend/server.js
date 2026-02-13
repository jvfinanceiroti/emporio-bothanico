const express = require("express");
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "emporio-bothanico-secret-key-2026";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Apenas imagens são permitidas!"));
    }
  }
});


app.get("/", (req, res) => {
  res.send("API Loja rodando 🚀");
});

// ========== AUTENTICAÇÃO ==========

// Middleware para verificar token
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Verificar token (para validar sessão)
app.get("/auth/verificar", verificarToken, async (req, res) => {
  try {
    console.log("Verificando usuário ID:", req.userId);
    const result = await pool.query(
      "SELECT id, email, nome, tipo FROM usuarios WHERE id = $1",
      [req.userId]
    );

    console.log("Resultado query:", result.rows);

    if (result.rows.length === 0) {
      console.log("Usuário não encontrado no banco");
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    console.log("Usuário autenticado:", result.rows[0].email);
    res.json({ usuario: result.rows[0] });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(500).json({ error: "Erro ao verificar token" });
  }
});

// 🔥 BUSCAR PRODUTOS DO BANCO
app.get("/produtos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM produtos");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar produtos");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// 🔥 CRIAR PRODUTO
app.post("/produtos", async (req, res) => {
  try {
    const {
      nome,
      descricao,
      preco,
      custo,
      sku,
      peso_kg,
      altura_cm,
      largura_cm,
      comprimento_cm
    } = req.body;

    const result = await pool.query(
      `INSERT INTO produtos
      (nome, descricao, preco, custo, sku, peso_kg, altura_cm, largura_cm, comprimento_cm)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        nome,
        descricao || null,
        preco,
        custo || null,
        sku || null,
        peso_kg || null,
        altura_cm || null,
        largura_cm || null,
        comprimento_cm || null
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar produto");
  }
});

// ROTA PRODUTO ID

app.get("/produtos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM produtos WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar produto");
  }
});


/// ROTA DE CRIAR PEDIDO

app.post("/pedidos", async (req, res) => {
  try {
  	console.log("BODY RECEBIDO:", req.body);
    console.log("ITENS DO PEDIDO:", JSON.stringify(req.body.itens, null, 2));
    const { itens, cliente, endereco, frete, formaPagamento } = req.body;

    if (!cliente) {
      return res.status(400).send("Cliente não enviado");
    }

    const total = itens.reduce(
      (acc, item) => acc + (Number(item.preco) * (item.quantidade || 1)),
      0
    ) + (frete || 0);

    const pedidoResult = await pool.query(
      `INSERT INTO pedidos
      (status, total, cliente_nome, cliente_email, cliente_telefone,
       endereco_cep, endereco_rua, endereco_numero, endereco_complemento,
       endereco_bairro, endereco_cidade, endereco_estado, frete, forma_pagamento)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *`,
      [
        "aguardando_pagamento",
        total,
        cliente.nome || null,
        cliente.email || null,
        cliente.telefone || null,
        endereco?.cep || null,
        endereco?.endereco || null,
        endereco?.numero || null,
        endereco?.complemento || null,
        endereco?.bairro || null,
        endereco?.cidade || null,
        endereco?.estado || null,
        frete || 0,
        formaPagamento || null
      ]
    );

    const pedido = pedidoResult.rows[0];

for (const item of itens) {
  const quantidade = item.quantidade || 1;

  // salva item do pedido
  await pool.query(
    `INSERT INTO pedido_itens
    (pedido_id, produto_id, quantidade, preco_unitario)
    VALUES ($1,$2,$3,$4)`,
    [pedido.id, item.id, quantidade, item.preco]
  );

  // baixa estoque
  await pool.query(
    "UPDATE produtos SET estoque = estoque - $1 WHERE id = $2",
    [quantidade, item.id]
  );

}


    res.json(pedido);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar pedido");
  }
});


// ROTA PAGAMENTO FAKE

app.post("/pagamento-fake", async (req, res) => {
  try {
    const { pedido_id, aprovado } = req.body;

    await pool.query(
      "UPDATE pedidos SET status = $1 WHERE id = $2",
      [aprovado ? "pago" : "recusado", pedido_id]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro pagamento fake");
  }
});

// PEDIDOS POR ID 

app.get("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar pedido");
  }
});

// LISTAR PEDIDOS ADMIN

app.get("/admin/pedidos", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        cliente_nome,
        cliente_email,
        cliente_telefone,
        total,
        status,
        created_at as criado_em,
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
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

app.get("/admin/pedidos/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1",
      [id]
    );

    const itens = await pool.query(`
      SELECT
        pi.*,
        p.nome
      FROM pedido_itens pi
      JOIN produtos p ON p.id = pi.produto_id
      WHERE pi.pedido_id = $1
    `, [id]);

    res.json({
      pedido: pedido.rows[0],
      itens: itens.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro detalhe pedido");
  }
});

// Listar usuários (exceto administradores)
app.get("/admin/usuarios", verificarToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nome,
        email,
        role,
        criado_em
      FROM usuarios
      WHERE role != 'admin'
      ORDER BY criado_em DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao listar usuários");
  }
});

// Dashboard
app.get("/admin/dashboard", verificarToken, async (req, res) => {
  try {

    const totalVendas = await pool.query(`
      SELECT COALESCE(SUM(total),0) as total
      FROM pedidos
      WHERE status = 'pago'
    `);

    const totalPedidos = await pool.query(`
      SELECT COUNT(*) FROM pedidos
    `);

    const pedidosHoje = await pool.query(`
      SELECT COUNT(*) FROM pedidos
      WHERE created_at::date = CURRENT_DATE
    `);

    const ticketMedio = await pool.query(`
      SELECT COALESCE(AVG(total),0) as avg
      FROM pedidos
      WHERE status = 'pago'
    `);

    res.json({
      totalVendas: totalVendas.rows[0].total,
      totalPedidos: totalPedidos.rows[0].count,
      pedidosHoje: pedidosHoje.rows[0].count,
      ticketMedio: ticketMedio.rows[0].avg
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro dashboard");
  }
});

// 30 dias

app.get("/admin/dashboard/vendas-30dias", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        DATE(created_at) as dia,
        COALESCE(SUM(total),0) as total
      FROM pedidos
      WHERE
        status = 'pago'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY dia
      ORDER BY dia
    `);

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro vendas 30 dias");
  }
});
app.get("/admin/dashboard/vendas-30dias", async (req, res) => {
  try {

    const result = await pool.query(`
      SELECT
        DATE(created_at) as dia,
        SUM(total) as total
      FROM pedidos
      WHERE
        status = 'pago'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY dia
      ORDER BY dia
    `);

    const dadosBanco = result.rows;

    // CRIA ARRAY 30 DIAS COMPLETO
    const dias = [];

    for (let i = 29; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);

      const diaFormatado = data.toISOString().split("T")[0];

      const achado = dadosBanco.find(d =>
        d.dia.toISOString().split("T")[0] === diaFormatado
      );

      dias.push({
        dia: diaFormatado,
        total: achado ? Number(achado.total) : 0
      });
    }

    res.json(dias);

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro vendas 30 dias");
  }
});

// listar produto
app.get("/admin/produtos", verificarToken, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produtos ORDER BY id DESC"
  );
  res.json(result.rows);
});

// UPLOAD DE IMAGEM
app.post("/upload", verificarToken, upload.single("imagem"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Nenhum arquivo enviado");
    }
    
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao fazer upload");
  }
});

// criar produto admin
app.post("/admin/produtos", verificarToken, async (req, res) => {
  try {
    const { nome, preco, estoque, imagem_url, peso_kg, altura_cm, largura_cm, comprimento_cm } = req.body;

    const result = await pool.query(
      `INSERT INTO produtos 
       (nome, descricao, preco, custo, sku, peso_kg, altura_cm, largura_cm, comprimento_cm, estoque, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        nome, 
        null, 
        preco, 
        null, 
        null, 
        peso_kg || null, 
        altura_cm || null, 
        largura_cm || null, 
        comprimento_cm || null, 
        estoque,
        imagem_url || null
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro ao criar produto", details: error.message });
  }
});
// editar produto
app.put("/admin/produtos/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, estoque, imagem_url, peso_kg, altura_cm, largura_cm, comprimento_cm } = req.body;

    await pool.query(
      `UPDATE produtos
       SET nome=$1, preco=$2, estoque=$3, imagem_url=$4, peso_kg=$5, altura_cm=$6, largura_cm=$7, comprimento_cm=$8
       WHERE id=$9`,
      [nome, preco, estoque, imagem_url || null, peso_kg || null, altura_cm || null, largura_cm || null, comprimento_cm || null, id]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Erro ao editar produto:", error);
    res.status(500).json({ error: "Erro ao editar produto", details: error.message });
  }
});

// alternar status ativo/inativo
app.patch("/admin/produtos/:id/status", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body;

    await pool.query(
      "UPDATE produtos SET ativo=$1 WHERE id=$2",
      [ativo, id]
    );

    res.json({ ok: true });
  } catch (error) {
    console.error("Erro ao alterar status:", error);
    res.status(500).json({ error: "Erro ao alterar status" });
  }
});

// deletar produto
app.delete("/admin/produtos/:id", verificarToken, async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM produtos WHERE id=$1",
    [id]
  );

  res.json({ ok: true });
});
