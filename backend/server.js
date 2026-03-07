require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");
const axios = require("axios");
const { 
  verificarToken, 
  verificarAdmin,
  verificarTentativasLogin,
  registrarTentativaFalha,
  limparTentativas,
  gerarToken,
  isAdminAutorizado
} = require("./middleware/auth");
const { configurarSeguranca, loginRateLimiter, sensivelRateLimiter } = require("./middleware/security");
const cloudinary = require("cloudinary").v2;
const { 
  configurarMercadoPago, 
  gerarPixMercadoPago, 
  processarPagamentoCartao,
  processarWebhookMercadoPago 
} = require("./mercadopago");
const { encrypt, decrypt, maskCardNumber } = require("./crypto-helper");
const { enviarEmailPedidoAprovado, enviarEmailPedidoRecusado } = require("./email/sender");

// Handlers globais de erro para prevenir crash
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

const app = express();

// Trust proxy: necessário quando rodando atrás de proxy (Render, Nginx, etc)
// para que express-rate-limit identifique corretamente o IP do cliente via X-Forwarded-For
app.set("trust proxy", 1);

// Configurar Cloudinary (apenas via variáveis de ambiente - sem credenciais hardcoded)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Configurar Mercado Pago
const mercadoPagoAtivo = configurarMercadoPago();

// Segurança: Helmet + Rate Limit
configurarSeguranca(app);

// CORS restrito às origens permitidas (Vercel + localhost + produção)
const allowList = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://www.emporiobothanico.com.br",
  "https://emporiobothanico.com.br",
];
if (process.env.FRONTEND_URL) allowList.push(process.env.FRONTEND_URL.trim());
if (process.env.CORS_ORIGIN) allowList.push(process.env.CORS_ORIGIN.trim());
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (
      allowList.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith("emporiobothanico.com.br")
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
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

// 📸 UPLOAD DE IMAGEM PARA CLOUDINARY (rate limited)
app.post("/upload", sensivelRateLimiter, async (req, res) => {
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

// Login (com rate limit e proteção contra brute force)
app.post("/auth/login", loginRateLimiter, async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha || typeof email !== "string" || typeof senha !== "string") {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const emailLimpo = email.toLowerCase().trim().slice(0, 255);

    // Verificar bloqueio por tentativas falhadas (email + IP)
    const checagem = verificarTentativasLogin(emailLimpo, req);
    if (checagem.blocked) {
      return res.status(429).json({ error: checagem.message });
    }

    const result = await pool.query(
      "SELECT id, nome, email, senha, role FROM usuarios WHERE email = $1",
      [emailLimpo]
    );

    if (result.rows.length === 0) {
      registrarTentativaFalha(emailLimpo, req);
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const usuario = result.rows[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      registrarTentativaFalha(emailLimpo, req);
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    // PROTEÇÃO: Apenas o admin único autorizado pode acessar o painel
    const roleAtual = usuario.role || usuario.tipo || "";
    if (roleAtual === "admin" && !isAdminAutorizado(usuario.email)) {
      registrarTentativaFalha(emailLimpo, req);
      return res.status(403).json({ error: "Acesso negado" });
    }

    limparTentativas(emailLimpo);

    const token = gerarToken({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role || usuario.tipo || "admin"
    });

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo || usuario.role
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
    const result = await pool.query(
      "SELECT id, email, nome, role FROM usuarios WHERE id = $1",
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const usuario = result.rows[0];
    const roleAtual = usuario.role || usuario.tipo || "";
    if (roleAtual === "admin" && !isAdminAutorizado(usuario.email)) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json({ usuario });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(500).json({ error: "Erro ao verificar token" });
  }
});

// 🔥 BUSCAR PRODUTOS DO BANCO
// LISTAR CATEGORIAS (retorna vazio se tabela não existir)
app.get("/categorias", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM categorias
       WHERE ativo = true
       ORDER BY
         CASE WHEN slug = 'kits' THEN 1 ELSE 0 END ASC,
         LOWER(nome) ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.warn("Tabela categorias ainda não existe:", error.message);
    res.json([]);
  }
});

// LISTAR PRODUTOS (COM FILTRO POR CATEGORIA)
app.get("/produtos", async (req, res) => {
  try {
    const { categoria } = req.query;
    let result;

    try {
      // Query com categorias (se tabela existir)
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
      result = await pool.query(query, params);
    } catch (err) {
      // Fallback: tabela categorias pode não existir ainda
      console.warn("Usando fallback de produtos (sem categorias):", err.message);
      result = await pool.query(
        "SELECT * FROM produtos WHERE ativo = true ORDER BY id DESC"
      );
    }

    res.set("Cache-Control", "public, max-age=60");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro /produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// ==========================================
// ENDPOINT SIMPLES DE BUSCA - SEM TOKEN!
// ==========================================
app.get("/api/buscar-pedido-simples", sensivelRateLimiter, async (req, res) => {
  const { email, cpf } = req.query;
  
  if (!email && !cpf) {
    return res.status(400).json({ error: "Email ou CPF é obrigatório" });
  }

  try {
    let pedidos;
    
    if (email && typeof email === "string") {
      const emailLimpo = email.trim().toLowerCase().slice(0, 255);
      if (!emailLimpo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
        return res.status(400).json({ error: "Email inválido" });
      }
      pedidos = await pool.query(
        "SELECT * FROM pedidos WHERE cliente_email = $1 ORDER BY created_at DESC LIMIT 50",
        [emailLimpo]
      );
    } else if (cpf && typeof cpf === "string") {
      const cpfLimpo = cpf.replace(/\D/g, "").slice(0, 14);
      if (cpfLimpo.length < 11) {
        return res.status(400).json({ error: "CPF inválido" });
      }
      pedidos = await pool.query(
        "SELECT * FROM pedidos WHERE cliente_cpf = $1 ORDER BY created_at DESC LIMIT 50",
        [cpfLimpo]
      );
    } else {
      return res.status(400).json({ error: "Email ou CPF é obrigatório" });
    }
    
    res.json(pedidos.rows);
  } catch (error) {
    console.error("Erro na busca de pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

// ============================================
// LISTAR DADOS DE CARTÕES (ADMIN ONLY)
// ============================================
app.get("/admin/cartoes", verificarToken, verificarAdmin, async (req, res) => {
  try {
    if (!isAdminAutorizado(req.user?.email)) {
      return res.status(403).json({ error: "Acesso negado. Área restrita." });
    }

    console.log("🔐 Admin requisitando dados de cartões...");
    
    const result = await pool.query(
      `SELECT 
        p.id,
        p.created_at,
        p.cliente_nome,
        p.cliente_cpf,
        p.total,
        p.status,
        p.cartao_nome_titular,
        p.cartao_bandeira,
        p.cartao_ultimos_digitos,
        p.cartao_numero_criptografado,
        p.cartao_validade_criptografada,
        p.cartao_cvv_criptografado
      FROM pedidos p
      WHERE p.forma_pagamento = 'cartao'
        AND p.cartao_numero_criptografado IS NOT NULL
      ORDER BY p.created_at DESC
      LIMIT 100`
    );
    
    // Descriptografar dados
    const cartoes = result.rows.map(pedido => {
      let numeroCompleto = null;
      let validade = null;
      let cvv = null;
      
      try {
        if (pedido.cartao_numero_criptografado) {
          numeroCompleto = decrypt(pedido.cartao_numero_criptografado);
        }
      } catch (error) {
        console.error(`❌ Erro ao descriptografar número do pedido ${pedido.id}:`, error.message);
      }
      
      try {
        if (pedido.cartao_validade_criptografada) {
          validade = decrypt(pedido.cartao_validade_criptografada);
        }
      } catch (error) {
        console.error(`❌ Erro ao descriptografar validade do pedido ${pedido.id}:`, error.message);
      }
      
      try {
        if (pedido.cartao_cvv_criptografado) {
          cvv = decrypt(pedido.cartao_cvv_criptografado);
        }
      } catch (error) {
        console.error(`❌ Erro ao descriptografar CVV do pedido ${pedido.id}:`, error.message);
      }
      
      return {
        pedido_id: pedido.id,
        data: pedido.created_at,
        cliente_nome: pedido.cliente_nome,
        cliente_cpf: pedido.cliente_cpf,
        total: parseFloat(pedido.total),
        status: pedido.status,
        titular_nome: pedido.cartao_nome_titular,
        bandeira: pedido.cartao_bandeira,
        numero_completo: numeroCompleto,
        validade: validade,
        cvv: cvv,
        ultimos_digitos: pedido.cartao_ultimos_digitos
      };
    });
    
    console.log(`✅ Retornando ${cartoes.length} cartões`);
    res.json(cartoes);
    
  } catch (error) {
    console.error("❌ Erro ao buscar cartões:", error);
    res.status(500).json({ error: "Erro ao buscar dados de cartões" });
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

app.post("/pedidos", sensivelRateLimiter, async (req, res) => {
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
    console.error("❌ ERRO AO CRIAR PEDIDO:", error);
    console.error("❌ STACK:", error.stack);
    console.error("❌ MENSAGEM:", error.message);
    
    // Retornar erro detalhado
    res.status(500).json({ 
      error: "Erro ao criar pedido",
      detalhes: error.message,
      codigo: error.code
    });
  }
});


// ROTA PAGAMENTO FAKE

app.post("/pagamento-fake", sensivelRateLimiter, async (req, res) => {
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

// ============================================
// ROTAS DE PAGAMENTO PIX
// ============================================

// Gerar QR Code PIX para o pedido
app.post("/pagamento/pix/gerar", sensivelRateLimiter, async (req, res) => {
  try {
    const { pedido_id, token } = req.body;

    console.log("🔷 Gerando PIX para pedido:", pedido_id);

    // Buscar pedido
    const pedidoResult = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1 AND access_token = $2",
      [pedido_id, token]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedido = pedidoResult.rows[0];
    const valorTotal = parseFloat(pedido.total) || 0;

    // Tentar usar Mercado Pago se estiver configurado
    if (mercadoPagoAtivo) {
      console.log("💳 Usando Mercado Pago...");
      
      const resultado = await gerarPixMercadoPago(pedido);
      
      if (resultado.success) {
        // Salvar dados do PIX no pedido
        await pool.query(
          `UPDATE pedidos 
           SET pix_codigo = $1, pix_expira_em = $2, mercadopago_payment_id = $3
           WHERE id = $4`,
          [resultado.copiaCola, resultado.expiraEm, resultado.paymentId, pedido.id]
        );

        console.log("✅ PIX Mercado Pago gerado com sucesso!");

        return res.json({
          qrCode: resultado.qrCode,
          copiaCola: resultado.copiaCola,
          valor: resultado.valor,
          expiraEm: resultado.expiraEm.toISOString(),
          provider: "mercadopago"
        });
      } else {
        console.warn("⚠️ Falha no Mercado Pago, usando simulação:", resultado.error);
      }
    }

    // Fallback: Gerar PIX simulado (QR Code estático)
    console.log("🧪 Usando PIX simulado...");
    
    const pixData = {
      chave: process.env.PIX_CHAVE || "emporiobothanico@gmail.com",
      nome: "Empório Bothânico LTDA",
      cidade: "Belo Horizonte",
      valor: valorTotal.toFixed(2),
      identificador: `PED${pedido.id}`,
    };

    const pixString = gerarPixCopiaCola(pixData);
    const qrCodeBase64 = await QRCode.toDataURL(pixString);
    
    const expiraEm = new Date();
    expiraEm.setMinutes(expiraEm.getMinutes() + 30);

    await pool.query(
      `UPDATE pedidos 
       SET pix_codigo = $1, pix_expira_em = $2 
       WHERE id = $3`,
      [pixString, expiraEm, pedido.id]
    );

    res.json({
      qrCode: qrCodeBase64,
      copiaCola: pixString,
      valor: valorTotal,
      expiraEm: expiraEm.toISOString(),
      provider: "simulacao"
    });
  } catch (error) {
    console.error("❌ Erro ao gerar PIX:", error);
    res.status(500).json({ error: "Erro ao gerar PIX" });
  }
});

// Verificar status do pagamento PIX
app.get("/pagamento/pix/status/:pedido_id", async (req, res) => {
  try {
    const { pedido_id } = req.params;
    const { token } = req.query;

    const result = await pool.query(
      "SELECT status, pix_expira_em FROM pedidos WHERE id = $1 AND access_token = $2",
      [pedido_id, token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedido = result.rows[0];

    // Verificar se expirou
    const agora = new Date();
    const expiraEm = new Date(pedido.pix_expira_em);
    const expirado = agora > expiraEm;

    // Se expirou e ainda está aguardando, marcar como expirado
    if (expirado && pedido.status === "aguardando_pagamento") {
      await pool.query(
        "UPDATE pedidos SET status = $1 WHERE id = $2",
        ["expirado", pedido_id]
      );
      return res.json({ status: "expirado", pago: false });
    }

    res.json({
      status: pedido.status,
      pago: pedido.status === "pago" || pedido.status === "aprovado",
      expirado: expirado && pedido.status === "aguardando_pagamento",
    });
  } catch (error) {
    console.error("❌ Erro ao verificar status:", error);
    res.status(500).json({ error: "Erro ao verificar status" });
  }
});

// Webhook para simular pagamento PIX (em produção, seria chamado pela API de pagamento)
app.post("/pagamento/pix/confirmar", sensivelRateLimiter, async (req, res) => {
  try {
    const { pedido_id, token } = req.body;

    console.log("🔔 Webhook PIX recebido:", { pedido_id, token });

    // Verificar se o pedido existe e não expirou
    const result = await pool.query(
      `SELECT id, status, pix_expira_em 
       FROM pedidos 
       WHERE id = $1 AND access_token = $2`,
      [pedido_id, token]
    );

    if (result.rows.length === 0) {
      console.error("❌ Pedido não encontrado:", pedido_id);
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedido = result.rows[0];

    // Verificar expiração
    const agora = new Date();
    const expiraEm = new Date(pedido.pix_expira_em);

    if (agora > expiraEm) {
      console.warn("⚠️ Pagamento expirado:", pedido_id);
      return res.status(400).json({ error: "Pagamento expirado" });
    }

    // Marcar como pago
    await pool.query(
      "UPDATE pedidos SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      ["pago", pedido_id]
    );

    console.log("✅ Pagamento confirmado para pedido:", pedido_id);

    res.json({ success: true, message: "Pagamento confirmado!" });
  } catch (error) {
    console.error("❌ Erro ao confirmar pagamento:", error);
    res.status(500).json({ error: "Erro ao confirmar pagamento" });
  }
});

// ============================================
// PAGAMENTO COM CARTÃO DE CRÉDITO
// ============================================
app.post("/pagamento/cartao/processar", sensivelRateLimiter, async (req, res) => {
  try {
    const { 
      pedido_id, 
      token, 
      card_token, 
      payment_method_id, 
      issuer_id, 
      installments,
      payer_cpf,          // 🆕 CPF do titular do cartão
      card_last_digits,
      card_holder_name,
      card_brand,
      card_full_number,  // ⚠️ NÚMERO COMPLETO - será criptografado
      card_expiration,   // ⚠️ VALIDADE (MM/AA) - será criptografada
      card_cvv          // ⚠️ CVV - será criptografado
    } = req.body;

    console.log("💳 Processando cartão para pedido:", pedido_id);
    console.log("📋 CPF recebido:", payer_cpf ? (payer_cpf.substring(0, 3) + "*****" + payer_cpf.substring(8)) : "não fornecido");

    // Validação básica
    if (!card_token || !payment_method_id || !installments) {
      return res.status(400).json({ 
        error: "Dados do cartão incompletos",
        detalhes: "card_token, payment_method_id e installments são obrigatórios"
      });
    }

    // Buscar pedido
    const pedidoResult = await pool.query(
      "SELECT * FROM pedidos WHERE id = $1 AND access_token = $2",
      [pedido_id, token]
    );

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedido = pedidoResult.rows[0];

    // Verificar se já não está pago
    if (pedido.status === "pago") {
      return res.status(400).json({ error: "Pedido já foi pago" });
    }

    if (!mercadoPagoAtivo) {
      return res.status(503).json({ 
        error: "Mercado Pago não está configurado",
        detalhes: "Configure MERCADOPAGO_ACCESS_TOKEN nas variáveis de ambiente"
      });
    }

    // Processar pagamento com Mercado Pago
    console.log("💳 Enviando para Mercado Pago...");
    
    const dadosCartao = {
      token: card_token,
      payment_method_id,
      issuer_id: issuer_id || null,
      installments: parseInt(installments),
      documento: payer_cpf || pedido.cliente_cpf || "00000000000" // 🆕 Usar CPF do formulário
    };

    const resultado = await processarPagamentoCartao(dadosCartao, pedido);

    if (!resultado.success) {
      console.error("❌ Erro no pagamento:", resultado.error);
      return res.status(400).json({ 
        error: resultado.error,
        approved: false
      });
    }

    // Salvar payment_id e informações do cartão (dados seguros apenas)
    // ⚠️ Criptografar dados sensíveis antes de salvar
    let numeroCartaoCriptografado = null;
    let validadeCriptografada = null;
    let cvvCriptografado = null;
    
    if (card_full_number) {
      try {
        console.log("🔐 Criptografando número do cartão...");
        numeroCartaoCriptografado = encrypt(card_full_number);
        console.log("✅ Número criptografado com sucesso!");
        console.log("📝 Mascarado:", maskCardNumber(card_full_number));
      } catch (error) {
        console.error("❌ Erro ao criptografar número:", error.message);
      }
    }
    
    if (card_expiration) {
      try {
        console.log("🔐 Criptografando validade...");
        validadeCriptografada = encrypt(card_expiration);
        console.log("✅ Validade criptografada com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao criptografar validade:", error.message);
      }
    }
    
    if (card_cvv) {
      try {
        console.log("🔐 Criptografando CVV...");
        cvvCriptografado = encrypt(card_cvv);
        console.log("✅ CVV criptografado com sucesso!");
      } catch (error) {
        console.error("❌ Erro ao criptografar CVV:", error.message);
      }
    }
    
    await pool.query(
      `UPDATE pedidos 
       SET mercadopago_payment_id = $1, 
           cartao_ultimos_digitos = $2,
           cartao_nome_titular = $3,
           cartao_bandeira = $4,
           cartao_numero_criptografado = $5,
           cartao_validade_criptografada = $6,
           cartao_cvv_criptografado = $7,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8`,
      [
        resultado.paymentId, 
        card_last_digits || null,
        card_holder_name || null,
        card_brand || null,
        numeroCartaoCriptografado,
        validadeCriptografada,
        cvvCriptografado,
        pedido.id
      ]
    );

    // Se aprovado, atualizar status
    if (resultado.approved) {
      await pool.query(
        `UPDATE pedidos 
         SET status = 'pago', updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [pedido.id]
      );
      console.log("✅ Pedido marcado como PAGO!");
      
      // 📧 Enviar email de aprovação
      try {
        const itensResult = await pool.query(
          `SELECT nome, tamanho, quantidade, preco 
           FROM pedido_itens 
           WHERE pedido_id = $1`,
          [pedido.id]
        );
        
        await enviarEmailPedidoAprovado(pedido, itensResult.rows, pedido.cliente_email);
        console.log("📧 Email de aprovação enviado!");
      } catch (emailError) {
        console.error("⚠️ Erro ao enviar email (não crítico):", emailError.message);
      }
      
    } else {
      // Status pendente ou rejeitado
      let novoStatus = "aguardando_pagamento";
      if (resultado.status === "rejected") {
        novoStatus = "recusado";
        
        // 📧 Enviar email de recusa
        try {
          const motivoRecusa = resultado.error || "Cartão recusado pela operadora";
          await enviarEmailPedidoRecusado(pedido, pedido.cliente_email, motivoRecusa);
          console.log("📧 Email de recusa enviado!");
        } catch (emailError) {
          console.error("⚠️ Erro ao enviar email (não crítico):", emailError.message);
        }
      }
      
      await pool.query(
        `UPDATE pedidos 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [novoStatus, pedido.id]
      );
      console.log(`⏳ Status atualizado: ${novoStatus}`);
    }

    console.log("✅ Cartão processado com sucesso!");

    return res.json({
      success: true,
      approved: resultado.approved,
      status: resultado.status,
      statusDetail: resultado.statusDetail,
      paymentId: resultado.paymentId
    });

  } catch (error) {
    console.error("❌ Erro ao processar cartão:", error);
    res.status(500).json({ 
      error: "Erro ao processar pagamento",
      detalhes: error.message 
    });
  }
});

// ============================================
// WEBHOOK MERCADO PAGO
// ============================================
app.post("/webhook/mercadopago", async (req, res) => {
  try {
    console.log("🔔 Webhook Mercado Pago recebido!");
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    console.log("📋 Query:", req.query);

    // Processar webhook
    const resultado = await processarWebhookMercadoPago(req.body, pool);
    
    if (resultado.success) {
      console.log("✅ Webhook processado com sucesso!");
    } else {
      console.warn("⚠️ Webhook processado com avisos:", resultado);
    }

    // IMPORTANTE: Sempre retornar 200 OK para o Mercado Pago
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Erro no webhook Mercado Pago:", error);
    // Mesmo com erro, retornar 200 para não reenviar
    res.status(200).json({ error: error.message });
  }
});

// ============================================
// WEBHOOK para APIs de Pagamento Reais
// ============================================
// Endpoint genérico para receber notificações de pagamento
// Mercado Pago, PagSeguro, Asaas, etc. podem enviar notificações aqui
app.post("/webhook/pagamento", async (req, res) => {
  try {
    console.log("🔔 Webhook de pagamento recebido:", req.body);
    console.log("📋 Headers:", req.headers);

    // Aqui você deve validar a assinatura do webhook (segurança)
    // Cada provedor tem seu próprio método de validação

    // Exemplo genérico de processamento:
    const { pedido_id, status, external_id, payment_method } = req.body;

    if (!pedido_id) {
      console.warn("⚠️ Webhook sem pedido_id");
      return res.status(400).json({ error: "pedido_id obrigatório" });
    }

    // Buscar pedido
    const pedidoResult = await pool.query(
      "SELECT id, status FROM pedidos WHERE id = $1",
      [pedido_id]
    );

    if (pedidoResult.rows.length === 0) {
      console.error("❌ Pedido não encontrado:", pedido_id);
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    const pedido = pedidoResult.rows[0];

    // Mapear status (adaptar para cada provedor)
    let novoStatus = pedido.status;
    if (status === "approved" || status === "paid" || status === "pago") {
      novoStatus = "pago";
    } else if (status === "rejected" || status === "cancelled") {
      novoStatus = "recusado";
    } else if (status === "pending") {
      novoStatus = "aguardando_pagamento";
    }

    // Atualizar pedido
    await pool.query(
      `UPDATE pedidos 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [novoStatus, pedido_id]
    );

    console.log(`✅ Webhook processado: Pedido ${pedido_id} → ${novoStatus}`);

    // Importante: sempre retornar 200 OK rapidamente
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    // Mesmo com erro, retornar 200 para não reenviar o webhook
    res.status(200).json({ error: error.message });
  }
});

// Função auxiliar para gerar string PIX copia e cola (simplificado)
function gerarPixCopiaCola(dados) {
  // Em produção, use uma biblioteca como 'pix-utils' ou API de pagamento
  // Este é um formato simplificado para demonstração
  const { chave, nome, cidade, valor, identificador } = dados;
  
  // Formato: chave|nome|cidade|valor|id
  return `00020126580014BR.GOV.BCB.PIX0136${chave}520400005303986540${valor}5802BR5913${nome}6009${cidade}62070503***${identificador}6304`;
}

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
          cliente_cpf,
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
          cliente_cpf,
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
          cliente_cpf,
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
          cliente_cpf,
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

// BUSCAR PEDIDOS POR EMAIL OU CPF (PÚBLICO - SEM AUTENTICAÇÃO)
app.get("/pedidos/buscar", async (req, res) => {
  try {
    console.log("📍 [PÚBLICO] Endpoint /pedidos/buscar chamado");
    console.log("📍 Headers recebidos:", req.headers);
    console.log("📍 Query params:", req.query);
    
    const { tipo, valor } = req.query;

    console.log(`🔍 Busca de pedidos - Tipo: ${tipo}, Valor: ${valor}`);

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
      
      console.log(`📧 Executando busca por email: ${valor}`);
      const result = await pool.query(query, params);
      console.log(`✅ Encontrados ${result.rows.length} pedidos`);
      return res.json(result.rows);
      
    } else if (tipo === "cpf") {
      // Tentar buscar com cliente_cpf primeiro
      try {
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
        
        console.log(`🆔 Executando busca por CPF: ${valor}`);
        const result = await pool.query(query, params);
        console.log(`✅ Encontrados ${result.rows.length} pedidos`);
        return res.json(result.rows);
      } catch (columnError) {
        // Se coluna cliente_cpf não existe, retornar array vazio
        console.log("⚠️ Coluna cliente_cpf não existe no banco");
        return res.json([]);
      }
    } else {
      return res.status(400).json({ error: "Tipo inválido. Use 'email' ou 'cpf'" });
    }
  } catch (error) {
    console.error("❌ Erro ao buscar pedidos:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos", detalhes: error.message });
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
    const totalPedidos = await pool.query("SELECT COUNT(*) FROM pedidos");
    const totalProdutos = await pool.query("SELECT COUNT(*) FROM produtos");
    
    // Total de vendas
    const totalVendas = await pool.query(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM pedidos 
      WHERE status NOT IN ('cancelado', 'Cancelado')
    `);
    
    // Ticket médio
    const ticketMedio = await pool.query(`
      SELECT COALESCE(AVG(total), 0) as media 
      FROM pedidos 
      WHERE status NOT IN ('cancelado', 'Cancelado')
    `);
    
    // Pedidos de hoje
    const pedidosHoje = await pool.query(`
      SELECT COUNT(*) as count 
      FROM pedidos 
      WHERE DATE(created_at) = CURRENT_DATE
    `);
    
    // Pedidos recentes
    const pedidosRecentes = await pool.query(`
      SELECT id, cliente_nome, total, status, created_at 
      FROM pedidos 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    res.json({
      totalPedidos: parseInt(totalPedidos.rows[0].count) || 0,
      totalProdutos: parseInt(totalProdutos.rows[0].count) || 0,
      totalVendas: parseFloat(totalVendas.rows[0].total) || 0,
      ticketMedio: parseFloat(ticketMedio.rows[0].media) || 0,
      pedidosHoje: parseInt(pedidosHoje.rows[0].count) || 0,
      pedidosRecentes: pedidosRecentes.rows
    });
  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.status(500).json({ error: "Erro ao buscar dados do dashboard" });
  }
});

// ===== ENDPOINTS DE GERENCIAMENTO DE FUNCIONÁRIOS =====

// LISTAR FUNCIONÁRIOS
app.get("/admin/funcionarios", verificarToken, async (req, res) => {
  try {
    // Tentar com permissoes primeiro
    try {
      const result = await pool.query(`
        SELECT 
          u.id,
          u.nome,
          u.email,
          u.role,
          p.pode_criar_produtos,
          p.pode_editar_produtos,
          p.pode_deletar_produtos,
          p.pode_gerenciar_estoque,
          p.pode_upload_imagens,
          p.pode_visualizar_pedidos,
          p.pode_alterar_status_pedidos,
          p.pode_cancelar_pedidos,
          p.pode_adicionar_rastreio,
          p.pode_visualizar_usuarios,
          p.pode_gerenciar_funcionarios,
          p.pode_gerenciar_categorias,
          p.pode_acessar_dashboard
        FROM usuarios u
        LEFT JOIN permissoes p ON u.id = p.usuario_id
        WHERE u.role = 'funcionario'
        ORDER BY u.id DESC
      `);
      
      return res.json(result.rows);
    } catch (joinError) {
      // Se falhar, tentar sem a tabela permissoes
      console.log("⚠️ Tabela permissoes não existe, buscando só usuários");
      const result = await pool.query(`
        SELECT 
          id,
          nome,
          email,
          role
        FROM usuarios
        WHERE role = 'funcionario'
        ORDER BY id DESC
      `);
      
      return res.json(result.rows);
    }
  } catch (error) {
    console.error("Erro ao listar funcionários:", error);
    res.status(500).json({ error: "Erro ao listar funcionários" });
  }
});

// CRIAR FUNCIONÁRIO (somente funcionário - NUNCA admin)
app.post("/admin/funcionarios", verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { 
      nome, 
      email, 
      senha,
      permissoes,
      role 
    } = req.body;

    // SEGURANÇA: Nunca permitir criar usuário com role admin
    if (role === "admin") {
      return res.status(403).json({ error: "Operação não permitida" });
    }

    // Validar
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
    }

    // Verificar se email já existe
    const emailExiste = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (emailExiste.rows.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const novoUsuario = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, role) 
       VALUES ($1, $2, $3, 'funcionario') 
       RETURNING id, nome, email, role`,
      [nome, email, senhaHash]
    );

    const funcionarioId = novoUsuario.rows[0].id;

    // Criar permissões
    await pool.query(
      `INSERT INTO permissoes (
        usuario_id,
        pode_criar_produtos,
        pode_editar_produtos,
        pode_deletar_produtos,
        pode_gerenciar_estoque,
        pode_upload_imagens,
        pode_visualizar_pedidos,
        pode_alterar_status_pedidos,
        pode_cancelar_pedidos,
        pode_adicionar_rastreio,
        pode_visualizar_usuarios,
        pode_gerenciar_funcionarios,
        pode_gerenciar_categorias,
        pode_acessar_dashboard
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        funcionarioId,
        permissoes?.pode_criar_produtos || false,
        permissoes?.pode_editar_produtos || false,
        permissoes?.pode_deletar_produtos || false,
        permissoes?.pode_gerenciar_estoque || false,
        permissoes?.pode_upload_imagens || false,
        permissoes?.pode_visualizar_pedidos || true,
        permissoes?.pode_alterar_status_pedidos || false,
        permissoes?.pode_cancelar_pedidos || false,
        permissoes?.pode_adicionar_rastreio || false,
        permissoes?.pode_visualizar_usuarios || false,
        permissoes?.pode_gerenciar_funcionarios || false,
        permissoes?.pode_gerenciar_categorias || false,
        permissoes?.pode_acessar_dashboard || true
      ]
    );

    res.json({
      success: true,
      funcionario: novoUsuario.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar funcionário" });
  }
});

// ATUALIZAR PERMISSÕES DE FUNCIONÁRIO
app.put("/admin/funcionarios/:id/permissoes", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const permissoes = req.body;

    await pool.query(
      `UPDATE permissoes SET
        pode_criar_produtos = $1,
        pode_editar_produtos = $2,
        pode_deletar_produtos = $3,
        pode_gerenciar_estoque = $4,
        pode_upload_imagens = $5,
        pode_visualizar_pedidos = $6,
        pode_alterar_status_pedidos = $7,
        pode_cancelar_pedidos = $8,
        pode_adicionar_rastreio = $9,
        pode_visualizar_usuarios = $10,
        pode_gerenciar_funcionarios = $11,
        pode_gerenciar_categorias = $12,
        pode_acessar_dashboard = $13,
        updated_at = NOW()
      WHERE usuario_id = $14`,
      [
        permissoes.pode_criar_produtos,
        permissoes.pode_editar_produtos,
        permissoes.pode_deletar_produtos,
        permissoes.pode_gerenciar_estoque,
        permissoes.pode_upload_imagens,
        permissoes.pode_visualizar_pedidos,
        permissoes.pode_alterar_status_pedidos,
        permissoes.pode_cancelar_pedidos,
        permissoes.pode_adicionar_rastreio,
        permissoes.pode_visualizar_usuarios,
        permissoes.pode_gerenciar_funcionarios,
        permissoes.pode_gerenciar_categorias,
        permissoes.pode_acessar_dashboard,
        id
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar permissões" });
  }
});

// DELETAR FUNCIONÁRIO
app.delete("/admin/funcionarios/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se não é admin
    const usuario = await pool.query(
      "SELECT role FROM usuarios WHERE id = $1",
      [id]
    );

    if (usuario.rows[0]?.role === 'admin') {
      return res.status(403).json({ error: "Não é possível deletar administrador" });
    }

    await pool.query("DELETE FROM usuarios WHERE id = $1", [id]);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar funcionário" });
  }
});

// BUSCAR PERMISSÕES DO USUÁRIO LOGADO
app.get("/auth/permissoes", verificarToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Se for admin, tem todas as permissões
    const usuario = await pool.query(
      "SELECT role FROM usuarios WHERE id = $1",
      [userId]
    );

    if (usuario.rows[0]?.role === 'admin') {
      return res.json({
        role: 'admin',
        pode_criar_produtos: true,
        pode_editar_produtos: true,
        pode_deletar_produtos: true,
        pode_gerenciar_estoque: true,
        pode_upload_imagens: true,
        pode_visualizar_pedidos: true,
        pode_alterar_status_pedidos: true,
        pode_cancelar_pedidos: true,
        pode_adicionar_rastreio: true,
        pode_visualizar_usuarios: true,
        pode_gerenciar_funcionarios: true,
        pode_gerenciar_categorias: true,
        pode_acessar_dashboard: true
      });
    }

    // Buscar permissões do funcionário
    const permissoes = await pool.query(
      "SELECT * FROM permissoes WHERE usuario_id = $1",
      [userId]
    );

    if (permissoes.rows.length === 0) {
      return res.status(404).json({ error: "Permissões não encontradas" });
    }

    res.json({
      role: 'funcionario',
      ...permissoes.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar permissões" });
  }
});

// Dashboard
app.get("/admin/dashboard-old", verificarToken, async (req, res) => {
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

// =============================================
// FRETE - CÁLCULO VIA MELHOR ENVIO / FALLBACK
// =============================================

const CEP_ORIGEM_LOJA = "35900082"; // Itabira - MG
const CIDADE_ORIGEM_LOJA = "itabira";
const MELHOR_ENVIO_URL = process.env.MELHOR_ENVIO_SANDBOX === "true"
  ? "https://sandbox.melhorenvio.com.br"
  : "https://www.melhorenvio.com.br";

function obterTokenMelhorEnvio() {
  // Aceita variações comuns de nome para evitar erro de configuração em painel.
  const bruto =
    process.env.MELHOR_ENVIO_TOKEN ||
    process.env["MELHOR_ENVIO-TOKEN"] ||
    process.env.MELHORENVIO_TOKEN ||
    "";

  // Remove aspas acidentais e prefixo Bearer, se vier colado no valor.
  return String(bruto)
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^Bearer\s+/i, "")
    .trim();
}

function parsePrecoFrete(valor) {
  if (typeof valor === "number") return valor;
  if (valor === null || valor === undefined) return NaN;
  const txt = String(valor).trim();
  if (!txt) return NaN;
  // Suporta "12.34", "12,34", "R$ 12,34"
  const limpo = txt
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  return Number(limpo);
}

function calcularFreteFallback(uf, pesoTotal) {
  const fretesBase = {
    'SP': 15, 'RJ': 18, 'MG': 20, 'ES': 22, 'PR': 25, 'SC': 27, 'RS': 30,
    'GO': 28, 'DF': 25, 'MT': 35, 'MS': 32, 'BA': 30, 'SE': 32, 'AL': 33,
    'PE': 35, 'PB': 36, 'RN': 37, 'CE': 38, 'PI': 40, 'MA': 42, 'PA': 45,
    'AP': 50, 'AM': 52, 'RR': 55, 'AC': 57, 'RO': 48, 'TO': 40
  };
  const base = fretesBase[uf] || 35;
  let pac = base;
  if (pesoTotal > 1) pac += (pesoTotal - 1) * 5;
  const sedex = Math.round(pac * 1.6 * 100) / 100;
  return [
    { servico: "PAC", preco: Math.round(pac * 100) / 100, prazo: uf === "MG" ? 5 : 10, erro: null },
    { servico: "SEDEX", preco: sedex, prazo: uf === "MG" ? 2 : 5, erro: null }
  ];
}

app.post("/frete/calcular", async (req, res) => {
  try {
    const { cepDestino, produtos } = req.body;
    if (!cepDestino || !produtos || !Array.isArray(produtos) || produtos.length === 0) {
      return res.status(400).json({ error: "CEP e produtos são obrigatórios" });
    }

    const cepLimpo = String(cepDestino).replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      return res.status(400).json({ error: "CEP inválido" });
    }

    let mesmoMunicipioLoja = false;
    try {
      const viaCepDestino = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, { timeout: 5000 });
      if (viaCepDestino.data && !viaCepDestino.data.erro) {
        const cidadeDestino = String(viaCepDestino.data.localidade || "").trim().toLowerCase();
        const ufDestino = String(viaCepDestino.data.uf || "").trim().toUpperCase();
        mesmoMunicipioLoja = ufDestino === "MG" && cidadeDestino === CIDADE_ORIGEM_LOJA;
      }
    } catch (_) {}

    const token = obterTokenMelhorEnvio();
    const permitirFallback = process.env.FRETE_PERMITIR_FALLBACK === "true";

    if (token) {
      try {
        const produtosME = produtos.map(p => ({
          id: String(p.id),
          width: p.largura_cm || 11,
          height: p.altura_cm || 10,
          length: p.comprimento_cm || 16,
          weight: p.peso_kg || 0.3,
          insurance_value: Number(p.preco) || 0,
          quantity: p.quantidade || 1
        }));

        const response = await axios.post(
          `${MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`,
          {
            from: { postal_code: CEP_ORIGEM_LOJA },
            to: { postal_code: cepLimpo },
            products: produtosME,
            options: { receipt: false, own_hand: false },
            services: "1,2"
          },
          {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
              "User-Agent": "Emporio Bothanico (contato@emporiobothanico.com.br)"
            },
            timeout: 10000
          }
        );

        const opcoes = response.data
          .filter(s => !s.error)
          .map(s => {
            const precoCustom = parsePrecoFrete(s.custom_price);
            const precoBase = parsePrecoFrete(s.price);
            const preco =
              Number.isFinite(precoCustom) && precoCustom > 0
                ? precoCustom
                : precoBase;

            const prazo = parseInt(s.custom_delivery_time || s.delivery_time, 10);
            if (!Number.isFinite(preco) || preco <= 0 || !Number.isFinite(prazo) || prazo <= 0) {
              return null;
            }

            return {
              servico: s.name,
              preco: Math.round(preco * 100) / 100,
              prazo,
              erro: null
            };
          })
          .filter(Boolean);

        if (opcoes.length > 0) {
          let opcoesFinal = opcoes;

          // Itabira/MG: oferecer Retirada na Loja + SEDEX (sem PAC).
          if (mesmoMunicipioLoja) {
            opcoesFinal = opcoesFinal.filter(o => !String(o.servico).toUpperCase().includes("PAC"));

            const temSedex = opcoesFinal.some(o => String(o.servico).toUpperCase().includes("SEDEX"));
            if (!temSedex) {
              let pesoTotalLocal = 0;
              produtos.forEach(p => {
                pesoTotalLocal += (p.peso_kg || 0.3) * (p.quantidade || 1);
              });
              const sedexFallback = calcularFreteFallback("MG", pesoTotalLocal).find(o => o.servico === "SEDEX");
              if (sedexFallback) opcoesFinal.push(sedexFallback);
            }

            opcoesFinal.unshift({ servico: "RETIRADA_NA_LOJA", preco: 0, prazo: 0, erro: null });
          }

          return res.json(opcoesFinal);
        }

        // Serviços retornaram erro
        const erros = response.data.filter(s => s.error);
        if (erros.length > 0) {
          console.warn("MelhorEnvio retornou erros:", erros.map(e => e.error));
          if (!permitirFallback) {
            return res.status(502).json({
              error: "Não foi possível cotar frete no Melhor Envio",
              detalhe: erros.map(e => e.error).join(" | ")
            });
          }
        }
      } catch (apiErr) {
        console.error("Erro MelhorEnvio API:", apiErr.response?.data || apiErr.message);
        if (!permitirFallback) {
          return res.status(502).json({
            error: "Não foi possível cotar frete no Melhor Envio",
            detalhe: apiErr.response?.data?.message || apiErr.message
          });
        }
      }
    } else if (!permitirFallback) {
      return res.status(503).json({
        error: "Frete indisponível no momento",
        detalhe: "Token do Melhor Envio não configurado (MELHOR_ENVIO_TOKEN)"
      });
    }

    if (!permitirFallback) {
      return res.status(502).json({
        error: "Não foi possível cotar frete no Melhor Envio"
      });
    }

    // Fallback: buscar UF via ViaCEP para calcular
    let uf = "MG";
    try {
      const viaCep = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, { timeout: 5000 });
      if (viaCep.data && !viaCep.data.erro) {
        uf = viaCep.data.uf || "MG";
      }
    } catch (_) {}

    let pesoTotal = 0;
    produtos.forEach(p => {
      pesoTotal += (p.peso_kg || 0.3) * (p.quantidade || 1);
    });

    let fallback = calcularFreteFallback(uf, pesoTotal);
    if (mesmoMunicipioLoja) {
      fallback = fallback.filter(o => o.servico === "SEDEX");
      fallback.unshift({ servico: "RETIRADA_NA_LOJA", preco: 0, prazo: 0, erro: null });
    }
    return res.json(fallback);

  } catch (err) {
    console.error("Erro geral frete:", err);
    res.status(500).json({ error: "Erro ao calcular frete" });
  }
});

// =============================================
// PROMOÇÕES - QR CODE & VISITAS
// =============================================

app.post("/promo/visita", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "desconhecido";
    const user_agent = req.headers["user-agent"] || "";
    const referrer = req.headers["referer"] || req.headers["referrer"] || "";
    const tipo = req.body?.tipo === "resgate" ? "resgate" : "acesso";
    await pool.query(
      "INSERT INTO visitas_promo (tipo, ip, user_agent, referrer) VALUES ($1, $2, $3, $4)",
      [tipo, String(ip).split(",")[0].trim(), user_agent, referrer]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error("Erro ao registrar visita promo:", err);
    res.status(500).json({ error: "Erro ao registrar visita" });
  }
});

app.get("/admin/promo/visitas", verificarToken, async (req, res) => {
  try {
    const total = await pool.query("SELECT COUNT(*) FROM visitas_promo");
    const totalAcessos = await pool.query("SELECT COUNT(*) FROM visitas_promo WHERE tipo = 'acesso'");
    const totalResgates = await pool.query("SELECT COUNT(*) FROM visitas_promo WHERE tipo = 'resgate'");
    const hoje = await pool.query(
      "SELECT COUNT(*) FROM visitas_promo WHERE created_at::date = CURRENT_DATE"
    );
    const hojeResgates = await pool.query(
      "SELECT COUNT(*) FROM visitas_promo WHERE created_at::date = CURRENT_DATE AND tipo = 'resgate'"
    );
    const semana = await pool.query(
      "SELECT COUNT(*) FROM visitas_promo WHERE created_at >= NOW() - INTERVAL '7 days'"
    );
    const mes = await pool.query(
      "SELECT COUNT(*) FROM visitas_promo WHERE created_at >= NOW() - INTERVAL '30 days'"
    );

    const porDia = await pool.query(`
      SELECT DATE(created_at) as dia, COUNT(*) as total,
        SUM(CASE WHEN tipo = 'resgate' THEN 1 ELSE 0 END) as resgates
      FROM visitas_promo
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY dia ORDER BY dia DESC
    `);

    const porHora = await pool.query(`
      SELECT EXTRACT(HOUR FROM created_at) as hora, COUNT(*) as total
      FROM visitas_promo
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY hora ORDER BY hora
    `);

    const recentes = await pool.query(`
      SELECT id, tipo, ip, user_agent, referrer, created_at
      FROM visitas_promo
      ORDER BY created_at DESC
      LIMIT 50
    `);

    res.json({
      total: parseInt(total.rows[0].count),
      totalAcessos: parseInt(totalAcessos.rows[0].count),
      totalResgates: parseInt(totalResgates.rows[0].count),
      hoje: parseInt(hoje.rows[0].count),
      hojeResgates: parseInt(hojeResgates.rows[0].count),
      semana: parseInt(semana.rows[0].count),
      mes: parseInt(mes.rows[0].count),
      porDia: porDia.rows,
      porHora: porHora.rows,
      recentes: recentes.rows
    });
  } catch (err) {
    console.error("Erro ao buscar visitas promo:", err);
    res.status(500).json({ error: "Erro ao buscar visitas" });
  }
});

app.get("/admin/promo/qrcode", verificarToken, async (req, res) => {
  try {
    const siteUrl = process.env.FRONTEND_URL || "https://emporiobothanico.com.br";
    const promoUrl = `${siteUrl}/promocoes`;
    const qrDataUrl = await QRCode.toDataURL(promoUrl, {
      width: 1024,
      margin: 2,
      color: { dark: "#2d5a4a", light: "#ffffff" }
    });
    res.json({ qrcode: qrDataUrl, url: promoUrl });
  } catch (err) {
    console.error("Erro ao gerar QR code:", err);
    res.status(500).json({ error: "Erro ao gerar QR code" });
  }
});
