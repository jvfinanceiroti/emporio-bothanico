// =============================================
// HELPER DE CRIPTOGRAFIA PARA DADOS SENSÍVEIS
// ⚠️ USO SOB PRÓPRIA RESPONSABILIDADE
// =============================================

const crypto = require('crypto');

// Algoritmo AES-256-GCM (padrão militar)
const ALGORITHM = 'aes-256-gcm';

// Chave de criptografia (DEVE estar nas variáveis de ambiente)
// Gere uma chave: node -e "console.log(crypto.randomBytes(32).toString('hex'))"
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  
  if (!key) {
    console.error("❌ ERRO CRÍTICO: ENCRYPTION_KEY não configurada!");
    throw new Error("Chave de criptografia não encontrada");
  }
  
  if (key.length !== 64) { // 32 bytes em hex = 64 caracteres
    console.error("❌ ERRO: ENCRYPTION_KEY deve ter 64 caracteres (32 bytes em hex)");
    throw new Error("Chave de criptografia inválida");
  }
  
  return Buffer.from(key, 'hex');
};

/**
 * Criptografa um texto usando AES-256-GCM
 * @param {string} text - Texto a ser criptografado
 * @returns {string} - Texto criptografado em formato: iv:authTag:encrypted
 */
function encrypt(text) {
  try {
    if (!text) return null;
    
    const key = getEncryptionKey();
    
    // Gerar IV (Initialization Vector) aleatório
    const iv = crypto.randomBytes(16);
    
    // Criar cipher
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    // Criptografar
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Obter auth tag (para GCM)
    const authTag = cipher.getAuthTag();
    
    // Retornar: iv:authTag:encrypted (tudo em hex)
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
    
  } catch (error) {
    console.error("❌ Erro ao criptografar:", error.message);
    throw new Error("Falha na criptografia");
  }
}

/**
 * Descriptografa um texto criptografado com AES-256-GCM
 * @param {string} encryptedText - Texto no formato iv:authTag:encrypted
 * @returns {string} - Texto original
 */
function decrypt(encryptedText) {
  try {
    if (!encryptedText) return null;
    
    const key = getEncryptionKey();
    
    // Separar iv:authTag:encrypted
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      throw new Error("Formato de texto criptografado inválido");
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    // Criar decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);
    
    // Descriptografar
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
    
  } catch (error) {
    console.error("❌ Erro ao descriptografar:", error.message);
    throw new Error("Falha na descriptografia");
  }
}

/**
 * Mascara um número de cartão (mostra apenas últimos 4 dígitos)
 * @param {string} cardNumber - Número do cartão
 * @returns {string} - Ex: "**** **** **** 1234"
 */
function maskCardNumber(cardNumber) {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\D/g, '');
  const lastFour = cleaned.slice(-4);
  
  return `**** **** **** ${lastFour}`;
}

/**
 * Gera uma nova chave de criptografia (use para criar ENCRYPTION_KEY)
 */
function generateEncryptionKey() {
  const key = crypto.randomBytes(32).toString('hex');
  console.log("🔑 Nova chave de criptografia gerada:");
  console.log(key);
  console.log("\n⚠️  Adicione nas variáveis de ambiente:");
  console.log(`ENCRYPTION_KEY=${key}`);
  return key;
}

module.exports = {
  encrypt,
  decrypt,
  maskCardNumber,
  generateEncryptionKey
};
