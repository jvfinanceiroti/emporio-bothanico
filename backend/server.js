const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API Loja rodando 🚀");
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

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
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
        descricao,
        preco,
        custo,
        sku,
        peso_kg,
        altura_cm,
        largura_cm,
        comprimento_cm
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
    const { itens, cliente } = req.body;

    if (!cliente) {
      return res.status(400).send("Cliente não enviado");
    }

    const total = itens.reduce(
      (acc, item) => acc + Number(item.preco),
      0
    );

    const pedidoResult = await pool.query(
      `INSERT INTO pedidos
      (status, total, cliente_nome, cliente_email, cliente_telefone)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        "aguardando_pagamento",
        total,
        cliente.nome || null,
        cliente.email || null,
        cliente.telefone || null,
      ]
    );

    const pedido = pedidoResult.rows[0];

for (const item of itens) {

  // salva item do pedido
  await pool.query(
    `INSERT INTO pedido_itens
    (pedido_id, produto_id, quantidade, preco_unitario)
    VALUES ($1,$2,$3,$4)`,
    [pedido.id, item.id, 1, item.preco]
  );

  // baixa estoque
  await pool.query(
    "UPDATE produtos SET estoque = estoque - 1 WHERE id = $1",
    [item.id]
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

app.get("/admin/pedidos", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        cliente_nome,
        total,
        status,
        created_at
      FROM pedidos
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao listar pedidos");
  }
});

app.get("/admin/pedidos/:id", async (req, res) => {
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
// atualizar status 
app.get("/admin/dashboard", async (req, res) => {
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
app.get("/admin/produtos", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produtos ORDER BY id DESC"
  );
  res.json(result.rows);
});
///criar produto

app.get("/admin/produtos", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM produtos ORDER BY id DESC"
  );
  res.json(result.rows);
});
// editar produto
app.put("/admin/produtos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, preco, estoque } = req.body;

  await pool.query(
    `UPDATE produtos
     SET nome=$1, preco=$2, estoque=$3
     WHERE id=$4`,
    [nome, preco, estoque, id]
  );

  res.json({ ok: true });
});

// deletar produto
app.delete("/admin/produtos/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query(
    "DELETE FROM produtos WHERE id=$1",
    [id]
  );

  res.json({ ok: true });
});
