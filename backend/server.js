const express = require("express");
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const { 
  verificarToken, 
  verificarAdmin,
  verificarTentativasLogin,
  registrarTentativaFalha,
  limparTentativas,
  gerarToken,
  JWT_SECRET
} = require("./middleware/auth");
const cloudinary = require("cloudinary").v2;

const app = express();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "root",
  api_key: process.env.CLOUDINARY_API_KEY || "629775744341559",
  api_secret: process.env.CLOUDINARY_API_SECRET || "IACl75fZDlj66c44Us981JkWDi0"
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
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

// 📸 UPLOAD DE IMAGEM PARA CLOUDINARY
app.post("/upload", async (req, res) => {
  try {
    const { imagem } = req.body; // Base64 da imagem

    if (!imagem) {
      return res.status(400).json({ error: "Nenhuma imagem fornecida" });
    }

    // Upload para Cloudinary
    const resultado = await cloudinary.uploader.upload(imagem, {
      folder: "emporio-bothanico",
      resource_type: "auto"
    });

    res.json({ 
      url: resultado.secure_url,
      public_id: resultado.public_id
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    res.status(500).json({ error: "Erro ao fazer upload da imagem" });
  }
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
// LISTAR CATEGORIAS
app.get("/categorias", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categorias WHERE ativo = true ORDER BY nome ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao listar categorias");
  }
});

// LISTAR PRODUTOS (COM FILTRO POR CATEGORIA)
app.get("/produtos", async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = `
      SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.ativo = true
    `;
    
    const params = [];
    
    if (categoria) {
      query += " AND c.slug = $1";
      params.push(categoria);
    }
    
    query += " ORDER BY p.id DESC";
    
    const result = await pool.query(query, params);
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

    // Gerar token de acesso único
    const crypto = require('crypto');
    const accessToken = crypto.randomBytes(32).toString('hex');

    const pedidoResult = await pool.query(
      `INSERT INTO pedidos
      (status, total, cliente_nome, cliente_email, cliente_telefone, cliente_cpf,
       endereco_cep, endereco_rua, endereco_numero, endereco_complemento,
       endereco_bairro, endereco_cidade, endereco_estado, frete, forma_pagamento, access_token)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *`,
      [
        "aguardando_pagamento",
        total,
        cliente.nome || null,
        cliente.email || null,
        cliente.telefone || null,
        cliente.cpf || null,
        endereco?.cep || null,
        endereco?.endereco || null,
        endereco?.numero || null,
        endereco?.complemento || null,
        endereco?.bairro || null,
        endereco?.cidade || null,
        endereco?.estado || null,
        frete || 0,
        formaPagamento || null,
        accessToken
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


    // Retornar pedido com token de acesso
    res.json({
      ...pedido,
      access_token: accessToken
    });
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

// BUSCAR PEDIDO POR ID E TOKEN (PÚBLICO - PARA PÁGINA DE SUCESSO)
app.get("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    // Exigir token de acesso
    if (!token) {
      return res.status(401).json({ error: "Token de acesso não fornecido" });
    }

    const result = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1 AND access_token = $2",
      [id, token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado ou token inválido" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao buscar pedido");
  }
});

// LISTAR PEDIDOS ADMIN

app.get("/admin/pedidos", verificarToken, async (req, res) => {
  try {
    // Tentar com codigo_rastreio primeiro
    let result;
    try {
      result = await pool.query(`
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
          forma_pagamento,
          codigo_rastreio
        FROM pedidos
        ORDER BY created_at DESC
      `);
    } catch (columnError) {
      // Se falhar, buscar sem codigo_rastreio
      console.log("Coluna codigo_rastreio não existe, buscando sem ela");
      result = await pool.query(`
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
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

app.get("/admin/pedidos/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    let pedido;
    try {
      // Tentar buscar com codigo_rastreio
      pedido = await pool.query(
        `SELECT 
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
          forma_pagamento,
          codigo_rastreio
        FROM pedidos 
        WHERE id = $1`,
        [id]
      );
    } catch (columnError) {
      // Se falhar, buscar sem codigo_rastreio
      console.log("Coluna codigo_rastreio não existe, buscando sem ela");
      pedido = await pool.query(
        `SELECT 
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
        WHERE id = $1`,
        [id]
      );
    }

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

// ATUALIZAR STATUS DO PEDIDO
app.put("/admin/pedidos/:id/status", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, codigo_rastreio } = req.body;

    // Tentar com codigo_rastreio e updated_at primeiro
    try {
      await pool.query(
        `UPDATE pedidos 
         SET status = $1, codigo_rastreio = $2, updated_at = NOW() 
         WHERE id = $3`,
        [status, codigo_rastreio || null, id]
      );
    } catch (columnError) {
      // Se falhar, atualizar apenas o status
      console.log("Colunas codigo_rastreio/updated_at não existem, atualizando apenas status");
      await pool.query(
        `UPDATE pedidos SET status = $1 WHERE id = $2`,
        [status, id]
      );
    }

    res.json({ success: true, message: "Status atualizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar status do pedido" });
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

// ===== ENDPOINTS PÚBLICOS PARA CLIENTES =====

// BUSCAR PEDIDOS POR EMAIL OU CPF
app.get("/pedidos/buscar", async (req, res) => {
  try {
    const { tipo, valor } = req.query;

    if (!tipo || !valor) {
      return res.status(400).json({ error: "Tipo e valor são obrigatórios" });
    }

    let query;
    let params;

    if (tipo === "email") {
      query = `
        SELECT 
          id, cliente_nome, cliente_email, cliente_telefone, 
          total, status, created_at as criado_em,
          forma_pagamento
        FROM pedidos 
        WHERE LOWER(cliente_email) = LOWER($1)
        ORDER BY created_at DESC
      `;
      params = [valor];
    } else if (tipo === "cpf") {
      query = `
        SELECT 
          id, cliente_nome, cliente_email, cliente_telefone, 
          total, status, created_at as criado_em,
          forma_pagamento
        FROM pedidos 
        WHERE cliente_cpf = $1
        ORDER BY created_at DESC
      `;
      params = [valor];
    } else {
      return res.status(400).json({ error: "Tipo inválido. Use 'email' ou 'cpf'" });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// DETALHES COMPLETOS DO PEDIDO (PÚBLICO)
app.get("/pedidos/:id/detalhes", async (req, res) => {
  try {
    const { id } = req.params;

    let pedido;
    try {
      pedido = await pool.query(
        `SELECT 
          id, cliente_nome, cliente_email, cliente_telefone,
          total, status, created_at as criado_em,
          endereco_cep, endereco_rua, endereco_numero,
          endereco_complemento, endereco_bairro,
          endereco_cidade, endereco_estado,
          frete, forma_pagamento, codigo_rastreio
        FROM pedidos 
        WHERE id = $1`,
        [id]
      );
    } catch (columnError) {
      // Se falhar (codigo_rastreio não existe), buscar sem essa coluna
      pedido = await pool.query(
        `SELECT 
          id, cliente_nome, cliente_email, cliente_telefone,
          total, status, created_at as criado_em,
          endereco_cep, endereco_rua, endereco_numero,
          endereco_complemento, endereco_bairro,
          endereco_cidade, endereco_estado,
          frete, forma_pagamento
        FROM pedidos 
        WHERE id = $1`,
        [id]
      );
    }

    if (pedido.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const itens = await pool.query(
      `SELECT 
        pi.id, pi.produto_id, pi.quantidade, pi.preco_unitario,
        p.nome
      FROM pedido_itens pi
      JOIN produtos p ON p.id = pi.produto_id
      WHERE pi.pedido_id = $1`,
      [id]
    );

    res.json({
      pedido: pedido.rows[0],
      itens: itens.rows
    });
  } catch (error) {
    console.error("Erro ao buscar detalhes do pedido:", error);
    res.status(500).json({ error: "Erro ao buscar detalhes do pedido" });
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
    const { nome, descricao, preco, estoque, imagem_url, peso_kg, altura_cm, largura_cm, comprimento_cm } = req.body;

    const result = await pool.query(
      `INSERT INTO produtos 
       (nome, descricao, preco, custo, sku, peso_kg, altura_cm, largura_cm, comprimento_cm, estoque, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        nome, 
        descricao || null, 
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
    const { nome, descricao, preco, estoque, imagem_url, peso_kg, altura_cm, largura_cm, comprimento_cm } = req.body;

    await pool.query(
      `UPDATE produtos
       SET nome=$1, descricao=$2, preco=$3, estoque=$4, imagem_url=$5, peso_kg=$6, altura_cm=$7, largura_cm=$8, comprimento_cm=$9
       WHERE id=$10`,
      [nome, descricao || null, preco, estoque, imagem_url || null, peso_kg || null, altura_cm || null, largura_cm || null, comprimento_cm || null, id]
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
