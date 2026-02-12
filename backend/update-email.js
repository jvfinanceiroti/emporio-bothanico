const pool = require('./db');
const bcrypt = require('bcrypt');

async function atualizarEmail() {
  try {
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    await pool.query(
      'UPDATE usuarios SET email = $1, senha = $2 WHERE email = $3',
      ['admin@emporio.com.br', senhaHash, 'admin@emporio.com']
    );
    
    console.log('✓ Email atualizado para: admin@emporio.com.br');
    console.log('Senha: admin123');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await pool.end();
  }
}

atualizarEmail();
