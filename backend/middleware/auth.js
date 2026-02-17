const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? null : "dev-secret-change-in-prod");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "6h";

// Email do único admin autorizado - ninguém mais pode acessar o painel
const ADMIN_EMAIL_UNICO = (process.env.ADMIN_EMAIL || "5704@emporiobothanico.com.br").toLowerCase().trim();

// Mapa para rastrear tentativas de login falhadas (por email)
const loginAttempts = new Map();
// Bloqueio por IP - proteção extra contra brute force
const ipBlockedUntil = new Map();
const MAX_LOGIN_ATTEMPTS = 4;
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutos de bloqueio
const MAX_IP_ATTEMPTS = 10; // 10 tentativas falhadas de qualquer email = bloqueia IP

function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}

function verificarTentativasLogin(email, req) {
  const now = Date.now();
  const ip = req ? getClientIp(req) : null;

  // Bloqueio por IP
  if (ip && ipBlockedUntil.get(ip) > now) {
    return {
      blocked: true,
      message: "Muitas tentativas de login deste IP. Acesso bloqueado temporariamente."
    };
  }

  const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: now, lockedUntil: 0, ipAttempts: {} };

  if (attempts.lockedUntil > now) {
    const minutesLeft = Math.ceil((attempts.lockedUntil - now) / 60000);
    return {
      blocked: true,
      message: `Conta temporariamente bloqueada. Tente novamente em ${minutesLeft} minutos.`
    };
  }

  if (now - attempts.firstAttempt > LOCKOUT_TIME) {
    attempts.count = 0;
    attempts.firstAttempt = now;
  }

  return { blocked: false, attempts };
}

function registrarTentativaFalha(email, req) {
  const now = Date.now();
  const ip = req ? getClientIp(req) : null;
  const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: now, lockedUntil: 0, ipAttempts: ip ? { [ip]: 0 } : {} };

  attempts.count += 1;
  if (ip) {
    attempts.ipAttempts = attempts.ipAttempts || {};
    attempts.ipAttempts[ip] = (attempts.ipAttempts[ip] || 0) + 1;
    // Contar total de falhas por IP em todos os emails
    let totalIp = 0;
    for (const e of loginAttempts.keys()) {
      const a = loginAttempts.get(e);
      if (a?.ipAttempts?.[ip]) totalIp += a.ipAttempts[ip];
    }
    totalIp += 1; // esta falha atual
    if (totalIp >= MAX_IP_ATTEMPTS) {
      ipBlockedUntil.set(ip, now + LOCKOUT_TIME);
    }
  }

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_TIME;
    loginAttempts.set(email, attempts);
    return { locked: true };
  }

  attempts.firstAttempt = attempts.firstAttempt || now;
  loginAttempts.set(email, attempts);
  return { locked: false };
}

function limparTentativas(email) {
  loginAttempts.delete(email);
}

function isAdminAutorizado(email) {
  return email && email.toLowerCase().trim() === ADMIN_EMAIL_UNICO;
}

function gerarToken(usuario) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não configurado. Defina a variável de ambiente.");
  }
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role || "admin"
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verificarToken(req, res, next) {
  if (!JWT_SECRET) {
    return res.status(500).json({ error: "Serviço temporariamente indisponível" });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expirado" });
      }
      return res.status(403).json({ error: "Token inválido" });
    }

    req.user = decoded;
    req.userId = decoded.id; // Adicionar userId
    next();
  });
}

// Middleware para verificar se é admin E se é o admin único autorizado
function verificarAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ error: "Acesso negado." });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
  // Camada extra: mesmo com role admin no token, só o admin autorizado tem acesso
  if (!isAdminAutorizado(req.user.email)) {
    return res.status(403).json({ error: "Acesso negado." });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarAdmin,
  verificarTentativasLogin,
  registrarTentativaFalha,
  limparTentativas,
  gerarToken,
  isAdminAutorizado,
  ADMIN_EMAIL_UNICO
};
