const pool = require("../db");
const cache = require("./cache");

const CACHE_TTL_MS = 60_000;
const QUERY_RETRIES = 3;
const QUERY_RETRY_DELAY_MS = 400;

async function queryWithRetry(text, params = []) {
  let lastError;
  for (let attempt = 1; attempt <= QUERY_RETRIES; attempt++) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      lastError = err;
      if (attempt < QUERY_RETRIES) {
        await new Promise((r) => setTimeout(r, QUERY_RETRY_DELAY_MS * attempt));
      }
    }
  }
  throw lastError;
}

async function pingDatabase() {
  const result = await queryWithRetry("SELECT 1 AS ok");
  return result.rows[0]?.ok === 1;
}

async function listarCategorias() {
  const cacheKey = "catalogo:categorias";
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const result = await queryWithRetry(
      `SELECT * FROM categorias
       WHERE ativo = true
       ORDER BY
         CASE WHEN slug = 'kits' THEN 1 ELSE 0 END ASC,
         LOWER(nome) ASC`
    );
    cache.set(cacheKey, result.rows, CACHE_TTL_MS);
    return result.rows;
  } catch (err) {
    console.warn("listarCategorias:", err.message);
    return [];
  }
}

async function listarProdutos({ categoria, comEstoque = false } = {}) {
  const cacheKey = `catalogo:produtos:${categoria || "todos"}:${comEstoque ? "estoque" : "todos"}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  let rows;
  try {
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
    if (comEstoque) {
      query += " AND COALESCE(p.estoque, 0) > 0";
    }
    query += " ORDER BY p.id DESC";
    const result = await queryWithRetry(query, params);
    rows = result.rows;
  } catch (err) {
    console.warn("listarProdutos fallback:", err.message);
    let fallback = "SELECT * FROM produtos WHERE ativo = true";
    const params = [];
    if (comEstoque) {
      fallback += " AND COALESCE(estoque, 0) > 0";
    }
    fallback += " ORDER BY id DESC";
    const result = await queryWithRetry(fallback, params);
    rows = result.rows;
  }

  cache.set(cacheKey, rows, CACHE_TTL_MS);
  return rows;
}

async function buscarCatalogo({ categoria, includeCategorias = true, includeProdutos = true, comEstoque = false } = {}) {
  const cacheKey = `catalogo:full:${categoria || "todos"}:${includeCategorias}:${includeProdutos}:${comEstoque}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const [categorias, produtos] = await Promise.all([
    includeCategorias ? listarCategorias() : Promise.resolve([]),
    includeProdutos ? listarProdutos({ categoria, comEstoque }) : Promise.resolve([]),
  ]);

  const payload = { categorias, produtos };
  cache.set(cacheKey, payload, CACHE_TTL_MS);
  return payload;
}

async function buscarProdutoPorId(id) {
  const cacheKey = `catalogo:produto:${id}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const result = await queryWithRetry(
      `SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug
       FROM produtos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       WHERE p.id = $1 AND p.ativo = true`,
      [id]
    );
    const produto = result.rows[0] || null;
    if (produto) cache.set(cacheKey, produto, CACHE_TTL_MS);
    return produto;
  } catch (err) {
    console.warn("buscarProdutoPorId fallback:", err.message);
    const result = await queryWithRetry(
      "SELECT * FROM produtos WHERE id = $1 AND ativo = true",
      [id]
    );
    return result.rows[0] || null;
  }
}

function invalidarCacheCatalogo() {
  cache.invalidatePrefix("catalogo:");
}

module.exports = {
  pingDatabase,
  listarCategorias,
  listarProdutos,
  buscarCatalogo,
  buscarProdutoPorId,
  invalidarCacheCatalogo,
  queryWithRetry,
};
