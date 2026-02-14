const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? null : "dev-secret-change-in-prod");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "8h";

// Mapa para rastrear tentativas de login falhadas
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

function verificarTentativasLogin(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: now, lockedUntil: 0 };

  // Verificar se ainda está bloqueado
  if (attempts.lockedUntil > now) {
    const minutesLeft = Math.ceil((attempts.lockedUntil - now) / 60000);
    return {
      blocked: true,
      message: `Conta temporariamente bloqueada. Tente novamente em ${minutesLeft} minutos.`
    };
  }

  // Resetar contador se passou mais de 15 minutos desde a primeira tentativa
  if (now - attempts.firstAttempt > LOCKOUT_TIME) {
    attempts.count = 0;
    attempts.firstAttempt = now;
  }

  return { blocked: false, attempts };
}

function registrarTentativaFalha(email) {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: now, lockedUntil: 0 };
  
  attempts.count += 1;
  
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_TIME;
    loginAttempts.set(email, attempts);
    return {
      locked: true,
      message: `Muitas tentativas falhadas. Conta bloqueada por 15 minutos.`
    };
  }

  attempts.firstAttempt = attempts.firstAttempt || now;
  loginAttempts.set(email, attempts);
  
  return {
    locked: false,
    remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count
  };
}

function limparTentativas(email) {
  loginAttempts.delete(email);
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

// Middleware para verificar se é admin
function verificarAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }
  next();
}

module.exports = {
  verificarToken,
  verificarAdmin,
  verificarTentativasLogin,
  registrarTentativaFalha,
  limparTentativas,
  gerarToken
};
