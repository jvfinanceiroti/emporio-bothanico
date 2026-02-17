/**
 * Middleware de segurança para a API
 * - Helmet: headers de segurança HTTP
 * - Rate limit: proteção contra brute force
 * - CORS: restrição de origens permitidas
 */

const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Origens permitidas (Vercel + localhost para dev)
const getCorsOrigins = () => {
  const origins = ["http://localhost:3000", "http://127.0.0.1:3000"];
  const frontendUrl = process.env.FRONTEND_URL || process.env.CORS_ORIGIN;
  if (frontendUrl) {
    origins.push(frontendUrl);
    const url = new URL(frontendUrl);
    if (url.origin !== frontendUrl) origins.push(url.origin);
  }
  // Vercel preview URLs
  if (process.env.VERCEL_URL) {
    origins.push(`https://${process.env.VERCEL_URL}`);
    origins.push(`https://*.vercel.app`);
  }
  return origins;
};

// Rate limit geral - 100 req/15min por IP
const geralRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para login - 5 tentativas por 15 min por IP
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Muitas tentativas de login. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit para endpoints sensíveis (pedidos, pagamento)
const sensivelRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: { error: "Limite de requisições excedido. Aguarde um momento." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configurar Helmet (headers de segurança)
const helmetOptions = {
  contentSecurityPolicy: false, // Desabilitar CSP para evitar conflitos com APIs externas
  crossOriginEmbedderPolicy: false,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  xssFilter: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
};

function configurarSeguranca(app) {
  app.use(helmet(helmetOptions));
  app.use(geralRateLimiter);
}

module.exports = {
  configurarSeguranca,
  loginRateLimiter,
  sensivelRateLimiter,
  getCorsOrigins,
};
